"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { dict, type Locale } from "@/i18n/dict";

type Ctx = {
  locale: Locale;
  lang: Locale; // alias
  setLocale: (l: Locale) => void;
  t: (k: string) => string;
  dir: "rtl" | "ltr";
};

const LangContext = createContext<Ctx | null>(null);

// ✅ Helper: Get initial locale safely
const getInitialLocale = (): Locale => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved) return saved;
  }
  return "en"; // force English by default
};

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  // ✅ Update <html> lang & dir whenever locale changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
      localStorage.setItem("locale", locale);
    }
  }, [locale]);

  // ✅ Change locale programmatically
  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
      localStorage.setItem("locale", l);
    }
  }, []);

  // ✅ Translation function
  const t = useCallback(
    (k: string) => dict[locale]?.[k as keyof typeof dict[Locale]] ?? k,
    [locale]
  );

  const dir: "rtl" | "ltr" = locale === "ar" ? "rtl" : "ltr";

  const value = useMemo(
    () => ({ locale, lang: locale, setLocale, t, dir }),
    [locale, setLocale, t, dir]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// ✅ Hook
export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used within LangProvider");
  return ctx;
}
