"use server";

import { adsApi, usersApi, categoriesApi } from "@/lib/api";

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
    return { ok: false, error: "Failed to add ad" };
  }
}

export async function updateAdAction(adId: string, data: any) {
  try {
    const updatedAd = await adsApi.update(adId, data);
    return { ok: true, ad: updatedAd };
  } catch (error) {
    console.error("Error updating ad:", error);
    return { ok: false, error: "Failed to update ad" };
  }
}

export async function deleteAdAction(adId: string) {
  try {
    await adsApi.delete(adId);
    return { ok: true };
  } catch (error) {
    console.error("Error deleting ad:", error);
    return { ok: false, error: "Failed to delete ad" };
  }
}

export async function approveAdAction(adId: string, reviewedBy: string) {
  try {
    const ad = await adsApi.approve(adId, reviewedBy);
    return { ok: true, ad };
  } catch (error) {
    console.error("Error approving ad:", error);
    return { ok: false, error: "Failed to approve ad" };
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
    return { ok: false, error: "Failed to reject ad" };
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
    return { ok: false, error: "Failed to add category" };
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
    return { ok: false, error: "Failed to update category" };
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
    return { ok: false, error: "Failed to update user" };
  }
}

export async function adminDeleteUserAction(userId: string) {
  try {
    await usersApi.delete(userId);
    return { ok: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { ok: false, error: "Failed to delete user" };
  }
}
