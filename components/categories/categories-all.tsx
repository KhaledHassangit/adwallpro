"use client";

import { useMemo, useState, useEffect } from "react";
import { useI18n } from "@/providers/LanguageProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "@/components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import { LoadingSpinner } from "../common/loading-spinner";
import { useGetCategoriesQuery } from "@/features/categoriesApi";
import { ArrowLeft } from "lucide-react";
import { PaginationControl } from "../ui/pagination-control";
import { Category } from "@/types/types";

export function CategoriesAll() {
  const { locale, t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const itemsPerPage = 16; 
  
  const { data: categoriesResponse, isLoading, error, isFetching } = useGetCategoriesQuery({
    page: currentPage,
    limit: itemsPerPage,
    keyword: searchKeyword,
    category: selectedCategory
  });
  
  const { categories, pagination } = useMemo(() => {
    if (!categoriesResponse?.data) return { categories: [], pagination: null };
    
    const categoriesArray = categoriesResponse.data.data || [];
    
    const paginationInfo = categoriesResponse.data.paginationResult || null;
    
    return {
      categories: categoriesArray,
      pagination: paginationInfo
    };
  }, [categoriesResponse]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery !== searchKeyword) {
        setSearchKeyword(searchQuery);
        setCurrentPage(1); 
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchKeyword]);

  // Function to handle clearing search
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to handle category filter selection
  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSearchKeyword("");
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  // Determine which arrow icon to use based on locale
  const ArrowIcon = locale === "ar" ? ArrowLeft : ArrowRight;
  const PrevPageIcon = locale === "ar" ? ChevronRight : ChevronLeft;
  const NextPageIcon = locale === "ar" ? ChevronLeft : ChevronRight;

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner/>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="rounded-full bg-red-50 p-4 mb-4 mx-auto w-fit">
            <Search className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-muted-foreground mb-6 max-w-md">
            {error instanceof Error ? error.message : "فشل في جلب التصنيفات"}
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="ultra-card p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchCategories")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl"
            >
              <Filter className="h-4 w-4 mr-2" />
              {t("filters")}
            </Button>

            <div className="flex items-center rounded-xl border p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-lg"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-lg"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter(null)}
              className="rounded-full hover:bg-primary-50 hover:border-primary-200"
            >
              {t("allCategories")}
            </Button>
            {categories.slice(0, 8).map((cat) => {
              const name = locale === "ar" ? cat.nameAr : cat.nameEn;
              return (
                <Button
                  key={cat._id}
                  variant={selectedCategory === cat._id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilter(cat._id)}
                  className="rounded-full hover:bg-primary-50 hover:border-primary-200"
                >
                  {name || t("undefinedCategory")}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="space-y-6">
        {categories.length === 0 ? (
          <EmptyState
            title={t("noResultsFound")}
            description={t("noMatchingCategories")}
            action={{
              label: t("clearFilters"),
              onClick: clearAllFilters,  
            }}
          />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const name = locale === "ar" ? cat.nameAr : cat.nameEn;
              const description = locale === "ar" ? cat.descriptionAr : cat.descriptionEn;
              // Use imageUrl if available, otherwise construct it from image path
              const imageUrl = cat.imageUrl || (cat.image ? `https://www.adwallpro.com/uploads/categories/${cat.image}` : "/placeholder.svg");

              return (
                <Link
                  key={cat._id}
                  href={`/companies/category/${cat._id}`}
                  className="block"
                >
                  <div className="ultra-card group cursor-pointer overflow-hidden h-full flex flex-col transition-transform duration-300 hover:-translate-y-3 hover:shadow-lg">
                    {/* Color Bar */}
                    <div
                      className="h-2 w-full"
                      style={{
                        background: `linear-gradient(90deg, ${cat.color} 0%, ${cat.color}80 100%)`,
                      }}
                    />

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                      {/* Image */}
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={name || "تصنيف غير محدد"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>

                      {/* Info */}
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors">
                          {name || "تصنيف غير محدد"}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {description || t("discoverBestCompanies")} {name || t("undefinedCategory")}
                        </p>
                      </div>

                      {/* Button */}
                      <Button
                        asChild
                        className="w-full rounded-xl mt-auto"
                        style={{ backgroundColor: cat.color }}
                      >
                        <Link href={`/companies/category/${cat._id}`}>
                          <ArrowIcon className="h-4 w-4 mr-2" />
                          {t("exploreCompanies")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          // List view
          <div className="space-y-4">
            {categories.map((cat) => {
              const name = locale === "ar" ? cat.nameAr : cat.nameEn;
              const description = locale === "ar" ? cat.descriptionAr : cat.descriptionEn;
              // Use imageUrl if available, otherwise construct it from image path
              const imageUrl = cat.imageUrl || (cat.image ? `https://www.adwallpro.com/uploads/categories/${cat.image}` : "/placeholder.svg");

              return (
                <Link
                  key={cat._id}
                  href={`/companies/category/${cat._id}`}
                  className="block"
                >
                  <div className="ultra-card p-6 group cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt={name || "تصنيف غير محدد"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-3 w-8 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors">
                            {name || t("undefinedCategory")}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {description || t("discoverBestCompanies")} {name || t("undefinedCategory")}
                        </p>
                      </div>

                      <Button
                        asChild
                        variant="outline"
                        className="rounded-xl group-hover:bg-primary-50 group-hover:border-primary-200 bg-transparent"
                      >
                        <Link href={`/companies/category/${cat._id}`}>
                          <ArrowIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination - Using PaginationControl component */}
        {pagination && pagination.numberOfPages > 1 && (
          <PaginationControl
            currentPage={currentPage}
            totalPages={pagination.numberOfPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
