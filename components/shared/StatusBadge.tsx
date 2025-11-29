import React from "react";
import { Badge, BadgeProps } from "@/components/ui/badge";

export interface StatusBadgeProps extends BadgeProps {
  status: string;
  statusMap?: Record<string, { label: string; variant: BadgeProps["variant"] }>;
}

/**
 * Reusable Status Badge Component
 * Maps status values to display labels and visual variants
 */
export function StatusBadge({
  status,
  statusMap = {
    active: { label: "Active", variant: "default" },
    inactive: { label: "Inactive", variant: "destructive" },
    pending: { label: "Pending", variant: "outline" },
    expired: { label: "Expired", variant: "destructive" },
  },
  ...props
}: StatusBadgeProps) {
  const { label, variant } = statusMap[status] || {
    label: status,
    variant: "outline" as const,
  };

  return (
    <Badge variant={variant} {...props}>
      {label}
    </Badge>
  );
}
