// utils/geocode.js
const axios = require('axios');
const API_KEY = process.env.LOCATIONIQ_API_KEY;

// Normalize vague inputs like "Gulshan" to more specific ones
function normalizeLocation(location) {
  if (!location.toLowerCase().includes('karachi')) {
    return `${location}, Karachi, Pakistan`;
  }
  return location;
}

async function geocodeLocation(location) {
  const normalizedLocation = normalizeLocation(location);
  console.log(`[GEOCODE] 🔍 Attempting to geocode location: "${normalizedLocation}"`);

  try {
    const response = await axios.get('https://us1.locationiq.com/v1/search.php', {
      params: {
        key: API_KEY,
        q: normalizedLocation,
        format: 'json',
        countrycodes: 'pk', // restrict to Pakistan
      }
    });

    const result = response.data[0];

    if (!result || !result.lat || !result.lon) {
      console.warn(`[GEOCODE] ❌ Failed to geocode location: "${normalizedLocation}". No valid coordinates returned.`);
      return null;
    }

    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    console.log(`[GEOCODE] ✅ Success: ${normalizedLocation} => [${lat}, ${lon}]`);

    return { lat, lon };

  } catch (err) {
    console.error(`[GEOCODE] ❌ Error geocoding "${normalizedLocation}":`, err.message);
    return null;
  }
}

module.exports = { geocodeLocation };
