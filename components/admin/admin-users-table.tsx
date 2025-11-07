"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/providers/lang-provider";
import { api } from "@/lib/api";
import { Edit, Trash2, MoreHorizontal } from "@/components/ui/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
}

export function AdminUsersTable() {
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/users?page=${page}&limit=10`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(typeof window !== "undefined" &&
            localStorage.getItem("auth_token")
              ? {
                  Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                }
              : {}),
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();

      // التحقق من وجود البيانات وتعيينها بشكل آمن
      if (data && data.data && Array.isArray(data.data.users)) {
        setUsers(data.data.users);
        setTotalPages(Math.ceil((data.results || data.data.users.length) / 10));
      } else {
        console.warn("Unexpected API response structure:", data);
        setUsers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("فشل في جلب المستخدمين");
      // تعيين مصفوفة فارغة في حالة الخطأ لتجنب undefined
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      const response = await fetch(
        `https://adwallpro.com/api/v1/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");

      toast.success("تم حذف المستخدم بنجاح");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("فشل في حذف المستخدم");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Card className="ultra-card border p-6">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>الدور</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>تاريخ التسجيل</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.length ? (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "admin" ? "destructive" : "secondary"
                      }
                    >
                      {user.role === "admin" ? "مدير" : "مستخدم"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteUser(user._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  لا توجد مستخدمون لعرضهم
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            السابق
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحة {page} من {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            التالي
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
