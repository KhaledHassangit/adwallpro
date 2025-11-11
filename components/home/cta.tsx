"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/LanguageProvider";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "@/components/ui/icon";

export function UltraCTA() {
  const { t } = useI18n();

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
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
                  variant="secondary"
                  className="rounded-2xl font-bold text-lg px-10 py-6 bg-white text-primary-600 hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/signup" className="flex items-center">
                    <Sparkles className="h-6 w-6 mr-3" />
                    {t("startFreeNow")}
                    <ArrowRight className="h-5 w-5 ml-3" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 bg-transparent font-bold text-lg px-10 py-6 backdrop-blur-sm"
                >
                  <Link href="/categories">
                    <Star className="h-6 w-6 mr-3" />
                    {t("exploreCompaniesBtn")}
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
