const nodemailer = require('nodemailer');
require('dotenv').config();

// Validate email configuration on startup
const validateEmailConfig = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ EMAIL CONFIGURATION ERROR: EMAIL_USER and/or EMAIL_PASS environment variables are not set!');
    console.error('⚠️  Email verification will NOT work until these are configured.');
    return false;
  }
  console.log('✅ Email configuration validated: EMAIL_USER =', process.env.EMAIL_USER);
  return true;
};

// Check configuration on module load
const isEmailConfigured = validateEmailConfig();

// Create transporter using Gmail SMTP with timeout
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add connection timeout to prevent hanging
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000, // 5 seconds
  socketTimeout: 10000, // 10 seconds
});

/**
 * Send verification email with code
 * @param {string} email - Recipient email address
 * @param {string} code - 6-digit verification code
 * @param {string} firstName - User's first name for personalization
 * @returns {Promise} - Resolves when email is sent
 */
const sendVerificationEmail = async (email, code, firstName = 'User') => {
  // Check if email is configured
  if (!isEmailConfigured) {
    const error = new Error('Email service is not configured. Missing EMAIL_USER or EMAIL_PASS environment variables.');
    console.error('❌ Cannot send email:', error.message);
    throw error;
  }

  const mailOptions = {
    from: `"AsaanGhar" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your AsaanGhar Account',
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
          .code-box {
            background-color: #f0fdf4;
            border: 2px dashed #10b981;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .code {
            font-size: 36px;
            font-weight: bold;
            color: #10b981;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
          }
          .footer {
            background-color: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
          .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .warning p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 AsaanGhar</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Thank you for signing up with AsaanGhar. To complete your registration, please use the verification code below:</p>
            
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            
            <p>Enter this code in the verification screen to activate your account.</p>
            
            <div class="warning">
              <p><strong>⚠️ Important:</strong> This code will expire in 10 minutes. If you didn't request this code, please ignore this email.</p>
            </div>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            
            <p>Best regards,<br><strong>The AsaanGhar Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AsaanGhar. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    console.log(`📧 Attempting to send verification email to: ${email}`);
    
    // Verify transporter connection before sending
    console.log(`🔗 Verifying SMTP connection...`);
    try {
      await transporter.verify();
      console.log(`✅ SMTP connection verified`);
    } catch (verifyError) {
      console.error(`❌ SMTP connection verification failed:`, verifyError.message);
      throw new Error(`Email server connection failed: ${verifyError.message}`);
    }
    
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully:', info.messageId);
    console.log('   Recipient:', email);
    console.log('   Code:', code);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ CRITICAL ERROR sending verification email:');
    console.error('   Error Type:', error.name);
    console.error('   Error Message:', error.message);
    console.error('   Recipient:', email);
    console.error('   EMAIL_USER:', process.env.EMAIL_USER);
    console.error('   EMAIL_PASS configured:', !!process.env.EMAIL_PASS);
    console.error('   Full error:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

module.exports = { sendVerificationEmail, isEmailConfigured };
