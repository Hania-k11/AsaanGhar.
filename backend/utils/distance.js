// utils/distance.js
const axios = require('axios');
const API_KEY = process.env.ORS_API_KEY;

async function getDistanceKm(origin, destination) {
  const url = `https://api.openrouteservice.org/v2/matrix/driving-car`;

  const body = {
    locations: [
      [origin.lon, origin.lat],
      [destination.lon, destination.lat],
    ],
    metrics: ['distance'],
    units: 'km',
  };

  const response = await axios.post(url, body, {
    headers: {
      Authorization: API_KEY,
      'Content-Type': 'application/json',
    },
  });

  return response.data.distances[0][1]; // distance in km
}

module.exports = { getDistanceKm };
