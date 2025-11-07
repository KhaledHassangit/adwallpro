"use client";

import { AdminStats } from "@/components/admin/admin-stats";
import { AdminTables } from "@/components/admin/admin-tables";
import { AdminPendingAds } from "@/components/admin/admin-pending-ads";
import { AdminCategories } from "@/components/admin/admin-categories";
import { AdminCoupons } from "@/components/admin/admin-coupons";

export function AdminAnalytics() {
  return (
    <div className="space-y-8">
      <AdminStats />
      <AdminPendingAds />
      <div className="grid lg:grid-cols-2 gap-8">
        <AdminCategories />
        <AdminCoupons />
      </div>
      <AdminTables />
    </div>
  );
}

