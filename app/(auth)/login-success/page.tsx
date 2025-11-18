// app/login-success/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUserStore } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken } = useAuthStore();
  const { setUser } = useUserStore();

  useEffect(() => {
    // Get the token from URL parameters
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Login failed: " + error);
      router.push("/login");
      return;
    }

    if (token) {
      // Store the token in localStorage and auth store
      localStorage.setItem("auth_token", token);
      setToken(token);

      // Fetch user data using the token
      const fetchUserData = async () => {
        try {
          const response = await fetch("http://72.60.178.180:8000/api/v1/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const userData = data.data;
            
            // Store user data in localStorage and user store
            localStorage.setItem("user_data", JSON.stringify(userData));
            setUser(userData);

            toast.success("Login successful");

            // Redirect based on user role
            const userRole = userData.role || "user";
            if (userRole === "admin") {
              router.push("/admin");
            } else {
              router.push("/manage");
            }
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to complete login");
          router.push("/login");
        }
      };

      fetchUserData();
    } else {
      // No token found, redirect to login
      toast.error("No authentication token found");
      router.push("/login");
    }
  }, [router, searchParams, setToken, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-violet-500" />
        <h2 className="text-xl font-semibold">Logging in, please wait...</h2>
      </div>
    </div>
  );
}

// تحتاج أيضاً لاستيراد useSearchParams
import { useSearchParams } from "next/navigation";

export default function LoginSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-violet-500" />
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    }>
      <LoginSuccessContent />
    </Suspense>
  );
}