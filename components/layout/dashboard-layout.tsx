"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User2 } from "lucide-react";
import { useAuthStore, signOut, getCurrentUser, isAdmin } from "@/lib/auth";
import { useI18n } from "@/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";
import Logo from "../Logo";
import {
  LayoutDashboard,
  Building2,
  Users,
  Tags,
  Ticket,
  Settings,
  Eye,
  PlusCircle,
  User,
} from "@/components/ui/icon";

function getAdminNavItems(t: (key: string) => string) {
  return [
    { title: t("overview"), href: "/admin", icon: LayoutDashboard },
    { title: t("companiesManagementNav"), href: "/admin/companies", icon: Building2 },
    { title: t("usersManagement"), href: "/admin/users", icon: Users },
    { title: t("categoriesManagement"), href: "/admin/categories", icon: Tags },
    { title: t("couponsManagement"), href: "/admin/coupons", icon: Ticket },
    { title: t("personalProfile"), href: "/admin/profile", icon: User2 },
  ];
}

function getUserNavItems(t: (key: string) => string) {
  return [
    { title: t("dashboardControl"), href: "/manage", icon: LayoutDashboard },
    { title: t("adsManagement"), href: "/manage/ads", icon: Eye },
    { title: t("personalProfile"), href: "/manage/profile", icon: Users },
  ];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin(currentUser);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Check if current language is RTL
  const isRTL = locale === "ar";

  const navItems = userIsAdmin ? getAdminNavItems(t) : getUserNavItems(t);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    if (!isSidebarOpen || isLargeScreen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, isLargeScreen]);

  // ✅ يتحكم في الحالة حسب حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      const large = window.innerWidth >= 1024;
      setIsLargeScreen(large);
      setIsSidebarOpen(large ? true : false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed lg:relative z-30 w-64 h-screen lg:h-auto lg:min-h-screen transition-all duration-300 ease-in-out",
          // Adjust transform classes for RTL
          isRTL
            ? isSidebarOpen
              ? "translate-x-0 right-0"
              : "translate-x-full right-0"
            : isSidebarOpen
            ? "translate-x-0 left-0"
            : "-translate-x-full left-0"
        )}
      >
        <div className="flex flex-col h-full glass border-r border-border/50">
          {/* Logo */}
          <div className="p-4 flex items-center border-b border-border/50 mx-auto">
            <Logo
              t={t}
              showSubtitle={false}
              titleClassName="!text-2xl"
              imageClassName="!h-12 !w-12"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 my-5 flex flex-col gap-3 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-xl py-2.5 px-4 transition-all duration-300 border border-border/40 shadow-sm",
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md border-0"
                        : "bg-white text-gray-800 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-white" : "text-gray-600 dark:text-gray-300"
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium transition-colors",
                        isActive ? "text-white" : "text-gray-800 dark:text-gray-200"
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              {t("signOut")}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="w-full glass border-b border-border/50 backdrop-blur-sm">
          <div className="container-premium flex items-center justify-between h-20">
            {/* Left Side: Toggle Button and User Info */}
            <div className={cn(
              "flex items-center gap-3",
              isRTL && "order-2"
            )}>
              {/* Toggle Button (mobile only) */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-sky-500 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-foreground truncate">
                    {currentUser?.name || t("user")}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className={cn(
              "flex items-center gap-3",
              isRTL && "order-1"
            )}>
              <LanguageSwitcher />
              <div className="h-6 w-px bg-border/50" />
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Content + Overlay (for mobile) */}
        <div className="flex-1 relative">
          <div
            className={cn(
              "fixed inset-0 z-20 transition-all duration-300",
              isSidebarOpen && !isLargeScreen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            )}
            onClick={() => setIsSidebarOpen(false)}
          />
          <main className="relative z-10 p-4 overflow-y-auto h-full">{children}</main>
        </div>
      </div>
    </div>
  );
}