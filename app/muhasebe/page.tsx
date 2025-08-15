"use client"

import type React from "react"
import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { DisabledFeatureOverlay } from "@/components/disabled-feature-overlay"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BG_CARD, BORDER_SOFT, TEXT, TEXT_SUBTLE, ACCENT, WARNING } from "@/lib/palette"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { DollarSign, TrendingUp, TrendingDown, Download, FileText, CreditCard, Wallet, Target } from "lucide-react"

// Mock data
const monthlyRevenue = [
  { month: "Oca", revenue: 45000, expenses: 32000, profit: 13000 },
  { month: "Şub", revenue: 52000, expenses: 35000, profit: 17000 },
  { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
  { month: "Nis", revenue: 61000, expenses: 38000, profit: 23000 },
  { month: "May", revenue: 55000, expenses: 36000, profit: 19000 },
  { month: "Haz", revenue: 67000, expenses: 41000, profit: 26000 },
]

const dailyTransactions = [
  { day: "Pzt", income: 8500, expense: 3200 },
  { day: "Sal", income: 7200, expense: 2800 },
  { day: "Çar", income: 9800, expense: 3600 },
  { day: "Per", income: 8900, expense: 3100 },
  { day: "Cum", income: 12400, expense: 4200 },
  { day: "Cmt", income: 15600, expense: 5100 },
  { day: "Paz", income: 11200, expense: 3800 },
]

const expenseCategories = [
  { name: "Personel", value: 45, amount: 18000, color: ACCENT },
  { name: "Malzeme", value: 25, amount: 10000, color: "#00D4AA" },
  { name: "Kira", value: 15, amount: 6000, color: WARNING },
  { name: "Utilities", value: 10, amount: 4000, color: "#8B5CF6" },
  { name: "Diğer", value: 5, amount: 2000, color: "#6B7280" },
]

const recentTransactions = [
  { id: 1, type: "income", description: "Günlük Satış", amount: 12400, date: "2024-01-15", category: "Satış" },
  { id: 2, type: "expense", description: "Kahve Tedariki", amount: -2800, date: "2024-01-15", category: "Malzeme" },
  { id: 3, type: "expense", description: "Personel Maaşı", amount: -15000, date: "2024-01-14", category: "Personel" },
  { id: 4, type: "income", description: "Catering Hizmeti", amount: 3200, date: "2024-01-14", category: "Ek Hizmet" },
  { id: 5, type: "expense", description: "Elektrik Faturası", amount: -850, date: "2024-01-13", category: "Utilities" },
]

export default function AccountingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Original content that will be shown blurred in background
  const originalContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: TEXT }}>
            Muhasebe & Finans
          </h1>
          <p style={{ color: TEXT_SUBTLE }}>Gelir, gider ve karlılık analizleri</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" style={{ borderColor: BORDER_SOFT, color: TEXT }}>
            <Download className="h-4 w-4" />
            Rapor İndir
          </Button>
          <Button className="gap-2" style={{ backgroundColor: ACCENT, color: "#1A1D24" }}>
            <FileText className="h-4 w-4" />
            Yeni Kayıt
          </Button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FinancialMetricCard
          title="Aylık Gelir"
          value="₺67,000"
          change="+18.2%"
          trend="up"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <FinancialMetricCard
          title="Aylık Gider"
          value="₺41,000"
          change="+12.1%"
          trend="up"
          icon={<CreditCard className="h-4 w-4" />}
        />
        <FinancialMetricCard
          title="Net Kar"
          value="₺26,000"
          change="+28.5%"
          trend="up"
          icon={<Wallet className="h-4 w-4" />}
        />
        <FinancialMetricCard
          title="Kar Marjı"
          value="38.8%"
          change="+3.2%"
          trend="up"
          icon={<Target className="h-4 w-4" />}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4" style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
          <TabsTrigger value="overview" style={{ color: TEXT }}>
            Genel Bakış
          </TabsTrigger>
          <TabsTrigger value="transactions" style={{ color: TEXT }}>
            İşlemler
          </TabsTrigger>
          <TabsTrigger value="expenses" style={{ color: TEXT }}>
            Gider Analizi
          </TabsTrigger>
          <TabsTrigger value="reports" style={{ color: TEXT }}>
            Raporlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue vs Expenses Chart */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
              <CardHeader>
                <CardTitle style={{ color: TEXT }}>Gelir vs Gider Trendi</CardTitle>
                <CardDescription style={{ color: TEXT_SUBTLE }}>Son 6 ayın finansal performansı</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER_SOFT} />
                    <XAxis dataKey="month" stroke={TEXT_SUBTLE} />
                    <YAxis stroke={TEXT_SUBTLE} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: BG_CARD,
                        border: `1px solid ${BORDER_SOFT}`,
                        borderRadius: "8px",
                        color: TEXT,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke={ACCENT}
                      fill={`${ACCENT}40`}
                      name="Gelir"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stackId="2"
                      stroke={WARNING}
                      fill={`${WARNING}40`}
                      name="Gider"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Cash Flow */}
            <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
              <CardHeader>
                <CardTitle style={{ color: TEXT }}>Haftalık Nakit Akışı</CardTitle>
                <CardDescription style={{ color: TEXT_SUBTLE }}>Günlük gelir ve gider karşılaştırması</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyTransactions}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER_SOFT} />
                    <XAxis dataKey="day" stroke={TEXT_SUBTLE} />
                    <YAxis stroke={TEXT_SUBTLE} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: BG_CARD,
                        border: `1px solid ${BORDER_SOFT}`,
                        borderRadius: "8px",
                        color: TEXT,
                      }}
                    />
                    <Bar dataKey="income" fill={ACCENT} name="Gelir" />
                    <Bar dataKey="expense" fill={WARNING} name="Gider" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  return (
    <AppShell>
      <DisabledFeatureOverlay
        title="Gelişmiş Finans Analizi"
        description="Bu modül, gelir ve giderlerinizi detaylı olarak takip etmenizi, nakit akışınızı analiz etmenizi ve kâr-zarar tabloları oluşturarak işletmenizin finansal sağlığı hakkında derinlemesine bilgi edinmenizi sağlar."
        icon="dollar"
        reason="Bu özellik, mevcut abonelik planınıza dahil değildir."
      >
        {originalContent}
      </DisabledFeatureOverlay>
    </AppShell>
  )
}

interface FinancialMetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}

function FinancialMetricCard({ title, value, change, trend, icon }: FinancialMetricCardProps) {
  const trendColor = trend === "up" ? ACCENT : trend === "down" ? WARNING : TEXT_SUBTLE
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Target

  return (
    <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium" style={{ color: TEXT_SUBTLE }}>
              {title}
            </p>
            <p className="text-2xl font-bold" style={{ color: TEXT }}>
              {value}
            </p>
            <div className="flex items-center gap-1">
              <TrendIcon className="h-3 w-3" style={{ color: trendColor }} />
              <span className="text-xs font-medium" style={{ color: trendColor }}>
                {change}
              </span>
            </div>
          </div>
          <div className="p-3 rounded-full" style={{ backgroundColor: `${ACCENT}20` }}>
            <div style={{ color: ACCENT }}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
