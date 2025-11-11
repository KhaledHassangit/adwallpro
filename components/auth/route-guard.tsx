"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, getCurrentUser, isAdmin } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function RouteGuard({
  children,
  requireAuth = false,
  requireAdmin = false,
  redirectTo,
  fallback,
}: RouteGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);

      const currentUser = getCurrentUser();
      const userIsAdmin = isAdmin(currentUser);

      console.log("Route guard check:", {
        pathname: window.location.pathname,
        requireAuth,
        requireAdmin,
        currentUser: currentUser ? "present" : "null",
        userRole: currentUser?.role,
        userIsAdmin,
      });

      // If authentication is required
      if (requireAuth && !currentUser) {
        console.log(
          "Authentication required but no user found, redirecting to login"
        );
        const redirectPath = redirectTo || "/login";
        router.push(redirectPath);
        return;
      }

      // If admin access is required
      if (requireAdmin && (!currentUser || !userIsAdmin)) {
        console.log(
          "Admin access required but user is not admin, redirecting to login"
        );
        const redirectPath = redirectTo || "/login";
        router.push(redirectPath);
        return;
      }

      // 🚫 Prevent signed-in users from accessing login/signup/forgot-password
      if (
        currentUser &&
        ["/login", "/signup", "/forgot-password"].includes(
          window.location.pathname
        )
      ) {
        console.log("User already signed in, redirecting to home...");
        router.push("/");
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [user, requireAuth, requireAdmin, redirectTo, router]);

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري التحقق من الهوية...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Higher-order component for admin routes
export function AdminRoute({
  children,
  ...props
}: Omit<RouteGuardProps, "requireAdmin" | "requireAuth">) {
  return (
    <RouteGuard requireAuth requireAdmin {...props}>
      {children}
    </RouteGuard>
  );
}

// Higher-order component for authenticated user routes
export function ProtectedRoute({
  children,
  ...props
}: Omit<RouteGuardProps, "requireAuth">) {
  return (
    <RouteGuard requireAuth {...props}>
      {children}
    </RouteGuard>
  );
}

// Component for redirecting based on user role
export function RoleRedirect() {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin(currentUser);

  useEffect(() => {
    if (currentUser) {
      if (userIsAdmin) {
        router.push("/admin");
      } else {
        router.push("/manage");
      }
    } else {
      router.push("/login");
    }
  }, [currentUser, userIsAdmin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">جاري توجيهك...</p>
      </div>
    </div>
  );
}
