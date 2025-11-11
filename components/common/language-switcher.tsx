"use client";

import { Globe } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const next = locale === "ar" ? "en" : "ar";
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(next)}
      aria-label="Switch language"
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase">{next}</span>
    </Button>
  );
}
