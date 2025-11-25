// src/components/admin/admin-companies-table.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Filter, AlertCircle, Search, Loader2, MoreHorizontal, Check, Eye, Trash2 } from "@/components/ui/icon";
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
import { CompanyDetailsDialog } from "@/components/admin/company-details-dialog";
import { PaginationControl } from "@/components/ui/pagination-control";
import { useGetCompaniesQuery, useApproveCompanyMutation, useDeleteCompanyMutation } from "@/features/companiesApi";

// دالة لتنظيف رابط الصورة المكرر
const cleanImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return "";

  // Handle different URL patterns that might appear in your API
  // Based on your API response, the logoUrl field already contains the full URL
  return imageUrl;
};

// Component for handling image loading with proper error handling
const CompanyLogo = ({ src, alt, className }: { src?: string; alt: string; className?: string }) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Instead of setting to empty string, use a placeholder or fallback
      // You could use a default image URL here if you have one
      setImgSrc(undefined);
    }
  };

  if (hasError || !imgSrc) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <Building2 className="h-6 w-6 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

// ConfirmationModal Component
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

// Companies Table Component
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
  const { t, lang } = useI18n();
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
    keyword: searchQuery || undefined,
    country: countryFilter || undefined,
    city: cityFilter || undefined,
    categoryId: categoryId === "all" ? undefined : categoryId,
  });

  // Use the mutation hooks for approve and delete
  const [approveCompany, { isLoading: isApproving }] = useApproveCompanyMutation();
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();

  // Extract companies and pagination info from response
  const companies = response?.data?.data || [];
  const totalResults = response?.results || 0;
  const totalPages = Math.ceil(totalResults / 10);

  // Modal states
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

  // Company details dialog state - store the full company object
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // Handle approve with mutation
  const handleApprove = async () => {
    try {
      await approveCompany({ id: approveModal.companyId, isApproved: true }).unwrap();
      notifications.success(String(t("adminCompanyApprovedSuccess") || "Company approved successfully."), {
        title: String(t("adminSuccess") || "Success"),
      });
      setApproveModal({ isOpen: false, companyId: "", companyName: "" });
    } catch (err) {
      notifications.error(String(t("adminCompanyApproveError") || "Failed to approve company."), {
        title: String(t("adminError") || "Error"),
      });
    }
  };

  // Handle delete with mutation
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

  // Handle view details - pass the full company object
  const handleViewDetails = (company: any) => {
    setSelectedCompany(company);
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
        {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {/* الجدول للشاشات الكبيرة */}
      <div className="hidden lg:block">
        <Card className="ultra-card border p-6">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">{String(t("adminCompanyImage") || "Image")}</TableHead>
                  <TableHead className="text-center">{String(t("adminCompanyName") || "Company Name")}</TableHead>
                  <TableHead className="text-center">{String(t("adminCompanyCategory") || "Category")}</TableHead>
                  <TableHead className="text-center">{String(t("adminCompanyLocation") || "Location")}</TableHead>
                  <TableHead className="text-center">{String(t("adminCompanyOwner") || "Owner")}</TableHead>
                  <TableHead className="text-center">{String(t("adminCompanyStatus") || "Status")}</TableHead>
                  <TableHead className="text-center">{String(t("adminCompanyRegistrationDate") || "Registration Date")}</TableHead>
                  <TableHead className="text-center">{String(t("adminActions") || "Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.length ? (
                  companies.map((company: any) => (
                    <TableRow key={company._id}>
                      <TableCell className="text-center">
                        <CompanyLogo
                          src={company.logoUrl}
                          alt={company.companyName}
                          className="w-12 h-12 rounded-lg object-cover mx-auto"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        <div>
                          <div>{company.companyName}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={company.description}>
                            {company.description || "-"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div>
                          <div>{company.categoryId?.nameAr || "-"}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div>
                          <div>{company.city}</div>
                          <div className="text-xs text-muted-foreground">{company.country}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div>
                          <div>{company.userId?.name || "-"}</div>
                          <div className="text-xs text-muted-foreground">{company.userId?.email || "-"}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(company.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(company.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          {/* زر الموافقة للشركات المعلقة */}
                          {company.status !== "approved" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setApproveModal({
                                  isOpen: true,
                                  companyId: company._id,
                                  companyName: company.companyName,
                                })
                              }
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(company)}
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                companyId: company._id,
                                companyName: company.companyName,
                              })
                            }
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
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      {String(t("adminNoCompaniesFound") || "No companies found")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination Control */}
            <PaginationControl
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* عرض الكروت للشاشات الصغيرة */}
      <div className="lg:hidden space-y-4">
        {companies.length ? (
          companies.map((company: any) => (
            <Card key={company._id} className="ultra-card border p-4">
              <div className="space-y-3">
                {/* الصورة واسم الشركة والحالة */}
                <div className="flex items-start gap-3">
                  {/* صورة الشركة */}
                  <div className="flex-shrink-0">
                    <CompanyLogo
                      src={company.logoUrl}
                      alt={company.companyName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>

                  {/* اسم الشركة والحالة */}
                  <div className="flex-1 flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{company.companyName}</h4>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]" title={company.description}>
                        {company.description || "-"}
                      </p>
                      <p className="text-xs text-muted-foreground">{company.categoryId?.nameAr || "-"}</p>
                    </div>
                    {getStatusBadge(company.status)}
                  </div>
                </div>

                {/* المعلومات */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">{String(t("adminCity") || "City")}: </span>
                    <span>{company.city}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{String(t("adminCountry") || "Country")}: </span>
                    <span>{company.country}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{String(t("adminOwner") || "Owner")}: </span>
                    <span>{company.userId?.name || "-"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{String(t("adminRegistrationDate") || "Registration Date")}: </span>
                    <span>{new Date(company.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</span>
                  </div>
                </div>

                {/* الأزرار */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    {/* زر الموافقة للشركات المعلقة */}
                    {company.status !== "approved" && (
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
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(company)}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          companyId: company._id,
                          companyName: company.companyName,
                        })
                      }
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="ultra-card border p-6">
            <div className="text-center text-muted-foreground py-8">
              {String(t("adminNoCompaniesFound") || "No companies found")}
            </div>
          </Card>
        )}
      </div>

      {/* Company Details Dialog */}
      <CompanyDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        company={selectedCompany}
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

export default AdminCompaniesTable;
