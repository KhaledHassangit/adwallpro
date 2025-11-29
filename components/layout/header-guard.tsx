"use client";

import { usePathname } from "next/navigation";
import { UltraHeader } from "@/components/layout/header";

export default function HeaderGuard() {
  const pathname = usePathname() || "";

  // Determine top-level path segment and next segment. Handle optional locale prefix (/en or /ar).
  const segments = pathname.split("/").filter(Boolean);
  const locales = ["en", "ar"];
  // If the first segment is a locale, shift segments
  const hasLocalePrefix = locales.includes(segments[0] || "");
  const top = hasLocalePrefix ? segments[1] || "" : segments[0] || "";
  const second = hasLocalePrefix ? segments[2] || "" : segments[1] || "";

  // Hide the global header for admin and user-dashboard areas.
  const hideTop = ["admin", "manage", "dashboard", "user-dashboard"].includes(top);
  const hideSecond = second === "admin"; // covers `/dashboard/admin`

  if (hideTop || hideSecond) {
    return null;
  }

  return <UltraHeader />;
}
