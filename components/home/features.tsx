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
  colorClass = "",
}: {
  icon: any;
  title: string;
  description: string;
  delay?: number;
  colorClass?: string;
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
        <div className={cn(
          "absolute inset-0 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500",
          colorClass === "blue" && "bg-gradient-to-r from-blue-400/20 to-cyan-400/20",
          colorClass === "purple" && "bg-gradient-to-r from-purple-400/20 to-pink-400/20",
          colorClass === "green" && "bg-gradient-to-r from-green-400/20 to-emerald-400/20",
          colorClass === "orange" && "bg-gradient-to-r from-orange-400/20 to-amber-400/20",
          colorClass === "red" && "bg-gradient-to-r from-red-400/20 to-rose-400/20",
          colorClass === "indigo" && "bg-gradient-to-r from-indigo-400/20 to-blue-400/20",
          !colorClass && "bg-gradient-to-r from-violet-400/20 to-purple-400/20"
        )} />
        <div className={cn(
          "relative inline-flex items-center justify-center w-20 h-20 rounded-3xl group-hover:scale-110 transition-all duration-500 shadow-lg",
          colorClass === "blue" && "bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50",
          colorClass === "purple" && "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50",
          colorClass === "green" && "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50",
          colorClass === "orange" && "bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50",
          colorClass === "red" && "bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50",
          colorClass === "indigo" && "bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50",
          !colorClass && "bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50"
        )}>
          <Icon className={cn(
            "h-10 w-10 group-hover:scale-110 transition-transform duration-300",
            colorClass === "blue" && "text-blue-600 dark:text-blue-400",
            colorClass === "purple" && "text-purple-600 dark:text-purple-400",
            colorClass === "green" && "text-green-600 dark:text-green-400",
            colorClass === "orange" && "text-orange-600 dark:text-orange-400",
            colorClass === "red" && "text-red-600 dark:text-red-400",
            colorClass === "indigo" && "text-indigo-600 dark:text-indigo-400",
            !colorClass && "text-violet-600 dark:text-violet-400"
          )} />
        </div>
      </div>
      <h3 className={cn(
        "font-bold text-xl mb-4 transition-colors duration-300 text-shadow-sm",
        colorClass === "blue" && "group-hover:text-blue-600 dark:group-hover:text-blue-400",
        colorClass === "purple" && "group-hover:text-purple-600 dark:group-hover:text-purple-400",
        colorClass === "green" && "group-hover:text-green-600 dark:group-hover:text-green-400",
        colorClass === "orange" && "group-hover:text-orange-600 dark:group-hover:text-orange-400",
        colorClass === "red" && "group-hover:text-red-600 dark:group-hover:text-red-400",
        colorClass === "indigo" && "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
        !colorClass && "group-hover:text-violet-600 dark:group-hover:text-violet-400"
      )}>
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
      colorClass: "blue"
    },
    {
      icon: Users,
      title: `🔹 ${t("instantCommunication")}`,
      description: t("instantCommunicationDesc"),
      colorClass: "purple"
    },
    {
      icon: Zap,
      title: `🔹 ${t("lightningSpeed")}`,
      description: t("lightningSpeedDesc"),
      colorClass: "yellow"
    },
    {
      icon: Shield,
      title: `🔹 ${t("preciseReview")}`,
      description: t("preciseReviewDesc"),
      colorClass: "green"
    },
    {
      icon: TrendingUp,
      title: `🔹 ${t("rapidGrowth")}`,
      description: t("rapidGrowthDesc"),
      colorClass: "orange"
    },
    {
      icon: Award,
      title: `🔹 ${t("exceptionalQuality")}`,
      description: t("exceptionalQualityDesc"),
      colorClass: "red"
    },
  ];

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-grid opacity-30" />
      <div className="container-premium relative">
        <div className="text-center mb-20 scroll-fade-in visible">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass glow-primary mb-8">
            <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <UltraFeatureCard key={index} {...feature} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}