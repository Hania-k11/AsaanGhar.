const express = require('express');
const router = express.Router();
const pool = require('../db');
const parseUserQuery = require('../utils/parseSearchQuery');
const postProcess = require('../utils/postProcessNLP');
const { geocodeLocation } = require('../utils/geocode');
const { searchNearby } = require('../utils/places');
const { isPropertyNearPlace, isPlaceNearby } = require('../utils/mapLogic');
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

    // Step 4: Geocode all locations (parallel)
    const coordsList = await Promise.all(
      locationsToSearch.map(async (loc) => {
        const coords = await geocodeLocation(loc);
        if (!coords) console.warn(`⚠️ Failed to geocode location: ${loc}`);
        return { loc, coords };
      })
    );

    // Filter out failed geocodes
    const validCoordsList = coordsList.filter(item => item.coords !== null);
    if (validCoordsList.length === 0) {
      return res.status(400).json({ error: 'No valid locations found after geocoding' });
    }

    // Step 5: Build base SQL query and params for static filters
    let sql = 'SELECT * FROM properties WHERE 1=1';
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
      console.log('⚡ No places_nearby specified, returning DB results directly');
      return res.json({ count: properties.length, properties });
    }

    // Step 8: For each location coords, find places nearby for each place requested
    const radiusKm = clean.radiusInKm || 5;
    let filteredProperties = [];

    filteredProperties = properties;  // ← START from full DB result

    for (const { loc, coords } of validCoordsList) {
      console.log(`🔍 Searching places nearby for location "${loc}"`);

      for (const place of clean.places_nearby) {
  const placesFound = await searchNearby(coords.lat, coords.lon, place, radiusKm * 1000);

 if (placesFound.length === 0) {
  console.log(`❌ No "${place}" found near ${loc}, skipping this location`);
  continue; // just skip this place for this location
}


        // Step 9: Filter properties to only those near these places
       // Filter current list of properties further
  filteredProperties = filteredProperties.filter(property => {
  if (!placesFound || placesFound.length === 0) {
    console.warn('⚠️ No places found to filter by');
    return true; // Keep property if no places to filter by
  }
  
  return isPropertyNearPlace(
    { 
      lat: property.latitude, 
      lon: property.longitude 
    },
    placesFound,
    radiusKm
  );
});
        console.log(`🔎 After filtering by place "${place}", ${filteredProperties.length} properties remain`);
      }
    }

    // Step 10: Return filtered properties if filtering happened, else original
    const results = filteredProperties.length > 0 ? filteredProperties : properties;
    console.log(`✅ Returning ${results.length} properties after place nearby filtering`);

    return res.json({ count: results.length, properties: results });

  } catch (error) {
    console.error('❌ /search error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
