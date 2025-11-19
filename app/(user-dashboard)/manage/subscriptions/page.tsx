"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/route-guard";
import { useI18n } from "@/providers/LanguageProvider";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useGetUserSubscriptionsQuery } from  "@/api/user/userApi";
import {
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    RefreshCw,
    XCircle,
    CreditCard,
    Tag,
    Star,
    TrendingUp
} from "lucide-react";

function UserSubscriptionsContent() {
    const { t, lang } = useI18n();
    const [error, setError] = useState<string | null>(null);

    // Use the RTK Query hook for user subscriptions
    const { data: subscriptions = [], isLoading, error: apiError, refetch } = useGetUserSubscriptionsQuery();

    useEffect(() => {
        if (apiError) {
            setError(apiError.message || (t("failedToLoad") || "Failed to load subscriptions"));
        }
    }, [apiError, t]);

    const formatDate = (iso?: string) => {
        if (!iso) return "-";
        try {
            return new Date(iso).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return iso;
        }
    };

    const calculateDaysLeft = (expiresAt?: string) => {
        if (!expiresAt) return null;
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diffTime = Math.abs(expiry.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const calculateProgress = (createdAt?: string, expiresAt?: string) => {
        if (!createdAt || !expiresAt) return 0;
        const now = new Date();
        const created = new Date(createdAt);
        const expiry = new Date(expiresAt);

        const totalTime = expiry.getTime() - created.getTime();
        const elapsedTime = now.getTime() - created.getTime();

        return Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {t("active") || "Active"}
                    </Badge>
                );
            case "expired":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                        <XCircle className="w-3 h-3 mr-1" />
                        {t("expired") || "Expired"}
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                        <XCircle className="w-3 h-3 mr-1" />
                        {t("cancelled") || "Cancelled"}
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        <Clock className="w-3 h-3 mr-1" />
                        {t("pending") || "Pending"}
                    </Badge>
                );
        }
    };

    const currentUser = getCurrentUser();

    return (
        <main className={`flex-1 p-6 sm:p-8 overflow-y-auto ${lang === "ar" ? "text-right" : "text-left"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-ultra-xl gradient-text mb-2">
                            {t("subscriptionPlans") || "My Subscriptions"}</h1>
                        <p className="text-sm text-muted-foreground">{t("createAndManagePlans") || "View your active and past subscriptions"}</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                    </div>
                ) : error ? (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="pt-6">
                            <div className="text-center py-4">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <p className="text-red-700 mb-4">{error}</p>
                                <Button onClick={refetch} variant="outline">{t("retry") || "Retry"}</Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : subscriptions.length === 0 ? (
                    <Card className="text-center py-8">
                        <CardContent>
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{t("noSubscriptions") || "No subscriptions found"}</h3>
                            <p className="text-muted-foreground mb-6">{t("subscribePrompt") || "You have no active subscriptions. Visit Plans to subscribe."}</p>
                            <Button asChild>
                                <Link href="/">{t("viewPlans") || "View Plans"}</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subscriptions.map((s) => {
                            const daysLeft = calculateDaysLeft(s.expiresAt);
                            const progress = calculateProgress(s.createdAt, s.expiresAt);
                            const primaryOption = s.plan?.options?.[0];

                            return (
                                <Card key={s._id} className="overflow-hidden relative" style={{ borderTopColor: s.plan?.color || "#ddd", borderTopWidth: "4px" }}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: s.plan?.color || "#ddd" }}
                                                />
                                                <CardTitle className="text-lg">{s.plan?.name}</CardTitle>
                                            </div>
                                            {getStatusBadge(s.status)}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{s.plan?.description}</p>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">{t("planCode") || "Plan Code"}</span>
                                            <span className=" text-sm  px-2 py-1 ">{s.plan?.code}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">{t("planType") || "Plan Type"}</span>
                                            <span className="font-medium">{s.plan?.planType}</span>
                                        </div>

                                        {primaryOption && (
                                            <>
                                                <Separator />
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">{t("duration") || "Duration"}</span>
                                                        <span className="font-medium">{primaryOption.duration}</span>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">{t("price") || "Price"}</span>
                                                        <div className="flex items-center gap-2">
                                                            {primaryOption.discountPercent && (
                                                                <span className="text-sm line-through text-muted-foreground">${primaryOption.priceUSD}</span>
                                                            )}
                                                            <span className="font-bold text-lg">${primaryOption.finalPriceUSD || primaryOption.priceUSD}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">{t("adsIncluded") || "Ads Included"}</span>
                                                        <span className="font-medium">{primaryOption.adsCount}</span>
                                                    </div>

                                                    <div>
                                                        <span className="text-sm text-muted-foreground">{t("categories") || "Categories"}</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {primaryOption.categories.map((cat, idx) => (
                                                                <Badge key={idx} variant="outline" className="text-xs">{cat}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <Separator />

                                        <div>
                                            <h4 className="font-medium mb-2">{t("features") || "Features"}</h4>
                                            <ul className="space-y-1">
                                                {s.plan?.features?.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">{t("subscriptionStatus") || "Status"}</span>
                                                {getStatusBadge(s.status)}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">{t("expiresAt") || "Expires At"}</span>
                                                <span className="font-medium">{formatDate(s.expiresAt)}</span>
                                            </div>

                                            {s.status === "active" && daysLeft !== null && (
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">{t("timeLeft") || "Time Left"}</span>
                                                        <span className="font-medium">{daysLeft} {t("days") || "days"}</span>
                                                    </div>
                                                    <Progress value={100 - progress} className="h-2" />
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-3 flex gap-2">
                                        {s.status === "active" ? (
                                            <Button className="flex-1" variant="outline">
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                {t("renew") || "Renew"}
                                            </Button>
                                        ) : (
                                            <Button className="flex-1">
                                                <CreditCard className="w-4 h-4 mr-2" />
                                                {t("subscribe") || "Subscribe"}
                                            </Button>
                                        )}

                                        <Button variant="outline" size="sm">
                                            <Tag className="w-4 h-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}

export default function UserSubscriptionsPage() {
    return (
        <ProtectedRoute>
            <UserSubscriptionsContent />
        </ProtectedRoute>
    );
}