const pool = require('../db');

async function queryProperties({
  locationFilters = [],
  rooms,
  bathrooms,
  property_type,
  listing_type,
  availability,
  priceMin,
  priceMax,
  searchTerm = '',
  sort = 'featured',
  page = 1,
  limit = 6,
}) {
  const offset = (page - 1) * limit;

  let sql = `
    SELECT
      p.*,
      l.city AS location_city,
      l.area AS location_area,
      pt.name AS property_type_name,
      lt.name AS listing_type_name,
      fs.name AS furnishing_status_name
    FROM properties p
    JOIN locations l ON p.location_id = l.location_id
    JOIN property_types pt ON p.property_type_id = pt.property_type_id
    JOIN listing_types lt ON p.listing_type_id = lt.listing_type_id
    LEFT JOIN furnishing_statuses fs ON p.furnishing_status_id = fs.furnishing_status_id
  `;

  // Base conditions
  const conditions = ['1=1'];
  const params = [];

  // Location filters (OR between areas)
  if (locationFilters.length > 0) {
    const locationConditions = locationFilters.map(() => `l.area LIKE ?`).join(' OR ');
    conditions.push(`(${locationConditions})`);
    locationFilters.forEach(loc => params.push(`%${loc}%`));
  }

  if (rooms !== undefined && rooms !== null) {
    conditions.push('p.bedrooms = ?');
    params.push(rooms);
  }

  if (bathrooms !== undefined && bathrooms !== null) {
    conditions.push('p.bathrooms = ?');
    params.push(bathrooms);
  }

  if (property_type) {
    conditions.push('pt.name = ?');
    params.push(property_type);
  }

  if (listing_type) {
    // If listing_type provided explicitly
    conditions.push('lt.name = ?');
    params.push(listing_type);
  } else {
    // Default to rent or sale if no listing_type specified
    conditions.push('lt.name IN (?, ?)');
    params.push('rent', 'sale');
  }

  if (availability) {
    conditions.push('p.available_from <= ?');
    params.push(availability);
  }

  // Price filtering, only if priceMin or priceMax are numbers (0 is valid)
  if (typeof priceMin === 'number') {
    conditions.push('p.price >= ?');
    params.push(priceMin);
  }
  if (typeof priceMax === 'number') {
    conditions.push('p.price <= ?');
    params.push(priceMax);
  }

  if (searchTerm && searchTerm.trim() !== '') {
    conditions.push('(p.title LIKE ? OR l.city LIKE ?)');
    params.push(`%${searchTerm}%`, `%${searchTerm}%`);
  }

  // Combine WHERE clause
  sql += ' WHERE ' + conditions.join(' AND ');

  // Sorting logic
  let orderBy = '';
  switch (sort) {
    case 'featured':
      orderBy = ' ORDER BY p.is_featured DESC, p.posted_at DESC';
      break;
    case 'price-low':
      orderBy = ' ORDER BY p.price ASC';
      break;
    case 'price-high':
      orderBy = ' ORDER BY p.price DESC';
      break;
    case 'newest':
      orderBy = ' ORDER BY p.posted_at DESC';
      break;
    default:
      // fallback sorting
      orderBy = ' ORDER BY p.is_featured DESC, p.posted_at DESC';
  }
  sql += orderBy;

  // Pagination
  sql += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  // Execute main query
  const [rows] = await pool.query(sql, params);

  // Build count query with same filters but no order/limit/offset
  const countSql = `
    SELECT COUNT(*) AS count
    FROM properties p
    JOIN locations l ON p.location_id = l.location_id
    JOIN property_types pt ON p.property_type_id = pt.property_type_id
    JOIN listing_types lt ON p.listing_type_id = lt.listing_type_id
    LEFT JOIN furnishing_statuses fs ON p.furnishing_status_id = fs.furnishing_status_id
    WHERE ${conditions.join(' AND ')}
  `;

  // Remove limit and offset params for count query
  const countParams = params.slice(0, params.length - 2);

  const [countRows] = await pool.query(countSql, countParams);
  const totalCount = countRows[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: rows,
    totalCount,
    totalPages,
  };
}

module.exports = { queryProperties };
