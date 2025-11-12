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
import { toast } from "sonner";
import { useI18n } from "@/providers/LanguageProvider";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("nameAr", formData.nameAr);
      formDataToSend.append("nameEn", formData.nameEn);
      formDataToSend.append("descriptionAr", formData.descriptionAr);
      formDataToSend.append("descriptionEn", formData.descriptionEn);
      formDataToSend.append("color", formData.color);

      // Handle image if it exists
      if (formData.image) {
        // Check if it's a File object
        if (formData.image instanceof File) {
          formDataToSend.append("image", formData.image);
        } 
        // Check if it's a base64 string
        else if (typeof formData.image === "string" && formData.image.startsWith("data:")) {
          // Convert base64 to blob
          const response = await fetch(formData.image);
          const blob = await response.blob();
          formDataToSend.append("image", blob, "category-image.jpg");
        }
      }

      const response = await fetch("http://72.60.178.180:8000/api/v1/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        const errorMessage =
          errorData.message || errorData.error || t("adminFailedToCreateCategory");
        throw new Error(errorMessage);
      }

      toast.success(t("adminCategoryCreatedSuccess"));
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
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("adminAddNewCategory")}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-16 h-10 p-1 rounded"
                />
                <Input
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="#FF6B6B"
                  className="flex-1"
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
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("adminCancel")}
          </Button>
          <Button type="submit"             
          className="btn-ultra"
 disabled={loading} onClick={handleSubmit}>
            {loading ? t("adminCreating") : t("adminCreate")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}