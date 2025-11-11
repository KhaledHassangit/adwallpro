"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/LanguageProvider";
import { Edit, Trash2, MoreHorizontal, Tags } from "@/components/ui/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EditCategoryDialog } from "@/components/admin/edit-category-dialog";
import { toast } from "sonner";

interface Category {
  _id: string;
  nameAr: string;
  nameEn: string;
  color: string;
  image?: string;
  createdAt: string;
}

interface AdminCategoriesTableProps {
  onRefresh?: () => void;
}

export function AdminCategoriesTable({ onRefresh }: AdminCategoriesTableProps) {
  const { t } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://72.60.178.180:8000/api/v1/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(error instanceof Error ? error.message : "فشل في جلب الفئات");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟")) return;

    try {
      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      toast.success("تم حذف الفئة بنجاح");
      fetchCategories();
      onRefresh?.();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error instanceof Error ? error.message : "فشل في حذف الفئة");
    }
  };

  const handleEditCategory = (category: Category) => {
    console.log("Editing category:", category);
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    fetchCategories();
    onRefresh?.();
  };

  const handleDialogClose = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      // Clear selected category when dialog closes
      setTimeout(() => setSelectedCategory(null), 300);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="ultra-card border p-6">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الصورة</TableHead>
              <TableHead>الاسم بالعربية</TableHead>
              <TableHead>الاسم بالإنجليزية</TableHead>
              <TableHead>اللون</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.nameAr}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", category.image);
                        e.currentTarget.src = "";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Tags className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{category.nameAr}</TableCell>
                <TableCell>{category.nameEn}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {category.color}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString("ar-SA")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteCategory(category._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Category Dialog */}
      <EditCategoryDialog
        open={editDialogOpen}
        onOpenChange={handleDialogClose}
        category={selectedCategory}
        onSuccess={handleEditSuccess}
      />
    </Card>
  );
}