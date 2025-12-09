const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Validate SendGrid configuration on startup
const validateSendGridConfig = () => {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID CONFIGURATION ERROR: SENDGRID_API_KEY environment variable is not set!');
    console.error('⚠️  Email verification will NOT work until this is configured.');
    return false;
  }
  if (!process.env.SENDGRID_FROM_EMAIL) {
    console.error('❌ SENDGRID CONFIGURATION ERROR: SENDGRID_FROM_EMAIL environment variable is not set!');
    console.error('⚠️  Email verification will NOT work until this is configured.');
    return false;
  }
  console.log('✅ SendGrid configuration validated');
  console.log('   From Email:', process.env.SENDGRID_FROM_EMAIL);
  return true;
};

// Check configuration on module load
const isEmailConfigured = validateSendGridConfig();

// Set API key if configured
if (isEmailConfigured) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Send verification email with code using SendGrid
 * @param {string} email - Recipient email address
 * @param {string} code - 6-digit verification code
 * @param {string} firstName - User's first name for personalization
 * @returns {Promise} - Resolves when email is sent
 */
const sendVerificationEmail = async (email, code, firstName = 'User') => {
  // Check if SendGrid is configured
  if (!isEmailConfigured) {
    const error = new Error('SendGrid is not configured. Missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL environment variables.');
    console.error('❌ Cannot send email:', error.message);
    throw error;
  }

  const msg = {
    to: email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'AsaanGhar'
    },
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
    console.log(`📧 Attempting to send verification email via SendGrid to: ${email}`);
    const response = await sgMail.send(msg);
    console.log('✅ Verification email sent successfully via SendGrid');
    console.log('   Recipient:', email);
    console.log('   Code:', code);
    console.log('   Response Status:', response[0].statusCode);
    return { success: true, messageId: response[0].headers['x-message-id'] };
  } catch (error) {
    console.error('❌ CRITICAL ERROR sending verification email via SendGrid:');
    console.error('   Error Type:', error.name);
    console.error('   Error Message:', error.message);
    console.error('   Recipient:', email);
    console.error('   SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL);
    console.error('   SENDGRID_API_KEY configured:', !!process.env.SENDGRID_API_KEY);
    
    if (error.response) {
      console.error('   SendGrid Error Response:', error.response.body);
    }
    
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

module.exports = { sendVerificationEmail, isEmailConfigured };
