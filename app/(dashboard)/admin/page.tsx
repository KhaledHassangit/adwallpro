"use client";

import React, { useState } from "react"; // Removed useEffect
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { Users, Shield, UserCheck, Activity, Building, Tag, TrendingUp, RefreshCw, BarChart3, PieChartIcon } from "lucide-react";
import { useI18n } from "@/providers/LanguageProvider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useGetAnalyticsQuery } from "@/features/analyticsApi";

// The AnalyticsData interface is now in analyticsApi.ts, so we don't need it here.

// Colors for the chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
// Removed API_BASE_URL as it's now in axiosBaseQuery

function AdminDashboardContent() {
  const { t } = useI18n();
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  // Use the RTK Query hook to fetch analytics data
  const { 
    data: analyticsData, 
    isLoading, 
    isFetching, // isFetching is true during refetch
    error, 
    refetch 
  } = useGetAnalyticsQuery();

  // Removed fetchAnalytics function, useEffect, and manual state (loading, error, analyticsData)

  // Calculate derived statistics (logic remains the same)
  const regularUsersCount = analyticsData ? analyticsData.userCount - analyticsData.adminCount : 0;
  const adminPercentage = analyticsData && analyticsData.userCount > 0 
    ? Math.round((analyticsData.adminCount / analyticsData.userCount) * 100) 
    : 0;
  const regularUserPercentage = analyticsData && analyticsData.userCount > 0 
    ? Math.round((regularUsersCount / analyticsData.userCount) * 100) 
    : 0;

  const totalEvents = analyticsData?.latestActivities?.length || 0;
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last24HoursActivities = analyticsData?.latestActivities?.filter(
    activity => new Date(activity.timestamp) > last24Hours
  ) || [];
  const uniqueIPs = new Set(last24HoursActivities.map(activity => activity.ip));
  const activeUsers = uniqueIPs.size;

  const getChartData = () => {
    if (!analyticsData?.charts?.subscriptionsPerPlan) return [];
    
    const { labels, datasets } = analyticsData.charts.subscriptionsPerPlan;
    
    if (datasets && datasets.length > 0 && datasets[0].data) {
      return labels.map((label, index) => ({
        name: label,
        value: datasets[0].data[index] || 0,
      }));
    }
    
    return [];
  };

  const chartData = getChartData();
  const hasChartData = chartData.length > 0;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-premium pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {t("adminDashboardTitle") || "Admin Dashboard"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t("adminDashboardWelcome") || "Welcome to your admin dashboard"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => refetch()} // Use the refetch function from the hook
              disabled={isFetching} // Use isFetching for the refresh button state
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? (t("loading") || "Loading") : (t("refresh") || "Refresh")}
            </Button>
          </div>

          {/* Update error handling */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {/* Error object from RTK Query has a specific structure */}
              {(() => {
                if (typeof error === 'object' && error && 'data' in error) {
                  const data = error.data as { message?: string; error?: string };
                  const message = data.message || data.error || "Failed to load analytics";
                  return message;
                }
                return "An unknown error occurred";
              })()}
            </div>
          )}

          {/* Stats Cards Grid */}
          {/* ... all the card components remain the same, just using `analyticsData` which comes from the hook ... */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Total Users Card */}
            <Card className="ultra-card border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("totalUsers") || "Total Users"}
                </CardTitle>
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text mb-1">
                  {analyticsData?.userCount?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {t("registeredUser") || "Registered Users"}
                </p>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-blue-600">100%</div>
                  <div className="text-xs text-muted-foreground">{t("ofTotal") || "of total"}</div>
                </div>
              </CardContent>
            </Card>

            {/* Admins Card */}
            <Card className="ultra-card border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("admins") || "Admins"}
                </CardTitle>
                <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text mb-1">
                  {analyticsData?.adminCount || 0}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {t("adminAccounts") || "Admin Accounts"}
                </p>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-red-600">{adminPercentage}%</div>
                  <div className="text-xs text-muted-foreground">{t("ofTotal") || "of total"}</div>
                </div>
              </CardContent>
            </Card>

            {/* Regular Users Card */}
            <Card className="ultra-card border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("regularUsers") || "Regular Users"}
                </CardTitle>
                <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/50">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text mb-1">
                  {regularUsersCount.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {t("adUsers") || "Regular Users"}
                </p>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-green-600">{regularUserPercentage}%</div>
                  <div className="text-xs text-muted-foreground">{t("ofTotal") || "of total"}</div>
                </div>
              </CardContent>
            </Card>

            {/* Active Users Card */}
            <Card className="ultra-card border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("activeThisWeek") || "Active (24h)"}
                </CardTitle>
                <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/50">
                  <Activity className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text mb-1">
                  {activeUsers}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {t("activeUserLast7Days") || "Active Users (Last 24h)"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {last24HoursActivities.length} {t("eventsLast24h") || "events in the last 24h"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Row */}
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            {/* Active Companies */}
            <Card className="ultra-card border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("activeCompanies") || "Active Companies"}
                </CardTitle>
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50">
                  <Building className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text mb-1">
                  {analyticsData?.companies?.active || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("companies") || "Companies"}
                </p>
              </CardContent>
            </Card>

            {/* Pending Companies */}
            <Card className="ultra-card border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("pendingCompanies") || "Pending Companies"}
                </CardTitle>
                <div className="p-2 rounded-xl bg-yellow-50 dark:bg-yellow-950/50">
                  <Building className="h-5 w-5 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text mb-1">
                  {analyticsData?.companies?.pending || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("pendingApproval") || "Pending Approval"}
                </p>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="ultra-card border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("adminTotalCategories") || "Total Categories"}
                </CardTitle>
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
                  <Tag className="h-5 w-5 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text mb-1">
                  {analyticsData?.categoryCount || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("categories") || "Categories"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          {hasChartData && (
            <Card className="ultra-card mb-6">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t("subscriptionsPerPlan") || "Subscriptions per Plan"}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                    className="gap-1"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Bar Chart
                  </Button>
                  <Button
                    variant={chartType === 'pie' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('pie')}
                    className="gap-1"
                  >
                    <PieChartIcon className="h-4 w-4" />
                    Pie Chart
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {chartType === 'bar' ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="value" fill="hsl(var(--primary))" name="Subscriptions" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="ultra-card transition-all">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>{t("adminRecentActivity") || "Recent Activity"}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {totalEvents} {t("totalEvents") || "total events"}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? ( // Use isLoading for the initial load message
                <div className="text-center text-muted-foreground py-6">
                  {t("loading") || "Loading analytics..."}
                </div>
              ) : !analyticsData?.latestActivities || analyticsData.latestActivities.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">
                  {t("noActivity") || "No activity found"}
                </div>
              ) : (
                <div className="space-y-4 max-h-[480px] p-4 overflow-y-auto">
                  {analyticsData.latestActivities.map((record) => (
                    <div
                      key={record._id}
                      className="flex items-start gap-4 p-3 glass rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          record.action === "User Login" || record.action === "User Signup"
                            ? "bg-blue-500"
                            : record.status >= 400
                              ? "bg-red-500"
                              : "bg-green-500"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium capitalize truncate">
                            {record.action}
                          </p>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {new Date(record.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
                          {record.eventType && (
                            <span className="px-2 py-0.5 rounded-full bg-muted">
                              {record.eventType}
                            </span>
                          )}
                          {record.method && (
                            <span className="font-mono">{record.method.toUpperCase()}</span>
                          )}
                          <span className={`font-medium ${
                            record.status >= 400 ? 'text-red-500' : 
                            record.status >= 300 ? 'text-yellow-500' : 
                            'text-green-500'
                          }`}>
                            {record.status}
                          </span>
                          {record.path && (
                            <span className="font-mono truncate max-w-[200px]">
                              {record.path}
                            </span>
                          )}
                          {record.ip && (
                            <span>IP: {record.ip}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
