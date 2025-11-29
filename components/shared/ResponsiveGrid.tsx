import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ResponsiveGridProps {
  children: ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const gapClasses = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

/**
 * Reusable Responsive Grid Component
 * Handles responsive layouts with flexible column counts
 */
export function ResponsiveGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "lg",
  className,
}: ResponsiveGridProps) {
  const gridClasses = cn(
    "grid",
    gapClasses[gap],
    `grid-cols-${columns.mobile || 1}`,
    `sm:grid-cols-${columns.tablet || 2}`,
    `lg:grid-cols-${columns.desktop || 3}`,
    className
  );

  return <div className={gridClasses}>{children}</div>;
}
