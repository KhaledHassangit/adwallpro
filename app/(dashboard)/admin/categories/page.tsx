"use client";

import { useState , useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { useI18n } from "@/providers/LanguageProvider";
import {
  Tags,
  Plus,
  AlertCircle,
  Edit,
  Trash2,
  TrendingUp,
  CheckCircle,
} from "@/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { ImageUpload } from "@/components/forms/image-upload";
import { toast } from "sonner";
// Import the new RTK Query hooks and types
import {
  useGetCategoryStatsQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  type Category,
} from "@/features/categoriesApi";

// ==================== Main Content Component ====================
function AdminCategoriesContent() {
  const { t } = useI18n();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-premium pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  {String(t("adminCategoriesManagementTitle") || "Categories Management")}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {String(t("adminCategoriesManagementDesc") || "Manage and organize categories.")}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="btn-ultra hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {String(t("adminAddNewCategory") || "Add New Category")}
            </Button>
          </div>

          {/* Quick Stats */}
          <CategoryStats refreshKey={refreshKey} />

          {/* Categories Table */}
          <AdminCategoriesTable
            key={refreshKey}
            onRefresh={() => setRefreshKey((prev) => prev + 1)}
          />

          {/* Create Category Dialog */}
          <CreateCategoryDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        </div>
      </div>
    </div>
  );
}

// ==================== Category Stats Component ====================
interface CategoryStatsProps {
  refreshKey?: number;
}

function CategoryStats({ refreshKey }: CategoryStatsProps) {
  const { t } = useI18n();

  // Use the RTK Query hook to fetch stats
  const { data: stats, isLoading, error } = useGetCategoryStatsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="ultra-card transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">...</CardTitle>
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-6 w-16 bg-muted animate-pulse rounded mb-2"></div>
              <p className="h-3 w-24 bg-muted animate-pulse rounded"></p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        Failed to load category statistics. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="ultra-card transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {String(t("adminTotalCategories") || "Total Categories")}
          </CardTitle>
          <Tags className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {String(t("adminActiveCategories") || "Active Categories")}
          </p>
        </CardContent>
      </Card>

      <Card className="ultra-card transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {String(t("adminMostUsedCategory") || "Most Used Category")}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats?.mostUsedCategory || "..."}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {String(t("adminHighestCompanyCount") || "Highest Company Count")}
          </p>
        </CardContent>
      </Card>

      <Card className="ultra-card transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {String(t("adminSystemStatus") || "System Status")}
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats?.systemStatus || "..."}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {String(t("adminAllCategoriesWorking") || "All Categories Working")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== Categories Table Component ====================
interface AdminCategoriesTableProps {
  onRefresh?: () => void;
}

function AdminCategoriesTable({ onRefresh }: AdminCategoriesTableProps) {
  const { t, lang } = useI18n();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Use the RTK Query hook to fetch categories
  const { data: response, isLoading, error } = useGetCategoriesQuery();
  // Use the mutation hook to delete a category
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = response?.data?.data || [];

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete._id).unwrap();
      toast.success(String(t("adminCategoryDeletedSuccess") || "Category deleted successfully"));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      onRefresh?.();
    } catch (err: any) {
      toast.error(err?.data?.message || String(t("adminFailedToDeleteCategory") || "Failed to delete category"));
    }
  };

  const handleDialogClose = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setTimeout(() => setSelectedCategory(null), 300);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          {String((error as any)?.data?.message || "Failed to fetch categories")}
        </p>
        <Button onClick={() => onRefresh?.()} className="mt-4">
          {String(t("adminTryAgain") || "Try Again")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Card className="ultra-card border p-6">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">{String(t("adminCategoryImage") || "Image")}</TableHead>
                <TableHead className="text-center">{String(t("adminCategoryNameAr") || "Name (Ar)")}</TableHead>
                <TableHead className="text-center">{String(t("adminCategoryNameEn") || "Name (En)")}</TableHead>
                <TableHead className="text-center">{String(t("adminCategoryColor") || "Color")}</TableHead>
                <TableHead className="text-center">{String(t("adminCategoryCreatedAt") || "Created At")}</TableHead>
                <TableHead className="text-center">{String(t("adminActions") || "Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length ? (
                categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="text-center">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={lang === "ar" ? category.nameAr : category.nameEn}
                          className="w-12 h-12 rounded-lg object-cover mx-auto"
                          onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
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
                        <span className="text-sm text-muted-foreground">{category.color}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(category.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {String(t("adminNoCategoriesFound") || "No categories found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <EditCategoryDialog
        open={editDialogOpen}
        onOpenChange={handleDialogClose}
        category={selectedCategory}
        onSuccess={onRefresh}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{String(t("adminDeleteCategoryTitle") || "Delete Category")}</AlertDialogTitle>
            <AlertDialogDescription>
              {categoryToDelete ?
                `${String(t("adminDeleteCategoryConfirmation") || "Are you sure you want to delete")} ${lang === "ar" ? categoryToDelete.nameAr : categoryToDelete.nameEn}?` :
                `${String(t("adminDeleteCategoryConfirmation") || "Are you sure you want to delete this category")}?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{String(t("adminCancel") || "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {String(t("adminDelete") || "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ==================== Create Category Dialog Component ====================
interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function CreateCategoryDialog({ open, onOpenChange, onSuccess }: CreateCategoryDialogProps) {
  const { t, lang } = useI18n();
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    color: "#FF6B6B",
    image: null as File | string | null,
  });

  // Use the mutation hook
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("nameAr", formData.nameAr);
    formDataToSend.append("nameEn", formData.nameEn);
    formDataToSend.append("descriptionAr", formData.descriptionAr);
    formDataToSend.append("descriptionEn", formData.descriptionEn);
    formDataToSend.append("color", formData.color);

    if (formData.image && formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    try {
      await createCategory(formDataToSend).unwrap();
      toast.success(String(t("adminCategoryCreatedSuccess") || "Category created successfully"));
      onOpenChange(false);
      setFormData({ nameAr: "", nameEn: "", descriptionAr: "", descriptionEn: "", color: "#FF6B6B", image: null });
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || String(t("adminFailedToCreateCategory") || "Failed to create category"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{String(t("adminAddNewCategory") || "Add New Category")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col max-h-[70vh]">
          <ScrollArea className="flex-1 px-1">
            <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4">
              <div>
                <Label htmlFor="nameAr">{String(t("adminNameAr") || "Name (Ar)")} *</Label>
                <Input
                  id="nameAr"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder={lang === "ar" ? "مثال: مطاعم" : "Example: Restaurants"}
                  required
                  className="rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="descriptionAr">{String(t("adminDescriptionAr") || "Description (Ar)")} *</Label>
                <Textarea
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder={lang === "ar" ? "وصف الفئة باللغة العربية" : "Category description in Arabic"}
                  required
                  rows={3}
                  className="rounded-md resize-none"
                />
              </div>

              <div>
                <Label htmlFor="nameEn">{String(t("adminNameEn") || "Name (En)")} *</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Example: Restaurants"
                  required
                  className="rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="descriptionEn">{String(t("adminDescriptionEn") || "Description (En)")} *</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Category description in English"
                  required
                  rows={3}
                  className="rounded-md resize-none"
                />
              </div>

              <div>
                <Label htmlFor="color">{String(t("adminColor") || "Color")}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10 p-1 rounded-md"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#FF6B6B"
                    className="flex-1 rounded-md"
                  />
                </div>
              </div>

              <div>
                <Label>{String(t("adminCategoryImage") || "Category Image")}</Label>
                <div className="mt-2">
                  <ImageUpload
                    onImageChange={(image) => setFormData({ ...formData, image })}
                  />
                </div>
                {formData.image && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {String(t("adminNewImageSelected") || "New image selected")}
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
              disabled={isLoading}
            >
              {String(t("adminCancel") || "Cancel")}
            </Button>
            <Button
              type="submit"
              className="btn-ultra"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? String(t("adminCreating") || "Creating...") : String(t("adminCreate") || "Create")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ==================== Edit Category Dialog Component ====================
interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSuccess?: () => void;
}

function EditCategoryDialog({ open, onOpenChange, category, onSuccess }: EditCategoryDialogProps) {
  const { t, lang } = useI18n();
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    color: "#FF6B6B",
    image: null as File | string | null,
  });

  // Use the mutation hook
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  // Pre-populate form when category prop changes
  useEffect(() => {
    if (category) {
      setFormData({
        nameAr: category.nameAr || "",
        nameEn: category.nameEn || "",
        descriptionAr: category.descriptionAr || "",
        descriptionEn: category.descriptionEn || "",
        color: category.color || "#FF6B6B",
        image: category.image || null,
      });
    } else {
      setFormData({ nameAr: "", nameEn: "", descriptionAr: "", descriptionEn: "", color: "#FF6B6B", image: null });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      toast.error(String(t("adminNoCategorySelected") || "No category selected"));
      return;
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
      } else if (typeof formData.image === "string") {
        if (formData.image.startsWith("data:")) {
          const response = await fetch(formData.image);
          const blob = await response.blob();
          formDataToSend.append("image", blob, "category-image.jpg");
        } else {
          formDataToSend.append("imageUrl", formData.image);
        }
      }
    }

    try {
      await updateCategory({ id: category._id, formData: formDataToSend }).unwrap();
      toast.success(String(t("adminCategoryUpdatedSuccess") || "Category updated successfully"));
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || String(t("adminFailedToUpdateCategory") || "Failed to update category"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{String(t("adminEditCategory") || "Edit Category")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col max-h-[70vh]">
          <ScrollArea className="flex-1 px-1">
            <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4">
              <div>
                <Label htmlFor="nameAr">{String(t("adminNameAr") || "Name (Ar)")} *</Label>
                <Input
                  id="nameAr"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder={lang === "ar" ? "مثال: مطاعم" : "Example: Restaurants"}
                  required
                  disabled={isLoading}
                  className="rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="descriptionAr">{String(t("adminDescriptionAr") || "Description (Ar)")} *</Label>
                <Textarea
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder={lang === "ar" ? "وصف الفئة باللغة العربية" : "Category description in Arabic"}
                  required
                  rows={3}
                  disabled={isLoading}
                  className="rounded-md resize-none"
                />
              </div>

              <div>
                <Label htmlFor="nameEn">{String(t("adminNameEn") || "Name (En)")} *</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Example: Restaurants"
                  required
                  disabled={isLoading}
                  className="rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="descriptionEn">{String(t("adminDescriptionEn") || "Description (En)")} *</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Category description in English"
                  required
                  rows={3}
                  disabled={isLoading}
                  className="rounded-md resize-none"
                />
              </div>

              <div>
                <Label htmlFor="color">{String(t("adminColor") || "Color")}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10 p-1 rounded-md"
                    disabled={isLoading}
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#FF6B6B"
                    className="flex-1 rounded-md"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label>{String(t("adminCategoryImage") || "Category Image")}</Label>
                <div className="mt-2">
                  <ImageUpload
                    onImageChange={(image) => setFormData({ ...formData, image })}
                    defaultImage={category?.image}
                    disabled={isLoading}
                  />
                </div>
                {formData.image && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {formData.image instanceof File ?
                      String(t("adminNewImageSelected") || "New image selected") :
                      typeof formData.image === 'string' && formData.image.startsWith("data:") ?
                      String(t("adminNewImageSelected") || "New image selected") :
                      String(t("adminCurrentImage") || "Current image")
                    }
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
              disabled={isLoading}
            >
              {String(t("adminCancel") || "Cancel")}
            </Button>
            <Button
              type="submit"
              className="btn-ultra"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? String(t("adminUpdating") || "Updating...") : String(t("adminUpdate") || "Update")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ==================== Page Wrapper ====================
export default function AdminCategoriesPage() {
  return (
    <AdminRoute>
      <AdminCategoriesContent />
    </AdminRoute>
  );
}