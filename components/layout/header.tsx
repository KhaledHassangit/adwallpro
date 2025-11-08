"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/providers/lang-provider";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { cn } from "@/lib/utils";
import {
  Home,
  Grid3X3,
  Info,
  Shield,
  Sparkles,
  HelpCircle,
} from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Logo from "../Logo";

export function UltraHeader() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

const nav = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/categories", label: t("categories"), icon: Grid3X3 },
    { href: "/about", label: t("aboutUs"), icon: Info },
    { href: "/faq", label: t("FAQ"), icon: HelpCircle },
    { href: "/privacy-policy", label: t("privacyPolicy"), icon: Shield },
  ];
  return (
    <header
      className={cn(
        "top-0 left-0 right-0 z-50 py-2.5 transition-all duration-500 bg-transparent w-full"
      )}
    >
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 max-w-screen-2xl">
        <div className="flex h-16 lg:h-18 items-center justify-between">
          {/* Logo */}
          <Logo t={t} />

          {/* Desktop Navigation - Now uses xl: breakpoint */}
          <nav className="hidden xl:flex items-center gap-1.5 sm:gap-2">
            {nav.map((n) => {
              const Icon = n.icon;
              const isActive =
                pathname === n.href ||
                (n.href === "/categories" &&
                  (pathname.startsWith("/category") ||
                    pathname.startsWith("/companies/category") ||
                    pathname === "/categories"));

              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "group flex items-center gap-1.5 sm:gap-2.5 rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-[13px] sm:text-[15px] md:text-base font-semibold transition-all duration-200",
                    "hover:bg-primary-50 dark:hover:bg-primary-950/50",
                    isActive
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 shadow"
                      : "text-foreground/80 hover:text-primary-600"
                  )}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 " />
                  <span className="hidden sm:inline">{n.label}</span>
                  {isActive && (
                    <Sparkles className="h-3 w-3 text-primary-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions - Now uses xl: breakpoint */}
          <div className="hidden xl:flex items-center gap-3 sm:gap-4">
            <SignInDialog />
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button - Now uses xl:hidden */}
          <div className="flex items-center gap-2 sm:gap-3 xl:hidden">
            {/* LanguageSwitcher and ThemeToggle are always visible */}
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative h-10 w-10 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/50"
            >
              <div className="flex flex-col items-center justify-center">
                <span
                  className={cn(
                    "block h-0.5 w-5 bg-current transition-all duration-300",
                    mobileOpen ? "rotate-45 translate-y-1.5" : ""
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-5 bg-current transition-all duration-300 mt-1.5",
                    mobileOpen ? "opacity-0" : ""
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-5 bg-current transition-all duration-300 mt-1.5",
                    mobileOpen ? "-rotate-45 -translate-y-1.5" : ""
                  )}
                />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Now uses xl:hidden */}
      <div
        className={cn(
          "xl:hidden absolute inset-x-0 top-16 sm:top-18 my-[20px] mx-auto transition-all duration-500 ease-out z-40",
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-8 pointer-events-none"
        )}
      >
        <div className="bg-background/95 backdrop-blur-sm border border-border/50 mx-4 sm:mx-6 rounded-2xl shadow-xl">
          <div className="p-5 sm:p-6 space-y-5 sm:space-y-6">
            <nav className="space-y-2 sm:space-y-3">
              {nav.map((n) => {
                const Icon = n.icon;
                const isActive =
                  pathname === n.href ||
                  (n.href === "/categories" &&
                    (pathname.startsWith("/category") ||
                      pathname.startsWith("/companies/category") ||
                      pathname === "/categories"));

                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-4 py-2 text-base font-semibold transition-all duration-200",
                      isActive
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 shadow-sm"
                        : "text-foreground/70 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-950/50"
                    )}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    {n.label}
                    {isActive && (
                      <Sparkles className="h-4 w-4 text-primary-500 ml-auto" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t pt-4">
              {/* Removed LanguageSwitcher and ThemeToggle from here */}
              <SignInDialog />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}