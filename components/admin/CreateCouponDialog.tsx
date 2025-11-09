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
import { useI18n } from "@/providers/lang-provider";
import { toast } from "sonner";

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
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discountValue: "",
        discountType: "percentage",
        createdDate: new Date(),
        expiryDate: undefined as Date | undefined,
        usageLimit: "",
        unlimitedUsage: true,
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            // In a real app, you would make an API call here
            // For now, we'll simulate a successful creation
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success(t("couponCreatedSuccess"));
            onSuccess();
            onOpenChange(false);

            // Reset form
            setFormData({
                code: "",
                discountValue: "",
                discountType: "percentage",
                createdDate: new Date(),
                expiryDate: undefined,
                usageLimit: "",
                unlimitedUsage: true,
            });
        } catch (error) {
            console.error("Error creating coupon:", error);
            toast.error(t("couponCreatedError"));
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("createCouponTitle")}</DialogTitle>
                    <DialogDescription>
                        Create a new discount coupon for your customers.
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
                                className={errors.code ? "border-red-500" : ""}
                            />
                            {errors.code && (
                                <p className="text-sm text-red-500">{errors.code}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="discountValue">{t("discountValue")}</Label>
                                <Input
                                    id="discountValue"
                                    value={formData.discountValue}
                                    onChange={(e) => handleInputChange("discountValue", e.target.value)}
                                    placeholder={t("discountPlaceholder")}
                                    className={errors.discountValue ? "border-red-500" : ""}
                                />
                                {errors.discountValue && (
                                    <p className="text-sm text-red-500">{errors.discountValue}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="discountType">{t("discountType")}</Label>
                                <Select
                                    value={formData.discountType}
                                    onValueChange={(value) => handleInputChange("discountType", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">{t("percentage")}</SelectItem>
                                        <SelectItem value="fixed">{t("fixedAmount")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>{t("createdDate")}</Label>
                                <Input
                                    value={format(formData.createdDate, "PPP")}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>{t("expiryDate")}</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
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
                                {errors.expiryDate && (
                                    <p className="text-sm text-red-500">{errors.expiryDate}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="unlimitedUsage"
                                    checked={formData.unlimitedUsage}
                                    onChange={(e) => handleInputChange("unlimitedUsage", e.target.checked)}
                                    className="rounded"
                                />
                                <Label htmlFor="unlimitedUsage">{t("unlimitedUsage")}</Label>
                            </div>

                            {!formData.unlimitedUsage && (
                                <Input
                                    value={formData.usageLimit}
                                    onChange={(e) => handleInputChange("usageLimit", e.target.value)}
                                    placeholder={t("usageLimitPlaceholder")}
                                    type="number"
                                    min="1"
                                />
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            {t("cancel")}
                        </Button>
                        <Button type="submit" disabled={loading}>
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