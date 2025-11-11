"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/providers/LanguageProvider";
import {
  Check,
  X,
  Eye,
  MoreHorizontal,
  Trash2,
  Search,
} from "@/components/ui/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { CompanyDetailsDialog } from "@/components/admin/company-details-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// دالة لتنظيف رابط الصورة المكرر
const cleanImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return "";
  return imageUrl.replace(
    /^https:\/\/adwallpro\.com\/brands\/https:\/\/adwallpro\.com\/brands\//,
    "https://adwallpro.com/brands/"
  );
};

interface Company {
  _id: string;
  companyName: string;
  category: {
    nameAr: string;
    nameEn: string;
  };
  country: string;
  city: string;
  email: string;
  whatsapp?: string;
  image?: string;
  isApproved: boolean;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface AdminCompaniesTableProps {
  statusFilter: string;
  searchQuery?: string;
  countryFilter?: string;
  cityFilter?: string;
  onRefresh?: () => void;
}

export function AdminCompaniesTable({
  statusFilter,
  searchQuery = "",
  countryFilter = "",
  cityFilter = "",
  onRefresh,
}: AdminCompaniesTableProps) {
  const { t } = useI18n();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      let url = `https://adwallpro.com/api/v1/companies?page=${page}&limit=10`;

      if (statusFilter === "pending") {
        url = `https://adwallpro.com/api/v1/companies/pending`;
      } else if (statusFilter === "approved") {
        url += "&isApproved=true";
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch companies");

      const data = await response.json();
      setCompanies(data.data.companies || data.data);
      if (data.totalPages) setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error(t("fetchCompaniesFailed"));
    } finally {
      setLoading(false);
    }
  };

  const approveCompany = async (companyId: string) => {
    const company = companies.find((c) => c._id === companyId);
    if (
      !confirm(`هل أنت متأكد من الموافقة على شركة "${company?.companyName}"؟`)
    )
      return;

    try {
      const response = await fetch(
        `https://adwallpro.com/api/v1/companies/${companyId}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isApproved: true }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        const errorMessage =
          errorData.message || errorData.error || t("approveCompanyFailed");
        throw new Error(errorMessage);
      }

      toast.success(t("companyApproved"));
      fetchCompanies();
      onRefresh?.();
    } catch (error) {
      console.error("Error approving company:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("approveCompanyFailed");
      toast.error(errorMessage);
    }
  };

  const rejectCompany = async (companyId: string) => {
    const company = companies.find((c) => c._id === companyId);
    const action =
      company?.isApproved === true ? t("unapproveAction") : t("rejectAction");
    const actionDescription =
      company?.isApproved === true ? t("willBePending") : t("willStayPending");
    const message = `${t("confirmActionMessage")
      .replace("{action}", action)
      .replace(
        "{companyName}",
        company?.companyName || ""
      )}\n${actionDescription}`;

    if (!confirm(message)) return;

    try {
      const response = await fetch(
        `https://adwallpro.com/api/v1/companies/${companyId}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isApproved: false }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        const errorMessage =
          errorData.message || errorData.error || t("rejectCompanyFailed");
        throw new Error(errorMessage);
      }

      const company = companies.find((c) => c._id === companyId);
      const successMessage =
        company?.isApproved === true
          ? t("unapprovedSuccessfully")
          : t("rejectedSuccessfully");
      toast.success(successMessage);
      fetchCompanies();
      onRefresh?.();
    } catch (error) {
      console.error("Error rejecting company:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("rejectCompanyFailed");
      toast.error(errorMessage);
    }
  };

  const deleteCompany = async (companyId: string) => {
    if (
      !confirm(
        "هل أنت متأكد من حذف هذه الشركة؟ هذا الإجراء لا يمكن التراجع عنه."
      )
    )
      return;

    try {
      const response = await fetch(
        `https://adwallpro.com/api/v1/companies/deletebyadmin/${companyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        const errorMessage =
          errorData.message || errorData.error || "فشل في حذف الشركة";
        throw new Error(errorMessage);
      }

      toast.success("تم حذف الشركة بنجاح");
      fetchCompanies();
      onRefresh?.();
    } catch (error) {
      console.error("Error deleting company:", error);
      const errorMessage =
        error instanceof Error ? error.message : "فشل في حذف الشركة";
      toast.error(errorMessage);
    }
  };

  const handleViewDetails = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setDetailsDialogOpen(true);
  };

  // تطبيق الفلاتر على الشركات
  useEffect(() => {
    let filtered = companies;

    // فلتر البحث في اسم الشركة
    if (searchQuery.trim()) {
      filtered = filtered.filter((company) =>
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // فلتر الدولة
    if (countryFilter.trim()) {
      filtered = filtered.filter((company) =>
        company.country.toLowerCase().includes(countryFilter.toLowerCase())
      );
    }

    // فلتر المدينة
    if (cityFilter.trim()) {
      filtered = filtered.filter((company) =>
        company.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    setFilteredCompanies(filtered);
  }, [companies, searchQuery, countryFilter, cityFilter]);

  useEffect(() => {
    fetchCompanies();
  }, [page, statusFilter]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved === true) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          ✓ موافق عليها
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 border-yellow-200"
        >
          ⏳ معلقة
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* عنوان الجدول */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold gradient-text">
          الشركات ({filteredCompanies.length} من {companies.length})
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
                    الصورة
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    اسم الشركة
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    الفئة
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    المدينة
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    صاحب الشركة
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    الحالة
                  </TableHead>
                  <TableHead className="font-semibold text-primary">
                    تاريخ التقديم
                  </TableHead>
                  <TableHead className="font-semibold text-primary text-center">
                    الإجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {companies.length === 0
                            ? "لا توجد شركات"
                            : "لم يتم العثور على شركات تطابق معايير البحث"}
                        </p>
                        {(searchQuery || countryFilter || cityFilter) && (
                          <p className="text-sm text-muted-foreground">
                            جرب تعديل معايير البحث أو مسح الفلاتر
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company, index) => (
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
                        {company.image ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/50 hover:scale-105 transition-transform duration-200 cursor-pointer group">
                            <Image
                              src={cleanImageUrl(company.image)}
                              alt={company.companyName || "صورة الشركة"}
                              fill
                              className="object-cover"
                              onClick={() =>
                                window.open(
                                  cleanImageUrl(company.image),
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
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-border/50 ${company.image ? "hidden" : "flex"
                            }`}
                        >
                          <div className="text-lg opacity-40">🏢</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {company.companyName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {company.category?.nameAr || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {company.city}, {company.country}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {company.user?.name || "-"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(company.isApproved)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(company.createdAt).toLocaleDateString(
                          "ar-SA"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          {/* أزرار الموافقة والرفض للشركات المعلقة */}
                          {company.isApproved === false && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50 h-8 w-8 p-0"
                                onClick={() => approveCompany(company._id)}
                                title="موافقة على الشركة"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                onClick={() => rejectCompany(company._id)}
                                title="إبقاء الشركة معلقة"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}

                          {/* زر إلغاء الموافقة للشركات الموافق عليها */}
                          {company.isApproved === true && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-orange-600 border-orange-600 hover:bg-orange-50 h-8 w-8 p-0"
                              onClick={() => rejectCompany(company._id)}
                              title="إلغاء الموافقة (تحويل إلى معلقة)"
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
                                عرض التفاصيل
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteCompany(company._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                حذف
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
        {filteredCompanies.length === 0 ? (
          <Card className="ultra-card border-0">
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <Search className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium text-muted-foreground">
                    {companies.length === 0
                      ? "لا توجد شركات"
                      : "لم يتم العثور على شركات تطابق معايير البحث"}
                  </p>
                  {(searchQuery || countryFilter || cityFilter) && (
                    <p className="text-sm text-muted-foreground mt-2">
                      جرب تعديل معايير البحث أو مسح الفلاتر
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredCompanies.map((company) => (
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
                      {company.image ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/50 hover:scale-105 transition-transform duration-200 cursor-pointer group">
                          <Image
                            src={cleanImageUrl(company.image)}
                            alt={company.companyName || "صورة الشركة"}
                            fill
                            className="object-cover"
                            onClick={() =>
                              window.open(
                                cleanImageUrl(company.image),
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
                        className={`w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-border/50 ${company.image ? "hidden" : "flex"
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
                          {company.category?.nameAr || "-"}
                        </p>
                      </div>
                      {getStatusBadge(company.isApproved)}
                    </div>
                  </div>

                  {/* المعلومات */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">المدينة: </span>
                      <span className="text-foreground">
                        {company.city}, {company.country}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        صاحب الشركة:{" "}
                      </span>
                      <span className="text-foreground">
                        {company.user?.name || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      تاريخ التقديم:{" "}
                    </span>
                    <span className="text-foreground">
                      {new Date(company.createdAt).toLocaleDateString("ar-SA")}
                    </span>
                  </div>

                  {/* الأزرار */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      {/* أزرار الموافقة والرفض للشركات المعلقة */}
                      {company.isApproved === false && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => approveCompany(company._id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            موافقة
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => rejectCompany(company._id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            رفض
                          </Button>
                        </>
                      )}

                      {/* زر إلغاء الموافقة للشركات الموافق عليها */}
                      {company.isApproved === true && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          onClick={() => rejectCompany(company._id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          إلغاء الموافقة
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
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteCompany(company._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          حذف
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
      <Card className="ultra-card border-0">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              السابق
            </Button>
            <span className="text-sm text-muted-foreground bg-primary/5 px-3 py-1 rounded-full">
              صفحة {page} من {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              التالي
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Company Details Dialog */}
      <CompanyDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        companyId={selectedCompanyId}
      />
    </div>
  );
}
