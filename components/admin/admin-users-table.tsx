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
import { useI18n } from "@/providers/LanguageProvider";
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
  const { t, lang } = useI18n();
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

      if (!response.ok) throw new Error(t("adminFailedToFetchUsers"));

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
      toast.error(t("adminFailedToFetchUsers"));
      // تعيين مصفوفة فارغة في حالة الخطأ لتجنب undefined
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm(t("adminDeleteUserConfirmation"))) return;

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) throw new Error(t("adminFailedToDeleteUser"));

      toast.success(t("adminUserDeletedSuccess"));
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(t("adminFailedToDeleteUser"));
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
              <TableHead>{t("adminUserName")}</TableHead>
              <TableHead>{t("adminUserEmail")}</TableHead>
              <TableHead>{t("adminUserRole")}</TableHead>
              <TableHead>{t("adminUserPhone")}</TableHead>
              <TableHead>{t("adminUserRegistrationDate")}</TableHead>
              <TableHead>{t("adminActions")}</TableHead>
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
                      {user.role === "admin" ? t("adminRoleAdmin") : t("adminRoleUser")}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString(
                      lang === "ar" ? "ar-SA" : "en-US"
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteUser(user._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("adminDelete")}
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
                  {t("adminNoUsersFound")}
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
            {t("adminPrevious")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {`${t("adminPageOf")} ${page} / ${totalPages}`}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            {t("adminNext")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}