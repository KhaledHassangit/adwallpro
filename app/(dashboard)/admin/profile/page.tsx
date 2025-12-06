"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminRoute } from "@/components/auth/route-guard";
import { useI18n } from "@/providers/LanguageProvider";
import { User, Mail, Phone, Save, Loader2, AlertCircle, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore, useUserStore, getCurrentUser, refreshUserData } from "@/lib/auth";
import { useNotifications, localized } from "@/hooks/notifications";
import { useRouter } from "next/navigation";
import { useUpdateProfileMutation, useChangePasswordMutation, ValidationError, ApiError } from "@/features/profileApi";

// This file is mostly a copy of user profile page but wrapped with AdminRoute
function AdminProfileContent() {
  const { t, lang } = useI18n();
  const notifications = useNotifications();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Form data
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: ""
  });

  // Get both auth and user store functions
  const { token } = useAuthStore();
  const { user, setUser } = useUserStore();
  
  // Use the mutations from our profileApi
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || "",
      });
      setLoading(false);
    } else {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setFormData({
          name: currentUser.name,
          phone: currentUser.phone || "",
        });
      }
      setLoading(false);
    }
  }, [user, setUser]);

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return true;
    const cleanPhone = phone.replace(/\D/g, '');
    const egyptPattern = /^20[0-9]{10}$/;
    const saudiPattern = /^966[0-9]{9}$/;
    return egyptPattern.test(cleanPhone) || saudiPattern.test(cleanPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = t("nameRequired");
    }
    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      errors.phone = lang === "ar"
        ? "رقم الهاتف غير صالح. فقط أرقام مصر (20xxxxxxxxxx) أو السعودية (966xxxxxxxxxx) مقبولة"
        : "Invalid phone number. Only Egypt (20xxxxxxxxxx) or Saudi Arabia (966xxxxxxxxxx) numbers are accepted";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const updatedUser = await updateProfile({
        name: formData.name,
        phone: formData.phone,
      }).unwrap();

      await refreshUserData();

      setFormData({
        name: updatedUser.name,
        phone: updatedUser.phone || "",
      });

      notifications.success(localized("تم تحديث الملف الشخصي بنجاح", "Profile updated successfully"));
    } catch (error) {
      console.error("Error updating admin profile:", error);
      if (error && typeof error === 'object' && 'errors' in error) {
        const apiError = error as ApiError;
        const errors: Record<string, string> = {};

        apiError.errors.forEach((err) => {
          let message = err.msg;
          if (err.msg === "E-mail already in user") {
            message = lang === "ar"
              ? "البريد الإلكتروني مستخدم بالفعل"
              : "Email is already in use";
          } else if (err.msg === "Invalid phone number only accepted Egy and SA Phone numbers") {
            message = lang === "ar"
              ? "رقم الهاتف غير صالح. فقط أرقام مصر والسعودية مقبولة"
              : "Invalid phone number. Only Egypt and Saudi Arabia numbers are accepted";
          }

          errors[err.param] = message;
        });

        setFieldErrors(errors);
        notifications.error(localized("يرجى تصحيح الأخطاء", "Please correct errors"));
      } else {
        notifications.error(error instanceof Error ? error.message : t("failedToUpdateProfile"));
      }
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFieldErrors({});

    const errors: Record<string, string> = {};
    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = lang === "ar" ? "كلمة المرور الحالية مطلوبة" : "Current password is required";
    }
    if (!passwordData.password.trim()) {
      errors.password = lang === "ar" ? "كلمة المرور الجديدة مطلوبة" : "New password is required";
    } else if (passwordData.password.length < 6) {
      errors.password = lang === "ar" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters";
    }
    if (!passwordData.passwordConfirm.trim()) {
      errors.passwordConfirm = lang === "ar" ? "تأكيد كلمة المرور مطلوب" : "Password confirmation is required";
    } else if (passwordData.password !== passwordData.passwordConfirm) {
      errors.passwordConfirm = lang === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordFieldErrors(errors);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        password: passwordData.password,
        passwordConfirm: passwordData.passwordConfirm
      }).unwrap();
      
      notifications.success(localized("تم تغيير كلمة المرور بنجاح.", "Password changed successfully."));
      setPasswordData({ currentPassword: "", password: "", passwordConfirm: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      
      // Handle 401 Unauthorized
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        notifications.error(localized("الجلسة منتهية الصلاحية", "Session expired"));
        router.push("/login");
        return;
      }
      
      // Handle validation errors
      if (error && typeof error === 'object' && 'errors' in error) {
        const apiError = error as ApiError;
        const errors: Record<string, string> = {};
        
        apiError.errors.forEach((err) => {
          let message = err.msg;
          if (err.msg === "Your current password is wrong") {
            message = lang === "ar" ? "كلمة المرور الحالية غير صحيحة" : "Current password is incorrect";
          }
          errors[err.param] = message;
        });
        
        setPasswordFieldErrors(errors);
        notifications.error(localized("يرجى تصحيح الأخطاء", "Please correct errors"));
      } else {
        notifications.error(error instanceof Error ? error.message : localized("فشل تغيير كلمة المرور", "Failed to change password"));
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    if (passwordFieldErrors[field]) {
      setPasswordFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className={`flex-1 p-6 sm:p-8 overflow-y-auto ${lang === "ar" ? "text-right" : "text-left"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className={`max-w-7xl mx-auto space-y-8 ${lang === "ar" ? "lg:pl-4" : "lg:pr-4"}`}>
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#6a5af9] to-[#00c6ff] bg-clip-text text-transparent">{t("profile")}</h1>
          <p className="text-foreground mt-2 text-sm">{t("manageAccountData")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="ultra-card p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-foreground mb-4">{t("accountInformation")}</h2>
            <form onSubmit={handleSubmit} noValidate className="space-y-6 flex-1 flex flex-col">
              <div className="flex-1 space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">{t("fullName")}</Label>
                  <div className="relative mt-2">
                    <User className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground ${lang === "ar" ? "right-3" : "left-3"}`} />
                    <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className={`${lang === "ar" ? "pr-12 pl-3" : "pl-12 pr-3"} ${fieldErrors.name ? "border-red-500 focus:border-red-500" : ""}`} placeholder={lang === "ar" ? "الاسم الكامل" : "Full Name"} />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">{t("email")}</Label>
                  <div className="relative mt-2">
                    <Mail className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground ${lang === "ar" ? "right-3" : "left-3"}`} />
                    <Input id="email" type="email" disabled value={user?.email || ""} className={`disabled-input ${lang === "ar" ? "!pr-12 !pl-3" : "!pl-12 !pr-3"}`} placeholder={lang === "ar" ? "example@email.com" : "example@email.com"} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{lang === "ar" ? "لا يمكن تغيير البريد الإلكتروني. تواصل مع الدعم إذا كنت بحاجة إلى تغييره." : "Email cannot be changed. Contact support if you need to change it."}</p>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">{t("phoneNumber")}</Label>
                  <div className="relative mt-2">
                    <Phone className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground ${lang === "ar" ? "right-3" : "left-3"}`} />
                    <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className={`${lang === "ar" ? "pr-12 pl-3" : "pl-12 pr-3"} ${fieldErrors.phone ? "border-red-500 focus:border-red-500" : ""}`} placeholder={lang === "ar" ? "+20 10x xxx xxxx أو +966 5x xxx xxxx" : "+20 10x xxx xxxx or +966 5x xxx xxxx"} />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{fieldErrors.phone}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{lang === "ar" ? "مقبول: أرقام مصر (+20) والسعودية (+966) فقط" : "Accepted: Egypt (+20) and Saudi Arabia (+966) numbers only"}</p>
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-ultra w-full mt-4">
                {saving ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin inline-block" />{t("saving")}</>) : (<><Save className="h-4 w-4 mr-2 inline-block" />{t("saveChanges")}</>)}
              </button>
            </form>
          </div>

          <div className="ultra-card p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-foreground mb-4">{lang === "ar" ? "تغيير كلمة المرور" : "Change Password"}</h2>
            <form onSubmit={handlePasswordChange} noValidate className="space-y-4 flex-1 flex flex-col">
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-foreground">{lang === "ar" ? "كلمة المرور الحالية" : "Current Password"}</Label>
                  <div className="relative mt-2">
                    <Lock className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground ${lang === "ar" ? "right-3" : "left-3"}`} />
                    <Input id="currentPassword" type={showPasswords.current ? "text" : "password"} value={passwordData.currentPassword} onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)} className={`${lang === "ar" ? "!pr-12 !pl-12" : "!pl-12 !pr-12"} ${passwordFieldErrors.currentPassword ? "border-red-500 focus:border-red-500" : ""}`} placeholder={lang === "ar" ? "أدخل كلمة المرور الحالية" : "Enter current password"} />
                    <button type="button" className={`absolute top-1/2 transform -translate-y-1/2 ${lang === "ar" ? "left-3" : "right-3"} text-foreground`} onClick={() => togglePasswordVisibility('current')}>{showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                  {passwordFieldErrors.currentPassword && (<p className="text-sm text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{passwordFieldErrors.currentPassword}</p>)}
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">{lang === "ar" ? "كلمة المرور الجديدة" : "New Password"}</Label>
                  <div className="relative mt-2">
                    <Lock className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground ${lang === "ar" ? "right-3" : "left-3"}`} />
                    <Input id="password" type={showPasswords.new ? "text" : "password"} value={passwordData.password} onChange={(e) => handlePasswordInputChange("password", e.target.value)} className={`${lang === "ar" ? "!pr-12 !pl-12" : "!pl-12 !pr-12"} ${passwordFieldErrors.password ? "border-red-500 focus:border-red-500" : ""}`} placeholder={lang === "ar" ? "أدخل كلمة المرور الجديدة" : "Enter new password"} />
                    <button type="button" className={`absolute top-1/2 transform -translate-y-1/2 ${lang === "ar" ? "left-3" : "right-3"} text-foreground`} onClick={() => togglePasswordVisibility('new')}>{showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                  {passwordFieldErrors.password && (<p className="text-sm text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{passwordFieldErrors.password}</p>)}
                </div>

                <div>
                  <Label htmlFor="passwordConfirm" className="text-sm font-medium text-foreground">{lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}</Label>
                  <div className="relative mt-2">
                    <Lock className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground ${lang === "ar" ? "right-3" : "left-3"}`} />
                    <Input id="passwordConfirm" type={showPasswords.confirm ? "text" : "password"} value={passwordData.passwordConfirm} onChange={(e) => handlePasswordInputChange("passwordConfirm", e.target.value)} className={`${lang === "ar" ? "!pr-12 !pl-12" : "!pl-12 !pr-12"} ${passwordFieldErrors.passwordConfirm ? "border-red-500 focus:border-red-500" : ""}`} placeholder={lang === "ar" ? "أكد كلمة المرور الجديدة" : "Confirm new password"} />
                    <button type="button" className={`absolute top-1/2 transform -translate-y-1/2 ${lang === "ar" ? "left-3" : "right-3"} text-foreground`} onClick={() => togglePasswordVisibility('confirm')}>{showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                  {passwordFieldErrors.passwordConfirm && (<p className="text-sm text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{passwordFieldErrors.passwordConfirm}</p>)}
                </div>
              </div>

              <button type="submit" disabled={changingPassword} className="btn-ultra w-full mt-4">{changingPassword ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin inline-block" />{lang === "ar" ? "جاري التغيير..." : "Changing..."}</>) : (<><Lock className="h-4 w-4 mr-2 inline-block" />{lang === "ar" ? "تغيير كلمة المرور" : "Change Password"}</>)}</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AdminProfilePage() {
  return (
    <AdminRoute>
      <AdminProfileContent />
    </AdminRoute>
  );
}