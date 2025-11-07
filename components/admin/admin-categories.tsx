"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCategories } from "@/lib/store"
import { adminAddCategoryAction } from "@/app/actions"
import { useMemo, useTransition } from "react"
import { Grid3X3, Plus } from "lucide-react"

export function AdminCategories() {
  const [isPending, startTransition] = useTransition()
  const categories = useMemo(() => getCategories(), [])

  return (
    <Card className="ultra-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 gradient-text">
          <Grid3X3 className="h-5 w-5" />
          إدارة التصنيفات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={adminAddCategoryAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="services" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr">الاسم (عربي)</Label>
              <Input id="nameAr" name="nameAr" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameEn">Name (EN)</Label>
              <Input id="nameEn" name="nameEn" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">اللون</Label>
              <Input id="color" name="color" type="color" defaultValue="#1e88e5" className="rounded-xl h-10" />
            </div>
          </div>
          <Button type="submit" disabled={isPending} className="w-full btn-ultra">
            <Plus className="h-4 w-4 mr-2" />
            إضافة تصنيف
          </Button>
        </form>

        <div className="grid gap-3 sm:grid-cols-2">
          {categories.slice(0, 6).map((c) => (
            <div key={c.slug} className="p-3 rounded-xl bg-muted/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">{c.nameAr}</div>
                <div className="h-4 w-8 rounded-full" style={{ backgroundColor: c.color }} />
              </div>
              <div className="text-xs text-muted-foreground">{c.slug}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
