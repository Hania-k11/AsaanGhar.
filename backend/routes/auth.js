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
    const { firstName, lastName, email, password, gender, phone, jobTitle } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !gender || !phone) {
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

    // Validate phone format (should be 10 digits for Pakistan)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: "Phone number must be 10 digits" });
    }

    // Check if email already exists
    const [emailCheck] = await pool.query(
      "SELECT user_id FROM users WHERE email = ? AND is_deleted = FALSE LIMIT 1",
      [email]
    );

    if (emailCheck.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Check if phone already exists
    const [phoneCheck] = await pool.query(
      "SELECT user_id FROM users WHERE phone_number = ? AND is_deleted = FALSE LIMIT 1",
      [phone]
    );

    if (phoneCheck.length > 0) {
      return res.status(409).json({ error: "Phone number already registered" });
    }

    // Generate verification codes
    const emailCode = generateCode();
    const phoneCode = generateCode();

    // Create unverified user and store verification codes
    const userData = {
      firstName,
      lastName,
      email,
      password,
      gender,
      phone,
      jobTitle: jobTitle || null,
    };

    const userId = await createUnverifiedUser(userData, emailCode, phoneCode);

    // Send verification email
    try {
      await sendVerificationEmail(email, emailCode, firstName);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      // Clean up user if email fails
      await pool.query('DELETE FROM users WHERE user_id = ?', [userId]);
      return res.status(500).json({ error: "Failed to send verification email. Please try again." });
    }

    // Send verification SMS
    try {
      await sendVerificationSMS(phone, phoneCode);
    } catch (smsError) {
      console.error("Error sending verification SMS:", smsError);
      // Clean up user if SMS fails
      await pool.query('DELETE FROM users WHERE user_id = ?', [userId]);
      return res.status(500).json({ error: "Failed to send verification SMS. Please verify your phone number in Twilio or try again later." });
    }

    return res.json({
      message: "Verification codes sent successfully to your email and phone",
      email,
      phone,
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
    const { email, phone, emailCode, phoneCode } = req.body;

    // Validate required fields
    if (!email || !phone || !emailCode || !phoneCode) {
      return res.status(400).json({ error: "All verification fields are required" });
    }

    // Verify codes and activate user
    let user;
    try {
      user = await verifyAndActivateUser(email, phone, emailCode, phoneCode);
    } catch (verifyError) {
      return res.status(400).json({ error: verifyError.message });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
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
      user,
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
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ error: "Email and phone are required" });
    }

    // Resend verification codes
    let codeData;
    try {
      codeData = await resendVerificationCodes(email, phone);
    } catch (resendError) {
      return res.status(404).json({ error: resendError.message });
    }

    // Resend verification email
    try {
      await sendVerificationEmail(email, codeData.emailCode, codeData.firstName);
    } catch (emailError) {
      console.error("Error resending verification email:", emailError);
      return res.status(500).json({ error: "Failed to resend verification email" });
    }

    // Resend verification SMS
    try {
      await sendVerificationSMS(phone, codeData.phoneCode);
    } catch (smsError) {
      console.error("Error resending verification SMS:", smsError);
      return res.status(500).json({ error: "Failed to resend verification SMS" });
    }

    return res.json({ message: "Verification codes resent successfully" });
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
