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
import { useI18n } from "@/providers/lang-provider";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!coupon) return;

    setLoading(true);
    try {
      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success(t("couponDeletedSuccess"));
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error(t("couponDeletedError"));
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