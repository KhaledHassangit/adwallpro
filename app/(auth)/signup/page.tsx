"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/providers/LanguageProvider";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Phone } from "lucide-react";

export default function SignupPage() {
  const { t, locale } = useI18n(); // Assuming locale is available from useI18n
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  });

  // Determine if the current language is RTL
  const isRTL = locale === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من تطابق كلمات المرور
    if (formData.password !== formData.passwordConfirm) {
      toast.error(t("passwordsNotMatch"));
      return;
    }

    // التحقق من طول كلمة المرور
    if (formData.password.length < 6) {
      toast.error(t("passwordMinLength"));
      return;
    }

    // التحقق من رقم الهاتف
    if (!formData.phone) {
      toast.error(t("phoneRequired"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://72.60.178.180:8000/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
          phone: formData.phone, // Now including phone in the request body
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("accountCreationFailed"));
      }

      // حفظ التوكن والمعلومات في localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.data.user));

      toast.success(t("accountCreatedSuccess"));

      // التوجه للصفحة الرئيسية
      router.push("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || t("accountCreationFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-pattern-grid justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4" dir={isRTL ? "rtl" : "ltr"}>
      <Card className="w-full max-w-md ultra-card transition-all border-0 shadow-2xl my-4">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-violet-500" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">
            {t("signupTitle")}
          </CardTitle>
          <p className="text-muted-foreground">{t("signupSubtitle")}</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t("fullName")}</Label>
              <div className="relative">
                <User className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none`} />
                <Input
                  id="name"
                  type="text"
                  placeholder={t("fullNamePlaceholder")}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
              <Label htmlFor="phone">{t("phone")}</Label>
              <div className="relative">
                <Phone className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none`} />
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t("phoneWithCountryCodePlaceholder")}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`${isRTL ? "pr-10" : "pl-10"}`}
                  style={{
                    paddingLeft: isRTL ? '!0.75rem' : '!2.5rem',
                    paddingRight: isRTL ? '!2.5rem' : '!0.75rem'
                  }}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("phoneWithCountryCodeNote")}
              </p>
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
                  minLength={6}
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
              <p className="text-xs text-muted-foreground mt-1">
                {t("passwordMinLength")}
              </p>
            </div>

            <div>
              <Label htmlFor="passwordConfirm">{t("confirmPassword")}</Label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none`} />
                <Input
                  id="passwordConfirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  value={formData.passwordConfirm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passwordConfirm: e.target.value,
                    })
                  }
                  className="pr-10 pl-10"
                  style={{
                    paddingLeft: isRTL ? '2.5rem' : '2.5rem',
                    paddingRight: isRTL ? '2.5rem' : '2.5rem'
                  }}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground`}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formData.passwordConfirm &&
                formData.password !== formData.passwordConfirm && (
                  <p className="text-xs text-destructive mt-1">
                    {t("passwordsNotMatch")}
                  </p>
                )}
            </div>

            <Button type="submit" className="w-full btn-ultra" disabled={loading}>
              {loading ? t("creatingAccount") : t("createAccount")}
            </Button>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {t("alreadyHaveAccount")}{" "}
              </span>
              <Link
                href="/login"
                className="text-sm text-violet-500 hover:underline font-medium"
              >
                {t("login")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}