"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, UserCheck, Activity } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/providers/LanguageProvider";
import { API_BASE_URL, AnalyticsRecord } from "@/lib/api";

interface UserStats {
  totalUsers: number;
  adminsCount: number;
  regularUsersCount: number;
  activeThisWeek: number;
  adminPercentage: string;
  regularUserPercentage: string;
  activePercentage: string;
}

interface AnalyticsSummary {
  totalEvents: number;
  last24Hours: number;
  activeUsers: number;
}

export function UserStatsCards() {
  const { t } = useI18n();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary>({
    totalEvents: 0,
    last24Hours: 0,
    activeUsers: 0,
  });

  // جلب إحصائيات المستخدمين من API
  const fetchUserStats = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      console.log(
        "Fetching user stats with token:",
        token ? "Token exists" : "No token"
      );

      const response = await fetch("https://adwallpro.com/api/v1/users/stats", {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      });

      console.log("API Response status:", response.status);
      console.log("API Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error response:", errorText);
        throw new Error(`${t("errorFetchingUserStats")}: ${response.status}`);
      }

      const data = await response.json();
      console.log("User stats data received:", data);
      setUserStats(data.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast.error(t("errorFetchingUserStats"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
    fetchAnalyticsSummary();
  }, []);

  const fetchAnalyticsSummary = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      const params = new URLSearchParams({
        role: "user",
        sort: "-timestamp",
        limit: "200",
      });

      const response = await fetch(
        `${API_BASE_URL}/analytics?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics summary");
      }

      const payload = await response.json();
      const analyticsData: AnalyticsRecord[] = Array.isArray(
        payload?.data?.data
      )
        ? payload.data.data
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

      const now = Date.now();
      const last24h = now - 24 * 60 * 60 * 1000;
      const last7d = now - 7 * 24 * 60 * 60 * 1000;

      const last24hEvents = analyticsData.filter((record) => {
        const ts = new Date(record.timestamp).getTime();
        return ts >= last24h;
      }).length;

      const activeUsersSet = new Set(
        analyticsData
          .filter((record) => {
            const ts = new Date(record.timestamp).getTime();
            return ts >= last7d;
          })
          .map((record) => record.user)
          .filter(Boolean)
      );

      setAnalyticsSummary({
        totalEvents: analyticsData.length,
        last24Hours: last24hEvents,
        activeUsers: activeUsersSet.size,
      });
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="ultra-card border-0">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  type StatCardConfig = {
    title: string;
    value: string | number;
    subtitle: string;
    icon: typeof Users;
    color: string;
    bgColor: string;
    percentage: string;
    extra?: string;
  };

  const statCards: StatCardConfig[] = [
    {
      title: t("totalUsers"),
      value: userStats?.totalUsers.toLocaleString() || "0",
      subtitle: t("registeredUser"),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      percentage: "100%",
    },
    {
      title: t("admins"),
      value: userStats?.adminsCount || 0,
      subtitle: t("adminAccounts"),
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/50",
      percentage: `${userStats?.adminPercentage || 0}%`,
    },
    {
      title: t("regularUsers"),
      value: userStats?.regularUsersCount.toLocaleString() || "0",
      subtitle: t("adUsers"),
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      percentage: `${userStats?.regularUserPercentage || 0}%`,
    },
    {
      title: t("activeThisWeek"),
      value: analyticsSummary.activeUsers || userStats?.activeThisWeek || 0,
      subtitle: t("activeUserLast7Days"),
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
      percentage: `${userStats?.activePercentage || 0}%`,
      extra: `${analyticsSummary.last24Hours} ${
        t("eventsLast24h") || "events in the last 24h"
      }`,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="ultra-card border-0 hover:shadow-lg transition-shadow"
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
              <div className="text-3xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                {stat.subtitle}
              </p>
              <div className="flex items-center gap-2">
                <div className={`text-xs font-medium ${stat.color}`}>
                  {stat.percentage}
                </div>
                <div className="text-xs text-muted-foreground">{t("ofTotal")}</div>
              </div>
              {stat.extra && (
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.extra}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}