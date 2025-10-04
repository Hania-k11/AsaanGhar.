const express = require('express');
const router = express.Router();
const pool = require('../db');

// Helpers
const toNum = (v, f) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : f;
};

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
      longitude,
    } = req.body;

    // Missing fields
    const missing = [];
    if (!owner_id) missing.push('owner_id');
    if (!title) missing.push('title');
    if (!address) missing.push('address');
    if (!description) missing.push('description');
    if (!listing_type_id) missing.push('listing_type_id');
    if (price === undefined || price === null || price === '') missing.push('price');
    if (!street_address) missing.push('street_address');
    if (!location_id) missing.push('location_id');
    if (!property_type_id) missing.push('property_type_id');

    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
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
      Number(listing_type_id),
      Number(price),
      street_address,
      city,
      Number(location_id),
      Number(property_type_id),
      bedrooms != null ? Number(bedrooms) : null,
      bathrooms != null ? Number(bathrooms) : null,
      area_sqft != null ? Number(area_sqft) : null,
      furnishing_status_id != null ? Number(furnishing_status_id) : null,
      floor ?? null,
      lease_duration ?? null,
      available_from ?? null,
      maintenance_fee != null ? Number(maintenance_fee) : null,
      deposit != null ? Number(deposit) : null,
      year_built != null ? Number(year_built) : null,
      status,
      !!is_featured,
      created_by ?? null,
      latitude != null ? Number(latitude) : null,
      longitude != null ? Number(longitude) : null,
    ];

    const [result] = await pool.query(sql, values);
    // Return the inserted id to the client for optimistic UX
    return res.status(201).json({
      success: true,
      message: 'Property saved successfully',
      property_id: result.insertId,
    });
  } catch (err) {
    console.error('Error saving property:', err);
    return res.status(500).json({ error: 'Failed to save property' });
  }
});

router.get('/getall', async (req, res) => {
  try {
    const {
      type = 'all',           // 'all' | 'sale' | 'rent'
      search = '',
      minPrice = 0,
      maxPrice = 9999999999,
      sort = 'featured',      // 'featured' | 'price-low' | 'price-high' | 'newest' | 'oldest'
      page = 1,
      limit = 6,
    } = req.query;

    const pageNum  = toNum(page, 1);
    const limitNum = toNum(limit, 6);
    const minNum   = toNum(minPrice, 0);
    const maxNum   = toNum(maxPrice, 9999999999);
    const offset   = (pageNum - 1) * limitNum;

    // Base WHERE (exclude soft-deleted)
    let base = 'FROM properties WHERE is_deleted = 0';
    const params = [];

    // Listing type
    if (type !== 'all') {
      const listing_type_id = type === 'rent' ? 1 : (type === 'sale' ? 2 : null);
      if (listing_type_id) {
        base += ' AND listing_type_id = ?';
        params.push(listing_type_id);
      }
    }

    // Search over title or city
    if (search) {
      base += ' AND (title LIKE ? OR city LIKE ?)';
      const like = `%${search}%`;
      params.push(like, like);
    }

    // Price range
    base += ' AND price BETWEEN ? AND ?';
    params.push(minNum, maxNum);

    // Sorting
    let orderBy = '';
    switch (sort) {
      case 'featured':
        orderBy = ' ORDER BY is_featured DESC, posted_at DESC';
        break;
      case 'price-low':
        orderBy = ' ORDER BY price ASC';
        break;
      case 'price-high':
        orderBy = ' ORDER BY price DESC';
        break;
      case 'newest':
        // Prefer posted_at; fallback to created_at or year_built if needed
        orderBy = ' ORDER BY posted_at DESC';
        break;
      case 'oldest':
        orderBy = ' ORDER BY posted_at ASC';
        break;
      default:
        orderBy = ' ORDER BY posted_at DESC';
    }

    // Final query
    const finalSql = `SELECT * ${base}${orderBy} LIMIT ? OFFSET ?`;
    const finalParams = [...params, limitNum, offset];

    const [rows] = await pool.query(finalSql, finalParams);

    // Count query mirrors filters (no order/limit/offset)
    const countSql = `SELECT COUNT(*) AS count ${base}`;
    const [countRows] = await pool.query(countSql, params);

    const total = countRows?.[0]?.count || 0;
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      data: rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (err) {
    console.error('Error retrieving properties:', err);
    return res.status(500).json({ error: 'Failed to retrieve properties' });
  }
});

router.get('/get', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM properties WHERE is_deleted = 0');
    if (!rows.length) {
      return res.status(404).json({ error: 'No properties found' });
    }
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error retrieving properties:', err);
    return res.status(500).json({ error: 'Failed to retrieve properties' });
  }
});

module.exports = router;
