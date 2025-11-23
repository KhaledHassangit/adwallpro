"use client";

import { useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Grid3X3,
  X,
  Facebook,
  Search,
} from "@/components/ui/icon";
import { useAuthStore, useUserStore } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { useGetCompaniesQuery, useGetCategoryQuery, useTrackCompanyViewMutation } from "@/features/companiesApi";

// View tracking hook
export const useViewTracker = () => {
  const [trackedViews, setTrackedViews] = useState<Set<string>>(new Set());
  const [trackCompanyView] = useTrackCompanyViewMutation();

  const trackView = useCallback(async (companyId: string, type: 'click' | 'hover' = 'click') => {
    // Create a unique key for this company and tracking type
    const key = `company_${type}_${companyId}`;
    
    // Check if already tracked in this session
    if (sessionStorage.getItem(key)) {
      return false;
    }

    try {
      // Use the RTK Query mutation to track the view
      const result = await trackCompanyView({ companyId, type }).unwrap();
      
      if (result) {
        // Mark as tracked in this session
        sessionStorage.setItem(key, 'true');
        setTrackedViews(prev => new Set(prev).add(key));
        console.log(`View tracked for company ${companyId} (${type})`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error tracking view:', error);
      return false;
    }
  }, [trackCompanyView]);

  return { trackView, trackedViews };
};

// Company Card Component
function CompanyCard({ company }: { company: any }) {
  const { t } = useI18n();
  const { trackView } = useViewTracker();
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle card hover
  const handleCardHover = () => {
    // Clear any existing timer
    if (hoverTimer) clearTimeout(hoverTimer);
    
    // Set a new timer to track view after 1 second of hovering
    const timer = setTimeout(() => {
      trackView(company._id, 'hover');
    }, 1000);
    
    setHoverTimer(timer);
  };

  // Handle card leave
  const handleCardLeave = () => {
    // Clear hover timer if user leaves before 1 second
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  };

  // Handle card click
  const handleCardClick = () => {
    trackView(company._id, 'click');
  };

  // Handle contact link click
  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackView(company._id, 'click');
    // Allow default behavior (navigation) to continue
  };

  // Function to get the correct image URL
  const getImageUrl = useCallback(() => {
    // Try multiple possible image properties
    const imageUrl = company.imageUrl || company.logo || company.image;
    
    if (!imageUrl) return null;
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith("http")) return imageUrl;
    
    // Otherwise, prepend the base URL
    return `https://www.adwallpro.com/uploads/categories/${imageUrl}`;
  }, []);

  const imageUrl = getImageUrl();

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);

  return (
    <Card 
      className="ultra-card group overflow-hidden border-0 cursor-pointer"
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}
    >
      {/* Color bar at the top */}
      <div className="h-[3px] w-full bg-gradient-to-r from-primary to-primary/80" />

      <CardContent className="p-0">
        <div className="company-image-container">
          {/* Company logo or placeholder */}
          {company?.imageUrl && !imageError ? (
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={company.imageUrl}
                alt={company.companyName || "Company Image"}
                fill
                className="company-image"
                onLoad={handleImageLoad}
                onError={handleImageError}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
              />
            </div>
          ) : null}

          {/* Placeholder - shown if no image or if image fails to load */}
          <div
            className={`image-placeholder ${
              imageUrl && !imageError ? "hidden" : "flex"
            }`}
          >
            <div className="text-6xl opacity-20">🏢</div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />

          {/* Company info at the bottom */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 text-foreground shadow-sm backdrop-blur-sm">
            <Link
              href={`/companies/${company._id}`}
              className="font-semibold truncate hover:text-primary transition-colors cursor-pointer"
              onClick={handleCardClick}
            >
              {company.companyName || "Unnamed Company"}
            </Link>
            <div className="flex items-center gap-2">
              {company.status === "approved" && (
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  ✓
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{company.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional information */}
        <div className="p-4 space-y-3">
          {/* Description */}
          {company.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {company.description}
            </p>
          )}

          {/* Contact information */}
          <div className="flex flex-wrap gap-2">
            {company.whatsapp && (
              <a
                href={`https://wa.me/${company.whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full hover:bg-green-100 transition-colors cursor-pointer"
                onClick={handleContactClick}
              >
                <Phone className="h-3 w-3" />
                <span>{t("whatsappLabel")}</span>
              </a>
            )}

            {company.email && (
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                onClick={handleContactClick}
              >
                <Mail className="h-3 w-3" />
                <span>{t("emailLabel")}</span>
              </a>
            )}

            {company.website && (
              <a
                href={
                  company.website.startsWith("http")
                    ? company.website
                    : `https://${company.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full hover:bg-purple-100 transition-colors cursor-pointer"
                onClick={handleContactClick}
              >
                <Globe className="h-3 w-3" />
                <span>{t("websiteLabel")}</span>
              </a>
            )}

            {company.facebook && (
              <a
                href={
                  company.facebook.startsWith("http")
                    ? company.facebook
                    : `https://facebook.com/${company.facebook}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                onClick={handleContactClick}
              >
                <Facebook className="h-3 w-3" />
                <span>{t("facebookLabel")}</span>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CompaniesCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, t } = useI18n();
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  // Use RTK Query hooks to fetch category and companies
  const { data: category, isLoading: categoryLoading, error: categoryError } = useGetCategoryQuery(id || "");
  
  // Create params for companies query
  const companiesParams = useMemo(() => ({
    categoryId: id || "",
    search: searchQuery,
    country: countryFilter,
    city: cityFilter,
    page: 1,
    limit: 20,
  }), [id, searchQuery, countryFilter, cityFilter]);
  
  const { data: companiesResponse, isLoading: companiesLoading, error: companiesError } = useGetCompaniesQuery(companiesParams);
  
  // Extract companies from response
  const companies = useMemo(() => {
    if (!companiesResponse) return [];
    
    // Try multiple possible paths to extract the companies array
    const possiblePaths = [
      companiesResponse?.data?.data,
      companiesResponse?.data,
      companiesResponse?.data?.companies,
      companiesResponse?.companies,
      companiesResponse
    ];
    
    for (const path of possiblePaths) {
      if (Array.isArray(path)) return path;
    }
    
    return [];
  }, [companiesResponse]);
  
  const isLoading = categoryLoading || companiesLoading;
  const error = categoryError || companiesError;

  const catName = category
    ? locale === "ar"
      ? category.nameAr
      : category.nameEn
    : "Category not found";

  // Loading state
  if (isLoading) {
    return (
      <div className="container-premium py-8 pt-24">
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">{t("loadingCompanies")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container-premium py-8 pt-24">
        <div className="text-center py-16 space-y-4">
          <div className="rounded-full bg-red-50 p-6 mb-4 mx-auto w-fit">
            <div className="h-12 w-12 text-red-600 mx-auto mb-2">⚠️</div>
          </div>
          <h2 className="text-xl font-semibold">{t("loadingError")}</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Failed to fetch data"}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            {t("retryLoading")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-premium py-8 pt-24">
      <Breadcrumb
        items={[
          { label: t("categories"), href: "/categories" },
          { label: catName },
        ]}
      />

      <div className="mt-8 mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="h-3 w-12 rounded-full"
            style={{ backgroundColor: category?.color || "#6366f1" }}
          />
          <h1 className="text-ultra-lg font-black gradient-text">{catName}</h1>
        </div>
        <p className="text-muted-foreground">
          {locale === "ar"
            ? `اكتشف أفضل الشركات في ${catName}`
            : `Discover the best companies in ${catName}`}
          </p>
        <div className="flex items-center gap-4 mt-4">
          <span className="text-sm text-muted-foreground">
            {companies.length} {t("companiesAvailable")}
          </span>
          <span className="text-sm text-muted-foreground">
            {companies.filter((company) => company.status === "approved").length}{" "}
            {t("approvedCompanies")}
          </span>
        </div>
      </div>

      {/* Search bar */}
      <Card className="ultra-card border-0 mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* General search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchCompanies")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Country filter */}
            <div className="w-full md:w-48">
              <Input
                placeholder={t("searchByCountry")}
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              />
            </div>

            {/* City filter */}
            <div className="w-full md:w-48">
              <Input
                placeholder={t("searchByCity")}
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </div>

            {/* Clear filters button */}
            {(searchQuery || countryFilter || cityFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setCountryFilter("");
                  setCityFilter("");
                }}
                className="whitespace-nowrap"
              >
                {t("clearFilters")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="w-full">
        {companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            {/* Empty icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                <div className="text-4xl opacity-40">🏢</div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <div className="text-orange-500 text-lg">🔍</div>
              </div>
            </div>

            {/* Title and description */}
            <div className="text-center space-y-3 mb-8">
              <h3 className="text-xl font-semibold text-foreground">
                {companies.length === 0
                  ? t("noCategoriesFound")
                  : t("noResultsFound")}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {companies.length === 0
                  ? t("noCategoriesFoundDesc").replace(
                      "{categoryName}",
                      catName
                    )
                  : t("tryDifferentFilters")}
              </p>
              {(searchQuery || countryFilter || cityFilter) && (
                <p className="text-sm text-muted-foreground">
                  {t("activeFilters")}
                  {searchQuery && ` ${t("searchTerm")} "${searchQuery}"`}
                  {countryFilter && ` ${t("country")}: "${countryFilter}"`}
                  {cityFilter && ` ${t("city")}: "${cityFilter}"`}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {companies.length === 0 ? (
                <>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push("/login?redirect=/manage/ads/new");
                      } else {
                        router.push("/manage/ads/new");
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addMyCompany")}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/categories">
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      {t("browseOtherCategories")}
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setCountryFilter("");
                      setCityFilter("");
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t("removeFilters")}
                  </Button>
                  <Button
                    className="flex items-center"
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push("/login?redirect=/manage/ads/new");
                      } else {
                        router.push("/manage/ads/new");
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addCompany")}
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="ultra-grid">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}