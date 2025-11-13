"use client";

import { useEffect, useState, useCallback, useMemo, memo } from "react";
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
import { Plus, Edit2, Trash2, X, Check, Save, ArrowLeft, Package, DollarSign, Calendar, Tag, Palette, Star, Zap, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Updated types to match the schema requirements
type PlanOption = {
  duration: string; // Required in schema
  priceUSD: number; // Required in schema
  discountPercent?: number; // Optional in schema with default 0
  finalPriceUSD: number; // Required in schema
  adsCount: number; // Required in schema
  categories?: string[]; // Optional in schema
  _id?: string; // Not in schema, but added by MongoDB
};

type Plan = {
  _id?: string; // Not in schema, but added by MongoDB
  name: string; // Required in schema
  code: string; // Required in schema
  color?: string; // Optional in schema
  description?: string; // Optional in schema
  planType: 'Basic' | 'Standard' | 'Premium' | 'Monthly'; // Required in schema with enum
  options: PlanOption[]; // Required in schema
  features: string[]; // Required in schema
  isActive: boolean; // Required in schema with default true
  createdAt?: string; // Added by timestamps
  updatedAt?: string; // Added by timestamps
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

const PLAN_TYPES = [
  { value: "Basic", label: "Basic" },
  { value: "Standard", label: "Standard" },
  { value: "Premium", label: "Premium" },
  { value: "Monthly", label: "Monthly" }
];

const DEFAULT_PLAN_COLORS = {
  "Basic": "#64748b",
  "Standard": "#3b82f6",
  "Premium": "#8b5cf6",
  "Monthly": "#10b981"
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

// Move EditCard outside main component to prevent recreation
type EditCardProps = {
  form: Plan;
  locale: string;
  categories: Category[];
  categoriesLoading: boolean;
  onFormChange: (updates: Partial<Plan>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isNew: boolean;
};

const EditCard = memo(({ form, locale, categories, categoriesLoading, onFormChange, onSubmit, onCancel, isNew }: EditCardProps) => {
  const getDurationOptions = useMemo(() => {
    return DURATION_OPTIONS[locale as keyof typeof DURATION_OPTIONS] || DURATION_OPTIONS.en;
  }, [locale]);

  const getCategoryName = useCallback((category: Category) => {
    return locale === "ar" ? category.nameAr : category.nameEn;
  }, [locale]);

  const handleOptionChange = useCallback((index: number, field: keyof PlanOption, value: any) => {
    const newOptions = [...(form.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };

    if (field === 'priceUSD' || field === 'discountPercent') {
      const price = field === 'priceUSD' ? value : newOptions[index].priceUSD;
      const discount = field === 'discountPercent' ? value : newOptions[index].discountPercent;
      
      // Ensure price and discount are valid numbers
      const validPrice = typeof price === 'number' && price >= 0 ? price : 0;
      const validDiscount = typeof discount === 'number' && discount >= 0 && discount <= 100 ? discount : 0;
      
      // Calculate finalPriceUSD with proper rounding
      newOptions[index].finalPriceUSD = parseFloat((validPrice * (1 - validDiscount / 100)).toFixed(2));
    }

    onFormChange({ options: newOptions });
  }, [form.options, onFormChange]);

  const handleFeatureChange = useCallback((index: number, value: string) => {
    const newFeatures = [...(form.features || [])];
    newFeatures[index] = value;
    onFormChange({ features: newFeatures });
  }, [form.features, onFormChange]);

  const handleAddOption = useCallback(() => {
    const defaultDuration = locale === "ar" ? "1 شهر" : "1 month";
    onFormChange({
      options: [...(form.options || []), {
        duration: defaultDuration,
        priceUSD: 0,
        discountPercent: 0,
        finalPriceUSD: 0,
        adsCount: 0,
        categories: []
      }]
    });
  }, [locale, form.options, onFormChange]);

  const handleRemoveOption = useCallback((index: number) => {
    if (form.options && form.options.length > 1) {
      const newOptions = [...form.options];
      newOptions.splice(index, 1);
      onFormChange({ options: newOptions });
    }
  }, [form.options, onFormChange]);

  const handleAddFeature = useCallback(() => {
    onFormChange({
      features: [...(form.features || []), ""]
    });
  }, [form.features, onFormChange]);

  const handleRemoveFeature = useCallback((index: number) => {
    if (form.features && form.features.length > 1) {
      const newFeatures = [...form.features];
      newFeatures.splice(index, 1);
      onFormChange({ features: newFeatures });
    }
  }, [form.features, onFormChange]);

  const handleToggleCategory = useCallback((optionIndex: number, categoryId: string) => {
    const newOptions = [...(form.options || [])];
    const categories = [...(newOptions[optionIndex].categories || [])];

    if (categories.includes(categoryId)) {
      newOptions[optionIndex].categories = categories.filter(c => c !== categoryId);
    } else {
      newOptions[optionIndex].categories = [...categories, categoryId];
    }

    onFormChange({ options: newOptions });
  }, [form.options, onFormChange]);

  return (
    <Card className="relative overflow-hidden border-2 border-dashed border-primary shadow-lg">
      <CardHeader className={`bg-gradient-to-r ${getPlanGradient(form.planType)}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-lg bg-white/20 text-white backdrop-blur-sm">
              {getPlanIcon(form.planType)}
            </div>
            <div className="flex-1 space-y-2">
              <Input
                value={form.name}
                onChange={(e) => onFormChange({ name: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 font-semibold"
                placeholder={locale === "ar" ? "اسم الباقة" : "Plan Name"}
              />
              <Input
                value={form.description}
                onChange={(e) => onFormChange({ description: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm"
                placeholder={locale === "ar" ? "وصف الباقة" : "Plan Description"}
              />
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            {form.planType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              {locale === "ar" ? "الرمز" : "Code"}
            </Label>
            <Input
              value={form.code}
              onChange={(e) => onFormChange({ code: e.target.value })}
              placeholder={locale === "ar" ? "مثال: BASIC" : "e.g: BASIC"}
              className="uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              {locale === "ar" ? "نوع الباقة" : "Plan Type"}
            </Label>
            <Select value={form.planType} onValueChange={(value) => onFormChange({ planType: value as Plan['planType'] })}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              {locale === "ar" ? "لون الباقة" : "Plan Color"}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={form.color}
                onChange={(e) => onFormChange({ color: e.target.value })}
                className="w-16 h-10 p-1 border rounded cursor-pointer"
              />
              <Input
                value={form.color}
                onChange={(e) => onFormChange({ color: e.target.value })}
                placeholder="#64748b"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const defaultColor = DEFAULT_PLAN_COLORS[form.planType as keyof typeof DEFAULT_PLAN_COLORS];
                  if (defaultColor) {
                    onFormChange({ color: defaultColor });
                  }
                }}
                title={locale === "ar" ? "استخدام اللون الافتراضي" : "Use default color"}
              >
                {locale === "ar" ? "افتراضي" : "Default"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">{locale === "ar" ? "معاينة اللون" : "Color Preview"}</Label>
            <div
              className="h-10 rounded-md border-2 border-border transition-all"
              style={{ backgroundColor: form.color }}
            ></div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              {locale === "ar" ? "المزايا" : "Features"}
            </Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
              <Plus className="w-4 h-4 mr-1" /> {locale === "ar" ? "إضافة ميزة" : "Add Feature"}
            </Button>
          </div>

          <div className="space-y-2">
            {form.features?.map((feature, index) => (
              <div key={`feature-${index}`} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={locale === "ar" ? "أدخل ميزة" : "Enter a feature"}
                  className="flex-1"
                />
                {form.features && form.features.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFeature(index)}
                    className="shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-info" />
              {locale === "ar" ? "خيارات الباقة" : "Plan Options"}
            </Label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
              <Plus className="w-4 h-4 mr-1" /> {locale === "ar" ? "إضافة خيار" : "Add Option"}
            </Button>
          </div>

          <div className="space-y-4">
            {form.options?.map((option, index) => (
              <Card key={`option-${index}`} className="border-2 bg-muted/30">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      {locale === "ar" ? `خيار ${index + 1}` : `Option ${index + 1}`}
                    </h4>
                    {form.options && form.options.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{locale === "ar" ? "المدة" : "Duration"}</Label>
                      <Select
                        value={option.duration}
                        onValueChange={(value) => handleOptionChange(index, 'duration', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={locale === "ar" ? "اختر المدة" : "Select duration"} />
                        </SelectTrigger>
                        <SelectContent>
                          {getDurationOptions.map((duration) => (
                            <SelectItem key={duration.value} value={duration.value}>
                              {duration.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{locale === "ar" ? "السعر بالدولار" : "Price (USD)"}</Label>
                      <Input
                        type="number"
                        value={option.priceUSD}
                        onChange={(e) => handleOptionChange(index, 'priceUSD', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{locale === "ar" ? "نسبة الخصم (%)" : "Discount (%)"}</Label>
                      <Input
                        type="number"
                        value={option.discountPercent}
                        onChange={(e) => handleOptionChange(index, 'discountPercent', parseFloat(e.target.value) || 0)}
                        min="0"
                        max="100"
                        step="1"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{locale === "ar" ? "السعر النهائي (USD)" : "Final Price (USD)"}</Label>
                      <Input
                        type="number"
                        value={option.finalPriceUSD?.toFixed(2)}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{locale === "ar" ? "عدد الإعلانات" : "Ads Count"}</Label>
                      <Input
                        type="number"
                        value={option.adsCount}
                        onChange={(e) => handleOptionChange(index, 'adsCount', parseInt(e.target.value) || 0)}
                        min="0"
                        step="1"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <Label className="text-xs text-muted-foreground">{locale === "ar" ? "الفئات المسموح بها" : "Allowed Categories"}</Label>
                      {categoriesLoading ? (
                        <div className="text-sm text-muted-foreground py-2">
                          {locale === "ar" ? "جاري تحميل الفئات..." : "Loading categories..."}
                        </div>
                      ) : (
                        <div className="border rounded-md p-2 max-h-32 overflow-y-auto bg-background">
                          <div className="flex flex-wrap gap-1.5">
                            {categories.map((category) => (
                              <Badge
                                key={category._id}
                                variant={option.categories?.includes(category._id) ? "default" : "outline"}
                                className="cursor-pointer text-xs transition-all hover:scale-105"
                                onClick={() => handleToggleCategory(index, category._id)}
                                style={option.categories?.includes(category._id) ? { backgroundColor: category.color, color: 'white' } : {}}
                              >
                                {getCategoryName(category)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Switch
            id="isActive"
            checked={form.isActive}
            onCheckedChange={(checked) => onFormChange({ isActive: checked })}
          />
          <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
            {form.isActive ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "غير نشط" : "Inactive")}
          </Label>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between bg-muted/30 border-t">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {locale === "ar" ? "إلغاء" : "Cancel"}
        </Button>
        <Button onClick={onSubmit} className="bg-gradient-to-r from-primary to-accent">
          <Save className="w-4 h-4 mr-2" />
          {isNew ? (locale === "ar" ? "إنشاء" : "Create") : (locale === "ar" ? "حفظ" : "Save")}
        </Button>
      </CardFooter>
    </Card>
  );
});

EditCard.displayName = 'EditCard';

// Display Card Component
type DisplayCardProps = {
  plan: Plan;
  locale: string;
  categories: Category[];
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
};

const DisplayCard = memo(({ plan, locale, categories, onEdit, onDelete, onToggleStatus }: DisplayCardProps) => {
  const getCategoryName = useCallback((category: Category) => {
    return locale === "ar" ? category.nameAr : category.nameEn;
  }, [locale]);

  const getSelectedCategoryNames = useCallback((option: PlanOption) => {
    return option.categories?.map(categoryId => {
      const category = categories.find(c => c._id === categoryId);
      return category ? getCategoryName(category) : categoryId;
    }) || [];
  }, [categories, getCategoryName]);

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${!plan.isActive ? 'opacity-60' : ''}`}
      style={{ borderTopColor: plan.color, borderTopWidth: '4px' }}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-r ${getPlanGradient(plan.planType)}`}
              style={{ backgroundColor: plan.color }}
            >
              <div className="text-white">
                {getPlanIcon(plan.planType)}
              </div>
            </div>
            <div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-sm mt-1">{plan.description}</CardDescription>
            </div>
          </div>
          <Badge
            variant="secondary"
            style={{ backgroundColor: `${plan.color}20`, color: plan.color, borderColor: plan.color }}
          >
            {plan.planType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {plan.options?.map((option, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
              <div className="flex-1">
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
                    <span className="text-sm line-through text-muted-foreground">${option.priceUSD?.toFixed(2)}</span>
                    <p className="font-bold text-lg flex items-center gap-1 justify-end">
                      <DollarSign className="w-4 h-4" />
                      ${option.finalPriceUSD?.toFixed(2)}
                    </p>
                    <Badge variant="destructive" className="text-xs">-{option.discountPercent}%</Badge>
                  </div>
                ) : (
                  <p className="font-bold text-lg flex items-center gap-1 justify-end">
                    <DollarSign className="w-4 h-4" />
                    ${option.priceUSD?.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            {locale === "ar" ? "المزايا" : "Features"}
          </h4>
          <ul className="space-y-1">
            {plan.features?.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-muted-foreground">
                <Check className="w-3 h-3 mr-2 text-success shrink-0" />
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

      <CardFooter className="flex justify-between items-center pt-4 border-t bg-muted/20">
        <div className="flex items-center space-x-2">
          <Switch
            id={`active-${plan._id}`}
            checked={plan.isActive}
            onCheckedChange={onToggleStatus}
          />
          <Label htmlFor={`active-${plan._id}`} className="text-sm cursor-pointer">
            {plan.isActive ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "غير نشط" : "Inactive")}
          </Label>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="hover:bg-primary hover:text-primary-foreground transition-colors">
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete} className="hover:bg-destructive hover:text-destructive-foreground transition-colors">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});

DisplayCard.displayName = 'DisplayCard';

function PlansAdminPageContent() {
  const { t, locale } = useI18n();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; plan: Plan | null }>({ open: false, plan: null });
  
  const defaultDuration = useMemo(() => locale === "ar" ? "1 شهر" : "1 month", [locale]);

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

  const getAuthHeaders = useCallback(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        console.error('Authentication token not found');
        toast.error(locale === "ar" ? "لم يتم العثور على رمز المصادقة" : "Authentication token not found");
        return {};
      }

      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }, [locale]);

  const apiRequest = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const authHeaders = getAuthHeaders();

    if (!authHeaders.Authorization) {
      throw new Error(locale === "ar" ? "مطلوب تسجيل الدخول" : "Authentication required");
    }

    // Create headers object with proper content type for POST/PUT requests
    const headers: Record<string, string> = {
      ...authHeaders,
    };

    // Only add Content-Type for requests that have a body
    if (options.body && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
      headers['Content-Type'] = 'application/json';
    }

    // Merge any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    // Log the request details for debugging
    console.log('API Request:', {
      url,
      method: config.method || 'GET',
      headers,
      body: config.body
    });

    try {
      const response = await fetch(url, config);

      // Log response status
      console.log('API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('API Response Data:', responseData);
      return responseData;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }, [getAuthHeaders, locale]);

  // API functions with explicit auth headers
  const getPlans = useCallback(async () => {
    return apiRequest('/plans', {
      method: 'GET',
    });
  }, [apiRequest]);

  const getCategories = useCallback(async () => {
    return apiRequest('/categories', {
      method: 'GET',
    });
  }, [apiRequest]);

  const createPlan = useCallback(async (data: any) => {
    // Send data directly, not wrapped in a "data" property
    return apiRequest('/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }, [apiRequest]);

  const updatePlan = useCallback(async (id: string, data: any) => {
    // Send data directly, not wrapped in a "data" property
    return apiRequest(`/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }, [apiRequest]);

  const deletePlan = useCallback(async (id: string) => {
    return apiRequest(`/plans/${id}`, {
      method: 'DELETE',
    });
  }, [apiRequest]);

  const fetchPlans = useCallback(async () => {
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
  }, [getPlans, t]);

  const fetchCategories = useCallback(async () => {
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
  }, [getCategories, t]);

  useEffect(() => {
    fetchPlans();
    fetchCategories();
  }, [fetchPlans, fetchCategories]);

  const resetForm = useCallback(() => {
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
  }, [locale]);

  const startCreate = useCallback(() => {
    resetForm();
    setEditingId("new");
  }, [resetForm]);

  const startEdit = useCallback((plan: Plan) => {
    const features = plan.features && plan.features.length > 0 ? plan.features : [""];

    setForm({
      ...plan,
      options: plan.options && plan.options.length > 0
        ? [...plan.options]
        : [{ duration: defaultDuration, priceUSD: 0, discountPercent: 0, finalPriceUSD: 0, adsCount: 0, categories: [] }],
      features
    });
    setEditingId(plan._id || null);
  }, [defaultDuration]);

  const handleSubmit = useCallback(async () => {
    try {
      // Validate required fields
      if (!form.name.trim()) {
        toast.error(locale === "ar" ? "اسم الباقة مطلوب" : "Plan name is required");
        return;
      }
      if (!form.code.trim()) {
        toast.error(locale === "ar" ? "رمز الباقة مطلوب" : "Plan code is required");
        return;
      }
      if (!form.planType) {
        toast.error(locale === "ar" ? "نوع الباقة مطلوب" : "Plan type is required");
        return;
      }

      // Validate options
      if (!form.options || form.options.length === 0) {
        toast.error(locale === "ar" ? "يجب أن تحتوي الباقة على خيار واحد على الأقل" : "Plan must have at least one option");
        return;
      }

      for (let i = 0; i < form.options.length; i++) {
        const option = form.options[i];
        if (!option.duration) {
          toast.error(locale === "ar" ? `مدة الخيار ${i + 1} مطلوبة` : `Option ${i + 1} duration is required`);
          return;
        }
        if (typeof option.priceUSD !== 'number' || option.priceUSD < 0) {
          toast.error(locale === "ar" ? `سعر الخيار ${i + 1} مطلوب` : `Option ${i + 1} price is required`);
          return;
        }
        if (typeof option.adsCount !== 'number' || option.adsCount < 0) {
          toast.error(locale === "ar" ? `عدد إعلانات الخيار ${i + 1} مطلوب` : `Option ${i + 1} ads count is required`);
          return;
        }
      }

      // Filter out empty features
      const filteredFeatures = form.features?.filter(f => f.trim() !== "") || [];

      // Ensure at least one feature
      if (filteredFeatures.length === 0) {
        toast.error(locale === "ar" ? "يجب أن تحتوي الباقة على ميزة واحدة على الأقل" : "Plan must have at least one feature");
        return;
      }

      // Calculate finalPriceUSD if not provided
      const updatedOptions = form.options?.map(option => ({
        ...option,
        finalPriceUSD: option.finalPriceUSD ||
          parseFloat((option.priceUSD * (1 - (option.discountPercent || 0) / 100)).toFixed(2))
      }));

      const updatedForm = { 
        ...form, 
        features: filteredFeatures, 
        options: updatedOptions 
      };

      // Log the data being sent for debugging
      console.log('Submitting plan data:', updatedForm);

      if (editingId === "new") {
        await createPlan(updatedForm);
        toast.success(t("created") || "Created");
      } else if (editingId) {
        await updatePlan(editingId, updatedForm);
        toast.success(t("updated") || "Updated");
      }

      resetForm();
      fetchPlans();
    } catch (err: any) {
      console.error(err);
      // Handle validation errors from the API
      if (err.message && typeof err.message === 'string') {
        try {
          const errorData = JSON.parse(err.message);
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorData.errors.forEach((error: any) => {
              toast.error(error.msg);
            });
          } else {
            toast.error(err.message);
          }
        } catch {
          toast.error(err.message || t("failedToSave") || "Failed to save");
        }
      } else {
        toast.error(t("failedToSave") || "Failed to save");
      }
    }
  }, [form, editingId, createPlan, updatePlan, resetForm, fetchPlans, t, locale]);

  const handleDelete = useCallback(async () => {
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
  }, [deleteModal.plan, deletePlan, fetchPlans, t]);

  const togglePlanStatus = useCallback(async (plan: Plan) => {
    try {
      await updatePlan(plan._id!, { ...plan, isActive: !plan.isActive });
      toast.success(t("updated") || "Updated");
      fetchPlans();
    } catch (err) {
      console.error(err);
      toast.error(t("failedToUpdate") || "Failed to update");
    }
  }, [updatePlan, fetchPlans, t]);

  const handleFormChange = useCallback((updates: Partial<Plan>) => {
    setForm(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <main className={`flex-1 p-6 sm:p-8 overflow-y-auto ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {locale === "ar" ? "باقات الاشتراك" : "Subscription Plans"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {locale === "ar" ? "إنشاء وإدارة باقات الاشتراك" : "Create and manage subscription plans"}
            </p>
          </div>
          <Button onClick={startCreate} className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent">
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
              {editingId === "new" && (
                <EditCard
                  form={form}
                  locale={locale}
                  categories={categories}
                  categoriesLoading={categoriesLoading}
                  onFormChange={handleFormChange}
                  onSubmit={handleSubmit}
                  onCancel={resetForm}
                  isNew={true}
                />
              )}
              {plans.map((plan) => (
                editingId === plan._id ? (
                  <EditCard
                    key={plan._id}
                    form={form}
                    locale={locale}
                    categories={categories}
                    categoriesLoading={categoriesLoading}
                    onFormChange={handleFormChange}
                    onSubmit={handleSubmit}
                    onCancel={resetForm}
                    isNew={false}
                  />
                ) : (
                  <DisplayCard
                    key={plan._id}
                    plan={plan}
                    locale={locale}
                    categories={categories}
                    onEdit={() => startEdit(plan)}
                    onDelete={() => setDeleteModal({ open: true, plan })}
                    onToggleStatus={() => togglePlanStatus(plan)}
                  />
                )
              ))}
            </>
          )}
        </div>

        <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, plan: deleteModal.plan })}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                {locale === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
              </DialogTitle>
              <DialogDescription>
                {locale === "ar"
                  ? `هل أنت متأكد من رغبتك في حذف الباقة "${deleteModal.plan?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to delete plan "${deleteModal.plan?.name}"? This action cannot be undone.`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteModal({ open: false, plan: null })}>
                {locale === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
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