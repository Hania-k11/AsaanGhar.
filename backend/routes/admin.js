const express = require("express");
const router = express.Router();
const pool = require("../db"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateAdmin } = require("../middleware/auth");


const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Helper function to parse images string from GROUP_CONCAT
function parsePropertyImages(property) {
  if (property.images && typeof property.images === 'string') {
    // Format: "image_id:image_url:is_main||image_id:image_url:is_main"
    const imageEntries = property.images.split('||');
    
    // Extract all image URLs into an array
    const imageUrls = imageEntries.map(entry => {
      const parts = entry.split(':');
      // Extract URL (everything except first and last part)
      return parts.slice(1, -1).join(':');
    }).filter(url => url); // Remove any empty URLs
    
    // Find main image
    const mainImageEntry = imageEntries.find(entry => entry.endsWith(':1'));
    
    if (mainImageEntry) {
      const parts = mainImageEntry.split(':');
      property.image = parts.slice(1, -1).join(':');
    } else if (imageUrls.length > 0) {
      // Fallback to first image if no main image
      property.image = imageUrls[0];
    }
    
    // Set images array for PropertyDetails component
    property.images = imageUrls;
  }
  return property;
}




router.get("/properties",authenticateAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort_by = "posted_at",
      sort_order = "DESC",
      status,
      search = '',
    } = req.query;

    const adminId = req.admin.id;

    // If status is undefined or 'undefined', use 'all'
    const filterStatus = (!status || status === 'undefined') ? 'all' : status;
  
    console.log('GetPropertiesByModeration params:', {
      adminId,
      page: Number(page),
      limit: Number(limit),
      sort_by,
      sort_order,
      filterStatus,
      search
    });

    const [results] = await pool.query(
      "CALL GetPropertiesByModeration(?, ?, ?, ?, ?, ?)",
      [adminId, Number(page), Number(limit), sort_by, sort_order, filterStatus]
    );

    
    let properties = results[0] || [];
    const totalCount = results[1]?.[0]?.total_count || 0;

    // Enrich properties with user verification status
    let enrichedProperties = await Promise.all(
      properties.map(async (property) => {
        const [userRows] = await pool.query(
          `SELECT first_name, last_name, email, phone_number, cnic, 
                  cnic_front_url, cnic_back_url, cnic_verified, phone_verified 
           FROM users 
           WHERE user_id = ? AND is_deleted = FALSE`,
          [property.owner_id]
        );
        
        const user = userRows[0] || {};
        
        return {
          ...property,
          owner_first_name: user.first_name || 'N/A',
          owner_last_name: user.last_name || 'N/A',
          owner_email: user.email || 'N/A',
          owner_phone: user.phone_number || 'N/A',
          owner_cnic: user.cnic || 'N/A',
          owner_cnic_front_url: user.cnic_front_url,
          owner_cnic_back_url: user.cnic_back_url,
          owner_cnic_verified: user.cnic_verified || 0,
          owner_phone_verified: user.phone_verified || 0,
        };
      })
    );

    // Apply search filter if search term is provided
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      enrichedProperties = enrichedProperties.filter(p => {
        return (
          p.title?.toLowerCase().includes(searchLower) ||
          p.property_id?.toString().includes(searchLower) ||
          p.location_city?.toLowerCase().includes(searchLower) ||
          p.location_name?.toLowerCase().includes(searchLower) ||
          p.owner_first_name?.toLowerCase().includes(searchLower) ||
          p.owner_last_name?.toLowerCase().includes(searchLower) ||
          `${p.owner_first_name} ${p.owner_last_name}`.toLowerCase().includes(searchLower)
        );
      });
    }

    // Calculate search-adjusted pagination
    const searchTotalCount = search && search.trim() ? enrichedProperties.length : totalCount;
    const totalPages = Math.ceil(searchTotalCount / limit);

    // Fetch all images and favorite counts for each property
    if (enrichedProperties.length > 0) {
      const propertyIds = enrichedProperties.map(p => p.property_id);
      
      const [imageRows] = await pool.query(
        `SELECT 
          property_id,
          GROUP_CONCAT(
            CONCAT(image_id, ':', image_url, ':', is_main) 
            ORDER BY is_main DESC, image_id ASC 
            SEPARATOR '||'
          ) AS images
        FROM property_images 
        WHERE property_id IN (?) 
        GROUP BY property_id`,
        [propertyIds]
      );

      const [favRows] = await pool.query(
        `SELECT property_id, COUNT(*) as count 
         FROM favorites 
         WHERE property_id IN (?) 
         GROUP BY property_id`,
        [propertyIds]
      );

      const imageMap = {};
      imageRows.forEach(row => {
        imageMap[row.property_id] = row.images;
      });

      const favMap = {};
      favRows.forEach(row => {
        favMap[row.property_id] = row.count;
      });

      enrichedProperties = enrichedProperties.map(p => {
        p.images = imageMap[p.property_id] || null;
        p.favorite_count = favMap[p.property_id] || 0;
        return parsePropertyImages(p);
      });
    }

    const [statsRows] = await pool.query(
      `
      SELECT 
        SUM(CASE WHEN p.approval_status = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
        SUM(CASE WHEN p.approval_status = 'approved' AND pm.admin_id = ? THEN 1 ELSE 0 END) AS approvedByAdminCount,
        SUM(CASE WHEN p.approval_status = 'rejected' AND pm.admin_id = ? THEN 1 ELSE 0 END) AS rejectedByAdminCount,
        COUNT(*) AS totalCount
      FROM properties p
      LEFT JOIN (
        SELECT m1.*
        FROM property_moderation m1
        JOIN (
          SELECT property_id, MAX(reviewed_at) AS latest_review
          FROM property_moderation
          GROUP BY property_id
        ) m2 
        ON m1.property_id = m2.property_id AND m1.reviewed_at = m2.latest_review
      ) pm 
      ON p.property_id = pm.property_id
      `,
      [adminId, adminId]
    );

    const stats = statsRows[0] || {};

    res.json({
      success: true,
      data: enrichedProperties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalCount: searchTotalCount,
        totalPages,
      },
      stats, 
    });
  } catch (err) {
    console.error("GetPropertiesByModeration error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});







router.get("/pending-properties", async (req, res) => {
  try {
    const [rows] = await pool.query("CALL GetPendingProperties()");
    let properties = rows[0] || [];

    // Fetch all images and favorite counts for each property
    if (properties.length > 0) {
      const propertyIds = properties.map(p => p.property_id);
      
      const [imageRows] = await pool.query(
        `SELECT 
          property_id,
          GROUP_CONCAT(
            CONCAT(image_id, ':', image_url, ':', is_main) 
            ORDER BY is_main DESC, image_id ASC 
            SEPARATOR '||'
          ) AS images
        FROM property_images 
        WHERE property_id IN (?) 
        GROUP BY property_id`,
        [propertyIds]
      );

      const [favRows] = await pool.query(
        `SELECT property_id, COUNT(*) as count 
         FROM favorites 
         WHERE property_id IN (?) 
         GROUP BY property_id`,
        [propertyIds]
      );

      const imageMap = {};
      imageRows.forEach(row => {
        imageMap[row.property_id] = row.images;
      });

      const favMap = {};
      favRows.forEach(row => {
        favMap[row.property_id] = row.count;
      });

      properties = properties.map(p => {
        p.images = imageMap[p.property_id] || null;
        p.favorite_count = favMap[p.property_id] || 0;
        return parsePropertyImages(p);
      });
    }
   
    res.json({ success: true, properties });
  } catch (err) {
    console.error("Error fetching pending properties:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [rows] = await pool.query(
      `SELECT user_id, email, role, password_hash FROM users WHERE email = ? AND is_deleted = FALSE LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = rows[0];

    if (admin.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Not an admin." });
    }

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: admin.user_id, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie with separate name for admin
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Fetch full admin details to return
    const [adminDetails] = await pool.query(
      `SELECT user_id, first_name, last_name, email, profile_picture_url, role 
       FROM users 
       WHERE user_id = ? AND is_deleted = FALSE LIMIT 1`,
      [admin.user_id]
    );

    const adminData = adminDetails[0];

    return res.json({ 
      success: true, 
      message: "Admin Login successful",
      admin: {
        id: adminData.user_id,
        email: adminData.email,
        name: `${adminData.first_name} ${adminData.last_name}`,
        profile_picture_url: adminData.profile_picture_url,
        role: adminData.role
      }
    });
  } catch (err) {
    console.error("Admin Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// Logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.json({ success: true, message: "Logged out" });
});

router.get("/me", authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT user_id, first_name, last_name, email, profile_picture_url, role 
       FROM users 
       WHERE user_id = ? AND is_deleted = FALSE AND role = 'admin' LIMIT 1`,
      [req.admin.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const admin = rows[0];

    res.json({
      success: true,
      admin: {
        id: admin.user_id,
        email: admin.email,
        name: `${admin.first_name} ${admin.last_name}`,
        profile_picture_url: admin.profile_picture_url,
        role: admin.role
      }
    });
  } catch (err) {
    console.error("Error in /api/admin/me:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});



router.post('/properties/:id/approve', authenticateAdmin, async (req, res) => {
  const propertyId = req.params.id;
  const adminId = req.admin.id; // Get from authenticated session
  try {
    await pool.query(
      `UPDATE properties SET approval_status = 'approved' WHERE property_id = ?`,
      [propertyId]
    );
    await pool.query(
      `INSERT INTO property_moderation (property_id, admin_id, action) VALUES (?, ?, 'approved')`,
      [propertyId, adminId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reject property
router.post('/properties/:id/reject', authenticateAdmin, async (req, res) => {
  const propertyId = req.params.id;
  const adminId = req.admin.id; // Get from authenticated session
  const { reason } = req.body;
  try {
    await pool.query(
      `UPDATE properties SET approval_status = 'rejected', rejection_reason = ? WHERE property_id = ?`,
      [reason, propertyId]
    );
    await pool.query(
      `INSERT INTO property_moderation (property_id, admin_id, action, reason) VALUES (?, ?, 'rejected', ?)`,
      [propertyId, adminId, reason]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get property documents
router.get('/properties/:id/documents', authenticateAdmin, async (req, res) => {
  const propertyId = req.params.id;
  try {
    const [documents] = await pool.query(
      `SELECT document_id, property_id, doc_type, doc_url, uploaded_at 
       FROM property_documents 
       WHERE property_id = ? 
       ORDER BY uploaded_at DESC`,
      [propertyId]
    );
    
    res.json({ success: true, documents });
  } catch (err) {
    console.error('Error fetching property documents:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// ============= USER MANAGEMENT ENDPOINTS =============

// Get all users with pagination and filtering
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'DESC',
      verification_status,
      search = ''
    } = req.query;

    // Build WHERE clause for filtering
    let whereClause = 'WHERE u.is_deleted = FALSE';
    const queryParams = [];

    // Filter by verification status
    if (verification_status && verification_status !== 'all') {
      if (verification_status === 'pending') {
        whereClause += ' AND u.cnic_verified = 2';
      } else if (verification_status === 'verified') {
        whereClause += ' AND u.cnic_verified = 1';
      } else if (verification_status === 'rejected') {
        whereClause += ' AND u.cnic_verified = 3';
      } else if (verification_status === 'not_submitted') {
        whereClause += ' AND u.cnic_verified = 0';
      }
    }

    // Search filter
    if (search) {
      whereClause += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR u.cnic LIKE ?)';
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM users u ${whereClause}`,
      queryParams
    );
    const totalCount = countResult[0].total;
    const totalPages = Math.ceil(totalCount / limit);

    // Validate sort_by to prevent SQL injection
    const allowedSortFields = ['created_at', 'first_name', 'last_name', 'email', 'cnic_verified'];
    const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortOrder = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Calculate offset
    const offset = (Number(page) - 1) * Number(limit);

    // Get users with pagination
    const [users] = await pool.query(
      `SELECT 
        u.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone_number,
        u.cnic,
        u.cnic_front_url,
        u.cnic_back_url,
        u.cnic_verified,
        u.created_at,
        u.status,
        u.city,
        u.is_verified
      FROM users u
      ${whereClause}
      ORDER BY u.${sortField} ${sortOrder}
      LIMIT ? OFFSET ?`,
      [...queryParams, Number(limit), offset]
    );

    // Get stats
    const [statsRows] = await pool.query(
      `SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN cnic_verified = 2 THEN 1 ELSE 0 END) as pendingVerifications,
        SUM(CASE WHEN cnic_verified = 1 THEN 1 ELSE 0 END) as verifiedUsers,
        SUM(CASE WHEN cnic_verified = 3 THEN 1 ELSE 0 END) as rejectedUsers,
        SUM(CASE WHEN cnic_verified = 0 THEN 1 ELSE 0 END) as notSubmittedUsers
      FROM users 
      WHERE is_deleted = FALSE`
    );

    const stats = statsRows[0] || {};

    res.json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalCount,
        totalPages,
      },
      stats,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Approve CNIC verification
router.post('/users/:id/verify-cnic', authenticateAdmin, async (req, res) => {
  const userId = req.params.id;
  
  try {
    // Check current verification status
    const [userRows] = await pool.query(
      'SELECT cnic_verified, first_name, last_name FROM users WHERE user_id = ? AND is_deleted = FALSE',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = userRows[0];

    // If already verified, return success with a message
    if (user.cnic_verified === 1) {
      return res.json({ 
        success: true, 
        message: 'CNIC is already verified',
        alreadyVerified: true 
      });
    }

    // Only allow verification if status is pending (2)
    if (user.cnic_verified !== 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'CNIC verification can only be approved for pending requests' 
      });
    }

    // Update to verified
    await pool.query(
      'UPDATE users SET cnic_verified = 1 WHERE user_id = ?',
      [userId]
    );

    res.json({ 
      success: true, 
      message: `CNIC verified for ${user.first_name} ${user.last_name}` 
    });
  } catch (err) {
    console.error('Error verifying CNIC:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reject CNIC verification
router.post('/users/:id/reject-cnic', authenticateAdmin, async (req, res) => {
  const userId = req.params.id;
  
  try {
    // Check current verification status
    const [userRows] = await pool.query(
      'SELECT cnic_verified, first_name, last_name FROM users WHERE user_id = ? AND is_deleted = FALSE',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = userRows[0];

    // Only allow rejection if status is pending (2)
    if (user.cnic_verified !== 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'CNIC verification can only be rejected for pending requests' 
      });
    }

    // Update to rejected
    await pool.query(
      'UPDATE users SET cnic_verified = 3 WHERE user_id = ?',
      [userId]
    );

    res.json({ 
      success: true, 
      message: `CNIC rejected for ${user.first_name} ${user.last_name}` 
    });
  } catch (err) {
    console.error('Error rejecting CNIC:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;