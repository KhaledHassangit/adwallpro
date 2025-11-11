"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/providers/LanguageProvider";
import { signIn, useAuthStore } from "@/lib/auth";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const isRTL = locale === "ar";

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

      toast.success(t("loginSuccess"));

      const userRole = user.role || "user";
      console.log("Final user role:", userRole);

      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/manage");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || t("loginFailed"));
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div className="min-h-screen flex items-center bg-pattern-grid justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4" dir={isRTL ? "rtl" : "ltr"}>
      <Card className="w-full max-w-md ultra-card transition-all border-0 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <LogIn className="h-8 w-8 text-violet-500" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">
            {t("loginTitle")}
          </CardTitle>
          <p className="text-muted-foreground">{t("loginSubtitle")}</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none`} />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`${isRTL ? "pr-10" : "pl-10"}`}
                  style={{
                    paddingLeft: isRTL ? '0.75rem' : '2.5rem',
                    paddingRight: isRTL ? '2.5rem' : '0.75rem'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">{t("password")}</Label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none`} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pr-10 pl-10"
                  style={{
                    paddingLeft: isRTL ? '2.5rem' : '2.5rem',
                    paddingRight: isRTL ? '2.5rem' : '2.5rem'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground`}
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
                className="text-sm text-violet-500 hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            <Button type="submit" className="w-full btn-ultra" disabled={loading}>
              {loading ? t("loggingIn") : t("login")}
            </Button>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {t("dontHaveAccount")}{" "}
              </span>
              <Link
                href="/signup"
                className="text-sm text-violet-500 hover:underline font-medium"
              >
                {t("signup")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}