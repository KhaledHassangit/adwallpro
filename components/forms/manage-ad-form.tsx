"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/providers/LanguageProvider";
import { updateAdAction } from "@/app/actions";
import { Edit, Save, Trash2 } from "lucide-react";

interface ManageAdFormProps {
  ad: {
    id: string;
    companyName: string;
    description: string;
    category: string;
    country: string;
    city: string;
    phone: string;
    whatsapp?: string;
    website?: string;
    email?: string;
    image?: string;
    status: string;
    isVip: boolean;
  };
}

export function ManageAdForm({ ad }: ManageAdFormProps) {
  const { t } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(ad);

  const handleSave = () => {
    startTransition(async () => {
      await updateAdAction(ad.id, formData);
      setIsEditing(false);
      window.location.reload();
    });
  };

  return (
    <Card className="ultra-card border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 gradient-text">
          <Edit className="h-5 w-5" />
          إدارة الإعلان
        </CardTitle>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              تعديل
            </Button>
          ) : (
            <>
              <Button onClick={handleSave} disabled={isPending}>
                <Save className="h-4 w-4 mr-2" />
                {isPending ? "جاري الحفظ..." : "حفظ"}
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(ad);
                }}
                variant="outline"
              >
                إلغاء
              </Button>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="companyName">اسم الشركة</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="category">التصنيف</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">الوصف</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            disabled={!isEditing}
            rows={4}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="country">الدولة</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="city">المدينة</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="phone">الهاتف</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="whatsapp">واتساب</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp || ""}
              onChange={(e) =>
                setFormData({ ...formData, whatsapp: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="website">الموقع الإلكتروني</Label>
            <Input
              id="website"
              value={formData.website || ""}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="font-medium">حالة الإعلان</p>
            <p className="text-sm text-muted-foreground">{formData.status}</p>
          </div>
          <div>
            <p className="font-medium">نوع الخطة</p>
            <p className="text-sm text-muted-foreground">
              {formData.isVip ? "VIP" : "عادي"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

