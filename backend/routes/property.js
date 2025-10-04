// routes/property.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// ----------------------
// Helpers
// ----------------------
function parseNum(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
function parseIntSafe(value) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
}

// Whitelist for safe partial updates
const ALLOWED_UPDATE_FIELDS = new Set([
  // core
  'title', 'description', 'price', 'status',
  'address', 'street_address',
  'bedrooms', 'bathrooms', 'area_sqft',
  'floor', 'lease_duration', 'available_from',
  'maintenance_fee', 'deposit', 'year_built',
  'nearby_places', 'latitude', 'longitude',
  // fks by id
  'listing_type_id', 'location_id', 'property_type_id', 'furnishing_status_id',
  // contact fields
  'contact_name', 'contact_email', 'contact_phone', 'contact_whatsapp',
  'pref_email', 'pref_phone', 'pref_whatsapp',
  // flags
  'is_featured',
]);

// ----------------------
// NEW ENDPOINTS
// ----------------------

// GET user's own properties (exclude soft-deleted)
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
    status,
    listingType,
  } = req.query;

  if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const minPriceNum = parseNum(minPrice, 0);
    const maxPriceNum = parseNum(maxPrice, 9999999999);
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const offset = (pageNum - 1) * limitNum;

    // Resolve propertyType to id
    let propertyTypeId = null;
    if (propertyType) {
      const [rows] = await pool.query(
        'SELECT property_type_id FROM property_types WHERE name = ?',
        [propertyType]
      );
      if (rows.length) propertyTypeId = rows[0].property_type_id;
    }

    // Determine listing type exactly once (listingType query param overrides "type" tab if present)
    const explicitListingTypeId =
      listingType === 'rent' ? 1 :
      listingType === 'sale' ? 2 : null;

    const tabListingTypeId =
      type === 'rent' ? 1 :
      type === 'sale' ? 2 : null;

    const resolvedListingTypeId = explicitListingTypeId ?? tabListingTypeId;

    let selectSql = `
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
        AND p.is_deleted = 0
    `;
    const selectParams = [userId];

    let countSql = `
      SELECT COUNT(*) AS total
      FROM properties p
      LEFT JOIN locations l ON p.location_id = l.location_id
      LEFT JOIN property_types pt ON p.property_type_id = pt.property_type_id
      LEFT JOIN furnishing_statuses fs ON p.furnishing_status_id = fs.furnishing_status_id
      WHERE p.owner_id = ?
        AND p.is_deleted = 0
    `;
    const countParams = [userId];

    if (resolvedListingTypeId) {
      selectSql += ' AND p.listing_type_id = ?';
      countSql  += ' AND p.listing_type_id = ?';
      selectParams.push(resolvedListingTypeId);
      countParams.push(resolvedListingTypeId);
    }

    if (search) {
      const like = `%${search}%`;
      // include title, city, area for better matching
      selectSql += ' AND (p.title LIKE ? OR l.city LIKE ? OR l.area LIKE ?)';
      countSql  += ' AND (p.title LIKE ? OR l.city LIKE ? OR l.area LIKE ?)';
      selectParams.push(like, like, like);
      countParams.push(like, like, like);
    }

    const minBedsNum = parseIntSafe(minBeds);
    const minBathsNum = parseIntSafe(minBaths);
    const minAreaNum = parseIntSafe(minArea);

    if (Number.isFinite(minBedsNum)) {
      selectSql += ' AND p.bedrooms >= ?';
      countSql  += ' AND p.bedrooms >= ?';
      selectParams.push(minBedsNum);
      countParams.push(minBedsNum);
    }
    if (Number.isFinite(minBathsNum)) {
      selectSql += ' AND p.bathrooms >= ?';
      countSql  += ' AND p.bathrooms >= ?';
      selectParams.push(minBathsNum);
      countParams.push(minBathsNum);
    }
    if (Number.isFinite(minAreaNum)) {
      selectSql += ' AND p.area_sqft >= ?';
      countSql  += ' AND p.area_sqft >= ?';
      selectParams.push(minAreaNum);
      countParams.push(minAreaNum);
    }

    if (propertyTypeId) {
      selectSql += ' AND p.property_type_id = ?';
      countSql  += ' AND p.property_type_id = ?';
      selectParams.push(propertyTypeId);
      countParams.push(propertyTypeId);
    }

    if (furnishingStatus) {
      selectSql += ' AND fs.name = ?';
      countSql  += ' AND fs.name = ?';
      selectParams.push(furnishingStatus);
      countParams.push(furnishingStatus);
    }

    if (status && status !== 'all') {
      selectSql += ' AND p.status = ?';
      countSql  += ' AND p.status = ?';
      selectParams.push(status);
      countParams.push(status);
    }

    selectSql += ' AND p.price BETWEEN ? AND ?';
    countSql  += ' AND p.price BETWEEN ? AND ?';
    selectParams.push(minPriceNum, maxPriceNum);
    countParams.push(minPriceNum, maxPriceNum);

    switch (sort) {
      case 'newest':     selectSql += ' ORDER BY p.posted_at DESC'; break;
      case 'oldest':     selectSql += ' ORDER BY p.posted_at ASC'; break;
      case 'price_high': selectSql += ' ORDER BY p.price DESC';     break;
      case 'price_low':  selectSql += ' ORDER BY p.price ASC';      break;
      case 'views_high': selectSql += ' ORDER BY p.views DESC';     break;
      default:           selectSql += ' ORDER BY p.posted_at DESC';
    }

    selectSql += ' LIMIT ? OFFSET ?';
    selectParams.push(limitNum, offset);

    const [rows] = await pool.query(selectSql, selectParams);
    const [countRows] = await pool.query(countSql, countParams);

    const totalCount = countRows[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      data: rows,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (err) {
    console.error('Error fetching user properties:', err);
    res.status(500).json({ error: 'Failed to retrieve user properties' });
  }
});

// Stats (exclude deleted)
router.get('/stats/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const [rows] = await pool.query(
      `SELECT
          COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_count,
          COUNT(CASE WHEN status = 'paused' THEN 1 END) AS paused_count,
          COUNT(CASE WHEN status = 'sold' THEN 1 END)   AS sold_count,
          SUM(views) AS total_views,
          SUM(inquiries) AS total_inquiries
       FROM properties
       WHERE owner_id = ?
         AND is_deleted = 0`,
      [userId]
    );

    const r = rows?.[0] || {};
    res.status(200).json({
      active: r.active_count || 0,
      paused: r.paused_count || 0,
      sold: r.sold_count || 0,
      views: r.total_views || 0,
      inquiries: r.total_inquiries || 0,
    });
  } catch (err) {
    console.error('Error fetching property stats:', err);
    res.status(500).json({ error: 'Failed to retrieve property stats' });
  }
});

// Favorites list (exclude deleted)
router.get('/favorites/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { type = 'all', search = '', minPrice = 0, maxPrice = 9999999999, sort = 'newest', page = 1, limit = 12 } = req.query;
  if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const minPriceNum = parseNum(minPrice, 0);
    const maxPriceNum = parseNum(maxPrice, 9999999999);
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const offset = (pageNum - 1) * limitNum;

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
      LEFT JOIN property_images pi ON p.property_id = pi.property_id AND pi.is_main = 1
      WHERE f.user_id = ?
        AND p.status = 'active'
        AND p.is_deleted = 0
    `;
    const params = [userId];

    if (type !== 'all') {
      const map = { rent: 1, sale: 2 };
      const id = map[type];
      if (id) { query += ' AND p.listing_type_id = ?'; params.push(id); }
    }

    if (search) {
      query += ' AND (p.title LIKE ? OR l.city LIKE ? OR l.area LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' AND p.price BETWEEN ? AND ?';
    params.push(minPriceNum, maxPriceNum);

    switch (sort) {
      case 'newest':     query += ' ORDER BY f.created_at DESC'; break;
      case 'oldest':     query += ' ORDER BY f.created_at ASC';  break;
      case 'price_high': query += ' ORDER BY p.price DESC';       break;
      case 'price_low':  query += ' ORDER BY p.price ASC';        break;
      case 'views_high': query += ' ORDER BY p.views DESC';       break;
      default:           query += ' ORDER BY f.created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    const [rows] = await pool.query(query, params);

    // count (same where)
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM favorites f
      JOIN properties p ON f.property_id = p.property_id
      LEFT JOIN locations l ON p.location_id = l.location_id
      WHERE f.user_id = ?
        AND p.status = 'active'
        AND p.is_deleted = 0
    `;
    const countParams = [userId];

    if (type !== 'all') {
      const map = { rent: 1, sale: 2 };
      const id = map[type];
      if (id) { countQuery += ' AND p.listing_type_id = ?'; countParams.push(id); }
    }
    if (search) {
      countQuery += ' AND (p.title LIKE ? OR l.city LIKE ? OR l.area LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    countQuery += ' AND p.price BETWEEN ? AND ?';
    countParams.push(minPriceNum, maxPriceNum);

    const [countRows] = await pool.query(countQuery, countParams);
    const totalCount = countRows?.[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      data: rows,
      pagination: { total: totalCount, page: pageNum, limit: limitNum, totalPages },
    });
  } catch (err) {
    console.error('Error fetching favorite properties:', err);
    res.status(500).json({ error: 'Failed to retrieve favorite properties' });
  }
});

// Update listing type (🔒 ignore deleted)
router.put('/:propertyId/listing-type', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  const { listing_type_id } = req.body;
  if (isNaN(propertyId) || !listing_type_id) return res.status(400).json({ error: 'Invalid property ID or listing type' });

  try {
    const [r] = await pool.query(
      'UPDATE properties SET listing_type_id = ? WHERE property_id = ? AND is_deleted = 0', // 🔒
      [listing_type_id, propertyId]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Property not found or deleted' });
    res.status(200).json({ success: true, message: 'Property listing type updated successfully.' });
  } catch (err) {
    console.error('Error updating property listing type:', err);
    res.status(500).json({ error: 'Failed to update property listing type' });
  }
});

// Favorites add/remove/check (unchanged semantics)
router.post('/favorites', async (req, res) => {
  const { userId, propertyId } = req.body;
  if (!userId || !propertyId) return res.status(400).json({ error: 'User ID and Property ID are required' });

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

router.delete('/favorites/:userId/:propertyId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const propertyId = parseInt(req.params.propertyId, 10);
  if (isNaN(userId) || isNaN(propertyId)) return res.status(400).json({ error: 'Invalid user ID or property ID' });

  try {
    const [result] = await pool.query('DELETE FROM favorites WHERE user_id = ? AND property_id = ?', [userId, propertyId]);
    if (result.affectedRows > 0) return res.status(200).json({ success: true, message: 'Property removed from favorites' });
    res.status(404).json({ error: 'Favorite not found' });
  } catch (err) {
    console.error('Error removing from favorites:', err);
    res.status(500).json({ error: 'Failed to remove property from favorites' });
  }
});

router.get('/favorites/check/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { propertyIds } = req.query;
  if (isNaN(userId) || !propertyIds) return res.status(400).json({ error: 'Invalid user ID or property IDs' });

  try {
    const arr = propertyIds
      .split(',')
      .map(id => parseInt(id, 10))
      .filter(n => Number.isFinite(n));

    if (!arr.length) {
      return res.status(400).json({ error: 'No valid property IDs provided' });
    }

    const placeholders = arr.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT property_id FROM favorites WHERE user_id = ? AND property_id IN (${placeholders})`,
      [userId, ...arr]
    );
    res.status(200).json({ favoriteIds: rows.map(r => r.property_id) });
  } catch (err) {
    console.error('Error checking favorites:', err);
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
});

// Update status (🔒 ignore deleted)
router.put('/:propertyId/status', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  const { status } = req.body;
  if (isNaN(propertyId) || !status) return res.status(400).json({ error: 'Invalid property ID or status' });

  try {
    const [r] = await pool.query(
      'UPDATE properties SET status = ? WHERE property_id = ? AND is_deleted = 0', // 🔒
      [status, propertyId]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Property not found or deleted' });
    res.status(200).json({ success: true, message: 'Property status updated successfully.' });
  } catch (err) {
    console.error('Error updating property status:', err);
    res.status(500).json({ error: 'Failed to update property status' });
  }
});

// Update details (safe whitelist) (🔒 ignore deleted)
router.put('/:propertyId', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  const body = req.body || {};
  if (isNaN(propertyId)) {
    return res.status(400).json({ error: 'Invalid property ID' });
  }

  // Pick only allowed fields
  const keys = Object.keys(body).filter(k => ALLOWED_UPDATE_FIELDS.has(k));
  if (!keys.length) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }

  try {
    const vals = keys.map(k => body[k]);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const [r] = await pool.query(
      `UPDATE properties SET ${setClause} WHERE property_id = ? AND is_deleted = 0`, // 🔒
      [...vals, propertyId]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: 'Property not found or deleted' });
    res.status(200).json({ success: true, message: 'Property details updated successfully.' });
  } catch (err) {
    console.error('Error updating property details:', err);
    res.status(500).json({ error: 'Failed to update property details' });
  }
});

// SOFT DELETE (idempotent): sets is_deleted = 1
router.delete('/:propertyId', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  if (isNaN(propertyId)) return res.status(400).json({ error: 'Invalid property ID' });

  try {
    const [result] = await pool.query(
      'UPDATE properties SET is_deleted = 1 WHERE property_id = ? AND is_deleted = 0',
      [propertyId]
    );

    if (result.affectedRows === 0) {
      // Either not found or already deleted; make it idempotent & friendly
      const [rows] = await pool.query(
        'SELECT property_id, is_deleted FROM properties WHERE property_id = ? LIMIT 1',
        [propertyId]
      );
      if (!rows.length) return res.status(404).json({ error: 'Property not found' });
      return res.status(200).json({ success: true, message: 'Property already deleted.' });
    }

    res.status(200).json({ success: true, message: 'Property moved to trash.' });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// (Optional) RESTORE from trash
router.patch('/:propertyId/restore', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  if (isNaN(propertyId)) return res.status(400).json({ error: 'Invalid property ID' });

  try {
    const [result] = await pool.query(
      'UPDATE properties SET is_deleted = 0 WHERE property_id = ? AND is_deleted = 1',
      [propertyId]
    );

    if (result.affectedRows === 0) {
      const [rows] = await pool.query('SELECT property_id FROM properties WHERE property_id = ? LIMIT 1', [propertyId]);
      if (!rows.length) return res.status(404).json({ error: 'Property not found' });
      return res.status(200).json({ success: true, message: 'Property was not in trash.' });
    }

    res.status(200).json({ success: true, message: 'Property restored.' });
  } catch (err) {
    console.error('Error restoring property:', err);
    res.status(500).json({ error: 'Failed to restore property' });
  }
});

// (Optional) HARD DELETE (only if you ever add a Trash screen + “Delete forever”)
router.delete('/:propertyId/hard', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  if (isNaN(propertyId)) return res.status(400).json({ error: 'Invalid property ID' });

  try {
    const [result] = await pool.query('DELETE FROM properties WHERE property_id = ?', [propertyId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Property not found' });
    res.status(200).json({ success: true, message: 'Property permanently deleted.' });
  } catch (err) {
    console.error('Error hard deleting property:', err);
    res.status(500).json({ error: 'Failed to hard delete property' });
  }
});

// ----------------------
// Public feeds (exclude deleted)
// ----------------------
router.get('/getallexclude/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const [rows] = await pool.query('CALL GetPropertiesExcludingUser(?)', [userId]);
    const properties = (rows[0] || []).filter(p => !p.is_deleted || p.is_deleted === 0);
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getallnew/:user_id', async (req, res) => {
  const user_id = parseInt(req.params.user_id, 10);
  if (isNaN(user_id)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const { type = 'all', search = '', minPrice = 0, maxPrice = 9999999999, sort = 'featured', page = 1, limit = 6 } = req.query;
    const minPriceNum = parseNum(minPrice, 0);
    const maxPriceNum = parseNum(maxPrice, 9999999999);
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 6;
    const offset = (pageNum - 1) * limitNum;

    const [rows] = await pool.query('CALL GetPropertiesExcludingUser(?)', [Number(user_id)]);
    let properties = (rows[0] || []).filter(p => !p.is_deleted || p.is_deleted === 0);

    if (type !== 'all') {
      const map = { rent: 1, sale: 2 };
      const id = map[type];
      properties = properties.filter(p => p.listing_type_id === id);
    }

    if (search) {
      const q = search.toLowerCase();
      properties = properties.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.location_city && p.location_city.toLowerCase().includes(q)) ||
        (p.location_name && p.location_name.toLowerCase().includes(q))
      );
    }

    properties = properties.filter(p => {
      const priceNum = parseFloat(p.price);
      return priceNum >= minPriceNum && priceNum <= maxPriceNum;
    });

    switch (sort) {
      case 'featured':   properties.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)); break;
      case 'price-low':  properties.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break;
      case 'price-high': properties.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break;
      case 'newest':
        properties.sort((a, b) => {
          const aDate = a.posted_at ? new Date(String(a.posted_at).replace(' ', 'T')).getTime() : 0;
          const bDate = b.posted_at ? new Date(String(b.posted_at).replace(' ', 'T')).getTime() : 0;
          return bDate - aDate;
        });
        break;
    }

    const totalCount = properties.length;
    const totalPages = Math.ceil(totalCount / limitNum);
    const paginatedData = properties.slice(offset, offset + Number(limitNum));

    res.status(200).json({
      data: paginatedData,
      pagination: { total: totalCount, page: pageNum, limit: limitNum, totalPages },
    });
  } catch (err) {
    console.error('Error retrieving properties:', err);
    res.status(500).json({ error: 'Failed to retrieve properties' });
  }
});

// Unified public getall with locations join (exclude deleted)
router.get('/getall', async (req, res) => {
  try {
    const { type = 'all', search = '', minPrice = 0, maxPrice = 9999999999, sort = 'featured', page = 1, limit = 6 } = req.query;
    const minPriceNum = parseNum(minPrice, 0);
    const maxPriceNum = parseNum(maxPrice, 9999999999);
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 6;
    const offset = (pageNum - 1) * limitNum;

    let base = `
      FROM properties p
      LEFT JOIN locations l ON p.location_id = l.location_id
      WHERE p.is_deleted = 0
    `;
    const params = [];

    if (type !== 'all') {
      const id = type === 'rent' ? 1 : type === 'sale' ? 2 : null;
      if (id) { base += ' AND p.listing_type_id = ?'; params.push(id); }
    }

    if (search) {
      base += ' AND (p.title LIKE ? OR l.city LIKE ? OR l.area LIKE ?)';
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    base += ' AND p.price BETWEEN ? AND ?';
    params.push(minPriceNum, maxPriceNum);

    let orderBy = '';
    switch (sort) {
      case 'featured':   orderBy = ' ORDER BY p.is_featured DESC'; break;
      case 'price-low':  orderBy = ' ORDER BY p.price ASC'; break;
      case 'price-high': orderBy = ' ORDER BY p.price DESC'; break;
      case 'newest':     orderBy = ' ORDER BY p.posted_at DESC'; break;
      default:           orderBy = '';
    }

    const final = `SELECT p.*, l.city AS location_city, l.area AS location_name ${base}${orderBy} LIMIT ? OFFSET ?`;
    const finalParams = [...params, limitNum, offset];

    const [rows] = await pool.query(final, finalParams);

    const countQuery = `SELECT COUNT(*) AS count ${base}`;
    const [countRows] = await pool.query(countQuery, params);

    const total = countRows?.[0]?.count || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      data: rows,
      pagination: { total, page: pageNum, limit: limitNum, totalPages },
    });
  } catch (err) {
    console.error('Error retrieving properties:', err);
    res.status(500).json({ error: 'Failed to retrieve properties' });
  }
});

// Counters (🔒 ignore deleted)
router.post('/:propertyId/views', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  try {
    const [r] = await pool.query(
      'UPDATE properties SET views = views + 1 WHERE property_id = ? AND is_deleted = 0', // 🔒
      [propertyId]
    );
    if (r.affectedRows === 0) return res.status(404).json({ message: 'Property not found or deleted' });
    res.status(200).json({ message: 'View count updated' });
  } catch (err) {
    console.error('Error updating view count:', err);
    res.status(500).json({ error: 'Failed to update view count' });
  }
});
router.post('/:propertyId/inquiries', async (req, res) => {
  const propertyId = parseInt(req.params.propertyId, 10);
  try {
    const [r] = await pool.query(
      'UPDATE properties SET inquiries = inquiries + 1 WHERE property_id = ? AND is_deleted = 0', // 🔒
      [propertyId]
    );
    if (r.affectedRows === 0) return res.status(404).json({ message: 'Property not found or deleted' });
    res.status(200).json({ message: 'Inquiry count updated' });
  } catch (err) {
    console.error('Error updating inquiry count:', err);
    res.status(500).json({ error: 'Failed to update inquiry count' });
  }
});

// Insert via stored procedure (unchanged)
router.post('/insert', async (req, res) => {
  const data = req.body;
  try {
    const [rows] = await pool.query(
      `CALL sp_insert_full_property(
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      [
        data.owner_id, data.title, data.description, data.listing_type_name, data.price, data.address,
        data.street_address, data.location_area, data.location_city, data.property_type_name, data.bedrooms,
        data.bathrooms, data.area_sqft, data.furnishing_status_name, data.floor, data.lease_duration,
        data.available_from, data.maintenance_fee, data.deposit, data.year_built, data.nearby_places,
        data.latitude, data.longitude, data.contact_name, data.contact_email, data.contact_phone,
        data.contact_whatsapp, data.pref_email, data.pref_phone, data.pref_whatsapp, data.amenities
      ]
    );
    const result = rows[0][0];
    res.status(201).json({ success: true, property_id: result.inserted_property_id, contact_id: result.inserted_contact_id });
  } catch (error) {
    console.error('sp_insert_full_property error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
//.
module.exports = router;
