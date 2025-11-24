const express = require("express");
const router = express.Router();
const pool = require("../db"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateAdmin } = require("../middleware/auth");


const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";




router.get("/properties",authenticateAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort_by = "posted_at",
      sort_order = "DESC",
      status = "all",
    } = req.query;

    const adminId = req.admin.user_id;

  
    const [results] = await pool.query(
      "CALL GetPropertiesByModeration(?, ?, ?, ?, ?, ?)",
      [adminId, Number(page), Number(limit), sort_by, sort_order, status]
    );

    
    const properties = results[0] || [];
    const totalCount = results[1]?.[0]?.total_count || 0;
    const totalPages = Math.ceil(totalCount / limit);


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
      data: properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalCount,
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
   
    res.json({ success: true, properties: rows[0] });
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

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({ success: true, message: "Admin Login successful" });
  } catch (err) {
    console.error("Admin Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// Logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("token");
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