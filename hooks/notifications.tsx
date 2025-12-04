"use client"

import { useCallback, type ComponentType } from "react"
import { toast } from "sonner"
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"
import type { Locale } from "@/i18n/dict"
import { useI18n } from "@/providers/LanguageProvider"

export type NotificationType = "success" | "error" | "warning" | "info"

export type LocalizedContent = string | Partial<Record<Locale, string>>

export const localized = (ar: string, en: string): LocalizedContent => ({
  ar,
  en,
})

interface BaseNotificationOptions {
  title?: LocalizedContent
  description?: LocalizedContent
  duration?: number
}

export interface NotificationOptions extends BaseNotificationOptions {
  type?: NotificationType
  message: LocalizedContent
}

export interface ShowNotificationOptions extends NotificationOptions {
  locale?: Locale
}

const icons: Record<NotificationType, ComponentType<{ className?: string }>> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const resolveLocalizedContent = (content: LocalizedContent | undefined, locale: Locale): string | undefined => {
  if (!content) return undefined
  if (typeof content === "string") return content
  return content[locale] ?? content.en ?? content.ar ?? ""
}

export function showNotification(options: ShowNotificationOptions) {
  const { type = "info", duration = 4000, message, title, description, locale = "en" } = options

  const Icon = icons[type]
  const resolvedTitle = resolveLocalizedContent(title, locale)
  const resolvedMessage = resolveLocalizedContent(message, locale)
  const resolvedDescription = resolveLocalizedContent(description, locale)

  const payload = {
    duration,
    icon: <Icon className="h-5 w-5" />,
    className: `toast-${type}`,
  }

  if (resolvedTitle) {
    toast(resolvedTitle, {
      ...payload,
      description: resolvedMessage ?? resolvedDescription,
    })
  } else {
    toast(resolvedMessage ?? resolvedDescription ?? "", payload)
  }
}

export function useNotifications() {
  const { locale } = useI18n()

  const notify = useCallback(
    (options: NotificationOptions) => {
      showNotification({ ...options, locale })
    },
    [locale],
  )

  return {
    notify,
    success: (message: LocalizedContent, options?: BaseNotificationOptions) =>
      notify({ ...(options ?? {}), message, type: "success" }),
    error: (message: LocalizedContent, options?: BaseNotificationOptions) =>
      notify({ ...(options ?? {}), message, type: "error" }),
    warning: (message: LocalizedContent, options?: BaseNotificationOptions) =>
      notify({ ...(options ?? {}), message, type: "warning" }),
    info: (message: LocalizedContent, options?: BaseNotificationOptions) =>
      notify({ ...(options ?? {}), message, type: "info" }),
  }
}

// Email notification functions (for server-side use)
export async function sendApprovalEmail(email: string, companyName: string, locale: "ar" | "en" = "ar") {
  const subject = locale === "ar" ? `تم قبول إعلان شركة ${companyName}` : `Your ad for ${companyName} has been approved`

  const message =
    locale === "ar"
      ? `مبروك! تم قبول إعلان شركة ${companyName} وهو الآن مرئي للجميع على منصة AdWall.`
      : `Congratulations! Your ad for ${companyName} has been approved and is now visible to everyone on AdWall platform.`

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
