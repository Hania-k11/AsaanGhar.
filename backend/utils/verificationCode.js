const pool = require('../db');
const bcrypt = require('bcrypt');

/**
 * Generate a random 6-digit verification code
 * @returns {string} - 6-digit numeric code
 */
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Create unverified user and store verification codes
 * @param {object} userData - User registration data
 * @param {string} emailCode - Email verification code
 * @param {string} phoneCode - Phone verification code
 * @returns {Promise<number>} - Returns user_id
 */
const createUnverifiedUser = async (userData, emailCode, phoneCode) => {
  const { firstName, lastName, email, password, gender, phone, jobTitle } = userData;

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user with status='active' but is_verified=FALSE (not verified until codes are validated)
  const [insertResult] = await pool.query(
    `INSERT INTO users 
     (first_name, last_name, email, password_hash, job_title, gender, phone_number, 
      is_verified, status, role, is_deleted) 
     VALUES (?, ?, ?, ?, ?, ?, ?, FALSE, 'active', 'user', 0)`,
    [firstName, lastName, email, passwordHash, jobTitle || null, gender, phone]
  );

  const userId = insertResult.insertId;

  // Set expiration to 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Store verification codes linked to user
  await pool.query(
    `INSERT INTO verification_codes 
     (user_id, email_code, phone_code, expires_at) 
     VALUES (?, ?, ?, ?)`,
    [userId, emailCode, phoneCode, expiresAt]
  );

  return userId;
};

/**
 * Verify codes and activate user account
 * @param {string} email - User's email
 * @param {string} phone - User's phone number
 * @param {string} emailCode - Email verification code provided by user
 * @param {string} phoneCode - Phone verification code provided by user
 * @returns {Promise<object>} - Returns activated user data or throws error
 */
const verifyAndActivateUser = async (email, phone, emailCode, phoneCode) => {
  // Fetch user and verification codes
  const [rows] = await pool.query(
    `SELECT u.user_id, u.email, u.phone_number, u.is_verified, 
            v.email_code, v.phone_code, v.expires_at
     FROM users u
     INNER JOIN verification_codes v ON u.user_id = v.user_id
     WHERE u.email = ? AND u.phone_number = ? AND u.is_deleted = FALSE
     LIMIT 1`,
    [email, phone]
  );

  if (rows.length === 0) {
    throw new Error('No verification request found. Please sign up again.');
  }

  const user = rows[0];

  // Check if already verified
  if (user.is_verified) {
    throw new Error('User is already verified. Please login.');
  }

  // Check if codes have expired
  if (new Date() > new Date(user.expires_at)) {
    // Clean up expired codes and user
    await pool.query('DELETE FROM users WHERE user_id = ?', [user.user_id]);
    throw new Error('Verification codes have expired. Please sign up again.');
  }

  // Verify email code (always required)
  if (user.email_code !== emailCode) {
    throw new Error('Invalid email verification code.');
  }

  // Verify phone code (always required)
  if (user.phone_code !== phoneCode) {
    throw new Error('Invalid phone verification code.');
  }

  // Both codes are valid - activate user
  await pool.query(
    `UPDATE users 
     SET is_verified = TRUE 
     WHERE user_id = ?`,
    [user.user_id]
  );

  // Delete verification codes after successful activation
  await pool.query('DELETE FROM verification_codes WHERE user_id = ?', [user.user_id]);

  // Fetch and return the activated user
  const [userRows] = await pool.query(
    `SELECT user_id, first_name, last_name, email, job_title, gender, phone_number,
            profile_picture_url, bio, city, is_verified, created_at, updated_at,
            status, role
     FROM users 
     WHERE user_id = ? 
     LIMIT 1`,
    [user.user_id]
  );

  return userRows[0];
};

/**
 * Resend verification codes for existing unverified user
 * @param {string} email - User's email
 * @param {string} phone - User's phone number
 * @returns {Promise<object>} - Returns new codes and user info
 */
const resendVerificationCodes = async (email, phone) => {
  // Find unverified user
  const [userRows] = await pool.query(
    `SELECT user_id, first_name FROM users 
     WHERE email = ? AND phone_number = ? AND is_verified = FALSE AND is_deleted = FALSE
     LIMIT 1`,
    [email, phone]
  );

  if (userRows.length === 0) {
    throw new Error('No pending verification found. Please sign up again.');
  }

  const user = userRows[0];

  // Generate new codes
  const emailCode = generateCode();
  const phoneCode = generateCode();

  // Update verification codes
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  
  await pool.query(
    `UPDATE verification_codes 
     SET email_code = ?, phone_code = ?, expires_at = ? 
     WHERE user_id = ?`,
    [emailCode, phoneCode, expiresAt, user.user_id]
  );

  return {
    userId: user.user_id,
    firstName: user.first_name,
    emailCode,
    phoneCode,
  };
};

/**
 * Clean up expired verification codes and unverified users
 */
const cleanupExpiredVerifications = async () => {
  // Delete users with expired verification codes
  const [result] = await pool.query(
    `DELETE u FROM users u
     INNER JOIN verification_codes v ON u.user_id = v.user_id
     WHERE v.expires_at < NOW() AND u.is_verified = FALSE`
  );
  
  console.log(`Cleaned up ${result.affectedRows} expired unverified users`);
  return result.affectedRows;
};

module.exports = {
  generateCode,
  createUnverifiedUser,
  verifyAndActivateUser,
  resendVerificationCodes,
  cleanupExpiredVerifications,
};
