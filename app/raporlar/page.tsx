"use client"
import { AppShell } from "@/components/app-shell"
import { DisabledFeatureOverlay } from "@/components/disabled-feature-overlay"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"
import { BG_CARD, BORDER_SOFT, TEXT, TEXT_SUBTLE } from "@/lib/palette"

export default function ReportsPage() {
  // Simple placeholder content that will be blurred (no long extending content)
  const originalContent = (
    <div className="space-y-6">
      <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
        <CardHeader>
          <CardTitle style={{ color: TEXT }}>Satış Raporları</CardTitle>
          <CardDescription style={{ color: TEXT_SUBTLE }}>Performans analizi ve trendler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                1,247
              </div>
              <div className="text-sm" style={{ color: TEXT_SUBTLE }}>
                Toplam Satış
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                ₺28,450
              </div>
              <div className="text-sm" style={{ color: TEXT_SUBTLE }}>
                Günlük Ciro
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
        <CardHeader>
          <CardTitle style={{ color: TEXT }}>Finans Raporları</CardTitle>
          <CardDescription style={{ color: TEXT_SUBTLE }}>Gelir-gider analizi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                %23.5
              </div>
              <div className="text-sm" style={{ color: TEXT_SUBTLE }}>
                Kâr Marjı
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                ₺6,720
              </div>
              <div className="text-sm" style={{ color: TEXT_SUBTLE }}>
                Net Kâr
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <AppShell>
      <DisabledFeatureOverlay
        title="Gelişmiş Raporlama Sistemi"
        description="Bu modül, satış performansınızı detaylı olarak analiz etmenizi, finansal raporlar oluşturmanızı ve işletmenizin büyüme trendlerini takip etmenizi sağlar. Özelleştirilebilir grafikler ve detaylı tablolarla verilerinizi görselleştirin."
        icon="chart"
        reason="Bu özellik, şirketinizin talebi üzerine devre dışı bırakılmıştır."
      >
        {originalContent}
      </DisabledFeatureOverlay>
    </AppShell>
  )
}
