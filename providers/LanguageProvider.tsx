"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dict, type Locale } from "@/i18n/dict";

type Ctx = {
  locale: Locale;
  lang: Locale; // alias
  setLocale: (l: Locale) => void;
  t: (k: string) => string;
  dir: "rtl" | "ltr";
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("locale") as Locale | null) : null;
    if (saved) setLocaleState(saved);
    else {
      const nav = typeof window !== "undefined" ? navigator.language : "ar";
      setLocaleState(nav.startsWith("ar") ? "ar" : "en");
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", l);
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const t = useCallback(
    (k: string) => dict[locale]?.[k as keyof typeof dict[Locale]] ?? k,
    [locale]
  );

  const dir = locale === "ar" ? "rtl" : "ltr";

  const value = useMemo(() => ({ locale, lang: locale, setLocale, t, dir }), [locale, setLocale, t, dir]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used within LangProvider");
  return ctx;
}
