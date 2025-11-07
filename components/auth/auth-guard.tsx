"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getCurrentUser, isAdmin, type User } from "@/lib/auth"
import { SignInDialog } from "@/components/auth/sign-in-dialog"
import { LoadingSpinner } from "@/components/common/loading-spinner"
import { Shield, AlertTriangle } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export function AuthGuard({ children, requireAdmin = false, fallback }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      fallback || (
        <div className="max-w-md mx-auto mt-20">
          <div className="ultra-card p-8 text-center">
            <Shield className="h-16 w-16 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold gradient-text mb-4">تسجيل الدخول مطلوب</h2>
            <p className="text-muted-foreground mb-6">يجب تسجيل الدخول للوصول إلى هذه الصفحة</p>
            <SignInDialog />
          </div>
        </div>
      )
    )
  }

  if (requireAdmin && !isAdmin(user)) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="ultra-card p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">غير مصرح</h2>
          <p className="text-muted-foreground mb-4">ليس لديك صلاحيات للوصول إلى لوحة التحكم</p>
          <p className="text-sm text-muted-foreground">
            الدور الحالي: <span className="font-semibold">{user.role}</span>
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
