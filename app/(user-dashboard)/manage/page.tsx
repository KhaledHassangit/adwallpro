"use client";

import { useEffect, useState } from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/route-guard";
import { useI18n } from "@/providers/LanguageProvider";
import {
  Building2,
  PlusCircle,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  Activity,
  Zap,
  Users,
  Calendar,
  ArrowRight,
} from "@/components/ui/icon";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { useGetUserAnalyticsQuery } from "@/features/analyticsApi";

interface Company {
  _id: string;
  companyName: string;
  description: string;
  categoryId: {
    _id: string;
    nameAr: string;
    nameEn: string;
  };
  isApproved: boolean;
  createdAt: string;
  image?: string;
  email?: string;
  __v?: number;
}

function UserDashboardContent() {
  const { t, lang } = useI18n();
  const [stats, setStats] = useState({
    totalCompanies: 0,
    approvedCompanies: 0,
    pendingCompanies: 0,
    totalViews: 0,
    monthlyGrowth: 0,
  });
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([]);
  const currentUser = getCurrentUser();

  // Use the RTK Query hook for user analytics
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useGetUserAnalyticsQuery();

  useEffect(() => {
    if (analyticsData) {
      // Update stats with analytics data
      setStats({
        totalCompanies: analyticsData.totalAds,
        approvedCompanies: analyticsData.approvedAds,
        pendingCompanies: analyticsData.pendingAds,
        totalViews: analyticsData.totalViews,
        monthlyGrowth: 0, // This might need to be calculated or added to the API response
      });
      
      // Update recent companies with active ads list
      if (analyticsData.activeAdsList) {
        setRecentCompanies(analyticsData.activeAdsList);
      }
    }
  }, [analyticsData]);

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getCategoryName = (
    categoryId: Company["categoryId"] | undefined
  ) => {
    if (!categoryId) return t("unknown");
    return lang === "ar" ? categoryId.nameAr : categoryId.nameEn;
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container-premium pb-8 pt-4">
        {/* Header */}
        <div className="mb-8 scroll-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-ultra-xl gradient-text mb-2">
                {t("dashboard")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("welcomeToDashboard")}
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="glass">
                <Link href="/manage/ads">
                  <Eye className="h-4 w-4 mr-2" />
                  {t("manageAds")}
                </Link>
              </Button>
              <Button asChild className="btn-ultra">
                <Link href="/manage/ads/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t("addNewAd")}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Ads */}
          <div className="ultra-card float-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  <TrendingUp className="h-3 w-3 mr-1" />+{stats.monthlyGrowth}%
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.totalCompanies}</h3>
              <p className="text-muted-foreground">{t("totalAds")}</p>
            </div>
          </div>

          {/* Approved */}
          <div className="ultra-card float-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-500"
                >
                  {stats.totalCompanies > 0
                    ? Math.round(
                        (stats.approvedCompanies / stats.totalCompanies) * 100
                      )
                    : 0}
                  %
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1 text-green-600">
                {stats.approvedCompanies}
              </h3>
              <p className="text-muted-foreground">{t("approved")}</p>
            </div>
          </div>

          {/* Pending */}
          <div className="ultra-card float-3">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-orange-500/10 text-orange-500"
                >
                  {t("pending")}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1 text-orange-600">
                {stats.pendingCompanies}
              </h3>
              <p className="text-muted-foreground">{t("pendingApproval")}</p>
            </div>
          </div>

          {/* Views */}
          <div className="ultra-card float-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-500" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-500"
                >
                  <Activity className="h-3 w-3 mr-1" />
                  {t("active")}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-1 text-blue-600">
                {stats.totalViews}
              </h3>
              <p className="text-muted-foreground">{t("totalViews")}</p>
            </div>
          </div>
        </div>

        {/* Left cards + Recent Ads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-full">
            {/* Quick Actions */}
            <div className="ultra-card flex-1">
              <div className="p-6">
                <CardTitle className="flex items-center gap-2 mb-6">
                  <Zap className="h-5 w-5 text-primary" />
                  {t("quickActions")}
                </CardTitle>
                <div className="space-y-3">
                  <Button asChild className="w-full justify-start btn-ultra">
                    <Link href="/manage/ads/new">
                      <PlusCircle className="h-4 w-4 mr-3" />
                      {t("addNewAd")}
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start glass"
                  >
                    <Link href="/manage/ads">
                      <Eye className="h-4 w-4 mr-3" />
                      {t("viewAllAds")}
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start glass"
                  >
                    <Link href="/manage/profile">
                      <Users className="h-4 w-4 mr-3" />
                      {t("editProfile")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="ultra-card flex-1">
              <div className="p-6">
                <CardTitle className="flex items-center gap-2 mb-6">
                  <Users className="h-5 w-5 text-primary" />
                  {t("accountInfo")}
                </CardTitle>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("name")}
                    </p>
                    <p className="font-medium">
                      {currentUser?.name || t("undefined")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("email")}
                    </p>
                    <p className="font-medium">
                      {currentUser?.email || t("undefined")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("joinDate")}
                    </p>
                    <p className="font-medium">
                      {currentUser?.createdAt
                        ? new Date(currentUser.createdAt).toLocaleDateString(
                            lang === "ar" ? "ar-SA" : "en-US"
                          )
                        : t("undefined")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Ads */}
          <div className="lg:col-span-2 h-full">
            <div className="ultra-card h-full flex flex-col">
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-6">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {t("recentAds")}
                  </CardTitle>
                  <Button asChild size="sm" className="btn-ultra">
                    <Link href="/manage/ads">
                      {t("viewAllAds")}
                      <ArrowRight className="h-4 w-4 mr-2" />
                    </Link>
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {recentCompanies.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 gradient-text">
                        {t("noAds")}
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        {t("startWithFirstAd")}
                      </p>
                      <Button asChild className="btn-ultra">
                        <Link href="/manage/ads/new">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          {t("addFirstAd")}
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentCompanies.slice(0, 3).map((company, index) => (
                        <div
                          key={company._id}
                          className={`p-4 border rounded-xl hover:shadow-lg transition-all duration-300 scroll-fade-in flex items-stretch ${
                            index % 2 === 0 ? "bg-card" : "bg-secondary/20"
                          }`}
                          style={{
                            animationDelay: `${index * 100}ms`,
                            minHeight: "140px",
                          }}
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {company.image ? (
                                <img
                                  src={company.image}
                                  alt={company.companyName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building2 className="h-7 w-7 text-primary" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-lg truncate">
                                  {company.companyName}
                                </h4>
                                {company.isApproved ? (
                                  <Badge className="bg-green-500 flex items-center text-white">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    {t("approvedBadge")}
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="flex items-center bg-yellow-500 text-white"
                                  >
                                    <Clock className="h-3 w-3 mr-1" />
                                    {t("pendingBadge")}
                                  </Badge>
                                )}
                              </div>

                              <p className="text-muted-foreground mb-2 text-sm break-words line-clamp-3">
                                {company.description}
                              </p>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  {t("categoryLabel")}{" "}
                                  {getCategoryName(company.categoryId)}
                                </Badge>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Eye className="h-3 w-3 mr-1" />
                                  {company.__v || 0} {t("views")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function UserDashboard() {
  return (
    <ProtectedRoute>
      <UserDashboardContent />
    </ProtectedRoute>
  );
}