"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useI18n } from "@/providers/lang-provider"

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const { t } = useI18n()

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/" className="flex items-center gap-1 hover:text-sky-600 transition-colors">
        <Home className="h-4 w-4" />
        <span className="sr-only">{t("home")}</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-sky-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
