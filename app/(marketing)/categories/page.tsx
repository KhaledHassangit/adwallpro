"use client";

import { CategoriesAll } from "@/components/categories/categories-all";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { useI18n } from "@/providers/LanguageProvider";
import { Sparkles } from "lucide-react";

export default function CategoriesPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-pattern-grid">
      <div className="container-premium py-8 pt-24">
        {/* <Breadcrumb items={[{ label: t("categories") }]} /> */}
        <div className="mt-8 mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass glow-primary mb-6">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-bold gradient-text">
              {t("exploreAllCategories")}
            </span>
          </div>

          <h1 className="text-ultra-lg font-black gradient-text mb-4">
            {t("categories")}
          </h1>
          <p className="text-ultra-base text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            {t("categoriesPageDesc")}
          </p>
        </div>
        <CategoriesAll />
      </div>
    </div>
  );
}
