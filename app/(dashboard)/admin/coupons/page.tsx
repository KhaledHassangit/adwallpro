"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { useI18n } from "@/providers/LanguageProvider";
import { PlusCircle, Edit, Trash2 } from "@/components/ui/icon";
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
  type Coupon,
} from "@/features/couponsApi";

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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowEditDialog(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowDeleteDialog(true);
  };

  const handleCreateSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowCreateDialog(false);
  };

  const handleEditSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowEditDialog(false);
    setSelectedCoupon(null);
  };

  const handleDeleteSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowDeleteDialog(false);
    setSelectedCoupon(null);
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
                {String(t("adminCreateCoupon") || "Create Coupon")}
              </Button>
            </div>
          </div>

          {/* Coupons Table */}
          <AdminCouponsTable
            key={refreshKey}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Create Coupon Dialog */}
          <CreateCouponDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onSuccess={handleCreateSuccess}
          />

          {/* Edit Coupon Dialog */}
          <EditCouponDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            coupon={selectedCoupon}
            onSuccess={handleEditSuccess}
          />

          {/* Delete Confirmation Dialog */}
          <DeleteCouponDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            coupon={selectedCoupon}
            onSuccess={handleDeleteSuccess}
          />
        </div>
      </div>
    </div>
  );
}

// ==================== Coupons Table Component ====================
interface AdminCouponsTableProps {
  key?: number;
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
}

function AdminCouponsTable({ key, onEdit, onDelete }: AdminCouponsTableProps) {
  const { t } = useI18n();

  const { data: response, isLoading, isFetching, error } = useGetCouponsQuery();
  const coupons = response?.data?.data || [];

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
      <div className="rounded-md">
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

  useEffect(() => {
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
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
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