"use client";

import { getAuthHeaders } from "./auth";

const API_BASE_URL = "http://72.60.178.180:8000/api/v1";

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth endpoints
  async signIn(email: string, password: string) {
    return this.request<{ user: any; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async signUp(email: string, password: string, name: string) {
    return this.request<{ user: any; token: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async signOut() {
    return this.request("/auth/signout", { method: "POST" });
  }

  // Companies endpoints (previously Ads)
  async getCompanies(params?: {
    category?: string;
    country?: string;
    city?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request<{ companies: any[]; total: number; pages: number }>(
      `/companies${query ? `?${query}` : ""}`
    );
  }

  async getCompany(id: string) {
    return this.request<{ company: any }>(`/companies/${id}`);
  }

  async createCompany(data: any) {
    return this.request<{ company: any }>("/companies", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCompany(id: string, data: any) {
    return this.request<{ company: any }>(`/companies/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCompany(id: string) {
    return this.request(`/companies/delete/${id}`, { method: "DELETE" });
  }

  async approveCompany(id: string) {
    return this.request<{ company: any }>(`/companies/${id}/approve`, {
      method: "PATCH",
    });
  }

  async getPendingCompanies() {
    return this.request<{ companies: any[] }>("/companies/pending");
  }

  async searchCompanies(name: string) {
    return this.request<{ companies: any[] }>(
      `/companies/search?name=${encodeURIComponent(name)}`
    );
  }

  async getCompaniesByCategory(categoryId: string) {
    return this.request<{ companies: any[] }>(
      `/companies/category/${categoryId}`
    );
  }

  // Categories endpoints
  async getCategories() {
    return this.request<{ categories: any[] }>("/categories");
  }

  async createCategory(data: any) {
    return this.request<{ category: any }>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: any) {
    return this.request<{ category: any }>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/categories/${id}`, { method: "DELETE" });
  }

  // Analytics endpoints
  async getAnalytics() {
    return this.request<{
      totalAds: number;
      pendingAds: number;
      approvedAds: number;
      rejectedAds: number;
      totalUsers: number;
      recentActivity: any[];
    }>("/analytics");
  }

  // File upload endpoints
  async uploadImage(file: File, folder?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);

    return this.request<{ url: string; publicId: string }>("/upload", {
      method: "POST",
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        ...getAuthHeaders(),
      },
    });
  }

  async deleteImage(publicId: string) {
    return this.request(`/upload/${publicId}`, { method: "DELETE" });
  }

  // Notifications endpoints
  async sendNotification(data: {
    email: string;
    type: "approval" | "rejection" | "pending";
    companyName: string;
    reason?: string;
  }) {
    return this.request("/notifications/send", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();

// Export individual functions for convenience
export const {
  signIn,
  signUp,
  signOut,
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  approveCompany,
  getPendingCompanies,
  searchCompanies,
  getCompaniesByCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAnalytics,
  uploadImage,
  deleteImage,
  sendNotification,
} = api;

// Backward compatibility aliases
export const getAds = getCompanies;
export const getAd = getCompany;
export const createAd = createCompany;
export const updateAd = updateCompany;
export const deleteAd = deleteCompany;
export const approveAd = approveCompany;

// API objects for actions.ts
export const adsApi = {
  create: createCompany,
  update: updateCompany,
  delete: deleteCompany,
  approve: approveCompany,
  getAll: getCompanies,
  getById: getCompany,
  getPending: getPendingCompanies,
};

export const usersApi = {
  getAll: (page = 1, limit = 10) =>
    api.request<{ users: any[]; results: number }>(
      `/users?page=${page}&limit=${limit}`
    ),
  getById: (id: string) => api.request<{ user: any }>(`/users/${id}`),
  create: (data: any) =>
    api.request<{ user: any }>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    api.request<{ user: any }>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) => api.request(`/users/${id}`, { method: "DELETE" }),
  changePassword: (id: string, password: string) =>
    api.request(`/users/changePassword/${id}`, {
      method: "PUT",
      body: JSON.stringify({ password }),
    }),
};

export const categoriesApi = {
  create: createCategory,
  update: updateCategory,
  delete: deleteCategory,
  getAll: getCategories,
};
