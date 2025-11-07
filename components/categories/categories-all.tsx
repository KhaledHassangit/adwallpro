"use client";

import { useMemo, useState, useEffect } from "react";
import { useI18n } from "@/providers/lang-provider";
import { getMultipleCategoriesCount } from "@/lib/companies-api";
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
  Loader2,
} from "@/components/ui/icon";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import type { Category } from "@/types/types";

export function CategoriesAll() {
  const { locale, t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [companiesCount, setCompaniesCount] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("https://adwallpro.com/api/v1/categories");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      let categoriesData: Category[] = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      setCategories(categoriesData);

      const counts = await getMultipleCategoriesCount(
        categoriesData.map((c) => c.slug)
      );
      setCompaniesCount(counts);
    } catch (error) {
      setError(error instanceof Error ? error.message : "فشل في جلب التصنيفات");
      toast.error("فشل في جلب التصنيفات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;

    return categories.filter((cat) => {
      const name = locale === "ar" ? cat.nameAr : cat.nameEn;
      return name && name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [categories, searchQuery, locale]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل التصنيفات...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="rounded-full bg-red-50 p-4 mb-4 mx-auto w-fit">
            <Search className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold">خطأ في التحميل</h3>
          <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
          <Button onClick={fetchCategories} className="rounded-xl">
            إعادة المحاولة
          </Button>
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
              const count = companiesCount[cat.slug] || 0;
              return (
                <Link key={cat.slug} href={`/companies/category/${cat._id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full hover:bg-primary-50 hover:border-primary-200"
                  >
                    {name || t("undefinedCategory")} ({count})
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
            title={t("noResults")}
            description={t("noMatchingCategories")}
            action={{
              label: t("clearSearch"),
              href: "#",
            }}
          />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map((cat) => {
              const name = locale === "ar" ? cat.nameAr : cat.nameEn;
              const adsCount = companiesCount[cat.slug] || 0;
              const vipCount = companies.filter(
                (company) => company.category === cat.slug && company.isVip
              ).length;

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
                          src={cat.image || "/placeholder.svg"}
                          alt={name || "تصنيف غير محدد"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {/* VIP Badge */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          {vipCount > 0 && (
                            <Badge className="bg-amber-500 text-white border-0 text-xs">
                              {vipCount} VIP
                            </Badge>
                          )}
                        </div>
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
              const adsCount = companiesCount[cat.slug] || 0;
              const vipCount = companies.filter(
                (company) => company.category === cat.slug && company.isVip
              ).length;

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
                          src={cat.image || "/placeholder.svg"}
                          alt={name || "تصنيف غير محدد"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
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

                        <div className="flex items-center gap-4">
                          <Badge
                            variant="secondary"
                            className="rounded-full text-xs"
                          >
                            {adsCount} {t("company")}
                          </Badge>
                          {vipCount > 0 && (
                            <Badge className="bg-amber-100 text-amber-700 border-0 rounded-full text-xs">
                              {vipCount} VIP
                            </Badge>
                          )}
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
