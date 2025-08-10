const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/post', async (req, res) => {
  try {
    const {
      owner_id,
      title,
      address,
      description,
      listing_type_id,
      price,
      street_address,
      city = 'Karachi',
      location_id,
      property_type_id,
      bedrooms,
      bathrooms,
      area_sqft,
      furnishing_status_id,
      floor,
      lease_duration,
      available_from,
      maintenance_fee,
      deposit,
      year_built,
      status = 'active',
      is_featured = false,
      created_by,
      latitude,
      longitude
    } = req.body;

    // Build a list of missing fields
    const missingFields = [];
    if (!owner_id) missingFields.push('owner_id');
    if (!title) missingFields.push('title');
    if (!address) missingFields.push('address');
    if (!description) missingFields.push('description');
    if (!listing_type_id) missingFields.push('listing_type_id');
    if (!price) missingFields.push('price');
    if (!street_address) missingFields.push('street_address');
    if (!location_id) missingFields.push('location_id');
    if (!property_type_id) missingFields.push('property_type_id');

    // If there are missing fields, send a detailed error response
    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    const sql = `
      INSERT INTO properties (
        owner_id, title, address, description, listing_type_id, price,
        street_address, city, location_id, property_type_id, bedrooms,
        bathrooms, area_sqft, furnishing_status_id, floor, lease_duration,
        available_from, maintenance_fee, deposit, year_built, status,
        is_featured, created_by, latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      owner_id,
      title,
      address,
      description,
      listing_type_id,
      price,
      street_address,
      city,
      location_id,
      property_type_id,
      bedrooms || null,
      bathrooms || null,
      area_sqft || null,
      furnishing_status_id || null,
      floor || null,
      lease_duration || null,
      available_from || null,
      maintenance_fee || null,
      deposit || null,
      year_built || null,
      status,
      is_featured,
      created_by || null,
      latitude || null,
      longitude || null
    ];

    await pool.query(sql, values);
    res.status(201).json({ message: 'Property saved successfully' });

  } catch (err) {
    console.error('Error saving property:', err);
    res.status(500).json({ error: 'Failed to save property' });
  }
});

module.exports = router;
