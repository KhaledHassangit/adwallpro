"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { getCurrentUser } from "@/lib/auth";

export function DashboardHeader() {
  const { t } = useI18n();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getCurrentUser());
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">{t("adminDashboard")}</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {mounted ? user?.email || "" : ""}
          </span>
          <LanguageSwitcher />
          <ThemeToggle />
          <SignInDialog />
        </div>
      </div>
    </header>
  );
}
