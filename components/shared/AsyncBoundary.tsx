import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "../common/loading-spinner";

export interface AsyncBoundaryProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable Async Boundary Component
 * Handles loading, error, and empty states
 */
export function AsyncBoundary({
  isLoading,
  error,
  isEmpty,
  emptyMessage = "No data available",
  children,
  className,
}: AsyncBoundaryProps) {
  if (isLoading) {
    return (
      <div className={cn("flex justify-center items-center min-h-[200px]", className)}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive", className)}>
        <p className="font-semibold">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        {emptyMessage}
      </div>
    );
  }

  return <>{children}</>;
}
