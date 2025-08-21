const express = require("express");
const router = express.Router();
const parseUserQuery = require("../utils/parseSearchQuery");
const postProcess = require("../utils/postProcessNLP");
const { searchNearby } = require("../utils/places");
const haversineDistance = require("../utils/haversineDistance");
const searchSchema = require("../validators/searchSchema");
const logger = require("../utils/logger");
const pool = require("../db");

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

router.post("/search/:user_id", async (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);
  if (isNaN(user_id)) return res.status(400).json({ error: "Invalid user ID" });

  const { error, value } = searchSchema.validate(req.body);
  if (error) {
    logger.warn({ body: req.body, err: error.message }, "Validation failed");
    return res.status(400).json({ error: error.details[0].message });
  }

  const { query: userQuery, filter, sort, page, limit, priceRange } = value;

  try {
    logger.info({ user_id, query: userQuery }, "Search request received");

    const nlpOutput = await parseUserQuery(userQuery);
    if (!nlpOutput.parsed)
      return res.status(400).json({ error: "Failed to parse query" });

    const clean = postProcess({ ...nlpOutput.parsed, query: userQuery });
    console.log("CLEANEDDDDD:",clean)

    // Prepare stored procedure parameters (same as your current code)
    const location = clean.location || null;
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
    const listingType = filter && filter !== "all" ? filter : clean.listing_type || null;
    const propertyType = clean.property_type || null;
    const furnishingStatus = clean.furnishing_status || null;
    const floor = clean.floor_level || null;
    const leaseDuration = clean.lease_duration || null;
    const amenities = clean.amenities?.length ? clean.amenities.join(",") : null;

    // Fetch all matching properties from DB
    const [rows] = await pool.query(
      `CALL GetFilteredPropertiesByFields(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
        user_id,
      ]
    );

    let allProperties = rows[0] || [];
    logger.info({ user_id, total: allProperties.length }, "Fetched properties from DB");

    // Sorting
    switch (sort) {
      case "price-low":
        allProperties.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        allProperties.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "newest":
        allProperties.sort((a, b) => new Date(b.posted_at) - new Date(a.posted_at));
        break;
      default:
        allProperties.sort((a, b) => b.is_featured - a.is_featured);
    }

    // Pagination
    const totalCount = allProperties.length;
    const totalPages = Math.ceil(totalCount / limit);
    const offset = (page - 1) * limit;
    const paginatedProperties = allProperties.slice(offset, offset + limit);

    // Only now fetch nearby places for paginated results
    const filteredPropertiesWithPlaces = await processNearbyPlaces(paginatedProperties, clean);

    return res.json({
      count: totalCount,
      totalPages,
      page,
      limit,
      properties: filteredPropertiesWithPlaces,
    });
  } catch (err) {
    logger.error({ user_id, err }, "Search route failed");
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
