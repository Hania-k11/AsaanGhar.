// utils/postProcessNLP.js
'use strict';

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
  isMatch
} = require('date-fns');

const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');

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
  debug: process.env.DEBUG_POSTPROCESS === '1',
  locale: 'en-US',
  timezone: 'UTC', // Sensible default, but ideally user's timezone
  weekStartsOn: 1, // Monday
  defaultVagueRadiusKm: 1,
  preferMaxDistanceForRanges: true,
  speedsKmph: {
    walking: 5,   // ~12 min/km
    driving: 30,  // urban average
    cycling: 15,
    transit: 25
  },
  normalize: {
    dedupe: true,
    lowercase: true,
    trim: true
  }
};

const LISTING_TYPE_HINTS = /\b(rent|rental|lease|to\s*let|for\s*rent|buy|purchase|sell|sale|for\s*sale|kiray?e?\s*pe?|kiraya|bechna|khar[ei]dna|khareedna|kharidna)\b/i;

const VAGUE_RADIUS_TERMS = [
  'walking distance', 'walkable', 'nearby', 'near me', 'close by', 'close to', 'near',
  'in vicinity', 'few minutes away', 'around the corner', 'couple of km', 'few miles', 'half a kilometre'
];

// Pre-compiled regex for efficiency
const NEARBY_PHRASING_REGEX = /\b(nearby|near|close to|within|walking distance to|near me|in vicinity of)\b/i;

// Memoized synonym map for performance
const SYNONYM_MAP = (() => {
  const map = new Map();
  const synonyms = {
    gym: ['gymnasium'],
    mosque: ['masjid'],
    supermarket: ['super market', 'grocery store'],
    mall: ['shopping mall'],
    'train station': ['railway station'],
    metro: ['subway'],
    'bus stop': ['busstation', 'bus stand'],
    hospital: ['hospitales'], // Basic plural support
    apartment: ['apartments'],
    flat: ['flats'],
    office: ['offices']
  };

  for (const [canonical, variations] of Object.entries(synonyms)) {
    map.set(canonical, canonical);
    variations.forEach(v => map.set(v, canonical));
  }
  return map;
})();

const NEARBY_CANDIDATES = new Set([
  'mosque', 'masjid', 'temple', 'church', 'gym', 'school', 'college',
  'university', 'hospital', 'clinic', 'park', 'garden', 'market',
  'supermarket', 'grocery', 'mall', 'metro', 'subway', 'train station',
  'railway station', 'bus stop', 'airport', 'bank', 'atm', 'office',
  'pharmacy', 'restaurant', 'bar', 'cafe', 'coffee shop'
]);

/** Utils */

const roundTo = (num, decimals = 2) => {
  if (typeof num !== 'number' || isNaN(num)) return num;
  const p = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * p) / p;
};

const normalizeString = (s) => {
  if (s == null) return '';
  const str = String(s).replace(/\s+/g, ' ').trim();
  return str.toLowerCase();
};

const applySynonyms = (s) => {
  const n = normalizeString(s);
  return SYNONYM_MAP.get(n) || n;
};

const normalizeArray = (arr, opts = DEFAULTS.normalize) => {
  if (!Array.isArray(arr)) {
    if (typeof arr === 'string') arr = [arr];
    else return [];
  }
  const normalized = arr
    .map(v => (opts.trim ? String(v).trim() : String(v)))
    .filter(Boolean)
    .map(v => (opts.lowercase ? v.toLowerCase() : v))
    .map(applySynonyms);

  return opts.dedupe ? Array.from(new Set(normalized)) : normalized;
};

const isRangeObject = (obj) =>
  obj && typeof obj === 'object' && ('min' in obj || 'max' in obj);

const parseNumberLike = (value) => {
  if (value == null) return NaN;
  if (typeof value === 'number') return value;

  let s = String(value).toLowerCase().trim();

  // Handle common western (100,000) and Indian (1,00,000) comma formats
  s = s.replace(/(\d),(\d)/g, '$1$2');
  // Handle European decimal comma
  s = s.replace(/(\d+),(\d+)/, '$1.$2');
  // Remove other non-numeric non-dot characters
  s = s.replace(/[^a-z0-9.]/g, '');

  // Currency symbols
  s = s.replace(/(₹|rs\.?|Pkr|Rs|\$|usd|eur|¥|£|₩|chf)/g, '');

  // Fractions
  const fractionMatch = s.match(/(\d+)\/(\d+)/);
  if (fractionMatch) {
    const numerator = parseFloat(fractionMatch[1]);
    const denominator = parseFloat(fractionMatch[2]);
    return numerator / denominator;
  }
  
  if (s.includes('half')) return 0.5;
  if (s.includes('quarter')) return 0.25;

  // Words like 'hundred', 'thousand'
  const wordMultipliers = {
    hundred: 1e2, thousand: 1e3, million: 1e6, billion: 1e9
  };
  for (const word in wordMultipliers) {
    if (s.endsWith(word)) {
      const num = parseFloat(s.replace(word, ''));
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
      const num = parseFloat(s.replace(re, ''));
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
    if (typeof range === 'string') {
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
  
  if ('min' in out) {
    const n = parseNumberLike(out.min);
    if (!isNaN(n)) out.min = n;
  }
  if ('max' in out) {
    const n = parseNumberLike(out.max);
    if (!isNaN(n)) out.max = n;
  }
  
  // Ensure min is less than max
  if (typeof out.min === 'number' && typeof out.max === 'number' && out.min > out.max) {
    [out.min, out.max] = [out.max, out.min];
  }
  return out;
};

const clampYear = (year) => {
  if (typeof year !== 'number') return year;
  const now = new Date();
  const max = now.getFullYear() + 2;
  const min = 1800;
  return Math.max(min, Math.min(max, year));
};

/** Date helpers */

const safeFormatDate = (date) => {
  if (!(date instanceof Date) || !isValid(date)) return null;
  return format(date, 'yyyy-MM-dd');
};

const tryParseToISODateString = (str, opts) => {
  const now = zonedTimeToUtc(new Date(), opts.timezone);

  // Weekday references like "next Tuesday"
  const weekdayMatch = str.match(/\b(next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  if (weekdayMatch) {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = daysOfWeek.indexOf(weekdayMatch[2].toLowerCase());
    if (targetDay !== -1) {
      let result = addDays(now, 1);
      while (result.getDay() !== targetDay) {
        result = addDays(result, 1);
      }
      if (weekdayMatch[1]) { // "next"
        result = addWeeks(result, 1);
      }
      return safeFormatDate(result);
    }
  }

  // Ordinal dates like "3rd Feb"
  const ordinalMatch = str.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
  if (ordinalMatch) {
    const day = ordinalMatch[1];
    const month = ordinalMatch[2];
    const year = now.getFullYear();
    const dateStr = `${day} ${month} ${year}`;
    if (isMatch(dateStr, 'd MMM yyyy')) {
      const date = parse(dateStr, 'd MMM yyyy', now);
      return safeFormatDate(date);
    }
  }

  // Partial dates like "May 2025"
  const partialMatch = str.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})/i);
  if (partialMatch) {
    const dateStr = `1 ${partialMatch[1]} ${partialMatch[2]}`;
    if (isMatch(dateStr, 'd MMM yyyy')) {
      const date = parse(dateStr, 'd MMM yyyy', now);
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
  if (!str || typeof str !== 'string') return str;
  const opts = { ...DEFAULTS, ...options };
  const now = utcToZonedTime(new Date(), opts.timezone);
  const lower = str.toLowerCase().trim();

  // Immediate / ASAP
  if (/\b(immediate|immediately|asap|as soon as possible|right away|urgent)\b/.test(lower)) {
    return safeFormatDate(now);
  }

  if (/\b(today)\b/.test(lower)) return safeFormatDate(now);
  if (/\b(tomorrow)\b/.test(lower)) return safeFormatDate(addDays(now, 1));
  if (/\b(day after tomorrow|dat)\b/.test(lower)) return safeFormatDate(addDays(now, 2));

  // Week/Month/Year references
  if (/\b(next\s+week)\b/.test(lower)) return safeFormatDate(addWeeks(now, 1));
  if (/\b(next\s+month)\b/.test(lower)) return safeFormatDate(addMonths(now, 1));
  if (/\b(next\s+year)\b/.test(lower)) return safeFormatDate(addYears(now, 1));

  // "in N days/weeks/months" and vague timeframes
  const timeMatch = lower.match(/\b(in|within)\s+(a\s+couple\s+of|few|\d+\.?\d*)\s*(day|week|month|year)s?\b/);
  if (timeMatch) {
    const num = timeMatch[2] === 'a couple of' || timeMatch[2] === 'few' ? 3 : parseFloat(timeMatch[2]);
    const unit = timeMatch[3];
    if (!isNaN(num)) {
      if (unit === 'day') return safeFormatDate(addDays(now, num));
      if (unit === 'week') return safeFormatDate(addWeeks(now, num));
      if (unit === 'month') return safeFormatDate(addMonths(now, num));
      if (unit === 'year') return safeFormatDate(addYears(now, num));
    }
  }
  
  // EOW/EOM/EOY (end of next week/month also handled)
  if (/\b(eow|end of( the)?( current)? week)\b/.test(lower)) return safeFormatDate(endOfWeek(now, { weekStartsOn: opts.weekStartsOn }));
  if (/\b(end of next week)\b/.test(lower)) return safeFormatDate(endOfWeek(addWeeks(now, 1), { weekStartsOn: opts.weekStartsOn }));
  if (/\b(eom|end of( the)? month)\b/.test(lower)) return safeFormatDate(endOfMonth(now));
  if (/\b(end of next month)\b/.test(lower)) return safeFormatDate(endOfMonth(addMonths(now, 1)));
  if (/\b(eoy|end of( the)? year)\b/.test(lower)) return safeFormatDate(endOfYear(now));

  // If it's a recognizable date string, format it
  const direct = tryParseToISODateString(str, opts);
  if (direct) return direct;

  // Finally, unknown — return as-is
  return str;
};

/** Radius extraction */

const extractRadiusInKm = (text, opts = {}) => {
  if (!text || typeof text !== 'string') return null;
  const lower = text.toLowerCase();
  const speeds = { ...DEFAULTS.speedsKmph, ...(opts.speedsKmph || {}) };
  const allRadii = [];
  
  const processMatch = (match, multiplier = 1, unit = 'km') => {
    const a = parseFloat(match[1]);
    const b = match[3] ? parseFloat(match[3]) : null;
    let val = b ? (opts.preferMaxDistanceForRanges ?? DEFAULTS.preferMaxDistanceForRanges ? Math.max(a, b) : (a + b) / 2) : a;
    val *= multiplier;
    if (unit === 'mi') val *= 1.60934;
    if (unit === 'ft') val *= 0.0003048;
    if (unit === 'm') val *= 0.001;
    return roundTo(val, 2);
  };
  
  // Regex to match numbers, ranges, fractions and units (using a safer, non-alternation-heavy pattern)
  // Anchoring the regex to a word boundary (\b) and being more specific with units helps mitigate ReDoS.
  const distanceRegex = /\b(\d+(?:\.\d+)?|\d+\/\d+|(?:half|quarter))(?:\s*-\s*|\s*to\s*)?(\d+(?:\.\d+)?|\d+\/\d+)?\s*(k?m|kilometers?|kilometres?|mi|miles?|foot|feet|ft|meter|meters|metre|metres|m|yard|yards)\b/g;
  let match;
  while ((match = distanceRegex.exec(lower)) !== null) {
      const rawVal1 = match[1];
      const rawVal2 = match[2];
      let val1 = parseNumberLike(rawVal1);
      let val2 = rawVal2 ? parseNumberLike(rawVal2) : null;
      const unit = match[3].toLowerCase();
      
      const val = val2 ? (opts.preferMaxDistanceForRanges ?? DEFAULTS.preferMaxDistanceForRanges ? Math.max(val1, val2) : (val1 + val2) / 2) : val1;

      let km = val;
      if (unit.startsWith('mi')) km *= 1.60934;
      else if (unit.startsWith('m')) km *= 0.001;
      else if (unit.startsWith('f') || unit.startsWith('y')) km = val * 0.0009144; // Approx ft to km
      
      allRadii.push(roundTo(km, 2));
  }
  
  // Time-based (minutes/hours) with mode (walk/drive/cycle)
  const timeRegex = /\b(\d+(?:\.\d+)?|\d+\/\d+|(?:half|quarter))(?:\s*-\s*|\s*to\s*)?(\d+(?:\.\d+)?|\d+\/\d+)?\s*(minutes?|mins?|hours?|hrs?|hr|h)\b[^.]*?\b(walk(?:ing)?|on\s*foot|drive|driving|by\s*car|car|cycle|cycling|bike|biking|scooter|transit|metro|train|e-scooter)\b/g;
  while ((match = timeRegex.exec(lower)) !== null) {
      const rawVal1 = match[1];
      const rawVal2 = match[2];
      let val1 = parseNumberLike(rawVal1);
      let val2 = rawVal2 ? parseNumberLike(rawVal2) : null;
      const unit = match[3];
      const modeRaw = match[4];
      
      const timeVal = val2 ? (opts.preferMaxDistanceForRanges ?? DEFAULTS.preferMaxDistanceForRanges ? Math.max(val1, val2) : (val1 + val2) / 2) : val1;
      const minutes = /hour|hr|h/.test(unit) ? (timeVal * 60) : timeVal;

      let mode = 'driving';
      if (/walk|foot/.test(modeRaw)) mode = 'walking';
      else if (/cycle|bike/.test(modeRaw) || /scooter|e-scooter/.test(modeRaw)) mode = 'cycling';
      else if (/transit|metro|train/.test(modeRaw)) mode = 'transit';

      const speed = speeds[mode] || speeds.driving;
      const km = (speed / 60) * minutes;
      allRadii.push(roundTo(km, 2));
  }

  if (allRadii.length > 0) {
      // Return the most specific (e.g., first) or a combined value if needed
      return allRadii[0];
  }

  // Vague terms fallback
  if (VAGUE_RADIUS_TERMS.some(term => lower.includes(term))) {
    return DEFAULTS.defaultVagueRadiusKm;
  }

  return null;
};

const extractNearbyCount = (query) => {
  const lower = query.toLowerCase();
  const counts = {};
  
  // A more robust regex for various comparators and number words/digits
  const comparatorRegex = /\b(atleast|at\s*least|more\s*than|min(?:imum)?|max(?:imum)?|at\s*most|less\s*than|no\s*more\s*than|no\s*less\s*than|exactly|equal\s*to|>=|<=|>|<)\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|dozen|half-a-dozen|couple|several|a)\s+(.*?)\b(?=\s|$)/g;

  let match;
  while ((match = comparatorRegex.exec(lower)) !== null) {
      const comparator = match[1].replace(/\s+/g, ' ').trim();
      const numberWord = match[2];
      const placeRaw = match[3].split(/\b(?:and|or|with)\b/)[0].trim(); // Take the first place
      
      const numberWords = { 
          'one': 1, 'a': 1, 'two': 2, 'a couple': 2, 'couple': 2, 'three': 3, 'four': 4, 'five': 5,
          'six': 6, 'half-a-dozen': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11,
          'twelve': 12, 'dozen': 12, 'several': 3 // Treat 'several' as a vague number, e.g., 3+
      };
      
      const count = numberWords[numberWord] || parseInt(numberWord, 10);
      const place = normalizeArray([placeRaw], { dedupe: true, lowercase: true, trim: true })[0];
      
      if (place && !isNaN(count)) {
          const type = comparator.startsWith('at least') || comparator.startsWith('more than') || comparator === '>=' || comparator === '>' || comparator.startsWith('min') ? 'min' :
                       comparator.startsWith('at most') || comparator.startsWith('less than') || comparator === '<=' || comparator === '<' || comparator.startsWith('max') ? 'max' :
                       'exact';
          
          if (!counts[place]) counts[place] = {};
          if (type === 'exact') {
              counts[place].min = count;
              counts[place].max = count;
          } else if (type === 'min') {
              counts[place].min = count;
          } else { // max
              counts[place].max = count;
          }
      }
  }
  return Object.keys(counts).length > 0 ? counts : null;
}


/** Main postProcess */

function postProcess(parsed, options = {}) {
  // Use a deep clone to ensure the original input is never mutated
  const input = JSON.parse(JSON.stringify(parsed));
  const opts = { ...DEFAULTS, ...options };
  const debug = (...args) => { if (opts.debug) console.log('[postProcess]', ...args); };

  try {
    if (!input || typeof input !== 'object') {
      debug('Invalid input, expected object. Received:', input);
      return {};
    }

    const output = {};
    const originalQuery = typeof input.query === 'string' ? input.query : '';

    // Step 0: Remove listing_type if it's not explicitly hinted
    if (input.listing_type && originalQuery && !LISTING_TYPE_HINTS.test(originalQuery)) {
      delete input.listing_type;
      debug('Removed listing_type due to lack of explicit hint in query.');
    }
    
    // Copy all other properties, excluding the 'query' string itself
    for (const key in input) {
        if (key !== 'query') {
            output[key] = input[key];
        }
    }

    // Step 1: Normalize availability
    if (output.availability) {
      output.availability = convertToDate(output.availability, opts);
      debug('Normalized availability to:', output.availability);
    }

    // Step 2: Sanity check numeric ranges and coerce numbers when possible
    const rangeFields = ['monthly_rent', 'sale_price', 'area_range', 'year_built', 'security_deposit', 'monthly_maintenance'];

    for (const field of rangeFields) {
      if (output[field] != null) {
        output[field] = normalizeRange(output[field]);

        if (field === 'year_built' && isRangeObject(output[field])) {
          if (typeof output[field].min === 'number') output[field].min = clampYear(output[field].min);
          if (typeof output[field].max === 'number') output[field].max = clampYear(output[field].max);
        } else if (field === 'year_built' && typeof output[field] === 'number') {
          output[field] = clampYear(output[field]);
        }
      }
    }

    // Step 3: Trim, lowercase, dedupe and normalize array fields
    const arrayFields = ['amenities', 'places_nearby', 'places_not_near'];
    for (const field of arrayFields) {
      if (output[field] != null) {
        output[field] = normalizeArray(output[field], opts.normalize);
      }
    }
    
    // Step 4: Radius extraction based on original query text if places mentioned
    const hasPlacesContext = (Array.isArray(output.places_nearby) && output.places_nearby.length) ||
                             (Array.isArray(output.places_not_near) && output.places_not_near.length);
    
    // Only extract radius if it wasn't already parsed and there's a context for it
    if (hasPlacesContext && (output.radiusInKm === undefined || output.radiusInKm === null)) {
      const extracted = extractRadiusInKm(originalQuery, opts);
      if (extracted !== null) {
        output.radiusInKm = extracted;
        debug(`Extracted radiusInKm: ${output.radiusInKm} from query "${originalQuery}"`);
      }
    }

    // Step 5: Fix misplaced amenities into nearby places
    if (Array.isArray(output.amenities) && output.amenities.length) {
      const moveToNearby = [];
      const keepAsAmenities = [];

      // Check if the original query contains a "nearby" phrase.
      const hasNearbyPhrase = NEARBY_PHRASING_REGEX.test(originalQuery);
      debug(`Original query contains a nearby phrase: ${hasNearbyPhrase}`);

      for (const item of output.amenities) {
        const normalized = applySynonyms(item);
        if (hasNearbyPhrase && NEARBY_CANDIDATES.has(normalized)) {
          // Check if the amenity token was actually near-qualified in the query
          // A more robust check might involve NLP, but this is a good first pass
          if (new RegExp(`\\b(${item})\\b[^.]*?\\b(nearby|near|close to|within|walking distance to|in vicinity of)\\b`, 'i').test(originalQuery)) {
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
        output.places_nearby = normalizeArray([...output.places_nearby, ...moveToNearby], opts.normalize);
        debug('Moved amenities to places_nearby:', moveToNearby);
      }
      
      output.amenities = normalizeArray(keepAsAmenities, opts.normalize);
    }
    
    // NEW Step: Extract numeric constraints for nearby places
    const nearbyCount = extractNearbyCount(originalQuery);
    if (nearbyCount) {
        output.min_nearby_count = nearbyCount;
        debug('Extracted nearby place count constraint:', nearbyCount);
    }
    
    // Step 6: Resolve contradictions between places_nearby and places_not_near
    if (Array.isArray(output.places_nearby) && Array.isArray(output.places_not_near)) {
      const notNearSet = new Set(output.places_not_near);
      output.places_nearby = output.places_nearby.filter(p => !notNearSet.has(p));
    }
    
    // Defensive final check to remove empty arrays
    for (const field of arrayFields) {
        if (Array.isArray(output[field]) && output[field].length === 0) {
            delete output[field];
        }
    }

    return output;

  } catch (err) {
    if (opts.debug) {
      console.error('Post-processing error:', err);
    }
    // Return an empty object on error, so upstream can handle the failure explicitly
    return {};
  }
}

module.exports = postProcess;