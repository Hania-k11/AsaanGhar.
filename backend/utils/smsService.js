const twilio = require('twilio');
require('dotenv').config();

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send verification SMS with code
 * @param {string} phone - Phone number (without +92, e.g., "3001234567")
 * @param {string} code - 6-digit verification code
 * @returns {Promise} - Resolves when SMS is sent
 */
const sendVerificationSMS = async (phone, code) => {
  // Format phone number for international delivery
  // Assuming Pakistan (+92) - adjust if needed
  let formattedPhone = phone;
  
  // If phone doesn't start with +, add +92
  if (!phone.startsWith('+')) {
    // Remove leading 0 if present
    const cleanPhone = phone.startsWith('0') ? phone.substring(1) : phone;
    formattedPhone = `+92${cleanPhone}`;
  }

  const message = `Your AsaanGhar verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\n- AsaanGhar Team`;

  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log('Verification SMS sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('Error sending verification SMS:', error);
    throw new Error('Failed to send verification SMS');
  }
};

module.exports = { sendVerificationSMS };
