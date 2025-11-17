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
import { getAuthHeaders } from "@/lib/auth";
import { Trash2 } from "@/components/ui/icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
  subscription?: {
    adsUsed: number;
    isActive: boolean;
    plan?: string;
    option?: string;
    startDate?: string;
    endDate?: string;
  };
  profileImg?: string;
  active: boolean;
  lastLogin?: string;
}

export function AdminUsersTable() {
  const { t, lang } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/users?page=${page}&limit=10`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error(t("adminSessionExpired"));
          window.location.href = "/login";
          return;
        }
        throw new Error(t("adminFailedToFetchUsers"));
      }

      const data = await response.json();

      // Updated to handle the correct API response structure
      if (data && data.data && data.data.data && Array.isArray(data.data.data.users)) {
        setUsers(data.data.data.users);
        setTotalPages(Math.ceil((data.data.results || data.data.data.users.length) / 10));
      } else {
        console.warn("Unexpected API response structure:", data);
        setUsers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(t("adminFailedToFetchUsers"));
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(
        `http://72.60.178.180:8000/api/v1/users/${userToDelete._id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error(t("adminSessionExpired"));
          window.location.href = "/login";
          return;
        }
        throw new Error(t("adminFailedToDeleteUser"));
      }

      toast.success(t("adminUserDeletedSuccess"));
      fetchUsers();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(t("adminFailedToDeleteUser"));
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Card className="ultra-card border p-6">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">{t("adminUserName")}</TableHead>
                <TableHead className="text-center">{t("adminUserEmail")}</TableHead>
                <TableHead className="text-center">{t("adminUserRole")}</TableHead>
                <TableHead className="text-center">{t("adminUserPhone")}</TableHead>
                <TableHead className="text-center">{t("adminUserSubscription")}</TableHead>
                <TableHead className="text-center">{t("adminUserRegistrationDate")}</TableHead>
                <TableHead className="text-center">{t("adminActions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.length ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium text-center">{user.name}</TableCell>
                    <TableCell className="text-center">{user.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          user.role === "admin" ? "destructive" : "secondary"
                        }
                        className="mx-auto w-fit"
                      >
                        {user.role === "admin" ? t("adminRoleAdmin") : t("adminRoleUser")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{user.phone || "-"}</TableCell>
                    <TableCell className="text-center">
                      {user.subscription ? (
                        <Badge
                          variant={user.subscription.isActive ? "default" : "outline"}
                          className="mx-auto w-fit"
                        >
                          {user.subscription.isActive ? t("adminSubscriptionActive") : t("adminSubscriptionInactive")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="mx-auto w-fit">
                          {t("adminNoSubscription")}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(user.createdAt).toLocaleDateString(
                        lang === "ar" ? "ar-SA" : "en-US"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("adminDeleteUserTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete ? 
                `${t("adminDeleteUserConfirmation")} ${userToDelete.name}?` : 
                `${t("adminDeleteUserConfirmation")} ${t("adminThisUser")}?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("adminDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}