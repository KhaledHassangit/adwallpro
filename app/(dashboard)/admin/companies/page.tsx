"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { Building2, Filter, AlertCircle, Search, Loader2, ChevronLeft, ChevronRight, MoreHorizontal } from "@/components/ui/icon";
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
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Import the new RTK Query hooks and types
import { useGetCompaniesQuery, useApproveCompanyMutation, useDeleteCompanyMutation, type Company } from "@/features/companiesApi";

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

  // Handle approve with the mutation
  const handleApprove = async () => {
    try {
      await approveCompany(approveModal.companyId).unwrap();
      toast({
        title: String(t("adminSuccess") || "Success"),
        description: String(t("adminCompanyApprovedSuccess") || "Company approved successfully."),
      });
      setApproveModal({ isOpen: false, companyId: "", companyName: "" });
      // No need for onRefresh, invalidatesTags handles refetching
    } catch (err) {
      toast({
        title: String(t("adminError") || "Error"),
        description: String(t("adminCompanyApproveError") || "Failed to approve company."),
        variant: "destructive",
      });
    }
  };

  // Handle delete with the mutation
  const handleDelete = async () => {
    try {
      await deleteCompany(deleteModal.companyId).unwrap();
      toast({
        title: String(t("adminSuccess") || "Success"),
        description: String(t("adminCompanyDeletedSuccess") || "Company deleted successfully."),
      });
      setDeleteModal({ isOpen: false, companyId: "", companyName: "" });
    } catch (err) {
      toast({
        title: String(t("adminError") || "Error"),
        description: String(t("adminCompanyDeleteError") || "Failed to delete company."),
        variant: "destructive",
      });
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
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{String(t("adminCompanyName") || "Company Name")}</TableHead>
            <TableHead>{String(t("adminCompanyContact") || "Contact")}</TableHead>
            <TableHead>{String(t("adminCompanyLocation") || "Location")}</TableHead>
            <TableHead>{String(t("adminCompanyStatus") || "Status")}</TableHead>
            <TableHead>{String(t("adminActions") || "Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={company.logo} alt={company.companyName} />
                    <AvatarFallback>
                      {company.companyName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{company.companyName}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {company.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm">{company.email}</div>
                  {company.whatsapp && (
                    <div className="text-sm text-muted-foreground">
                      {String(t("adminWhatsApp") || "WhatsApp")}: {company.whatsapp}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm">{company.country}</div>
                  <div className="text-sm text-muted-foreground">{company.city}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={company.status === "approved" ? "default" : "secondary"}
                  className={
                    company.status === "approved"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                  }
                >
                  {company.status === "approved"
                    ? String(t("adminApproved") || "Approved")
                    : String(t("adminPending") || "Pending")}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {company.status !== "approved" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        setApproveModal({
                          isOpen: true,
                          companyId: company._id,
                          companyName: company.companyName,
                        })
                      }
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isApproving}
                    >
                      {String(t("adminApprove") || "Approve")}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        companyId: company._id,
                        companyName: company.companyName,
                      })
                    }
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    disabled={isDeleting}
                  >
                    {String(t("adminDelete") || "Delete")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isFetching && currentPage > 1 && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 border-t pt-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            loading={isFetching}
          />
        </div>
      )}

      {/* Modals (no change to structure, just ensure text is cast to string) */}
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