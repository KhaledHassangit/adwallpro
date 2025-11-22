"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, UserCheck, Activity, Building, Tag } from "lucide-react";
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

interface AnalyticsData {
  userCount: number;
  adminCount: number;
  companies: {
    active: number;
    pending: number;
  };
  categoryCount: number;
  latestActivities: AnalyticsRecord[];
}

export function UserStatsCards({ analyticsData }: { analyticsData: AnalyticsData | null }) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary>({
    totalEvents: 0,
    last24Hours: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // Calculate analytics summary from latest activities
    if (analyticsData?.latestActivities) {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const last24HoursActivities = analyticsData.latestActivities.filter(
        activity => new Date(activity.timestamp) > last24Hours
      );
      
      // Get unique IPs from last 24 hours as active users approximation
      const uniqueIPs = new Set(last24HoursActivities.map(activity => activity.ip));
      
      setAnalyticsSummary({
        totalEvents: analyticsData.latestActivities.length,
        last24Hours: last24HoursActivities.length,
        activeUsers: uniqueIPs.size,
      });
    }
    
    // Set loading to false once we have the data
    setLoading(false);
  }, [analyticsData]);

  // Calculate user statistics
  const userStats: UserStats | null = analyticsData ? {
    totalUsers: analyticsData.userCount || 0,
    adminsCount: analyticsData.adminCount || 0,
    regularUsersCount: (analyticsData.userCount || 0) - (analyticsData.adminCount || 0),
    activeThisWeek: analyticsSummary.activeUsers,
    adminPercentage: analyticsData.userCount 
      ? Math.round((analyticsData.adminCount / analyticsData.userCount) * 100).toString() 
      : "0",
    regularUserPercentage: analyticsData.userCount 
      ? Math.round(((analyticsData.userCount - analyticsData.adminCount) / analyticsData.userCount) * 100).toString() 
      : "0",
    activePercentage: analyticsData.userCount 
      ? Math.round((analyticsSummary.activeUsers / analyticsData.userCount) * 100).toString() 
      : "0",
  } : null;

  if (loading || !userStats) {
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
    icon: any;
    color: string;
    bgColor: string;
    percentage: string;
    extra?: string;
  };

  const statCards: StatCardConfig[] = [
    {
      title: t("totalUsers"),
      value: userStats.totalUsers.toLocaleString() || "0",
      subtitle: t("registeredUser"),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      percentage: "100%",
    },
    {
      title: t("admins"),
      value: userStats.adminsCount || 0,
      subtitle: t("adminAccounts"),
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/50",
      percentage: `${userStats.adminPercentage || 0}%`,
    },
    {
      title: t("regularUsers"),
      value: userStats.regularUsersCount.toLocaleString() || "0",
      subtitle: t("adUsers"),
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      percentage: `${userStats.regularUserPercentage || 0}%`,
    },
    {
      title: t("activeThisWeek"),
      value: analyticsSummary.activeUsers || userStats.activeThisWeek || 0,
      subtitle: t("activeUserLast7Days"),
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
      percentage: `${userStats.activePercentage || 0}%`,
      extra: `${analyticsSummary.last24Hours} ${
        t("eventsLast24h") || "events in the last 24h"
      }`,
    },
  ];

  // Additional cards for companies and categories
  const additionalCards: StatCardConfig[] = [
    {
      title: t("activeCompanies"),
      value: analyticsData?.companies?.active || 0,
      subtitle: t("companies"),
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      percentage: "N/A",
    },
    {
      title: t("pendingCompanies"),
      value: analyticsData?.companies?.pending || 0,
      subtitle: t("pendingApproval"),
      icon: Building,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
      percentage: "N/A",
    },
    {
      title: t("totalCategories"),
      value: analyticsData?.categoryCount || 0,
      subtitle: t("categories"),
      icon: Tag,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/50",
      percentage: "N/A",
    },
  ];

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
      
      <div className="grid gap-6 md:grid-cols-3">
        {additionalCards.map((stat, index) => {
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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}