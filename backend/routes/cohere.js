const express = require('express');
const router = express.Router();
const parseUserQuery = require('../utils/parseSearchQuery');
const postProcess = require('../utils/postProcessNLP');
const { searchNearby } = require('../utils/places');
const haversineDistance = require('../utils/haversineDistance');
const { queryProperties } = require('../utils/propertyQueries');

const fallbackLocations = ['Gulshan', 'DHA', 'Clifton', 'North Nazimabad', 'Bahadurabad'];

router.post('/search', async (req, res) => {
  try {
    const {
      query: userQuery,
      sort = 'featured',
      page = 1,
      limit = 6,
      filter = 'all',
      priceRange, // [min, max]
    } = req.body;

    if (!userQuery) {
      return res.status(400).json({ error: 'Missing query text' });
    }

    // 1️⃣ NLP parsing
    const nlpOutput = await parseUserQuery(userQuery);
    if (!nlpOutput.parsed) {
      return res.status(400).json({ error: 'Failed to parse query' });
    }

    const clean = postProcess({ ...nlpOutput.parsed, query: userQuery });

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

    // 3️⃣ Build base query params
    const baseQueryParams = {
      locationFilters,
      rooms: clean.rooms,
      bathrooms: clean.bathrooms,
      property_type: clean.property_type,
      listing_type: listingTypeFinal,
      availability: clean.availability,
      priceMin,
      priceMax,
      searchTerm: '',
      sort,
    };

    // 4️⃣ No nearby filtering → simple query with pagination
    if (!clean.places_nearby || clean.places_nearby.length === 0) {
      const { data, totalCount, totalPages } = await queryProperties({
        ...baseQueryParams,
        page,
        limit,
      });

      return res.json({
        count: totalCount,
        totalPages,
        page: Number(page),
        limit: Number(limit),
        properties: data.map(p => ({
          id: p.id,
          title: p.title,
          location: `${p.location_sector}, ${p.location_area}, ${p.location_city}`,
          price: p.price,
          listing_type: p.listing_type_name,
          property_type: p.property_type_name,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          coordinates: { latitude: p.latitude, longitude: p.longitude },
        })),
      });
    }

    // 5️⃣ Nearby filtering - get all filtered properties first (limit large)
    const { data: allFilteredProperties } = await queryProperties({
      ...baseQueryParams,
      page: 1,
      limit: 10000,
    });

    const radiusKm = clean.radiusInKm || 5;
    const filteredPropertiesWithPlaces = [];

    for (const property of allFilteredProperties) {
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
          property: {
            id: property.id,
            title: property.title,
            location: `${property.location_sector}, ${property.location_area}, ${property.location_city}`,
            price: property.price,
            listing_type: property.listing_type_name,
            property_type: property.property_type_name,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            coordinates: { latitude: property.latitude, longitude: property.longitude },
          },
          nearby_places: nearbyPlacesFound,
        });
      }
    }

    // 6️⃣ SORT filtered results **before** pagination
    switch (sort) {
      case 'price-low':
        filteredPropertiesWithPlaces.sort(
          (a, b) => a.property.price - b.property.price
        );
        break;
      case 'price-high':
        filteredPropertiesWithPlaces.sort(
          (a, b) => b.property.price - a.property.price
        );
        break;
      case 'newest':
        filteredPropertiesWithPlaces.sort((a, b) =>
          new Date(b.property.posted_at) - new Date(a.property.posted_at)
        );
        break;
      default:
        // featured or fallback
        filteredPropertiesWithPlaces.sort((a, b) =>
          b.property.is_featured - a.property.is_featured
        );
    }

    // 7️⃣ Pagination after sorting
    const totalCount = filteredPropertiesWithPlaces.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const paginatedFilteredProperties = filteredPropertiesWithPlaces.slice(
      startIndex,
      startIndex + limit
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
