"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/lang-provider"
import type { Ad } from "@/types/types"
import { MapPin, Phone, Globe, Mail, MessageCircle, Star } from "lucide-react"
import { useState } from "react"

function waLink(num?: string) {
  if (!num) return "#"
  const digits = num.replace(/[^\d]/g, "")
  return `https://wa.me/${digits}`
}

export function AdCard({ ad }: { ad: Ad }) {
  const { t } = useI18n()
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Card className="group soft-card soft-card-hover overflow-hidden">
      <CardHeader className="relative p-0">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {!imageLoaded && <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-sky-100 animate-pulse" />}
          <Image
            src={ad.image || "/placeholder.svg"}
            alt={ad.companyName}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Logo */}
        <div className="absolute left-4 -bottom-8 h-16 w-16 overflow-hidden rounded-xl ring-4 ring-background shadow-lg">
          <Image
            src={ad.logo || ad.image || "/placeholder.svg?height=80&width=80&query=logo"}
            alt={`${ad.companyName} logo`}
            fill
            className="object-cover"
            sizes="64px"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* VIP Badge */}
        {ad.isVip && (
          <Badge className="absolute top-3 right-3 border-0 bg-gradient-to-r from-amber-400 to-orange-400 font-bold text-black shadow-lg animate-pulse">
            <Star className="h-3 w-3 mr-1" />
            {t("vip")}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3 p-4 pt-10">
        <div className="flex items-start justify-between">
          <h3 className="text-base font-semibold leading-tight line-clamp-2 group-hover:text-sky-700 transition-colors">
            {ad.companyName}
          </h3>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">{ad.description}</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-sky-600 flex-shrink-0" />
          <span className="truncate">
            {ad.city}, {ad.country}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-2 p-4 pt-0">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="gap-1.5 bg-transparent hover:bg-sky-50 hover:border-sky-200"
        >
          <a href={`tel:${ad.phone}`}>
            <Phone className="h-4 w-4 text-sky-600" />
            <span className="hidden sm:inline">{t("phone")}</span>
          </a>
        </Button>

        {ad.whatsapp && (
          <Button asChild size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700">
            <a href={waLink(ad.whatsapp)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t("whatsapp")}</span>
            </a>
          </Button>
        )}

        {ad.website && (
          <Button asChild size="sm" variant="ghost" className="gap-1.5 hover:bg-sky-50">
            <a href={ad.website} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 text-sky-700" />
              <span className="hidden sm:inline">{t("website")}</span>
            </a>
          </Button>
        )}

        {ad.email && (
          <Button asChild size="sm" variant="ghost" className="gap-1.5 hover:bg-sky-50">
            <a href={`mailto:${ad.email}`}>
              <Mail className="h-4 w-4 text-sky-700" />
              <span className="hidden sm:inline">{t("email")}</span>
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
