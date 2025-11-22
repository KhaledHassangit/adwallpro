"use client";

import {
  Star,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Award,
  Sparkles,
} from "@/components/ui/icon";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/LanguageProvider";

function UltraFeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: any;
  title: string;
  description: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "ultra-card p-8 text-center group cursor-pointer transition-all duration-700",
        isVisible ? "scroll-fade-in visible" : "scroll-fade-in"
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-purple-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 group-hover:scale-110 transition-all duration-500 shadow-lg">
          <Icon className="h-10 w-10 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
      <h3 className="font-bold text-xl mb-4 group-hover:text-primary-600 transition-colors duration-300 text-shadow-sm">
        {title}
      </h3>
      <p className="text-base text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export function UltraFeatures() {
  const { t, locale } = useI18n();

  const features = [
    {
      icon: Star,
      title: `🔹 ${t("freeAddition")}`,
      description: t("freeAdditionDesc"),
    },
    {
      icon: Users,
      title: `🔹 ${t("instantCommunication")}`,
      description: t("instantCommunicationDesc"),
    },
    {
      icon: Zap,
      title: `🔹 ${t("lightningSpeed")}`,
      description: t("lightningSpeedDesc"),
    },
    {
      icon: Shield,
      title: `🔹 ${t("preciseReview")}`,
      description: t("preciseReviewDesc"),
    },
    {
      icon: TrendingUp,
      title: `🔹 ${t("rapidGrowth")}`,
      description: t("rapidGrowthDesc"),
    },
    {
      icon: Award,
      title: `🔹 ${t("exceptionalQuality")}`,
      description: t("exceptionalQualityDesc"),
    },
  ];

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-grid opacity-30" />
      <div className="container-premium relative">
        <div className="text-center mb-20 scroll-fade-in visible">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass glow-primary mb-8">
            <Sparkles className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-bold gradient-text">
              {t("whyBest")}
            </span>
          </div>
          <h2 className="text-ultra-lg font-black mb-6 text-balance">
            {locale === "ar" ? (
              <>
                منصة <span className="gradient-text">AdWall</span> العصرية
              </>
            ) : (
              <>
                <span className="gradient-text">AdWall</span>{" "}
                {t("modernPlatform")}
              </>
            )}
          </h2>
          <p className="text-ultra-base text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            {t("platformDescription")}
          </p>
        </div>

        <div className="ultra-grid">
          {features.map((feature, index) => (
            <UltraFeatureCard key={index} {...feature} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
