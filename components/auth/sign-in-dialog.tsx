"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/providers/LanguageProvider";
import { signOut, useUserStore, type User } from "@/lib/auth"; // <-- 1. Import useUserStore
import { LogIn, LogOut, Shield, UserIcon, Sparkles } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function SignInDialog() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { user } = useUserStore(); // <-- 2. Get user from the correct store
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isArabic = locale === "ar";

  // This effect for closing the dropdown is fine
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    // The component will automatically re-render with `user` as null
    // because the signOut function updates the Zustand store.
    router.push("/");
    window.location.reload();
  };

  // The component now uses the `user` from the store directly
  if (user) {
    return (
      <div className="relative w-full lg:w-auto" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "group flex items-center gap-2.5 rounded-xl px-4 sm:px-5 py-2.5 text-[15px] sm:text-base font-semibold transition-all duration-200 w-full",
            "hover:bg-primary-50 dark:hover:bg-primary-950/50",
            open
              ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 shadow"
              : "text-foreground/80 hover:text-primary-600"
          )}
        >
          {user.role === "admin" ? (
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
          ) : (
            <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400" />
          )}
          <span className="truncate">{user.name || user.email}</span>
          <svg
            className={cn(
              "h-4 w-4 ml-auto transform transition-transform duration-300",
              open && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        <div
          className={cn(
            "absolute left-0 right-0 top-full z-50 w-full rounded-2xl overflow-hidden border border-border/50 shadow-2xl backdrop-blur-md",
            "bg-background/95 transition-all duration-300 ease-in-out",
            open
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2"
          )}
        >
          <Link
            href={user.role === "admin" ? "/admin/" : "/manage"}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2.5 text-[15px] font-semibold transition-all duration-200 w-full",
              "text-foreground/70 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/50"
            )}
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600 dark:text-primary-400" />
            {isArabic ? "لوحة التحكم" : "Dashboard"}
            <Sparkles className="h-3 w-3 text-primary-500 ml-auto" />
          </Link>

          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2.5 text-[15px] font-semibold w-full transition-all duration-200",
              "text-[#c81c1c] hover:bg-primary-50 dark:hover:bg-primary-950/50"
            )}
          >
            <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
            {isArabic ? "تسجيل الخروج" : t("signOut")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-auto">
      <Link href="/login">
        <Button size="sm" className="btn-ultra text-white">
          <LogIn className="h-4 w-4 mr-2" />
          {t("signIn")}
        </Button>
      </Link>
    </div>
  );
}

export function SignInButton() {
  return <SignInDialog />;
}