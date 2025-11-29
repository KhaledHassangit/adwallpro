"use client";

import type React from "react";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/providers/LanguageProvider";
import { getCurrentUser, SignInButton } from "@/components/auth/sign-in-dialog";
import { getCategories } from "@/lib/store";
import { countries } from "@/data/countries";
import { addAdAction } from "@/app/[locale]/actions";
import { ImageUpload } from "@/components/forms/image-upload";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { CheckCircle, AlertCircle, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useMemo } from "react";

export function AddCompanyForm() {
  const { t, locale } = useI18n();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const categories = getCategories();
  const cities = useMemo(() => {
    const co = countries.find(
      (c) => (locale === "ar" ? c.ar : c.en) === country
    );
    return co?.cities ?? [];
  }, [country, locale]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="ultra-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">تسجيل الدخول مطلوب</h2>
          <p className="text-muted-foreground mb-6">
            يجب تسجيل الدخول أولاً لإضافة شركتك
          </p>
          <SignInButton />
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="ultra-card p-12 text-center">
          <div className="mb-6">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold gradient-text mb-4">
              تم إرسال طلبك بنجاح!
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              شكراً لك على إضافة شركتك إلى منصة AdWell. سيتم مراجعة طلبك من قبل
              فريقنا خلال 24-48 ساعة.
            </p>
          </div>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>ماذا يحدث الآن؟</strong>
              <br />• سيقوم فريق المراجعة بفحص معلومات شركتك
              <br />• ستتلقى إشعار عبر البريد الإلكتروني عند الموافقة أو الرفض
              <br />• يمكنك متابعة حالة طلبك من خلال حسابك
            </AlertDescription>
          </Alert>

          <div className="flex gap-4 justify-center">
            <Button asChild className="btn-ultra">
              <a href="/">العودة للرئيسية</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl bg-transparent"
            >
              <a href="/categories">استكشف الشركات</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("ownerEmail", user.email);
    formData.set("country", country);
    formData.set("city", city);
    if (imageDataUrl) formData.set("image", imageDataUrl);

    startTransition(async () => {
      try {
        const res = await addAdAction(formData);
        if (res.ok) {
          setIsSubmitted(true);
        }
      } catch (error) {
        console.error("Error adding company:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="ultra-card p-8 text-center">
          <h2 className="text-3xl font-black gradient-text mb-4">
            أضف شركتك مجاناً
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            املأ النموذج أدناه وسيتم مراجعة طلبك من قبل فريقنا خلال 24-48 ساعة
          </p>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>مجاني تماماً!</strong> لا توجد رسوم لإضافة شركتك. فقط املأ
              البيانات وانتظر الموافقة.
            </AlertDescription>
          </Alert>
        </div>

        {/* Company Info */}
        <div className="ultra-card p-8">
          <h3 className="text-2xl font-bold gradient-text mb-6">
            معلومات الشركة
          </h3>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">{t("companyName")} *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  required
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")} *</Label>
                <Input
                  id="phone"
                  name="phone"
                  required
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("description")} *</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={4}
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>{t("category")} *</Label>
                <Select name="category" required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {locale === "ar" ? c.nameAr : c.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("country")} *</Label>
                <Select onValueChange={setCountry} required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={t("country")} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem
                        key={c.code}
                        value={locale === "ar" ? c.ar : c.en}
                      >
                        {locale === "ar" ? c.ar : c.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("city")} *</Label>
                <Select onValueChange={setCity} disabled={!country} required>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={t("city")} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c, i) => (
                      <SelectItem key={i} value={locale === "ar" ? c.ar : c.en}>
                        {locale === "ar" ? c.ar : c.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">{t("whatsapp")}</Label>
                <Input id="whatsapp" name="whatsapp" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">{t("website")}</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="ultra-card p-8">
          <h3 className="text-2xl font-bold gradient-text mb-6">صورة الشركة</h3>
          <ImageUpload onImageChange={setImageDataUrl} />
        </div>

        {/* Submit */}
        <div className="ultra-card p-8 text-center">
          <Button
            type="submit"
            className="btn-ultra text-lg px-12 py-6"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center gap-3">
                <LoadingSpinner size="sm" />
                جاري الإرسال...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Send className="h-5 w-5" />
                إرسال الطلب للمراجعة
              </div>
            )}
          </Button>

          <p className="text-sm text-muted-foreground mt-4">
            بالنقر على "إرسال الطلب" فإنك توافق على شروط الاستخدام وسياسة
            الخصوصية
          </p>
        </div>
      </div>
    </form>
  );
}
