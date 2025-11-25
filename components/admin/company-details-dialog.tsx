// src/components/admin/company-details-dialog.tsx

"use client";

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
import { useI18n } from "@/providers/LanguageProvider";

// Update the Company interface to match your API response
interface Company {
  _id: string;
  companyName: string;
  companyNameEn: string;
  description: string;
  descriptionEn: string;
  logo: string;
  logoUrl: string;
  country: string;
  city: string;
  email: string;
  whatsapp: string;
  facebook: string;
  website: string;
  status: string;
  adType: string;
  ratingsQuantity: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  isApproved: boolean;
  userId: {
    _id: string;
    name: string;
    email: string;
    id: string;
  };
  categoryId: {
    nameAr: string;
    nameEn: string;
    color: string;
    id: string | null;
  };
}

interface CompanyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
}

export function CompanyDetailsDialog({
  open,
  onOpenChange,
  company,
}: CompanyDetailsDialogProps) {
  const { t, lang } = useI18n();

  // Get status badge based on isApproved property
  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved === true) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {String(t("adminApproved") || "Approved")}
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {String(t("adminPending") || "Pending")}
        </Badge>
      );
    }
  };

  if (!company) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{String(t("adminCompanyDetails") || "Company Details")}</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {String(t("adminCompanyDetailsNotFound") || "Company details not found")}
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
            {String(t("adminCompanyDetails") || "Company Details")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Banner with Logo */}
          <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.companyName}
                className="w-full h-full object-cover"
                onError={(e) => { 
                  (e.target as HTMLImageElement).src = ""; 
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="h-16 w-16 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-3xl font-bold mb-2">
                {company.companyName}
              </h2>
              <div className="flex items-center gap-2">
                {getStatusBadge(company.isApproved)}
                {company.categoryId && (
                  <Badge
                    variant="outline"
                    className="bg-white/20 text-white border-white/30"
                  >
                    {company.categoryId.nameAr}
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
                {String(t("adminCompanyInfo") || "Company Information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.description && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">
                    {String(t("adminDescription") || "Description")}
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
                {String(t("adminContactInfo") || "Contact Information")}
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
          {company.userId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {String(t("adminOwnerInfo") || "Owner Information")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {company.userId.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${company.userId.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {company.userId.email}
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {String(t("adminTimestampInfo") || "Timestamp Information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{String(t("adminRegistrationDate") || "Registration Date")}:</span>
                <span>
                  {new Date(company.createdAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{String(t("adminLastUpdated") || "Last Updated")}:</span>
                <span>
                  {new Date(company.updatedAt).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{String(t("totalViews") || "Views")}:</span>
                <span>{company.views}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {String(t("adminClose") || "Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}