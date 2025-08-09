const express = require('express');
const router = express.Router();
const pool = require('../db');
const parseUserQuery = require('../utils/parseSearchQuery');
const postProcess = require('../utils/postProcessNLP');
// const { geocodeLocation } = require('../utils/geocode'); // ⚠️ No longer needed for this workflow
const { searchNearby } = require('../utils/places');
const { isPropertyNearPlace } = require('../utils/mapLogic');
const haversineDistance = require('../utils/haversineDistance');

const fallbackLocations = ['Gulshan', 'DHA', 'Clifton', 'North Nazimabad', 'Bahadurabad'];

router.post('/search', async (req, res) => {
  try {
    const userQuery = req.body.query;
    if (!userQuery) {
      return res.status(400).json({ error: 'Missing query text' });
    }
    console.log('🔥 Received user query:', userQuery);

    // Step 1: Parse user query with NLP
    const nlpOutput = await parseUserQuery(userQuery);
    if (!nlpOutput.parsed) {
      console.warn('⚠️ NLP parsing failed or returned null');
      return res.status(400).json({ error: 'Failed to parse query' });
    }

    // Step 2: Post-process parsed JSON to normalize, clean
    const clean = postProcess({ ...nlpOutput.parsed, query: userQuery });
    console.log('🧠 NLP Constraints after postProcess:', clean);

    // Step 3: Determine locations to search
    const locationsToSearch = clean.location ? [clean.location] : fallbackLocations;
    console.log('📍 Locations to search:', locationsToSearch);

    // ⚠️ Step 4 & 5: Modified logic. We now query the database directly to get properties and their coordinates.
    // Build base SQL query and params for static filters
    let sql = 'SELECT * FROM properties WHERE 1=1'; // ⚠️ SELECT * to get lat/lon
    const params = [];

    // Support multiple locations: We'll filter by LIKE any of them using OR clauses
    if (locationsToSearch.length > 0) {
      const likeConditions = locationsToSearch.map(() => 'location LIKE ?').join(' OR ');
      sql += ` AND (${likeConditions})`;
      locationsToSearch.forEach(loc => params.push(`%${loc}%`));
    }

    // Other filters if present
    if (clean.bedrooms) {
      sql += ' AND bedrooms = ?';
      params.push(clean.bedrooms);
    }
    if (clean.bathrooms) {
      sql += ' AND bathrooms = ?';
      params.push(clean.bathrooms);
    }
    if (clean.property_type) {
      sql += ' AND property_type = ?';
      params.push(clean.property_type);
    }
    if (clean.listing_type) {
      sql += ' AND listing_type = ?';
      params.push(clean.listing_type);
    }
    // Add priceRange filters (monthly_rent or sale_price) if present
    if (clean.monthly_rent) {
      if (typeof clean.monthly_rent === 'object') {
        if (clean.monthly_rent.min) {
          sql += ' AND monthly_rent >= ?';
          params.push(clean.monthly_rent.min);
        }
        if (clean.monthly_rent.max) {
          sql += ' AND monthly_rent <= ?';
          params.push(clean.monthly_rent.max);
        }
      } else {
        sql += ' AND monthly_rent = ?';
        params.push(clean.monthly_rent);
      }
    }
    if (clean.sale_price) {
      if (typeof clean.sale_price === 'object') {
        if (clean.sale_price.min) {
          sql += ' AND sale_price >= ?';
          params.push(clean.sale_price.min);
        }
        if (clean.sale_price.max) {
          sql += ' AND sale_price <= ?';
          params.push(clean.sale_price.max);
        }
      } else {
        sql += ' AND sale_price = ?';
        params.push(clean.sale_price);
      }
    }

    console.log('🗄️ SQL Query:', sql);
    console.log('🔢 SQL Params:', params);

    // Step 6: Query database
    const [properties] = await pool.query(sql, params);
    console.log(`🏘️ Found ${properties.length} properties matching static filters`);

    // Step 7: If no places_nearby specified, return results early
 if (!clean.places_nearby || clean.places_nearby.length === 0) {
  console.log('⚡ No places_nearby specified, returning empty results as per updated logic');
  return res.json({ count: 0, properties: [] });
}
    // ⚠️ Step 8: Iterate over each property to find nearby places
    const radiusKm = clean.radiusInKm || 5;

    const filteredPropertiesWithPlaces = [];

for (const property of properties) {
  const nearbyPlacesFound = [];
  
  for (const placeType of clean.places_nearby) {
    console.log(`🔍 Searching for "${placeType}" near property at ${property.id} (${property.latitude}, ${property.longitude})`);
    const placesFound = await searchNearby(property.latitude, property.longitude, placeType, radiusKm * 1000);

    if (placesFound.length > 0) {
      // Filter places within radius and add their details
      const nearbyPlaces = placesFound.filter(place => {
        const distance = haversineDistance(
          property.latitude,
          property.longitude,
          place.latitude,
          place.longitude
        );
        return distance <= radiusKm;
      });

      if (nearbyPlaces.length > 0) {
        nearbyPlacesFound.push({
          placeType,
          places: nearbyPlaces.map(place => ({
            name: place.name,
            distance: (place.distance / 1000).toFixed(2), // Convert to km
            coordinates: {
              latitude: place.latitude,
              longitude: place.longitude
            }
          }))
        });
      }
    }
  }

  if (nearbyPlacesFound.length > 0) {
    filteredPropertiesWithPlaces.push({
      property: {
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.sale_price || property.monthly_rent,
        listing_type: property.listing_type,
        property_type: property.property_type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        coordinates: {
          latitude: property.latitude,
          longitude: property.longitude
        }
      },
      nearby_places: nearbyPlacesFound
    });
  }
}

console.log(`🔎 Found ${filteredPropertiesWithPlaces.length} properties with nearby places`);

// Update the response
return res.json({
  count: filteredPropertiesWithPlaces.length,
  properties: filteredPropertiesWithPlaces
});

  } catch (error) {
    console.error('❌ /search error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;