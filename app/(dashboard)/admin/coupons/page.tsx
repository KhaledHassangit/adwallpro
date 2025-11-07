"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminRoute } from "@/components/auth/route-guard";
import { useI18n } from "@/providers/lang-provider";
import { Ticket, PlusCircle } from "@/components/ui/icon";

function AdminCouponsContent() {
  const { t } = useI18n();

  // Placeholder coupons data
  const coupons = [
    { id: "c1", code: "WELCOME10", discount: "10%", active: true },
    { id: "c2", code: "SUMMER25", discount: "25%", active: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-premium pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Ticket className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {t("adminCoupons")}
                </h1>
                <p className="text-muted-foreground mt-2">{t("adminCouponsDesc")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild className="btn-ultra">
                <Link href="/admin/coupons/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t("adminCreateCoupon")}
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("adminAllCoupons")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coupons.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-lg border bg-card flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{c.code}</div>
                        <div className="text-sm text-muted-foreground">{c.discount}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={c.active ? "default" : "outline"}>
                          {c.active ? t("active") : t("inactive")}
                        </Badge>
                        <Button size="sm" variant="outline">
                          {t("edit")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCouponsPage() {
  return (
    <AdminRoute>
      <AdminCouponsContent />
    </AdminRoute>
  );
}
