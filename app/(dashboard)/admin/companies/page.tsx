"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { Building2, Filter, AlertCircle, Search, Loader2, ChevronLeft, ChevronRight, MoreHorizontal } from "@/components/ui/icon";
import { useI18n } from "@/providers/lang-provider";
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

interface Company {
  _id: string;
  userId: string;
  companyName: string;
  categoryId: string;
  description: string;
  image: string;
  country: string;
  city: string;
  email: string;
  whatsapp: string;
  facebook: string;
  website: string;
  isApproved: boolean;
  createdAt: string;
}

interface CompaniesResponse {
  results: number;
  paginationResult: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: Company[];
}

// Custom hook for fetching companies
function useCompanies(
  statusFilter: string,
  searchQuery: string,
  countryFilter: string,
  cityFilter: string,
  categoryId: string,
  currentPage: number,
  refreshKey: number
) {
  const {t} = useI18n();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    numberOfPages: 1,
    totalResults: 0,
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `http://72.60.178.180:8000/api/v1/companies/?page=${currentPage}&limit=10`;
        
        // Add status filter
        if (statusFilter === "approved") {
          url += `&isApproved=true`;
        } else if (statusFilter === "pending") {
          url += `&isApproved=false`;
        }
        
        // Add search query
        if (searchQuery) {
          url = `http://72.60.178.180:8000/api/v1/companies/search?name=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=10`;
          if (statusFilter === "approved") {
            url += `&isApproved=true`;
          } else if (statusFilter === "pending") {
            url += `&isApproved=false`;
          }
        }
        
        // Add category filter
        if (categoryId && categoryId !== "all") {
          url = `http://72.60.178.180:8000/api/v1/companies/category/${categoryId}?page=${currentPage}&limit=10`;
          if (statusFilter === "approved") {
            url += `&isApproved=true`;
          } else if (statusFilter === "pending") {
            url += `&isApproved=false`;
          }
        }
        
        // Add location filters
        if (countryFilter || cityFilter) {
          if (categoryId && categoryId !== "all") {
            url = `http://72.60.178.180:8000/api/v1/companies/category/${categoryId}/search-location?page=${currentPage}&limit=10&`;
          } else {
            url = `http://72.60.178.180:8000/api/v1/companies/search-location?page=${currentPage}&limit=10&`;
          }
          
          if (countryFilter) {
            url += `country=${encodeURIComponent(countryFilter)}`;
          }
          
          if (cityFilter) {
            url += `${countryFilter ? '&' : ''}city=${encodeURIComponent(cityFilter)}`;
          }
          
          if (statusFilter === "approved") {
            url += `${countryFilter || cityFilter ? '&' : ''}isApproved=true`;
          } else if (statusFilter === "pending") {
            url += `${countryFilter || cityFilter ? '&' : ''}isApproved=false`;
          }
        }

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data: CompaniesResponse = await response.json();
        setCompanies(data.data);
        setPagination({
          currentPage: data.paginationResult.currentPage,
          limit: data.paginationResult.limit,
          numberOfPages: data.paginationResult.numberOfPages,
          totalResults: data.results,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : t("adminCompaniesFetchError"));
        toast({
          title: t("adminError"),
          description: t("adminCompaniesFetchErrorDesc"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [statusFilter, searchQuery, countryFilter, cityFilter, categoryId, currentPage, refreshKey]);

  return { companies, loading, error, pagination };
}

// Updated Pagination Component with Premium Design
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
        {`${t("adminPageOf")} ${currentPage} / ${totalPages}`}
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

// Companies Table Component
function AdminCompaniesTable({
  statusFilter,
  searchQuery,
  countryFilter,
  cityFilter,
  categoryId,
  currentPage,
  onPageChange,
  onRefresh,
}: {
  statusFilter: string;
  searchQuery: string;
  countryFilter: string;
  cityFilter: string;
  categoryId: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}) {
  const { t } = useI18n();
  const { companies, loading, error, pagination } = useCompanies(
    statusFilter,
    searchQuery,
    countryFilter,
    cityFilter,
    categoryId,
    currentPage,
    0 // We'll use a separate refresh mechanism
  );

  const handleApprove = async (companyId: string) => {
    try {
      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/companies/${companyId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast({
        title: t("adminSuccess"),
        description: t("adminCompanyApprovedSuccess"),
      });
      onRefresh();
    } catch (err) {
      toast({
        title: t("adminError"),
        description: t("adminCompanyApproveError"),
        variant: "destructive",
      });
    }
  };

  const handleReject = async (companyId: string) => {
    try {
      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/companies/${companyId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast({
        title: t("adminSuccess"),
        description: t("adminCompanyRejectedSuccess"),
      });
      onRefresh();
    } catch (err) {
      toast({
        title: t("adminError"),
        description: t("adminCompanyRejectError"),
        variant: "destructive",
      });
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={onRefresh} className="mt-4">
          {t("adminTryAgain")}
        </Button>
      </div>
    );
  }

  if (companies.length === 0 && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("adminNoCompaniesFound")}</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("adminCompanyName")}</TableHead>
            <TableHead>{t("adminCompanyContact")}</TableHead>
            <TableHead>{t("adminCompanyLocation")}</TableHead>
            <TableHead>{t("adminCompanyStatus")}</TableHead>
            <TableHead>{t("adminActions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={company.image} alt={company.companyName} />
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
                      {t("adminWhatsApp")}: {company.whatsapp}
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
                  variant={company.isApproved ? "default" : "secondary"}
                  className={
                    company.isApproved
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                  }
                >
                  {company.isApproved ? t("adminApproved") : t("adminPending")}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {!company.isApproved && (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(company._id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {t("adminApprove")}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(company._id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    {t("adminReject")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {loading && currentPage > 1 && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      
      {pagination.numberOfPages > 1 && (
        <div className="mt-4 border-t pt-4">
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.numberOfPages}
            onPageChange={onPageChange}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}

function AdminCompaniesContent() {
  const { t } = useI18n();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [refreshKey, setRefreshKey] = useState(0);
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
    { _id: "68d42f4af6fb8fa5ecf83f7b", name: t("adminCategoryTechnology") },
    { _id: "68e7fa45e16ebc3c6051ea28", name: t("adminCategoryFoodBeverage") },
    { _id: "68ef6e7dfa1c956169576d15", name: t("adminCategoryMarketing") },
    { _id: "68d03813f6fb8fa5ecf83b8f", name: t("adminCategoryServices") },
    { _id: "68e7f9eee16ebc3c6051ea21", name: t("adminCategoryOther") },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-premium pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  {t("adminCompaniesManagement")}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {t("adminCompaniesManagementDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] glass">
                  <SelectValue placeholder={t("adminFilterStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("adminAllCompanies")}</SelectItem>
                  <SelectItem value="pending">{t("adminPending")}</SelectItem>
                  <SelectItem value="approved">{t("adminApproved")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6 ultra-card">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* General Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("adminSearchCompanies")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass"
                  />
                </div>

                {/* Category Filter */}
                <div className="w-full md:w-48">
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="glass">
                      <SelectValue placeholder={t("adminSelectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("adminAllCategories")}</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Country Filter */}
                <div className="w-full md:w-48">
                  <Input
                    placeholder={t("adminSearchByCountry")}
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="glass"
                  />
                </div>

                {/* City Filter */}
                <div className="w-full md:w-48">
                  <Input
                    placeholder={t("adminSearchByCity")}
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="glass"
                  />
                </div>

                {/* Clear Filters Button */}
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
                    {t("adminClearFilters")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Companies Table */}
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
                onRefresh={() => setRefreshKey((prev) => prev + 1)}
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