"use client";

import { useEffect } from "react";
import { initializeAuth } from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth state from localStorage when the app starts
    initializeAuth();
  }, []);

  return <>{children}</>;
}
