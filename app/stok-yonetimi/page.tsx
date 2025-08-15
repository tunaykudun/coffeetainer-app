"use client"

import React from "react"

import type { ReactElement } from "react"
import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Package,
  AlertTriangle,
  Edit,
  Trash2,
  Building2,
} from "lucide-react"
import { ACCENT, BG_CARD, TEXT, TEXT_SUBTLE, POSITIVE, WARNING, NEGATIVE } from "@/lib/palette"

// Mock data
const mockProducts = [
  {
    id: 1,
    name: "Espresso Çekirdeği",
    category: "Çekirdek Kahveler",
    supplier: "Kahve Dünyası Ltd.",
    unitPrice: 45.5,
    branches: {
      Merkez: { stock: 25, critical: 10 },
      "Şube 1": { stock: 15, critical: 10 },
      "Şube 2": { stock: 8, critical: 10 },
    },
  },
  {
    id: 2,
    name: "Vanilya Şurubu",
    category: "Şuruplar",
    supplier: "Aroma Tedarik A.Ş.",
    unitPrice: 12.75,
    branches: {
      Merkez: { stock: 45, critical: 15 },
      "Şube 1": { stock: 22, critical: 15 },
      "Şube 2": { stock: 18, critical: 15 },
    },
  },
  {
    id: 3,
    name: "Temizlik Deterjanı",
    category: "Temizlik Malzemeleri",
    supplier: "Temiz Dünya San.",
    unitPrice: 8.9,
    branches: {
      Merkez: { stock: 5, critical: 10 },
      "Şube 1": { stock: 3, critical: 10 },
      "Şube 2": { stock: 12, critical: 10 },
    },
  },
]

const mockCategories = [
  { id: 1, name: "Çekirdek Kahveler", productCount: 12 },
  { id: 2, name: "Şuruplar", productCount: 8 },
  { id: 3, name: "Temizlik Malzemeleri", productCount: 15 },
  { id: 4, name: "Kağıt Ürünleri", productCount: 6 },
]

const mockSuppliers = [
  {
    id: 1,
    name: "Kahve Dünyası Ltd.",
    contact: "Ahmet Yılmaz",
    phone: "+90 212 555 0123",
    email: "ahmet@kahvedunyasi.com",
    productCount: 8,
  },
  {
    id: 2,
    name: "Aroma Tedarik A.Ş.",
    contact: "Fatma Demir",
    phone: "+90 216 555 0456",
    email: "fatma@aromatedarik.com",
    productCount: 12,
  },
  {
    id: 3,
    name: "Temiz Dünya San.",
    contact: "Mehmet Kaya",
    phone: "+90 312 555 0789",
    email: "mehmet@temizdunya.com",
    productCount: 5,
  },
]

export default function StokYonetimiPage(): ReactElement {
  const [activeTab, setActiveTab] = useState("all-products")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedProducts, setExpandedProducts] = useState<number[]>([])
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)

  const toggleProductExpansion = (productId: number) => {
    setExpandedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const getCriticalProducts = () => {
    return mockProducts.filter((product) =>
      Object.values(product.branches).some((branch) => branch.stock <= branch.critical),
    )
  }

  const getStockStatus = (stock: number, critical: number) => {
    if (stock <= critical) return { color: NEGATIVE, text: "Kritik" }
    if (stock <= critical * 1.5) return { color: WARNING, text: "Düşük" }
    return { color: POSITIVE, text: "Normal" }
  }

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <AppShell>
      <PageTransition>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: TEXT }}>
                Stok Yönetimi
              </h1>
              <p className="text-sm mt-1" style={{ color: TEXT_SUBTLE }}>
                Tüm stok operasyonlarınızı tek yerden yönetin
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3" style={{ backgroundColor: BG_CARD }}>
              <TabsTrigger
                value="all-products"
                className="data-[state=active]:text-black"
                style={{
                  backgroundColor: activeTab === "all-products" ? ACCENT : "transparent",
                  color: activeTab === "all-products" ? "black" : TEXT_SUBTLE,
                }}
              >
                <Package className="w-4 h-4 mr-2" />
                Tüm Ürünler
              </TabsTrigger>
              <TabsTrigger
                value="critical-stock"
                className="data-[state=active]:text-black"
                style={{
                  backgroundColor: activeTab === "critical-stock" ? ACCENT : "transparent",
                  color: activeTab === "critical-stock" ? "black" : TEXT_SUBTLE,
                }}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Kritik Stok ve Sipariş
              </TabsTrigger>
              <TabsTrigger
                value="categories-suppliers"
                className="data-[state=active]:text-black"
                style={{
                  backgroundColor: activeTab === "categories-suppliers" ? ACCENT : "transparent",
                  color: activeTab === "categories-suppliers" ? "black" : TEXT_SUBTLE,
                }}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Kategoriler ve Tedarikçiler
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Tüm Ürünler */}
            <TabsContent value="all-products" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                      style={{ color: TEXT_SUBTLE }}
                    />
                    <Input
                      placeholder="Ürün, kategori veya tedarikçi ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Kategori Filtrele" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Kategoriler</SelectItem>
                      {mockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button style={{ backgroundColor: ACCENT, color: "black" }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Yeni Ürün Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Yeni Ürün Ekle</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="product-name">Ürün Adı</Label>
                        <Input id="product-name" placeholder="Ürün adını girin" />
                      </div>
                      <div>
                        <Label htmlFor="product-category">Kategori</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Kategori seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCategories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="product-supplier">Tedarikçi</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Tedarikçi seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockSuppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.name}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="unit-price">Birim Fiyatı (₺)</Label>
                        <Input id="unit-price" type="number" step="0.01" placeholder="0.00" />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                          İptal
                        </Button>
                        <Button style={{ backgroundColor: ACCENT, color: "black" }}>Ürün Ekle</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-lg border" style={{ backgroundColor: BG_CARD }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold" style={{ color: TEXT }}>
                          Ürün Adı
                        </th>
                        <th className="text-left p-4 font-semibold" style={{ color: TEXT }}>
                          Kategori
                        </th>
                        <th className="text-left p-4 font-semibold" style={{ color: TEXT }}>
                          Tedarikçi
                        </th>
                        <th className="text-left p-4 font-semibold" style={{ color: TEXT }}>
                          Birim Fiyatı
                        </th>
                        <th className="text-left p-4 font-semibold" style={{ color: TEXT }}>
                          Şube Dağılımı
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <React.Fragment key={product.id}>
                          <tr className="border-b hover:bg-white/5">
                            <td className="p-4">
                              <div className="font-medium" style={{ color: TEXT }}>
                                {product.name}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" style={{ borderColor: ACCENT, color: TEXT }}>
                                {product.category}
                              </Badge>
                            </td>
                            <td className="p-4" style={{ color: TEXT_SUBTLE }}>
                              {product.supplier}
                            </td>
                            <td className="p-4">
                              <span className="font-semibold" style={{ color: TEXT }}>
                                ₺{product.unitPrice.toFixed(2)}
                              </span>
                            </td>
                            <td className="p-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleProductExpansion(product.id)}
                                className="flex items-center space-x-2"
                              >
                                <span style={{ color: TEXT_SUBTLE }}>Şube Bazında Dağılımı Göster</span>
                                {expandedProducts.includes(product.id) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </td>
                          </tr>
                          {expandedProducts.includes(product.id) && (
                            <tr>
                              <td colSpan={5} className="p-4 bg-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {Object.entries(product.branches).map(([branchName, branchData]) => {
                                    const status = getStockStatus(branchData.stock, branchData.critical)
                                    return (
                                      <div
                                        key={branchName}
                                        className="p-3 rounded-lg border"
                                        style={{ backgroundColor: BG_CARD }}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-medium" style={{ color: TEXT }}>
                                            {branchName}
                                          </span>
                                          <Badge style={{ backgroundColor: status.color, color: "white" }}>
                                            {status.text}
                                          </Badge>
                                        </div>
                                        <div className="text-sm space-y-1">
                                          <div style={{ color: TEXT_SUBTLE }}>
                                            Mevcut Stok: <span className="font-semibold">{branchData.stock}</span>
                                          </div>
                                          <div style={{ color: TEXT_SUBTLE }}>
                                            Kritik Seviye: <span className="font-semibold">{branchData.critical}</span>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Kritik Stok ve Sipariş */}
            <TabsContent value="critical-stock" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: TEXT }}>
                    Kritik Stok Seviyeleri
                  </h2>
                  <p className="text-sm" style={{ color: TEXT_SUBTLE }}>
                    Acil sipariş gerektiren ürünler
                  </p>
                </div>
                <Badge variant="destructive" className="text-sm">
                  {getCriticalProducts().length} Kritik Ürün
                </Badge>
              </div>

              <div className="rounded-lg border" style={{ backgroundColor: BG_CARD }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold" style={{ color: TEXT }}>
                          Ürün
                        </th>
                        <th className="text-left p-4 font-semibold" style={{ color: TEXT }}>
                          Şube
                        </th>
                        <th className="text-left p-4 font-semibold" style={{ color: TEXT }}>
                          Mevcut/Kritik
                        </th>
                        <th className="text-left p-4 font-semibold" style={{ color: TEXT }}>
                          Tedarikçi
                        </th>
                        <th className="text-left p-4 font-semibold" style={{ color: TEXT }}>
                          İletişim
                        </th>
                        <th className="text-left p-4 font-semibold" style={{ color: TEXT }}>
                          İşlem
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCriticalProducts().map((product) =>
                        Object.entries(product.branches)
                          .filter(([, branchData]) => branchData.stock <= branchData.critical)
                          .map(([branchName, branchData]) => {
                            const supplier = mockSuppliers.find((s) => s.name === product.supplier)
                            return (
                              <tr key={`${product.id}-${branchName}`} className="border-b hover:bg-white/5">
                                <td className="p-4">
                                  <div className="font-medium" style={{ color: TEXT }}>
                                    {product.name}
                                  </div>
                                  <div className="text-sm" style={{ color: TEXT_SUBTLE }}>
                                    {product.category}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge variant="outline" style={{ borderColor: ACCENT }}>
                                    {branchName}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold" style={{ color: NEGATIVE }}>
                                      {branchData.stock}
                                    </span>
                                    <span style={{ color: TEXT_SUBTLE }}>/</span>
                                    <span style={{ color: TEXT_SUBTLE }}>{branchData.critical}</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div style={{ color: TEXT }}>{product.supplier}</div>
                                  <div className="text-sm" style={{ color: TEXT_SUBTLE }}>
                                    {supplier?.contact}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline" className="p-2 bg-transparent">
                                      <Phone className="w-3 h-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="p-2 bg-transparent">
                                      <Mail className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Button size="sm" style={{ backgroundColor: ACCENT, color: "black" }}>
                                    Sipariş Ver
                                  </Button>
                                </td>
                              </tr>
                            )
                          }),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Kategoriler ve Tedarikçiler */}
            <TabsContent value="categories-suppliers" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Kategori Yönetimi */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold" style={{ color: TEXT }}>
                      Kategori Yönetimi
                    </h2>
                    <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" style={{ backgroundColor: ACCENT, color: "black" }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Yeni Kategori
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Yeni Kategori Ekle</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="category-name">Kategori Adı</Label>
                            <Input id="category-name" placeholder="Kategori adını girin" />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                              İptal
                            </Button>
                            <Button style={{ backgroundColor: ACCENT, color: "black" }}>Kategori Ekle</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="rounded-lg border" style={{ backgroundColor: BG_CARD }}>
                    <div className="p-4 space-y-3">
                      {mockCategories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <div>
                            <div className="font-medium" style={{ color: TEXT }}>
                              {category.name}
                            </div>
                            <div className="text-sm" style={{ color: TEXT_SUBTLE }}>
                              {category.productCount} ürün
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tedarikçi Yönetimi */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold" style={{ color: TEXT }}>
                      Tedarikçi Yönetimi
                    </h2>
                    <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" style={{ backgroundColor: ACCENT, color: "black" }}>
                          <Plus className="w-4 h-4 mr-2" />
                          Yeni Tedarikçi
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Yeni Tedarikçi Ekle</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="supplier-name">Firma Adı</Label>
                            <Input id="supplier-name" placeholder="Firma adını girin" />
                          </div>
                          <div>
                            <Label htmlFor="supplier-contact">Yetkili Kişi</Label>
                            <Input id="supplier-contact" placeholder="Yetkili kişi adını girin" />
                          </div>
                          <div>
                            <Label htmlFor="supplier-phone">Telefon</Label>
                            <Input id="supplier-phone" placeholder="+90 XXX XXX XX XX" />
                          </div>
                          <div>
                            <Label htmlFor="supplier-email">E-posta</Label>
                            <Input id="supplier-email" type="email" placeholder="email@example.com" />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsAddSupplierOpen(false)}>
                              İptal
                            </Button>
                            <Button style={{ backgroundColor: ACCENT, color: "black" }}>Tedarikçi Ekle</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="rounded-lg border" style={{ backgroundColor: BG_CARD }}>
                    <div className="p-4 space-y-3">
                      {mockSuppliers.map((supplier) => (
                        <div key={supplier.id} className="p-3 rounded-lg bg-white/5">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-medium" style={{ color: TEXT }}>
                                {supplier.name}
                              </div>
                              <div className="text-sm" style={{ color: TEXT_SUBTLE }}>
                                {supplier.contact} • {supplier.productCount} ürün
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1" style={{ color: TEXT_SUBTLE }}>
                              <Phone className="w-3 h-3" />
                              <span>{supplier.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1" style={{ color: TEXT_SUBTLE }}>
                              <Mail className="w-3 h-3" />
                              <span>{supplier.email}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </AppShell>
  )
}
