const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateUser } = require('../middleware/auth');
const { cloudinary } = require('../utils/cloudinary');
const multer = require('multer');
const { sendPhoneVerificationCode, verifyPhoneCode } = require('../utils/verificationCode');
const { sendVerificationSMS } = require('../utils/smsService');

// Configure multer for memory storage (we'll upload to Cloudinary directly)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// =====================
// UPLOAD CNIC IMAGES
// =====================
router.post('/upload-cnic', 
  authenticateUser, 
  upload.fields([
    { name: 'cnicFront', maxCount: 1 },
    { name: 'cnicBack', maxCount: 1 }
  ]), 
  async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Request files:', req.files);
      console.log('CNIC value:', req.body.cnic);
      
      const userId = req.user.id;
      const cnic = req.body.cnic;

      if (!req.files || !req.files.cnicFront || !req.files.cnicBack) {
        return res.status(400).json({ error: 'Both CNIC front and back images are required' });
      }

      if (!cnic || cnic.trim() === '') {
        console.log('CNIC validation failed. Received:', cnic);
        return res.status(400).json({ error: 'CNIC number is required' });
      }

      // Validate CNIC format (13 digits)
      const cnicRegex = /^\d{13}$/;
      if (!cnicRegex.test(cnic.trim())) {
        return res.status(400).json({ error: 'CNIC must be exactly 13 digits' });
      }

    // Upload front image to Cloudinary
    const frontUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'asaanghar_cnic',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.files.cnicFront[0].buffer);
    });

    // Upload back image to Cloudinary
    const backUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'asaanghar_cnic',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.files.cnicBack[0].buffer);
    });

    // Update user record with CNIC URLs and set status to pending (2)
    const trimmedCnic = cnic.trim();
    await pool.query(
      `UPDATE users 
       SET cnic_front_url = ?, cnic_back_url = ?, cnic = ?, cnic_verified = 2, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = ?`,
      [frontUpload.secure_url, backUpload.secure_url, trimmedCnic, userId]
    );

    return res.json({
      success: true,
      message: 'CNIC images uploaded successfully',
      cnicFrontUrl: frontUpload.secure_url,
      cnicBackUrl: backUpload.secure_url,
      cnic: trimmedCnic,
      cnic_verified: 2,
    });
  } catch (err) {
    console.error('CNIC upload error:', err);
    return res.status(500).json({ error: 'Failed to upload CNIC images' });
  }
});

// =====================
// UPDATE CNIC NUMBER
// =====================
router.put('/update-cnic', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { cnic } = req.body;

    if (!cnic) {
      return res.status(400).json({ error: 'CNIC number is required' });
    }

    // Validate CNIC format (13 digits)
    const cnicRegex = /^\d{13}$/;
    if (!cnicRegex.test(cnic)) {
      return res.status(400).json({ error: 'CNIC must be exactly 13 digits' });
    }

    // Update user record with CNIC number
    await pool.query(
      `UPDATE users 
       SET cnic = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = ?`,
      [cnic, userId]
    );

    return res.json({
      success: true,
      message: 'CNIC number updated successfully',
    });
  } catch (err) {
    console.error('CNIC update error:', err);
    return res.status(500).json({ error: 'Failed to update CNIC number' });
  }
});

// =====================
// ADD/UPDATE PHONE NUMBER (Send Verification Code)
// =====================
router.post('/add-phone', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Validate phone format (Pakistani format)
    const phoneRegex = /^(\+92|0)?3\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format. Use Pakistani format (e.g., 03001234567)' });
    }

    // Check if phone is already in use by another user
    const [existingPhone] = await pool.query(
      'SELECT user_id FROM users WHERE phone_number = ? AND user_id != ? AND is_deleted = FALSE LIMIT 1',
      [phone, userId]
    );

    if (existingPhone.length > 0) {
      return res.status(409).json({ error: 'This phone number is already registered to another account' });
    }

    // Generate and store verification code
    const { phoneCode } = await sendPhoneVerificationCode(userId, phone);

    // Send SMS with verification code
    try {
      await sendVerificationSMS(phone, phoneCode);
    } catch (smsError) {
      console.error('SMS sending error:', smsError);
      // Clean up verification code if SMS fails
      await pool.query('DELETE FROM verification_codes WHERE user_id = ?', [userId]);
      return res.status(500).json({ 
        error: 'Failed to send verification SMS. Please verify your phone number or try again later.' 
      });
    }

    return res.json({
      success: true,
      message: 'Verification code sent to your phone',
      phone,
    });
  } catch (err) {
    console.error('Add phone error:', err);
    return res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// =====================
// VERIFY PHONE NUMBER
// =====================
router.post('/verify-phone', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { code, phone } = req.body;

    if (!code || !phone) {
      return res.status(400).json({ error: 'Verification code and phone number are required' });
    }

    // Verify the code
    await verifyPhoneCode(userId, code, phone);

    // Fetch updated user data
    const [userRows] = await pool.query(
      `SELECT user_id, first_name, last_name, email, phone_number, phone_verified, cnic, 
              cnic_front_url, cnic_back_url, cnic_verified, profile_picture_url, city, bio, 
              is_verified, created_at, updated_at, status, role
       FROM users 
       WHERE user_id = ? 
       LIMIT 1`,
      [userId]
    );

    return res.json({
      success: true,
      message: 'Phone number verified successfully',
      user: userRows[0],
    });
  } catch (err) {
    console.error('Verify phone error:', err);
    return res.status(400).json({ error: err.message || 'Failed to verify phone number' });
  }
});

// =====================
// GET USER PROFILE
// =====================
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT user_id, first_name, last_name, email, phone_number, phone_verified, cnic, 
              cnic_front_url, cnic_back_url, cnic_verified, profile_picture_url, city, bio, 
              is_verified, created_at, updated_at, status, role
       FROM users 
       WHERE user_id = ? AND is_deleted = FALSE
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      success: true,
      user: rows[0],
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = router;
