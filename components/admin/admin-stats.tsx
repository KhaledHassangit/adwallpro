"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllAds,
  getUsers,
  getPendingAds,
  getApprovedAds,
  getRejectedAds,
} from "@/lib/store";
import { useMemo } from "react";
import { useI18n } from "@/providers/LanguageProvider";
import {
  Building2,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  UserCheck,
  Shield,
} from "@/components/ui/icon";
import { useNotifications } from "@/hooks/notifications";

interface UserStats {
  totalUsers: number;
  adminsCount: number;
  regularUsersCount: number;
  activeThisWeek: number;
  adminPercentage: string;
  regularUserPercentage: string;
  activePercentage: string;
}

export function AdminStats() {
  const { t } = useI18n();
  const notifications = useNotifications();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // جلب إحصائيات المستخدمين من API
  const fetchUserStats = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      const response = await fetch("https://adwallpro.com/api/v1/users/stats", {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("فشل في جلب إحصائيات المستخدمين");
      }

      const data = await response.json();
      setUserStats(data.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      notifications.error("فشل في جلب إحصائيات المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  const stats = useMemo(() => {
    const allAds = getAllAds();
    const users = getUsers();
    const pendingAds = getPendingAds();
    const approvedAds = getApprovedAds();
    const rejectedAds = getRejectedAds();
    const vipCount = approvedAds.filter((a) => a.isVip).length;

    return {
      totalAds: allAds.length,
      totalUsers: userStats?.totalUsers || users.length,
      pendingAds: pendingAds.length,
      approvedAds: approvedAds.length,
      rejectedAds: rejectedAds.length,
      vipAds: vipCount,
      adminsCount: userStats?.adminsCount || 0,
      regularUsersCount: userStats?.regularUsersCount || 0,
      activeThisWeek: userStats?.activeThisWeek || 0,
    };
  }, [userStats]);

  const statCards = [
    {
      title: "إجمالي المستخدمين",
      value: loading ? "..." : stats.totalUsers.toLocaleString(),
      subtitle: "مستخدم مسجل في النظام",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "المدراء",
      value: loading ? "..." : stats.adminsCount,
      subtitle: "حسابات إدارية",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/50",
    },
    {
      title: "المستخدمون العاديون",
      value: loading ? "..." : stats.regularUsersCount.toLocaleString(),
      subtitle: "مستخدمين للإعلانات",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/50",
    },
    {
      title: "نشط هذا الأسبوع",
      value: loading ? "..." : stats.activeThisWeek,
      subtitle: "مستخدم نشط في آخر 7 أيام",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
    },
    {
      title: "طلبات معلقة",
      value: stats.pendingAds,
      subtitle: "تحتاج مراجعة",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
      urgent: stats.pendingAds > 0,
    },
    {
      title: t("totalAds"),
      value: stats.totalAds,
      subtitle: "إجمالي الإعلانات",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`ultra-card border-0 ${
              stat.urgent ? "ring-2 ring-orange-200 animate-pulse" : ""
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.subtitle}
              </p>
              {stat.urgent && (
                <p className="text-xs text-orange-600 mt-1 font-medium">
                  يتطلب مراجعة فورية
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
