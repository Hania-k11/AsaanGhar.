const axios = require('axios');
require('dotenv').config();
const FOURSQUARE_SERVICE_KEY = process.env.FOURSQUARE_SERVICE_KEY;

if (!FOURSQUARE_SERVICE_KEY) {
  console.error('FOURSQUARE_SERVICE_KEY is not set!');
  process.exit(1);
}

async function searchNearby(lat, lon, query, radiusInKm) {
  const url = 'https://places-api.foursquare.com/places/search';

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${FOURSQUARE_SERVICE_KEY}`, // your new service key here
        'X-Places-Api-Version': '2025-06-17',
      },
      params: {
        ll: `${lat},${lon}`,
        query: query,
        radius: Math.min(radiusInKm * 1000, 100000), // Cap radius at 100000 meters
        limit: 5,
      },
    });

    console.log('🟢 Foursquare response:', response.data);
   return places.map(place => ({
      name: place.name,
      latitude: place.location?.lat || place.lat,
      longitude: place.location?.lng || place.lon,
      distance: place.distance
    }));
  } catch (error) {
    console.error('Error searching nearby places--places.js:', error);
    return [];
  }
};
module.exports = { searchNearby };