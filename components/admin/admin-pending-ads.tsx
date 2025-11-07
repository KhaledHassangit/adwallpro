"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getPendingAds } from "@/lib/store"
import { approveAdAction, rejectAdAction } from "@/app/actions"
import { getCurrentUser } from "@/lib/auth"
import { useMemo, useTransition, useState } from "react"
import { Clock, CheckCircle, XCircle, Eye, Calendar, User, MapPin, Phone, Globe, Mail } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AdminPendingAds() {
  const [isPending, startTransition] = useTransition()
  const [selectedAd, setSelectedAd] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)

  const pendingAds = useMemo(() => getPendingAds(), [])
  const user = getCurrentUser()

  const handleApprove = (adId: string) => {
    if (!user) return
    startTransition(async () => {
      await approveAdAction(adId, user.email)
      window.location.reload()
    })
  }

  const handleReject = () => {
    if (!user || !selectedAd || !rejectionReason.trim()) return
    startTransition(async () => {
      await rejectAdAction(selectedAd, user.email, rejectionReason)
      setRejectDialogOpen(false)
      setRejectionReason("")
      setSelectedAd(null)
      window.location.reload()
    })
  }

  if (pendingAds.length === 0) {
    return (
      <Card className="ultra-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 gradient-text">
            <Clock className="h-5 w-5" />
            الطلبات المعلقة
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">لا توجد طلبات معلقة</h3>
          <p className="text-muted-foreground">جميع الطلبات تمت مراجعتها</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="ultra-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 gradient-text">
          <Clock className="h-5 w-5" />
          الطلبات المعلقة ({pendingAds.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {pendingAds.map((ad) => (
          <div key={ad.id} className="border rounded-2xl p-6 space-y-4">
            {/* Ad Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                  <Image src={ad.image || "/placeholder.svg"} alt={ad.companyName} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{ad.companyName}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {ad.city}, {ad.country}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(ad.submittedAt).toLocaleDateString("ar-SA")}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                <Clock className="h-3 w-3 mr-1" />
                معلق
              </Badge>
            </div>

            {/* Ad Details */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{ad.description}</p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-primary-600" />
                  {ad.phone}
                </div>
                {ad.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4 text-primary-600" />
                    {ad.email}
                  </div>
                )}
                {ad.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-primary-600" />
                    موقع إلكتروني
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-primary-600" />
                  {ad.ownerEmail}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    عرض التفاصيل
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{ad.companyName}</DialogTitle>
                    <DialogDescription>تفاصيل الطلب المقدم</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                      <Image src={ad.image || "/placeholder.svg"} alt={ad.companyName} fill className="object-cover" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label>اسم الشركة</Label>
                        <p className="font-medium">{ad.companyName}</p>
                      </div>
                      <div>
                        <Label>التصنيف</Label>
                        <p className="font-medium">{ad.category}</p>
                      </div>
                      <div>
                        <Label>الموقع</Label>
                        <p className="font-medium">
                          {ad.city}, {ad.country}
                        </p>
                      </div>
                      <div>
                        <Label>الهاتف</Label>
                        <p className="font-medium">{ad.phone}</p>
                      </div>
                    </div>
                    <div>
                      <Label>الوصف</Label>
                      <p className="text-sm text-muted-foreground">{ad.description}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={() => handleApprove(ad.id)}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700 rounded-xl"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                موافقة
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedAd(ad.id)
                  setRejectDialogOpen(true)
                }}
                disabled={isPending}
                className="rounded-xl"
              >
                <XCircle className="h-4 w-4 mr-2" />
                رفض
              </Button>
            </div>
          </div>
        ))}

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>رفض الطلب</DialogTitle>
              <DialogDescription>يرجى تحديد سبب رفض هذا الطلب. سيتم إرسال السبب للمستخدم.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">سبب الرفض *</Label>
                <Textarea
                  id="reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="مثال: المعلومات غير مكتملة، الصور غير واضحة، التصنيف غير مناسب..."
                  rows={4}
                  className="rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim() || isPending}>
                رفض الطلب
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
