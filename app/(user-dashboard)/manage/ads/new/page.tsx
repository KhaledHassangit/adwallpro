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
import { getCurrentUser, getAuthCookie, useUserStore } from "@/lib/auth"; // Import useUserStore
import { useI18n } from "@/providers/LanguageProvider";

interface Category {
  _id: string;
  nameAr: string;
  nameEn: string;
  color: string;
}

function AddAdPageContent() {
  const { t, lang } = useI18n();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: "",
    companyNameEn: "",
    description: "",
    descriptionEn: "",
    country: "",
    city: "",
    email: "",
    whatsapp: "",
    facebook: "",
    website: "",
    adType: "normal", // Default to "normal"
    video: "", // For VIP ads
    logo: null as string | null,
    categoryId: "", // Added missing categoryId
  });

  // *** CHANGE: Get user from store instead of getCurrentUser ***
  const { user } = useUserStore(); // Use the store directly

  // جلب الفئات من الباك إند
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const token = getAuthCookie();
      
      if (!token) {
        console.error("No auth token found");
        toast.error("Authentication required");
        return;
      }

      console.log("Fetching categories with token:", token);
      
      const response = await fetch("http://72.60.178.180:8000/api/v1/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch categories:", errorText);
        throw new Error(t("failedToFetchCategories") || "Failed to fetch categories");
      }

      const data = await response.json();
      console.log("Categories API response:", data);

      // التعامل مع هيكل الاستجابة المختلف
      let categoriesData: Category[] = [];

      // The actual categories array is at data.data.data
      if (data.data && data.data.data && Array.isArray(data.data.data)) {
        categoriesData = data.data.data;
        console.log("Using data.data.data:", categoriesData);
      } else if (data.data && Array.isArray(data.data)) {
        categoriesData = data.data;
        console.log("Using data.data:", categoriesData);
      } else if (Array.isArray(data)) {
        categoriesData = data;
        console.log("Using direct data:", categoriesData);
      } else {
        console.error("Unexpected response structure:", data);
        throw new Error(t("unexpectedServerResponse") || "Unexpected server response");
      }

      setCategories(categoriesData);
      console.log("Categories loaded successfully:", categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(t("failedToFetchCategories") || "Failed to fetch categories");
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
      // *** CHANGE: Get user ID from store instead of localStorage ***
      const userId = user?._id; // Use user from store
      
      console.log("User from store:", user);
      console.log("User ID:", userId);

      if (!userId) {
        console.error("User ID is undefined");
        toast.error("User not authenticated. Please log in again.");
        // Redirect to login page
        window.location.href = "/login";
        return;
      }

      // Check if categoryId is selected
      if (!formData.categoryId) {
        throw new Error(t("categoryRequired") || "Category is required");
      }

      // Get auth token
      const token = getAuthCookie();
      if (!token) {
        throw new Error("Authentication required");
      }

      // إنشاء FormData لإرسال البيانات
      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("companyName", formData.companyName);
      formDataToSend.append("companyNameEn", formData.companyNameEn);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("descriptionEn", formData.descriptionEn);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("whatsapp", formData.whatsapp);
      formDataToSend.append("facebook", formData.facebook);
      formDataToSend.append("website", formData.website);
      formDataToSend.append("adType", formData.adType);
      formDataToSend.append("categoryId", formData.categoryId);
      
      // Only add video if adType is "vip" and video URL is provided
      if (formData.adType === "vip" && formData.video) {
        formDataToSend.append("video", formData.video);
      }

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

      console.log("Sending request with token:", token);

      const response = await fetch("http://72.60.178.180:8000/api/v1/companies", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      // Try to get more detailed error information
      if (!response.ok) {
        let errorMessage = t("failedToAddAd") || "Failed to add ad";
        try {
          const errorData = await response.json();
          console.log("Error response:", errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.log("Could not parse error response as JSON");
          const errorText = await response.text();
          console.log("Error response as text:", errorText);
        }
        throw new Error(errorMessage);
      }

      const successData = await response.json();
      console.log("Success response:", successData);

      toast.success(t("adAddedSuccessfully") || "Ad added successfully");

      // إعادة تعيين النموذج
      setFormData({
        companyName: "",
        companyNameEn: "",
        description: "",
        descriptionEn: "",
        country: "",
        city: "",
        email: user?.email || "",
        whatsapp: "",
        facebook: "",
        website: "",
        adType: "normal",
        video: "",
        logo: null,
        categoryId: "",
      });

      // إعادة توجيه إلى صفحة الإعلانات
      window.location.href = "/manage/ads";
    } catch (error) {
      console.error("Error creating company:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("failedToAddAd") || "Failed to add ad";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: t("myAds") || "My Ads", href: "/manage/ads" },
            { label: t("addNewAd") || "Add New Ad" },
          ]}
        />

        <div className="mt-8 mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black gradient-text mb-6">
            {t("addNewAd") || "Add New Ad"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("addCompanyAndChoosePlan") || "Add your company and choose a plan"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {/* Header */}

            {/* Company Info */}
            <div className="ultra-card p-6 md:p-8 lg:p-10">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold gradient-text mb-8 text-center">
                {t("companyInfoTitle") || "Company Information"}
              </h3>

              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label
                      htmlFor="companyName"
                      className="text-base font-semibold"
                    >
                      {t("companyNameLabel") || "Company Name"}
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
                      placeholder={t("companyNamePlaceholder") || "Enter company name"}
                      required
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="companyNameEn"
                      className="text-base font-semibold"
                    >
                      {t("companyNameEnLabel") || "Company Name (English)"}
                    </Label>
                    <Input
                      id="companyNameEn"
                      value={formData.companyNameEn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyNameEn: e.target.value,
                        })
                      }
                      placeholder={t("companyNameEnPlaceholder") || "Enter company name in English"}
                      required
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label
                      htmlFor="description"
                      className="text-base font-semibold"
                    >
                      {t("companyDescriptionLabel") || "Company Description"}
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder={t("companyDescriptionPlaceholder") || "Enter company description"}
                      rows={4}
                      required
                      className="rounded-xl text-base border-2 focus:border-primary/50 transition-all duration-200 resize-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="descriptionEn"
                      className="text-base font-semibold"
                    >
                      {t("companyDescriptionEnLabel") || "Company Description (English)"}
                    </Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) =>
                        setFormData({ ...formData, descriptionEn: e.target.value })
                      }
                      placeholder={t("companyDescriptionEnPlaceholder") || "Enter company description in English"}
                      rows={4}
                      required
                      className="rounded-xl text-base border-2 focus:border-primary/50 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-semibold">
                      {t("emailLabelForm") || "Email"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder={t("emailPlaceholder") || "Enter email"}
                      required
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      {t("adTypeLabel") || "Ad Type"}
                    </Label>
                    <Select
                      value={formData.adType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, adType: value })
                      }
                      required
                    >
                      <SelectTrigger className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200">
                        <SelectValue placeholder={t("selectAdType") || "Select ad type"} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border shadow-md z-50">
                        <SelectItem value="normal">{t("normalAd") || "Normal Ad"}</SelectItem>
                        <SelectItem value="vip">{t("vipAd") || "VIP Ad"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Video URL field - only show for VIP ads */}
                {formData.adType === "vip" && (
                  <div className="space-y-3">
                    <Label htmlFor="video" className="text-base font-semibold">
                      {t("videoUrlLabel") || "Video URL"}
                    </Label>
                    <Input
                      id="video"
                      value={formData.video}
                      onChange={(e) =>
                        setFormData({ ...formData, video: e.target.value })
                      }
                      placeholder={t("videoUrlPlaceholder") || "Enter video URL"}
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                )}

                {/* Category Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    {t("selectCompanyCategory") || "Select Company Category"}
                  </Label>
                  {categoriesLoading ? (
                    <div className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                      <LoadingSpinner />
                      <span className="text-base text-muted-foreground">
                        {t("loadingCategories") || "Loading categories..."}
                      </span>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-yellow-200 rounded-xl bg-yellow-50/50">
                      <div className="text-center">
                        <Tags className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <span className="text-base text-yellow-700 font-medium">
                          {t("noCategoriesAvailable") || "No categories available"}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={fetchCategories}
                        className="text-yellow-700 border-yellow-300 hover:bg-yellow-100 rounded-xl"
                      >
                        {t("reload") || "Reload"}
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
                        <SelectValue placeholder={t("selectCategory") || "Select category"} />
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
                                {lang === "ar" ? category.nameAr : category.nameEn}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {!formData.categoryId && (
                    <p className="text-sm text-destructive mt-1">
                      {t("categoryRequired") || "Category is required"}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label
                      htmlFor="country"
                      className="text-base font-semibold"
                    >
                      {t("countryLabel") || "Country"}
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      placeholder={t("countryPlaceholder") || "Enter country"}
                      required
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-base font-semibold">
                      {t("cityLabel") || "City"}
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder={t("cityPlaceholder") || "Enter city"}
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
                      {t("whatsappLabel") || "WhatsApp"}
                    </Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                      placeholder={t("whatsappPlaceholder") || "Enter WhatsApp number"}
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="website"
                      className="text-base font-semibold"
                    >
                      {t("websiteLabelForm") || "Website"}
                    </Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      placeholder={t("websitePlaceholder") || "Enter website URL"}
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="facebook"
                      className="text-base font-semibold"
                    >
                      {t("facebookLabelForm") || "Facebook"}
                    </Label>
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) =>
                        setFormData({ ...formData, facebook: e.target.value })
                      }
                      placeholder={t("facebookPlaceholder") || "Enter Facebook URL"}
                      className="rounded-xl h-12 text-base border-2 focus:border-primary/50 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="ultra-card p-6 md:p-8 lg:p-10">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold gradient-text mb-8 text-center">
                {t("imageLabel") || "Image"}
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
                      {lang === "ar" ? "✓ تم اختيار الشعار بنجاح" : "✓ New logo selected successfully"}
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
                      <span>{t("submittingAd") || "Submitting..."}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Plus className="h-5 w-5 md:h-6 md:w-6" />
                      <span>{t("submitAdButton") || "Submit Ad"}</span>
                    </div>
                  )}
                </Button>

                <p className="text-sm md:text-base text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
                  {t("termsAndConditions") || "By submitting this form, you agree to our terms and conditions"}
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