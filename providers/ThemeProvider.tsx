"use client";

import type React from "react";
import { Provider } from 'react-redux'; // 1. Import the Redux Provider

import { ThemeProvider } from "@/components/theme-provider";
import { LangProvider } from "@/providers/LanguageProvider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { store } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}