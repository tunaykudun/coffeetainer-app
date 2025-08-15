"use client"
import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { BG_CARD, BORDER_SOFT, TEXT, TEXT_SUBTLE, ACCENT, FILL_SOFT } from "@/lib/palette"
import { TrendingUp, DollarSign, ShoppingCart, Users, Plus, Filter, Download } from "lucide-react"

// Mock data for sales flow
const todayStats = {
  totalSales: 2450.75,
  totalOrders: 87,
  avgOrderValue: 28.17,
  activeCustomers: 156,
}

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Ahmet Yılmaz",
    items: ["Americano", "Croissant"],
    total: 45.5,
    time: "14:32",
    status: "completed",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "ORD-002",
    customer: "Zeynep Kaya",
    items: ["Latte", "Cheesecake"],
    total: 67.0,
    time: "14:28",
    status: "preparing",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "ORD-003",
    customer: "Mehmet Demir",
    items: ["Cappuccino", "Muffin", "Espresso"],
    total: 89.25,
    time: "14:25",
    status: "completed",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const topProducts = [
  { name: "Americano", sales: 45, revenue: 675.0, trend: "+12%" },
  { name: "Latte", sales: 38, revenue: 912.0, trend: "+8%" },
  { name: "Cappuccino", sales: 32, revenue: 768.0, trend: "+15%" },
  { name: "Croissant", sales: 28, revenue: 420.0, trend: "+5%" },
]

export default function SalesFlowPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: TEXT }}>
              Satış Akışı
            </h1>
            <p className="text-sm" style={{ color: TEXT_SUBTLE }}>
              Gerçek zamanlı satış takibi ve analizi
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              style={{ borderColor: BORDER_SOFT, color: TEXT }}
            >
              <Filter className="h-4 w-4" />
              Filtrele
            </Button>
            <Button className="gap-2" style={{ backgroundColor: ACCENT, color: "#000" }}>
              <Download className="h-4 w-4" />
              Rapor Al
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: TEXT }}>
                Toplam Satış
              </CardTitle>
              <DollarSign className="h-4 w-4" style={{ color: ACCENT }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                ₺{todayStats.totalSales.toFixed(2)}
              </div>
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                Bugün toplam gelir
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: TEXT }}>
                Sipariş Sayısı
              </CardTitle>
              <ShoppingCart className="h-4 w-4" style={{ color: ACCENT }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                {todayStats.totalOrders}
              </div>
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                Bugün tamamlanan
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: TEXT }}>
                Ortalama Sepet
              </CardTitle>
              <TrendingUp className="h-4 w-4" style={{ color: ACCENT }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                ₺{todayStats.avgOrderValue.toFixed(2)}
              </div>
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                Sipariş başına
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: TEXT }}>
                Aktif Müşteri
              </CardTitle>
              <Users className="h-4 w-4" style={{ color: ACCENT }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                {todayStats.activeCustomers}
              </div>
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                Bugün ziyaret eden
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle style={{ color: TEXT }}>Son Siparişler</CardTitle>
                  <CardDescription style={{ color: TEXT_SUBTLE }}>Gerçek zamanlı sipariş takibi</CardDescription>
                </div>
                <Button size="sm" className="gap-2" style={{ backgroundColor: ACCENT, color: "#000" }}>
                  <Plus className="h-4 w-4" />
                  Yeni
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: FILL_SOFT, border: `1px solid ${BORDER_SOFT}` }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={order.avatar || "/placeholder.svg"} alt={order.customer} />
                        <AvatarFallback>
                          {order.customer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium" style={{ color: TEXT }}>
                          {order.customer}
                        </p>
                        <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                          {order.items.join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium" style={{ color: TEXT }}>
                        ₺{order.total.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={order.status === "completed" ? "default" : "secondary"}
                          style={{
                            backgroundColor: order.status === "completed" ? ACCENT : FILL_SOFT,
                            color: order.status === "completed" ? "#000" : TEXT,
                          }}
                        >
                          {order.status === "completed" ? "Tamamlandı" : "Hazırlanıyor"}
                        </Badge>
                        <span className="text-xs" style={{ color: TEXT_SUBTLE }}>
                          {order.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader>
              <CardTitle style={{ color: TEXT }}>En Çok Satan Ürünler</CardTitle>
              <CardDescription style={{ color: TEXT_SUBTLE }}>Bugünün performans liderleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: ACCENT, color: "#000" }}
                        >
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium" style={{ color: TEXT }}>
                          {product.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium" style={{ color: TEXT }}>
                          ₺{product.revenue.toFixed(2)}
                        </p>
                        <p className="text-xs" style={{ color: ACCENT }}>
                          {product.trend}
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={(product.sales / 50) * 100}
                      className="h-2"
                      style={{ backgroundColor: FILL_SOFT }}
                    />
                    <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                      {product.sales} adet satıldı
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
