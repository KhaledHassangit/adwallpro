"use client";

import { useState, useEffect } from "react";
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
import { ImageUpload } from "@/components/forms/image-upload";
import { ProtectedRoute } from "@/components/auth/route-guard";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { toast } from "sonner";
import { Plus, Tags } from "@/components/ui/icon";
import { getCurrentUser } from "@/lib/auth";
import { useI18n } from "@/providers/lang-provider";

interface Category {
  _id: string;
  nameAr: string;
  nameEn: string;
  color: string;
}

function AddAdPageContent() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    categoryId: "",
    description: "",
    country: t(""),
    city: "",
    email: "",
    whatsapp: "",
    facebook: "",
    website: "",
    logo: null as string | null,
  });

  const user = getCurrentUser();

  // جلب الفئات من الباك إند
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch("http://72.60.178.180:8000/api/v1/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      console.log("Categories API response:", data);

      // التعامل مع هيكل الاستجابة المختلف
      let categoriesData: Category[] = [];

      if (data.data && Array.isArray(data.data)) {
        categoriesData = data.data;
        console.log("Using data.data:", categoriesData);
      } else if (Array.isArray(data)) {
        categoriesData = data;
        console.log("Using direct data:", categoriesData);
      } else {
        console.error("Unexpected response structure:", data);
        throw new Error(t("unexpectedServerResponse"));
      }

      setCategories(categoriesData);
      console.log("Categories loaded successfully:", categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(t("failedToFetchCategories"));
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    // تعبئة بيانات المستخدم إذا كان مسجل دخول
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // جلب user_data من localStorage
      const userDataString = localStorage.getItem("user_data");
      if (!userDataString) {
        throw new Error(t("userDataNotFound"));
      }

      const userData = JSON.parse(userDataString);
      const userId = userData._id;
      console.log("User data from localStorage:", userData);
      console.log("User ID:", userId);

      if (!userId) {
        throw new Error(t("userIdNotFound"));
      }

      // إنشاء FormData لإرسال البيانات
      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("companyName", formData.companyName);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("whatsapp", formData.whatsapp);
      formDataToSend.append("facebook", formData.facebook);
      formDataToSend.append("website", formData.website);

      // إضافة ownerId أيضاً

      // إضافة الشعار إذا كان موجود
      if (formData.logo && formData.logo.startsWith("data:")) {
        const response = await fetch(formData.logo);
        const blob = await response.blob();
        formDataToSend.append("logo", blob, "company-logo.jpg");
      }

      // مراقبة البيانات المرسلة
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await fetch("http://72.60.178.180:8000/api/v1/companies", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: formDataToSend,
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData);
        throw new Error(errorData.message || "Failed to create company");
      }

      const successData = await response.json();
      console.log("Success response:", successData);

      toast.success(t("adAddedSuccessfully"));

      // إعادة تعيين النموذج
      setFormData({
        companyName: "",
        categoryId: "",
        description: "",
        country: "",
        city: "",
        email: user?.email || "",
        whatsapp: "",
        facebook: "",
        website: "",
        logo: null,
      });

      // إعادة توجيه إلى صفحة الإعلانات
      window.location.href = "/manage/ads";
    } catch (error) {
      console.error("Error creating company:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("failedToAddAd");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 pt-24">
        <Breadcrumb
          items={[
            { label: t("myAds"), href: "/manage/ads" },
            { label: t("addNewAd") },
          ]}
        />

        <div className="mt-8 mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text mb-6">
            {t("addNewAd")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("addCompanyAndChoosePlan")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {/* Header */}


            {/* Company Info */}
            <div className="ultra-card p-6 md:p-8 lg:p-10">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold gradient-text mb-8 text-center">
                {t("companyInfoTitle")}
              </h3>

              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label
                      htmlFor="companyName"
                      className="text-base font-semibold"
                    >
                      {t("companyNameLabel")}
                    </Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      placeholder={t("companyNamePlaceholder")}
                      required
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-semibold">
                      {t("emailLabelForm")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder={t("emailPlaceholder")}
                      required
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="description"
                    className="text-base font-semibold"
                  >
                    {t("companyDescriptionLabel")}
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder={t("companyDescriptionPlaceholder")}
                    rows={4}
                    required
                    className="rounded-xl text-base border-2 focus:border-primary/50 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    {t("selectCompanyCategory")}
                  </Label>
                  {categoriesLoading ? (
                    <div className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                      <LoadingSpinner />
                      <span className="text-base text-muted-foreground">
                        {t("loadingCategories")}
                      </span>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-yellow-200 rounded-xl bg-yellow-50/50">
                      <div className="text-center">
                        <Tags className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <span className="text-base text-yellow-700 font-medium">
                          {t("noCategoriesAvailable")}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={fetchCategories}
                        className="text-yellow-700 border-yellow-300 hover:bg-yellow-100 rounded-xl"
                      >
                        {t("reload")}
                      </Button>
                    </div>
                  ) : (
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, categoryId: value })
                      }
                      required
                    >
                      <SelectTrigger className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200">
                        <SelectValue placeholder={t("selectCategory")} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-md z-50">
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="font-medium text-base">
                                {category.nameAr}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label
                      htmlFor="country"
                      className="text-base font-semibold"
                    >
                      {t("countryLabel")}
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      placeholder={t("countryPlaceholder")}
                      required
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-base font-semibold">
                      {t("cityLabel")}
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder={t("cityPlaceholder")}
                      required
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <Label
                      htmlFor="whatsapp"
                      className="text-base font-semibold"
                    >
                      {t("whatsappLabel")}
                    </Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                      placeholder={t("whatsappPlaceholder")}
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="website"
                      className="text-base font-semibold"
                    >
                      {t("websiteLabelForm")}
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      placeholder={t("websitePlaceholder")}
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="facebook"
                      className="text-base font-semibold"
                    >
                      {t("facebookLabelForm")}
                    </Label>
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) =>
                        setFormData({ ...formData, facebook: e.target.value })
                      }
                      placeholder={t("facebookPlaceholder")}
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="ultra-card p-6 md:p-8 lg:p-10">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold gradient-text mb-8 text-center">
                {t("imageLabel")}
              </h3>
              <div className="max-w-md mx-auto">
                <ImageUpload
                  onImageChange={(image) =>
                    setFormData({ ...formData, logo: image })
                  }
                />
                {formData.logo && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-green-700 font-medium text-center">
                      ✓ New logo selected successfully
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="ultra-card p-6 md:p-8 lg:p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5"></div>
              <div className="relative z-10">
                <Button
                  type="submit"
                  className="btn-ultra text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={loading || categoriesLoading}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <LoadingSpinner size="sm" />
                      <span>{t("submittingAd")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Plus className="h-5 w-5 md:h-6 md:w-6" />
                      <span>{t("submitAdButton")}</span>
                    </div>
                  )}
                </Button>

                <p className="text-sm md:text-base text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
                  {t("termsAndConditions")}

                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddAdPage() {
  return (
    <ProtectedRoute>
      <AddAdPageContent />
    </ProtectedRoute>
  );
}