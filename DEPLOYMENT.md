# Environment Variables Guide

## Backend (Railway Deployment)

Set the following environment variable in your Railway backend project:

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `CLIENT_URL` | `https://asaanghar.site` | Frontend URL for CORS configuration |

### How to Set in Railway

1. Go to your Railway project dashboard
2. Select your backend service
3. Click on **Variables** tab
4. Add the environment variable:
   - **Key**: `CLIENT_URL`
   - **Value**: `https://asaanghar.site`
5. Click **Add** and Railway will automatically redeploy

### Existing Variables

Make sure these are already set (from your initial setup):
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `GOOGLE_CLIENT_ID`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## Frontend (Vercel Deployment)

**No environment variables needed!** 

The `vercel.json` file already configures API proxying:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://asaanghar-production-abfc.up.railway.app/api/$1"
    }
  ]
}
```

All `/api/*` requests from your frontend are automatically forwarded to your Railway backend.

---

## Local Development

### Backend

No environment variables needed for local development. The CORS configuration defaults to `http://localhost:5173`.

**Optional**: If you want to allow multiple origins locally (e.g., testing from different ports):
Create or update `.env` file in `backend/` directory:
```env
CLIENT_URL=http://localhost:5173,http://localhost:3000
```

### Frontend

No environment variables needed. The Vite dev server proxy defaults to `http://localhost:3001`.

**Optional**: If your backend runs on a different port:
Create `.env` file in `frontend/` directory:
```env
VITE_API_URL=http://localhost:4000
```

---

## Testing the Configuration

### Local Testing

1. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```
   Expected output: `Server running on port 3001`

2. **Start Frontend** (in new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   Expected output: Running on `http://localhost:5173`

3. **Test Features**:
   - Open `http://localhost:5173` in browser
   - ✅ Click "Login" - should open modal
   - ✅ Try Google login - should work without CORS errors
   - ✅ Test signup with email verification
   - ✅ Go to Settings → update privacy settings
   - ✅ Check browser console - no CORS errors

### Production Testing

After deploying both backend and frontend:

1. **Visit Frontend**: `https://asaanghar.site`

2. **Open DevTools** (F12) → Network tab

3. **Test Login Flow**:
   - Click "Login"
   - Enter credentials
   - Check Network tab: Login request should go to `https://asaanghar-production-abfc.up.railway.app/api/auth/login`
   - Response should have `Access-Control-Allow-Origin: https://asaanghar.site` header

4. **Test Other Features**:
   - ✅ Google login
   - ✅ Email signup
   - ✅ Settings changes
   - ✅ Property listings

5. **Verify CORS**: 
   - All API requests in Network tab should have successful CORS headers
   - No CORS errors in console

---

## Troubleshooting

### CORS Errors in Production

**Symptom**: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**:
1. Verify `CLIENT_URL` is set to `https://asaanghar.site` in Railway
2. Check for typos (no trailing slash!)
3. Redeploy backend after setting variable

### API Requests Not Reaching Backend

**Symptom**: 404 errors on `/api/*` endpoints in production

**Solution**:
1. Verify `vercel.json` is deployed with your frontend
2. Check Vercel deployment logs for rewrite rules
3. Ensure the `destination` URL in `vercel.json` is correct

### Local Development Issues

**Symptom**: CORS errors or connection refused

**Solution**:
1. Ensure backend is running on port 3001
2. Ensure frontend is running on port 5173
3. Clear browser cache and restart both servers
4. Check if another process is using these ports

---

## Summary

✅ **Backend**: Set `CLIENT_URL=https://asaanghar.site` in Railway  
✅ **Frontend**: No variables needed (uses `vercel.json`)  
✅ **Local Dev**: No variables needed (uses defaults)
