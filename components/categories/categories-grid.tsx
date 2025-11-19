"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/LanguageProvider";
import { ArrowRight, Eye, Loader2 } from "@/components/ui/icon";
import { toast } from "sonner";
import type { Category } from "@/types/types";
import { useGetCategoriesQuery } from "@/features/categoriesApi";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export function CategoriesSlider() {
  const { locale, t } = useI18n();

  // Use RTK Query hook to fetch categories
  const { data: categoriesResponse, isLoading, error } = useGetCategoriesQuery();
  
  // Extract categories from the response
  const categories = categoriesResponse?.data?.data || [];

  if (isLoading)
    return (
      <section className="py-16 md:py-20">
        <div className="container-premium flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );

  if (error)
    return (
      <section className="py-16 md:py-20">
        <div className="container-premium text-center py-12">
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : "فشل في جلب التصنيفات"}
          </p>
        </div>
      </section>
    );

  return (
    <section className="py-16 md:py-20">
      <div className="container-premium">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-ultra-lg font-black mb-2 text-balance gradient-text">
              {t("exploreCategories")}
            </h2>
            <p className="text-ultra-base text-muted-foreground max-w-3xl leading-relaxed">
              {t("discoverThousandsCompanies")}
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-2xl border-2 bg-primary-50 "
          >
            <Link href="/categories">
              <Eye className="h-5 w-5 mr-2" />
              {t("viewAllCategories")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={4}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {categories.map((c) => {
            const name = locale === "ar" ? c.nameAr : c.nameEn;
            return (
              <SwiperSlide key={c.slug}>
                <Link href={`/companies/category/${c._id}`} className="group block">
                  <Card className="overflow-hidden border-0">
                    <div
                      className="h-[3px] w-full"
                      style={{
                        background: `linear-gradient(90deg, ${c.color} 0%, ${c.color}80 100%)`,
                      }}
                      aria-hidden
                    />
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={c.image || "/placeholder.svg"}
                          alt={name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
                        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 text-foreground shadow-sm backdrop-blur-sm">
                          <h3 className="font-semibold text-center">{name}</h3>
                          <div className="flex items-center gap-2">
                            <span
                              className="h-3 w-8 rounded-full"
                              style={{ backgroundColor: c.color }}
                              aria-hidden
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}