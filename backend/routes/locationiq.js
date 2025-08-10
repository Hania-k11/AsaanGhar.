const express = require('express');
const axios = require('axios');
const router = express.Router();
const pool = require('../db');

const LOCATIONIQ_KEY = process.env.LOCATIONIQ_API_KEY;

router.get('/autocomplete', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || !q.trim()) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    console.log(`Autocomplete request for query: "${q}"`);

    // Karachi bounding box
    const minLon = 66.8720;
    const minLat = 24.6500;
    const maxLon = 67.3510;
    const maxLat = 25.3000;

    const url = `https://us1.locationiq.com/v1/autocomplete.php` +
      `?key=${LOCATIONIQ_KEY}` +
      `&q=${encodeURIComponent(q)}` +
      `&limit=5` +
      `&format=json` +
      `&viewbox=${minLon},${minLat},${maxLon},${maxLat}` +
      `&bounded=1`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('LocationIQ error:', error.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

module.exports = router;
