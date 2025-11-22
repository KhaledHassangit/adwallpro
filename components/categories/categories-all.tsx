"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/providers/LanguageProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ArrowRight,
} from "@/components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/types";
import { LoadingSpinner } from "../common/loading-spinner";
import { useGetCategoriesQuery } from "@/features/categoriesApi";

export function CategoriesAll() {
  const { locale, t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Use RTK Query hook to fetch categories
  const { data: categoriesResponse, isLoading, error } = useGetCategoriesQuery();
  
  // Extract categories from the response
  const categories = categoriesResponse?.data?.data || [];

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;

    return categories.filter((cat) => {
      const name = locale === "ar" ? cat.nameAr : cat.nameEn;
      return name && name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [categories, searchQuery, locale]);

  // Add this function to handle clearing the search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Function to get the full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg";
    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) return imagePath;
    // Otherwise, prepend the base URL
    return `http://72.60.178.180:8000/${imagePath}`;
  };

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
              variant="outline"
              size="sm"
              asChild
              className="rounded-full hover:bg-primary-50 hover:border-primary-200"
            >
              <Link href="/categories">{t("allCategories")}</Link>
            </Button>
            {categories.slice(0, 8).map((cat) => {
              const name = locale === "ar" ? cat.nameAr : cat.nameEn;
              return (
                <Link key={cat.slug} href={`/companies/category/${cat._id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full hover:bg-primary-50 hover:border-primary-200"
                  >
                    {name || t("undefinedCategory")}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="space-y-6">
        {filteredCategories.length === 0 ? (
          <EmptyState
            title={t("noResultsFound")}
            description={t("noMatchingCategories")}
            action={{
              label: t("clearSearch"),
              onClick: handleClearSearch,  
            }}
          />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map((cat) => {
              const name = locale === "ar" ? cat.nameAr : cat.nameEn;

              return (
                <Link
                  key={cat.slug}
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
                          src={getImageUrl(cat.image)}
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
                        <p className="text-sm text-muted-foreground">
                          {t("discoverBestCompanies")} {name || t("undefinedCategory")}
                        </p>
                      </div>

                      {/* Button */}
                      <Button
                        asChild
                        className="w-full rounded-xl mt-auto"
                        style={{ backgroundColor: cat.color }}
                      >
                        <Link href={`/companies/category/${cat._id}`}>
                          <ArrowRight className="h-4 w-4 mr-2" />
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
          // List view remains unchanged
          <div className="space-y-4">
            {filteredCategories.map((cat) => {
              const name = locale === "ar" ? cat.nameAr : cat.nameEn;

              return (
                <Link
                  key={cat.slug}
                  href={`/companies/category/${cat._id}`}
                  className="block"
                >
                  <div className="ultra-card p-6 group cursor-pointer">
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={getImageUrl(cat.image)}
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
                      </div>

                      <Button
                        asChild
                        variant="outline"
                        className="rounded-xl group-hover:bg-primary-50 group-hover:border-primary-200 bg-transparent"
                      >
                        <Link href={`/companies/category/${cat._id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}