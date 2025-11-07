"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { AdminCategoriesTable } from "@/components/admin/admin-categories-table";
import { CategoryStats } from "@/components/admin/category-stats";
import { useI18n } from "@/providers/lang-provider";
import { Tags, Plus, AlertCircle } from "@/components/ui/icon";
import { CreateCategoryDialog } from "@/components/admin/create-category-dialog";

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
                  {t("adminCategoriesManagementTitle")}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {t("adminCategoriesManagementDesc")}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="btn-ultra hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("adminAddNewCategory")}
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

export default function AdminCategoriesPage() {
  return (
    <AdminRoute>
      <AdminCategoriesContent />
    </AdminRoute>
  );
}
