//utils/places.js

const axios = require('axios');
require('dotenv').config();
const FOURSQUARE_SERVICE_KEY = process.env.FOURSQUARE_SERVICE_KEY;

if (!FOURSQUARE_SERVICE_KEY) {
    console.error('FOURSQUARE_SERVICE_KEY is not set!');
    process.exit(1);
}

// Add retry logic with exponential backoff
async function makeRequestWithRetry(url, config, retries = 3, delay = 1000) {
    try {
        return await axios.get(url, config);
    } catch (error) {
        if (retries === 0 || !isRetryableError(error)) {
            throw error;
        }
        
        console.log(`Retrying request after ${delay}ms... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return makeRequestWithRetry(url, config, retries - 1, delay * 2);
    }
}

function isRetryableError(error) {
    return (
        error.code === 'EAI_AGAIN' || 
        error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT' ||
        (error.response && error.response.status >= 500)
    );
}

async function searchNearby(lat, lon, query, radiusInMeters) {
    const url = 'https://places-api.foursquare.com/places/search';
    const config = {
        headers: {
            Authorization: `Bearer ${FOURSQUARE_SERVICE_KEY}`,
            'X-Places-Api-Version': '2025-06-17',
        },
        params: {
            ll: `${lat},${lon}`,
            query: query,
            radius: Math.min(radiusInMeters, 100000), // Cap radius at 100km
            limit: 5,
        },
        timeout: 10000 // 10 second timeout
    };

    try {
        console.log(`🔍 Searching for ${query} near (${lat}, ${lon})`);
        const response = await makeRequestWithRetry(url, config);
        
        if (!response.data || !response.data.results) {
            console.warn('⚠️ Invalid response format from Foursquare API');
            return [];
        }

        console.log(`✅ Found ${response.data.results.length} places`);
        // console.log(response.data.results)
         console.log('🟢 Foursquare response:', response.data);

        return response.data.results.map(place => ({
            name: place.name,
            latitude: place.latitude,
            longitude: place.longitude,
            distance: place.distance,
            categories: place.categories?.map(c => c.name) || []
        }));
    } catch (error) {
        console.error('❌ Error searching nearby places:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data
        });
        return [];
    }
};

module.exports = { searchNearby };