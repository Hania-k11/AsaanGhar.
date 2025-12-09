# SendGrid Setup Guide

## Why SendGrid?

Your production hosting provider (Railway) is blocking SMTP ports, preventing Gmail from sending emails. SendGrid uses HTTP/HTTPS APIs instead of SMTP, so it works even when SMTP ports are blocked.

## Setup Steps

### 1. Create SendGrid Account

1. Go to https://sendgrid.com/
2. Click "Start for Free"
3. Sign up (Free tier: 100 emails/day - perfect for getting started)
4. Verify your email address

### 2. Verify Sender Email

**Important:** SendGrid requires you to verify the email address you'll send FROM.

1. Log in to SendGrid Dashboard
2. Go to **Settings** → **Sender Authentication**
3. Click **Verify a Single Sender**
4. Fill in the form:
   - From Name: `AsaanGhar`
   - From Email Address: `haniak363@gmail.com` (or your preferred email)
   - Reply To: Same as From Email
   - Company Address: Your address (can be approximate)
5. Click **Create**
6. Check your email inbox and click the verification link
7. **Wait for approval** (usually instant, sometimes takes a few hours)

### 3. Get Your API Key

1. In SendGrid Dashboard, go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name: `AsaanGhar Production`
4. API Key Permissions: Choose **Full Access** (or at minimum "Mail Send")
5. Click **Create & View**
6. **COPY THE API KEY NOW** - you won't be able to see it again!
   - It will look like: `SG.xxxxxxxxxxxxxxxxxxxxx`

### 4. Update Your Code

Replace the import in `backend/routes/auth.js`:

**Change line 10 from:**
```javascript
const { sendVerificationEmail, isEmailConfigured } = require("../utils/emailService");
```

**To:**
```javascript
const { sendVerificationEmail, isEmailConfigured } = require("../utils/emailServiceSendGrid");
```

### 5. Set Environment Variables in Production

Add these to your Railway environment variables:

1. Go to your Railway project
2. Click on your backend service
3. Go to **Variables** tab
4. Add these variables:

```
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=haniak363@gmail.com
```

**Important:**
- Replace `SG.your_actual_api_key_here` with the actual API key you copied
- Replace `haniak363@gmail.com` with the email you verified in step 2
- Make sure there are NO spaces or quotes around the values

### 6. Deploy Changes

```bash
git add .
git commit -m "feat: Switch to SendGrid for production email delivery"
git push
```

Railway will automatically redeploy your backend.

### 7. Test Signup

1. Go to https://asaanghar.site/
2. Try signing up with a new email
3. You should receive the verification code!

### 8. Verify It's Working

Check your production logs in Railway. You should see:
```
✅ SendGrid configuration validated
📧 Attempting to send verification email via SendGrid to: test@example.com
✅ Verification email sent successfully via SendGrid
```

## Troubleshooting

### Error: "The from email address is not verified"
- Go back to step 2 and verify your sender email
- Make sure `SENDGRID_FROM_EMAIL` matches exactly the email you verified

### Error: "Unauthorized"
- Check that your `SENDGRID_API_KEY` is correct
- Make sure there are no extra spaces or quotes
- Verify the API key has "Mail Send" permissions

### Error: "API key missing"
- Make sure you set `SENDGRID_API_KEY` in Railway environment variables
- Restart your Railway service after adding the variable

### Still not working?
Check Railway logs for detailed error messages:
1. Go to your Railway project
2. Click on your backend service
3. Click on **Deployments**
4. Click on the latest deployment
5. View the logs

## Need Help?

If you're stuck on any step, let me know which step and what error you're seeing!
