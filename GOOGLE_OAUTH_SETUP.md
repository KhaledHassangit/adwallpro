# Google OAuth Setup Guide

## Overview

This app now supports Google OAuth login. Users can sign in with their Google account, which is verified server-side and creates/retrieves the user in your backend.

## Setup Steps

### 1. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Public client ID (exposed in frontend is OK)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1098732852870-2835f3lk11h1c9htjvugnh58k2mvpj63.apps.googleusercontent.com

# Private client secret (KEEP THIS SECRET - never commit to version control)
GOOGLE_CLIENT_SECRET=<your_client_secret_from_google_console>

# App URL (update for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ Important:**
- `GOOGLE_CLIENT_SECRET` must be kept private and only used server-side
- Never commit `.env.local` to version control
- Use a `.env.local` template (`.env.local.example`) that developers copy

### 2. Install Dependencies

The required library is already in your project or install it:

```bash
npm install google-auth-library @react-oauth/google
```

### 3. Google Cloud Setup (if you haven't already)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google+ API"
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback` (development)
   - `https://yourdomain.com/auth/google/callback` (production)
7. Copy the **Client ID** and **Client Secret**

### 4. Backend Google OAuth Endpoint

Your backend (`http://72.60.178.180:8000/api/v1/auth/google`) must implement:

**POST /auth/google**

Request body:
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://...",
  "googleId": "google_unique_id"
}
```

Response:
```json
{
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user",
    ...
  },
  "token": "jwt_auth_token"
}
```

Or wrapped in `data`:
```json
{
  "data": {
    "user": { ... },
    "token": "jwt_auth_token"
  }
}
```

### 5. How It Works

1. **Frontend**: User clicks "Sign in with Google" button
2. **Google SDK**: Opens Google login modal, returns JWT token (`credential`)
3. **Server Action**: `verifyGoogleToken()` verifies the JWT signature using Google's public keys
4. **Backend Call**: Sends verified user data to your backend at POST `/auth/google`
5. **Auth Store**: Updates Zustand auth store with user and token
6. **Navigation**: Redirects to admin dashboard (if role=admin) or user dashboard

### 6. Security Notes

✅ **Safe:**
- Client ID is publicly available (it's the OAuth app identifier)
- Google JWT tokens are signed and verified server-side using Google's public keys
- Client Secret is never exposed to the frontend

❌ **Unsafe:**
- Never commit `.env.local` with `GOOGLE_CLIENT_SECRET`
- Never send the client secret to the frontend
- Never trust the JWT payload without verifying the signature

### 7. File Changes

**New files:**
- `providers/GoogleOAuthProvider.tsx` — Wraps the app with GoogleOAuthProvider
- `app/actions.ts` — Server action `verifyGoogleToken()` to validate Google tokens

**Modified files:**
- `app/layout.tsx` — Imports and wraps with GoogleOAuthProvider
- `app/(auth)/login/page.tsx` — Uses GoogleLogin component and calls `verifyGoogleToken()`
- `.env.local.example` — Template with Google OAuth variables

### 8. Testing

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000/login`

3. Click "Sign in with Google"

4. Use a test Google account

5. Check:
   - Token is verified server-side (check console logs)
   - User is created/retrieved from backend
   - Auth store is updated with user and token
   - Redirect works correctly

### 9. Common Issues

**Issue: "Google Client ID not found"**
- Check `.env.local` has `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

**Issue: "Invalid token signature"**
- Google tokens expire after ~1 hour
- The token may be old; try logging in again

**Issue: Backend returns 401 or 404**
- Verify your backend has the `/auth/google` endpoint implemented
- Check the backend URL in `app/actions.ts` (line 6: `API_BASE_URL`)

**Issue: User role not recognized**
- Check your backend returns a `role` field in the user object
- Default is "user"; set it to "admin" if needed

### 10. Production Deployment

1. Update `.env.production`:
   ```bash
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your_client_id>
   GOOGLE_CLIENT_SECRET=<your_client_secret>
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. Update Google Console redirect URI to your production domain

3. Deploy and test the flow

## References

- [Google Auth Library Docs](https://github.com/googleapis/google-auth-library-nodejs)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Docs](https://www.npmjs.com/package/@react-oauth/google)
