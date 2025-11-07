"use client"

import { toast } from "sonner"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"

export type NotificationType = "success" | "error" | "warning" | "info"

interface NotificationOptions {
  title?: string
  description?: string
  duration?: number
}

export function showNotification(type: NotificationType, message: string, options?: NotificationOptions) {
  const { title, description, duration = 4000 } = options || {}

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const Icon = icons[type]

  const config = {
    duration,
    icon: <Icon className="h-5 w-5" />,
    className: `toast-${type}`,
  }

  if (title) {
    toast(title, {
      ...config,
      description: description || message,
    })
  } else {
    toast(message, config)
  }
}

// Convenience functions
export const notifications = {
  success: (message: string, options?: NotificationOptions) => showNotification("success", message, options),

  error: (message: string, options?: NotificationOptions) => showNotification("error", message, options),

  warning: (message: string, options?: NotificationOptions) => showNotification("warning", message, options),

  info: (message: string, options?: NotificationOptions) => showNotification("info", message, options),
}

// Email notification functions (for server-side use)
export async function sendApprovalEmail(email: string, companyName: string, locale: "ar" | "en" = "ar") {
  const subject = locale === "ar" ? `تم قبول إعلان شركة ${companyName}` : `Your ad for ${companyName} has been approved`

  const message =
    locale === "ar"
      ? `مبروك! تم قبول إعلان شركة ${companyName} وهو الآن مرئي للجميع على منصة AdWell.`
      : `Congratulations! Your ad for ${companyName} has been approved and is now visible to everyone on AdWell platform.`

  // In a real implementation, you would send an actual email here
  console.log(`Sending approval email to ${email}:`, { subject, message })

  return { success: true }
}

export async function sendRejectionEmail(
  email: string,
  companyName: string,
  reason: string,
  locale: "ar" | "en" = "ar",
) {
  const subject = locale === "ar" ? `تم رفض إعلان شركة ${companyName}` : `Your ad for ${companyName} has been rejected`

  const message =
    locale === "ar"
      ? `نأسف لإبلاغك أنه تم رفض إعلان شركة ${companyName}. السبب: ${reason}`
      : `We're sorry to inform you that your ad for ${companyName} has been rejected. Reason: ${reason}`

  // In a real implementation, you would send an actual email here
  console.log(`Sending rejection email to ${email}:`, { subject, message })

  return { success: true }
}

export async function sendPendingNotification(email: string, companyName: string, locale: "ar" | "en" = "ar") {
  const subject =
    locale === "ar" ? `تم استلام طلب إعلان شركة ${companyName}` : `Your ad request for ${companyName} has been received`

  const message =
    locale === "ar"
      ? `شكراً لك! تم استلام طلب إعلان شركة ${companyName} وسيتم مراجعته خلال 24-48 ساعة.`
      : `Thank you! Your ad request for ${companyName} has been received and will be reviewed within 24-48 hours.`

  // In a real implementation, you would send an actual email here
  console.log(`Sending pending notification to ${email}:`, { subject, message })

  return { success: true }
}
