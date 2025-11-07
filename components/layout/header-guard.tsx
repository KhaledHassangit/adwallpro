"use client";

import { usePathname } from "next/navigation";
import { UltraHeader } from "@/components/layout/header";

export default function HeaderGuard() {
  const pathname = usePathname() || "";

  // Hide the global header for admin and manage routes (and their subpaths)
  if (pathname.startsWith("/admin") || pathname.startsWith("/manage")) {
    return null;
  }

  return <UltraHeader />;
}
