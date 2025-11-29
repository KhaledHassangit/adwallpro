"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { useNotifications } from "@/hooks/notifications";
import { useI18n } from "@/providers/LanguageProvider";
import {
  Users,
  UserPlus,
  TrendingUp,
  Shield,
  Crown,
  Trash2,
  Search,
} from "@/components/ui/icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { PaginationControl } from "@/components/ui/pagination-control";
import { getAuthHeaders } from "@/lib/auth";

import {
  useGetUserStatsQuery,
  useGetUsersQuery,
  useCreateAdminMutation,
  useDeleteUserMutation,
} from "@/features/usersApi";
import { User } from "@/types/types";

// ==================== Main Content Component ====================
function AdminUsersContent() {
  const { t } = useI18n();
  const [showCreateAdminDialog, setShowCreateAdminDialog] = useState(false);
  const [keyword, setKeyword] = useState("");

  const { data: userStats, isLoading: statsLoading, error: statsError } =
    useGetUserStatsQuery();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container-premium pb-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  {String(t("adminUsersManagementTitle") || "Users Management")}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {String(t("adminUsersManagementDesc") || "Manage users, create admin accounts, and monitor user activity")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={String(t("searchUsers") || "Search users...")}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-8"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // Prevent form submission and trigger search
                      e.preventDefault();
                      // The search will be triggered automatically by the useGetUsersQuery hook
                    }
                  }}
                />
              </div>
              <Button
                onClick={() => setShowCreateAdminDialog(true)}
                className="btn-ultra hover:bg-primary/90"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {String(t("adminAddNewAdmin") || "Add New Admin")}
              </Button>
            </div>
          </div>

          {statsError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {String(t("adminStatsError") || "Failed to load user statistics. Please try refreshing the page.")}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="ultra-card transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {String(t("adminTotalUsers") || "Total Users")}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading
                    ? "..."
                    : userStats?.data?.data?.totalUsers?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {String(t("adminRegisteredUser") || "Registered Users")}
                </p>
              </CardContent>
            </Card>

            <Card className="ultra-card transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {String(t("adminAdmins") || "Admins")}
                </CardTitle>
                <Crown className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {statsLoading ? "..." : userStats?.data?.data?.adminsCount || "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {String(t("adminAdminAccounts") || "Admin Accounts")}
                </p>
              </CardContent>
            </Card>

            <Card className="ultra-card transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {String(t("adminRegularUsers") || "Regular Users")}
                </CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {statsLoading
                    ? "..."
                    : userStats?.data?.data?.regularUsersCount?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {String(t("adminForAdsUsers") || "Ad Users")}
                </p>
              </CardContent>
            </Card>

            <Card className="ultra-card transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {String(t("adminActiveThisWeek") || "Active This Week")}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statsLoading ? "..." : userStats?.data?.data?.activeThisWeek || "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {String(t("adminActiveLast7Days") || "Active in Last 7 Days")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <AdminUsersTable keyword={keyword} />

          {/* Create Admin Dialog */}
          <CreateAdminDialog
            open={showCreateAdminDialog}
            onOpenChange={setShowCreateAdminDialog}
          />
        </div>
      </div>
    </div>
  );
}

// ==================== Create Admin Dialog ====================
interface CreateAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateAdminDialog({ open, onOpenChange }: CreateAdminDialogProps) {
  const { t } = useI18n();
  const notifications = useNotifications();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  });

  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      notifications.error(String(t("passwordsDoNotMatch") || "Passwords do not match"));
      return;
    }

    try {
      await createAdmin(formData).unwrap();
      notifications.success(
        String(t("adminCreatedSuccessfully") || "Admin created successfully")
      );
      onOpenChange(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        phone: "",
      });
    } catch (err: any) {
      notifications.error(
        err?.data?.message ||
        String(t("failedToCreateAdmin") || "Failed to create admin")
      );
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {String(t("createAdminTitle") || "Create New Admin")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{String(t("name") || "Name")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                handleInputChange("name", e.target.value)
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="email">{String(t("email") || "Email")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="password">{String(t("password") || "Password")}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                handleInputChange("password", e.target.value)
              }
              required
              minLength={6}
            />
          </div>

          <div>
            <Label htmlFor="passwordConfirm">
              {String(t("confirmPassword") || "Confirm Password")}
            </Label>
            <Input
              id="passwordConfirm"
              type="password"
              value={formData.passwordConfirm}
              onChange={(e) =>
                handleInputChange("passwordConfirm", e.target.value)
              }
              required
              minLength={6}
            />
            {formData.passwordConfirm &&
              formData.password !== formData.passwordConfirm && (
                <p className="text-xs text-destructive mt-1">
                  {String(t("passwordsDoNotMatch") || "Passwords do not match")}
                </p>
              )}
          </div>

          <div>
            <Label htmlFor="phone">{String(t("phone") || "Phone")}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                handleInputChange("phone", e.target.value)
              }
              placeholder="+201024994092"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {String(t("cancel") || "Cancel")}
            </Button>

            <Button type="submit" className="btn-ultra" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {String(t("creating") || "Creating...")}
                </div>
              ) : (
                String(t("createAdmin") || "Create Admin")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== Users Table ====================
function AdminUsersTable({ keyword }: { keyword: string }) {
  const { t, lang } = useI18n();
  const notifications = useNotifications();
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Using the RTK Query hook instead of manual fetch
  const {
    data: usersData,
    isLoading,
    error,
    refetch
  } = useGetUsersQuery({ page, limit: 10, keyword });

  const [deleteUser] = useDeleteUserMutation();

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete._id).unwrap();
      notifications.success(String(t("adminUserDeletedSuccess") || "User deleted successfully"));
      refetch();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error: any) {
      notifications.error(
        error?.data?.message || String(t("adminFailedToDeleteUser") || "Failed to delete user")
      );
    }
  };

  // Reset to page 1 when keyword changes
  React.useEffect(() => {
    setPage(1);
  }, [keyword]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Extract users and pagination from the response
  const users = usersData?.data?.users || [];
  const totalPages = usersData?.paginationResult?.numberOfPages || 1;

  return (
    <>
      <Card className="ultra-card border p-6">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">{String(t("adminUserName") || "Name")}</TableHead>
                <TableHead className="text-center">{String(t("adminUserEmail") || "Email")}</TableHead>
                <TableHead className="text-center">{String(t("adminUserRole") || "Role")}</TableHead>
                <TableHead className="text-center">{String(t("adminUserPhone") || "Phone")}</TableHead>
                <TableHead className="text-center">{String(t("adminUserSubscription") || "Subscription")}</TableHead>
                <TableHead className="text-center">{String(t("adminUserRegistrationDate") || "Registration Date")}</TableHead>
                <TableHead className="text-center">{String(t("adminActions") || "Actions")}</TableHead>
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
                        {user.role === "admin" ? String(t("adminRoleAdmin") || "Admin") : String(t("adminRoleUser") || "User")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{user.phone || "-"}</TableCell>
                    <TableCell className="text-center">
                      {user.subscription ? (
                        <Badge
                          variant={user.subscription.isActive ? "default" : "outline"}
                          className="mx-auto w-fit"
                        >
                          {user.subscription.isActive
                            ? (String(t("adminSubscriptionActive") || "Active"))
                            : (String(t("adminSubscriptionInactive") || "Inactive"))
                          }
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="mx-auto w-fit">
                          {String(t("adminNoSubscription") || "No Subscription")}
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
                    {String(t("adminNoUsersFound") || "No users found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <PaginationControl
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{String(t("adminDeleteUserTitle") || "Delete User")}</AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete ?
                `${String(t("adminDeleteUserConfirmation") || "Are you sure you want to delete")} ${userToDelete.name}?` :
                `${String(t("adminDeleteUserConfirmation") || "Are you sure you want to delete")} ${String(t("adminThisUser") || "this user")}?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{String(t("cancel") || "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              {String(t("adminDelete") || "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ==================== Page Wrapper ====================
export default function AdminUsersPage() {
  return (
    <AdminRoute>
      <AdminUsersContent />
    </AdminRoute>
  );
}