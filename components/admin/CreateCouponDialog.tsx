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
import { useI18n } from "@/providers/LanguageProvider";
import { useNotifications } from "@/hooks/notifications";
import { getAuthHeaders } from "@/lib/auth";

interface CreateCouponDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateCouponDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreateCouponDialogProps) {
    const { t } = useI18n();
  const notifications = useNotifications();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discountValue: "",
        discountType: "percentage",
        startDate: new Date(),
        expiryDate: undefined as Date | undefined,
        usageLimit: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.code.trim()) {
            newErrors.code = t("couponCodeRequired");
        }

        if (!formData.discountValue.trim()) {
            newErrors.discountValue = t("discountValueRequired");
        } else if (
            isNaN(Number(formData.discountValue)) ||
            Number(formData.discountValue) <= 0
        ) {
            newErrors.discountValue = t("invalidDiscountValue");
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = t("expiryDateRequired");
        }

        if (!formData.usageLimit.trim()) {
            newErrors.usageLimit = t("usageLimitRequired");
        } else if (
            isNaN(Number(formData.usageLimit)) ||
            Number(formData.usageLimit) <= 0
        ) {
            newErrors.usageLimit = t("invalidUsageLimit");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            // Using getAuthHeaders to get the token from cookies
            const headers = getAuthHeaders();

            // Prepare request body according to API specification
            const requestBody = {
                couponCode: formData.code,
                startDate: format(formData.startDate, "yyyy-MM-dd"),
                expiryDate: formData.expiryDate ? format(formData.expiryDate, "yyyy-MM-dd") : "",
                discountValue: Number(formData.discountValue),
                discountType: formData.discountType,
                maxUses: Number(formData.usageLimit)
            };

            console.log("Request payload:", requestBody);

            // Make the API call to create the coupon
            const response = await fetch("http://72.60.178.180:8000/api/v1/coupons", {
                method: "POST",
                headers,
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                // Handle unauthorized access
                if (response.status === 401) {
                    notifications.error(t("adminSessionExpired"));
                    window.location.href = "/login";
                    return;
                }
                
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create coupon");
            }

            const data = await response.json();
            console.log("Coupon created successfully:", data);

            notifications.success(t("couponCreatedSuccess"));
            onSuccess();
            onOpenChange(false);

            // Reset form
            setFormData({
                code: "",
                discountValue: "",
                discountType: "percentage",
                startDate: new Date(),
                expiryDate: undefined,
                usageLimit: "",
            });
        } catch (error) {
            console.error("Error creating coupon:", error);
            notifications.error(error instanceof Error ? error.message : t("couponCreatedError"));
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t("createCouponTitle")}</DialogTitle>
                    <DialogDescription>
                        {t("createCouponDescription")}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">{t("couponCode")}</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => handleInputChange("code", e.target.value)}
                                placeholder={t("couponCodePlaceholder")}
                                className={cn(
                                    errors.code ? "border-red-500" : "",
                                    "focus:outline-none focus:ring-0"
                                )}
                            />
                            <div className="h-5">
                                {errors.code && (
                                    <p className="text-sm text-red-500">{errors.code}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="discountValue">{t("discountValue")}</Label>
                                <Input
                                    id="discountValue"
                                    value={formData.discountValue}
                                    onChange={(e) => handleInputChange("discountValue", e.target.value)}
                                    placeholder={t("discountPlaceholder")}
                                    className={cn(
                                        errors.discountValue ? "border-red-500" : "",
                                        "focus:outline-none focus:ring-0"
                                    )}
                                />
                                <div className="h-5">
                                    {errors.discountValue && (
                                        <p className="text-sm text-red-500">{errors.discountValue}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="discountType">{t("discountType")}</Label>
                                <Select
                                    value={formData.discountType}
                                    onValueChange={(value) => handleInputChange("discountType", value)}
                                >
                                    <SelectTrigger className="focus:outline-none focus:ring-0">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background">
                                        <SelectItem value="percentage">{t("percentage")}</SelectItem>
                                        <SelectItem value="fixed">{t("fixedAmount")}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="h-5"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>{t("startDate")}</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal focus:outline-none focus:ring-0",
                                                !formData.startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.startDate ? (
                                                format(formData.startDate, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.startDate}
                                            onSelect={(date) => handleInputChange("startDate", date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <div className="h-5"></div>
                            </div>

                            <div className="grid gap-2">
                                <Label>{t("expiryDate")}</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal focus:outline-none focus:ring-0",
                                                !formData.expiryDate && "text-muted-foreground",
                                                errors.expiryDate ? "border-red-500" : ""
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.expiryDate ? (
                                                format(formData.expiryDate, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.expiryDate}
                                            onSelect={(date) => handleInputChange("expiryDate", date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <div className="h-5">
                                    {errors.expiryDate && (
                                        <p className="text-sm text-red-500">{errors.expiryDate}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="usageLimit">{t("usageLimit")}</Label>
                            <Input
                                id="usageLimit"
                                value={formData.usageLimit}
                                onChange={(e) => handleInputChange("usageLimit", e.target.value)}
                                placeholder={t("usageLimitPlaceholder")}
                                type="number"
                                min="1"
                                className={cn(
                                    errors.usageLimit ? "border-red-500" : "",
                                    "focus:outline-none focus:ring-0"
                                )}
                            />
                            <div className="h-5">
                                {errors.usageLimit && (
                                    <p className="text-sm text-red-500">{errors.usageLimit}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="focus:outline-none focus:ring-0"
                        >
                            {t("cancel")}
                        </Button>
                        <Button type="submit" disabled={loading} className="btn-ultra focus:outline-none focus:ring-0">
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    {t("saving")}
                                </div>
                            ) : (
                                t("saveCoupon")
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}