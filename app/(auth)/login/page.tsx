"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/providers/LanguageProvider";
import { signIn, useAuthStore, useUserStore } from "@/lib/auth";
import { verifyGoogleToken } from "@/app/actions";
import { GoogleLogin } from "@react-oauth/google";
import { useNotifications } from "@/hooks/notifications";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const notifications = useNotifications();

  // Get state setters from the correct stores
  const { setToken } = useAuthStore();
  const { setUser } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const isRTL = locale === "ar";
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setGoogleLoading(true);
    try {
      const { credential } = credentialResponse;

      // Verify token on server side
      const result = await verifyGoogleToken(credential);

      if (!result.success) {
        throw new Error(result.error || "Google authentication failed");
      }

      // Update auth stores with returned data
      setUser(result.user);
      setToken(result.token);

      notifications.success(t("loginSuccess"));

      // Redirect based on role
      const userRole = result.user?.role || "user";
      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/manage");
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      notifications.error(error.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    notifications.error("Google login failed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // The signIn function now handles updating the stores internally
      const { user, token } = await signIn(formData.email, formData.password);

      console.log("Login successful - User:", user);
      console.log("User role:", user.role);
      console.log("User ID:", user._id);

      // The stores are already updated by signIn(), but calling them here is also fine
      // and makes the component's intent clear.
      setUser(user);
      setToken(token);

      notifications.success(t("loginSuccess"));

      const userRole = user.role || "user";
      console.log("Final user role:", userRole);

      if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/manage");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      notifications.error(error.message || t("loginFailed"));
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

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative  flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("orContinueWith")}
                </span>
              </div>
            </div>

            {googleClientId ? (
              <div className="flex justify-center" dir={isRTL ? "rtl" : "ltr"}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signin_with"
                  width="400"
                  locale={locale}
                  useOneTap={false}
                  type="standard"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  logo_alignment="left"
                />
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                Google login is not available at the moment. Please use email login.
              </div>
            )}

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