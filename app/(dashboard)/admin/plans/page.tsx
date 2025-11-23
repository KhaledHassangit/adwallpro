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
import { Plus, Edit2, Trash2, X, Check, Save, ArrowLeft, Package, DollarSign, Calendar, Tag, Palette, Star, Zap, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { useNotifications, localized } from "@/hooks/notifications";
import {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} from "@/features/plansApi";
import { Category, Plan, PlanOption, ValidationError } from "@/types/types";
import { useGetCategoriesQuery } from "@/features/categoriesApi";
import { PaginationControl } from "@/components/ui/pagination-control";

// Constants for better maintainability
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
  { value: "Basic", label: "Basic", icon: Package },
  { value: "Standard", label: "Standard", icon: Zap },
  { value: "Premium", label: "Premium", icon: Star },
  { value: "Monthly", label: "Monthly", icon: Calendar }
];

const DEFAULT_PLAN_COLORS = {
  "Basic": "#64748b",
  "Standard": "#3b82f6",
  "Premium": "#8b5cf6",
  "Monthly": "#10b981"
};

// Utility functions for better maintainability
const getPlanIcon = (planType?: string) => {
  const plan = PLAN_TYPES.find(p => p.value === planType);
  return plan ? <plan.icon className="w-5 h-5" /> : <Shield className="w-5 h-5" />;
};

const getContrastColor = (hexColor?: string) => {
  if (!hexColor) return '#ffffff';

  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
};

const getLighterColor = (hexColor?: string, percent = 20) => {
  if (!hexColor) return '#f3f4f6';

  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const newR = Math.min(255, Math.floor(r + (255 - r) * percent / 100));
  const newG = Math.min(255, Math.floor(g + (255 - g) * percent / 100));
  const newB = Math.min(255, Math.floor(b + (255 - b) * percent / 100));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

// Reusable components for better maintainability
const ColorPicker = ({ value, onChange, onReset, defaultColor, locale }: {
  value?: string;
  onChange: (color: string) => void;
  onReset: () => void;
  defaultColor: string;
  locale: string;
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium flex items-center gap-2">
      <Palette className="w-4 h-4 text-primary" />
      {locale === "ar" ? "لون الباقة" : "Plan Color"}
    </Label>
    <div className="flex items-center gap-2">
      <Input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-16 h-10 p-1 border rounded cursor-pointer"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#64748b"
        className="flex-1"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onReset}
        title={locale === "ar" ? "استخدام اللون الافتراضي" : "Use default color"}
      >
        {locale === "ar" ? "افتراضي" : "Default"}
      </Button>
    </div>
  </div>
);

const FeatureList = ({ features, onChange, onAdd, onRemove, locale }: {
  features: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  locale: string;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Check className="w-4 h-4 text-success" />
        {locale === "ar" ? "المزايا" : "Features"}
      </Label>
      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus className="w-4 h-4 mr-1" /> {locale === "ar" ? "إضافة ميزة" : "Add Feature"}
      </Button>
    </div>
    <div className="space-y-2">
      {features.map((feature, index) => (
        <div key={`feature-${index}`} className="flex gap-2">
          <Input
            value={feature}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={locale === "ar" ? "أدخل ميزة" : "Enter a feature"}
            className="flex-1"
          />
          {features.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="shrink-0 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  </div>
);

const PlanOptionEditor = ({ option, index, categories, categoriesLoading, onChange, onRemove, canRemove, locale }: {
  option: PlanOption;
  index: number;
  categories: Category[];
  categoriesLoading: boolean;
  onChange: (index: number, field: keyof PlanOption, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  locale: string;
}) => {
  const getDurationOptions = useMemo(() => {
    return DURATION_OPTIONS[locale as keyof typeof DURATION_OPTIONS] || DURATION_OPTIONS.en;
  }, [locale]);

  const getCategoryName = useCallback((category: Category) => {
    return locale === "ar" ? category.nameAr : category.nameEn;
  }, [locale]);

  const handleToggleCategory = useCallback((categoryId: string) => {
    const currentCategories = [...(option.categories || [])];
    if (currentCategories.includes(categoryId)) {
      onChange(index, 'categories', currentCategories.filter(c => c !== categoryId));
    } else {
      onChange(index, 'categories', [...currentCategories, categoryId]);
    }
  }, [option.categories, onChange, index]);

  return (
    <Card className="border-2 bg-muted/30 hover:bg-muted/50 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            {locale === "ar" ? `خيار ${index + 1}` : `Option ${index + 1}`}
          </h4>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">{locale === "ar" ? "المدة" : "Duration"}</Label>
            <Select
              value={option.duration}
              onValueChange={(value) => onChange(index, 'duration', value)}
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
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">{locale === "ar" ? "السعر بالدولار" : "Price (USD)"}</Label>
            <Input
              type="number"
              value={option.priceUSD}
              onChange={(e) => onChange(index, 'priceUSD', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">{locale === "ar" ? "نسبة الخصم (%)" : "Discount (%)"}</Label>
            <Input
              type="number"
              value={option.discountPercent}
              onChange={(e) => onChange(index, 'discountPercent', parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="1"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">{locale === "ar" ? "السعر النهائي (USD)" : "Final Price (USD)"}</Label>
            <Input
              type="number"
              value={option.finalPriceUSD?.toFixed(2)}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">{locale === "ar" ? "عدد الإعلانات" : "Ads Count"}</Label>
            <Input
              type="number"
              value={option.adsCount}
              onChange={(e) => onChange(index, 'adsCount', parseInt(e.target.value) || 0)}
              min="0"
              step="1"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground">{locale === "ar" ? "الفئات المسموح بها" : "Allowed Categories"}</Label>
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">
                  {locale === "ar" ? "جاري تحميل الفئات..." : "Loading categories..."}
                </span>
              </div>
            ) : (
              <div className="border rounded-md p-3 max-h-32 overflow-y-auto bg-background">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category._id}
                      variant={option.categories?.includes(category._id) ? "default" : "outline"}
                      className="cursor-pointer text-xs transition-all hover:scale-105"
                      onClick={() => handleToggleCategory(category._id)}
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
  );
};

// EditCard Component
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
  const textColor = getContrastColor(form.color);

  const handleOptionChange = useCallback((index: number, field: keyof PlanOption, value: any) => {
    const newOptions = [...(form.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };

    if (field === 'priceUSD' || field === 'discountPercent') {
      const price = field === 'priceUSD' ? value : newOptions[index].priceUSD;
      const discount = field === 'discountPercent' ? value : newOptions[index].discountPercent;

      const validPrice = typeof price === 'number' && price >= 0 ? price : 0;
      const validDiscount = typeof discount === 'number' && discount >= 0 && discount <= 100 ? discount : 0;

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

  const handleColorReset = useCallback(() => {
    const defaultColor = DEFAULT_PLAN_COLORS[form.planType as keyof typeof DEFAULT_PLAN_COLORS];
    if (defaultColor) {
      onFormChange({ color: defaultColor });
    }
  }, [form.planType, onFormChange]);

  return (
    <Card className="relative overflow-hidden border-2 border-dashed border-primary shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header with dynamic color */}
      <div
        className="p-6 text-white"
        style={{
          backgroundColor: form.color,
          color: textColor
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              {getPlanIcon(form.planType)}
            </div>
            <div className="flex-1 space-y-2">
              <Input
                value={form.name}
                onChange={(e) => onFormChange({ name: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 font-semibold focus:bg-white/30 transition-colors"
                placeholder={locale === "ar" ? "اسم الباقة" : "Plan Name"}
              />
              <Input
                value={form.description}
                onChange={(e) => onFormChange({ description: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 text-sm focus:bg-white/30 transition-colors"
                placeholder={locale === "ar" ? "وصف الباقة" : "Plan Description"}
              />
            </div>
          </div>
          <Badge
            className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: textColor
            }}
          >
            {form.planType}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">{locale === "ar" ? "المعلومات الأساسية" : "Basic Information"}</h3>
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
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ColorPicker
            value={form.color}
            onChange={(color) => onFormChange({ color })}
            onReset={handleColorReset}
            defaultColor={DEFAULT_PLAN_COLORS[form.planType as keyof typeof DEFAULT_PLAN_COLORS]}
            locale={locale}
          />
        </div>

        {/* Features Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">{locale === "ar" ? "المزايا" : "Features"}</h3>
          <FeatureList
            features={form.features || []}
            onChange={handleFeatureChange}
            onAdd={handleAddFeature}
            onRemove={handleRemoveFeature}
            locale={locale}
          />
        </div>

        {/* Options Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold">{locale === "ar" ? "خيارات الباقة" : "Plan Options"}</h3>
            <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
              <Plus className="w-4 h-4 mr-1" /> {locale === "ar" ? "إضافة خيار" : "Add Option"}
            </Button>
          </div>
          <div className="space-y-4">
            {form.options?.map((option, index) => (
              <PlanOptionEditor
                key={`option-${index}`}
                option={option}
                index={index}
                categories={categories}
                categoriesLoading={categoriesLoading}
                onChange={handleOptionChange}
                onRemove={handleRemoveOption}
                canRemove={form.options && form.options.length > 1}
                locale={locale}
              />
            ))}
          </div>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-3">
            <Switch
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(checked) => onFormChange({ isActive: checked })}
            />
            <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
              {form.isActive ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "غير نشط" : "Inactive")}
            </Label>
          </div>
          <Badge variant={form.isActive ? "default" : "secondary"}>
            {form.isActive ? (locale === "ar" ? "متاح للمستخدمين" : "Available to users") : (locale === "ar" ? "غير متاح" : "Unavailable")}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between bg-muted/30 border-t p-6">
        <Button variant="outline" onClick={onCancel} className="hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {locale === "ar" ? "إلغاء" : "Cancel"}
        </Button>
        <Button onClick={onSubmit} className="btn-ultra">
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
    // Ensure categories is an array before calling .find()
    if (!Array.isArray(categories)) {
      return [];
    }
    return option.categories?.map(categoryId => {
      const category = categories.find(c => c._id === categoryId);
      return category ? getCategoryName(category) : categoryId;
    }) || [];
  }, [categories, getCategoryName]);

  const textColor = getContrastColor(plan.color);

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!plan.isActive ? 'opacity-60' : ''}`}
      style={{ borderTopColor: plan.color, borderTopWidth: '4px' }}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-lg text-white"
              style={{ backgroundColor: plan.color }}
            >
              <div style={{ color: textColor }}>
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
        {/* Options Display */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">{locale === "ar" ? "الخيارات المتاحة" : "Available Options"}</h4>
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

        {/* Features Display */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">{locale === "ar" ? "المزايا" : "Features"}</h4>
          <ul className="space-y-1">
            {plan.features?.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-muted-foreground">
                <Check className="w-3 h-3 mr-2 text-success shrink-0" />
                {feature}
              </li>
            ))}
            {plan.features && plan.features.length > 3 && (
              <li className="text-sm text-muted-foreground">
                +{plan.features.length - 3} {locale === "ar" ? "مزيد من المزايا" : "more features"}
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

// Main Component
function PlansAdminPageContent() {
  const { t, locale } = useI18n();
  const notifications = useNotifications();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; plan: Plan | null }>({ open: false, plan: null });
  const [page, setPage] = useState(1);

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

  // Use the RTK Query hooks
  const { data: plansData, isLoading: plansLoading, error: plansError, refetch: refetchPlans } = useGetPlansQuery({ page, limit: 10 });
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [createPlan, { isLoading: creatingPlan }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: updatingPlan }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: deletingPlan }] = useDeletePlanMutation();

  // Extract plans and categories from the API responses
  const plans = plansData?.data?.data || [];
  const totalPages = plansData?.data?.paginationResult?.numberOfPages || 1;
  const categories = categoriesData?.data?.data || [];

  const isRTL = locale === "ar";

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
      if (!form.name.trim()) {
        notifications.error(localized("اسم الباقة مطلوب", "Plan name is required"));
        return;
      }
      if (!form.code.trim()) {
        notifications.error(localized("رمز الباقة مطلوب", "Plan code is required"));
        return;
      }
      if (!form.planType) {
        notifications.error(localized("نوع الباقة مطلوب", "Plan type is required"));
        return;
      }

      if (!form.options || form.options.length === 0) {
        notifications.error(localized("يجب أن تحتوي الباقة على خيار واحد على الأقل", "Plan must have at least one option"));
        return;
      }

      for (let i = 0; i < form.options.length; i++) {
        const option = form.options[i];
        if (!option.duration) {
          notifications.error(localized(`مدة الخيار ${i + 1} مطلوبة`, `Option ${i + 1} duration is required`));
          return;
        }
        if (typeof option.priceUSD !== 'number' || option.priceUSD < 0) {
          notifications.error(localized(`سعر الخيار ${i + 1} مطلوب`, `Option ${i + 1} price is required`));
          return;
        }
        if (typeof option.adsCount !== 'number' || option.adsCount < 0) {
          notifications.error(localized(`عدد إعلانات الخيار ${i + 1} مطلوب`, `Option ${i + 1} ads count is required`));
          return;
        }
      }

      const filteredFeatures = form.features?.filter(f => f.trim() !== "") || [];

      if (filteredFeatures.length === 0) {
        notifications.error(localized("يجب أن تحتوي الباقة على ميزة واحدة على الأقل", "Plan must have at least one feature"));
        return;
      }

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

      console.log('Submitting plan data:', updatedForm);

      if (editingId === "new") {
        await createPlan(updatedForm).unwrap();
        notifications.success(localized("تم إنشاء الباقة بنجاح", "Plan created successfully"));
      } else if (editingId) {
        await updatePlan({ id: editingId, data: updatedForm }).unwrap();
        notifications.success(localized("تم تحديث الباقة بنجاح", "Plan updated successfully"));
      }

      resetForm();
      refetchPlans();
    } catch (err: any) {
      console.error(err);
      if (err && typeof err === 'object' && 'data' in err) {
        const errorData = err.data as any;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach((error: ValidationError) => {
            notifications.error(error.msg);
          });
        } else {
          notifications.error(errorData.message || localized("فشل حفظ الباقة", "Failed to save plan"));
        }
      } else {
        notifications.error(err instanceof Error ? err.message : localized("فشل حفظ الباقة", "Failed to save plan"));
      }
    }
  }, [form, editingId, createPlan, updatePlan, resetForm, refetchPlans, locale]);

  const handleDelete = useCallback(async () => {
    if (!deleteModal.plan?._id) return;
    try {
      await deletePlan(deleteModal.plan._id).unwrap();
      notifications.success(localized("تم حذف الباقة بنجاح", "Plan deleted successfully"));
      setDeleteModal({ open: false, plan: null });
      refetchPlans();
    } catch (err: any) {
      console.error(err);
      notifications.error(err instanceof Error ? err.message : localized("فشل حذف الباقة", "Failed to delete plan"));
    }
  }, [deleteModal.plan, deletePlan, refetchPlans, locale]);

  const togglePlanStatus = useCallback(async (plan: Plan) => {
    try {
      await updatePlan({ id: plan._id!, data: { ...plan, isActive: !plan.isActive } }).unwrap();
      notifications.success(localized("تم تحديث حالة الباقة بنجاح", "Plan status updated successfully"));
      refetchPlans();
    } catch (err: any) {
      console.error(err);
      notifications.error(err instanceof Error ? err.message : localized("فشل تحديث حالة الباقة", "Failed to update plan status"));
    }
  }, [updatePlan, refetchPlans, locale]);

  const handleFormChange = useCallback((updates: Partial<Plan>) => {
    setForm(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <main className={`flex-1 p-6 sm:p-8 overflow-y-auto ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {locale === "ar" ? "باقات الاشتراك" : "Subscription Plans"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {locale === "ar" ? "إنشاء وإدارة باقات الاشتراك" : "Create and manage subscription plans"}
            </p>
          </div>
          <Button onClick={startCreate} className="flex items-center gap-2 btn-ultra">
            <Plus className="w-4 h-4" />
            {locale === "ar" ? "إنشاء باقة جديدة" : "Create New Plan"}
          </Button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plansLoading ? (
            <div className="col-span-full flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
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

        {/* Pagination Control */}
        {!plansLoading && (
          <PaginationControl
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        {/* Delete Confirmation Dialog */}
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
              <Button variant="destructive" onClick={handleDelete} disabled={deletingPlan}>
                {deletingPlan ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {locale === "ar" ? "جاري الحذف..." : "Deleting..."}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {locale === "ar" ? "حذف" : "Delete"}
                  </>
                )}
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