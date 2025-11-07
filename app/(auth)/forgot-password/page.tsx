"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/providers/lang-provider";
import { toast } from "sonner";
import { Mail, ArrowLeft, Key } from "lucide-react";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: reset code, 3: new password
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://adwallpro.com/api/v1/auth/forgotPassword",
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
        throw new Error(data.message || "فشل في إرسال رمز الاستعادة");
      }

      toast.success("تم إرسال رمز الاستعادة إلى بريدك الإلكتروني");
      setStep(2);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(error.message || "فشل في إرسال رمز الاستعادة");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://adwallpro.com/api/v1/auth/verifyResetCode",
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
        throw new Error(data.message || "رمز الاستعادة غير صحيح");
      }

      toast.success("تم التحقق من الرمز بنجاح");
      setStep(3);
    } catch (error: any) {
      console.error("Verify reset code error:", error);
      toast.error(error.message || "رمز الاستعادة غير صحيح");
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
        throw new Error(data.message || "فشل في إعادة تعيين كلمة المرور");
      }

      toast.success("تم إعادة تعيين كلمة المرور بنجاح");
      router.push("/login");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || "فشل في إعادة تعيين كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md ultra-card border-0 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Key className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold gradient-text">
            {step === 1 && "نسيت كلمة المرور؟"}
            {step === 2 && "التحقق من الرمز"}
            {step === 3 && "كلمة مرور جديدة"}
          </CardTitle>
          <p className="text-muted-foreground">
            {step === 1 && "سنرسل لك رمز استعادة على بريدك الإلكتروني"}
            {step === 2 && "أدخل الرمز المرسل إلى بريدك الإلكتروني"}
            {step === 3 && "أدخل كلمة المرور الجديدة"}
          </p>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري الإرسال..." : "إرسال رمز الاستعادة"}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyResetCode} className="space-y-4">
              <div>
                <Label htmlFor="resetCode">رمز الاستعادة</Label>
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري التحقق..." : "التحقق من الرمز"}
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
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
                  يجب أن تحتوي على 6 أحرف على الأقل
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
