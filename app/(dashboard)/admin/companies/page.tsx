// src/app/admin/companies/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { Filter } from "@/components/ui/icon";
import { useI18n } from "@/providers/LanguageProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import AdminCompaniesTable from "@/components/admin/admin-companies-table";

// Main Content Component
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
                  <SelectItem value="rejected">{String(t("adminRejected") || "Rejected")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="mb-6 ultra-card">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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