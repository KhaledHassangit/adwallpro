"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/lang-provider"
import type { Ad } from "@/types/types"
import { MapPin, Phone, Globe, Mail, MessageCircle, Star, ExternalLink } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

function waLink(num?: string) {
  if (!num) return "#"
  const digits = num.replace(/[^\d]/g, "")
  return `https://wa.me/${digits}`
}

export function ModernAdCard({ ad }: { ad: Ad }) {
  const { t } = useI18n()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group modern-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* Loading Skeleton */}
        {!imageLoaded && <div className="absolute inset-0 skeleton" />}

        <Image
          src={ad.image || "/placeholder.svg"}
          alt={ad.companyName}
          fill
          className={cn(
            "object-cover transition-all duration-700",
            isHovered ? "scale-110" : "scale-100",
            imageLoaded ? "opacity-100" : "opacity-0",
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Logo */}
        <div className="absolute -bottom-6 left-6 z-10">
          <div className="h-12 w-12 rounded-2xl overflow-hidden ring-4 ring-background shadow-lg modern-card">
            <Image
              src={ad.logo || ad.image || "/placeholder.svg?height=80&width=80&query=logo"}
              alt={`${ad.companyName} logo`}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        </div>

        {/* VIP Badge */}
        {ad.isVip && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold border-0 shadow-lg animate-pulse">
              <Star className="h-3 w-3 mr-1 fill-current" />
              {t("vip")}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 pt-8 space-y-4">
        {/* Title & Location */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
            {ad.companyName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary-500 flex-shrink-0" />
            <span className="truncate">
              {ad.city}, {ad.country}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{ad.description}</p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 min-w-0 rounded-xl hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 bg-transparent"
          >
            <a href={`tel:${ad.phone}`}>
              <Phone className="h-4 w-4 mr-2 text-primary-600" />
              <span className="truncate">{t("phone")}</span>
            </a>
          </Button>

          {ad.whatsapp && (
            <Button asChild size="sm" className="flex-1 min-w-0 rounded-xl bg-green-600 hover:bg-green-700">
              <a href={waLink(ad.whatsapp)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                <span className="truncate">واتساب</span>
              </a>
            </Button>
          )}
        </div>

        {/* Secondary Actions */}
        <div className="flex gap-2 pt-2 border-t">
          {ad.website && (
            <Button asChild size="sm" variant="ghost" className="flex-1 rounded-xl hover:bg-primary-50">
              <a href={ad.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2 text-primary-600" />
                <span className="text-xs">الموقع</span>
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          )}

          {ad.email && (
            <Button asChild size="sm" variant="ghost" className="flex-1 rounded-xl hover:bg-primary-50">
              <a href={`mailto:${ad.email}`}>
                <Mail className="h-4 w-4 mr-2 text-primary-600" />
                <span className="text-xs">إيميل</span>
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
