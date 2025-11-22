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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/forms/image-upload";
import { useNotifications } from "@/hooks/notifications";
import { useI18n } from "@/providers/LanguageProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAuthCookie } from "@/lib/auth";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCategoryDialogProps) {
  const { t, lang } = useI18n();
  const notifications = useNotifications();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    color: "#FF6B6B",
    image: null as File | string | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAuthCookie();

      if (!token) {
        throw new Error(t("adminNotAuthenticated") || "Authentication token not found");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("nameAr", formData.nameAr);
      formDataToSend.append("nameEn", formData.nameEn);
      formDataToSend.append("descriptionAr", formData.descriptionAr);
      formDataToSend.append("descriptionEn", formData.descriptionEn);
      formDataToSend.append("color", formData.color);

      if (formData.image) {
        if (formData.image instanceof File) {
          formDataToSend.append("image", formData.image);
        } else if (typeof formData.image === "string" && formData.image.startsWith("data:")) {
          const response = await fetch(formData.image);
          const blob = await response.blob();
          formDataToSend.append("image", blob, "category-image.jpg");
        }
      }

      // --- THE CORRECT FETCH REQUEST ---
      const response = await fetch("http://72.60.178.180:8000/api/v1/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // IMPORTANT: DO NOT set 'Content-Type' here.
          // The browser will automatically set:
          // 'Content-Type': multipart/form-data; boundary=----WebKitFormBoundary...
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          const text = await response.text();
          errorData = { message: text };
        }

        console.error("Server error:", errorData);
        const errorMessage =
          errorData.message || errorData.error || t("adminFailedToCreateCategory");
        throw new Error(errorMessage);
      }

      notifications.success(t("adminCategoryCreatedSuccess"));
      onOpenChange(false);
      setFormData({
        nameAr: "",
        nameEn: "",
        descriptionAr: "",
        descriptionEn: "",
        color: "#FF6B6B",
        image: null
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating category:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("adminFailedToCreateCategory");
      notifications.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t("adminAddNewCategory")}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col max-h-[70vh]">
          <ScrollArea className="flex-1 px-1">
            <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4">
              <div>
                <Label htmlFor="nameAr">{t("adminNameAr")} *</Label>
                <Input
                  id="nameAr"
                  value={formData.nameAr}
                  onChange={(e) =>
                    setFormData({ ...formData, nameAr: e.target.value })
                  }
                  placeholder={lang === "ar" ? "مثال: مطاعم" : "Example: Restaurants"}
                  required
                  className="rounded-md focus:outline-none focus:ring-0 focus:ring-offset-0"
                />
              </div>

              <div>
                <Label htmlFor="descriptionAr">{t("adminDescriptionAr")} *</Label>
                <Textarea
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionAr: e.target.value })
                  }
                  placeholder={lang === "ar" ? "وصف الفئة باللغة العربية" : "Category description in Arabic"}
                  required
                  rows={3}
                  className="rounded-md resize-none focus:outline-none focus:ring-0 focus:ring-offset-0"
                />
              </div>

              <div>
                <Label htmlFor="nameEn">{t("adminNameEn")} *</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) =>
                    setFormData({ ...formData, nameEn: e.target.value })
                  }
                  placeholder="Example: Restaurants"
                  required
                  className="rounded-md focus:outline-none focus:ring-0 focus:ring-offset-0"
                />
              </div>

              <div>
                <Label htmlFor="descriptionEn">{t("adminDescriptionEn")} *</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionEn: e.target.value })
                  }
                  placeholder="Category description in English"
                  required
                  rows={3}
                  className="rounded-md resize-none focus:outline-none focus:ring-0 focus:ring-offset-0"
                />
              </div>

              <div>
                <Label htmlFor="color">{t("adminColor")}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-16 h-10 p-1 rounded-md focus:outline-none focus:ring-0 focus:ring-offset-0"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="#FF6B6B"
                    className="flex-1 rounded-md focus:outline-none focus:ring-0 focus:ring-offset-0"
                  />
                </div>
              </div>

              <div>
                <Label>{t("adminCategoryImage")}</Label>
                <div className="mt-2">
                  <ImageUpload
                    onImageChange={(image) => setFormData({ ...formData, image })}
                  />
                </div>
                {formData.image && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("adminNewImageSelected")}
                  </p>
                )}
              </div>
            </form>
          </ScrollArea>
          
          <div className="flex justify-end gap-2 pt-4 border-t px-4 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="focus:outline-none focus:ring-0 focus:ring-offset-0"
            >
              {t("adminCancel")}
            </Button>
            <Button
              type="submit"
              className="btn-ultra focus:outline-none focus:ring-0 focus:ring-offset-0"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? t("adminCreating") : t("adminCreate")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}