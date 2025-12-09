# Email Verification Issue - Production Fix

## Problem
Emails are being sent on localhost but not on production (https://asaanghar.site/). Users are being added to the database without receiving verification codes.

## Root Cause
The email service may be experiencing silent failures in production due to:
1. SMTP connection timeouts
2. Gmail blocking the connection from the production server IP
3. Invalid or restricted email credentials in production

## Changes Made

### 1. `backend/utils/emailService.js`
- **Added connection timeouts** (10s connection, 5s greeting, 10s socket) to prevent hanging
- **Added SMTP verification** before sending each email to catch connection issues early
- **Improved error messages** to distinguish between connection and sending failures

### 2. Error Handling Improvements
The signup flow in `backend/routes/auth.js` already has proper error handling:
- If email sending fails, it deletes both the user and verification code
- Returns a 500 error to the frontend
- Frontend shows appropriate error message

## How to Test

### 1. Test Email Configuration Status
```bash
curl https://asaanghar.site/api/auth/email-config-status
```

### 2. Test Email Sending (Use with caution - might send actual email)
```bash
curl -X POST https://asaanghar.site/api/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@example.com"}'
```

### 3. Check Production Logs
After deploying, check your production server logs (Railway/Vercel/etc.) for:
- `📧 Attempting to send verification email`
- `🔗 Verifying SMTP connection...`
- `✅ SMTP connection verified` (success)
- `❌ SMTP connection verification failed` (failure)

## Potential Issues in Production

### Issue 1: Gmail Security Blocking
Gmail may block connections from unknown server IPs. You may need to:
1. Enable "Less secure app access" (not recommended)
2. Use Gmail App Passwords (recommended)
3. Add the production server IP to Gmail's trusted list

### Issue 2: Environment Variables
Verify that `EMAIL_USER` and `EMAIL_PASS` are correctly set in your production environment:
- Railway: Settings → Variables
- Vercel: Project Settings → Environment Variables
- Check that there are no trailing spaces or quotes

### Issue 3: Network Restrictions
Some hosting providers block SMTP ports (25, 465, 587). Verify that your production server can connect to Gmail's SMTP server.

## Recommended Solution

### Use a Dedicated Email Service
For production, consider using dedicated email services instead of Gmail SMTP:
1. **SendGrid** - Free tier: 100 emails/day
2. **Mailgun** - Free tier: 1000 emails/month
3. **AWS SES** - Very cheap, reliable

### Quick SendGrid Setup (Recommended)
```bash
npm install @sendgrid/mail
```

Create `backend/utils/emailServiceSendGrid.js`:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (email, code, firstName = 'User') => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL, // Must be verified in SendGrid
    subject: 'Verify Your AsaanGhar Account',
    html: `Your verification code is: ${code}`,
  };
  
  await sgMail.send(msg);
};

module.exports = { sendVerificationEmail };
```

## Next Steps

1. **Deploy the updated code** to production
2. **Test signup** and check logs for email errors
3. **If still failing**, switch to SendGrid or another email service
4. **Monitor production logs** for SMTP connection errors

## Debugging Commands

Check if production can connect to Gmail SMTP:
```bash
# On your production server
telnet smtp.gmail.com 587
# or
nc -zv smtp.gmail.com 587
```

If this fails, your hosting provider is blocking SMTP connections.
