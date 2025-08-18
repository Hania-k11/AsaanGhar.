const express = require('express');
const router = express.Router();
const parseUserQuery = require('../utils/parseSearchQuery');
const postProcess = require('../utils/postProcessNLP');
const { searchNearby } = require('../utils/places');
const haversineDistance = require('../utils/haversineDistance');
const pool = require('../db');

const fallbackLocations = ['Gulshan', 'DHA', 'PECHS', 'Scheme 33', 'Gulistan e Johar', 'Johar'];

router.post('/search/:user_id', async (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);

  if (isNaN(user_id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const {
      query: userQuery,
      sort = 'featured',
      page = 1,
      limit = 6,
      filter = 'all',
      priceRange,
    } = req.body;

    const offset = (page - 1) * limit;

    if (!userQuery) {
      return res.status(400).json({ error: 'Missing query text' });
    }

    // 1️⃣ NLP parsing
    const nlpOutput = await parseUserQuery(userQuery);
    if (!nlpOutput.parsed) {
      return res.status(400).json({ error: 'Failed to parse query' });
    }

    const clean = postProcess({ ...nlpOutput.parsed, query: userQuery });
    console.log('Parsed and cleaned output:', clean);

    // 2️⃣ Merge NLP + manual filters
    const locationFilters = clean.location ? [clean.location] : fallbackLocations;

    // Price precedence: manual filter overrides NLP
    let priceMin = priceRange?.[0] ?? null;
    let priceMax = priceRange?.[1] ?? null;

    if ((priceMin === null || priceMin === undefined) && (clean.monthly_rent || clean.sale_price)) {
      const priceObj = clean.monthly_rent || clean.sale_price;
      if (typeof priceObj === 'object') {
        priceMin = priceObj.min;
        priceMax = priceObj.max;
      } else {
        priceMin = priceMax = priceObj;
      }
    }

    const listingTypeFinal = filter !== 'all' ? filter : clean.listing_type ?? undefined;

    // 3️⃣ Fetch properties using stored procedure
    const [rows] = await pool.query('CALL GetPropertiesExcludingUser(?)', [Number(user_id)]);
    let properties = rows[0]; 

  

    // 4️⃣ Apply filters in Node.js
    if (locationFilters && locationFilters.length > 0) {
      properties = properties.filter(p =>
        locationFilters.some(loc =>
          p.location_city?.toLowerCase().includes(loc.toLowerCase()) ||
          p.location_name?.toLowerCase().includes(loc.toLowerCase())
        )
      );
      // console.log('After location filter:', properties);
      // console.log('After location filter:', locationFilters.length);
       console.log('After location filter:', properties.length);
    }

    if (clean.rooms) {
      properties = properties.filter(p => p.bedrooms >= clean.rooms);
      // console.log('After rooms filter:', properties);
    }

    if (clean.bathrooms) {
      properties = properties.filter(p => p.bathrooms >= clean.bathrooms);
      // console.log('After bathrooms filter:', properties);
    }

    if (clean.property_type) {
      properties = properties.filter(p =>
        p.property_type_name?.toLowerCase() === clean.property_type.toLowerCase()
      );
      // console.log('After property type filter:', properties);
       console.log('After property type filter:', properties.length);
    }

    if (listingTypeFinal) {
      const listingTypeMap = { rent: 1, sale: 2 };
      const listingTypeId = listingTypeMap[listingTypeFinal.toLowerCase()];
      if (listingTypeId) {
        properties = properties.filter(p => p.listing_type_id === listingTypeId);
        // console.log('After listing type filter:', properties);
      }
    }

    if (clean.availability) {
      properties = properties.filter(p => {
        const availableFrom = new Date(p.available_from);
        return availableFrom <= new Date(clean.availability);
      });
      // console.log('After availability filter:', properties);
    }

    if (priceMin !== null && priceMin !== undefined && priceMax !== null && priceMax !== undefined) {
      const minPriceNum = parseFloat(priceMin);
      const maxPriceNum = parseFloat(priceMax);
      properties = properties.filter(p => {
        const priceNum = parseFloat(p.price);
        return !isNaN(priceNum) && priceNum >= minPriceNum && priceNum <= maxPriceNum;
      });
      // console.log('After price filter:', properties);
    }

    // 5️⃣ No nearby filtering → simple query with pagination
    if (!clean.places_nearby || clean.places_nearby.length === 0) {
      // Sorting
      switch (sort) {
        case 'price-low':
          properties.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case 'price-high':
          properties.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case 'newest':
          properties.sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at));
          break;
        default:
          properties.sort((a, b) => b.is_featured - a.is_featured);
      }
      // console.log('After sorting:', properties);

      // Pagination
      const totalCount = properties.length;
      const totalPages = Math.ceil(totalCount / limit);
      const paginatedProperties = properties.slice(offset, offset + Number(limit));

      return res.json({
        count: totalCount,
        totalPages,
        page: Number(page),
        limit: Number(limit),
        properties: paginatedProperties, // Return full property objects
      });
    }

    // 6️⃣ Nearby filtering
    const radiusKm = clean.radiusInKm || 5;
    const filteredPropertiesWithPlaces = [];

    for (const property of properties) {
      const nearbyPlacesFound = [];

      for (const placeType of clean.places_nearby) {
        const placesFound = await searchNearby(
          property.latitude,
          property.longitude,
          placeType,
          radiusKm * 1000
        );

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
              distance: (place.distance / 1000).toFixed(2),
              coordinates: { latitude: place.latitude, longitude: place.longitude },
            })),
          });
        }
      }

      if (nearbyPlacesFound.length > 0) {
        filteredPropertiesWithPlaces.push({
          property, 
          nearby_places: nearbyPlacesFound,
        });
      }
    }

    // 7️⃣ Sort filtered results
    switch (sort) {
      case 'price-low':
        filteredPropertiesWithPlaces.sort(
          (a, b) => parseFloat(a.property.price) - parseFloat(b.property.price)
        );
        break;
      case 'price-high':
        filteredPropertiesWithPlaces.sort(
          (a, b) => parseFloat(b.property.price) - parseFloat(b.property.price)
        );
        break;
      case 'newest':
        filteredPropertiesWithPlaces.sort(
          (a, b) => new Date(b.property.posted_at) - new Date(a.property.posted_at)
        );
        break;
      default:
        filteredPropertiesWithPlaces.sort(
          (a, b) => b.property.is_featured - a.property.is_featured
        );
    }

    // 8️⃣ Pagination after sorting
    const totalCount = filteredPropertiesWithPlaces.length;
    const totalPages = Math.ceil(totalCount / limit);

    const paginatedFilteredProperties = filteredPropertiesWithPlaces.slice(
      offset,
      offset + Number(limit)
    );

    return res.json({
      count: totalCount,
      totalPages,
      page: Number(page),
      limit: Number(limit),
      properties: paginatedFilteredProperties,
    });
  } catch (error) {
    console.error('❌ /search error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;