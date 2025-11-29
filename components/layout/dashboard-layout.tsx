"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Menu, User2, Bell, BellRing, Check, CheckCheck, X, ExternalLink, ChevronDown } from "lucide-react";
import { useUserStore, signOut } from "@/lib/auth"; 
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
import { useNotificationStore } from "@/lib/notificationStore";
import { useGetNotificationsQuery, useMarkAllAsReadMutation, useMarkAsReadMutation, useDeleteNotificationMutation } from "@/features/notificationsApi";

// Define navigation items separately
function getAdminNavItems(t: (key: string) => string) {
  return [
    { title: t("overview"), href: "/admin", icon: LayoutDashboard },
    { title: t("companiesManagementNav"), href: "/admin/companies", icon: Building2 },
    { title: t("subscriptionPlans"), href: "/admin/plans", icon: PlusCircle },
    { title: t("usersManagement"), href: "/admin/users", icon: Users },
    { title: t("categoriesManagement"), href: "/admin/categories", icon: Tags },
    { title: t("couponsManagement"), href: "/admin/coupons", icon: Ticket },
    { title: t("personalProfile"), href: "/admin/profile", icon: User2 },
  ];
}

function getUserNavItems(t: (key: string) => string) {
  return [
    { title: t("overview"), href: "/manage", icon: LayoutDashboard },
    { title: t("adsManagement"), href: "/manage/ads", icon: Eye },
    { title: t("subscriptionPlans"), href: "/manage/subscriptions", icon: Ticket },
    { title: t("personalProfile"), href: "/manage/profile", icon: User },
  ];
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType?: "admin" | "user";
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  
  // Get user data from store
  const { user } = useUserStore();
  
  // Determine navigation based on userType prop
  const navItems = userType === "admin" ? getAdminNavItems(t) : getUserNavItems(t);

  // Notification state
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const [notificationLimit, setNotificationLimit] = useState(5);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Check if current language is RTL
  const isRTL = locale === "ar";

  // Notification API hooks
  const { data: notificationsData, isLoading, refetch } = useGetNotificationsQuery({
    limit: notificationLimit,
  });
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  // FIX: Extract notifications correctly from the API response
  const notifications = notificationsData?.data?.data?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalResults = notificationsData?.data?.results || 0;
  const hasMore = notifications.length < totalResults;

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationPanelOpen((prev) => !prev);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      refetch();
    } catch (error: any) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
      refetch();
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
      refetch();
    } catch (error: any) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleLoadMore = () => {
    setNotificationLimit(prev => prev + 5);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Bell className="h-4 w-4 text-yellow-500" />;
      default:
        return <BellRing className="h-4 w-4 text-blue-500" />;
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isNotificationPanelOpen &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.notification-dropdown')
      ) {
        setIsNotificationPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationPanelOpen]);

  return (
    <div className="flex min-h-screen relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed lg:relative z-30 w-64 h-screen lg:h-auto lg:min-h-screen transition-all duration-300 ease-in-out",
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
              // Normalize pathname to remove optional locale prefix (/en or /ar)
              const rawPath = pathname || "";
              const segments = rawPath.split("/").filter(Boolean);
              const locales = ["en", "ar"];
              let pathnameBase = rawPath;
              if (segments.length && locales.includes(segments[0])) {
                pathnameBase = "/" + segments.slice(1).join("/");
                if (pathnameBase === "") pathnameBase = "/";
              }

              const isActive = pathnameBase === item.href || pathnameBase.startsWith(item.href + "/");

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
                    {user?.name || t("user")}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className={cn(
              "flex items-center gap-3",
              isRTL && "order-1"
            )}>
              {/* Notification Icon with Dropdown */}
              <div className="relative">
                <DropdownMenu open={isNotificationPanelOpen} onOpenChange={setIsNotificationPanelOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      ref={notificationButtonRef}
                      variant="ghost"
                      size="icon"
                      className="relative"
                    >
                      <BellRing className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                      )}
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-80 notification-dropdown bg-background border-border shadow-lg max-h-[400px] overflow-hidden" 
                    align="end" 
                    forceMount
                  >
                    <DropdownMenuLabel className="flex items-center justify-between bg-secondary/50 px-4 py-3">
                      {t("notifications")}
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMarkAllAsRead}
                          className="h-auto p-0 text-xs"
                        >
                          {t("markAllAsRead")}
                        </Button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[300px] overflow-y-auto">
                      {isLoading ? (
                        <div className="p-4 text-center">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mx-auto"></div>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <DropdownMenuItem
                            key={notification._id}
                            className={`flex flex-col items-start p-4 cursor-pointer notification-dropdown-item ${!notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
                            onClick={() => {
                              if (!notification.read) {
                                handleMarkAsRead(notification._id);
                              }
                            }}
                          >
                            <div className="flex w-full items-start justify-between">
                              <div className="flex items-start gap-2">
                                {getNotificationIcon(notification.type)}
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{notification.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(notification.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notification._id);
                                }}
                                className="h-auto p-0 text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          {t("noNotifications")}
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        {hasMore ? (
                          <DropdownMenuItem className="cursor-pointer justify-center" onClick={handleLoadMore}>
                            <Button variant="ghost" size="sm" className="w-full">
                              <ChevronDown className="h-4 w-4 mr-2" />
                              {t("loadMore")}
                            </Button>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="cursor-pointer justify-center" asChild>
                            <a href="/admin/notifications" className="flex items-center justify-center w-full">
                              <Button variant="ghost" size="sm" className="w-full">
                                {t("viewAllNotifications")}
                                <ExternalLink className="h-4 w-4 ml-2" />
                              </Button>
                            </a>
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
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