const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateUser } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// =====================
// GET USER SETTINGS
// =====================
router.get("/", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT 
         email_notifications, 
         property_alerts, 
         profile_visibility, 
         show_contact_info, 
         show_listings, 
         allow_messages
       FROM user_settings 
       WHERE user_id = ?
       LIMIT 1`,
      [userId]
    );

    // If no settings exist, create default settings
    if (rows.length === 0) {
      await pool.query(
        `INSERT INTO user_settings (user_id) VALUES (?)`,
        [userId]
      );
      
      return res.json({
        success: true,
        settings: {
          email_notifications: true,
          property_alerts: true,
          profile_visibility: "public",
          show_contact_info: true,
          show_listings: true,
          allow_messages: true,
        },
      });
    }

    return res.json({
      success: true,
      settings: rows[0],
    });
  } catch (err) {
    console.error("Get settings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// =====================
// UPDATE NOTIFICATION SETTINGS
// =====================
router.put("/notifications", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { email_notifications, property_alerts } = req.body;

    // Ensure settings record exists
    await pool.query(
      `INSERT INTO user_settings (user_id) VALUES (?)
       ON DUPLICATE KEY UPDATE user_id = user_id`,
      [userId]
    );

    // Update notification settings
    await pool.query(
      `UPDATE user_settings 
       SET email_notifications = ?, property_alerts = ?
       WHERE user_id = ?`,
      [email_notifications, property_alerts, userId]
    );

    return res.json({
      success: true,
      message: "Notification settings updated successfully",
    });
  } catch (err) {
    console.error("Update notification settings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// =====================
// UPDATE PRIVACY SETTINGS
// =====================
router.put("/privacy", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { profile_visibility, show_contact_info, show_listings, allow_messages } = req.body;

    // Ensure settings record exists
    await pool.query(
      `INSERT INTO user_settings (user_id) VALUES (?)
       ON DUPLICATE KEY UPDATE user_id = user_id`,
      [userId]
    );

    // Update privacy settings
    await pool.query(
      `UPDATE user_settings 
       SET profile_visibility = ?, 
           show_contact_info = ?, 
           show_listings = ?,
           allow_messages = ?
       WHERE user_id = ?`,
      [profile_visibility, show_contact_info, show_listings, allow_messages, userId]
    );

    return res.json({
      success: true,
      message: "Privacy settings updated successfully",
    });
  } catch (err) {
    console.error("Update privacy settings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// =====================
// CHANGE PASSWORD
// =====================
router.put("/password", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    // Fetch current password hash
    const [rows] = await pool.query(
      `SELECT password_hash FROM users WHERE user_id = ? AND is_deleted = FALSE`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!match) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.query(
      `UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
      [newPasswordHash, userId]
    );

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// =====================
// DELETE ACCOUNT
// =====================
router.delete("/account", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required to delete account" });
    }

    // Verify password before deletion
    const [rows] = await pool.query(
      `SELECT password_hash FROM users WHERE user_id = ? AND is_deleted = FALSE`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Soft delete the user
    await pool.query(
      `UPDATE users SET is_deleted = TRUE, status = 'suspended', updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
      [userId]
    );

    // Clear the auth cookie
    res.clearCookie("token");

    return res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;