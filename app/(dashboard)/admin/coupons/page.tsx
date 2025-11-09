"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { useI18n } from "@/providers/lang-provider";
import {  PlusCircle, Edit, Trash2 } from "@/components/ui/icon";
import { CreateCouponDialog } from "@/components/admin/CreateCouponDialog";
import { EditCouponDialog } from "@/components/admin/EditCouponDialog";
import { DeleteCouponDialog } from "@/components/admin/DeleteCouponDialog";
import { AdminCouponsTable } from "@/components/admin/AdminCouponsTable";
function AdminCouponsContent() {
  const { t } = useI18n();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setShowEditDialog(true);
  };

  const handleDelete = (coupon) => {
    setSelectedCoupon(coupon);
    setShowDeleteDialog(true);
  };

  const handleCreateSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowCreateDialog(false);
  };

  const handleEditSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowEditDialog(false);
    setSelectedCoupon(null);
  };

  const handleDeleteSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowDeleteDialog(false);
    setSelectedCoupon(null);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-premium pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  {t("adminCoupons")}
                </h1>
                <p className="text-muted-foreground mt-2">{t("adminCouponsDesc")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="btn-ultra hover:bg-primary/90"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {t("adminCreateCoupon")}
              </Button>
            </div>
          </div>

          {/* Coupons Table */}
          <AdminCouponsTable
            key={refreshKey}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Create Coupon Dialog */}
          <CreateCouponDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onSuccess={handleCreateSuccess}
          />

          {/* Edit Coupon Dialog */}
          <EditCouponDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            onSuccess={handleEditSuccess}
            coupon={selectedCoupon}
          />

          {/* Delete Coupon Dialog */}
          <DeleteCouponDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onSuccess={handleDeleteSuccess}
            coupon={selectedCoupon}
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminCouponsPage() {
  return (
    <AdminRoute>
      <AdminCouponsContent />
    </AdminRoute>
  );
}