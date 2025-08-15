"use client"
import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BG_CARD, BORDER_SOFT, TEXT, TEXT_SUBTLE, ACCENT, FILL_SOFT } from "@/lib/palette"
import { Trash2, AlertTriangle, TrendingDown, Calendar, Plus, Search, Filter, Download } from "lucide-react"

// Mock data for waste management
const wasteRecords = [
  {
    id: 1,
    product: "San Sebastian Cheesecake",
    quantity: 2,
    unit: "adet",
    reason: "Yanlış pişirme",
    cost: 36.0,
    reportedBy: "Umut Alıtkan",
    date: "2024-01-15",
    time: "14:30",
    status: "approved",
  },
  {
    id: 2,
    product: "Süt",
    quantity: 1,
    unit: "litre",
    reason: "Son kullanma tarihi geçti",
    cost: 8.5,
    reportedBy: "Ekin Yağanak",
    date: "2024-01-15",
    time: "09:15",
    status: "pending",
  },
  {
    id: 3,
    product: "Croissant",
    quantity: 5,
    unit: "adet",
    reason: "Düşürüldü",
    cost: 30.0,
    reportedBy: "Nur Özkan",
    date: "2024-01-14",
    time: "16:45",
    status: "approved",
  },
  {
    id: 4,
    product: "Americano",
    quantity: 3,
    unit: "adet",
    reason: "Yanlış sipariş",
    cost: 45.0,
    reportedBy: "Tuğra Güneysi",
    date: "2024-01-14",
    time: "11:20",
    status: "rejected",
  },
]

const wasteReasons = [
  "Son kullanma tarihi geçti",
  "Yanlış pişirme",
  "Düşürüldü",
  "Yanlış sipariş",
  "Kalite sorunu",
  "Müşteri iadesi",
  "Diğer",
]

const products = [
  { name: "Americano", cost: 15.0 },
  { name: "Latte", cost: 24.0 },
  { name: "San Sebastian Cheesecake", cost: 18.0 },
  { name: "Croissant", cost: 6.0 },
  { name: "Süt", cost: 8.5 },
]

export default function WasteManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newWaste, setNewWaste] = useState({
    product: "",
    quantity: "",
    reason: "",
    description: "",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return ACCENT
      case "pending":
        return "#FFA500"
      case "rejected":
        return "#FF4444"
      default:
        return TEXT_SUBTLE
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Onaylandı"
      case "pending":
        return "Beklemede"
      case "rejected":
        return "Reddedildi"
      default:
        return "Bilinmiyor"
    }
  }

  const totalWasteCost = wasteRecords
    .filter((record) => record.status === "approved")
    .reduce((sum, record) => sum + record.cost, 0)

  const todayWaste = wasteRecords.filter((record) => record.date === "2024-01-15")

  const handleAddWaste = () => {
    // Handle adding new waste record
    setIsAddDialogOpen(false)
    setNewWaste({ product: "", quantity: "", reason: "", description: "" })
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: TEXT }}>
              Zayi Yönetimi
            </h1>
            <p className="text-sm" style={{ color: TEXT_SUBTLE }}>
              Ürün kayıpları ve fire takibi
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
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              style={{ borderColor: BORDER_SOFT, color: TEXT }}
            >
              <Download className="h-4 w-4" />
              Rapor Al
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" style={{ backgroundColor: ACCENT, color: "#000" }}>
                  <Plus className="h-4 w-4" />
                  Zayi Ekle
                </Button>
              </DialogTrigger>
              <DialogContent style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                <DialogHeader>
                  <DialogTitle style={{ color: TEXT }}>Yeni Zayi Kaydı</DialogTitle>
                  <DialogDescription style={{ color: TEXT_SUBTLE }}>Zayi olan ürün bilgilerini girin</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product" style={{ color: TEXT }}>
                      Ürün
                    </Label>
                    <Select
                      value={newWaste.product}
                      onValueChange={(value) => setNewWaste({ ...newWaste, product: value })}
                    >
                      <SelectTrigger style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}>
                        <SelectValue placeholder="Ürün seçin" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                        {products.map((product) => (
                          <SelectItem key={product.name} value={product.name} style={{ color: TEXT }}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity" style={{ color: TEXT }}>
                      Miktar
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Miktar girin"
                      value={newWaste.quantity}
                      onChange={(e) => setNewWaste({ ...newWaste, quantity: e.target.value })}
                      style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason" style={{ color: TEXT }}>
                      Zayi Sebebi
                    </Label>
                    <Select
                      value={newWaste.reason}
                      onValueChange={(value) => setNewWaste({ ...newWaste, reason: value })}
                    >
                      <SelectTrigger style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}>
                        <SelectValue placeholder="Sebep seçin" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                        {wasteReasons.map((reason) => (
                          <SelectItem key={reason} value={reason} style={{ color: TEXT }}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" style={{ color: TEXT }}>
                      Açıklama (Opsiyonel)
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Detaylı açıklama..."
                      value={newWaste.description}
                      onChange={(e) => setNewWaste({ ...newWaste, description: e.target.value })}
                      style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    style={{ borderColor: BORDER_SOFT, color: TEXT }}
                  >
                    İptal
                  </Button>
                  <Button onClick={handleAddWaste} style={{ backgroundColor: ACCENT, color: "#000" }}>
                    Kaydet
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: TEXT }}>
                Toplam Zayi
              </CardTitle>
              <Trash2 className="h-4 w-4" style={{ color: "#FF4444" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "#FF4444" }}>
                ₺{totalWasteCost.toFixed(2)}
              </div>
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                Bu ay toplam kayıp
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: TEXT }}>
                Bugünkü Zayi
              </CardTitle>
              <Calendar className="h-4 w-4" style={{ color: ACCENT }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                {todayWaste.length}
              </div>
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                Kayıt sayısı
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: TEXT }}>
                Bekleyen Onay
              </CardTitle>
              <AlertTriangle className="h-4 w-4" style={{ color: "#FFA500" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: "#FFA500" }}>
                {wasteRecords.filter((record) => record.status === "pending").length}
              </div>
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                Onay bekleyen kayıt
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: TEXT }}>
                En Çok Zayi
              </CardTitle>
              <TrendingDown className="h-4 w-4" style={{ color: "#FF4444" }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: TEXT }}>
                Cheesecake
              </div>
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                En çok zayi olan ürün
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Waste Records Table */}
        <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle style={{ color: TEXT }}>Zayi Kayıtları</CardTitle>
                <CardDescription style={{ color: TEXT_SUBTLE }}>Tüm zayi kayıtları ve durumları</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: TEXT_SUBTLE }} />
                <Input
                  placeholder="Kayıt ara..."
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
                  <TableHead style={{ color: TEXT }}>Miktar</TableHead>
                  <TableHead style={{ color: TEXT }}>Sebep</TableHead>
                  <TableHead style={{ color: TEXT }}>Maliyet</TableHead>
                  <TableHead style={{ color: TEXT }}>Raporlayan</TableHead>
                  <TableHead style={{ color: TEXT }}>Tarih/Saat</TableHead>
                  <TableHead style={{ color: TEXT }}>Durum</TableHead>
                  <TableHead style={{ color: TEXT }}>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wasteRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="font-medium" style={{ color: TEXT }}>
                        {record.product}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ color: TEXT }}>
                        {record.quantity} {record.unit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm" style={{ color: TEXT }}>
                        {record.reason}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium" style={{ color: "#FF4444" }}>
                        ₺{record.cost.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm" style={{ color: TEXT }}>
                        {record.reportedBy}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm" style={{ color: TEXT }}>
                        {record.date}
                      </div>
                      <div className="text-xs" style={{ color: TEXT_SUBTLE }}>
                        {record.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor: `${getStatusColor(record.status)}20`,
                          color: getStatusColor(record.status),
                          border: `1px solid ${getStatusColor(record.status)}40`,
                        }}
                      >
                        {getStatusText(record.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {record.status === "pending" && (
                          <>
                            <Button variant="outline" size="sm" style={{ borderColor: ACCENT, color: ACCENT }}>
                              Onayla
                            </Button>
                            <Button variant="outline" size="sm" style={{ borderColor: "#FF4444", color: "#FF4444" }}>
                              Reddet
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm" style={{ borderColor: BORDER_SOFT, color: TEXT }}>
                          Detay
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
