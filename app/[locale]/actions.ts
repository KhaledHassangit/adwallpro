"use server";

import { OAuth2Client } from "google-auth-library";
import { adsApi, usersApi, categoriesApi } from "@/lib/api";

// Helper function to get API URL
function getApiUrl(): string {
  const url = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  return url.replace(/\/$/, "");
}

// Ads Actions
export async function addAdAction(formData: FormData) {
  try {
    const adData = {
      companyName: String(formData.get("companyName") || ""),
      description: String(formData.get("description") || ""),
      category: String(formData.get("category") || ""),
      country: String(formData.get("country") || ""),
      city: String(formData.get("city") || ""),
      image: String(formData.get("image") || ""),
      logo: String(formData.get("logo") || ""),
      phone: String(formData.get("phone") || ""),
      whatsapp: String(formData.get("whatsapp") || ""),
      website: String(formData.get("website") || ""),
      email: String(formData.get("email") || ""),
      ownerEmail: String(formData.get("ownerEmail") || ""),
    };

    const newAd = await adsApi.create(adData);
    return { ok: true, ad: newAd };
  } catch (error) {
    console.error("Error adding ad:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to add ad";
    return { ok: false, error: errorMessage };
  }
}

export async function updateAdAction(adId: string, data: Record<string, unknown>) {
  try {
    const updatedAd = await adsApi.update(adId, data);
    return { ok: true, ad: updatedAd };
  } catch (error) {
    console.error("Error updating ad:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update ad";
    return { ok: false, error: errorMessage };
  }
}

export async function deleteAdAction(adId: string) {
  try {
    await adsApi.delete(adId);
    return { ok: true };
  } catch (error) {
    console.error("Error deleting ad:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete ad";
    return { ok: false, error: errorMessage };
  }
}

export async function approveAdAction(adId: string, reviewedBy: string) {
  try {
    const ad = await adsApi.approve(adId, reviewedBy);
    return { ok: true, ad };
  } catch (error) {
    console.error("Error approving ad:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to approve ad";
    return { ok: false, error: errorMessage };
  }
}

export async function rejectAdAction(
  adId: string,
  reviewedBy: string,
  rejectionReason: string
) {
  try {
    const ad = await adsApi.reject(adId, reviewedBy, rejectionReason);
    return { ok: true, ad };
  } catch (error) {
    console.error("Error rejecting ad:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to reject ad";
    return { ok: false, error: errorMessage };
  }
}

// Categories Actions
export async function adminAddCategoryAction(formData: FormData) {
  try {
    const categoryData = {
      slug: String(formData.get("slug") || ""),
      nameAr: String(formData.get("nameAr") || ""),
      nameEn: String(formData.get("nameEn") || ""),
      image: String(formData.get("image") || ""),
      color: String(formData.get("color") || "#1e88e5"),
    };

    await categoriesApi.create(categoryData);
    return { ok: true };
  } catch (error) {
    console.error("Error adding category:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to add category";
    return { ok: false, error: errorMessage };
  }
}

export async function adminUpdateCategoryColorAction(
  slug: string,
  color: string
) {
  try {
    const updated = await categoriesApi.update(slug, { color });
    return { ok: true, category: updated };
  } catch (error) {
    console.error("Error updating category:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update category";
    return { ok: false, error: errorMessage };
  }
}

// Users Actions
export async function adminUpdateUserAction(
  userId: string,
  data: { name?: string; phone?: string }
) {
  try {
    const updated = await usersApi.update(userId, data);
    return { ok: true, user: updated };
  } catch (error) {
    console.error("Error updating user:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update user";
    return { ok: false, error: errorMessage };
  }
}

export async function adminDeleteUserAction(userId: string) {
  try {
    await usersApi.delete(userId);
    return { ok: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete user";
    return { ok: false, error: errorMessage };
  }
}

// Google Authentication
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

    // Send the verified info to your backend to create/get user & issue app token
    const backendUrl = getApiUrl();
    const res = await fetch(`${backendUrl}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        sub: payload.sub,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: `Backend auth /auth/google failed: ${text}` };
    }

    const data = await res.json();
    // expects something like { user, token } from your backend
    return { success: true, user: data.user, token: data.token };
  } catch (err: unknown) {
    console.error("verifyGoogleToken error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error during Google token verification";
    return { success: false, error: errorMessage };
  }
}