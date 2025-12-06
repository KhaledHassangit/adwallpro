'use server';

// app/[locale]/actions.ts
import { axiosInstance } from '@/lib/baseURL';
import { OAuth2Client } from 'google-auth-library';

export async function verifyGoogleToken(idToken: string) {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return { success: false, error: "Google Client ID not configured" };
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return { success: false, error: "Invalid Google token payload" };
    }

    // Use your axios instance instead of fetch
    const res = await axiosInstance.post('/auth/google', {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      sub: payload.sub,
    });

    if (!res.data) {
      return { success: false, error: "Backend auth /auth/google failed" };
    }

    // expects something like { user, token } from your backend
    return { success: true, user: res.data.user, token: res.data.token };
  } catch (err: unknown) {
    console.error("verifyGoogleToken error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error during Google token verification";
    return { success: false, error: errorMessage };
  }
}