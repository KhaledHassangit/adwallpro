"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getAllAds, getUsers } from "@/lib/store"
import { adminDeleteUserAction, deleteAdAction } from "@/app/actions"
import { useI18n } from "@/providers/lang-provider"
import { useMemo, useTransition } from "react"
import { Users, Building2, Trash2 } from "lucide-react"

export function AdminTables() {
  const { t } = useI18n()
  const [isPending, startTransition] = useTransition()

  const users = useMemo(() => getUsers(), [])
  const ads = useMemo(() => getAllAds(), [])

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Users Table */}
      <Card className="ultra-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 gradient-text">
            <Users className="h-5 w-5" />
            المستخدمون
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 5).map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-xs">{u.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {u.role === "admin" ? "أدمن" : "معلن"}
                      </span>
                    </TableCell>
                    <TableCell>{u.name || "-"}</TableCell>
                    <TableCell>
                      {u.role !== "admin" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (!confirm("حذف المستخدم؟")) return
                            startTransition(async () => {
                              await adminDeleteUserAction(u.id)
                              window.location.reload()
                            })
                          }}
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ads Table */}
      <Card className="ultra-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 gradient-text">
            <Building2 className="h-5 w-5" />
            الشركات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("companyName")}</TableHead>
                  <TableHead>{t("vip")}</TableHead>
                  <TableHead>المالك</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.slice(0, 5).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="max-w-[150px] truncate font-medium">{a.companyName}</TableCell>
                    <TableCell>
                      {a.isVip ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                          VIP
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                          عادي
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{a.ownerEmail || "-"}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (!confirm("حذف الإعلان؟")) return
                          startTransition(async () => {
                            await deleteAdAction(a.id)
                            window.location.reload()
                          })
                        }}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
