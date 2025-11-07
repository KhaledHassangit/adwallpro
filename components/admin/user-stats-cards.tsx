"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, UserCheck, Activity } from "lucide-react";
import { toast } from "sonner";

interface UserStats {
  totalUsers: number;
  adminsCount: number;
  regularUsersCount: number;
  activeThisWeek: number;
  adminPercentage: string;
  regularUserPercentage: string;
  activePercentage: string;
}

export function UserStatsCards() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

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
        throw new Error(`فشل في جلب إحصائيات المستخدمين: ${response.status}`);
      }

      const data = await response.json();
      console.log("User stats data received:", data);
      setUserStats(data.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast.error("فشل في جلب إحصائيات المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

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

  const statCards = [
    {
      title: "إجمالي المستخدمين",
      value: userStats?.totalUsers.toLocaleString() || "0",
      subtitle: "مستخدم مسجل في النظام",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      percentage: "100%",
    },
    {
      title: "المدراء",
      value: userStats?.adminsCount || 0,
      subtitle: "حسابات إدارية",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/50",
      percentage: `${userStats?.adminPercentage || 0}%`,
    },
    {
      title: "المستخدمون العاديون",
      value: userStats?.regularUsersCount.toLocaleString() || "0",
      subtitle: "مستخدمين للإعلانات",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      percentage: `${userStats?.regularUserPercentage || 0}%`,
    },
    {
      title: "نشط هذا الأسبوع",
      value: userStats?.activeThisWeek || 0,
      subtitle: "مستخدم نشط في آخر 7 أيام",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
      percentage: `${userStats?.activePercentage || 0}%`,
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
                <div className="text-xs text-muted-foreground">من الإجمالي</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
