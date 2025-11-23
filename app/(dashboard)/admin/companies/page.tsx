"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { Building2, Filter, AlertCircle, Search, Loader2, ChevronLeft, ChevronRight, MoreHorizontal, Check, X, Eye, Trash2 } from "@/components/ui/icon";
import { useI18n } from "@/providers/LanguageProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNotifications } from "@/hooks/notifications";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CompanyDetailsDialog } from "@/components/admin/company-details-dialog";
import { PaginationControl } from "@/components/ui/pagination-control";
// Import the RTK Query hooks and types
import { useGetCompaniesQuery, useApproveCompanyMutation, useDeleteCompanyMutation } from "@/features/companiesApi";

// دالة لتنظيف رابط الصورة المكرر
const cleanImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return "";
  return imageUrl.replace(
    /^https:\/\/adwallpro\.com\/brands\/https:\/\/adwallpro\.com\/brands\//,
    "https://adwallpro.com/brands/"
  );
};

// PaginationControls Component (no changes needed)
function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  loading,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}) {
  const { t } = useI18n();

  if (!totalPages || totalPages <= 0) return null;

  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm">
        {String(t("adminPageOf") || "Page")} {currentPage} / {totalPages}
      </div>
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg glass transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              disabled={loading}
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg glass transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="flex items-center justify-center w-9 h-9">
                <MoreHorizontal className="w-4 h-4" />
              </span>
            )}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 text-sm font-medium ${
              currentPage === page
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                : "glass disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="flex items-center justify-center w-9 h-9">
                <MoreHorizontal className="w-4 h-4" />
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={loading}
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg glass hover:bg-white/10 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg glass hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// ConfirmationModal Component (no changes needed)
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  variant = "default",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant?: "default" | "destructive";
}) {
  const { t } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {variant === "destructive" && (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="glass">
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant={variant === "destructive" ? "destructive" : "default"}
            className={variant === "default" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Companies Table Component (Major Refactor Here)
function AdminCompaniesTable({
  statusFilter,
  searchQuery,
  countryFilter,
  cityFilter,
  categoryId,
  currentPage,
  onPageChange,
}: {
  statusFilter: string;
  searchQuery: string;
  countryFilter: string;
  cityFilter: string;
  categoryId: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const { t } = useI18n();
  const notifications = useNotifications();

  // Use the RTK Query hook to fetch companies
  const {
    data: response,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetCompaniesQuery({
    page: currentPage,
    limit: 10,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: searchQuery || undefined,
    country: countryFilter || undefined,
    city: cityFilter || undefined,
    categoryId: categoryId === "all" ? undefined : categoryId,
  });

  // Use the mutation hooks for approve and delete
  const [approveCompany, { isLoading: isApproving }] = useApproveCompanyMutation();
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();

  const companies = response?.data?.data || [];
  const totalResults = response?.results || 0;
  const totalPages = Math.ceil(totalResults / 10);

  // Modal states (no change)
  const [approveModal, setApproveModal] = useState<{
    isOpen: boolean;
    companyId: string;
    companyName: string;
  }>({
    isOpen: false,
    companyId: "",
    companyName: "",
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    companyId: string;
    companyName: string;
  }>({
    isOpen: false,
    companyId: "",
    companyName: "",
  });

  // Company details dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Handle approve with the mutation
  const handleApprove = async () => {
    try {
      await approveCompany(approveModal.companyId).unwrap();
      notifications.success(String(t("adminCompanyApprovedSuccess") || "Company approved successfully."), {
        title: String(t("adminSuccess") || "Success"),
      });
      setApproveModal({ isOpen: false, companyId: "", companyName: "" });
      // No need for onRefresh, invalidatesTags handles refetching
    } catch (err) {
      notifications.error(String(t("adminCompanyApproveError") || "Failed to approve company."), {
        title: String(t("adminError") || "Error"),
      });
    }
  };

  // Handle reject (unapprove) with the mutation
  const handleReject = async (companyId: string, companyName: string) => {
    try {
      await approveCompany({ id: companyId, isApproved: false }).unwrap();
      notifications.success(String(t("adminCompanyRejectedSuccess") || "Company rejected successfully."), {
        title: String(t("adminSuccess") || "Success"),
      });
    } catch (err) {
      notifications.error(String(t("adminCompanyRejectError") || "Failed to reject company."), {
        title: String(t("adminError") || "Error"),
      });
    }
  };

  // Handle delete with the mutation
  const handleDelete = async () => {
    try {
      await deleteCompany(deleteModal.companyId).unwrap();
      notifications.success(String(t("adminCompanyDeletedSuccess") || "Company deleted successfully."), {
        title: String(t("adminSuccess") || "Success"),
      });
      setDeleteModal({ isOpen: false, companyId: "", companyName: "" });
    } catch (err) {
      notifications.error(String(t("adminCompanyDeleteError") || "Failed to delete company."), {
        title: String(t("adminError") || "Error"),
      });
    }
  };

  // Handle view details
  const handleViewDetails = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setDetailsDialogOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    if (status === "approved") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          ✓ {String(t("adminApproved") || "Approved")}
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 border-yellow-200"
        >
          ⏳ {String(t("adminPending") || "Pending")}
        </Badge>
      );
    }
  };

  // Loading state for initial load
  if (isLoading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          {String((error as any)?.data?.message || "Failed to fetch companies")}
        </p>
        <Button onClick={() => refetch()} className="mt-4">
          {String(t("adminTryAgain") || "Try Again")}
        </Button>
      </div>
    );
  }

  // Empty state
  if (companies.length === 0 && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {String(t("adminNoCompaniesFound") || "No companies found")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* عنوان الجدول */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold gradient-text">
          {String(t("adminCompanies") || "Companies")} ({companies.length})
        </h3>
      </div>

      {/* الجدول للشاشات الكبيرة */}
      <div className="hidden lg:block">
        <Card className="ultra-card border-0 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
                  <TableHead className="font-semibold text-primary">
                    {String(t("adminCompanyImage") || "Image")}
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    {String(t("adminCompanyName") || "Company Name")}
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    {String(t("adminCompanyCategory") || "Category")}
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    {String(t("adminCompanyLocation") || "Location")}
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    {String(t("adminCompanyOwner") || "Owner")}
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    {String(t("adminCompanyStatus") || "Status")}
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    {String(t("adminCompanyRegistrationDate") || "Registration Date")}
                  </TableHead>
                  <TableHead className="font-semibold text-primary text-center">
                    {String(t("adminActions") || "Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {String(t("adminNoCompaniesFound") || "No companies found")}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((company: any, index: number) => (
                    <TableRow
                      key={company._id}
                      className={cn(
                        "hover:bg-muted/50 transition-colors",
                        index % 2 === 0
                          ? "bg-background dark:bg-muted/20"
                          : "bg-muted/30 dark:bg-muted/10"
                      )}
                    >
                      <TableCell>
                        {company.logo ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/50 hover:scale-105 transition-transform duration-200 cursor-pointer group">
                            <Image
                              src={cleanImageUrl(company.logo)}
                              alt={company.companyName || "Company Image"}
                              fill
                              className="object-cover"
                              onClick={() =>
                                window.open(
                                  cleanImageUrl(company.logo),
                                  "_blank"
                                )
                              }
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                const placeholder = target.parentElement
                                  ?.nextElementSibling as HTMLElement;
                                if (placeholder)
                                  placeholder.style.display = "flex";
                              }}
                            />
                          </div>
                        ) : null}
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-border/50 ${company.logo ? "hidden" : "flex"
                            }`}
                        >
                          <div className="text-lg opacity-40">🏢</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {company.companyName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {company.category?.name || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {company.city}, {company.country}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {company.user?.name || "-"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(company.status)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(company.createdAt).toLocaleDateString(
                          t("locale") === "ar" ? "ar-SA" : "en-US"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          {/* أزرار الموافقة والرفض للشركات المعلقة */}
                          {company.status !== "approved" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50 h-8 w-8 p-0"
                                onClick={() =>
                                  setApproveModal({
                                    isOpen: true,
                                    companyId: company._id,
                                    companyName: company.companyName,
                                  })
                                }
                                title={String(t("adminApprove") || "Approve")}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                onClick={() => handleReject(company._id, company.companyName)}
                                title={String(t("adminReject") || "Reject")}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}

                          {/* زر إلغاء الموافقة للشركات الموافق عليها */}
                          {company.status === "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-orange-600 border-orange-600 hover:bg-orange-50 h-8 w-8 p-0"
                              onClick={() => handleReject(company._id, company.companyName)}
                              title={String(t("adminUnapprove") || "Unapprove")}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(company._id)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                {String(t("adminViewDetails") || "View Details")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  setDeleteModal({
                                    isOpen: true,
                                    companyId: company._id,
                                    companyName: company.companyName,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {String(t("adminDelete") || "Delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* عرض الكروت للشاشات الصغيرة */}
      <div className="lg:hidden space-y-4">
        {companies.length === 0 ? (
          <Card className="ultra-card border-0">
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <Search className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium text-muted-foreground">
                    {String(t("adminNoCompaniesFound") || "No companies found")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          companies.map((company: any) => (
            <Card
              key={company._id}
              className="ultra-card border-0 overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* الصورة واسم الشركة والحالة */}
                  <div className="flex items-start gap-3">
                    {/* صورة الشركة */}
                    <div className="flex-shrink-0">
                      {company.logo ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/50 hover:scale-105 transition-transform duration-200 cursor-pointer group">
                          <Image
                            src={cleanImageUrl(company.logo)}
                            alt={company.companyName || "Company Image"}
                            fill
                            className="object-cover"
                            onClick={() =>
                              window.open(
                                cleanImageUrl(company.logo),
                                "_blank"
                              )
                            }
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const placeholder = target.parentElement
                                ?.nextElementSibling as HTMLElement;
                              if (placeholder)
                                placeholder.style.display = "flex";
                            }}
                          />
                        </div>
                      ) : null}
                      <div
                        className={`w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-border/50 ${company.logo ? "hidden" : "flex"
                          }`}
                      >
                        <div className="text-2xl opacity-40">🏢</div>
                      </div>
                    </div>

                    {/* اسم الشركة والحالة */}
                    <div className="flex-1 flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {company.companyName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {company.category?.name || "-"}
                        </p>
                      </div>
                      {getStatusBadge(company.status)}
                    </div>
                  </div>

                  {/* المعلومات */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">{String(t("adminCity") || "City")}: </span>
                      <span className="text-foreground">
                        {company.city}, {company.country}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {String(t("adminOwner") || "Owner")}:{" "}
                      </span>
                      <span className="text-foreground">
                        {company.user?.name || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      {String(t("adminRegistrationDate") || "Registration Date")}:{" "}
                    </span>
                    <span className="text-foreground">
                      {new Date(company.createdAt).toLocaleDateString(
                        t("locale") === "ar" ? "ar-SA" : "en-US"
                      )}
                    </span>
                  </div>

                  {/* الأزرار */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      {/* أزرار الموافقة والرفض للشركات المعلقة */}
                      {company.status !== "approved" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() =>
                              setApproveModal({
                                isOpen: true,
                                companyId: company._id,
                                companyName: company.companyName,
                              })
                            }
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {String(t("adminApprove") || "Approve")}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleReject(company._id, company.companyName)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            {String(t("adminReject") || "Reject")}
                          </Button>
                        </>
                      )}

                      {/* زر إلغاء الموافقة للشركات الموافق عليها */}
                      {company.status === "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          onClick={() => handleReject(company._id, company.companyName)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {String(t("adminUnapprove") || "Unapprove")}
                        </Button>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(company._id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {String(t("adminViewDetails") || "View Details")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              companyId: company._id,
                              companyName: company.companyName,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {String(t("adminDelete") || "Delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      {/* Company Details Dialog */}
      <CompanyDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        companyId={selectedCompanyId}
      />

      {/* Modals */}
      <ConfirmationModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ isOpen: false, companyId: "", companyName: "" })}
        onConfirm={handleApprove}
        title={String(t("adminConfirmApprove") || "Confirm Approval")}
        description={`${String(t("adminConfirmApproveDesc") || "Are you sure you want to approve")} ${approveModal.companyName}?`}
        confirmText={String(t("adminApprove") || "Approve")}
        cancelText={String(t("adminCancel") || "Cancel")}
        variant="default"
      />
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, companyId: "", companyName: "" })}
        onConfirm={handleDelete}
        title={String(t("adminConfirmDelete") || "Confirm Deletion")}
        description={`${String(t("adminConfirmDeleteDesc") || "Are you sure you want to delete")} ${deleteModal.companyName}?`}
        confirmText={String(t("adminDelete") || "Delete")}
        cancelText={String(t("adminCancel") || "Cancel")}
        variant="destructive"
      />
    </div>
  );
}

// Main Content Component (Simplified)
function AdminCompaniesContent() {
  const { t } = useI18n();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, countryFilter, cityFilter, categoryId]);

  // Mock categories - in a real app, you'd fetch these from an API
  const categories = [
    { _id: "68d42f4af6fb8fa5ecf83f7b", name: String(t("adminCategoryTechnology") || "Technology") },
    { _id: "68e7fa45e16ebc3c6051ea28", name: String(t("adminCategoryFoodBeverage") || "Food & Beverage") },
    { _id: "68ef6e7dfa1c956169576d15", name: String(t("adminCategoryMarketing") || "Marketing") },
    { _id: "68d03813f6fb8fa5ecf83b8f", name: String(t("adminCategoryServices") || "Services") },
    { _id: "68e7f9eee16ebc3c6051ea21", name: String(t("adminCategoryOther") || "Other") },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-premium pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  {String(t("adminCompaniesManagement") || "Companies Management")}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {String(t("adminCompaniesManagementDesc") || "Manage and approve company listings.")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] glass">
                  <SelectValue placeholder={String(t("adminFilterStatus") || "Filter by status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{String(t("adminAllCompanies") || "All Companies")}</SelectItem>
                  <SelectItem value="pending">{String(t("adminPending") || "Pending")}</SelectItem>
                  <SelectItem value="approved">{String(t("adminApproved") || "Approved")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Card className="mb-6 ultra-card">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={String(t("adminSearchCompanies") || "Search companies...")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass"
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder={String(t("adminSelectCategory") || "Select category")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{String(t("adminAllCategories") || "All Categories")}</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-48">
                  <Input
                    placeholder={String(t("adminSearchByCountry") || "Search by country")}
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="glass"
                  />
                </div>
                <div className="w-full md:w-48">
                  <Input
                    placeholder={String(t("adminSearchByCity") || "Search by city")}
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="glass"
                  />
                </div>
                {(searchQuery || countryFilter || cityFilter || categoryId !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setCountryFilter("");
                      setCityFilter("");
                      setCategoryId("all");
                    }}
                    className="whitespace-nowrap glass"
                  >
                    {String(t("adminClearFilters") || "Clear Filters")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow ultra-card p-6">
            <CardContent>
              <AdminCompaniesTable
                statusFilter={statusFilter}
                searchQuery={searchQuery}
                countryFilter={countryFilter}
                cityFilter={cityFilter}
                categoryId={categoryId}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminCompaniesPage() {
  return (
    <AdminRoute>
      <AdminCompaniesContent />
    </AdminRoute>
  );
}