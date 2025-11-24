"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/LanguageProvider";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "@/components/ui/icon";
import { ArrowLeft } from "lucide-react";

export function UltraCTA() {
  const { t, locale } = useI18n();
  
  // Determine which arrow icon to use based on locale
  const ArrowIcon = locale === "ar" ? ArrowLeft : ArrowRight;
  const arrowMarginClass = locale === "ar" ? "mr-3" : "ml-3";

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(135deg,
              hsl(220 100% 50%) 0%,
              hsl(280 100% 60%) 50%,
              hsl(200 100% 50%) 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease-in-out infinite;
          padding-bottom: 4px;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      <div className="container-premium">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Premium Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-600 to-blue-600" />
          <div className="absolute inset-0 bg-pattern-grid opacity-20" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-600/20 to-transparent" />

          {/* Floating Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl float-1" />
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl float-2" />

          {/* Content */}
          <div className="relative p-12 lg:p-20 text-center text-white">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-bold">{t("startJourney")}</span>
              </div>

              <h2 className="text-ultra-lg font-black mb-6 text-balance text-shadow-lg">
                {t("joinFuture")}
              </h2>

              <p className="text-xl opacity-90 max-w-3xl mx-auto mb-10 text-balance leading-relaxed text-shadow">
                {t("ctaDescription")}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-2 border-white/30 text-white bg-transparent font-bold text-lg px-10 py-6 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                >
                  <Link href="/signup" className="flex items-center">
                    <Sparkles className="h-6 w-6 mr-3 text-white hover:text-primary-600 transition-colors" />
                    <span className="group-hover:gradient-text transition-all">{t("startFreeNow")}</span>
                    <ArrowIcon className={`h-5 w-5 ${arrowMarginClass} group-hover:gradient-text transition-all `} />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-2 border-white/30 text-white bg-transparent font-bold text-lg px-10 py-6 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                >
                  <Link href="/categories" className="flex items-center">
                    <Star className="h-6 w-6 mr-3 text-white hover:text-primary-600 transition-colors" />
                    <span className="group-hover:gradient-text transition-all">{t("exploreCompaniesBtn")}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}