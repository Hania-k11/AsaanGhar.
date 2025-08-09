//utisls/postProcessNLP.js

const { parseISO, addDays, addWeeks, format } = require('date-fns');

function convertToDate(str) {
  if (!str || typeof str !== 'string') return str;

  const lower = str.toLowerCase().trim();
  const today = new Date();

  if (lower.includes('immediate')) return format(today, 'yyyy-MM-dd');

  if (lower.includes('next month')) {
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return format(nextMonth, 'yyyy-MM-dd');
  }

  if (lower.includes('in a week') || lower.includes('within a week')) {
    return format(addDays(today, 7), 'yyyy-MM-dd');
  }

  const dayMatch = lower.match(/(\d+)\s*day/);
  if (dayMatch) return format(addDays(today, parseInt(dayMatch[1])), 'yyyy-MM-dd');

  const weekMatch = lower.match(/(\d+)\s*week/);
  if (weekMatch) return format(addWeeks(today, parseInt(weekMatch[1])), 'yyyy-MM-dd');

  // Already in ISO or unknown — return as is
  return str;
}

function extractRadiusInKm(text) {
  if (!text || typeof text !== 'string') return null;
  const lower = text.toLowerCase();

  const minuteMatch = lower.match(/(\d+)\s*(minutes?|mins?)\s*(drive|walk)?/);
  if (minuteMatch) {
    const minutes = parseInt(minuteMatch[1]);
    const isWalk = lower.includes('walk');
    const km = isWalk
      ? minutes * 0.1   // ~100m per minute walking
      : minutes * 1.5;  // ~1.5km per minute driving

    return Math.round((km + Number.EPSILON) * 100) / 100;
  }

  const vagueTerms = ['walking distance', 'nearby', 'close to', 'near', 'in vicinity', 'few minutes away'];
  if (vagueTerms.some(term => lower.includes(term))) return 1;

  return null;
}

function postProcess(parsed) {
  try {
    const output = { ...parsed };
    const originalQuery = parsed.query || '';

    // 🔒 Step 0: Remove listing_type if it's not mentioned in query
  if (
    output.listing_type &&
    originalQuery &&
    !/rent|buy|sell|purchase|kirae|kiraya|bechna|khareedna|for sale/i.test(originalQuery)
  ) {
    delete output.listing_type;
  }

    // Step 1: Normalize availability
    if (output.availability) {
      output.availability = convertToDate(output.availability);
    }

    // Step 2: Sanity check numeric ranges
    const rangeFields = ['monthly_rent', 'sale_price', 'area_range', 'year_built', 'security_deposit', 'monthly_maintenance'];
    for (let field of rangeFields) {
      if (typeof output[field] === 'object' && output[field] !== null) {
        if (output[field].min && output[field].max && output[field].min > output[field].max) {
          const temp = output[field].min;
          output[field].min = output[field].max;
          output[field].max = temp;
        }
      }
    }

    // Step 3: Trim and normalize array fields
    const arrayFields = ['amenities', 'places_nearby', 'places_not_near'];
    for (let field of arrayFields) {
      if (Array.isArray(output[field])) {
        output[field] = output[field].map(v => v.trim().toLowerCase());
      }
    }

    // Step 4: Radius extraction based on original query text
    if (
      (output.places_nearby || output.places_not_near) &&
      (output.radiusInKm === undefined || output.radiusInKm === null)
    ) {
      const extracted = extractRadiusInKm(originalQuery);
      if (extracted !== null) output.radiusInKm = extracted;
      console.log(`🔍 Extracted radiusInKm: ${output.radiusInKm} from query "${originalQuery}"`);
    }
    
    // Step 5: Fix misplaced amenities into nearby places
    if (Array.isArray(output.amenities)) {
      const possibleNearby = ['mosque', 'gym', 'school', 'hospital', 'park', 'market'];
      const actuallyNearby = output.amenities.filter(a => possibleNearby.includes(a));
      const trulyAmenities = output.amenities.filter(a => !possibleNearby.includes(a));

      if (!output.places_nearby) output.places_nearby = [];
      output.places_nearby.push(...actuallyNearby);
      output.amenities = trulyAmenities;
    }

delete output.query; // clean up internal field
return output;

  } catch (err) {
    console.error("Post-processing error:", err.message);
    return {};
  }
}

module.exports = postProcess;
