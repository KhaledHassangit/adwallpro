"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/route-guard";
import { useI18n } from "@/providers/LanguageProvider";
import {
  Building2,
  PlusCircle,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  X,
  Save,
  Globe,
  Phone,
  MapPin,
  Facebook,
  Camera,
  ImageOff,
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser, getAuthCookie } from "@/lib/auth";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

// *** CHANGE 1: Updated the Company interface to match your data structure ***
interface Company {
  _id: string;
  companyName: string;
  companyNameEn?: string;
  description: string;
  descriptionEn?: string;
  categoryId: {
    _id: string;
    nameAr: string;
    nameEn: string;
    color?: string;
  };
  status: "approved" | "pending" | "rejected"; // Changed from isApproved: boolean
  createdAt: string;
  image?: string;
  logo?: any;
  email?: string;
  __v?: number;
  city?: string;
  country?: string;
  website?: string;
  whatsapp?: string;
  facebook?: string;
  slug?: string;
  ratingsQuantity?: number;
  views?: number;
  updatedAt?: string;
  userId?: string;
}

interface Category {
  _id: string;
  nameAr: string;
  nameEn: string;
  color?: string;
}

function UserAdsContent() {
  const { t, lang } = useI18n();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const currentUser = getCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    companyName: "",
    description: "",
    categoryId: "",
    city: "",
    country: "",
    website: "",
    whatsapp: "",
    facebook: "",
    image: "",
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUserCompanies();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://72.60.178.180:8000/api/v1/categories", {
        headers: {
          Authorization: `Bearer ${getAuthCookie()}`, // Changed from localStorage
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data?.data || data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchUserCompanies = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/companies/user/${currentUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthCookie()}`, // Changed from localStorage
          },
        }
      );

      if (!response.ok) throw new Error(t("failedToFetchAds"));
      const data = await response.json();
      const companies = data?.data?.data || data || [];
      console.log("Fetched user companies:", companies);
      setCompanies(companies);
    } catch (error) {
      console.error("Error fetching user companies:", error);
      toast.error(t("failedToFetchAds"));
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!editForm.companyName.trim()) {
      errors.companyName = t("companyNameRequired");
    }

    if (!editForm.description.trim()) {
      errors.description = t("descriptionRequired");
    }

    if (!editForm.categoryId) {
      errors.categoryId = t("categoryRequired");
    }

    if (editForm.website && !isValidUrl(editForm.website)) {
      errors.website = t("invalidWebsiteUrl");
    }

    if (editForm.facebook && !isValidUrl(editForm.facebook)) {
      errors.facebook = t("invalidFacebookUrl");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/companies/${companyToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAuthCookie()}`, // Changed from localStorage
          },
        }
      );

      if (response.ok) {
        setCompanies(companies.filter((company) => company._id !== companyToDelete));
        toast.success(t("adDeletedSuccessfully"));
        setDeleteModalOpen(false);
        setCompanyToDelete(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || t("failedToDeleteAd"));
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error(t("errorDuringDeletion"));
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (companyId: string) => {
    setCompanyToDelete(companyId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCompanyToDelete(null);
  };

  // Helper function to convert logo data to a usable image URL
  const getLogoImageUrl = (logo: any) => {
    if (!logo) return "";

    // If logo is already a string URL, return it
    if (typeof logo === 'string') return logo;

    // If logo is a base64 string
    if (typeof logo === 'string' && logo.startsWith('/9j/')) {
        return `data:image/jpeg;base64,${logo}`;
    }
    
    // If logo has a data property with type and data
    if (logo.data && Array.isArray(logo.data)) {
      // Convert the array of numbers to a Uint8Array
      const uint8Array = new Uint8Array(logo.data);
      
      // Create a Blob from the Uint8Array
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      
      // Create a URL for the Blob
      return URL.createObjectURL(blob);
    }
    
    return "";
  };

  const openEditModal = (company: Company) => {
    console.log("Opening edit modal for company:", company);
    setCompanyToEdit(company);
    
    // Extract category ID properly
    const categoryId = company.categoryId?._id || company.categoryId || "";
    
    // Handle image - check for both image and logo properties
    const companyImage = company.image || getLogoImageUrl(company.logo);
    
    setEditForm({
      companyName: company.companyName,
      description: company.description,
      categoryId: categoryId,
      city: company.city || "",
      country: company.country || "",
      website: company.website || "",
      whatsapp: company.whatsapp || "",
      facebook: company.facebook || "",
      image: companyImage,
    });
    setFormErrors({});
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setCompanyToEdit(null);
    setEditForm({
      companyName: "",
      description: "",
      categoryId: "",
      city: "",
      country: "",
      website: "",
      whatsapp: "",
      facebook: "",
      image: "",
    });
    setFormErrors({});
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyToEdit) return;

    if (!validateForm()) {
      toast.error(t("pleaseFixFormErrors"));
      return;
    }

    try {
      setSaving(true);
      
      // Create a copy of form data
      const formData = { ...editForm };
      
      // Handle image if it's a base64 string (newly uploaded)
      if (formData.image && formData.image.startsWith('data:')) {
        // If your API requires separate image upload, handle it here
        // For now, we'll send it as part of form data
      }
      
      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/companies/${companyToEdit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthCookie()}`, // Changed from localStorage
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const updatedCompany = responseData.data || responseData;
        
        setCompanies(
          companies.map((company) =>
            company._id === companyToEdit._id
              ? { ...company, ...updatedCompany }
              : company
          )
        );
        toast.success(t("adUpdatedSuccessfully"));
        closeEditModal();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || t("failedToUpdateAd");
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error(t("errorDuringUpdate"));
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("imageSizeLimit"));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(t("invalidImageType"));
        return;
      }

      setImageUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({ ...prev, image: reader.result as string }));
        setImageUploading(false);
      };
      reader.onerror = () => {
        toast.error(t("errorReadingImage"));
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setEditForm((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Helper function to get category name based on language
  const getCategoryName = (category: Company['categoryId']) => {
    if (!category) return t("unknown");
    
    // If category is already an object with nameAr and nameEn
    if (category.nameAr && category.nameEn) {
      return lang === "ar" ? category.nameAr : category.nameEn;
    }
    
    // If category is just an ID string, try to find it in the categories list
    if (typeof category === 'string') {
      const foundCategory = categories.find((c) => c._id === category);
      if (foundCategory) {
        return lang === "ar" ? foundCategory.nameAr : foundCategory.nameEn;
      }
    }
    
    return t("unknown");
  };

  // Helper function to get company name based on language
  const getCompanyName = (company: Company) => {
    if (lang === "ar" && company.companyName) {
      return company.companyName;
    } else if (lang === "en" && company.companyNameEn) {
      return company.companyNameEn;
    }
    return company.companyName || t("undefined");
  };

  // Helper function to get company description based on language
  const getCompanyDescription = (company: Company) => {
    if (lang === "ar" && company.description) {
      return company.description;
    } else if (lang === "en" && company.descriptionEn) {
      return company.descriptionEn;
    }
    return company.description || t("noDescription");
  };

  // *** CHANGE 2: Updated the filtering logic to use `status` ***
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && company.status === "approved") ||
      (statusFilter === "pending" && company.status !== "approved");

    return matchesSearch && matchesStatus;
  });

  // *** CHANGE 3: Updated the status badge logic to use `status` ***
  const getStatusBadge = (company: Company) => {
    if (company.status === "approved") {
      return (
        <Badge variant="default" className="bg-green-500/90 text-white">
          <CheckCircle className="h-3 w-3 mr-1" />
          {t("approvedBadge")}
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-yellow-500/90 text-white">
        <Clock className="h-3 w-3 mr-1" />
        {t("pendingBadge")}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4">
          <div className="transition-all duration-300">
              <h1 className="text-ultra-xl gradient-text mb-2">
              {t("manageAds")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("manageAccountData")}
            </p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all duration-300"
          >
            <Link href="/manage/ads/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("addNewAd")}
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="ultra-card transition-all mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <div className="flex-1 relative min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-all" />
                <input
                  type="text"
                  placeholder={t("searchAds")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border/50 rounded-lg
                   bg-background/60 backdrop-blur outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              <div className="flex flex-wrap gap-2 transition-all">
                {[
                  { key: "all", label: t("all"), count: companies.length },
                  {
                    key: "approved",
                    label: t("approved"),
                    // *** CHANGE 4: Updated the approved count to use `status` ***
                    count: companies.filter((c) => c.status === "approved").length,
                  },
                  {
                    key: "pending",
                    label: t("pending"),
                    // *** CHANGE 5: Updated the pending count to use `status` ***
                    count: companies.filter((c) => c.status !== "approved").length,
                  },
                ].map((btn) => (
                  <Button
                    key={btn.key}
                    onClick={() => setStatusFilter(btn.key)}
                    size="sm"
                    className={`transition-all duration-300 ${statusFilter === btn.key
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                        : "bg-transparent border border-border/60 text-foreground hover:bg-muted/30"
                      }`}
                  >
                    {btn.label} ({btn.count})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companies List */}
        <div className="space-y-6 transition-all duration-300">
          {filteredCompanies.length === 0 ? (
            <Card className="bg-card/40 border border-border/50 backdrop-blur-xl shadow-md transition-all duration-300 hover:shadow-lg">
              <CardContent className="py-16 text-center">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {companies.length === 0 ? t("noAds") : t("noResults")}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {companies.length === 0
                    ? t("startWithFirstAd")
                    : t("tryDifferentSearch")}
                </p>
                {companies.length === 0 && (
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all">
                    <Link href="/manage/ads/new">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      {t("addFirstAd")}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredCompanies.map((company) => (
              <Card
                key={company._id}
                className="bg-card/40 border border-border/50 backdrop-blur-xl shadow-md hover:shadow-lg transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Info Section */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {company.image || company.logo ? (
                          <img
                            src={company.image || getLogoImageUrl(company.logo)}
                            alt={getCompanyName(company)}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Building2 className="h-8 w-8 text-primary" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 break-words">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold truncate max-w-full">
                            {getCompanyName(company)}
                          </h3>
                          {getStatusBadge(company)}
                        </div>
                        <p className="text-muted-foreground text-sm mb-3 break-words line-clamp-3">
                          {getCompanyDescription(company)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{t("categoryLabel")} {getCategoryName(company.categoryId)}</span>
                          <span>•</span>
                          <span>
                            {t("views")} {company.views || 0}
                          </span>
                          <span>•</span>
                          <span>
                            {t("createdAt")}{" "}
                            {company.createdAt
                              ? new Date(company.createdAt).toLocaleDateString(
                                lang === "ar" ? "ar-SA" : "en-US"
                              )
                              : t("undefined")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Buttons Section */}
                    <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end w-full sm:w-auto">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(company)}>
                        <Edit className="h-4 w-4 mr-1" />
                        {t("edit")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteModal(company._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t("delete")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                {t("confirmDelete")}
              </DialogTitle>
              <DialogDescription>
                {t("confirmDeleteDescription")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                {t("cancel")}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteCompany}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t("deleting")}
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("delete")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                {t("editAd")}: {companyToEdit ? getCompanyName(companyToEdit) : ""}
              </DialogTitle>
              <DialogDescription>
                {t("editAdDescription")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Full-width Banner Image */}
              <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden group">
                {editForm.image ? (
                  <>
                    <img
                      src={editForm.image}
                      alt={editForm.companyName || "Company"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={handleImageClick}
                        disabled={imageUploading}
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        {t("change")}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={handleRemoveImage}
                      >
                        <ImageOff className="h-4 w-4 mr-1" />
                        {t("remove")}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 cursor-pointer hover:from-primary/20 hover:to-primary/10 transition-all"
                    onClick={handleImageClick}
                  >
                    <Camera className="h-12 w-12 text-primary/50 mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {t("dragImageOrClick")}
                    </span>
                  </div>
                )}
                {imageUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">{t("companyName")} *</Label>
                  <Input
                    id="companyName"
                    value={editForm.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className={formErrors.companyName ? "border-red-500" : ""}
                  />
                  {formErrors.companyName && (
                    <p className="text-sm text-red-500">{formErrors.companyName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId">{t("category")} *</Label>
                  <Select
                    value={editForm.categoryId}
                    onValueChange={(value) => handleInputChange("categoryId", value)}
                  >
                    <SelectTrigger className={formErrors.categoryId ? "border-red-500" : ""}>
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-md z-50">
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {lang === "ar" ? category.nameAr : category.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.categoryId && (
                    <p className="text-sm text-red-500">{formErrors.categoryId}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("description")} *</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  className={formErrors.description ? "border-red-500" : ""}
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500">{formErrors.description}</p>
                  )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {t("city")}
                  </Label>
                  <Input
                    id="city"
                    value={editForm.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {t("country")}
                  </Label>
                  <Input
                    id="country"
                    value={editForm.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">
                    <Globe className="h-4 w-4 inline mr-1" />
                    {t("websiteLabel")}
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={editForm.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className={formErrors.website ? "border-red-500" : ""}
                    placeholder="https://example.com"
                  />
                  {formErrors.website && (
                    <p className="text-sm text-red-500">{formErrors.website}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Whatsapp">
                    <Phone className="h-4 w-4 inline mr-1" />
                    {t("whatsappLabel")}
                  </Label>
                  <Input
                    id="whatsapp"
                    value={editForm.whatsapp}
                    onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook">
                  <Facebook className="h-4 w-4 inline mr-1" />
                  {t("facebookLabel")}
                </Label>
                <Input
                  id="facebook"
                  type="url"
                  value={editForm.facebook}
                  onChange={(e) => handleInputChange("facebook", e.target.value)}
                  className={formErrors.facebook ? "border-red-500" : ""}
                  placeholder="https://facebook.com/yourpage"
                />
                {formErrors.facebook && (
                  <p className="text-sm text-red-500">{formErrors.facebook}</p>
                  )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEditModal}
                  disabled={saving}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" className="btn-ultra text-white" disabled={saving || imageUploading}>
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("saving")}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t("save")}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

export default function UserAdsPage() {
  return (
    <ProtectedRoute>
      <UserAdsContent />
    </ProtectedRoute>
  );
}