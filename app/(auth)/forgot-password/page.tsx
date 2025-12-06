"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/providers/LanguageProvider";
import { useNotifications } from "@/hooks/notifications";
import { Mail, ArrowLeft, Key } from "lucide-react";
import {
  createForgotPasswordEmailSchema,
  createResetCodeSchema,
  createNewPasswordSchema,
  type ForgotPasswordValidationMessages
} from "@/lib/validations";
import { z } from "zod";

export default function ForgotPasswordPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const notifications = useNotifications();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: reset code, 3: new password
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [resetCodeError, setResetCodeError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const isRTL = locale === "ar";

  // Create schemas with translated messages
  const validationMessages: ForgotPasswordValidationMessages = {
    emailRequired: t("emailRequired"),
    invalidEmailAddress: t("invalidEmailAddress"),
    resetCodeRequired: t("resetCodeRequired"),
    passwordRequired: t("passwordRequired"),
    passwordMinLengthShort: t("passwordMinLengthShort")
  };

  const emailSchema = createForgotPasswordEmailSchema(validationMessages);
  const codeSchema = createResetCodeSchema(validationMessages);
  const passwordSchema = createNewPasswordSchema(validationMessages);

  const validateEmail = (): boolean => {
    try {
      emailSchema.parse({ email });
      setEmailError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0]?.message || "Invalid email");
      }
      return false;
    }
  };

  const validateResetCode = (): boolean => {
    try {
      codeSchema.parse({ resetCode });
      setResetCodeError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setResetCodeError(error.errors[0]?.message || "Invalid reset code");
      }
      return false;
    }
  };

  const validatePassword = (): boolean => {
    try {
      passwordSchema.parse({ newPassword });
      setPasswordError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordError(error.errors[0]?.message || "Invalid password");
      }
      return false;
    }
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail()) {
      notifications.error(t("formValidationError"));
      return;
    }

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

      notifications.success(t("resetCodeSent"));
      setStep(2);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      notifications.error(error.message || t("resetCodeError"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateResetCode()) {
      notifications.error(t("formValidationError"));
      return;
    }

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

      notifications.success(t("resetCodeSent"));
      setStep(3);
    } catch (error: any) {
      console.error("Verify reset code error:", error);
      notifications.error(error.message || t("invalidResetCode"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      notifications.error(t("formValidationError"));
      return;
    }

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

      notifications.success(t("resetPasswordSuccess"));
      router.push("/login");
    } catch (error: any) {
      console.error("Reset password error:", error);
      notifications.error(error.message || t("resetPasswordError"));
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    className={`${isRTL ? "pr-10" : "pl-10"} ${emailError ? "border-red-500" : ""}`}
                    style={{
                      paddingLeft: isRTL ? '0.75rem' : '2.5rem',
                      paddingRight: isRTL ? '2.5rem' : '0.75rem'
                    }}
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-red-500 mt-1">{emailError}</p>
                )}
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
                  onChange={(e) => {
                    setResetCode(e.target.value);
                    if (resetCodeError) setResetCodeError(null);
                  }}
                  className={`text-center text-lg tracking-widest ${resetCodeError ? "border-red-500" : ""}`}
                />
                {resetCodeError && (
                  <p className="text-sm text-red-500 mt-1">{resetCodeError}</p>
                )}
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
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  className={passwordError ? "border-red-500" : ""}
                />
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {t("passwordMinLengthShort")}
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
