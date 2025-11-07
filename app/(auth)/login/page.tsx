"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/providers/lang-provider";
import { signIn, useAuthStore } from "@/lib/auth";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // استخدام دالة signIn من lib/auth.ts
      const { user, token } = await signIn(formData.email, formData.password);

      console.log("Login successful - User:", user);
      console.log("User role:", user.role);
      console.log("User ID:", user._id);

      // تحديث الـ store
      setUser(user);
      setToken(token);

      toast.success("تم تسجيل الدخول بنجاح");

      // التأكد من أن الدور موجود
      const userRole = user.role || "user";
      console.log("Final user role:", userRole);

      // التوجه للصفحة المناسبة حسب دور المستخدم
      if (userRole === "admin") {
        console.log("Redirecting admin to /dashboard/admin");
        router.push("/admin");
      } else {
        console.log("Redirecting user to /user-dashboard/manage");
        router.push("/manage");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "فشل في تسجيل الدخول");
    } finally {
      setLoading(false);
    }
}; 

  return (
    <div className="min-h-screen flex items-center bg-pattern-grid  justify-center  bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md ultra-card transition-all border-0 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">
            تسجيل الدخول
          </CardTitle>
          <p className="text-muted-foreground">مرحباً بك في AddWall</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                ليس لديك حساب؟{" "}
              </span>
              <Link
                href="/signup"
                className="text-sm text-primary hover:underline font-medium"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
