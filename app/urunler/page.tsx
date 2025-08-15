"use client"
import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { BG_CARD, BORDER_SOFT, TEXT, TEXT_SUBTLE, ACCENT, FILL_SOFT } from "@/lib/palette"
import { Coffee, Package, TrendingUp, TrendingDown, Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react"

// Mock data for products
const products = [
  {
    id: 1,
    name: "Americano",
    category: "Sıcak İçecekler",
    price: 15.0,
    cost: 4.5,
    stock: 45,
    sold: 127,
    profit: 10.5,
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Latte",
    category: "Sıcak İçecekler",
    price: 24.0,
    cost: 7.2,
    stock: 38,
    sold: 89,
    profit: 16.8,
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "San Sebastian Cheesecake",
    category: "Tatlılar",
    price: 45.0,
    cost: 18.0,
    stock: 12,
    sold: 34,
    profit: 27.0,
    status: "low_stock",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Croissant",
    category: "Pastane",
    price: 18.0,
    cost: 6.0,
    stock: 28,
    sold: 156,
    profit: 12.0,
    status: "active",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Iced Coffee",
    category: "Soğuk İçecekler",
    price: 20.0,
    cost: 5.5,
    stock: 0,
    sold: 67,
    profit: 14.5,
    status: "out_of_stock",
    image: "/placeholder.svg?height=40&width=40",
  },
]

const categories = [
  { name: "Sıcak İçecekler", count: 12, color: "#FF6B6B" },
  { name: "Soğuk İçecekler", count: 8, color: "#4ECDC4" },
  { name: "Tatlılar", count: 15, color: "#45B7D1" },
  { name: "Pastane", count: 22, color: "#96CEB4" },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tümü")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return ACCENT
      case "low_stock":
        return "#FFA500"
      case "out_of_stock":
        return "#FF4444"
      default:
        return TEXT_SUBTLE
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktif"
      case "low_stock":
        return "Stok Azalıyor"
      case "out_of_stock":
        return "Stokta Yok"
      default:
        return "Bilinmiyor"
    }
  }

  const getProfitMargin = (price: number, cost: number) => {
    return (((price - cost) / price) * 100).toFixed(1)
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: TEXT }}>
              Ürün Yönetimi
            </h1>
            <p className="text-sm" style={{ color: TEXT_SUBTLE }}>
              Menü ürünleri ve fiyat yönetimi
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
              <Plus className="h-4 w-4" />
              Yeni Ürün
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: TEXT }}>
                Toplam Ürün
              </CardTitle>
              <Package className="h-4 w-4" style={{ color: ACCENT }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                {products.length}
              </div>
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                Aktif menü ürünleri
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: TEXT }}>
                En Çok Satan
              </CardTitle>
              <TrendingUp className="h-4 w-4" style={{ color: ACCENT }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                Croissant
              </div>
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                156 adet satıldı
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: TEXT }}>
                Ortalama Kar
              </CardTitle>
              <Coffee className="h-4 w-4" style={{ color: ACCENT }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                %68.2
              </div>
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                Kar marjı ortalaması
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: TEXT }}>
                Stok Uyarısı
              </CardTitle>
              <TrendingDown className="h-4 w-4" style={{ color: "#FFA500" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "#FFA500" }}>
                2
              </div>
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                Ürün stok azalıyor
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Products Table */}
          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle style={{ color: TEXT }}>Ürün Listesi</CardTitle>
                  <CardDescription style={{ color: TEXT_SUBTLE }}>Tüm menü ürünleri ve detayları</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: TEXT_SUBTLE }} />
                  <Input
                    placeholder="Ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                    style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ color: TEXT }}>Ürün</TableHead>
                    <TableHead style={{ color: TEXT }}>Kategori</TableHead>
                    <TableHead style={{ color: TEXT }}>Fiyat</TableHead>
                    <TableHead style={{ color: TEXT }}>Maliyet</TableHead>
                    <TableHead style={{ color: TEXT }}>Kar</TableHead>
                    <TableHead style={{ color: TEXT }}>Stok</TableHead>
                    <TableHead style={{ color: TEXT }}>Durum</TableHead>
                    <TableHead style={{ color: TEXT }}>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg bg-cover bg-center"
                            style={{ backgroundImage: `url(${product.image})` }}
                          />
                          <div>
                            <div className="font-medium" style={{ color: TEXT }}>
                              {product.name}
                            </div>
                            <div className="text-xs" style={{ color: TEXT_SUBTLE }}>
                              {product.sold} adet satıldı
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" style={{ backgroundColor: FILL_SOFT, color: TEXT }}>
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium" style={{ color: TEXT }}>
                          ₺{product.price.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ color: TEXT_SUBTLE }}>₺{product.cost.toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ color: ACCENT }}>₺{product.profit.toFixed(2)}</div>
                        <div className="text-xs" style={{ color: TEXT_SUBTLE }}>
                          %{getProfitMargin(product.price, product.cost)} kar
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ color: TEXT }}>{product.stock} adet</div>
                        {product.stock > 0 && (
                          <Progress
                            value={(product.stock / 50) * 100}
                            className="h-1 mt-1"
                            style={{ backgroundColor: FILL_SOFT }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          style={{
                            backgroundColor: `${getStatusColor(product.status)}20`,
                            color: getStatusColor(product.status),
                            border: `1px solid ${getStatusColor(product.status)}40`,
                          }}
                        >
                          {getStatusText(product.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" style={{ color: TEXT_SUBTLE }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" style={{ color: TEXT_SUBTLE }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" style={{ color: "#FF4444" }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Categories Sidebar */}
          <div className="space-y-4">
            <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
              <CardHeader>
                <CardTitle style={{ color: TEXT }}>Kategoriler</CardTitle>
                <CardDescription style={{ color: TEXT_SUBTLE }}>Ürün kategorileri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: selectedCategory === "Tümü" ? `${ACCENT}20` : FILL_SOFT,
                    border: `1px solid ${BORDER_SOFT}`,
                  }}
                  onClick={() => setSelectedCategory("Tümü")}
                >
                  <span style={{ color: TEXT }}>Tümü</span>
                  <Badge style={{ backgroundColor: ACCENT, color: "#000" }}>{products.length}</Badge>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
                    style={{
                      backgroundColor: selectedCategory === category.name ? `${ACCENT}20` : FILL_SOFT,
                      border: `1px solid ${BORDER_SOFT}`,
                    }}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span style={{ color: TEXT }}>{category.name}</span>
                    </div>
                    <Badge style={{ backgroundColor: FILL_SOFT, color: TEXT }}>{category.count}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
