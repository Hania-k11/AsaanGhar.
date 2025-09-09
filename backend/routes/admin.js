const express = require("express");
const router = express.Router();
const pool = require("../db"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";



router.get("/moderated-properties", async (req, res) => {
  const adminId = req.query.adminId; // or from JWT (recommended)
  
  if (!adminId) {
    return res.status(400).json({ success: false, message: "Admin ID required" });
  }

  try {
    const [rows] = await pool.query("CALL GetPropertiesByModeration(?)", [adminId]);
    res.json({ success: true, properties: rows[0] });
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
