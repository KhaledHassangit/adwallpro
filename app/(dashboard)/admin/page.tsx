"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { UserStatsCards } from "@/components/admin/user-stats-cards";
import { useI18n } from "@/providers/LanguageProvider";
import { API_BASE_URL, AnalyticsRecord } from "@/lib/api";
import { getAuthCookie } from "@/lib/auth";

function AdminDashboardContent() {
  const { t } = useI18n();
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [analyticsRecords, setAnalyticsRecords] = useState<AnalyticsRecord[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      
      // Get auth token from cookies
      const token = getAuthCookie();

      // API call without search parameters
      const response = await fetch(
        `${API_BASE_URL}/analytics`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to fetch analytics");
      }

      const payload = await response.json();
      const analyticsData = Array.isArray(payload?.data?.data)
        ? payload.data.data
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

      setAnalyticsRecords(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalyticsError(
        error instanceof Error ? error.message : "Failed to load analytics"
      );
    } finally {
      setAnalyticsLoading(false);
    }
  };

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
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>{t("adminRecentActivity")}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchAnalytics}
                disabled={analyticsLoading}
                className="text-xs"
              >
                {analyticsLoading ? (t("loading") || "Loading") : (t("refresh") || "Refresh")}
              </Button>
            </CardHeader>
            <CardContent>
              {analyticsError && (
                <div className="text-sm text-red-500 mb-4">
                  {analyticsError}
                </div>
              )}
              <div className="space-y-4 max-h-[480px] overflow-y-auto">
                {analyticsLoading ? (
                  <div className="text-center text-muted-foreground py-6">
                    {t("loading") || "Loading analytics..."}
                  </div>
                ) : analyticsRecords.length === 0 ? (
                  <div className="text-center text-muted-foreground py-6">
                    {t("noActivity") || "No analytics found"}
                  </div>
                ) : (
                  analyticsRecords.map((record) => (
                    <div
                      key={record._id}
                      className="flex items-start gap-4 p-3 glass rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          record.role === "admin"
                            ? "bg-purple-500"
                            : record.role === "user"
                              ? "bg-blue-500"
                              : "bg-green-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium capitalize">
                            {record.action}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(record.timestamp).toLocaleString("en-US")}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-2">
                          {record.role && (
                            <span className="px-2 py-0.5 rounded-full bg-muted">
                              {record.role}
                            </span>
                          )}
                          {record.method && (
                            <span>{record.method.toUpperCase()}</span>
                          )}
                          {record.status && (
                            <span>
                              {t("status") || "Status"} {record.status}
                            </span>
                          )}
                          {record.path && (
                            <span className="truncate max-w-[220px]">
                              {record.path}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
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