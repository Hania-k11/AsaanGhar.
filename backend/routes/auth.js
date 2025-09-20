const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// =====================
// USER LOGIN
// =====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Fetch full row including password_hash in one query
    const [rows] = await pool.query(
      `SELECT 
         user_id, first_name, last_name, email, job_title, gender, phone_number,
         profile_picture_url, bio, city, is_verified, created_at, updated_at,
         status, role, password_hash
       FROM users 
       WHERE email = ? AND is_deleted = FALSE
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    if (user.status !== "active") {
      return res.status(403).json({ error: "Account is not active" });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Don’t leak password_hash back
    const { password_hash, ...userSafe } = user;

    return res.json({ message: "Login successful", user: userSafe });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// =====================
// CURRENT USER (/me)
// =====================
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, JWT_SECRET);

    // Optional: fetch fresh user from DB (to get updated info)
    const [rows] = await pool.query(
      `SELECT 
         user_id, first_name, last_name, email, job_title, gender, phone_number,
         profile_picture_url, bio, city, is_verified, created_at, updated_at,
         status, role
       FROM users 
       WHERE user_id = ? AND is_deleted = FALSE
       LIMIT 1`,
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user: rows[0] });
  } catch (err) {
    console.error("Me route error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

// =====================
// LOGOUT
// =====================
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;
