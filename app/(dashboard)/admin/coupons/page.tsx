"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { useI18n } from "@/providers/LanguageProvider";
import { PlusCircle, Edit, Trash2, Search } from "@/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/notifications";
import {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "@/features/couponsApi";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { AdminCouponsTable } from "@/components/admin/AdminCouponsTable";
import { Coupon } from "@/types/types";

// Type definitions

type DiscountType = "percentage" | "fixed";

interface ApiError {
  data?: {
    message?: string;
  };
}

// ==================== Main Content Component ====================
function AdminCouponsContent() {
  const { t } = useI18n();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setEditDialogOpen(true);
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedCoupon(null);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-premium pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  {String(t("adminCoupons") || "Coupons Management")}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {String(t("adminCouponsDesc") || "Manage and create discount coupons.")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="btn-ultra hover:bg-primary/90"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {String(t("adminCreateCoupon") || "Add New Coupon")}
              </Button>
            </div>
          </div>

          {/* Coupons Table */}
          <AdminCouponsTable
            key={refreshKey}
            onEdit={handleEditCoupon}
            onDelete={handleDeleteCoupon}
            keyword={keyword}
            isActive={isActive}
            onKeywordChange={setKeyword}
            onIsActiveChange={setIsActive}
          />

          {/* Create Coupon Dialog */}
          <CreateCouponDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onSuccess={handleRefresh}
          />

          {/* Edit Coupon Dialog */}
          <EditCouponDialog
            open={editDialogOpen}
            onOpenChange={handleDialogClose}
            coupon={selectedCoupon}
            onSuccess={handleRefresh}
          />

          {/* Delete Coupon Dialog */}
          <DeleteCouponDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            coupon={selectedCoupon}
            onSuccess={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
}

// ==================== Create Coupon Dialog Component ====================
interface CreateCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

function CreateCouponDialog({ open, onOpenChange, onSuccess }: CreateCouponDialogProps) {
  const { t } = useI18n();
  const notifications = useNotifications();
  const [formData, setFormData] = useState({
    code: "",
    discountValue: "",
    discountType: "percentage" as DiscountType,
    startDate: new Date(),
    expiryDate: undefined as Date | undefined,
    usageLimit: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = String(t("couponCodeRequired") || "Coupon code is required");
    if (!formData.discountValue.trim()) newErrors.discountValue = String(t("discountValueRequired") || "Discount value is required");
    if (!formData.expiryDate) newErrors.expiryDate = String(t("expiryDateRequired") || "Expiry date is required");
    if (!formData.usageLimit.trim()) newErrors.usageLimit = String(t("usageLimitRequired") || "Usage limit is required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createCoupon({
        couponCode: formData.code,
        discountValue: Number(formData.discountValue),
        discountType: formData.discountType,
        startDate: formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        expiryDate: formData.expiryDate ? format(formData.expiryDate!, "yyyy-MM-dd") : "",
        maxUses: Number(formData.usageLimit),
        isActive: formData.isActive,
      }).unwrap();
      notifications.success(String(t("couponCreatedSuccess") || "Coupon created successfully"));
      onOpenChange(false);
      setFormData({
        code: "",
        discountValue: "",
        discountType: "percentage",
        startDate: new Date(),
        expiryDate: undefined,
        usageLimit: "",
        isActive: true,
      });
      onSuccess();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      notifications.error(apiError?.data?.message || String(t("couponCreatedError") || "Failed to create coupon"));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{String(t("createCouponTitle") || "Create New Coupon")}</DialogTitle>
          <DialogDescription>{String(t("createCouponDescription") || "Fill in the details to create a new coupon.")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code">{String(t("couponCode") || "Coupon Code")}</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              placeholder={String(t("couponCodePlaceholder") || "e.g., SUMMER2023")}
              className={cn(errors.code && "border-red-500")}
            />
            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discountValue">{String(t("discountValue") || "Discount Value")}</Label>
              <Input
                id="discountValue"
                value={formData.discountValue}
                onChange={(e) => handleInputChange("discountValue", e.target.value)}
                type="number"
                placeholder="10"
                className={cn(errors.discountValue && "border-red-500")}
              />
              {errors.discountValue && <p className="text-sm text-red-500">{errors.discountValue}</p>}
            </div>
            <div>
              <Label htmlFor="discountType">{String(t("discountType") || "Discount Type")}</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value: DiscountType) => handleInputChange("discountType", value)}
              >
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">{String(t("percentage") || "Percentage")}</SelectItem>
                  <SelectItem value="fixed">{String(t("fixedAmount") || "Fixed Amount")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{String(t("startDate") || "Start Date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date: Date | undefined) => handleInputChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>{String(t("expiryDate") || "Expiry Date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.expiryDate && "text-muted-foreground", errors.expiryDate && "border-red-500")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? format(formData.expiryDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date: Date | undefined) => handleInputChange("expiryDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label htmlFor="usageLimit">{String(t("usageLimit") || "Usage Limit")}</Label>
            <Input
              id="usageLimit"
              value={formData.usageLimit}
              onChange={(e) => handleInputChange("usageLimit", e.target.value)}
              type="number"
              placeholder="100"
              className={cn(errors.usageLimit && "border-red-500")}
            />
            {errors.usageLimit && <p className="text-sm text-red-500">{errors.usageLimit}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              {String(t("cancel") || "Cancel")}
            </Button>
            <Button type="submit" className="btn-ultra" disabled={isLoading}>
              {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : String(t("createCoupon") || "Create Coupon")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== Edit Coupon Dialog Component ====================
interface EditCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon | null;
  onSuccess: () => void;
}

function EditCouponDialog({ open, onOpenChange, coupon, onSuccess }: EditCouponDialogProps) {
  const { t } = useI18n();
  const notifications = useNotifications();
  const [formData, setFormData] = useState({
    code: "",
    discountValue: "",
    discountType: "percentage" as DiscountType,
    startDate: new Date(),
    expiryDate: undefined as Date | undefined,
    usageLimit: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [updateCoupon, { isLoading }] = useUpdateCouponMutation();

  React.useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.couponCode,
        discountValue: coupon.discountValue.toString(),
        discountType: coupon.discountType,
        startDate: coupon.startDate ? new Date(coupon.startDate) : new Date(),
        expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate) : undefined,
        usageLimit: coupon.maxUses?.toString() || "",
        isActive: coupon.isActive,
      });
    }
  }, [coupon]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = String(t("couponCodeRequired") || "Coupon code is required");
    if (!formData.discountValue.trim()) newErrors.discountValue = String(t("discountValueRequired") || "Discount value is required");
    if (!formData.expiryDate) newErrors.expiryDate = String(t("expiryDateRequired") || "Expiry date is required");
    if (!formData.usageLimit.trim()) newErrors.usageLimit = String(t("usageLimitRequired") || "Usage limit is required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !coupon) return;

    try {
      await updateCoupon({
        id: coupon._id,
        couponData: {
          couponCode: formData.code,
          discountValue: Number(formData.discountValue),
          discountType: formData.discountType,
          startDate: formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
          expiryDate: formData.expiryDate ? format(formData.expiryDate!, "yyyy-MM-dd") : "",
          maxUses: Number(formData.usageLimit),
          isActive: formData.isActive,
        },
      }).unwrap();
      notifications.success(String(t("couponUpdatedSuccess") || "Coupon updated successfully"));
      onOpenChange(false);
      onSuccess();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      notifications.error(apiError?.data?.message || String(t("couponUpdatedError") || "Failed to update coupon"));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{String(t("editCouponTitle") || "Edit Coupon")}</DialogTitle>
          <DialogDescription>{String(t("editCouponDescription") || "Update the details of the coupon.")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code">{String(t("couponCode") || "Coupon Code")}</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              placeholder="SUMMER2023"
              disabled={isLoading}
              className={cn(errors.code && "border-red-500")}
            />
            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discountValue">{String(t("discountValue") || "Discount Value")}</Label>
              <Input
                id="discountValue"
                value={formData.discountValue}
                onChange={(e) => handleInputChange("discountValue", e.target.value)}
                type="number"
                placeholder="10"
                disabled={isLoading}
                className={cn(errors.discountValue && "border-red-500")}
              />
              {errors.discountValue && <p className="text-sm text-red-500">{errors.discountValue}</p>}
            </div>
            <div>
              <Label htmlFor="discountType">{String(t("discountType") || "Discount Type")}</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value: DiscountType) => handleInputChange("discountType", value)}
                disabled={isLoading}
              >
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">{String(t("percentage") || "Percentage")}</SelectItem>
                  <SelectItem value="fixed">{String(t("fixedAmount") || "Fixed Amount")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{String(t("startDate") || "Start Date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")} disabled={isLoading}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date: Date | undefined) => handleInputChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>{String(t("expiryDate") || "Expiry Date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.expiryDate && "text-muted-foreground", errors.expiryDate && "border-red-500")} disabled={isLoading}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? format(formData.expiryDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date: Date | undefined) => handleInputChange("expiryDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label htmlFor="usageLimit">{String(t("usageLimit") || "Usage Limit")}</Label>
            <Input
              id="usageLimit"
              value={formData.usageLimit}
              onChange={(e) => handleInputChange("usageLimit", e.target.value)}
              type="number"
              placeholder="100"
              disabled={isLoading}
              className={cn(errors.usageLimit && "border-red-500")}
            />
            {errors.usageLimit && <p className="text-sm text-red-500">{errors.usageLimit}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              {String(t("cancel") || "Cancel")}
            </Button>
            <Button type="submit" className="btn-ultra" disabled={isLoading}>
              {isLoading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : String(t("updateCoupon") || "Update Coupon")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== Delete Coupon Dialog Component ====================
interface DeleteCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  coupon: Coupon | null;
}

function DeleteCouponDialog({ open, onOpenChange, onSuccess, coupon }: DeleteCouponDialogProps) {
  const { t } = useI18n();
  const notifications = useNotifications();
  const [loading, setLoading] = useState(false);

  const [deleteCoupon] = useDeleteCouponMutation();

  const handleDelete = async () => {
    if (!coupon) return;
    setLoading(true);
    try {
      await deleteCoupon(coupon._id).unwrap();
      notifications.success(String(t("couponDeletedSuccess") || "Coupon deleted successfully"));
      onOpenChange(false);
      onSuccess();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      notifications.error(apiError?.data?.message || String(t("couponDeletedError") || "Failed to delete coupon"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{String(t("deleteCouponTitle") || "Delete Coupon")}</DialogTitle>
          <DialogDescription>
            {String(t("deleteCouponDescription") || "Are you sure you want to delete this coupon? This action cannot be undone.")}
          </DialogDescription>
        </DialogHeader>
        {coupon && (
          <div className="py-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">{String(t("couponCode") || "Coupon Code")}:</span> {coupon.couponCode}
              </p>
              <p className="text-sm">
                <span className="font-medium">{String(t("discountValue") || "Discount")}:</span> {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
              </p>
              <p className="text-sm">
                <span className="font-medium">{String(t("status") || "Status")}:</span>{" "}
                <span className={coupon.isActive ? "text-green-600" : "text-red-600"}>
                  {coupon.isActive ? String(t("active") || "Active") : String(t("inactive") || "Inactive")}
                </span>
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {String(t("cancel") || "Cancel")}
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : String(t("deleteCoupon") || "Delete Coupon")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==================== Page Wrapper ====================
export default function AdminCouponsPage() {
  return (
    <AdminRoute>
      <AdminCouponsContent />
    </AdminRoute>
  );
}