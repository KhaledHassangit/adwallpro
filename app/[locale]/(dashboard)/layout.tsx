// app/(admin)/layout.tsx
import type React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout userType="admin">
      {children}
    </DashboardLayout>
  );
}