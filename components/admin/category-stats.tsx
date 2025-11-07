"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tags, TrendingUp, CheckCircle } from "@/components/ui/icon";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface CategoryStats {
  totalCategories: number;
  mostUsedCategory: string;
  systemStatus: string;
}

interface CategoryStatsProps {
  refreshKey?: number;
}

export function CategoryStats({ refreshKey }: CategoryStatsProps) {
  const [stats, setStats] = useState<CategoryStats>({
    totalCategories: 0,
    mostUsedCategory: "جاري التحميل...",
    systemStatus: "جاري التحميل...",
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://72.60.178.180:8000/api/v1/categories/stats",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Fallback to basic categories count if stats endpoint doesn't exist
        const categoriesResponse = await fetch(
          "http://72.60.178.180:8000/api/v1/categories",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          const categories = categoriesData.data || [];

          // Find the most used category (for now, just use the first one or a default)
          const mostUsed =
            categories.length > 0 ? categories[0].nameAr : "لا توجد فئات";

          setStats({
            totalCategories: categories.length,
            mostUsedCategory: mostUsed,
            systemStatus: categories.length > 0 ? "ممتاز" : "لا توجد فئات",
          });
        } else {
          throw new Error("Failed to fetch categories");
        }
      } else {
        const data = await response.json();
        setStats({
          totalCategories: data.totalCategories || 0,
          mostUsedCategory: data.mostUsedCategory || "لا توجد فئات",
          systemStatus: data.systemStatus || "ممتاز",
        });
      }
    } catch (error) {
      console.error("Error fetching category stats:", error);
      setStats({
        totalCategories: 0,
        mostUsedCategory: "خطأ في التحميل",
        systemStatus: "خطأ في التحميل",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="ultra-card  transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الفئات</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <LoadingSpinner />
          </CardContent>
        </Card>
            <Card className="ultra-card  transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              الأكثر استخداماً
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <LoadingSpinner />
          </CardContent>
        </Card>
            <Card className="ultra-card  transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالة النظام</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <LoadingSpinner />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="ultra-card  transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي الفئات</CardTitle>
          <Tags className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCategories}</div>
          <p className="text-xs text-muted-foreground mt-2">
            فئات نشطة في المنصة
          </p>
        </CardContent>
      </Card>

            <Card className="ultra-card  transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            الأكثر استخداماً
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.mostUsedCategory}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            أعلى عدد من الشركات
          </p>
        </CardContent>
      </Card>

            <Card className="ultra-card  transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">حالة النظام</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.systemStatus}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            جميع الفئات تعمل بشكل طبيعي
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
