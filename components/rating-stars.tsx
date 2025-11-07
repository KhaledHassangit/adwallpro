"use client"

import { Star } from 'lucide-react'
import { useState } from "react"
import { cn } from "@/lib/utils"

export function RatingStars({
  value,
  onRate,
  ariaLabel,
}: {
  value: number
  onRate?: (stars: number) => void
  ariaLabel?: string
}) {
  const [hover, setHover] = useState<number | null>(null)
  const display = hover ?? value
  return (
    <div className="flex items-center" aria-label={ariaLabel}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          className="p-0.5"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onRate?.(i)}
          aria-label={`Rate ${i}`}
        >
          <Star
            className={cn(
              "h-5 w-5",
              display >= i ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            )}
          />
        </button>
      ))}
      <span className="ms-2 text-sm text-muted-foreground">{value.toFixed(1)}</span>
    </div>
  )
}
