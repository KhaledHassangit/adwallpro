"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Building2,
  Tags,
  Ticket,
  Settings,
  Home,
} from "@/components/ui/icon";

const sidebarItems = [
  { href: "/", icon: Home, labelKey: "home" },
  { href: "/admin", icon: BarChart3, labelKey: "dashboard" },
  { href: "/admin/users", icon: Users, labelKey: "users" },
  { href: "/admin/companies", icon: Building2, labelKey: "ads" },
  { href: "/admin/categories", icon: Tags, labelKey: "categories" },

  { href: "/admin/settings", icon: Settings, labelKey: "settings" },
];

export function DashboardSidebar() {
  const { t } = useI18n();
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/10 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
