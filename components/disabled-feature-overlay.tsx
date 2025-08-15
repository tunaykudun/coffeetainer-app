"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { BG_CARD, TEXT, TEXT_SUBTLE, ACCENT } from "@/lib/palette"
import { Lock, Calculator, TrendingUp, DollarSign, Mail } from "lucide-react"

interface DisabledFeatureOverlayProps {
  title: string
  description: string
  icon?: "calculator" | "chart" | "dollar"
  reason?: string
  children: React.ReactNode
}

export function DisabledFeatureOverlay({
  title,
  description,
  icon = "calculator",
  reason = "Bu özellik, mevcut abonelik planınıza dahil değildir.",
  children,
}: DisabledFeatureOverlayProps) {
  const getIcon = () => {
    switch (icon) {
      case "calculator":
        return <Calculator className="w-16 h-16" style={{ color: ACCENT }} />
      case "chart":
        return <TrendingUp className="w-16 h-16" style={{ color: ACCENT }} />
      case "dollar":
        return <DollarSign className="w-16 h-16" style={{ color: ACCENT }} />
      default:
        return <Calculator className="w-16 h-16" style={{ color: ACCENT }} />
    }
  }

  return (
    <div className="relative min-h-[600px]">
      {/* Blurred Background Content */}
      <div className="absolute inset-0 filter blur-sm opacity-30 pointer-events-none select-none">{children}</div>

      {/* Overlay Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
        <Card
          className="max-w-md w-full shadow-2xl"
          style={{
            backgroundColor: `${BG_CARD}F5`, // 95% opacity
            borderColor: ACCENT,
            borderWidth: "2px",
          }}
        >
          <CardContent className="p-8 text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">{getIcon()}</div>

            {/* Title */}
            <h2 className="text-2xl font-bold" style={{ color: TEXT }}>
              {title}
            </h2>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: TEXT_SUBTLE }}>
              {description}
            </p>

            {/* Status Box */}
            <div
              className="p-4 rounded-lg border-2 bg-opacity-20"
              style={{
                borderColor: ACCENT,
                backgroundColor: `${ACCENT}20`,
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="w-5 h-5" style={{ color: ACCENT }} />
                <span className="font-semibold" style={{ color: ACCENT }}>
                  Özellik Kilitli
                </span>
              </div>
              <p className="text-sm" style={{ color: TEXT }}>
                {reason}
              </p>
            </div>

            {/* Action Button */}
            <Button
              className="w-full gap-2"
              style={{
                backgroundColor: ACCENT,
                color: "#000",
                fontWeight: "600",
              }}
              onClick={() => alert("İletişim formu açılacak (demo)")}
            >
              <Mail className="w-4 w-4" />
              Daha Fazla Bilgi İçin İletişime Geçin
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
