//utils/mapLogic.js

const { geocodeLocation } = require('./geocode');
const { searchNearby } = require('./places');
const { getDistance } = require('geolib'); // using geolib, not ORS here
const haversineDistance = require('./haversineDistance');

// Checks if any place of a certain type is nearby a given location name
async function isPlaceNearby(locationName, placeType = 'gym', radiusKm = 7) {
  const locationCoords = await geocodeLocation(locationName);
  const nearbyPlaces = await searchNearby(
    locationCoords.lat,
    locationCoords.lon,
    placeType,
    radiusKm * 1000
  );

  return {
    isNearby: nearbyPlaces.length > 0,
    places: nearbyPlaces,
  };
}


const isPropertyNearPlace = (propertyCoords, places, radiusKm) => {
  // Handle case where places is undefined or null
  if (!places || !Array.isArray(places)) {
    console.warn('⚠️ Invalid places data received:', places);
    return false;
  }

  // Ensure places array has required coordinates
  const validPlaces = places.filter(place => 
    place && 
    ((place.latitude && place.longitude) || 
     (place.lat && place.lon) ||
     (place.location && place.location.lat && place.location.lng))
  );

  if (validPlaces.length === 0) {
    console.warn('⚠️ No valid place coordinates found');
    return false;
  }

  return validPlaces.some(place => {
    const placeCoords = {
      lat: place.latitude || place.lat || place.location?.lat,
      lon: place.longitude || place.lon || place.location?.lng
    };
    
    const distance = haversineDistance(
  propertyCoords.lat,
  propertyCoords.lon,
  placeCoords.lat,
  placeCoords.lon

);

    console.log(`🏡 Property @ (${propertyCoords.lat}, ${propertyCoords.lon}) → 🌳 Place @ (${placeCoords.lat}, ${placeCoords.lon}) = ${distance.toFixed(2)} km`);

    return distance <= radiusKm;
  });
};

// ✅ Checks if the property is within radiusKm of any of the provided places
// function isPropertyNearPlace(propertyCoords, places, radiusKm) {
//   for (const place of places) {
//     const dist = getDistance(
//       { latitude: propertyCoords.lat, longitude: propertyCoords.lon },
//       { latitude: place.lat, longitude: place.lng }
//     );
//     if (dist <= radiusKm * 1000) {
//       return true;
//     }
//   }
//   return false;
// }

// ✅ Export both functions
module.exports = {
  isPlaceNearby,
  isPropertyNearPlace,
};