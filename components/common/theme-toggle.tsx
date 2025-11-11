"use client";

import { Moon, Sun } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useI18n } from "@/providers/LanguageProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("theme")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
