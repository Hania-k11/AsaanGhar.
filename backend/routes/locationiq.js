const express = require('express');
const axios = require('axios');
const router = express.Router();

const LOCATIONIQ_KEY = process.env.LOCATIONIQ_API_KEY;

router.get('/autocomplete', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || !q.trim()) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    console.log(`📍 Autocomplete query: "${q}"`);

    // Karachi bounding box
    const minLon = 66.8720, minLat = 24.6500;
    const maxLon = 67.3510, maxLat = 25.3000;

    const url = `https://us1.locationiq.com/v1/autocomplete.php` +
      `?key=${LOCATIONIQ_KEY}` +
      `&q=${encodeURIComponent(q)}` +
      `&limit=8` +
      `&format=json` +
      `&viewbox=${minLon},${minLat},${maxLon},${maxLat}` +
      `&bounded=1`;

    const response = await axios.get(url, {
      headers: { "Accept-Language": "en" },
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ LocationIQ error:", error.response?.data || error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

module.exports = router;
