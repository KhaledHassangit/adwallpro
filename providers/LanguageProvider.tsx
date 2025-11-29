"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { dict, type Locale } from "@/i18n/dict";

type Ctx = {
  locale: Locale;
  lang: Locale; // alias
  setLocale: (l: Locale) => void;
  t: (k: string) => string;
  dir: "rtl" | "ltr";
};

const LangContext = createContext<Ctx | null>(null);

type LangProviderProps = {
  children: React.ReactNode;
  initialLocale: Locale;
};

export function LangProvider({ children, initialLocale }: LangProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [mounted, setMounted] = useState(false);

  // Sync with URL locale changes
  useEffect(() => {
    setMounted(true);
    const pathLocale = pathname.split("/")[1] as Locale;
    if (pathLocale && ["en", "ar"].includes(pathLocale)) {
      setLocaleState(pathLocale);
      document.documentElement.lang = pathLocale;
      document.documentElement.dir = pathLocale === "ar" ? "rtl" : "ltr";
    }
  }, [pathname]);

  // Change locale and navigate
  const setLocale = useCallback(
    (l: Locale) => {
      setLocaleState(l);
      
      // Update HTML element
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";

      // Extract path without locale prefix
      const segments = pathname.split("/");
      let pathWithoutLocale = pathname;
      
      if (["en", "ar"].includes(segments[1])) {
        pathWithoutLocale = "/" + segments.slice(2).join("/");
      }

      // Navigate to new locale
      router.push(`/${l}${pathWithoutLocale}`);
    },
    [pathname, router]
  );

  // Translation function
  const t = useCallback(
    (k: string) => dict[locale]?.[k as keyof typeof dict[Locale]] ?? k,
    [locale]
  );

  const dir: "rtl" | "ltr" = locale === "ar" ? "rtl" : "ltr";

  const value = useMemo(
    () => ({ locale, lang: locale, setLocale, t, dir }),
    [locale, setLocale, t, dir]
  );

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// Hook
const defaultCtx: Ctx = {
  locale: "en",
  lang: "en",
  setLocale: () => {},
  t: (k: string) => k,
  dir: "ltr",
};

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    // Avoid crashing when hook is used outside provider (e.g., server components or early render)
    // Return a safe fallback and warn during development.
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("useI18n used outside LangProvider - returning fallback context");
    }
    return defaultCtx;
  }
  return ctx;
}
