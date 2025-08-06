const express = require("express");
const { callGemini } = require("../utils/gemini");
const pool = require("../db");

const router = express.Router();

router.post("/gemini", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const result = await callGemini(query);
    res.json({ data: result });
  } catch (err) {
    console.error("Gemini route error:", err.message);
    res.status(500).json({ error: "Gemini failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connection successful");
    res.status(200).json({ message: "DB connected" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
      code: err.code,
    });
  }
});

module.exports = router;
