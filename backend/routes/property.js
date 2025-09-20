// routes/property.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // your MySQL connection pool

// ----------------------
// NEW ENDPOINTS
// ----------------------

// GET user's own properties
// GET user's own properties (with subquery for favorites)
router.get('/getmyproperties/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const {
    type = 'all',
    search = '',
    minPrice = 0,
    maxPrice = 9999999999,
    sort = 'newest',
    page = 1,
    limit = 12,
    minBeds,
    minBaths,
    minArea,
    propertyType,
    furnishingStatus,
    status
  } = req.query;

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const minPriceNum = parseFloat(minPrice);
    const maxPriceNum = parseFloat(maxPrice);
    const offset = (page - 1) * limit;

    let query = `
     SELECT
    p.*,
    l.area AS location_name,
    l.city AS location_city,
    pt.name AS property_type_name,
    fs.name AS furnishing_status_name,
    COALESCE(fav.favorite_count, 0) AS favorite_count
FROM properties p
LEFT JOIN locations l ON p.location_id = l.location_id
LEFT JOIN property_types pt ON p.property_type_id = pt.property_type_id
LEFT JOIN furnishing_statuses fs ON p.furnishing_status_id = fs.furnishing_status_id
LEFT JOIN (
    SELECT property_id, COUNT(*) AS favorite_count
    FROM favorites
    GROUP BY property_id
) fav ON p.property_id = fav.property_id
WHERE p.owner_id = ?
    `;
    const params = [userId];

    // Apply filters
   // Replace the existing listingType filter logic (around line 45-50):
if (type !== 'all') {
  if (type === 'rent') {
    query += ' AND p.listing_type_id = 1';
    params.push();
  } else if (type === 'sale') {
    query += ' AND p.listing_type_id = 2';
    params.push();
  }
}

// Add this after the existing type filter:
if (req.query.listingType && req.query.listingType !== 'all') {
  const listingTypeId = req.query.listingType === 'rent' ? 1 : 2;
  query += ' AND p.listing_type_id = ?';
  params.push(listingTypeId);
}



    if (search) {
      query += ' AND (p.title LIKE ? OR l.city LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (minBeds) {
      query += ' AND p.bedrooms >= ?';
      params.push(parseInt(minBeds, 10));
    }

    if (minBaths) {
      query += ' AND p.bathrooms >= ?';
      params.push(parseInt(minBaths, 10));
    }

    if (minArea) {
      query += ' AND p.area_sqft >= ?';
      params.push(parseInt(minArea, 10));
    }

    if (propertyType) {
      const [propertyTypeRows] = await pool.query(
        'SELECT property_type_id FROM property_types WHERE name = ?',
        [propertyType]
      );
      if (propertyTypeRows.length > 0) {
        query += ' AND p.property_type_id = ?';
        params.push(propertyTypeRows[0].property_type_id);
      }
    }
    
    if (furnishingStatus) {
      query += ' AND fs.name = ?';
      params.push(furnishingStatus);
    }

    if (status && status !== 'all') {
      query += ' AND p.status = ?';
      params.push(status);
    }

    // Price filter
    query += ' AND p.price BETWEEN ? AND ?';
    params.push(minPriceNum, maxPriceNum);

    // Sorting
    switch (sort) {
      case 'newest':
        query += ' ORDER BY p.posted_at DESC';
        break;
      case 'oldest':
        query += ' ORDER BY p.posted_at ASC';
        break;
      case 'price_high':
        query += ' ORDER BY p.price DESC';
        break;
      case 'price_low':
        query += ' ORDER BY p.price ASC';
        break;
      case 'views_high':
        query += ' ORDER BY p.views DESC';
        break;
      default:
        query += ' ORDER BY p.posted_at DESC';
    }

    // Add pagination directly in SQL
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    // Run query
    const [rows] = await pool.query(query, params);

    // Get total count for pagination
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM properties p
       WHERE p.owner_id = ?
         AND p.price BETWEEN ? AND ?`,
      [userId, minPriceNum, maxPriceNum]
    );
    const totalCount = countRows[0].total;
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      data: rows,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    });

  } catch (err) {
    console.error('Error fetching user properties:', err);
    res.status(500).json({ error: 'Failed to retrieve user properties' });
  }
});


// GET property statistics for a user
router.get('/stats/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const [statsRows] = await pool.query(
            `SELECT
                COUNT(CASE WHEN status = 'active' THEN 1 ELSE NULL END) AS active_count,
                COUNT(CASE WHEN status = 'paused' THEN 1 ELSE NULL END) AS paused_count,
                COUNT(CASE WHEN status = 'sold' THEN 1 ELSE NULL END) AS sold_count,
                SUM(views) AS total_views,
                SUM(inquiries) AS total_inquiries
            FROM properties
            WHERE owner_id = ?`,
            [userId]
        );

        // This is the core fix to ensure a valid object is always returned
        const statistics = statsRows && statsRows.length > 0 ? statsRows[0] : {};

        // Create the final response data with default values
        const responseData = {
            active: statistics.active_count || 0,
            paused: statistics.paused_count || 0,
            sold: statistics.sold_count || 0,
            views: statistics.total_views || 0,
            inquiries: statistics.total_inquiries || 0,
        };

        // This log will show you what the backend is sending
        console.log("Backend sending stats:", responseData);

        res.status(200).json(responseData);
    } catch (err) {
        console.error('Error fetching property stats:', err);
        res.status(500).json({ error: 'Failed to retrieve property stats' });
    }
});

router.get('/favorites/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const {
    type = 'all',
    search = '',
    minPrice = 0,
    maxPrice = 9999999999,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = req.query;

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const minPriceNum = parseFloat(minPrice);
    const maxPriceNum = parseFloat(maxPrice);
    const offset = (page - 1) * limit;

    let query = `
      SELECT
        p.*,
        l.area AS location_name,
        l.city AS location_city,
        pt.name AS property_type_name,
        fs.name AS furnishing_status_name,
        lt.name AS listing_type_name,
        f.created_at AS favorited_at,
        COALESCE(fav_count.favorite_count, 0) AS favorite_count,
        pi.image_url AS image
      FROM favorites f
      JOIN properties p ON f.property_id = p.property_id
      LEFT JOIN locations l ON p.location_id = l.location_id
      LEFT JOIN property_types pt ON p.property_type_id = pt.property_type_id
      LEFT JOIN furnishing_statuses fs ON p.furnishing_status_id = fs.furnishing_status_id
      LEFT JOIN listing_types lt ON p.listing_type_id = lt.listing_type_id
      LEFT JOIN (
        SELECT property_id, COUNT(*) AS favorite_count
        FROM favorites
        GROUP BY property_id
      ) fav_count ON p.property_id = fav_count.property_id
      LEFT JOIN property_images pi ON p.property_id = pi.property_id AND pi.is_main = true
      WHERE f.user_id = ?
        AND p.status = 'active'
    `;
    const params = [userId];

    // Apply filters
    if (type !== 'all') {
      const listingTypeMap = { rent: 1, sale: 2 };
      const listingTypeId = listingTypeMap[type];
      if (listingTypeId) {
        query += ' AND p.listing_type_id = ?';
        params.push(listingTypeId);
      }
    }

    if (search) {
      query += ' AND (p.title LIKE ? OR l.city LIKE ? OR l.area LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Price filter
    query += ' AND p.price BETWEEN ? AND ?';
    params.push(minPriceNum, maxPriceNum);

    // Sorting
    switch (sort) {
      case 'newest':
        query += ' ORDER BY f.created_at DESC';
        break;
      case 'oldest':
        query += ' ORDER BY f.created_at ASC';
        break;
      case 'price_high':
        query += ' ORDER BY p.price DESC';
        break;
      case 'price_low':
        query += ' ORDER BY p.price ASC';
        break;
      case 'views_high':
        query += ' ORDER BY p.views DESC';
        break;
      case 'rating':
        query += ' ORDER BY p.views DESC'; // Using views as proxy for rating
        break;
      default:
        query += ' ORDER BY f.created_at DESC';
    }

    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const [rows] = await pool.query(query, params);

    // Get total count
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM favorites f
       JOIN properties p ON f.property_id = p.property_id
       WHERE f.user_id = ? AND p.status = 'active'
         AND p.price BETWEEN ? AND ?`,
      [userId, minPriceNum, maxPriceNum]
    );
    
    const totalCount = countRows[0].total;
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      data: rows,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    });

  } catch (err) {
    console.error('Error fetching favorite properties:', err);
    res.status(500).json({ error: 'Failed to retrieve favorite properties' });
  }
});

// PUT update property listing type
router.put('/:propertyId/listing-type', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  const { listing_type_id } = req.body;

  if (isNaN(propertyId) || !listing_type_id) {
    return res.status(400).json({ error: 'Invalid property ID or listing type' });
  }

  try {
    await pool.query('UPDATE properties SET listing_type_id = ? WHERE property_id = ?', [listing_type_id, propertyId]);
    res.status(200).json({ success: true, message: 'Property listing type updated successfully.' });
  } catch (err) {
    console.error('Error updating property listing type:', err);
    res.status(500).json({ error: 'Failed to update property listing type' });
  }
});

// POST add property to favorites
router.post('/favorites', async (req, res) => {
  const { userId, propertyId } = req.body;

  if (!userId || !propertyId) {
    return res.status(400).json({ error: 'User ID and Property ID are required' });
  }

  try {
    await pool.query(
      'INSERT INTO favorites (user_id, property_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP',
      [userId, propertyId]
    );
    res.status(201).json({ success: true, message: 'Property added to favorites' });
  } catch (err) {
    console.error('Error adding to favorites:', err);
    res.status(500).json({ error: 'Failed to add property to favorites' });
  }
});

// DELETE remove property from favorites
router.delete('/favorites/:userId/:propertyId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const propertyId = parseInt(req.params.propertyId, 10);

  if (isNaN(userId) || isNaN(propertyId)) {
    return res.status(400).json({ error: 'Invalid user ID or property ID' });
  }

  try {
    const [result] = await pool.query(
      'DELETE FROM favorites WHERE user_id = ? AND property_id = ?',
      [userId, propertyId]
    );
    
    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: 'Property removed from favorites' });
    } else {
      res.status(404).json({ error: 'Favorite not found' });
    }
  } catch (err) {
    console.error('Error removing from favorites:', err);
    res.status(500).json({ error: 'Failed to remove property from favorites' });
  }
});

// GET check if properties are favorited by user
router.get('/favorites/check/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { propertyIds } = req.query; // Comma-separated list

  if (isNaN(userId) || !propertyIds) {
    return res.status(400).json({ error: 'Invalid user ID or property IDs' });
  }

  try {
    const propertyIdArray = propertyIds.split(',').map(id => parseInt(id, 10));
    const placeholders = propertyIdArray.map(() => '?').join(',');
    
    const [rows] = await pool.query(
      `SELECT property_id FROM favorites WHERE user_id = ? AND property_id IN (${placeholders})`,
      [userId, ...propertyIdArray]
    );
    
    const favoriteIds = rows.map(row => row.property_id);
    res.status(200).json({ favoriteIds });
  } catch (err) {
    console.error('Error checking favorites:', err);
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
});



// PUT update property status
router.put('/:propertyId/status', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  const { status } = req.body;

  if (isNaN(propertyId) || !status) {
    return res.status(400).json({ error: 'Invalid property ID or status' });
  }

  try {
    await pool.query('UPDATE properties SET status = ? WHERE property_id = ?', [status, propertyId]);
    res.status(200).json({ success: true, message: 'Property status updated successfully.' });
  } catch (err) {
    console.error('Error updating property status:', err);
    res.status(500).json({ error: 'Failed to update property status' });
  }
});

// PUT update property details
router.put('/:propertyId', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  const updates = req.body;

  if (isNaN(propertyId) || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Invalid property ID or no updates provided' });
  }

  try {
    const updateKeys = Object.keys(updates);
    const updateValues = Object.values(updates);
    const setClause = updateKeys.map(key => `${key} = ?`).join(', ');

    const query = `UPDATE properties SET ${setClause} WHERE property_id = ?`;
    const params = [...updateValues, propertyId];

    await pool.query(query, params);
    res.status(200).json({ success: true, message: 'Property details updated successfully.' });
  } catch (err) {
    console.error('Error updating property details:', err);
    res.status(500).json({ error: 'Failed to update property details' });
  }
});


// DELETE a property
router.delete('/:propertyId', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);

  if (isNaN(propertyId)) {
    return res.status(400).json({ error: 'Invalid property ID' });
  }

  try {
    await pool.query('DELETE FROM properties WHERE property_id = ?', [propertyId]);
    res.status(200).json({ success: true, message: 'Property deleted successfully.' });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// ----------------------
// EXISTING ENDPOINTS (UNCHANGED)
// ----------------------
// GET properties excluding a specific user
router.get('/getallexclude/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const [rows] = await pool.query('CALL GetPropertiesExcludingUser(?)', [userId]);
    const properties = rows[0];
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ... (other existing router.get and router.post routes) ...


router.get('/getallnew/:user_id', async (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);

  if (isNaN(user_id)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const {
      type = 'all',
      search = '',
      minPrice = 0,
      maxPrice = 9999999999,
      sort = 'featured',
      page = 1,
      limit = 6,
    } = req.query;
    const minPriceNum = parseFloat(minPrice);
    const maxPriceNum = parseFloat(maxPrice);
    const offset = (page - 1) * limit;

    const [rows] = await pool.query('CALL GetPropertiesExcludingUser(?)', [Number(user_id)]);
    let properties = rows[0];

    if (type !== 'all') {
      const listingTypeMap = { rent: 1, sale: 2 };
      const listingTypeId = listingTypeMap[type];
      properties = properties.filter(p => p.listing_type_id === listingTypeId);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      properties = properties.filter(p =>
        (p.title && p.title.toLowerCase().includes(lowerSearch)) ||
        (p.location_city && p.location_city.toLowerCase().includes(lowerSearch))
      );
    }
    properties = properties.filter(p => {
      const priceNum = parseFloat(p.price);
      return priceNum >= minPriceNum && priceNum <= maxPriceNum;
    });
    switch (sort) {
      case 'featured':
        properties.sort((a, b) => b.is_featured - a.is_featured);
        break;
      case 'price-low':
        properties.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        properties.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'newest':
        properties.sort((a, b) => {
          const aDate = a.posted_at instanceof Date ? a.posted_at.getTime() : a.posted_at ? new Date(String(a.posted_at).replace(" ", "T")).getTime() : 0;
          const bDate = b.posted_at instanceof Date ? b.posted_at.getTime() : b.posted_at ? new Date(String(b.posted_at).replace(" ", "T")).getTime() : 0;
          return bDate - aDate;
        });
        break;
    }
    const totalCount = properties.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedData = properties.slice(offset, offset + Number(limit));

    res.status(200).json({
      data: paginatedData,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    });
  } catch (err) {
    console.error('Error retrieving properties:', err);
    res.status(500).json({ error: 'Failed to retrieve properties' });
  }
});

router.get('/getall', async (req, res) => {
  try {
    const {
      type = 'all',
      search = '',
      minPrice = 0,
      maxPrice = 9999999999,
      sort = 'featured',
      page = 1,
      limit = 6,
    } = req.query;
    const minPriceNum = parseFloat(minPrice);
    const maxPriceNum = parseFloat(maxPrice);
    const offset = (page - 1) * limit;

    const [rows] = await pool.query('CALL GetAllProperties()');
    let properties = rows[0];

    if (type !== 'all') {
      const listingTypeMap = { rent: 1, sale: 2 };
      const listingTypeId = listingTypeMap[type];
      properties = properties.filter(p => p.listing_type_id === listingTypeId);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      properties = properties.filter(p =>
        (p.title && p.title.toLowerCase().includes(lowerSearch)) ||
        (p.location_city && p.location_city.toLowerCase().includes(lowerSearch))
      );
    }

    properties = properties.filter(p => {
      const priceNum = parseFloat(p.price);
      return priceNum >= minPriceNum && priceNum <= maxPriceNum;
    });

    switch (sort) {
      case 'featured':
        properties.sort((a, b) => b.is_featured - a.is_featured);
        break;
      case 'price-low':
        properties.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        properties.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'newest':
        properties.sort((a, b) => {
          const aDate = a.posted_at instanceof Date ? a.posted_at.getTime() : a.posted_at ? new Date(String(a.posted_at).replace(" ", "T")).getTime() : 0;
          const bDate = b.posted_at instanceof Date ? b.posted_at.getTime() : b.posted_at ? new Date(String(b.posted_at).replace(" ", "T")).getTime() : 0;
          return bDate - aDate;
        });
        break;
    }

    const totalCount = properties.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedData = properties.slice(offset, offset + Number(limit));

    res.status(200).json({
      data: paginatedData,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    });
  } catch (err) {
    console.error('Error retrieving properties:', err);
    res.status(500).json({ error: 'Failed to retrieve properties' });
  }
});

// Endpoint to increment view count
router.post('/:propertyId/views', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  try {
    const [result] = await pool.query(
      'UPDATE properties SET views = views + 1 WHERE property_id = ?',
      [propertyId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ message: 'View count updated' });
  } catch (err) {
    console.error('Error updating view count:', err);
    res.status(500).json({ error: 'Failed to update view count' });
  }
});

// Endpoint to increment inquiry count
router.post('/:propertyId/inquiries', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  try {
    const [result] = await pool.query(
      'UPDATE properties SET inquiries = inquiries + 1 WHERE property_id = ?',
      [propertyId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ message: 'Inquiry count updated' });
  } catch (err) {
    console.error('Error updating inquiry count:', err);
    res.status(500).json({ error: 'Failed to update inquiry count' });
  }
});



router.post('/insert', async (req, res) => {
  const data = req.body;

  try {
    const [
      rows
    ] = await pool.query(
      `CALL sp_insert_full_property(
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      [
        data.owner_id,
        data.title,
        data.description,
        data.listing_type_name,
        data.price,
        data.address,
        data.street_address,
        data.location_area,
        data.location_city,
        data.property_type_name,
        data.bedrooms,
        data.bathrooms,
        data.area_sqft,
        data.furnishing_status_name,
        data.floor,
        data.lease_duration,
        data.available_from,
        data.maintenance_fee,
        data.deposit,
        data.year_built,
        data.nearby_places,
        data.latitude,
        data.longitude,
        data.contact_name,
        data.contact_email,
        data.contact_phone,
        data.contact_whatsapp,
        data.pref_email,
        data.pref_phone,
        data.pref_whatsapp,
        data.amenities
      ]
    );

    const result = rows[0][0];

    res.status(201).json({
      success: true,
      property_id: result.inserted_property_id,
      contact_id: result.inserted_contact_id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;