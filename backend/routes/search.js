const express = require('express');
const router = express.Router();
const pool = require('../db');
const { parseSearchQuery } = require('../utils/gptParser');
const postProcess = require("../utils/postProcessNLP");
const { searchNearby } = require("../utils/places");
const haversineDistance = require("../utils/haversineDistance");
const searchSchema = require("../validators/searchSchema");
const logger = require("../utils/logger");



const MAX_CONCURRENT_REQUESTS = 5; 

async function processNearbyPlaces(properties, clean, radiusKm = 5) {
  if (!clean.places_nearby || clean.places_nearby.length === 0) {
   
    return properties.map((p) => ({ property: p }));
  }

  const totalRequests = properties.length * clean.places_nearby.length;
  const useRateLimit = totalRequests > 20;

  const results = [];

  if (!useRateLimit) {
   
    return await Promise.all(
      properties.map(async (property) => {
        const nearbyPlacesFound = await Promise.all(
          clean.places_nearby.map(async (placeType) => {
            const placesFound = await searchNearby(
              property.latitude,
              property.longitude,
              placeType,
              radiusKm * 1000
            );
            const nearbyPlaces = placesFound.filter((place) => {
              const distance = haversineDistance(
                property.latitude,
                property.longitude,
                place.latitude,
                place.longitude
              );
              return distance <= radiusKm;
            });
            if (!nearbyPlaces.length) return null;
            return {
              placeType,
              places: nearbyPlaces.map((place) => ({
                name: place.name,
                distance: (place.distance / 1000).toFixed(2),
                coordinates: {
                  latitude: place.latitude,
                  longitude: place.longitude,
                },
              })),
            };
          })
        );

        const validPlaces = nearbyPlacesFound.filter(Boolean);
        return validPlaces.length > 0
          ? { property, nearby_places: validPlaces }
          : { property };
      })
    );
  }

  // Large batch → rate-limited
  const queue = [...properties];
  const inProgress = [];

  async function processNext() {
    if (!queue.length) return;
    const property = queue.shift();
    const nearbyPlacesFound = [];

    for (const placeType of clean.places_nearby) {
      const placesFound = await searchNearby(
        property.latitude,
        property.longitude,
        placeType,
        radiusKm * 1000
      );
      const nearbyPlaces = placesFound.filter((place) => {
        const distance = haversineDistance(
          property.latitude,
          property.longitude,
          place.latitude,
          place.longitude
        );
        return distance <= radiusKm;
      });
      if (nearbyPlaces.length) {
        nearbyPlacesFound.push({
          placeType,
          places: nearbyPlaces.map((place) => ({
            name: place.name,
            distance: (place.distance / 1000).toFixed(2),
            coordinates: {
              latitude: place.latitude,
              longitude: place.longitude,
            },
          })),
        });
      }
    }

    results.push(
      nearbyPlacesFound.length > 0
        ? { property, nearby_places: nearbyPlacesFound }
        : { property }
    );

    await processNext();
  }

  for (let i = 0; i < MAX_CONCURRENT_REQUESTS; i++) {
    inProgress.push(processNext());
  }

  await Promise.all(inProgress);
  return results;
}
router.post('/nlp-search', async (req, res) => {
  const { error, value } = searchSchema.validate(req.body);
  if (error) {
    logger.warn({ body: req.body, err: error.message }, "Validation failed");
    return res.status(400).json({ error: error.details[0].message });
  }
  const { query: userQuery, filter, sort, page, limit, priceRange } = value;

  try {
    logger.info({ query: userQuery }, "Search request received");

    const nlpOutput = await parseSearchQuery(userQuery);
    if (!nlpOutput)
      return res.status(400).json({ 
        error: "Not a real estate query", 
        message: "Please do relevant search in domain of real estate only",
        isNotRealEstate: true 
      });

    const clean = postProcess({ ...nlpOutput, query: userQuery });
    console.log("CLEANEDDDDD:",clean)

    // Prepare stored procedure parameters 
   let location = null;
if (Array.isArray(clean.location)) {
  location = clean.location.map(l => l.trim().toLowerCase()).join(",");
} else if (typeof clean.location === "string") {
  location = clean.location.trim().toLowerCase();
} else {
  location = null;
}

    const exactBedrooms = typeof clean.bedrooms === "number" ? clean.bedrooms : clean.bedrooms?.exact || null;
    const minBedrooms = exactBedrooms === null ? clean.bedrooms?.min || null : null;
    const maxBedrooms = exactBedrooms === null ? clean.bedrooms?.max || null : null;
    const exactBathrooms = typeof clean.bathrooms === "number" ? clean.bathrooms : clean.bathrooms?.exact || null;
    const minBathrooms = exactBathrooms === null ? clean.bathrooms?.min || null : null;
    const maxBathrooms = exactBathrooms === null ? clean.bathrooms?.max || null : null;
    const exactArea = typeof clean.area_range === "number" ? clean.area_range : clean.area_range?.exact || null;
    const minArea = exactArea === null ? clean.area_range?.min || null : null;
    const maxArea = exactArea === null ? clean.area_range?.max || null : null;
    const exactPrice = typeof clean.price === "number" ? clean.price : clean.price?.exact ?? null;
    const minPrice = exactPrice === null ? priceRange?.[0] ?? clean.price?.min ?? null : null;
    const maxPrice = exactPrice === null ? priceRange?.[1] ?? clean.price?.max ?? null : null;
    const exactMaintenance = typeof clean.monthly_maintenance === "number" ? clean.monthly_maintenance : clean.monthly_maintenance?.exact || null;
    const minMaintenance = exactMaintenance === null ? clean.monthly_maintenance?.min || null : null;
    const maxMaintenance = exactMaintenance === null ? clean.monthly_maintenance?.max || null : null;
    const exactDeposit = typeof clean.security_deposit === "number" ? clean.security_deposit : clean.security_deposit?.exact || null;
    const minDeposit = exactDeposit === null ? clean.security_deposit?.min || null : null;
    const maxDeposit = exactDeposit === null ? clean.security_deposit?.max || null : null;
    const exactYearBuilt = typeof clean.year_built === "number" ? clean.year_built : clean.year_built?.exact || null;
    const minYearBuilt = exactYearBuilt === null ? clean.year_built?.min || null : null;
    const maxYearBuilt = exactYearBuilt === null ? clean.year_built?.max || null : null;

    let listingType = null;
if (Array.isArray(clean.listing_type)) {
  listingType = clean.listing_type.join(",");
} else {
  listingType = filter && filter !== "all" ? filter : clean.listing_type || null;
}


let propertyType = null;
if (Array.isArray(clean.property_type)) {
  propertyType = clean.property_type.join(",");
} else {
  propertyType = clean.property_type || null;
}


let furnishingStatus = null;
if (Array.isArray(clean.furnishing_status)) {
  furnishingStatus = clean.furnishing_status.join(",");
} else {
  furnishingStatus = clean.furnishing_status || null;
}


let floor = null;
if (Array.isArray(clean.floor_level)) {
  floor = clean.floor_level.join(",");
} else {
  floor = clean.floor_level || null;
}


let leaseDuration = null;
if (Array.isArray(clean.lease_duration)) {
  leaseDuration = clean.lease_duration.join(",");
} else {
  leaseDuration = clean.lease_duration || null;
}

    const amenities = clean.amenities?.length ? clean.amenities.join(",") : null;

    
    const [rows] = await pool.query(
      `CALL GetFilteredPropertiesByFieldsGuest(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        location,
        minBedrooms,
        maxBedrooms,
        exactBedrooms,
        minBathrooms,
        maxBathrooms,
        exactBathrooms,
        minArea,
        maxArea,
        exactArea,
        minPrice,
        maxPrice,
        exactPrice,
        listingType,
        propertyType,
        furnishingStatus,
        floor,
        leaseDuration,
        minMaintenance,
        maxMaintenance,
        exactMaintenance,
        minDeposit,
        maxDeposit,
        exactDeposit,
        minYearBuilt,
        maxYearBuilt,
        exactYearBuilt,
        amenities,
       
      ]
    );

    let allProperties = rows[0] || [];
    logger.info({total: allProperties.length }, "Fetched properties from DB (filtered by stored procedure)");

    // Sorting
    switch (sort) {
      case "price-low":
        allProperties.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        allProperties.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "newest":
        allProperties.sort((a, b) => {
  const aDate =
    a.posted_at instanceof Date
      ? a.posted_at.getTime()
      : a.posted_at
      ? new Date(String(a.posted_at).replace(" ", "T")).getTime()
      : 0;

  const bDate =
    b.posted_at instanceof Date
      ? b.posted_at.getTime()
      : b.posted_at
      ? new Date(String(b.posted_at).replace(" ", "T")).getTime()
      : 0;

  return bDate - aDate;
});
        break;
      default:
        allProperties.sort((a, b) => b.is_featured - a.is_featured);
    }

  
    const totalCount = allProperties.length;
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const paginatedProperties = allProperties.slice(offset, offset + limit);

   
    const filteredPropertiesWithPlaces = await processNearbyPlaces(paginatedProperties, clean);

    return res.json({
      count: totalCount,
      totalPages,
      page,
      limit,
      properties: filteredPropertiesWithPlaces,
    });
  } catch (err) {
    logger.error({ err }, "Search route failed");
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/', async (req, res) => {
  try {
    // First test the connection
    const connection = await pool.getConnection();
    console.log('Database connection successful');

    // Test if the users table exists
    const [tables] = await connection.query('SHOW TABLES LIKE "users"');
    if (tables.length === 0) {
      connection.release();
      return res.status(404).json({ 
        error: 'Table not found',
        message: 'The users table does not exist in the database'
      });
    }

    // If we get here, try the actual query
    const [rows] = await connection.query('SELECT * FROM users');
    connection.release();
    res.json(rows);
  } catch (err) {
    console.error('Detailed DB Error:', {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      sqlMessage: err.sqlMessage,
      stack: err.stack
    });
    res.status(500).json({ 
      error: 'Database error',
      details: err.message,
      code: err.code
    });
  }
});

module.exports = router;
