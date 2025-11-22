"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/providers/LanguageProvider";
import { useNotifications } from "@/hooks/notifications";
import { getAuthHeaders } from "@/lib/auth";

interface Coupon {
  id: string;
  code: string;
  discount: string;
  active: boolean;
}

interface DeleteCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  coupon: Coupon | null;
}

export function DeleteCouponDialog({
  open,
  onOpenChange,
  onSuccess,
  coupon,
}: DeleteCouponDialogProps) {
  const { t } = useI18n();
  const notifications = useNotifications();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!coupon) return;

    setLoading(true);
    try {
      // Using getAuthHeaders to get the token from cookies
      const headers = getAuthHeaders();

      // Make the API call to delete the coupon
      const response = await fetch(`http://72.60.178.180:8000/api/v1/coupons/${coupon.id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        // Handle unauthorized access
        if (response.status === 401) {
          notifications.error(t("adminSessionExpired"));
          window.location.href = "/login";
          return;
        }
        
        // Try to get error details
        let errorMessage = "Failed to delete coupon";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.log("Could not parse error response");
        }
        throw new Error(errorMessage);
      }

      console.log("Coupon deleted successfully");
      
      notifications.success(t("couponDeletedSuccess"));
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      
      // More detailed error message
      let errorMessage = t("couponDeletedError");
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Check for specific error types
      if (errorMessage.includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (errorMessage.includes("Failed to fetch")) {
        errorMessage = "Could not connect to server. Please try again later.";
      }
      
      notifications.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t("deleteCouponTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("deleteCouponDescription")}
          </DialogDescription>
        </DialogHeader>
        
        {coupon && (
          <div className="py-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">{t("couponCode")}:</span> {coupon.code}
              </p>
              <p className="text-sm">
                <span className="font-medium">{t("discountValue")}:</span> {coupon.discount}
              </p>
              <p className="text-sm">
                <span className="font-medium">{t("status")}:</span>{" "}
                <span className={coupon.active ? "text-green-600" : "text-red-600"}>
                  {coupon.active ? t("active") : t("inactive")}
                </span>
              </p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("deleting")}
              </div>
            ) : (
              t("deleteCoupon")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}