"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
}

// ====================
// 🧩 Auth Store (Zustand)
// ====================
interface AuthState {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) => set({ token }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      logout: () => set({ user: null, token: null }),
      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    { name: "auth-storage" }
  )
);

// ====================
// 🧩 API BASE URLS
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

  const user = data.user || data.data || data;
  const token = data.token;

  if (!user || !token) throw new Error("استجابة غير صحيحة من الخادم");

  // ✅ Update store & localStorage
  const store = useAuthStore.getState();
  store.setUser(user);
  store.setToken(token);
  localStorage.setItem("auth_token", token);
  localStorage.setItem("user_data", JSON.stringify(user));

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
  const store = useAuthStore.getState();
  store.setUser(user);
  store.setToken(token);
  localStorage.setItem("auth_token", token);
  localStorage.setItem("user_data", JSON.stringify(user));

  return { user, token };
};

// 🔹 Sign Out
export const signOut = async (): Promise<void> => {
  const store = useAuthStore.getState();
  store.logout();
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
};

// ====================
// 🧩 Getters
// ====================
export const getCurrentUser = (): User | null => {
  const storeUser = useAuthStore.getState().user;
  if (storeUser) return storeUser;

  if (typeof window !== "undefined") {
    const data = localStorage.getItem("user_data");
    if (data) {
      try {
        const user = JSON.parse(data);
        useAuthStore.getState().setUser(user);
        return user;
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }
  return null;
};

export const getAuthToken = (): string | null => {
  const token = useAuthStore.getState().token;
  if (token) return token;

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("auth_token");
    if (saved) {
      useAuthStore.getState().setToken(saved);
      return saved;
    }
  }
  return null;
};

// ====================
// 🧩 Helpers
// ====================
export const isAuthenticated = (): boolean =>
  !!getCurrentUser() && !!getAuthToken();

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
// 🧩 Update Profile (New Correct API)
// ====================
export const updateUserProfile = async (
  userData: { name: string; email: string; phone?: string }
): Promise<User> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");

  console.log("🔥 USING UPDATE API:", `${API_BASE}/users/updateMe`);

  const response = await fetch(`${API_BASE}/users/updateMe`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  console.log("UpdateMe Response:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  // ✅ Update store & localStorage
  useAuthStore.getState().updateUser(data);
  localStorage.setItem("user_data", JSON.stringify(data));

  return data;
};

// ====================
// 🧩 Initialize Auth from LocalStorage
// ====================
export const initializeAuth = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user_data");

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        const store = useAuthStore.getState();
        store.setToken(token);
        store.setUser(user);
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      }
    }
  }
};
