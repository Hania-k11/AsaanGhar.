const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const { OAuth2Client } = require("google-auth-library");
const { sendVerificationEmail } = require("../utils/emailService");
const { sendVerificationSMS } = require("../utils/smsService");
const {
  generateCode,
  createUnverifiedUser,
  verifyAndActivateUser,
  resendVerificationCodes,
} = require("../utils/verificationCode");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Google token is required" });
  }

  try {
    // Verify the ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture, given_name, family_name } = payload;

    //  Check if the user already exists in your database
    let [rows] = await pool.query(
      "SELECT user_id, first_name, last_name, email, profile_picture_url, status, role FROM users WHERE email = ? AND is_deleted = FALSE LIMIT 1",
      [email]
    );

    let user;

    if (rows.length === 0) {
      // User does not exist: Register the new user
      const defaultPasswordHash = await bcrypt.hash(Math.random().toString(36), 10); // Dummy hash for social users

      // Insertion
      const [insertResult] = await pool.query(
        `INSERT INTO users (
            first_name, last_name, email, password_hash, profile_picture_url, 
            status, role, is_verified, is_deleted, job_title, gender, bio, city, phone_number
        ) 
        VALUES (?, ?, ?, ?, ?, 'active', 'user', TRUE, FALSE, NULL, NULL, NULL, NULL, NULL)`,
        [
            given_name || name.split(' ')[0], 
            family_name || name.split(' ')[1] || '', 
            email, 
            defaultPasswordHash, 
            picture
        ]
      );

      // Fetch the newly created user data
      user = {
        user_id: insertResult.insertId,
        first_name: given_name || name.split(' ')[0],
        last_name: family_name || name.split(' ')[1] || '',
        email,
        profile_picture_url: picture,
        status: 'active',
        role: 'user',
        is_verified: true,
      };

    } else {
      // User exists: Log them in
      user = rows[0];
      if (user.status !== "active") {
        return res.status(403).json({ error: "Account is not active" });
      }
      // Optional: Update profile picture if it changed
      await pool.query(
        "UPDATE users SET profile_picture_url = ? WHERE user_id = ?",
        [picture, user.user_id]
      );
    }
    
    // Create and Set JWT
    const jwtToken = jwt.sign(
      { id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Ensure only safe user data is returned
    const userSafe = { ...user };
    delete userSafe.password_hash; // In case the select pulled it (though it shouldn't have)

    return res.json({ message: "Google Login successful", user: userSafe });

  } catch (err) {
    console.error("Google Login error:", err);
    // Be specific about token errors
    if (err.message.includes('Invalid token') || err.message.includes('Token used too late')) {
        return res.status(401).json({ error: "Invalid or expired Google token" });
    }
    return res.status(500).json({ error: "Internal server error during Google login" });
  }
});
// =====================
// USER SIGNUP
// =====================
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, jobTitle } = req.body;

    // Validate required fields (phone is now optional)
    if (!firstName || !lastName || !email || !password || !gender) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Check if email already exists
    const [emailCheck] = await pool.query(
      "SELECT user_id FROM users WHERE email = ? AND is_deleted = FALSE LIMIT 1",
      [email]
    );

    if (emailCheck.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Generate email verification code only
    const emailCode = generateCode();

    // Create user with pending verification status
    const passwordHash = await bcrypt.hash(password, 10);
    
    const [insertResult] = await pool.query(
      `INSERT INTO users 
       (first_name, last_name, email, password_hash, job_title, gender, 
        is_verified, status, role, is_deleted) 
       VALUES (?, ?, ?, ?, ?, ?, FALSE, 'active', 'user', 0)`,
      [firstName, lastName, email, passwordHash, jobTitle || null, gender]
    );

    const userId = insertResult.insertId;

    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store email verification code only
    await pool.query(
      `INSERT INTO verification_codes 
       (user_id, email_code, expires_at) 
       VALUES (?, ?, ?)`,
      [userId, emailCode, expiresAt]
    );

    // Send verification email
    try {
      await sendVerificationEmail(email, emailCode, firstName);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Clean up user if email fails
      await pool.query('DELETE FROM users WHERE user_id = ?', [userId]);
      return res.status(500).json({ error: "Failed to send verification email. Please try again." });
    }

    return res.json({
      message: "Verification code sent to your email",
      email,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error during signup" });
  }
});

// =====================
// VERIFY SIGNUP
// =====================
router.post("/verify-signup", async (req, res) => {
  try {
    const { email, emailCode } = req.body;

    // Validate required fields
    if (!email || !emailCode) {
      return res.status(400).json({ error: "Email and verification code are required" });
    }

    // Fetch user and verification code
    const [rows] = await pool.query(
      `SELECT u.user_id, u.email, u.is_verified, 
              v.email_code, v.expires_at
       FROM users u
       INNER JOIN verification_codes v ON u.user_id = v.user_id
       WHERE u.email = ? AND u.is_deleted = FALSE
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No verification request found. Please sign up again.' });
    }

    const user = rows[0];

    // Check if already verified
    if (user.is_verified) {
      return res.status(400).json({ error: 'User is already verified. Please login.' });
    }

    // Check if code has expired
    if (new Date() > new Date(user.expires_at)) {
      // Clean up expired codes and user
      await pool.query('DELETE FROM users WHERE user_id = ?', [user.user_id]);
      return res.status(400).json({ error: 'Verification code has expired. Please sign up again.' });
    }

    // Verify email code
    if (user.email_code !== emailCode) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    // Activate user
    await pool.query(
      `UPDATE users 
       SET is_verified = TRUE 
       WHERE user_id = ?`,
      [user.user_id]
    );

    // Delete verification code after successful activation
    await pool.query('DELETE FROM verification_codes WHERE user_id = ?', [user.user_id]);

    // Fetch activated user
    const [userRows] = await pool.query(
      `SELECT user_id, first_name, last_name, email, job_title, gender, phone_number,
              profile_picture_url, bio, city, is_verified, created_at, updated_at,
              status, role, cnic, cnic_front_url, cnic_back_url, cnic_verified
       FROM users 
       WHERE user_id = ? 
       LIMIT 1`,
      [user.user_id]
    );

    // Create JWT token
    const token = jwt.sign(
      { id: userRows[0].user_id, role: userRows[0].role },
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

    return res.json({
      message: "Account verified successfully! Welcome to AsaanGhar!",
      user: userRows[0],
    });
  } catch (err) {
    console.error("Verify signup error:", err);
    return res.status(500).json({ error: "Internal server error during verification" });
  }
});

// =====================
// RESEND VERIFICATION CODE
// =====================
router.post("/resend-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find unverified user
    const [userRows] = await pool.query(
      `SELECT user_id, first_name FROM users 
       WHERE email = ? AND is_verified = FALSE AND is_deleted = FALSE
       LIMIT 1`,
      [email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'No pending verification found. Please sign up again.' });
    }

    const user = userRows[0];

    // Generate new code
    const emailCode = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await pool.query(
      `UPDATE verification_codes 
       SET email_code = ?, expires_at = ? 
       WHERE user_id = ?`,
      [emailCode, expiresAt, user.user_id]
    );

    // Resend verification email
    try {
      await sendVerificationEmail(email, emailCode, user.first_name);
    } catch (emailError) {
      console.error("Error resending verification email:", emailError);
      return res.status(500).json({ error: "Failed to resend verification email" });
    }

    return res.json({ message: "Verification code resent successfully" });
  } catch (err) {
    console.error("Resend code error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
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
         status, role, password_hash, cnic, cnic_front_url, cnic_back_url, cnic_verified
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
         status, role, cnic, cnic_front_url, cnic_back_url, cnic_verified
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
