"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminRoute } from "@/components/auth/route-guard";
import { UserStatsCards } from "@/components/admin/user-stats-cards";
import { useI18n } from "@/providers/lang-provider";
import {
  Building2,
  Users,
  Tags,
  AlertCircle,
  CheckCircle,
  Clock,
  Ticket,
} from "@/components/ui/icon";
import Link from "next/link";

interface StatsData {
  totalCompanies: number;
  pendingCompanies: number;
  approvedCompanies: number;
  rejectedCompanies: number;
  totalUsers: number;
  totalCategories: number;
  totalCoupons: number;
  recentActivity: any[];
}

function AdminDashboardContent() {
  const { t } = useI18n();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Admin dashboard component mounted");
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // جلب البيانات من الـ API
      const [companiesRes, usersRes, categoriesRes, couponsRes] = await Promise.all([
        fetch("http://72.60.178.180:8000/api/v1/companies"),
        fetch("http://72.60.178.180:8000/api/v1/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }),
        fetch("http://72.60.178.180:8000/api/v1/categories"),
        fetch("http://72.60.178.180:8000/api/v1/coupons", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }),
      ]);

      const [companies, users, categories, coupons] = await Promise.all([
        companiesRes.json(),
        usersRes.json(),
        categoriesRes.json(),
        couponsRes.json(),
      ]); 
      
      const companiesData = companies.data || companies;
      const usersData = users.data || users;
      const categoriesData = categories.data || categories;
      const couponsData = coupons.data || coupons;
      
      console.log("companiesRes", companiesData);
      console.log("usersRes", usersData);
      console.log("categoriesRes", categoriesData);
      console.log("couponsRes", couponsData);

      setStats({
        totalCompanies: Array.isArray(companiesData) ? companiesData.length : 0,
        pendingCompanies: Array.isArray(companiesData)
          ? companiesData.filter((c: any) => !c.isApproved).length
          : 0,
        approvedCompanies: Array.isArray(companiesData)
          ? companiesData.filter((c: any) => c.isApproved).length
          : 0,
        rejectedCompanies: 0, // يمكن إضافته لاحقاً
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalCategories: Array.isArray(categoriesData)
          ? categoriesData.length
          : 0,
        totalCoupons: Array.isArray(couponsData) ? couponsData.length : 0,
        recentActivity: [], // يمكن إضافته لاحقاً
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-premium pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text">
              {t("adminDashboardTitle")}
            </h1>
            <p className="text-muted-foreground mt-2">{t("adminDashboardWelcome")}</p>
          </div>
     
          <div className="mb-8">
            <UserStatsCards />
          </div>
     
          {/* Recent Activity */}
          <Card className="ultra-card transition-all">
            <CardHeader>
              <CardTitle>{t("adminRecentActivity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 glass rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {t("adminNewCompanyApproved")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      5 {t("adminMinutesAgo")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 glass rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {t("adminNewUserRegistered")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      15 {t("adminMinutesAgo")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 glass rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {t("adminNewCategoryRequest")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("adminHourAgo")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 glass rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {t("adminNewCouponCreated")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("adminHourAgo")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}