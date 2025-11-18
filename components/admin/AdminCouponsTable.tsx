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
import { useI18n } from "@/providers/LanguageProvider";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { format } from "date-fns";
import { getAuthHeaders } from "@/lib/auth";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  discount: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  active: boolean;
  createdDate: string;
  expiryDate: string;
  startDate?: string;
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
  const [loading, setLoading] = useState(false); // Start with false to avoid initial animation
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using getAuthHeaders to get the token from cookies
        const headers = getAuthHeaders();
        
        console.log("Fetching coupons from API...");
        
        // Make API call to fetch coupons
        const response = await fetch("http://72.60.178.180:8000/api/v1/coupons", {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          // Try to get error details
          let errorMessage = "Failed to fetch coupons";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
            console.log("Could not parse error response");
          }
          
          // Handle unauthorized access
          if (response.status === 401) {
            toast.error(t("adminSessionExpired"));
            window.location.href = "/login";
            return;
          }
          
          throw new Error(errorMessage);
        }

        const responseData = await response.json();
        console.log("API response:", responseData);

        // Access data array from response
        const couponData = responseData.data.data || [];
        console.log("Coupon data:", couponData);

        // Transform API data to match our interface
        const transformedCoupons: Coupon[] = couponData.map((item: any) => {
          // Format discount string
          const discount = item.discountType === "percentage" 
            ? `${item.discountValue}%` 
            : `$${item.discountValue}`;

          // Format dates for display
          const createdDate = item.createdAt 
            ? format(new Date(item.createdAt), "yyyy-MM-dd") 
            : "";
          
          const expiryDate = item.expiryDate 
            ? format(new Date(item.expiryDate), "yyyy-MM-dd") 
            : "";
            
          // Only format startDate if it exists in the API response
          const startDate = item.startDate 
            ? format(new Date(item.startDate), "yyyy-MM-dd") 
            : undefined;

          return {
            id: item._id,
            code: item.couponCode,
            discount,
            discountType: item.discountType,
            discountValue: item.discountValue,
            active: item.isActive,
            createdDate,
            expiryDate,
            startDate, // Include startDate in the returned object
            usageLimit: item.maxUses,
            usedCount: item.usedCount,
          };
        });

        console.log("Transformed coupons:", transformedCoupons);
        setCoupons(transformedCoupons);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        
        // More detailed error message
        let errorMessage = t("couponsFetchError");
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        // Check for specific error types
        if (errorMessage.includes("fetch")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (errorMessage.includes("Failed to fetch")) {
          errorMessage = "Could not connect to server. Please try again later.";
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [refreshKey, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 opacity-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6">
        <div className="text-destructive text-center mb-4">{error}</div>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
        >
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="ultra-card p-6">
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">{t("couponCode")}</TableHead>
              <TableHead className="text-center">{t("discountValue")}</TableHead>
              <TableHead className="text-center">{t("discountType")}</TableHead>
              <TableHead className="text-center">{t("startDate")}</TableHead>
              <TableHead className="text-center">{t("expiryDate")}</TableHead>
              <TableHead className="text-center">{t("usageLimit")}</TableHead>
              <TableHead className="text-center">{t("usedCount")}</TableHead>
              <TableHead className="text-center">{t("status")}</TableHead>
              <TableHead className="text-center">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  {t("noCouponsFound")}
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium text-center">
                    {coupon.code}
                  </TableCell>
                  <TableCell className="text-center">
                    {coupon.discount}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="mx-auto">
                      {coupon.discountType === "percentage" 
                        ? t("percentage") 
                        : t("fixedAmount")
                      }
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {coupon.startDate || t("notSet")}
                  </TableCell>
                  <TableCell className="text-center">{coupon.expiryDate}</TableCell>
                  <TableCell className="text-center">
                    {coupon.usageLimit || t("unlimited")}
                  </TableCell>
                  <TableCell className="text-center">{coupon.usedCount || 0}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      className={
                        coupon.active 
                          ? "bg-green-500 hover:bg-green-600 text-white" 
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }
                    >
                      {coupon.active ? t("active") : t("inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(coupon)}
                        className="h-8 w-8 p-0 rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(coupon)}
                        className="h-8 w-8 p-0 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
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
    </div>
  );
}