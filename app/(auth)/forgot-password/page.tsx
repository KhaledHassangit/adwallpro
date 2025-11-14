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
import { Mail, ArrowLeft, Key } from "lucide-react";

export default function ForgotPasswordPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: reset code, 3: new password
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Determine if the current language is RTL
  const isRTL = locale === "ar";

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://72.60.178.180:8000/api/v1/auth/forgotPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("resetCodeError"));
      }

      toast.success(t("resetCodeSent"));
      setStep(2);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(error.message || t("resetCodeError"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://72.60.178.180:8000/api/v1/auth/verifyResetCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resetCode }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("invalidResetCode"));
      }

      toast.success(t("resetCodeSent"));
      setStep(3);
    } catch (error: any) {
      console.error("Verify reset code error:", error);
      toast.error(error.message || t("invalidResetCode"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://adwallpro.com/api/v1/auth/resetPassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("resetPasswordError"));
      }

      toast.success(t("resetPasswordSuccess"));
      router.push("/login");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || t("resetPasswordError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4" dir={isRTL ? "rtl" : "ltr"}>
      <Card className="w-full max-w-md ultra-card transition-all border-0 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Key className="h-8 w-8 text-violet-500" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">
            {step === 1 && t("forgotPasswordTitle")}
            {step === 2 && t("verifyCodeTitle")}
            {step === 3 && t("newPasswordTitle")}
          </CardTitle>
          <p className="text-muted-foreground">
            {step === 1 && t("forgotPasswordSubtitle")}
            {step === 2 && t("verifyCodeSubtitle")}
            {step === 3 && t("newPasswordSubtitle")}
          </p>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${isRTL ? "pr-10" : "pl-10"}`}
                    style={{
                      paddingLeft: isRTL ? '0.75rem' : '2.5rem',
                      paddingRight: isRTL ? '2.5rem' : '0.75rem'
                    }}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full btn-ultra" disabled={loading}>
                {loading ? t("sending") : t("sendResetCode")}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyResetCode} className="space-y-4">
              <div>
                <Label htmlFor="resetCode">{t("resetCode")}</Label>
                <Input
                  id="resetCode"
                  type="text"
                  placeholder="123456"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>

              <Button type="submit" className="w-full btn-ultra" disabled={loading}>
                {loading ? t("verifying") : t("verifyCode")}
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="newPassword">{t("newPassword")}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t("passwordMinLength")}
                </p>
              </div>

              <Button type="submit" className="w-full btn-ultra" disabled={loading}>
                {loading ? t("updating") : t("updatePassword")}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className={`inline-flex items-center text-sm text-violet-500 hover:underline font-medium`}
            >
              {isRTL ? (
                <>
                  {t("backToLogin")}
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </>
              ) : (
                <>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("backToLogin")}
                </>
              )}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}