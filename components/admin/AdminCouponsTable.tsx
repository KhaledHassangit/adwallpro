"use client";

import React, { useState, useEffect } from "react";
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
import { useI18n } from "@/providers/lang-provider";
import { LoadingSpinner } from "@/components/common/loading-spinner";

interface Coupon {
  id: string;
  code: string;
  discount: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  active: boolean;
  createdDate: string;
  expiryDate: string;
  usageLimit?: number;
  usedCount?: number;
}

interface AdminCouponsTableProps {
  key?: number;
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
}

export function AdminCouponsTable({ 
  key: refreshKey, 
  onEdit, 
  onDelete 
}: AdminCouponsTableProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch from your API
        // For now, we'll use placeholder data
        const placeholderCoupons: Coupon[] = [
          {
            id: "c1",
            code: "WELCOME10",
            discount: "10%",
            discountType: "percentage",
            discountValue: 10,
            active: true,
            createdDate: "2024-01-15",
            expiryDate: "2024-12-31",
            usageLimit: 100,
            usedCount: 25,
          },
          {
            id: "c2",
            code: "SUMMER25",
            discount: "25%",
            discountType: "percentage",
            discountValue: 25,
            active: false,
            createdDate: "2024-06-01",
            expiryDate: "2024-08-31",
            usageLimit: 50,
            usedCount: 12,
          },
          {
            id: "c3",
            code: "FLAT50",
            discount: "$50",
            discountType: "fixed",
            discountValue: 50,
            active: true,
            createdDate: "2024-02-20",
            expiryDate: "2024-06-30",
            usageLimit: null,
            usedCount: 8,
          },
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCoupons(placeholderCoupons);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="ultra-card p-6  ">
      <div className="rounded-md ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("couponCode")}</TableHead>
              <TableHead>{t("discountValue")}</TableHead>
              <TableHead>{t("discountType")}</TableHead>
              <TableHead>{t("createdDate")}</TableHead>
              <TableHead>{t("expiryDate")}</TableHead>
              <TableHead>{t("usageLimit")}</TableHead>
              <TableHead>{t("usedCount")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">
                  {coupon.code}
                </TableCell>
                <TableCell>
                  {coupon.discountType === "percentage" 
                    ? `${coupon.discountValue}%` 
                    : `$${coupon.discountValue}`
                  }
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {coupon.discountType === "percentage" 
                      ? t("percentage") 
                      : t("fixedAmount")
                    }
                  </Badge>
                </TableCell>
                <TableCell>{coupon.createdDate}</TableCell>
                <TableCell>{coupon.expiryDate}</TableCell>
                <TableCell>
                  {coupon.usageLimit || t("unlimited")}
                </TableCell>
                <TableCell>{coupon.usedCount || 0}</TableCell>
                <TableCell>
                  <Badge variant={coupon.active ? "default" : "secondary"}>
                    {coupon.active ? t("active") : t("inactive")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(coupon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(coupon)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}