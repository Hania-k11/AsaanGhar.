const express = require("express");
const router = express.Router();
const pool = require("../db"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";



router.get("/moderated-properties", async (req, res) => {
  const adminId = req.query.adminId;
  const page = parseInt(req.query.page) || 1;       // default page 1
  const limit = parseInt(req.query.limit) || 6;     // default 6 items per page
  const sortBy = (req.query.sortBy || req.query.sortByDate || "newest").toLowerCase(); // "newest" or "oldest"
  const listingType = req.query.listingType || null; // "rent", "sale", or null for all
  const statusFilter = (req.query.statusFilter || "all").toLowerCase(); // 'all' | 'pending' | 'approved' | 'rejected'

  if (!adminId) {
    return res.status(400).json({ success: false, message: "Admin ID required" });
  }

  try {
    let properties = [];
    if (statusFilter === 'all') {
      // Use stored procedure for the combined logic
      const [rows] = await pool.query(
        "CALL GetPropertiesByModeration(?, ?, ?, ?, ?)",
        [adminId, page, limit, sortBy, listingType]
      );
      properties = rows[0];
    } else {
      // Compose query that mirrors SP with status filtering
      const [rows] = await pool.query(
        `WITH amenities_agg AS (
            SELECT
              pa.property_id,
              GROUP_CONCAT(DISTINCT a.name ORDER BY a.name SEPARATOR ', ') AS amenities
            FROM property_amenities pa
            JOIN amenities a ON pa.amenity_id = a.amenity_id
            GROUP BY pa.property_id
          ),
          pm_latest AS (
            SELECT pm1.*
            FROM property_moderation pm1
            INNER JOIN (
              SELECT property_id, MAX(reviewed_at) AS max_reviewed_at
              FROM property_moderation
              GROUP BY property_id
            ) latest
              ON latest.property_id = pm1.property_id
             AND latest.max_reviewed_at = pm1.reviewed_at
          )
          SELECT 
            p.property_id,
            p.owner_id,
            p.title,
            p.description,
            p.price,
            p.address,
            p.street_address,
            l.location_id,
            l.area AS location_name,
            l.city AS location_city,
            lt.listing_type_id,
            lt.name AS listing_type_name,
            pt.property_type_id,
            pt.name AS property_type_name,
            p.bedrooms,
            p.bathrooms,
            p.area_sqft,
            fs.furnishing_status_id,
            fs.name AS furnishing_status_name,
            p.floor,
            p.lease_duration,
            p.available_from,
            p.maintenance_fee,
            p.deposit,
            p.year_built,
            p.views,
            p.inquiries,
            p.days_listed,
            p.status,
            p.approval_status,
            p.nearby_places,
            p.is_featured,
            p.posted_at,
            p.updated_at,
            p.created_by,
            p.updated_by,
            p.is_deleted,
            p.latitude,
            p.longitude,
            aa.amenities,
            c.contact_id,
            c.contact_name,
            c.contact_email,
            c.contact_phone,
            c.contact_whatsapp,
            pc.pref_email,
            pc.pref_phone,
            pc.pref_whatsapp,
            pm_latest.admin_id  AS moderated_by,
            pm_latest.action    AS moderation_action,
            pm_latest.reason    AS moderation_reason,
            pm_latest.reviewed_at AS moderation_date
          FROM properties p
          LEFT JOIN listing_types lt       ON p.listing_type_id = lt.listing_type_id
          LEFT JOIN property_types pt      ON p.property_type_id = pt.property_type_id
          LEFT JOIN furnishing_statuses fs ON p.furnishing_status_id = fs.furnishing_status_id
          LEFT JOIN locations l            ON p.location_id = l.location_id
          LEFT JOIN amenities_agg aa       ON aa.property_id = p.property_id
          LEFT JOIN property_contacts pc   ON p.property_id = pc.property_id
          LEFT JOIN contacts c             ON pc.contact_id = c.contact_id
          LEFT JOIN pm_latest              ON pm_latest.property_id = p.property_id
          WHERE 
            p.is_deleted = 0
            AND (
              (? = 'pending'  AND p.approval_status = 'pending') OR
              (? = 'approved' AND p.approval_status = 'approved' AND pm_latest.admin_id = ?) OR
              (? = 'rejected' AND p.approval_status = 'rejected' AND pm_latest.admin_id = ?)
            )
            AND (? IS NULL OR lt.name = ?)
          ORDER BY
            CASE WHEN ? = 'newest' THEN p.posted_at END DESC,
            CASE WHEN ? = 'oldest' THEN p.posted_at END ASC
          LIMIT ? OFFSET ?`,
        [
          statusFilter,
          statusFilter, adminId,
          statusFilter, adminId,
          listingType, listingType,
          sortBy, sortBy,
          limit, (page - 1) * limit
        ]
      );
      properties = rows;
    }

    // Compute total count with the same pm_latest logic as the stored procedure
    const [countRows] = await pool.query(
      `WITH pm_latest AS (
         SELECT pm1.*
         FROM property_moderation pm1
         INNER JOIN (
           SELECT property_id, MAX(reviewed_at) AS max_reviewed_at
           FROM property_moderation
           GROUP BY property_id
         ) latest
           ON latest.property_id = pm1.property_id
          AND latest.max_reviewed_at = pm1.reviewed_at
       )
       SELECT COUNT(*) AS totalCount
       FROM properties p
       LEFT JOIN listing_types lt ON p.listing_type_id = lt.listing_type_id
       LEFT JOIN pm_latest ON pm_latest.property_id = p.property_id
       WHERE p.is_deleted = 0
         AND (
           (? = 'all' AND (
              p.approval_status = 'pending' OR (
                p.approval_status IN ('approved','rejected') AND pm_latest.admin_id = ?
              )
           )) OR
           (? = 'pending'  AND p.approval_status = 'pending') OR
           (? = 'approved' AND p.approval_status = 'approved' AND pm_latest.admin_id = ?) OR
           (? = 'rejected' AND p.approval_status = 'rejected' AND pm_latest.admin_id = ?)
         )
         AND (? IS NULL OR lt.name = ?)`,
      [
        statusFilter, adminId,
        statusFilter,
        statusFilter, adminId,
        statusFilter, adminId,
        listingType, listingType
      ]
    );

    const totalCount = countRows[0]?.totalCount || 0;

    // Stats: pending total, approved-by-admin, rejected-by-admin
    const [statsRows] = await pool.query(
      `WITH pm_latest AS (
         SELECT pm1.*
         FROM property_moderation pm1
         INNER JOIN (
           SELECT property_id, MAX(reviewed_at) AS max_reviewed_at
           FROM property_moderation
           GROUP BY property_id
         ) latest
           ON latest.property_id = pm1.property_id
          AND latest.max_reviewed_at = pm1.reviewed_at
       )
       SELECT
         SUM(CASE WHEN p.approval_status = 'pending' THEN 1 ELSE 0 END) AS pendingCount,
         SUM(CASE WHEN p.approval_status = 'approved' AND pm_latest.admin_id = ? THEN 1 ELSE 0 END) AS approvedByAdminCount,
         SUM(CASE WHEN p.approval_status = 'rejected' AND pm_latest.admin_id = ? THEN 1 ELSE 0 END) AS rejectedByAdminCount
       FROM properties p
       LEFT JOIN listing_types lt ON p.listing_type_id = lt.listing_type_id
       LEFT JOIN pm_latest ON pm_latest.property_id = p.property_id
       WHERE p.is_deleted = 0
         AND (? IS NULL OR lt.name = ?)`,
      [adminId, adminId, listingType, listingType]
    );
    const stats = statsRows[0] || { pendingCount: 0, approvedByAdminCount: 0, rejectedByAdminCount: 0 };
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    res.json({
      success: true,
      properties,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stats,
    });
  } catch (err) {
    console.error("Error fetching moderated properties:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});




router.get("/pending-properties", async (req, res) => {
  try {
    const [rows] = await pool.query("CALL GetPendingProperties()");
   
    res.json({ success: true, properties: rows[0] });
  } catch (err) {
    console.error("Error fetching pending properties:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT user_id, first_name, last_name, email, password_hash, role FROM users WHERE email = ? AND role='admin' AND is_deleted=0 LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      // Email not found
      return res.status(401).json({ success: false, message: "Email does not exist" });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      // Password incorrect
      return res.status(401).json({ success: false, message: "Password is incorrect" });
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: admin.user_id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: "8h" });

    // Send token as HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      admin: {
        user_id: admin.user_id,
        name: `${admin.first_name} ${admin.last_name}`,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
});

router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ success: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // <-- may throw
    const [rows] = await pool.query(
      "SELECT user_id, first_name, last_name, email, role FROM users WHERE user_id = ? AND role='admin' AND is_deleted=0",
      [decoded.user_id]
    );

    if (!rows.length) return res.json({ success: false, message: "Admin not found" });

    const admin = rows[0];
    res.json({ success: true, admin: { 
      user_id: admin.user_id,
      name: `${admin.first_name} ${admin.last_name}`,
      email: admin.email,
      role: admin.role
    } });
  } catch (err) {
    console.error("Error in /api/admin/me:", err);
    return res.status(500).json({ success: false, message: "Invalid token or server error" });
  }
});



router.post('/properties/:id/approve', async (req, res) => {
  const propertyId = req.params.id;
  const adminId = req.body.adminId;
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
router.post('/properties/:id/reject', async (req, res) => {
  const propertyId = req.params.id;
  const { adminId, reason } = req.body;
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


module.exports = router;