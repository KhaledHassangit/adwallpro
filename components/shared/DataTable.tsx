import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: Array<{
    key: keyof T;
    header: string;
    render?: (value: any, row: T) => ReactNode;
    className?: string;
  }>;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * Reusable Data Table Component
 * Generic table for displaying tabular data with custom columns
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading,
  emptyMessage = "No data available",
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left p-3 font-semibold text-muted-foreground"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-muted/50">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={cn("p-3", col.className)}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
