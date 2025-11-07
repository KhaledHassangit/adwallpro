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
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/forms/image-upload";
import { toast } from "sonner";

interface Category {
  _id: string;
  nameAr: string;
  nameEn: string;
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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    color: "#FF6B6B",
    image: null as string | null,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        nameAr: category.nameAr || "",
        nameEn: category.nameEn || "",
        color: category.color || "#FF6B6B",
        image: category.image || null,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("nameAr", formData.nameAr);
      formDataToSend.append("nameEn", formData.nameEn);
      formDataToSend.append("color", formData.color);

      // Only append image if it's a new one (base64 string)
      if (formData.image && formData.image.startsWith("data:")) {
        // Convert base64 to blob
        const response = await fetch(formData.image);
        const blob = await response.blob();
        formDataToSend.append("image", blob, "category-image.jpg");
      }

      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/categories/${category._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        const errorMessage =
          errorData.message || errorData.error || "فشل في تحديث الفئة";
        throw new Error(errorMessage);
      }

      toast.success("تم تحديث الفئة بنجاح");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating category:", error);
      const errorMessage =
        error instanceof Error ? error.message : "فشل في تحديث الفئة";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>تعديل الفئة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nameAr">الاسم بالعربية *</Label>
            <Input
              id="nameAr"
              value={formData.nameAr}
              onChange={(e) =>
                setFormData({ ...formData, nameAr: e.target.value })
              }
              placeholder="مثال: مطاعم"
              required
            />
          </div>

          <div>
            <Label htmlFor="nameEn">الاسم بالإنجليزية *</Label>
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
            <Label htmlFor="color">اللون</Label>
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
            <Label>صورة الفئة</Label>
            <ImageUpload
              onImageChange={(image) => setFormData({ ...formData, image })}
              defaultImage={category?.image}
            />
            {formData.image && formData.image.startsWith("data:") && (
              <p className="text-sm text-muted-foreground mt-2">
                تم اختيار صورة جديدة
              </p>
            )}
            {formData.image && !formData.image.startsWith("data:") && (
              <p className="text-sm text-muted-foreground mt-2">
                الصورة الحالية
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "جاري التحديث..." : "تحديث"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
