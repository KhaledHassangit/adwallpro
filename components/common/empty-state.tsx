"use client";

import { Search, Plus } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/lang-provider";
import Link from "next/link";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-sky-50 p-4 mb-4">
        <Search className="h-8 w-8 text-sky-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && (
        <Button asChild>
          <Link href={action.href}>
            <Plus className="h-4 w-4 mr-2" />
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  );
}
