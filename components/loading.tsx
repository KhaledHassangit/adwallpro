// components/ui/language-loading.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/providers/LanguageProvider";

interface LoadingProps {
  isLoading?: boolean;
}

export default function Loading({ isLoading = true }: LoadingProps) {
  const { t, locale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const isRTL = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 backdrop-blur-sm"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col items-center justify-center space-y-8 p-8">
        {/* Logo with animation */}
        <div className="relative mb-2">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-primary/20 shadow-2xl">
            <Image
              src="/images/adwell-logo.jpg"
              alt="AdWallPro"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Loading dots animation */}
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-3 w-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-3 w-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            {t("loading")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isRTL ? "جاري تحميل المحتوى..." : "Loading content..."}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
      </div>
    </div>
  );
}