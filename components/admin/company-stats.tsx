"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Clock,
  CheckCircle,
  TrendingUp,
} from "@/components/ui/icon";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface CompanyStats {
  totalCompanies: number;
  pendingCompanies: number;
  approvedCompanies: number;
  approvalRate: number;
}

interface CompanyStatsProps {
  refreshKey?: number;
}

export function CompanyStats({ refreshKey }: CompanyStatsProps) {
  const [stats, setStats] = useState<CompanyStats>({
    totalCompanies: 0,
    pendingCompanies: 0,
    approvedCompanies: 0,
    approvalRate: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch all companies
      const allCompaniesResponse = await fetch(
        "https://adwallpro.com/api/v1/companies",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Fetch pending companies
      const pendingResponse = await fetch(
        "https://adwallpro.com/api/v1/companies/pending",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (allCompaniesResponse.ok) {
        const allCompaniesData = await allCompaniesResponse.json();
        const allCompanies =
          allCompaniesData.data?.companies || allCompaniesData.data || [];

        let pendingCount = 0;
        if (pendingResponse.ok) {
          const pendingData = await pendingResponse.json();
          pendingCount = pendingData.data?.length || 0;
        } else {
          // Fallback: count pending from all companies
          pendingCount = allCompanies.filter(
            (company: any) =>
              company.isApproved === undefined || company.isApproved === null
          ).length;
        }

        const approvedCount = allCompanies.filter(
          (company: any) => company.isApproved === true
        ).length;
        const totalCount = allCompanies.length;
        const approvalRate =
          totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

        setStats({
          totalCompanies: totalCount,
          pendingCompanies: pendingCount,
          approvedCompanies: approvedCount,
          approvalRate: approvalRate,
        });
      } else {
        throw new Error("Failed to fetch companies");
      }
    } catch (error) {
      console.error("Error fetching company stats:", error);
      setStats({
        totalCompanies: 0,
        pendingCompanies: 0,
        approvedCompanies: 0,
        approvalRate: 0,
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="ultra-card  transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الشركات
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <LoadingSpinner />
          </CardContent>
        </Card>
            <Card className="ultra-card  transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              معلقة للمراجعة
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <LoadingSpinner />
          </CardContent>
        </Card>
            <Card className="ultra-card  transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">موافق عليها</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <LoadingSpinner />
          </CardContent>
        </Card>
            <Card className="ultra-card  transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل القبول</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <LoadingSpinner />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="ultra-card  transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي الشركات</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCompanies}</div>
          <p className="text-xs text-muted-foreground mt-2">
            شركات مسجلة في المنصة
          </p>
        </CardContent>
      </Card>

            <Card className="ultra-card  transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">معلقة للمراجعة</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {stats.pendingCompanies}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            تنتظر موافقة الأدمن
          </p>
        </CardContent>
      </Card>

            <Card className="ultra-card  transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">موافق عليها</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.approvedCompanies}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            شركات نشطة ومعتمدة
          </p>
        </CardContent>
      </Card>

            <Card className="ultra-card  transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">معدل القبول</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.approvalRate}%
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            نسبة الشركات المعتمدة
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
