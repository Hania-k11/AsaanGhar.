// utils/postProcessNLP.js


/**
 * Post-processes parsed NLP output into a clean, normalized object.
 *
 * This version includes significant improvements:
 * - More robust date handling (e.g., "next Tuesday", "in a couple of months", "3rd Feb", partial dates).
 * - Comprehensive numeric parsing for ranges, fractions, and different locales/units.
 * - Enhanced radius extraction to support more units (meters, feet) and vague terms ("couple of km").
 * - Improved nearby count extraction with broader number and comparator support.
 * - Refactored amenity/nearby logic to be more precise and less prone to false positives.
 * - Added basic internationalization for currencies and units.
 * - Increased robustness and safety against ReDoS and mutation issues.
 * - Minor performance optimizations and clearer code structure.
 */

const { utcToZonedTime, zonedTimeToUtc } = require("date-fns-tz");

const {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  endOfWeek,
  endOfMonth,
  endOfYear,
  isValid,
  parseISO,
  format,
  parse,
  isMatch,
} = require("date-fns");



/**
 * @typedef {{min?: number|string, max?: number|string}} Range
 * @typedef {{
 * debug?: boolean,
 * weekStartsOn?: 0|1|2|3|4|5|6,
 * defaultVagueRadiusKm?: number,
 * preferMaxDistanceForRanges?: boolean,
 * speedsKmph?: { walking?: number, driving?: number, cycling?: number, transit?: number },
 * locale?: string,
 * timezone?: string,
 * normalize?: { dedupe?: boolean, lowercase?: boolean, trim?: boolean }
 * }} PostProcessOptions
 */

/** Defaults and constants */
const DEFAULTS = {
  debug: process.env.DEBUG_POSTPROCESS === "1",
  locale: "en-US",
  timezone: "UTC", // Sensible default, but ideally user's timezone
  weekStartsOn: 1, // Monday
  defaultVagueRadiusKm: 1,
  preferMaxDistanceForRanges: true,
  speedsKmph: {
    walking: 5, // ~12 min/km
    driving: 30, // urban average
    cycling: 15,
    transit: 25,
  },
  normalize: {
    dedupe: true,
    lowercase: true,
    trim: true,
  },
};

const LISTING_TYPE_HINTS =
  /\b(rent|rental|lease|to\s*let|for\s*rent|buy|purchase|sell|sale|for\s*sale|kiray?e?\s*pe?|kiraya|bechna|khar[ei]dna|khareedna|kharidna)\b/i;

const VAGUE_RADIUS_TERMS = [
  "walking distance",
  "walkable",
  "nearby",
  "near me",
  "close by",
  "close to",
  "near",
  "in vicinity",
  "few minutes away",
  "around the corner",
  "couple of km",
  "few miles",
  "half a kilometre",
];

// Pre-compiled regex for efficiency
const NEARBY_PHRASING_REGEX =
  /\b(nearby|near|close to|within|walking distance to|near me|in vicinity of)\b/i;

// Memoized synonym map for performance
const SYNONYM_MAP = (() => {
  const map = new Map();
  const synonyms = {
    gym: ["gymnasium"],
    mosque: ["masjid"],
    supermarket: ["super market", "grocery store"],
    mall: ["shopping mall"],
    "train station": ["railway station"],
    metro: ["subway"],
    "bus stop": ["busstation", "bus stand"],
    hospital: ["hospitales"], // Basic plural support
    apartment: ["apartments"],
    flat: ["flats"],
    office: ["offices"],
  };

  for (const [canonical, variations] of Object.entries(synonyms)) {
    map.set(canonical, canonical);
    variations.forEach((v) => map.set(v, canonical));
  }
  return map;
})();

const NEARBY_CANDIDATES = new Set([
  "mosque",
  "masjid",
  "temple",
  "church",
  "gym",
  "school",
  "college",
  "university",
  "hospital",
  "clinic",
  "park",
  "garden",
  "market",
  "supermarket",
  "grocery",
  "mall",
  "metro",
  "subway",
  "train station",
  "railway station",
  "bus stop",
  "airport",
  "bank",
  "atm",
  "office",
  "pharmacy",
  "restaurant",
  "bar",
  "cafe",
  "coffee shop",
]);

/** Location alias map */
const LOCATION_ALIASES = {
  jauhar: "Gulistan-e-Johar",
  johor: "Gulistan-e-Johar",
  joht: "Gulistan-e-Johar",
  jouhar: "Gulistan-e-Johar",
  johar: "Gulistan-e-Johar",
  johour: "Gulistan-e-Johar",
  johr: "Gulistan-e-Johar",
  gulshan: "Gulshan-e-Iqbal",
  dha: "DHA",
  defense: "DHA",
  defence: "DHA",
  defen: "DHA",
  scheme33: "Scheme 33",
  pechs: "PECHS",
  pchs: "PECHS",
  phs: "PECHS",
};

/** Normalize location string using aliases */
const normalizeLocation = (loc) => {
  if (!loc || typeof loc !== "string") return loc;
  const n = loc.trim().toLowerCase();
  return LOCATION_ALIASES[n] || loc;
};

/** Location alias map */
const PROPERTYTYPE_ALIASES = {
  house: "HOUSE",
  apartment: "APARTMENT",
  flat: "APARTMENT",
  room: "ROOM",
  commercial: "COMMERCIAL",
  shop: "SHOP",
  warehouse: "WAREHOUSE",
    storage: "WAREHOUSE",
  office: "OFFICE",
   work: "OFFICE",
   'work place': "OFFICE"
};

/** Normalize location string using aliases */
function normalizepropertytype(input) {
  if (!input) return null;
  const key = input.toLowerCase().trim();
  return PROPERTYTYPE_ALIASES[key] || null;
}

const AMENITIES_ALIASES = {
  parking: "Parking",
  balcony: "Balcony",
   terrace: "Balcony",
  gym: "Gym",
  swimmingpool: "SwimmingPool",
  petfriendly: "PetFriendly",
  pet: "PetFriendly",
  laundryinunit: "LaundryInUnit",
  dishwasher: "Dishwasher",
  ac: "AirConditioning",
  heater: "Heating",
  security: "Security",
  gatedcommunity: "GatedCommunity",
  public_transport_access: "publicTransportAccess"
};

/** Normalize location string using aliases */
function normalizeamnities(input) {
  if (!input) return null;
  const key = input.toLowerCase().trim();
  return AMENITIES_ALIASES[key] || null;
}

/** Utils */

const roundTo = (num, decimals = 2) => {
  if (typeof num !== "number" || isNaN(num)) return num;
  const p = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * p) / p;
};

const normalizeString = (s) => {
  if (s == null) return "";
  const str = String(s).replace(/\s+/g, " ").trim();
  return str.toLowerCase();
};

const applySynonyms = (s) => {
  const n = normalizeString(s);
  return SYNONYM_MAP.get(n) || n;
};

const normalizeArray = (arr, opts = DEFAULTS.normalize) => {
  if (!Array.isArray(arr)) {
    if (typeof arr === "string") arr = [arr];
    else return [];
  }
  const normalized = arr
    .map((v) => (opts.trim ? String(v).trim() : String(v)))
    .filter(Boolean)
    .map((v) => (opts.lowercase ? v.toLowerCase() : v))
    .map(applySynonyms);

  return opts.dedupe ? Array.from(new Set(normalized)) : normalized;
};

const isRangeObject = (obj) =>
  obj && typeof obj === "object" && ("min" in obj || "max" in obj);

const parseNumberLike = (value) => {
  if (value == null) return NaN;
  if (typeof value === "number") return value;

  let s = String(value).toLowerCase().trim();

  // Handle common western (100,000) and Indian (1,00,000) comma formats
  s = s.replace(/(\d),(\d)/g, "$1$2");
  // Handle European decimal comma
  s = s.replace(/(\d+),(\d+)/, "$1.$2");
  // Remove other non-numeric non-dot characters
  s = s.replace(/[^a-z0-9.]/g, "");

  // Currency symbols
  s = s.replace(/(₹|rs\.?|Pkr|Rs|\$|usd|eur|¥|£|₩|chf)/g, "");

  // Fractions
  const fractionMatch = s.match(/(\d+)\/(\d+)/);
  if (fractionMatch) {
    const numerator = parseFloat(fractionMatch[1]);
    const denominator = parseFloat(fractionMatch[2]);
    return numerator / denominator;
  }

  if (s.includes("half")) return 0.5;
  if (s.includes("quarter")) return 0.25;

  // Words like 'hundred', 'thousand'
  const wordMultipliers = {
    hundred: 1e2,
    thousand: 1e3,
    million: 1e6,
    billion: 1e9,
  };
  for (const word in wordMultipliers) {
    if (s.endsWith(word)) {
      const num = parseFloat(s.replace(word, ""));
      return isNaN(num) ? wordMultipliers[word] : num * wordMultipliers[word];
    }
  }

  // Units and common shortcuts
  const unitMultipliers = [
    { re: /(crores?|cr)\.?$/i, mult: 1e7 },
    { re: /(lakhs?|lacs?|lk|l)\.?$/i, mult: 1e5 },
    { re: /k$/i, mult: 1e3 },
    { re: /m(n)?$/i, mult: 1e6 },
    { re: /bn$/i, mult: 1e9 },
  ];

  for (const { re, mult } of unitMultipliers) {
    if (re.test(s)) {
      const num = parseFloat(s.replace(re, ""));
      return isNaN(num) ? NaN : num * mult;
    }
  }

  // Exponent
  const scientific = parseFloat(s);
  if (scientific.toString() === s) return scientific;

  // Final parseFloat
  const num = parseFloat(s);
  return isNaN(num) ? NaN : num;
};

const normalizeRange = (range) => {
  if (!isRangeObject(range)) {
    // Handle stringified ranges like "10-15k"
    if (typeof range === "string") {
      const parts = range.split(/\s*-\s*|\s*to\s*/);
      if (parts.length === 2) {
        const min = parseNumberLike(parts[0]);
        const max = parseNumberLike(parts[1]);
        if (!isNaN(min) && !isNaN(max)) {
          return { min, max };
        }
      }
    }
    return range;
  }

  // Deep copy to prevent mutation leaks
  const out = JSON.parse(JSON.stringify(range));

  if ("min" in out) {
    const n = parseNumberLike(out.min);
    if (!isNaN(n)) out.min = n;
  }
  if ("max" in out) {
    const n = parseNumberLike(out.max);
    if (!isNaN(n)) out.max = n;
  }

  // Ensure min is less than max
  if (
    typeof out.min === "number" &&
    typeof out.max === "number" &&
    out.min > out.max
  ) {
    [out.min, out.max] = [out.max, out.min];
  }
  return out;
};

const clampYear = (year) => {
  if (typeof year !== "number") return year;
  const now = new Date();
  const max = now.getFullYear() + 2;
  const min = 1800;
  return Math.max(min, Math.min(max, year));
};

/** Date helpers */

const safeFormatDate = (date) => {
  if (!(date instanceof Date) || !isValid(date)) return null;
  return format(date, "yyyy-MM-dd");
};

const tryParseToISODateString = (str, opts) => {
  const now = zonedTimeToUtc(new Date(), opts.timezone);

  // Weekday references like "next Tuesday"
  const weekdayMatch = str.match(
    /\b(next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i
  );
  if (weekdayMatch) {
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const targetDay = daysOfWeek.indexOf(weekdayMatch[2].toLowerCase());
    if (targetDay !== -1) {
      let result = addDays(now, 1);
      while (result.getDay() !== targetDay) {
        result = addDays(result, 1);
      }
      if (weekdayMatch[1]) {
        // "next"
        result = addWeeks(result, 1);
      }
      return safeFormatDate(result);
    }
  }

  // Ordinal dates like "3rd Feb"
  const ordinalMatch = str.match(
    /(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i
  );
  if (ordinalMatch) {
    const day = ordinalMatch[1];
    const month = ordinalMatch[2];
    const year = now.getFullYear();
    const dateStr = `${day} ${month} ${year}`;
    if (isMatch(dateStr, "d MMM yyyy")) {
      const date = parse(dateStr, "d MMM yyyy", now);
      return safeFormatDate(date);
    }
  }

  // Partial dates like "May 2025"
  const partialMatch = str.match(
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})/i
  );
  if (partialMatch) {
    const dateStr = `1 ${partialMatch[1]} ${partialMatch[2]}`;
    if (isMatch(dateStr, "d MMM yyyy")) {
      const date = parse(dateStr, "d MMM yyyy", now);
      return safeFormatDate(date);
    }
  }

  // Fallback to parseISO and native Date parser
  const iso = parseISO(str);
  if (isValid(iso)) return safeFormatDate(iso);

  const d = new Date(str);
  if (isValid(d)) return safeFormatDate(d);

  return null;
};

const convertToDate = (str, options = {}) => {
  if (!str || typeof str !== "string") return str;
  const opts = { ...DEFAULTS, ...options };
  const now = utcToZonedTime(new Date(), opts.timezone);
const lower = str.toLowerCase().trim().replace(/[.,]/g, "");


  // Immediate / ASAP
  if (
    /\b(immediate|immediately|asap|as soon as possible|right away|urgent)\b/.test(
      lower
    )
  ) {
    return safeFormatDate(now);
  }

  if (/\b(today)\b/.test(lower)) return safeFormatDate(now);
  if (/\b(tomorrow)\b/.test(lower)) return safeFormatDate(addDays(now, 1));
  if (/\b(day after tomorrow|dat)\b/.test(lower))
    return safeFormatDate(addDays(now, 2));

  // Week/Month/Year references
  if (/\b(next\s+week)\b/.test(lower)) return safeFormatDate(addWeeks(now, 1));
  if (/\b(next\s+month)\b/.test(lower))
    return safeFormatDate(addMonths(now, 1));
  if (/\b(next\s+year)\b/.test(lower)) return safeFormatDate(addYears(now, 1));

  // "in N days/weeks/months" and vague timeframes
const timeMatch = lower.match(
  /\b(in|within)\s+((?:a\s+couple\s+of|few|\d+\.?\d*))\s*(day|week|month|year)s?\b/i
);

if (timeMatch) {
  const num =
    ["a couple of", "couple of", "few"].includes(timeMatch[2])
      ? 3
      : parseFloat(timeMatch[2]);

  const unit = timeMatch[3];
  if (!isNaN(num)) {
    if (unit === "day") return safeFormatDate(addDays(now, num));
    if (unit === "week") return safeFormatDate(addWeeks(now, num));
    if (unit === "month") return safeFormatDate(addMonths(now, num));
    if (unit === "year") return safeFormatDate(addYears(now, num));
  }
}

  // --- Robust: handle 'after N days', 'move in N days', 'move after N days', etc. ---
  const robustPatterns = [
    // after/move in/move after/available in/available after N days/weeks/months/years
    /\b(?:after|move in|move after|available in|available after)\s+(a|an|\d+)\s*(day|week|month|year)s?\b/i,
    // in N days/weeks/months/years
    /\b(in)\s+(a|an|\d+)\s*(day|week|month|year)s?\b/i,
    // N days/weeks/months/years
    /\b(a|an|\d+)\s*(day|week|month|year)s?\b/i
  ];
  for (const pattern of robustPatterns) {
    const m = lower.match(pattern);
    if (m) {
      let num = m[1];
      if (num === 'a' || num === 'an') num = 1;
      else num = parseInt(num, 10);
      const unit = m[2] || m[3];
      if (!isNaN(num)) {
        if (unit.startsWith('day')) return safeFormatDate(addDays(now, num));
        if (unit.startsWith('week')) return safeFormatDate(addWeeks(now, num));
        if (unit.startsWith('month')) return safeFormatDate(addMonths(now, num));
        if (unit.startsWith('year')) return safeFormatDate(addYears(now, num));
      }
    }
  }

  // --- Fallback: direct patterns like "2 days", "3 weeks", etc. ---
  const directTimeMatch = lower.match(/^(\d+)\s*(day|week|month|year)s?$/i);
  if (directTimeMatch) {
    const num = parseInt(directTimeMatch[1], 10);
    const unit = directTimeMatch[2];
    if (!isNaN(num)) {
      if (unit === "day") return safeFormatDate(addDays(now, num));
      if (unit === "week") return safeFormatDate(addWeeks(now, num));
      if (unit === "month") return safeFormatDate(addMonths(now, num));
      if (unit === "year") return safeFormatDate(addYears(now, num));
    }
  }


  // EOW/EOM/EOY (end of next week/month also handled)
  if (/\b(eow|end of( the)?( current)? week)\b/.test(lower))
    return safeFormatDate(endOfWeek(now, { weekStartsOn: opts.weekStartsOn }));
  if (/\b(end of next week)\b/.test(lower))
    return safeFormatDate(
      endOfWeek(addWeeks(now, 1), { weekStartsOn: opts.weekStartsOn })
    );
  if (/\b(eom|end of( the)? month)\b/.test(lower))
    return safeFormatDate(endOfMonth(now));
  if (/\b(end of next month)\b/.test(lower))
    return safeFormatDate(endOfMonth(addMonths(now, 1)));
  if (/\b(eoy|end of( the)? year)\b/.test(lower))
    return safeFormatDate(endOfYear(now));

  // If it's a recognizable date string, format it
  const direct = tryParseToISODateString(str, opts);
  if (direct) return direct;

  // Finally, unknown — return as-is
  return str;
};

/** Radius extraction */

const extractRadiusInKm = (text, opts = {}) => {
  if (!text || typeof text !== "string") return null;
  const lower = text.toLowerCase();
  const speeds = { ...DEFAULTS.speedsKmph, ...(opts.speedsKmph || {}) };
  const allRadii = [];

  const processMatch = (match, multiplier = 1, unit = "km") => {
    const a = parseFloat(match[1]);
    const b = match[3] ? parseFloat(match[3]) : null;
    let val = b
      ? opts.preferMaxDistanceForRanges ?? DEFAULTS.preferMaxDistanceForRanges
        ? Math.max(a, b)
        : (a + b) / 2
      : a;
    val *= multiplier;
    if (unit === "mi") val *= 1.60934;
    if (unit === "ft") val *= 0.0003048;
    if (unit === "m") val *= 0.001;
    return roundTo(val, 2);
  };

  // Regex to match numbers, ranges, fractions and units (using a safer, non-alternation-heavy pattern)
  // Anchoring the regex to a word boundary (\b) and being more specific with units helps mitigate ReDoS.
  const distanceRegex =
    /\b(\d+(?:\.\d+)?|\d+\/\d+|(?:half|quarter))(?:\s*-\s*|\s*to\s*)?(\d+(?:\.\d+)?|\d+\/\d+)?\s*(k?m|kilometers?|kilometres?|mi|miles?|foot|feet|ft|meter|meters|metre|metres|m|yard|yards)\b/g;
  let match;
  while ((match = distanceRegex.exec(lower)) !== null) {
    const rawVal1 = match[1];
    const rawVal2 = match[2];
    let val1 = parseNumberLike(rawVal1);
    let val2 = rawVal2 ? parseNumberLike(rawVal2) : null;
    const unit = match[3].toLowerCase();

    const val = val2
      ? opts.preferMaxDistanceForRanges ?? DEFAULTS.preferMaxDistanceForRanges
        ? Math.max(val1, val2)
        : (val1 + val2) / 2
      : val1;

    let km = val;
    if (unit.startsWith("mi")) km *= 1.60934;
    else if (unit.startsWith("m")) km *= 0.001;
    else if (unit.startsWith("f") || unit.startsWith("y")) km = val * 0.0009144; // Approx ft to km

    allRadii.push(roundTo(km, 2));
  }

  // Time-based (minutes/hours) with mode (walk/drive/cycle)
  const timeRegex =
    /\b(\d+(?:\.\d+)?|\d+\/\d+|(?:half|quarter))(?:\s*-\s*|\s*to\s*)?(\d+(?:\.\d+)?|\d+\/\d+)?\s*(minutes?|mins?|hours?|hrs?|hr|h)\b[^.]*?\b(walk(?:ing)?|on\s*foot|drive|driving|by\s*car|car|cycle|cycling|bike|biking|scooter|transit|metro|train|e-scooter)\b/g;
  while ((match = timeRegex.exec(lower)) !== null) {
    const rawVal1 = match[1];
    const rawVal2 = match[2];
    let val1 = parseNumberLike(rawVal1);
    let val2 = rawVal2 ? parseNumberLike(rawVal2) : null;
    const unit = match[3];
    const modeRaw = match[4];

    const timeVal = val2
      ? opts.preferMaxDistanceForRanges ?? DEFAULTS.preferMaxDistanceForRanges
        ? Math.max(val1, val2)
        : (val1 + val2) / 2
      : val1;
    const minutes = /hour|hr|h/.test(unit) ? timeVal * 60 : timeVal;

    let mode = "driving";
    if (/walk|foot/.test(modeRaw)) mode = "walking";
    else if (/cycle|bike/.test(modeRaw) || /scooter|e-scooter/.test(modeRaw))
      mode = "cycling";
    else if (/transit|metro|train/.test(modeRaw)) mode = "transit";

    const speed = speeds[mode] || speeds.driving;
    const km = (speed / 60) * minutes;
    allRadii.push(roundTo(km, 2));
  }

  if (allRadii.length > 0) {
    // Return the most specific (e.g., first) or a combined value if needed
    return allRadii[0];
  }

  // Vague terms fallback
  if (VAGUE_RADIUS_TERMS.some((term) => lower.includes(term))) {
    return DEFAULTS.defaultVagueRadiusKm;
  }

  return null;
};

const extractNearbyCount = (query) => {
  const lower = query.toLowerCase();
  const counts = {};

  // A more robust regex for various comparators and number words/digits
  const comparatorRegex =
    /\b(atleast|at\s*least|more\s*than|min(?:imum)?|max(?:imum)?|at\s*most|less\s*than|no\s*more\s*than|no\s*less\s*than|exactly|equal\s*to|>=|<=|>|<)\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|dozen|half-a-dozen|couple|several|a)\s+(.*?)\b(?=\s|$)/g;

  let match;
  while ((match = comparatorRegex.exec(lower)) !== null) {
    const comparator = match[1].replace(/\s+/g, " ").trim();
    const numberWord = match[2];
    const placeRaw = match[3].split(/\b(?:and|or|with)\b/)[0].trim(); // Take the first place

    const numberWords = {
      one: 1,
      a: 1,
      two: 2,
      "a couple": 2,
      couple: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      "half-a-dozen": 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
      dozen: 12,
      several: 3, // Treat 'several' as a vague number, e.g., 3+
    };

    const count = numberWords[numberWord] || parseInt(numberWord, 10);
    const place = normalizeArray([placeRaw], {
      dedupe: true,
      lowercase: true,
      trim: true,
    })[0];

    if (place && !isNaN(count)) {
      const type =
        comparator.startsWith("at least") ||
        comparator.startsWith("more than") ||
        comparator === ">=" ||
        comparator === ">" ||
        comparator.startsWith("min")
          ? "min"
          : comparator.startsWith("at most") ||
            comparator.startsWith("less than") ||
            comparator === "<=" ||
            comparator === "<" ||
            comparator.startsWith("max")
          ? "max"
          : "exact";

      if (!counts[place]) counts[place] = {};
      if (type === "exact") {
        counts[place].min = count;
        counts[place].max = count;
      } else if (type === "min") {
        counts[place].min = count;
      } else {
        // max
        counts[place].max = count;
      }
    }
  }
  return Object.keys(counts).length > 0 ? counts : null;
};

// --- Add helper to detect range/exact keywords in query ---
function detectRangeType(field, query) {
  // Lowercase for easier matching
  const q = (query || '').toLowerCase();
  // Map field to possible keywords
  const keywords = {
    price: [
      'min price', 'minimum price', 'at least', 'more than', 'greater than', 'above', 'over', 'max price', 'maximum price', 'at most', 'less than', 'below', 'under', 'between', 'range', 'upto', 'up to', 'from', 'to', 'till', 'until', 'not more than', 'not less than', 'within', 'around', 'approx', 'about', 'exactly', 'equal to', 'fixed', 'only', 'just', 'exact',
    ],
    area: [
      'min area', 'minimum area', 'at least', 'more than', 'greater than', 'above', 'over', 'max area', 'maximum area', 'at most', 'less than', 'below', 'under', 'between', 'range', 'upto', 'up to', 'from', 'to', 'till', 'until', 'not more than', 'not less than', 'within', 'around', 'approx', 'about', 'exactly', 'equal to', 'fixed', 'only', 'just', 'exact',
    ],
  };
  const fieldKeywords = keywords[field] || [];
  for (const word of fieldKeywords) {
    if (q.includes(word)) return word;
  }
  return null;
}

/** Main postProcess */


// Removed duplicate parseNumberLike function since it's already defined above

function normalizeDiscrete(obj, field) {
  // If it's a plain number or string number, convert to exact value
  if (obj[field] !== null && typeof obj[field] !== "object") {
    const num = parseNumberLike(obj[field]);
    if (!isNaN(num)) {
      obj[field] = { exact: num };
      return;
    }
  }
  
  // Handle object form with min/max/exact
  if (obj[field] && typeof obj[field] === "object") {
    const { min, max, exact } = obj[field];
    if (exact != null) {
      // Keep only exact if it exists
      obj[field] = { exact };
      return;
    }
    if (min != null && max != null && min === max) {
      // If min and max are equal, convert to exact
      obj[field] = { exact: min };
      return;
    }
    // Otherwise keep as is (only min or only max or both different values)
  }
}

function normalizeContinuous(obj, field) {
  // If it's a plain number or string number, convert to exact value
  if (obj[field] !== null && typeof obj[field] !== "object") {
    const num = parseNumberLike(obj[field]);
    if (!isNaN(num)) {
      obj[field] = { exact: num };
      return;
    }
  }
  
  // Handle object form with min/max/exact
  if (obj[field] && typeof obj[field] === "object") {
    const { min, max, exact } = obj[field];
    if (exact != null) {
      // Keep only exact if it exists
      obj[field] = { exact };
      return;
    }
    if (min != null && max != null && min === max) {
      // If min and max are equal, convert to exact
      obj[field] = { exact: min };
      return;
    }
    // Otherwise keep as is (only min or only max or both different values)
  }
}

function postProcess(parsed, options = {}) {
  // Use a deep clone to ensure the original input is never mutated
  const input = JSON.parse(JSON.stringify(parsed));
  const opts = { ...DEFAULTS, ...options };
  const debug = (...args) => {
    if (opts.debug) console.log("[postProcess]", ...args);
  };

  const fallbackOutput = {
    query: typeof parsed?.query === "string" ? parsed.query : "",
    raw: parsed || {},
    error: null,
  };

  try {
    if (!input || typeof input !== "object") {
      debug("Invalid input, expected object. Received:", input);
      return { ...fallbackOutput, error: "Invalid input object" };
    }

    const output = { query: typeof input.query === "string" ? input.query : "" };
    const originalQuery = output.query;

    // Step 0: Remove listing_type if it's not explicitly hinted
    if (
      input.listing_type &&
      originalQuery &&
      !LISTING_TYPE_HINTS.test(originalQuery)
    ) {
      delete input.listing_type;
      debug("Removed listing_type due to lack of explicit hint in query.");
    }

    // Copy all other properties, excluding the 'query' string itself
    for (const key in input) {
      if (key !== "query") {
        output[key] = input[key];
      }
    }

    if (output.location) {
      output.location = normalizeLocation(output.location);
      debug("Normalized location to:", output.location);
    }

   if (output.property_type) {
   
    if (Array.isArray(output.property_type)) {
      output.property_type = output.property_type.map(item => normalizepropertytype(item));
      output.property_type = output.property_type.filter(item => item !== null);
    } else {
    
      output.property_type = normalizepropertytype(output.property_type);
    }
  }

  if (output.amenities && Array.isArray(output.amenities)) {
  
    output.amenities = output.amenities.map(amenity => {
     
        return normalizeamnities(amenity);

    }).filter(Boolean); 

    console.log("Normalized amenities to:", output.amenities);
    debug("Normalized amenities to:", output.amenities);
} else {
    // Handle the case where amenities is not an array or is missing
    console.log("Amenities is not a valid array or is missing.");
}

    // Step 1: Normalize availability (force to date if possible)
    if (output.availability) {
      const dateVal = convertToDate(output.availability, opts);
      // If convertToDate returns a string that is not a valid date, fallback to null
      if (dateVal && /^\d{4}-\d{2}-\d{2}$/.test(dateVal)) {
        output.availability = dateVal;
        console.log("DATE",output.availability)
      } else {
        output.availability = null;
          console.log("DATE null",output.availability)
      }
      debug("Normalized availability to:", output.availability);
        console.log("DATE debug",output.availability)
    }
const discreteFields = ["bedrooms", "bathrooms", "year_built"];
  discreteFields.forEach((f) => normalizeDiscrete(output, f));

  // --- Continuous fields ---
  const continuousFields = [
    "price",
    "area_range",
    "monthly_maintenance",
    "security_deposit",
  ];
  continuousFields.forEach((f) => normalizeContinuous(output, f));
 
// Step 2b: Collapse discrete numeric fields (bedrooms, bathrooms, year_built)
// Normalize range values for all fields that might have min/max/exact values
const rangeFields = ["bedrooms", "bathrooms", "year_built", "price", "area_range", "monthly_maintenance", "security_deposit"];
for (const field of rangeFields) {
  if (output[field] && typeof output[field] === "object") {
    const { min, max, exact } = output[field];

    // If exact exists, keep only exact
    if (exact != null) {
      output[field] = { exact };
    }
    // If min and max exist but are equal → convert to exact
    else if (min != null && max != null && min === max) {
      output[field] = { exact: min };
    }
    // Otherwise keep as is (only min or only max or both different values)
  }
}


    //-----------
    function normalizeField(field) {
  if (!output[field]) return;

  // Handle object form
  if (typeof output[field] === "object") {
    const { min, max, exact } = output[field];

    if (exact != null) {
      output[field] = exact; // exact overrides everything
      return;
    }

    if (min != null && max != null) {
      if (min === max) {
        output[field] = min; // collapse to single exact value
      } else {
        output[field] = { min, max }; // keep proper range
      }
      return;
    }

    if (min != null) {
      output[field] = { min };
      return;
    }

    if (max != null) {
      output[field] = { max };
      return;
    }
  }

  // If plain number → treat as exact
  if (typeof output[field] === "number") {
    output[field] = output[field];
  }
}

// Apply to discrete numeric fields
["bedrooms", "bathrooms", "area", "year_built"].forEach(normalizeField);
//here new

//     // Step 2b: Handle exact values for discrete numeric fields like bedrooms, bathrooms
// const discreteFields = ["bedrooms", "bathrooms"];
// for (const field of discreteFields) {
//   if (output[field] && typeof output[field] === "object") {
//     // If exact exists, just take exact
//     if ("exact" in output[field]) {
//       output[field] = output[field].exact;
//     } else if ("min" in output[field] && "max" in output[field] && output[field].min === output[field].max) {
//       // If min === max, collapse to single number
//       output[field] = output[field].min;
//     } else if ("min" in output[field] && !("max" in output[field])) {
//       output[field] = output[field].min;
//     } else if ("max" in output[field] && !("min" in output[field])) {
//       output[field] = output[field].max;
//     }
//   }
// }


//     // Apply for price fields
//     setExactOrRange('bedrooms', 'bedrooms', 'bedrooms');
//     setExactOrRange('price', 'price', 'price');
//     // Apply for area
//     setExactOrRange('area_range', 'area', 'area_range');

    // Step 3: Normalize array fields
    const arrayFields = ["amenities", "places_nearby", "places_not_near"];
    for (const field of arrayFields) {
      if (output[field] != null) {
        output[field] = normalizeArray(output[field], opts.normalize);
      }
    }

    // Step 4: Extract radius
    const hasPlacesContext =
      (Array.isArray(output.places_nearby) && output.places_nearby.length) ||
      (Array.isArray(output.places_not_near) && output.places_not_near.length);

    if (
      hasPlacesContext &&
      (output.radiusInKm === undefined || output.radiusInKm === null)
    ) {
      const extracted = extractRadiusInKm(originalQuery, opts);
      if (extracted !== null) {
        output.radiusInKm = extracted;
        debug(`Extracted radiusInKm: ${output.radiusInKm}`);
      }
    }

    // Step 5: Fix misplaced amenities into nearby places
    if (Array.isArray(output.amenities) && output.amenities.length) {
      const moveToNearby = [];
      const keepAsAmenities = [];

      const hasNearbyPhrase = NEARBY_PHRASING_REGEX.test(originalQuery);
      for (const item of output.amenities) {
        const normalized = applySynonyms(item);
        if (hasNearbyPhrase && NEARBY_CANDIDATES.has(normalized)) {
          if (
            new RegExp(
              `\\b(${item})\\b[^.]*?\\b(nearby|near|close to|within|walking distance to|in vicinity of)\\b`,
              "i"
            ).test(originalQuery)
          ) {
            moveToNearby.push(normalized);
          } else {
            keepAsAmenities.push(normalized);
          }
        } else {
          keepAsAmenities.push(normalized);
        }
      }

      if (moveToNearby.length > 0) {
        if (!Array.isArray(output.places_nearby)) output.places_nearby = [];
        output.places_nearby = normalizeArray(
          [...output.places_nearby, ...moveToNearby],
          opts.normalize
        );
      }

      output.amenities = normalizeArray(keepAsAmenities, opts.normalize);
    }

    // Step 6: Extract numeric constraints for nearby places
    const nearbyCount = extractNearbyCount(originalQuery);
    if (nearbyCount) {
      output.min_nearby_count = nearbyCount;
    }

    // Step 7: Resolve contradictions
    if (
      Array.isArray(output.places_nearby) &&
      Array.isArray(output.places_not_near)
    ) {
      const notNearSet = new Set(output.places_not_near);
      output.places_nearby = output.places_nearby.filter(
        (p) => !notNearSet.has(p)
      );
    }

    // Step 8: Remove empty arrays
    for (const field of arrayFields) {
      if (Array.isArray(output[field]) && output[field].length === 0) {
        delete output[field];
      }
    }

    return output;
  } catch (err) {
    console.error("Post-processing error:", err);
    return { ...fallbackOutput, error: err.message || "Unknown error" };
  }
}

module.exports = postProcess;
