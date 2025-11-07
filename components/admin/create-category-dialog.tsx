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
import { ImageUpload } from "@/components/forms/image-upload";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    color: "#FF6B6B",
    image: null as string | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("nameAr", formData.nameAr);
      formDataToSend.append("nameEn", formData.nameEn);
      formDataToSend.append("color", formData.color);

      // Only append image if it exists (base64 string)
      if (formData.image && formData.image.startsWith("data:")) {
        // Convert base64 to blob
        const response = await fetch(formData.image);
        const blob = await response.blob();
        formDataToSend.append("image", blob, "category-image.jpg");
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
          errorData.message || errorData.error || "فشل في إنشاء الفئة";
        throw new Error(errorMessage);
      }

      toast.success("تم إنشاء الفئة بنجاح");
      onOpenChange(false);
      setFormData({ nameAr: "", nameEn: "", color: "#FF6B6B", image: null });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating category:", error);
      const errorMessage =
        error instanceof Error ? error.message : "فشل في إنشاء الفئة";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>إضافة فئة جديدة</DialogTitle>
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
            />
            {formData.image && (
              <p className="text-sm text-muted-foreground mt-2">
                تم اختيار صورة جديدة
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
              {loading ? "جاري الإنشاء..." : "إنشاء"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
