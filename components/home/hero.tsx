"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/LanguageProvider";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Plus,
  Grid3X3,
  Star,
  Zap,
  Users,
} from "@/components/ui/icon";
import { UltraSlider } from "./slider";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth";

export function UltraHero() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // تحديد الرابط والنص بناءً على حالة تسجيل الدخول
  const getButtonConfig = () => {
    if (user) {
      return {
        href: "/manage/ads/new",
        text: "إضافة إعلان جديد",
        icon: Plus,
      };
    } else {
      return {
        href: "/login",
        text: "إضافة إعلان جديد",
        icon: Plus,
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pattern-grid">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-r from-primary-400/20 to-purple-400/20 rounded-full blur-3xl float-1" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-r from-blue-400/15 to-primary-400/15 rounded-full blur-3xl float-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[1000px] h-80 sm:h-[1000px] bg-gradient-to-r from-primary-200/10 to-purple-200/10 rounded-full blur-3xl float-3" />
      </div>

      <div className="container-premium pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-start space-y-8 sm:space-y-10 scroll-fade-in visible">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass glow-primary">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-primary-600 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  {t("heroNewBadge")}
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-balance">
                <span className="gradient-text">{t("heroTitle")}</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl text-balance leading-relaxed">
                {t("heroDescription")}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="btn-ultra group  text-white  transition-all text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-6"
              >
                <Link href={buttonConfig.href}>
                  <buttonConfig.icon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                  {t("addNewAd")}
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 sm:ml-3 transition-all group-hover:translate-x-2" />
                </Link>
              </Button>
            <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-2xl border-2 transition-all  text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-6 font-semibold"
              >
                <Link href="/categories">
                  <Grid3X3 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                  {t("categories")}
                </Link>
              </Button>
            </div>

            {/* Premium Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 pt-6 sm:pt-8">
              <div className="text-center group">
                <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                  <Star className="h-4 sm:h-5 w-4 sm:w-5 text-amber-500" />
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black gradient-text">1000+</div>
                </div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                  {t("registeredCompanies")}
                </div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                  <Zap className="h-4 sm:h-5 w-4 sm:w-5 text-primary-500" />
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black gradient-text">14</div>
                </div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                  {t("diverseCategories")}
                </div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                  <Users className="h-4 sm:h-5 w-4 sm:w-5 text-green-500" />
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black gradient-text">3</div>
                </div>
                <div className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                  {t("supportedCountries")}
                </div>
              </div>
            </div>
          </div>

          {/* Ultra Slider */}
          <div className="relative perspective-1000 scroll-fade-in visible mt-10 lg:mt-0">
            <div className="absolute -inset-6 sm:-inset-8 bg-gradient-to-r from-primary-400/30 to-purple-400/30 rounded-3xl blur-3xl opacity-50" />
            <UltraSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
