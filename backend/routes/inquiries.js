const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateUser } = require('../middleware/auth');

// Email service for sending notifications
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send property inquiry email to owner
 */
const sendInquiryEmail = async (ownerEmail, ownerName, inquirerName, inquirerEmail, inquirerPhone, inquirerRole, propertyTitle, messageContent) => {
  const mailOptions = {
    from: `"AsaanGhar" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    subject: `New Inquiry for Your Property: ${propertyTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
            padding: 30px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
            color: #333333;
          }
          .content h2 {
            color: #10b981;
            font-size: 22px;
            margin-bottom: 20px;
          }
          .info-box {
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .info-box h3 {
            margin-top: 0;
            color: #10b981;
            font-size: 16px;
          }
          .info-box p {
            margin: 8px 0;
            color: #333333;
          }
          .message-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .message-box h3 {
            margin-top: 0;
            color: #374151;
            font-size: 16px;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
          .label {
            font-weight: 600;
            color: #059669;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 AsaanGhar</h1>
          </div>
          <div class="content">
            <h2>Hello ${ownerName}!</h2>
            <p>You have received a new inquiry for your property listing:</p>
            
            <div class="info-box">
              <h3>📋 Property Details</h3>
              <p><span class="label">Property:</span> ${propertyTitle}</p>
            </div>

            <div class="info-box">
              <h3>👤 Inquirer Information</h3>
              <p><span class="label">Name:</span> ${inquirerName}</p>
              <p><span class="label">Email:</span> ${inquirerEmail}</p>
            
            
              <p><span class="label">Role:</span> ${inquirerRole}</p>
            </div>

            <div class="message-box">
              <h3>💬 Message</h3>
              <p>${messageContent}</p>
            </div>
            
            <p>You can reply directly to this email to respond to the inquirer at <strong>${inquirerEmail}</strong>.</p>
            
            <p>Best regards,<br><strong>The AsaanGhar Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AsaanGhar. All rights reserved.</p>
            <p>This is an automated email notification.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Inquiry email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending inquiry email:', error);
    throw new Error('Failed to send inquiry email');
  }
};

/**
 * POST /api/inquiries
 * Create a new property inquiry
 * Requires authentication
 */
router.post('/', authenticateUser, async (req, res) => {
  const { propertyId, messageContent, inquirerRole } = req.body;
  const userId = req.user.id; // Using req.user.id to match other routes

  // Validate required fields
  if (!propertyId || !messageContent || !inquirerRole) {
    return res.status(400).json({ 
      success: false, 
      message: 'Property ID, message content, and inquirer role are required' 
    });
  }

  // Validate inquirer role
  const validRoles = ['Buyer/Tenant', 'Agent', 'Other'];
  if (!validRoles.includes(inquirerRole)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid inquirer role' 
    });
  }

  try {
    // Get user details from users table
    const [userRows] = await db.query(
      'SELECT user_id, first_name, last_name, email, phone_number FROM users WHERE user_id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const user = userRows[0];
    const inquirerName = `${user.first_name} ${user.last_name}`.trim();
    const inquirerEmail = user.email;
    const inquirerPhone = user.phone_number;

    // Get property details and owner email
    const [propertyRows] = await db.query(
      `SELECT p.property_id, p.title, p.owner_id, u.email as owner_email, u.first_name as owner_first_name, u.last_name as owner_last_name
       FROM properties p
       JOIN users u ON p.owner_id = u.user_id
       WHERE p.property_id = ?`,
      [propertyId]
    );

    if (propertyRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Property not found' 
      });
    }

    const property = propertyRows[0];
    const ownerEmail = property.owner_email;
    const ownerName = `${property.owner_first_name} ${property.owner_last_name}`.trim();
    const propertyTitle = property.title;

    // Insert inquiry into database
    const [insertResult] = await db.query(
      `INSERT INTO inquiries 
       (property_id, inquirer_user_id, inquirer_name, inquirer_email, inquirer_phone, message_content, inquiry_type, inquiry_timestamp, inquirer_role) 
       VALUES (?, ?, ?, ?, ?, ?, 'email_form', NOW(), ?)`,
      [propertyId, userId, inquirerName, inquirerEmail, inquirerPhone, messageContent, inquirerRole]
    );

    console.log('Inquiry inserted with ID:', insertResult.insertId);

    // Send email notification to property owner
    try {
      await sendInquiryEmail(
        ownerEmail,
        ownerName,
        inquirerName,
        inquirerEmail,
        inquirerPhone,
        inquirerRole,
        propertyTitle,
        messageContent
      );
      console.log('Inquiry email sent successfully to owner');
    } catch (emailError) {
      // Log error but don't fail the request - inquiry is already saved
      console.error('Failed to send email notification:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully',
      inquiryId: insertResult.insertId
    });

  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send inquiry',
      error: error.message
    });
  }
});

module.exports = router;
