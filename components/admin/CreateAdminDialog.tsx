"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/hooks/notifications";
import { useI18n } from "@/providers/LanguageProvider";
import { getAuthHeaders } from "@/lib/auth";

interface CreateAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAdminDialog({
  open,
  onOpenChange,
}: CreateAdminDialogProps) {
  const { t } = useI18n();
  const notifications = useNotifications();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من تطابق كلمات المرور
    if (formData.password !== formData.passwordConfirm) {
      notifications.error(t("passwordsDoNotMatch"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://72.60.178.180:8000/api/v1/users/admins", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          notifications.error(t("adminSessionExpired"));
          window.location.href = "/login";
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || t("failedToCreateAdmin"));
      }

      notifications.success(t("adminCreatedSuccessfully"));
      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error creating admin:", error);
      notifications.error(error instanceof Error ? error.message : t("failedToCreateAdmin"));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("createAdminTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <Label htmlFor="passwordConfirm">{t("confirmPassword")}</Label>
            <Input
              id="passwordConfirm"
              type="password"
              value={formData.passwordConfirm}
              onChange={(e) => handleInputChange("passwordConfirm", e.target.value)}
              required
              minLength={6}
            />
            {formData.passwordConfirm &&
              formData.password !== formData.passwordConfirm && (
                <p className="text-xs text-destructive mt-1">
                  {t("passwordsDoNotMatch")}
                </p>
              )}
          </div>

          <div>
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+201024994092"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" className="btn-ultra" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t("creating")}
                </div>
              ) : (
                t("createAdmin")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}