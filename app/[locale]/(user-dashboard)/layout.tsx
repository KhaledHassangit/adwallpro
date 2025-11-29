// app/(user)/layout.tsx
import type React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout userType="user">
      {children}
    </DashboardLayout>
  );
}