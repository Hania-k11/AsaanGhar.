const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/autocomplete", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    const url = `https://us1.locationiq.com/v1/autocomplete?key=${process.env.LOCATIONIQ_TOKEN}&q=${encodeURIComponent(
      q
    )}&limit=8&countrycodes=PK&viewbox=66.9000,24.7500,67.2000,25.0500&bounded=1`;

    const response = await axios.get(url, {
      headers: { "Accept-Language": "en" },
    });

    res.json(response.data);
  } catch (err) {
    console.error("LocationIQ error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

module.exports = router;
