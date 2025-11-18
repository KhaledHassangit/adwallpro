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
import { Edit, Trash2, Tags } from "@/components/ui/icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EditCategoryDialog } from "@/components/admin/edit-category-dialog";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/auth";

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

interface AdminCategoriesTableProps {
  onRefresh?: () => void;
}

export function AdminCategoriesTable({ onRefresh }: AdminCategoriesTableProps) {
  const { t, lang } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://72.60.178.180:8000/api/v1/categories", {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error(t("adminSessionExpired"));
          window.location.href = "/login";
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || t("adminFailedToFetchCategories"));
      }

      const data = await response.json();
      setCategories(data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(error instanceof Error ? error.message : t("adminFailedToFetchCategories"));
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/categories/${categoryToDelete._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error(t("adminSessionExpired"));
          window.location.href = "/login";
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || t("adminFailedToDeleteCategory"));
      }

      toast.success(t("adminCategoryDeletedSuccess"));
      fetchCategories();
      onRefresh?.();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error instanceof Error ? error.message : t("adminFailedToDeleteCategory"));
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
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
    <>
      <Card className="ultra-card border p-6">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">{t("adminCategoryImage")}</TableHead>
                <TableHead className="text-center">{t("adminCategoryNameAr")}</TableHead>
                <TableHead className="text-center">{t("adminCategoryNameEn")}</TableHead>
                <TableHead className="text-center">{t("adminCategoryColor")}</TableHead>
                <TableHead className="text-center">{t("adminCategoryCreatedAt")}</TableHead>
                <TableHead className="text-center">{t("adminActions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="text-center">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={lang === "ar" ? category.nameAr : category.nameEn}
                        className="w-12 h-12 rounded-lg object-cover mx-auto"
                        onError={(e) => {
                          console.error("Image failed to load:", category.image);
                          e.currentTarget.src = "";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center mx-auto">
                        <Tags className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    <div>
                      <div>{category.nameAr}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={category.descriptionAr}>
                        {category.descriptionAr}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div>
                      <div>{category.nameEn}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={category.descriptionEn}>
                        {category.descriptionEn}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {category.color}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(category.createdAt).toLocaleDateString(
                      lang === "ar" ? "ar-SA" : "en-US"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(category)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <EditCategoryDialog
        open={editDialogOpen}
        onOpenChange={handleDialogClose}
        category={selectedCategory}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("adminDeleteCategoryTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {categoryToDelete ? 
                `${t("adminDeleteCategoryConfirmation")} ${lang === "ar" ? categoryToDelete.nameAr : categoryToDelete.nameEn}?` : 
                `${t("adminDeleteCategoryConfirmation")} ${t("adminThisCategory")}?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("adminCancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCategory}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("adminDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}