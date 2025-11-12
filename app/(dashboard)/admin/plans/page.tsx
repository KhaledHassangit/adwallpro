"use client";

import { useEffect, useState } from "react";
import { AdminRoute } from "@/components/auth/route-guard";
import { useI18n } from "@/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, X, Check, Save, ArrowLeft, Package, DollarSign, Target, Zap, Shield, Star, Calendar, Tag, Feature, Palette } from "lucide-react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

type PlanOption = {
  duration: string;
  priceUSD: number;
  discountPercent?: number;
  finalPriceUSD?: number;
  adsCount?: number;
  categories?: string[];
  _id?: string;
};

type Plan = {
  _id?: string;
  name: string;
  code: string;
  color?: string;
  description?: string;
  planType?: string;
  options?: PlanOption[];
  features?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type PlansResponse = {
  results: number;
  paginationResult: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: Plan[];
};

// Category type based on your API response
type Category = {
  _id: string;
  nameAr: string;
  nameEn: string;
  color: string;
  slug: string;
  image?: any;
};

type CategoriesResponse = {
  results: number;
  paginationResult: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: Category[];
};

// Predefined duration options for different locales
const DURATION_OPTIONS = {
  ar: [
    { value: "1 شهر", label: "1 شهر" },
    { value: "3 أشهر", label: "3 أشهر" },
    { value: "6 أشهر", label: "6 أشهر" },
    { value: "سنة", label: "سنة" },
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" }
  ],
  en: [
    { value: "1 month", label: "1 month" },
    { value: "3 months", label: "3 months" },
    { value: "6 months", label: "6 months" },
    { value: "1 year", label: "1 year" },
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" }
  ]
};

// Predefined plan types with their colors (as defaults)
const PLAN_TYPES = [
  { value: "Basic", label: "Basic", color: "#64748b" },
  { value: "Standard", label: "Standard", color: "#3b82f6" },
  { value: "Premium", label: "Premium", color: "#8b5cf6" },
  { value: "Monthly", label: "Monthly", color: "#10b981" }
];

function PlansAdminPageContent() {
  const { t, locale } = useI18n();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; plan: Plan | null }>({ open: false, plan: null });
  
  // Default duration based on locale
  const defaultDuration = locale === "ar" ? "1 شهر" : "1 month";
  
  const [form, setForm] = useState<Plan>({ 
    name: "", 
    code: "", 
    color: "#64748b", 
    description: "", 
    planType: "Basic", 
    options: [{ 
      duration: defaultDuration, 
      priceUSD: 0, 
      discountPercent: 0, 
      finalPriceUSD: 0, 
      adsCount: 0, 
      categories: [] 
    }], 
    features: [""], 
    isActive: true 
  });

  const isRTL = locale === "ar";
  const API_BASE_URL = "http://72.60.178.180:8000/api/v1";

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
    return {};
  };

  // API request helper
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  };

  // API functions
  const getPlans = async () => {
    return apiRequest('/plans');
  };

  const getCategories = async () => {
    return apiRequest('/categories');
  };

  const createPlan = async (data: any) => {
    return apiRequest('/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const updatePlan = async (id: string, data: any) => {
    return apiRequest(`/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  const deletePlan = async (id: string) => {
    return apiRequest(`/plans/${id}`, {
      method: 'DELETE',
    });
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await getPlans() as PlansResponse;
      const data = res?.data || [];
      setPlans(data);
    } catch (err) {
      console.error(err);
      toast.error(t("failedToLoad") || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const res = await getCategories() as CategoriesResponse;
      const data = res?.data || [];
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error(t("failedToLoadCategories") || "Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Reset form with locale-specific default duration when locale changes
    resetForm();
  }, [locale]);

  const resetForm = () => {
    const defaultDuration = locale === "ar" ? "1 شهر" : "1 month";
    setForm({ 
      name: "", 
      code: "", 
      color: "#64748b", 
      description: "", 
      planType: "Basic", 
      options: [{ 
        duration: defaultDuration, 
        priceUSD: 0, 
        discountPercent: 0, 
        finalPriceUSD: 0, 
        adsCount: 0, 
        categories: [] 
      }], 
      features: [""], 
      isActive: true 
    });
    setEditingId(null);
  };

  const startCreate = () => {
    resetForm();
    setEditingId("new");
  };

  const startEdit = (plan: Plan) => {
    // Ensure features array has at least one empty item if it's empty
    const features = plan.features && plan.features.length > 0 ? plan.features : [""];
    
    setForm({ 
      ...plan,
      options: plan.options && plan.options.length > 0 
        ? [...plan.options] 
        : [{ duration: defaultDuration, priceUSD: 0, discountPercent: 0, finalPriceUSD: 0, adsCount: 0, categories: [] }],
      features
    });
    setEditingId(plan._id || null);
  };

  const confirmDelete = (plan: Plan) => {
    setDeleteModal({ open: true, plan });
  };

  const handleDelete = async () => {
    if (!deleteModal.plan?._id) return;
    try {
      await deletePlan(deleteModal.plan._id);
      toast.success(t("deleted") || "Deleted");
      setDeleteModal({ open: false, plan: null });
      fetchPlans();
    } catch (err) {
      console.error(err);
      toast.error(t("failedToDelete") || "Failed to delete");
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e && e.preventDefault();
    try {
      // Filter out empty features
      const filteredFeatures = form.features?.filter(f => f.trim() !== "") || [];
      
      const updatedOptions = form.options?.map(option => ({
        ...option,
        finalPriceUSD: option.finalPriceUSD || 
          (option.priceUSD * (1 - (option.discountPercent || 0) / 100))
      }));
      
      const updatedForm = { ...form, features: filteredFeatures, options: updatedOptions };
      
      if (editingId === "new") {
        await createPlan(updatedForm);
        toast.success(t("created") || "Created");
      } else if (editingId) {
        await updatePlan(editingId, updatedForm);
        toast.success(t("updated") || "Updated");
      }
      
      resetForm();
      fetchPlans();
    } catch (err) {
      console.error(err);
      toast.error(t("failedToSave") || "Failed to save");
    }
  };

  // Functions to handle options array
  const addOption = () => {
    const defaultDuration = locale === "ar" ? "1 شهر" : "1 month";
    setForm({
      ...form,
      options: [...(form.options || []), { 
        duration: defaultDuration, 
        priceUSD: 0, 
        discountPercent: 0, 
        finalPriceUSD: 0, 
        adsCount: 0, 
        categories: [] 
      }]
    });
  };

  const removeOption = (index: number) => {
    if (form.options && form.options.length > 1) {
      const newOptions = [...form.options];
      newOptions.splice(index, 1);
      setForm({ ...form, options: newOptions });
    }
  };

  const updateOption = (index: number, field: keyof PlanOption, value: any) => {
    const newOptions = [...(form.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    if (field === 'priceUSD' || field === 'discountPercent') {
      const price = field === 'priceUSD' ? value : newOptions[index].priceUSD;
      const discount = field === 'discountPercent' ? value : newOptions[index].discountPercent;
      newOptions[index].finalPriceUSD = price * (1 - (discount || 0) / 100);
    }
    
    setForm({ ...form, options: newOptions });
  };

  const toggleCategory = (optionIndex: number, categoryId: string) => {
    const newOptions = [...(form.options || [])];
    const categories = [...(newOptions[optionIndex].categories || [])];
    
    if (categories.includes(categoryId)) {
      newOptions[optionIndex].categories = categories.filter(c => c !== categoryId);
    } else {
      newOptions[optionIndex].categories = [...categories, categoryId];
    }
    
    setForm({ ...form, options: newOptions });
  };

  // Functions to handle features array
  const addFeature = () => {
    setForm({
      ...form,
      features: [...(form.features || []), ""]
    });
  };

  const removeFeature = (index: number) => {
    if (form.features && form.features.length > 1) {
      const newFeatures = [...form.features];
      newFeatures.splice(index, 1);
      setForm({ ...form, features: newFeatures });
    }
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(form.features || [])];
    newFeatures[index] = value;
    setForm({ ...form, features: newFeatures });
  };

  // Update plan type (but don't change color automatically)
  const updatePlanType = (value: string) => {
    setForm({ 
      ...form, 
      planType: value
      // Don't update color automatically - let user set it manually
    });
  };

  // Update color manually
  const updateColor = (value: string) => {
    setForm({ 
      ...form, 
      color: value
    });
  };

  const getPlanIcon = (planType?: string) => {
    switch (planType) {
      case 'Premium': return <Star className="w-5 h-5" />;
      case 'Standard': return <Zap className="w-5 h-5" />;
      case 'Basic': return <Package className="w-5 h-5" />;
      case 'Monthly': return <Calendar className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getPlanGradient = (planType?: string) => {
    switch (planType) {
      case 'Premium': return 'from-purple-500 to-pink-500';
      case 'Standard': return 'from-blue-500 to-cyan-500';
      case 'Basic': return 'from-gray-500 to-gray-600';
      case 'Monthly': return 'from-green-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Get locale-specific duration options
  const getDurationOptions = () => {
    return DURATION_OPTIONS[locale as keyof typeof DURATION_OPTIONS] || DURATION_OPTIONS.en;
  };

  // Get category name based on current locale
  const getCategoryName = (category: Category) => {
    return locale === "ar" ? category.nameAr : category.nameEn;
  };

  // Check if a category is selected for a specific option
  const isCategorySelected = (optionIndex: number, categoryId: string) => {
    return form.options?.[optionIndex]?.categories?.includes(categoryId) || false;
  };

  // Get selected category names for display
  const getSelectedCategoryNames = (option: PlanOption) => {
    return option.categories?.map(categoryId => {
      const category = categories.find(c => c._id === categoryId);
      return category ? getCategoryName(category) : categoryId;
    }) || [];
  };

  // Edit Card Component
  const EditCard = () => (
    <Card className="relative overflow-hidden border-2 border-dashed border-primary">
      <CardHeader className={`bg-gradient-to-r ${getPlanGradient(form.planType)} text-white`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getPlanIcon(form.planType)}
            <div>
              <Input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 mb-2"
                placeholder={locale === "ar" ? "اسم الباقة" : "Plan Name"}
              />
              <Input 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm"
                placeholder={locale === "ar" ? "وصف الباقة" : "Plan Description"}
              />
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">
            {form.planType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">{locale === "ar" ? "الرمز" : "Code"}</Label>
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder={locale === "ar" ? "مثال: BASIC" : "e.g: BASIC"} />
          </div>
          <div>
            <Label className="text-sm font-medium">{locale === "ar" ? "نوع الباقة" : "Plan Type"}</Label>
            <Select value={form.planType} onValueChange={updatePlanType}>
              <SelectTrigger>
                <SelectValue placeholder={locale === "ar" ? "اختر نوع الباقة" : "Select plan type"} />
              </SelectTrigger>
              <SelectContent>
                {PLAN_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Color Picker Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <Palette className="w-4 h-4" />
              {locale === "ar" ? "لون الباقة" : "Plan Color"}
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Input 
                id="color"
                type="color" 
                value={form.color} 
                onChange={(e) => updateColor(e.target.value)}
                className="w-16 h-10 p-1 border rounded cursor-pointer"
              />
              <Input 
                value={form.color} 
                onChange={(e) => updateColor(e.target.value)}
                placeholder="#64748b"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const planType = PLAN_TYPES.find(type => type.value === form.planType);
                  if (planType) {
                    updateColor(planType.color);
                  }
                }}
                title={locale === "ar" ? "استخدام اللون الافتراضي" : "Use default color"}
              >
                {locale === "ar" ? "افتراضي" : "Default"}
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">{locale === "ar" ? "معاينة اللون" : "Color Preview"}</Label>
            <div 
              className="mt-2 h-10 rounded-md border-2 border-gray-200" 
              style={{ backgroundColor: form.color }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">{locale === "ar" ? "المزايا" : "Features"}</Label>
            <Button type="button" variant="outline" size="sm" onClick={addFeature}>
              <Plus className="w-4 h-4 mr-1" /> {locale === "ar" ? "إضافة ميزة" : "Add Feature"}
            </Button>
          </div>
          
          {form.features?.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input 
                value={feature} 
                onChange={(e) => updateFeature(index, e.target.value)} 
                placeholder={locale === "ar" ? "أدخل ميزة" : "Enter a feature"}
              />
              {form.features.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeFeature(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">{locale === "ar" ? "خيارات الباقة" : "Plan Options"}</Label>
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
              <Plus className="w-4 h-4 mr-1" /> {locale === "ar" ? "إضافة خيار" : "Add Option"}
            </Button>
          </div>
          
          {form.options?.map((option, index) => (
            <div key={index} className="border rounded-md p-4 mb-3 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm">{locale === "ar" ? `خيار ${index + 1}` : `Option ${index + 1}`}</h4>
                {form.options && form.options.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeOption(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">{locale === "ar" ? "المدة" : "Duration"}</Label>
                  <Select 
                    value={option.duration} 
                    onValueChange={(value) => updateOption(index, 'duration', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={locale === "ar" ? "اختر المدة" : "Select duration"} />
                    </SelectTrigger>
                    <SelectContent>
                      {getDurationOptions().map((duration) => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">{locale === "ar" ? "السعر بالدولار" : "Price in USD"}</Label>
                  <Input 
                    type="number" 
                    value={option.priceUSD} 
                    onChange={(e) => updateOption(index, 'priceUSD', parseFloat(e.target.value) || 0)} 
                  />
                </div>
                <div>
                  <Label className="text-xs">{locale === "ar" ? "نسبة الخصم (%)" : "Discount (%)"}</Label>
                  <Input 
                    type="number" 
                    value={option.discountPercent} 
                    onChange={(e) => updateOption(index, 'discountPercent', parseFloat(e.target.value) || 0)} 
                  />
                </div>
                <div>
                  <Label className="text-xs">{locale === "ar" ? "السعر النهائي بالدولار" : "Final Price in USD"}</Label>
                  <Input 
                    type="number" 
                    value={option.finalPriceUSD} 
                    onChange={(e) => updateOption(index, 'finalPriceUSD', parseFloat(e.target.value) || 0)} 
                  />
                </div>
                <div>
                  <Label className="text-xs">{locale === "ar" ? "عدد الإعلانات المسموح بها" : "Allowed Ads Count"}</Label>
                  <Input 
                    type="number" 
                    value={option.adsCount} 
                    onChange={(e) => updateOption(index, 'adsCount', parseInt(e.target.value) || 0)} 
                  />
                </div>
                <div>
                  <Label className="text-xs">{locale === "ar" ? "الفئات المسموح بها" : "Allowed Categories"}</Label>
                  {categoriesLoading ? (
                    <div className="text-sm text-muted-foreground py-2">
                      {locale === "ar" ? "جاري تحميل الفئات..." : "Loading categories..."}
                    </div>
                  ) : (
                    <div className="border rounded-md p-2 max-h-24 overflow-y-auto">
                      <div className="flex flex-wrap gap-1">
                        {categories.map((category) => (
                          <Badge 
                            key={category._id} 
                            variant={isCategorySelected(index, category._id) ? "default" : "outline"}
                            className="cursor-pointer text-xs"
                            onClick={() => toggleCategory(index, category._id)}
                            style={isCategorySelected(index, category._id) ? { backgroundColor: category.color } : {}}
                          >
                            {getCategoryName(category)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="isActive" 
            checked={form.isActive} 
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })} 
          />
          <Label htmlFor="isActive" className="text-sm">{locale === "ar" ? "نشط" : "Active"}</Label>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-gray-50">
        <Button variant="outline" onClick={resetForm}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {locale === "ar" ? "إلغاء" : "Cancel"}
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="w-4 h-4 mr-2" />
          {editingId === "new" ? (locale === "ar" ? "إنشاء" : "Create") : (locale === "ar" ? "حفظ" : "Save")}
        </Button>
      </CardFooter>
    </Card>
  );

  // Display Card Component
  const DisplayCard = ({ plan }: { plan: Plan }) => (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${!plan.isActive ? 'opacity-60' : ''}`} style={{ borderTopColor: plan.color, borderTopWidth: '4px' }}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${getPlanGradient(plan.planType)} text-white`}>
              {getPlanIcon(plan.planType)}
            </div>
            <div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm mt-1">{plan.description}</CardDescription>
            </div>
          </div>
          <Badge variant={plan.planType === 'Premium' ? 'default' : plan.planType === 'Standard' ? 'secondary' : 'outline'}>
            {plan.planType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {plan.options?.map((option, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {option.duration}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {option.adsCount} {locale === "ar" ? "إعلان" : "ads"} • {option.categories?.length || 0} {locale === "ar" ? "فئة" : "categories"}
                </p>
                {option.categories && option.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {getSelectedCategoryNames(option).slice(0, 3).map((categoryName, catIdx) => (
                      <Badge key={catIdx} variant="outline" className="text-xs">
                        {categoryName}
                      </Badge>
                    ))}
                    {option.categories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{option.categories.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right">
                {option.discountPercent && option.discountPercent > 0 ? (
                  <div>
                    <span className="text-sm line-through text-muted-foreground">${option.priceUSD}</span>
                    <p className="font-bold text-lg flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {option.finalPriceUSD}
                    </p>
                    <Badge variant="destructive" className="text-xs">-{option.discountPercent}%</Badge>
                  </div>
                ) : (
                  <p className="font-bold text-lg flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {option.priceUSD}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            {locale === "ar" ? "المزايا" : "Features"}
          </h4>
          <ul className="space-y-1">
            {plan.features?.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-muted-foreground">
                <Check className="w-3 h-3 mr-2 text-green-500" />
                {feature}
              </li>
            ))}
            {plan.features && plan.features.length > 3 && (
              <li className="text-sm text-muted-foreground">
                +{plan.features.length - 3} {locale === "ar" ? "مزايا أخرى" : "more features"}
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center space-x-2">
          <Switch 
            id={`active-${plan._id}`} 
            checked={plan.isActive} 
            onCheckedChange={() => togglePlanStatus(plan)} 
          />
          <Label htmlFor={`active-${plan._id}`} className="text-sm">
            {plan.isActive ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "غير نشط" : "Inactive")}
          </Label>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => startEdit(plan)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => confirmDelete(plan)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  const togglePlanStatus = async (plan: Plan) => {
    try {
      await updatePlan(plan._id!, { ...plan, isActive: !plan.isActive });
      toast.success(t("updated") || "Updated");
      fetchPlans();
    } catch (err) {
      console.error(err);
      toast.error(t("failedToUpdate") || "Failed to update");
    }
  };

  return (
    <main className={`flex-1 p-6 sm:p-8 overflow-y-auto ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {locale === "ar" ? "باقات الاشتراك" : "Subscription Plans"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {locale === "ar" ? "إنشاء وإدارة باقات الاشتراك" : "Create and manage subscription plans"}
            </p>
          </div>
          <Button onClick={startCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {locale === "ar" ? "إنشاء باقة جديدة" : "Create New Plan"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {editingId === "new" && <EditCard />}
              {plans.map((plan) => (
                editingId === plan._id ? (
                  <EditCard key={plan._id} />
                ) : (
                  <DisplayCard key={plan._id} plan={plan} />
                )
              ))}
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                {locale === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
              </DialogTitle>
              <DialogDescription>
                {locale === "ar" 
                  ? `هل أنت متأكد من رغبتك في حذف الباقة "${deleteModal.plan?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to delete the plan "${deleteModal.plan?.name}"? This action cannot be undone.`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteModal({ open: false, plan: null })}>
                {locale === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                {locale === "ar" ? "حذف" : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

export default function PlansAdminPage() {
  return (
    <AdminRoute>
      <PlansAdminPageContent />
    </AdminRoute>
  );
}