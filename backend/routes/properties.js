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



router.get('/getall', async (req, res) => {
  try {
    // Parse query params with sane defaults
    const {
      type = 'all',           // 'all', 'sale', 'rent'
      search = '',            // search term in title or location
      minPrice = 0,           // minimum price (in whatever unit)
      maxPrice = 9999999999,  // max price large number by default
      sort = 'featured',      // 'featured', 'price-low', 'price-high', 'newest', 'rating'
      page = 1,               // current page
      limit = 6               // items per page
    } = req.query;

    const offset = (page - 1) * limit;

    // Build base SQL query
    let baseQuery = 'SELECT * FROM properties WHERE 1=1';
    const params = [];

   if (type !== 'all') {
  let listing_type_id = null;
  if (type === 'rent') listing_type_id = 1;
  else if (type === 'sale') listing_type_id = 2;

  if (listing_type_id !== null) {
    baseQuery += ' AND listing_type_id = ?';
    params.push(listing_type_id);
  }
}

    // Filter by search term (title or location LIKE %search%)
    if (search) {
      baseQuery += ' AND (title LIKE ? OR city LIKE ?)'; //LOCATION TO CITY
      const likeSearch = `%${search}%`;
      params.push(likeSearch, likeSearch);
    }

    // Filter by price range
    // You must store price as a number in DB or extract it properly before comparison.
    // Assuming `price` column stores numeric price (remove currency formatting before storing!)
    baseQuery += ' AND price BETWEEN ? AND ?';
    params.push(minPrice, maxPrice);

    // Sorting
    let orderBy = '';
switch (sort) {
  case 'featured':
    orderBy = ' ORDER BY is_featured DESC';
    break;
  case 'price-low':
    orderBy = ' ORDER BY price ASC';
    break;
  case 'price-high':
    orderBy = ' ORDER BY price DESC';
    break;
  case 'newest':
    orderBy = ' ORDER BY year_built DESC';
    break;
  default:
    orderBy = '';
}


    // Pagination
    const limitOffset = ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    // Final query
    const finalQuery = baseQuery + orderBy + limitOffset;

    // Execute query
    const [rows] = await pool.query(finalQuery, params);

    // Count total matching rows for pagination info
    const countQuery = baseQuery.replace('SELECT *', 'SELECT COUNT(*) as count');
    const [countRows] = await pool.query(countQuery, params.slice(0, params.length - 2));
    const totalCount = countRows[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Return paginated data + meta
    res.status(200).json({
      data: rows,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      }
    });
  } catch (err) {
    console.error('Error retrieving properties:', err);
    res.status(500).json({ error: 'Failed to retrieve properties' });
  }
});


router.get('/get', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM properties');

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No properties found' });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error retrieving properties:', err);
    res.status(500).json({ error: 'Failed to retrieve properties' });
  }
});

module.exports = router;
