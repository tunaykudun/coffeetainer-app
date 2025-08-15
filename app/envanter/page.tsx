"use client"

import { useMemo, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Input, Separator } from "@/components/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { PackageSearch, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { ACCENT, BG_CARD, BG_DEEP, BORDER_SOFT, FILL_SOFT, HOVER_BG, NEGATIVE, TEXT, TEXT_SUBTLE } from "@/lib/palette"

/* ------------------------------- Multi-branch ------------------------------ */

type BranchKey = "altinkum" | "lara" | "nashira" | "lounge" | "dosemealti" | "kultur" | "manisa"
const BRANCHES: { key: BranchKey; name: string }[] = [
  { key: "altinkum", name: "Altınkum (Merkez)" },
  { key: "lara", name: "Lara" },
  { key: "nashira", name: "Nashira" },
  { key: "lounge", name: "Lounge" },
  { key: "dosemealti", name: "Döşemealtı" },
  { key: "kultur", name: "Kültür" },
  { key: "manisa", name: "Manisa" },
]
const BRANCH_LABEL: Record<BranchKey, string> = Object.fromEntries(BRANCHES.map((b) => [b.key, b.name])) as any
const CRITICAL_THRESHOLD = 20

type Product = {
  sku: string
  name: string
  category: string
  supplier: string
  stock: Record<BranchKey, number>
  lastPurchase: Record<BranchKey, Date> // her şube için son alım tarihi
  updatedAt: Date
  updatedBy: string
}

function randomPastDate(hoursBackMax: number, now = new Date()) {
  const diff = Math.floor(Math.random() * hoursBackMax * 3600_000)
  return new Date(now.getTime() - diff)
}
function seedLastPurchase(now = new Date()): Record<BranchKey, Date> {
  const obj: Partial<Record<BranchKey, Date>> = {}
  for (const b of BRANCHES) obj[b.key] = randomPastDate(24 * 14, now) // son 14 gün içinde rastgele
  return obj as Record<BranchKey, Date>
}

function seedProducts(): Product[] {
  const now = new Date()
  return [
    {
      sku: "SKU-COF-ETH-001",
      name: "Etiyopya Çekirdeği",
      category: "Çekirdek Kahve",
      supplier: "Acme Beans",
      stock: { altinkum: 80, lara: 35, nashira: 22, lounge: 10, dosemealti: 16, kultur: 55, manisa: 28 },
      lastPurchase: seedLastPurchase(now),
      updatedAt: new Date(now.getTime() - 3600_000 * 2),
      updatedBy: "Ayşe",
    },
    {
      sku: "SKU-MUG-LATT-330",
      name: "Latte Bardağı 330ml",
      category: "Ekipman",
      supplier: "BaristaWare",
      stock: { altinkum: 150, lara: 75, nashira: 25, lounge: 60, dosemealti: 18, kultur: 95, manisa: 40 },
      lastPurchase: seedLastPurchase(now),
      updatedAt: new Date(now.getTime() - 3600_000 * 6),
      updatedBy: "Mehmet",
    },
    {
      sku: "SKU-CAKE-SAN-001",
      name: "San Sebastian Cheesecake",
      category: "Tatlı",
      supplier: "Pâtisserie Co.",
      stock: { altinkum: 12, lara: 6, nashira: 3, lounge: 5, dosemealti: 7, kultur: 10, manisa: 4 },
      lastPurchase: seedLastPurchase(now),
      updatedAt: new Date(now.getTime() - 3600_000 * 1.2),
      updatedBy: "Zeynep",
    },
    {
      sku: "SKU-MLK-DAIRY-1L",
      name: "Günlük Süt 1L",
      category: "Sarf",
      supplier: "Taze Süt A.Ş.",
      stock: { altinkum: 30, lara: 18, nashira: 9, lounge: 16, dosemealti: 14, kultur: 20, manisa: 12 },
      lastPurchase: seedLastPurchase(now),
      updatedAt: new Date(now.getTime() - 3600_000 * 0.5),
      updatedBy: "Ali",
    },
    {
      sku: "SKU-CUP-TAKE-12",
      name: "Takeaway Karton Bardak 12oz",
      category: "Ambalaj",
      supplier: "PackIt",
      stock: { altinkum: 300, lara: 160, nashira: 90, lounge: 120, dosemealti: 75, kultur: 210, manisa: 130 },
      lastPurchase: seedLastPurchase(now),
      updatedAt: new Date(now.getTime() - 3600_000 * 8),
      updatedBy: "Ayşe",
    },
  ]
}

/* --------------------------------- Helpers -------------------------------- */

function totalStock(p: Product) {
  return (Object.values(p.stock) as number[]).reduce((a, b) => a + b, 0)
}
function fmtDate(d: Date) {
  return new Date(d).toLocaleString("tr-TR")
}
function isCritical(qty: number) {
  return qty <= CRITICAL_THRESHOLD
}

/* --------------------------------- Page UI -------------------------------- */

export default function Page() {
  const [branch, setBranch] = useState<"__all" | BranchKey>("__all")
  const [products, setProducts] = useState<Product[]>(() => seedProducts())
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const title = branch === "__all" ? "Envanter Yönetimi" : `Envanter Yönetimi - ${BRANCH_LABEL[branch]}`

  const productRows = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        shownStock: branch === "__all" ? totalStock(p) : p.stock[branch],
      })),
    [products, branch],
  )

  const criticalList = useMemo(() => {
    if (branch === "__all") {
      return products.flatMap((p) =>
        BRANCHES.filter((b) => isCritical(p.stock[b.key])).map((b) => ({
          sku: p.sku,
          name: p.name,
          branch: b.key,
          branchName: b.name,
          qty: p.stock[b.key],
          supplier: p.supplier,
        })),
      )
    }
    return products
      .filter((p) => isCritical(p.stock[branch]))
      .map((p) => ({
        sku: p.sku,
        name: p.name,
        branch,
        branchName: BRANCH_LABEL[branch],
        qty: p.stock[branch],
        supplier: p.supplier,
      }))
  }, [products, branch])

  const [addOpen, setAddOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)

  const toggleExpand = (sku: string) =>
    setExpandedRows((prev) => {
      const next = new Set(prev)
      next.has(sku) ? next.delete(sku) : next.add(sku)
      return next
    })

  return (
    <AppShell>
      <Card className="border" style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
        <CardHeader className="gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <PackageSearch className="h-5 w-5" />
              <div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription style={{ color: TEXT_SUBTLE }}>
                  {"Sıcaklık ve Netlik: Global bakış, lokal kontrol."}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <button
                    className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
                    style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = HOVER_BG)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT)}
                  >
                    <Plus className="mr-2 inline-block h-4 w-4" />
                    Yeni Ürün Ekle
                  </button>
                </DialogTrigger>
                <AddProductDialog
                  onAdd={(payload) => {
                    setProducts((prev) => [
                      {
                        sku: payload.sku,
                        name: payload.name,
                        category: payload.category,
                        supplier: payload.supplier,
                        stock: payload.stock,
                        lastPurchase: seedLastPurchase(new Date()),
                        updatedAt: new Date(),
                        updatedBy: "Sistem",
                      },
                      ...prev,
                    ])
                    setAddOpen(false)
                  }}
                />
              </Dialog>
              <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
                <DialogTrigger asChild>
                  <button
                    className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
                    style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = HOVER_BG)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT)}
                  >
                    Stok Transferi
                  </button>
                </DialogTrigger>
                <TransferDialog
                  products={products}
                  onTransfer={(sku, from, to, qty) => {
                    setProducts((prev) =>
                      prev.map((p) => {
                        if (p.sku !== sku) return p
                        if (p.stock[from] < qty || qty <= 0 || from === to) return p
                        return {
                          ...p,
                          stock: { ...p.stock, [from]: p.stock[from] - qty, [to]: p.stock[to] + qty },
                          updatedAt: new Date(),
                          updatedBy: "Transfer",
                        }
                      }),
                    )
                    setTransferOpen(false)
                  }}
                />
              </Dialog>
            </div>
          </div>

          {/* Branch filter row */}
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Şube</Label>
              <Select value={branch} onValueChange={(v) => setBranch(v as any)}>
                <SelectTrigger
                  className="w-[260px] rounded-md"
                  style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
                >
                  <SelectValue placeholder="Şube seçiniz" />
                </SelectTrigger>
                <SelectContent
                  className="border"
                  style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
                >
                  <SelectItem
                    value="__all"
                    className="data-[highlighted]:bg-[#f0e8e4] data-[highlighted]:text-[#2d1d1e]"
                  >
                    Tüm Şubeler (Genel Toplam)
                  </SelectItem>
                  {BRANCHES.map((b) => (
                    <SelectItem
                      key={b.key}
                      value={b.key}
                      className="data-[highlighted]:bg-[#f0e8e4] data-[highlighted]:text-[#2d1d1e]"
                    >
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {branch !== "__all" ? (
                <Badge
                  className="ml-2 rounded-md border px-2 py-0.5"
                  style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
                >
                  {BRANCH_LABEL[branch]}
                </Badge>
              ) : null}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 rounded-xl p-1" style={{ backgroundColor: FILL_SOFT }}>
              <TabsTrigger value="all">Tüm Ürünler (Detaylı Liste)</TabsTrigger>
              <TabsTrigger value="critical">Kritik Stok Yönetimi</TabsTrigger>
            </TabsList>

            {/* Tüm Ürünler */}
            <TabsContent value="all" className="space-y-4">
              <Card className="border" style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Detaylı Envanter Tablosu</CardTitle>
                  <CardDescription style={{ color: TEXT_SUBTLE }}>
                    {branch === "__all" ? "Tüm şubelerdeki toplam stoklar" : `${BRANCH_LABEL[branch]} stokları`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-white/80">
                        <TableHead>Ürün</TableHead>
                        <TableHead>SKU/Barkod</TableHead>
                        <TableHead className="text-right">Toplam Stok</TableHead>
                        <TableHead>Şube Bazında Dağılım</TableHead>
                        <TableHead>Son Güncelleme</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productRows.map((p, idx) => {
                        const isOpen = expandedRows.has(p.sku)
                        return (
                          <>
                            <TableRow
                              key={p.sku}
                              className="transition-colors"
                              style={{
                                backgroundColor: idx % 2 === 1 ? FILL_SOFT : "transparent",
                                color: TEXT,
                              }}
                              onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLTableRowElement
                                el.style.backgroundColor = HOVER_BG
                                el.style.color = "#2d1d1e"
                              }}
                              onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLTableRowElement
                                el.style.backgroundColor = idx % 2 === 1 ? FILL_SOFT : "transparent"
                                el.style.color = TEXT
                              }}
                            >
                              <TableCell className="min-w-[220px]">
                                <div className="font-medium">{p.name}</div>
                                <div className="text-xs" style={{ color: TEXT_SUBTLE }}>
                                  {p.category}
                                </div>
                              </TableCell>
                              <TableCell style={{ color: TEXT }}>{p.sku}</TableCell>
                              <TableCell className="text-right font-semibold tabular-nums">{p.shownStock}</TableCell>

                              {/* Şube Bazında Dağılım > Toggle Button */}
                              <TableCell className="min-w-[240px]">
                                <button
                                  type="button"
                                  aria-expanded={isOpen}
                                  aria-controls={`dist-${p.sku}`}
                                  onClick={() => toggleExpand(p.sku)}
                                  className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors"
                                  style={{ backgroundColor: BG_DEEP, borderColor: BORDER_SOFT, color: TEXT }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = HOVER_BG
                                    e.currentTarget.style.color = "#2d1d1e"
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = BG_DEEP
                                    e.currentTarget.style.color = TEXT
                                  }}
                                >
                                  {isOpen ? (
                                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                                  )}
                                  {isOpen ? "Dağılımı Gizle" : "Dağılımı Göster"}
                                </button>
                              </TableCell>

                              <TableCell className="min-w-[220px]">
                                <div className="text-sm">{fmtDate(p.updatedAt)}</div>
                                <div className="text-xs" style={{ color: TEXT_SUBTLE }}>
                                  {"by " + p.updatedBy}
                                </div>
                              </TableCell>
                            </TableRow>

                            {/* Expandable details row */}
                            <TableRow
                              key={`${p.sku}-details`}
                              style={{
                                backgroundColor: idx % 2 === 1 ? FILL_SOFT : "transparent",
                              }}
                            >
                              <TableCell colSpan={5} className="!p-0">
                                <div
                                  id={`dist-${p.sku}`}
                                  style={{
                                    maxHeight: isOpen ? "360px" : "0px",
                                    opacity: isOpen ? 1 : 0,
                                    transition: "max-height 260ms ease, opacity 220ms ease",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="grid gap-2 border-t"
                                    style={{
                                      backgroundColor: BG_DEEP,
                                      borderColor: BORDER_SOFT,
                                      color: TEXT,
                                      padding: isOpen ? "12px 16px" : "0px 16px",
                                      transition: "padding 260ms ease",
                                    }}
                                  >
                                    {BRANCHES.map((b) => {
                                      const qty = p.stock[b.key]
                                      const last = p.lastPurchase[b.key]
                                      const critical = isCritical(qty)
                                      return (
                                        <div
                                          key={`${p.sku}-${b.key}`}
                                          className="flex items-center justify-between rounded-md border px-3 py-2"
                                          style={{ borderColor: BORDER_SOFT, backgroundColor: "transparent" }}
                                        >
                                          <div className="flex min-w-0 flex-col">
                                            <span className="text-sm font-medium">{b.name}</span>
                                            <span className="text-xs" style={{ color: TEXT_SUBTLE }}>
                                              Son alım: {fmtDate(last)}
                                            </span>
                                          </div>
                                          <Badge
                                            className="rounded-md border px-2 py-0.5 tabular-nums"
                                            style={
                                              critical
                                                ? {
                                                    backgroundColor: "rgba(229,124,58,0.15)",
                                                    color: NEGATIVE,
                                                    borderColor: "rgba(229,124,58,0.5)",
                                                  }
                                                : { backgroundColor: BG_CARD, color: TEXT, borderColor: BORDER_SOFT }
                                            }
                                          >
                                            {qty}
                                          </Badge>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          </>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Kritik Stok */}
            <TabsContent value="critical" className="space-y-4">
              <Card className="border" style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Acil Eylem Paneli</CardTitle>
                  <CardDescription style={{ color: TEXT_SUBTLE }}>
                    {branch === "__all"
                      ? "Herhangi bir şubede kritik seviyede olan ürünler"
                      : `${BRANCH_LABEL[branch]} için kritik stoklu ürünler`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-white/80">
                        <TableHead>Ürün</TableHead>
                        <TableHead>Şube</TableHead>
                        <TableHead className="text-right">Kalan</TableHead>
                        <TableHead>Tedarikçi</TableHead>
                        <TableHead className="text-right">Aksiyon</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {criticalList.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center" style={{ color: TEXT_SUBTLE }}>
                            Kritik stok bulunmuyor.
                          </TableCell>
                        </TableRow>
                      ) : (
                        criticalList.map((row, idx) => (
                          <TableRow
                            key={`${row.sku}-${row.branch}`}
                            className="transition-colors"
                            style={{
                              backgroundColor: idx % 2 === 1 ? FILL_SOFT : "transparent",
                              color: TEXT,
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLTableRowElement
                              el.style.backgroundColor = HOVER_BG
                              el.style.color = "#2d1d1e"
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLTableRowElement
                              el.style.backgroundColor = idx % 2 === 1 ? FILL_SOFT : "transparent"
                              el.style.color = TEXT
                            }}
                          >
                            <TableCell className="min-w-[220px]">
                              <div className="font-medium">{row.name}</div>
                              <div className="text-xs" style={{ color: TEXT_SUBTLE }}>
                                {row.sku}
                              </div>
                            </TableCell>
                            <TableCell className="min-w-[160px]">
                              <Badge
                                className="rounded-md border px-2 py-0.5"
                                style={{ backgroundColor: BG_DEEP, borderColor: BORDER_SOFT, color: TEXT }}
                              >
                                {row.branchName}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                className="rounded-md border px-2 py-0.5 tabular-nums"
                                style={{
                                  backgroundColor: "rgba(229,124,58,0.15)",
                                  color: NEGATIVE,
                                  borderColor: "rgba(229,124,58,0.5)",
                                }}
                              >
                                {row.qty}
                              </Badge>
                            </TableCell>
                            <TableCell className="min-w-[160px]">{row.supplier}</TableCell>
                            <TableCell className="text-right">
                              <OrderButton
                                defaultQty={Math.max(0, 100 - row.qty)}
                                product={`${row.name} (${row.sku})`}
                                supplier={row.supplier}
                                onConfirm={() => alert("Sipariş verildi (örnek).")}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AppShell>
  )
}

/* ------------------------------ UI Components ----------------------------- */

function OrderButton({
  defaultQty,
  product,
  supplier,
  onConfirm,
}: {
  defaultQty: number
  product: string
  supplier: string
  onConfirm: () => void
}) {
  const [open, setOpen] = useState(false)
  const [qty, setQty] = useState(defaultQty)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = HOVER_BG)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT)}
        >
          Sipariş Ver
        </button>
      </DialogTrigger>
      <DialogContent className="border" style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
        <DialogHeader>
          <DialogTitle>Sipariş Ver</DialogTitle>
          <DialogDescription style={{ color: TEXT_SUBTLE }}>Ürün ve miktar bilgisini onaylayın.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-sm">Ürün</Label>
            <div
              className="mt-1 rounded-md border px-3 py-2"
              style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT }}
            >
              {product}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Tedarikçi</Label>
              <div
                className="mt-1 rounded-md border px-3 py-2"
                style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT }}
              >
                {supplier}
              </div>
            </div>
            <div>
              <Label htmlFor="qty" className="text-sm">
                Miktar
              </Label>
              <Input
                id="qty"
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value || 0)))}
                className="mt-1"
                style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = HOVER_BG
                  e.currentTarget.style.color = "#2d1d1e"
                  e.currentTarget.style.borderColor = ACCENT
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = BG_CARD
                  e.currentTarget.style.color = TEXT
                  e.currentTarget.style.borderColor = BORDER_SOFT
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <button
            className="rounded-md px-4 py-2 transition-colors"
            style={{ backgroundColor: "transparent", border: `1px solid ${BORDER_SOFT}`, color: TEXT }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = FILL_SOFT)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
            onClick={() => setOpen(false)}
          >
            İptal
          </button>
          <button
            className="rounded-md px-4 py-2 font-medium transition-colors"
            style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = HOVER_BG)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT)}
            onClick={() => {
              onConfirm()
              setOpen(false)
            }}
          >
            Onayla
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddProductDialog({
  onAdd,
}: {
  onAdd: (p: {
    sku: string
    name: string
    category: string
    supplier: string
    stock: Record<BranchKey, number>
  }) => void
}) {
  const [sku, setSku] = useState("")
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [supplier, setSupplier] = useState("")
  const [allInit, setAllInit] = useState<number>(0)
  const [per, setPer] = useState<Record<BranchKey, number>>(() => {
    const obj: any = {}
    BRANCHES.forEach((b) => (obj[b.key] = 0))
    return obj
  })

  const applyAll = () => {
    const obj: any = {}
    BRANCHES.forEach((b) => (obj[b.key] = allInit))
    setPer(obj)
  }

  const canSave = sku.trim() && name.trim() && category.trim() && supplier.trim()

  return (
    <DialogContent className="border" style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
      <DialogHeader>
        <DialogTitle>Yeni Ürün Ekle</DialogTitle>
        <DialogDescription style={{ color: TEXT_SUBTLE }}>
          Ürün bilgilerini doldurun. Başlangıç stoklarını şube bazında tanımlayabilirsiniz.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <LabeledInput id="sku" label="SKU/Barkod" value={sku} onChange={setSku} />
          <LabeledInput id="name" label="Ürün Adı" value={name} onChange={setName} />
          <LabeledInput id="category" label="Kategori" value={category} onChange={setCategory} />
          <LabeledInput id="supplier" label="Tedarikçi" value={supplier} onChange={setSupplier} />
        </div>

        <Separator className="bg-white/10" />

        <div className="rounded-lg border p-3" style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT }}>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label>Başlangıç Stoku (tüm şubeler)</Label>
              <Input
                type="number"
                min={0}
                value={allInit}
                onChange={(e) => setAllInit(Math.max(0, Number(e.target.value || 0)))}
                className="mt-1"
                style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = HOVER_BG
                  e.currentTarget.style.color = "#2d1d1e"
                  e.currentTarget.style.borderColor = ACCENT
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = BG_CARD
                  e.currentTarget.style.color = TEXT
                  e.currentTarget.style.borderColor = BORDER_SOFT
                }}
              />
            </div>
            <button
              onClick={applyAll}
              className="rounded-md px-3 py-2 text-sm transition-colors"
              style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = HOVER_BG)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT)}
            >
              Hepsine Uygula
            </button>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {BRANCHES.map((b) => (
              <div
                key={b.key}
                className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
                style={{ backgroundColor: BG_DEEP, borderColor: BORDER_SOFT }}
              >
                <span className="text-sm">{b.name}</span>
                <Input
                  type="number"
                  min={0}
                  value={per[b.key]}
                  onChange={(e) => setPer((prev) => ({ ...prev, [b.key]: Math.max(0, Number(e.target.value || 0)) }))}
                  className="h-9 w-28"
                  style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
                  onFocus={(e) => {
                    e.currentTarget.style.backgroundColor = HOVER_BG
                    e.currentTarget.style.color = "#2d1d1e"
                    e.currentTarget.style.borderColor = ACCENT
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.backgroundColor = BG_CARD
                    e.currentTarget.style.color = TEXT
                    e.currentTarget.style.borderColor = BORDER_SOFT
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <button
          disabled={!canSave}
          className="ml-auto rounded-md px-4 py-2 font-medium transition-opacity"
          style={{ backgroundColor: ACCENT, color: "#2d1d1e", opacity: canSave ? 1 : 0.6 }}
          onMouseEnter={(e) => {
            if (canSave) (e.currentTarget as HTMLButtonElement).style.backgroundColor = HOVER_BG
          }}
          onMouseLeave={(e) => {
            if (canSave) (e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT
          }}
          onClick={() => {
            if (!canSave) return
            onAdd({ sku, name, category, supplier, stock: per })
          }}
        >
          Kaydet
        </button>
      </DialogFooter>
    </DialogContent>
  )
}

function LabeledInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
        style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
        onFocus={(e) => {
          e.currentTarget.style.backgroundColor = HOVER_BG
          e.currentTarget.style.color = "#2d1d1e"
          e.currentTarget.style.borderColor = ACCENT
        }}
        onBlur={(e) => {
          e.currentTarget.style.backgroundColor = BG_CARD
          e.currentTarget.style.color = TEXT
          e.currentTarget.style.borderColor = BORDER_SOFT
        }}
      />
    </div>
  )
}

function TransferDialog({
  products,
  onTransfer,
}: {
  products: Product[]
  onTransfer: (sku: string, from: BranchKey, to: BranchKey, qty: number) => void
}) {
  const [sku, setSku] = useState(products[0]?.sku ?? "")
  const [from, setFrom] = useState<BranchKey>("altinkum")
  const [to, setTo] = useState<BranchKey>("lara")
  const [qty, setQty] = useState(10)
  const product = products.find((p) => p.sku === sku)
  const maxFrom = product ? product.stock[from] : 0
  const invalid = !sku || from === to || qty <= 0 || qty > maxFrom

  return (
    <DialogContent className="border" style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
      <DialogHeader>
        <DialogTitle>Şubeler Arası Stok Transferi</DialogTitle>
        <DialogDescription style={{ color: TEXT_SUBTLE }}>
          Bir ürünü bir şubeden diğerine aktarın. Limit: kaynağın mevcut stok miktarı.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label>Ürün</Label>
            <Select value={sku} onValueChange={setSku as any}>
              <SelectTrigger
                className="mt-1 w-full rounded-md"
                style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
              >
                <SelectValue placeholder="Ürün seçiniz" />
              </SelectTrigger>
              <SelectContent
                className="border"
                style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
              >
                {products.map((p) => (
                  <SelectItem
                    key={p.sku}
                    value={p.sku}
                    className="data-[highlighted]:bg-[#f0e8e4] data-[highlighted]:text-[#2d1d1e]"
                  >
                    {p.name} ({p.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Miktar</Label>
            <Input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value || 0)))}
              className="mt-1"
              style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = HOVER_BG
                e.currentTarget.style.color = "#2d1d1e"
                e.currentTarget.style.borderColor = ACCENT
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = BG_CARD
                e.currentTarget.style.color = TEXT
                e.currentTarget.style.borderColor = BORDER_SOFT
              }}
            />
            <div className="mt-1 text-xs" style={{ color: TEXT_SUBTLE }}>
              Kaynakta mevcut: {maxFrom}
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label>Kaynak Şube</Label>
            <Select value={from} onValueChange={(v) => setFrom(v as BranchKey)}>
              <SelectTrigger
                className="mt-1 w-full rounded-md"
                style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
              >
                <SelectValue placeholder="Kaynak" />
              </SelectTrigger>
              <SelectContent
                className="border"
                style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
              >
                {BRANCHES.map((b) => (
                  <SelectItem
                    key={b.key}
                    value={b.key}
                    className="data-[highlighted]:bg-[#f0e8e4] data-[highlighted]:text-[#2d1d1e]"
                  >
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Hedef Şube</Label>
            <Select value={to} onValueChange={(v) => setTo(v as BranchKey)}>
              <SelectTrigger
                className="mt-1 w-full rounded-md"
                style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
              >
                <SelectValue placeholder="Hedef" />
              </SelectTrigger>
              <SelectContent
                className="border"
                style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
              >
                {BRANCHES.map((b) => (
                  <SelectItem
                    key={b.key}
                    value={b.key}
                    className="data-[highlighted]:bg-[#f0e8e4] data-[highlighted]:text-[#2d1d1e]"
                  >
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {from === to ? (
          <div
            className="rounded-md border px-3 py-2 text-xs"
            style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT }}
          >
            Kaynak ve hedef şube farklı olmalı.
          </div>
        ) : null}
      </div>

      <DialogFooter>
        <button
          className="ml-auto rounded-md px-4 py-2 transition-opacity"
          style={{
            backgroundColor: invalid ? "rgba(181,140,130,0.5)" : ACCENT,
            color: "#2d1d1e",
            opacity: invalid ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!invalid) (e.currentTarget as HTMLButtonElement).style.backgroundColor = HOVER_BG
          }}
          onMouseLeave={(e) => {
            if (!invalid) (e.currentTarget as HTMLButtonElement).style.backgroundColor = ACCENT
          }}
          disabled={invalid}
          onClick={() => onTransfer(sku, from, to, qty)}
        >
          Transfer Et
        </button>
      </DialogFooter>
    </DialogContent>
  )
}
