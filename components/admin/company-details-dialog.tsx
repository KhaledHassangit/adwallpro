"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  User,
  Calendar,
  Globe,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "@/components/ui/icon";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { useNotifications } from "@/hooks/notifications";

interface Company {
  _id: string;
  companyName: string;
  description?: string;
  category: {
    _id: string;
    nameAr: string;
    nameEn: string;
    color: string;
  };
  country: string;
  city: string;
  address?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  logo?: string;
  images?: string[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

interface CompanyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string | null;
}

export function CompanyDetailsDialog({
  open,
  onOpenChange,
  companyId,
}: CompanyDetailsDialogProps) {
  const notifications = useNotifications();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCompanyDetails = async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://adwallpro.com/api/v1/companies/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch company details");
      }

      const data = await response.json();
      setCompany(data.data || data);
    } catch (error) {
      console.error("Error fetching company details:", error);
      const errorMessage =
        error instanceof Error ? error.message : "فشل في جلب تفاصيل الشركة";
      notifications.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && companyId) {
      fetchCompanyDetails();
    }
  }, [open, companyId]);

  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved === true) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          موافق عليها
        </Badge>
      );
    } else if (isApproved === false) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          مرفوضة
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          معلقة
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل الشركة</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!company) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الشركة</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              لم يتم العثور على تفاصيل الشركة
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            تفاصيل الشركة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Header */}
          <div className="flex items-start gap-4">
            {company.logo && (
              <img
                src={company.logo}
                alt={company.companyName}
                className="w-16 h-16 rounded-lg object-cover border"
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {company.companyName}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(company.isApproved)}
                {company.category && (
                  <Badge
                    variant="outline"
                    style={{
                      backgroundColor: company.category.color + "20",
                      color: company.category.color,
                    }}
                  >
                    {company.category.nameAr}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                معلومات الشركة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.description && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">
                    الوصف
                  </h4>
                  <p className="text-gray-600">{company.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {company.city}, {company.country}
                    </p>
                    {company.address && (
                      <p className="text-xs text-muted-foreground">
                        {company.address}
                      </p>
                    )}
                  </div>
                </div>

                {company.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                معلومات التواصل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${company.email}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {company.email}
                </a>
              </div>

              {company.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{company.phone}</span>
                </div>
              )}

              {company.whatsapp && (
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <a
                    href={`https://wa.me/${company.whatsapp.replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:underline"
                  >
                    {company.whatsapp}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Owner Information */}
          {company.user && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  معلومات صاحب الشركة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {company.user.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${company.user.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {company.user.email}
                  </a>
                </div>

                {company.user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{company.user.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Company Images */}
          {company.images && company.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>صور الشركة ({company.images.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {company.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`${company.companyName} - صورة ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(image, "_blank")}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                          انقر للتكبير
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                معلومات التوقيت
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">تاريخ التسجيل:</span>
                <span>
                  {new Date(company.createdAt).toLocaleDateString("ar-SA")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">آخر تحديث:</span>
                <span>
                  {new Date(company.updatedAt).toLocaleDateString("ar-SA")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
