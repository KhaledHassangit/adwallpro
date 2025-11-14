"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

// ====================
// 🧩 User Interface
// ====================
export interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  phone?: string;
  active: boolean;
  addresses: any[];
  createdAt: string;
  lastLogin: string;
  updatedAt: string;
  wishlist: any[];
  __v: number;
  subscription?: {
    adsUsed: number;
    isActive: boolean;
  };
}

// ====================
// 🧩 Cookie Helpers
// ====================
const TOKEN_COOKIE_NAME = "auth_token";

export const setAuthCookie = (token: string) => {
  Cookies.set(TOKEN_COOKIE_NAME, token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: '/', // Ensure cookie is available across the site
  });
};

export const getAuthCookie = (): string | undefined => {
  return Cookies.get(TOKEN_COOKIE_NAME);
};

export const removeAuthCookie = () => {
  Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
};

// ====================
// 🧩 User Store (Zustand) - Manages User Data
// ====================
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (userData) =>
        set((state) => {
          if (!state.user) return state;
          return { user: { ...state.user, ...userData } };
        }),
    }),
    {
      name: "user-storage", // name of the item in localStorage
    }
  )
);

// ====================
// 🧩 Auth Store (Zustand) - Manages Auth State
// ====================
interface AuthState {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  isLoading: false,
  isAuthenticated: false,
  setToken: (token) => set({ token, isAuthenticated: !!token }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    useUserStore.getState().setUser(null);
    removeAuthCookie();
    set({ token: null, isAuthenticated: false });
  },
}));

// ====================
// 🧩 API BASE URL
// ====================
const API_BASE = "http://72.60.178.180:8000/api/v1";

// ====================
// 🧩 Authentication Logic
// ====================

// 🔹 Sign In
export const signIn = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  console.log("Login Response:", data);

  if (!response.ok) {
    throw new Error(data.message || "فشل في تسجيل الدخول");
  }

  // Updated extraction logic for the new response structure
  const user = data.data?.data || data.data || data.user || data;
  const token = data.data?.token || data.token;

  if (!user || !token) throw new Error("استجابة غير صحيحة من الخادم");

  // ✅ Update stores & set cookie
  useAuthStore.getState().setToken(token);
  useUserStore.getState().setUser(user);
  setAuthCookie(token);

  return { user, token };
};

// 🔹 Sign Up
export const signUp = async (
  name: string,
  email: string,
  password: string,
  passwordConfirm: string,
  phone?: string
): Promise<{ user: User; token: string }> => {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, passwordConfirm, phone }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "فشل في إنشاء الحساب");

  const { user, token } = data;
  
  // ✅ Update stores & set cookie
  useAuthStore.getState().setToken(token);
  useUserStore.getState().setUser(user);
  setAuthCookie(token);

  return { user, token };
};

// 🔹 Sign Out
export const signOut = async (): Promise<void> => {
  // The logout action in the store now handles clearing everything
  useAuthStore.getState().logout();
};

// ====================
// 🧩 Getters & Helpers
// ====================
export const getCurrentUser = (): User | null => {
  return useUserStore.getState().user;
};

export const getAuthToken = (): string | null => {
  // Prioritize the store's token, then check the cookie as a fallback
  const storeToken = useAuthStore.getState().token;
  if (storeToken) return storeToken;
  
  const cookieToken = getAuthCookie();
  if (cookieToken) {
    useAuthStore.getState().setToken(cookieToken); // Sync store with cookie
    return cookieToken;
  }

  return null;
};

export const isAdmin = (user?: User | null): boolean =>
  (user || getCurrentUser())?.role === "admin";

export const requireAuth = (): User => {
  const user = getCurrentUser();
  if (!user) throw new Error("Authentication required");
  return user;
};

export const requireAdmin = (): User => {
  const user = requireAuth();
  if (user.role !== "admin") throw new Error("Admin access required");
  return user;
};

// 🔹 Auth Headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };
};

// ====================
// 🧩 Update Profile
// ====================
export const updateUserProfile = async (
  userData: { name: string; email: string; phone?: string }
): Promise<User> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(`${API_BASE}/users/updateMe`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().logout();
    }
    throw new Error(data.message || "Failed to update profile");
  }

  const updatedUser = data.user || data;
  // ✅ Update only the user store
  useUserStore.getState().updateUser(updatedUser);

  return updatedUser;
};

// ====================
// 🧩 Refresh User Data
// ====================
export const refreshUserData = async (): Promise<User> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  const response = await fetch(`${API_BASE}/users/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to refresh user data");
  }

  const user = data.user || data;
  // ✅ Update only the user store
  useUserStore.getState().setUser(user);
  return user;
};

// ====================
// 🧩 Initialize Auth from Cookie/Storage
// ====================
export const initializeAuth = () => {
  if (typeof window !== "undefined") {
    // Zustand's persist middleware will automatically rehydrate useUserStore
    // We just need to sync the token from the cookie to the auth store
    const token = getAuthCookie();
    if (token) {
      useAuthStore.getState().setToken(token);
    }
  }
};