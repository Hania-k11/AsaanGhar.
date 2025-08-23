// routes/property.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // your MySQL connection pool

// GET properties excluding a specific user
router.get('/getallexclude/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const [rows] = await pool.query('CALL GetPropertiesExcludingUser(?)', [userId]);
        // MySQL CALL returns an array of result sets, we want the first one
        const properties = rows[0]; 
        res.json(properties);
    } catch (err) {
        console.error('Error fetching properties:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//--------------
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

    // Ensure minPrice and maxPrice are numbers
    const minPriceNum = parseFloat(minPrice);
    const maxPriceNum = parseFloat(maxPrice);

    const offset = (page - 1) * limit;

    // Call stored procedure
    const [rows] = await pool.query('CALL GetPropertiesExcludingUser(?)', [Number(user_id)]);
    let properties = rows[0]; // Get the first result set

    console.log('Initial properties from stored procedure:', properties);

    // Apply filters
    if (type !== 'all') {
      const listingTypeMap = { rent: 1, sale: 2 };
      const listingTypeId = listingTypeMap[type];
      properties = properties.filter(p => p.listing_type_id === listingTypeId);
      console.log('After type filter:', properties);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      properties = properties.filter(p => 
        (p.title && p.title.toLowerCase().includes(lowerSearch)) ||
        (p.location_city && p.location_city.toLowerCase().includes(lowerSearch))
      );
      console.log('After search filter:', properties);
    }

    // Convert price to number for filtering
    properties = properties.filter(p => {
      const priceNum = parseFloat(p.price);
      return priceNum >= minPriceNum && priceNum <= maxPriceNum;
    });
    console.log('After price filter:', properties);

    // Sorting
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
  const aDate =
    a.posted_at instanceof Date
      ? a.posted_at.getTime()
      : a.posted_at
      ? new Date(String(a.posted_at).replace(" ", "T")).getTime()
      : 0;

  const bDate =
    b.posted_at instanceof Date
      ? b.posted_at.getTime()
      : b.posted_at
      ? new Date(String(b.posted_at).replace(" ", "T")).getTime()
      : 0;

  return bDate - aDate;
});

        break;
    }
    console.log('After sorting:', properties);

    // Pagination
    const totalCount = properties.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedData = properties.slice(offset, offset + Number(limit));
    console.log('Paginated data:', paginatedData);

    res.status(200).json({
      data: paginatedData, // Send filtered/paginated data
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

    // Ensure minPrice and maxPrice are numbers
    const minPriceNum = parseFloat(minPrice);
    const maxPriceNum = parseFloat(maxPrice);

    const offset = (page - 1) * limit;

    // Call stored procedure
   const [rows] = await pool.query('CALL GetAllProperties()');
    let properties = rows[0];


    console.log('Initial properties from stored procedure:', properties);

    // Apply filters
    if (type !== 'all') {
      const listingTypeMap = { rent: 1, sale: 2 };
      const listingTypeId = listingTypeMap[type];
      properties = properties.filter(p => p.listing_type_id === listingTypeId);
      console.log('After type filter:', properties);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      properties = properties.filter(p => 
        (p.title && p.title.toLowerCase().includes(lowerSearch)) ||
        (p.location_city && p.location_city.toLowerCase().includes(lowerSearch))
      );
      console.log('After search filter:', properties);
    }

    // Convert price to number for filtering
    properties = properties.filter(p => {
      const priceNum = parseFloat(p.price);
      return priceNum >= minPriceNum && priceNum <= maxPriceNum;
    });
    console.log('After price filter:', properties);

    // Sorting
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
  const aDate =
    a.posted_at instanceof Date
      ? a.posted_at.getTime()
      : a.posted_at
      ? new Date(String(a.posted_at).replace(" ", "T")).getTime()
      : 0;

  const bDate =
    b.posted_at instanceof Date
      ? b.posted_at.getTime()
      : b.posted_at
      ? new Date(String(b.posted_at).replace(" ", "T")).getTime()
      : 0;

  return bDate - aDate;
});
        break;
    }
    console.log('After sorting:', properties);

    // Pagination
    const totalCount = properties.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedData = properties.slice(offset, offset + Number(limit));
    console.log('Paginated data:', paginatedData);

    res.status(200).json({
      data: paginatedData, // Send filtered/paginated data
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
        data.amenities // comma-separated string, e.g., "Gym,Pool"
      ]
    );

    // Stored procedure returns first element in rows
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
