"use client";

import { useState, useEffect } from "react";
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
import { getAuthCookie } from "@/lib/auth"; // Import the auth function

interface Category {
  _id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  color: string;
  image?: string;
  createdAt: string;
}

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess: () => void;
}

export function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: EditCategoryDialogProps) {
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

  useEffect(() => {
    if (category) {
      console.log("Setting form data from category:", category);
      setFormData({
        nameAr: category.nameAr || "",
        nameEn: category.nameEn || "",
        descriptionAr: category.descriptionAr || "",
        descriptionEn: category.descriptionEn || "",
        color: category.color || "#FF6B6B",
        image: category.image || null,
      });
    } else {
      // Reset form when category is null
      setFormData({
        nameAr: "",
        nameEn: "",
        descriptionAr: "",
        descriptionEn: "",
        color: "#FF6B6B",
        image: null,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      toast.error(t("adminNoCategorySelected"));
      return;
    }

    setLoading(true);

    try {
      const token = getAuthCookie(); // Use getAuthCookie instead of localStorage

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
          // It's a new file from the user's computer
          formDataToSend.append("image", formData.image);
        } else if (typeof formData.image === "string") {
          if (formData.image.startsWith("data:")) {
            // It's a new base64 image
            const response = await fetch(formData.image);
            const blob = await response.blob();
            formDataToSend.append("image", blob, "category-image.jpg");
          } else {
            // It's the existing image URL
            formDataToSend.append("imageUrl", formData.image);
          }
        }
      }

      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/categories/${category._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from getAuthCookie
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        const errorMessage =
          errorData.message || errorData.error || t("adminFailedToUpdateCategory");
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Update successful:", result);
      toast.success(t("adminCategoryUpdatedSuccess"));
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating category:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("adminFailedToUpdateCategory");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t("adminEditCategory")}</DialogTitle>
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
                  disabled={loading}
                  className="rounded-md"
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
                  disabled={loading}
                  className="rounded-md resize-none"
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
                  disabled={loading}
                  className="rounded-md"
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
                  disabled={loading}
                  className="rounded-md resize-none"
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
                    className="w-16 h-10 p-1 rounded-md"
                    disabled={loading}
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="#FF6B6B"
                    className="flex-1 rounded-md"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label>{t("adminCategoryImage")}</Label>
                <div className="mt-2">
                  <ImageUpload
                    onImageChange={(image) => {
                      console.log("Image changed:", image ? "New image selected" : "Image removed");
                      setFormData({ ...formData, image });
                    }}
                    defaultImage={category?.image}
                    disabled={loading}
                  />
                </div>
                {formData.image && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {formData.image instanceof File
                      ? t("adminNewImageSelected")
                      : typeof formData.image === 'string' && formData.image.startsWith("data:")
                      ? t("adminNewImageSelected")
                      : t("adminCurrentImage")}
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
            >
              {t("adminCancel")}
            </Button>
            <Button 
              type="submit" 
              className="btn-ultra" 
              disabled={loading} 
              onClick={handleSubmit}
            >
              {loading ? t("adminUpdating") : t("adminUpdate")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}