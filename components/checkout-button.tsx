"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/lang-provider"

export function CheckoutButton({ couponCode }: { couponCode?: string }) {
  const { t } = useI18n()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  const onCheckout = () => {
    setLoading(true)
    startTransition(async () => {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode }),
      }).then((r) => r.json())
      if (res.ok && res.url) {
        window.location.href = res.url
      } else {
        alert(res.error || "Checkout failed")
      }
      setLoading(false)
    })
  }

  return (
    <Button onClick={onCheckout} disabled={isPending || loading}>
      {t("payNow")}
    </Button>
  )
}
