"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "@/components/ui/icon";
import { useI18n } from "@/providers/LanguageProvider";
import { useGetCouponsQuery, type Coupon } from "@/features/couponsApi";
import { PaginationControl } from "@/components/ui/pagination-control";
import { cn } from "@/lib/utils";

interface AdminCouponsTableProps {
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
}

interface ApiError {
  data?: {
    message?: string;
  };
}

export function AdminCouponsTable({ onEdit, onDelete }: AdminCouponsTableProps) {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading, isFetching, error } = useGetCouponsQuery({ page, limit });

  const coupons = response?.data?.data || [];
  const totalPages = response?.paginationResult?.numberOfPages || 1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 opacity-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent" />
      </div>
    );
  }

  if (error) {
    const apiError = error as ApiError;
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          {String(apiError?.data?.message || "Failed to fetch coupons")}
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          {String(t("adminTryAgain") || "Try Again")}
        </Button>
      </div>
    );
  }

  return (
    <div className="ultra-card p-6">
      <div className="rounded-md mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">{String(t("couponCode") || "Code")}</TableHead>
              <TableHead className="text-center">{String(t("discountValue") || "Discount")}</TableHead>
              <TableHead className="text-center">{String(t("discountType") || "Type")}</TableHead>
              <TableHead className="text-center">{String(t("startDate") || "Start Date")}</TableHead>
              <TableHead className="text-center">{String(t("expiryDate") || "Expiry Date")}</TableHead>
              <TableHead className="text-center">{String(t("usageLimit") || "Usage Limit")}</TableHead>
              <TableHead className="text-center">{String(t("usedCount") || "Used Count")}</TableHead>
              <TableHead className="text-center">{String(t("status") || "Status")}</TableHead>
              <TableHead className="text-center">{String(t("actions") || "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  {String(t("noCouponsFound") || "No coupons found")}
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon._id}>
                  <TableCell className="font-medium text-center">{coupon.couponCode}</TableCell>
                  <TableCell className="text-center">
                    {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="mx-auto w-fit">
                      {coupon.discountType === "percentage" ? String(t("percentage") || "Percentage") : String(t("fixedAmount") || "Fixed")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{coupon.startDate || String(t("notSet") || "Not Set")}</TableCell>
                  <TableCell className="text-center">{coupon.expiryDate}</TableCell>
                  <TableCell className="text-center">{coupon.maxUses || String(t("unlimited") || "Unlimited")}</TableCell>
                  <TableCell className="text-center">{coupon.usedCount || 0}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={cn(
                        "mx-auto w-fit",
                        coupon.isActive ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                      )}
                    >
                      {coupon.isActive ? String(t("active") || "Active") : String(t("inactive") || "Inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(coupon)}
                        className="h-8 w-8 p-0 rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
                        disabled={isFetching}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(coupon)}
                        className="h-8 w-8 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50"
                        disabled={isFetching}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isFetching && (
        <div className="flex justify-center items-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      )}

      <PaginationControl
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}