"use client";

import type React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { LangProvider } from "@/providers/LanguageProvider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <LangProvider>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
