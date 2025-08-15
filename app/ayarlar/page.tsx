"use client"

import type React from "react"

import Image from "next/image"
import { useMemo, useState } from "react"
import { AppShell } from "@/components/app-shell"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
  Separator,
} from "@/components/ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Shield,
  Trash2,
  UserPlus,
  Undo2,
  Check,
  Plus,
  ChevronDown,
} from "lucide-react"
import { ACCENT, BG_CARD, BORDER_SOFT, FILL_SOFT, TEXT, TEXT_SUBTLE } from "@/lib/palette"

/* Types */
type Employee = {
  id: string
  name: string
  email?: string
  phone?: string
  role: string
  pin: string
  active: boolean
  avatar?: string
}
type ModuleKey = "shift" | "muhasebe" | "raporlar" | "zayi" | "ayarlar" | "stok" | "urunler" | "sohbet"
type Permission = { view: boolean; edit: boolean; del: boolean }
type Role = {
  id: string
  name: string
  perms: Record<ModuleKey, Permission>
}

/* Constants */
const MODULES: { key: ModuleKey; label: string }[] = [
  { key: "shift", label: "Shift Planlama" },
  { key: "muhasebe", label: "Muhasebe" },
  { key: "raporlar", label: "Raporlar" },
  { key: "zayi", label: "Zayi Yönetimi" },
  { key: "ayarlar", label: "Ayarlar" },
  { key: "stok", label: "Stok Yönetimi" },
  { key: "urunler", label: "Ürünler" },
  { key: "sohbet", label: "Ekip Sohbeti" },
]
const ALL_TRUE: Permission = { view: true, edit: true, del: true }
const ALL_FALSE: Permission = { view: false, edit: false, del: false }

/* Helpers */
function generateUniquePin(existingPins: Set<string>): string {
  for (let i = 0; i < 10000; i++) {
    const pin = Math.floor(1000 + Math.random() * 9000).toString()
    if (!existingPins.has(pin)) return pin
  }
  return "9999"
}
function mask(pin: string, visible: boolean) {
  return visible ? pin : "••••"
}

/* Mock Data */
function initialRoles(): Role[] {
  const baseAll = MODULES.reduce(
    (acc, m) => ({ ...acc, [m.key]: { ...ALL_TRUE } }),
    {} as Record<ModuleKey, Permission>,
  )
  const baseNone = MODULES.reduce(
    (acc, m) => ({ ...acc, [m.key]: { ...ALL_FALSE } }),
    {} as Record<ModuleKey, Permission>,
  )
  const admin: Role = { id: "r-admin", name: "Yönetici", perms: baseAll }
  const amir: Role = {
    id: "r-amir",
    name: "Vardiya Amiri",
    perms: {
      ...baseNone,
      shift: { view: true, edit: true, del: false },
      zayi: { view: true, edit: true, del: false },
      stok: { view: true, edit: true, del: false },
      urunler: { view: true, edit: true, del: false },
      raporlar: { view: true, edit: false, del: false },
      muhasebe: { view: true, edit: false, del: false },
    } as Role["perms"],
  }
  const barista: Role = {
    id: "r-barista",
    name: "Barista",
    perms: {
      ...baseNone,
      shift: { view: true, edit: false, del: false },
      zayi: { view: true, edit: true, del: false },
      muhasebe: { view: false, edit: false, del: false },
      raporlar: { view: false, edit: false, del: false },
    } as Role["perms"],
  }
  const stajyer: Role = {
    id: "r-stajyer",
    name: "Stajyer",
    perms: { ...baseNone, shift: { view: true, edit: false, del: false } } as Role["perms"],
  }
  return [admin, amir, barista, stajyer]
}

function initialEmployees(roles: Role[]): Employee[] {
  return [
    // Management Team - Full Admin Access
    {
      id: "u-1",
      name: "Tunay Kudun",
      email: "tunay@coffeetainer.com",
      phone: "+90 555 111 2233",
      role: roles[0].name,
      pin: "1070",
      active: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "u-batikan",
      name: "Batıkan Poyraz",
      email: "batikan@coffeetainer.com",
      phone: "+90 555 600 0001",
      role: "Operasyon Şefi",
      pin: "6001",
      active: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "u-damla",
      name: "Damla Alıtkan",
      email: "damla@coffeetainer.com",
      phone: "+90 555 600 0002",
      role: "Muhasebe & Genel Müdür",
      pin: "6002",
      active: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "u-aysenur",
      name: "Ayşe Nur Saylan",
      email: "aysenur@coffeetainer.com",
      phone: "+90 555 600 0003",
      role: "Operasyon Şefi",
      pin: "6003",
      active: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    // Senior Staff
    {
      id: "u-2",
      name: "Umut Alıtkan",
      email: "umut@coffeetainer.com",
      phone: "+90 555 222 3344",
      role: "Barista",
      pin: "2580",
      active: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    // Experienced Staff
    {
      id: "u-3",
      name: "Zeynep Soysal",
      email: "zeynep@coffeetainer.com",
      phone: "+90 555 333 4455",
      role: "Stajyer",
      pin: "1998",
      active: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "u-4",
      name: "Nur Özkan",
      email: "nur@coffeetainer.com",
      phone: "+90 555 444 5566",
      role: "Barista",
      pin: "3435",
      active: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    // New Staff
    {
      id: "u-5",
      name: "Ekin Yağanak",
      email: "ekin@coffeetainer.com",
      phone: "+90 555 555 6677",
      role: "Stajyer",
      pin: "4748",
      active: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "u-6",
      name: "Tuğra Güneysi",
      email: "tugra@coffeetainer.com",
      phone: "+90 555 666 7788",
      role: "Stajyer",
      pin: "5566",
      active: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "u-7",
      name: "Eren Şen",
      email: "eren@coffeetainer.com",
      phone: "+90 555 777 8899",
      role: "Stajyer",
      pin: "7172",
      active: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "u-8",
      name: "Ezel Beycioğlu",
      email: "ezel@coffeetainer.com",
      phone: "+90 555 888 9900",
      role: "Stajyer",
      pin: "8384",
      active: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "u-9",
      name: "Gizem Yıldız",
      email: "gizem@coffeetainer.com",
      phone: "+90 555 999 0011",
      role: "Stajyer",
      pin: "9900",
      active: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]
}

/* Page */
export default function SettingsPage() {
  const [tab, setTab] = useState<"personel" | "roller" | "sube" | "bildirimler" | "entegrasyonlar">("personel")
  const [roles, setRoles] = useState<Role[]>(() => initialRoles())
  const [employees, setEmployees] = useState<Employee[]>(() => initialEmployees(initialRoles()))

  const [toasts, setToasts] = useState<{ id: string; message: string; undo?: () => void }[]>([])
  const pushToast = (message: string, undo?: () => void) => {
    const id = String(Date.now())
    setToasts((t) => [...t, { id, message, undo }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }

  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-[240px_1fr]">
        {/* Left sub menu */}
        <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }} className="h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ayarlar</CardTitle>
            <CardDescription style={{ color: TEXT_SUBTLE }}>Modül seçimleri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <SubItem label="Personel Yönetimi" active={tab === "personel"} onClick={() => setTab("personel")} />
            <SubItem
              label="Roller ve İzinler"
              active={tab === "roller"}
              onClick={() => setTab("roller")}
              icon={<Shield className="h-4 w-4" />}
            />
            <Separator className="bg-white/10 my-3" />
            <SubItem label="Şube Bilgileri" active={tab === "sube"} onClick={() => setTab("sube")} />
            <SubItem label="Bildirimler" active={tab === "bildirimler"} onClick={() => setTab("bildirimler")} />
            <SubItem
              label="Entegrasyonlar"
              active={tab === "entegrasyonlar"}
              onClick={() => setTab("entegrasyonlar")}
            />
          </CardContent>
        </Card>

        {/* Right content */}
        <div className="space-y-4" style={{ color: TEXT }}>
          {tab === "personel" && (
            <PersonnelTab
              roles={roles}
              employees={employees}
              setEmployees={setEmployees}
              setRoles={setRoles}
              pushToast={pushToast}
            />
          )}
          {tab === "roller" && <RolesTab roles={roles} setRoles={setRoles} pushToast={pushToast} />}
          {tab === "sube" && (
            <PlaceholderTab
              title="Şube Bilgileri"
              description="Adres, telefon ve iletişim bilgilerini burada düzenleyin."
              fields={[
                { label: "Şube Adı", placeholder: "Coffeetainer - Merkez" },
                { label: "Adres", placeholder: "Mah. Cad. Sk. No: 10/2, İstanbul" },
                { label: "Telefon", placeholder: "+90 212 000 0000" },
                { label: "E-posta", placeholder: "sube@coffeetainer.com" },
              ]}
            />
          )}
          {tab === "bildirimler" && (
            <PlaceholderTab
              title="Bildirimler"
              description="Kritik stok ve sistem bildirimlerini kime göndereceğinizi seçin."
              fields={[
                { label: "Kritik Stok Uyarıları", placeholder: "Örn: Tunay, Batıkan, Damla" },
                { label: "Günlük Rapor Alıcısı", placeholder: "yönetim@coffeetainer.com" },
                { label: "SMS Numaraları", placeholder: "+90 5xx xxx xx xx" },
              ]}
            />
          )}
          {tab === "entegrasyonlar" && (
            <PlaceholderTab
              title="Entegrasyonlar"
              description="Simpra ve diğer sistemlerle bağlantı ayarlarını yönetin."
              fields={[
                { label: "Simpra API Anahtarı", placeholder: "••••••••" },
                { label: "Webhook URL", placeholder: "https://..." },
              ]}
            />
          )}
        </div>
      </div>

      {/* Inline Toasts */}
      <div className="fixed bottom-4 left-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm shadow"
            style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
          >
            <Check className="h-4 w-4" style={{ color: ACCENT }} />
            <span>{t.message}</span>
            {t.undo ? (
              <button
                onClick={() => {
                  t.undo?.()
                  setToasts((x) => x.filter((y) => y.id !== t.id))
                }}
                className="ml-2 inline-flex items-center gap-1 rounded-md px-2 py-1 transition"
                style={{ backgroundColor: FILL_SOFT, border: `1px solid ${BORDER_SOFT}`, color: TEXT }}
                aria-label="Geri Al"
                title="Geri Al"
              >
                <Undo2 className="h-3.5 w-3.5" />
                Geri Al
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </AppShell>
  )
}

/* Sub components: UI */

function SubItem({
  label,
  active,
  onClick,
  icon,
}: { label: string; active?: boolean; onClick?: () => void; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn("flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition")}
      style={{
        backgroundColor: active ? "rgba(181,140,130,0.2)" : FILL_SOFT,
        color: TEXT,
      }}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

/* Personnel tab */

type PersonnelTabProps = {
  roles: Role[]
  employees: Employee[]
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>
  pushToast: (m: string, undo?: () => void) => void
}
function PersonnelTab({ roles, employees, setEmployees, setRoles, pushToast }: PersonnelTabProps) {
  const roleNames = useMemo(() => roles.map((r) => r.name), [roles])
  const [reveal, setReveal] = useState<Record<string, boolean>>({})
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)
  const [pinEdit, setPinEdit] = useState<{ open: boolean; user?: Employee }>({ open: false })

  const pinsSet = useMemo(() => new Set(employees.map((e) => e.pin)), [employees])

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)

  const addOrUpdate = (payload: Omit<Employee, "id"> & { id?: string }) => {
    if (payload.id) {
      setEmployees((prev) => prev.map((e) => (e.id === payload.id ? ({ ...e, ...payload } as Employee) : e)))
      pushToast("Personel bilgileri güncellendi.")
    } else {
      const id = "u-" + Date.now()
      setEmployees((prev) => [{ ...(payload as Employee), id }, ...prev])
      pushToast("Yeni personel eklendi.")
    }
  }

  const onDeactivate = (emp: Employee) => {
    const before = emp.active
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? { ...e, active: !e.active } : e)))
    pushToast(before ? "Personel pasifleştirildi." : "Personel aktifleştirildi.", () => {
      setEmployees((prev) => prev.map((e) => (e.id === emp.id ? { ...e, active: before } : e)))
    })
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    const target = deleteTarget
    setDeleteTarget(null)
    setEmployees((prev) => prev.filter((e) => e.id !== target.id))
    pushToast("Personel silindi.", () => {
      setEmployees((prev) => [target, ...prev])
    })
  }

  const onChangePin = (emp: Employee, newPin: string) => {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) return alert("PIN 4 haneli olmalı.")
    if (employees.some((e) => e.id !== emp.id && e.pin === newPin)) return alert("Bu PIN kullanılıyor.")
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? { ...e, pin: newPin } : e)))
    setPinEdit({ open: false })
    pushToast("PIN güncellendi.")
  }

  const addNewRole = (roleName: string) => {
    const baseNone = MODULES.reduce(
      (acc, m) => ({ ...acc, [m.key]: { ...ALL_FALSE } }),
      {} as Record<ModuleKey, Permission>,
    )
    const newRole: Role = {
      id: "r-" + Date.now(),
      name: roleName,
      perms: baseNone,
    }
    setRoles((prev) => [...prev, newRole])
    pushToast(`"${roleName}" rolü oluşturuldu.`)
    return newRole.name
  }

  return (
    <>
      <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Personel Yönetimi</CardTitle>
            <CardDescription style={{ color: TEXT_SUBTLE }}>Çalışan erişimlerini yönetin</CardDescription>
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 transition"
                aria-label="Yeni Personel Ekle"
                title="Yeni Personel Ekle"
                style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
              >
                <UserPlus className="h-4 w-4" />+ Yeni Personel Ekle
              </button>
            </SheetTrigger>
            <EmployeeSheet
              open={sheetOpen}
              onOpenChange={(o) => {
                setSheetOpen(o)
                if (!o) setEditing(null)
              }}
              roles={roleNames}
              existingPins={pinsSet}
              onSave={(data) => {
                addOrUpdate(data)
                setSheetOpen(false)
              }}
              editing={editing || undefined}
              onAddNewRole={addNewRole}
            />
          </Sheet>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personel</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>PIN</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">Eylemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((e) => (
                <TableRow key={e.id} className={!e.active ? "opacity-60" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={e.avatar || "/placeholder.svg?height=40&width=40&query=avatar"}
                          alt={e.name}
                        />
                        <AvatarFallback>
                          {e.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{e.name}</div>
                        <div className="text-xs" style={{ color: TEXT_SUBTLE }}>
                          {e.email || e.phone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={e.role} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums" style={{ color: TEXT }}>
                        {mask(e.pin, !!reveal[e.id])}
                      </span>
                      <button
                        className="rounded-md p-1 transition"
                        onClick={() => setReveal((r) => ({ ...r, [e.id]: !r[e.id] }))}
                        aria-label={reveal[e.id] ? "PIN gizle" : "PIN göster"}
                        title={reveal[e.id] ? "PIN gizle" : "PIN göster"}
                        style={{ backgroundColor: FILL_SOFT, border: `1px solid ${BORDER_SOFT}`, color: TEXT }}
                      >
                        {reveal[e.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <Dialog
                        open={pinEdit.open && pinEdit.user?.id === e.id}
                        onOpenChange={(o) => setPinEdit({ open: o, user: o ? e : undefined })}
                      >
                        <DialogTrigger asChild>
                          <button
                            className="rounded-md p-1 transition"
                            aria-label="PIN değiştir"
                            title="PIN değiştir"
                            style={{ backgroundColor: FILL_SOFT, border: `1px solid ${BORDER_SOFT}`, color: TEXT }}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </DialogTrigger>
                        <DialogContent style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
                          <DialogHeader>
                            <DialogTitle>PIN Değiştir - {e.name}</DialogTitle>
                          </DialogHeader>
                          <PinChangeForm
                            current={e.pin}
                            existing={new Set(employees.filter((x) => x.id !== e.id).map((x) => x.pin))}
                            onSubmit={(p) => onChangePin(e, p)}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={e.active} onCheckedChange={() => onDeactivate(e)} aria-label="Durum değiştir" />
                      <span className="text-xs" style={{ color: e.active ? ACCENT : TEXT_SUBTLE }}>
                        {e.active ? "Aktif" : "Pasif"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="inline-flex items-center justify-center rounded-md p-2 transition"
                          aria-label="Eylemler"
                          style={{ backgroundColor: FILL_SOFT, border: `1px solid ${BORDER_SOFT}`, color: TEXT }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
                      >
                        <DropdownMenuLabel>Eylemler</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setEditing(e)
                            ;(document.activeElement as HTMLElement)?.blur()
                            setTimeout(() => setSheetOpen(true), 0)
                          }}
                        >
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeactivate(e)}>
                          {e.active ? "Pasifleştir" : "Aktifleştir"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="focus:text-[#E57C3A]" onClick={() => setDeleteTarget(e)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Kalıcı olarak silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: TEXT_SUBTLE }}>
              Bu işlem geri alınabilir bir tost eylemi sunacaktır. "Geri Al" tıklamazsanız personel kalıcı olarak
              silinir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction style={{ backgroundColor: "#E57C3A" }} onClick={confirmDelete}>
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function RoleBadge({ role }: { role: string }) {
  // Different badge styles for management roles
  const isManagement = ["Yönetici", "Operasyon Şefi", "Muhasebe & Genel Müdür"].includes(role)

  return (
    <Badge
      className="rounded-md border px-2 py-0.5"
      style={{
        backgroundColor: isManagement ? "rgba(181,140,130,0.25)" : "rgba(181,140,130,0.15)",
        color: ACCENT,
        borderColor: isManagement ? "rgba(181,140,130,0.6)" : "rgba(181,140,130,0.4)",
        fontWeight: isManagement ? "600" : "normal",
      }}
    >
      {role}
    </Badge>
  )
}

function PinChangeForm({
  current,
  existing,
  onSubmit,
}: {
  current: string
  existing: Set<string>
  onSubmit: (pin: string) => void
}) {
  const [pin, setPin] = useState(current)
  const conflict = pin !== current && existing.has(pin)
  const invalid = !/^\d{4}$/.test(pin)
  return (
    <form
      action={() => onSubmit(pin)}
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!invalid && !conflict) onSubmit(pin)
      }}
    >
      <Label htmlFor="pin">Yeni PIN (4 hane)</Label>
      <Input
        id="pin"
        value={pin}
        inputMode="numeric"
        maxLength={4}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
        className="w-40"
        style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
      />
      <div className="text-xs" style={{ color: TEXT_SUBTLE }}>
        {invalid ? "PIN 4 haneli olmalı." : conflict ? "Bu PIN zaten kullanılıyor." : " "}&nbsp;
      </div>
      <DialogFooter>
        <Button
          disabled={invalid || conflict}
          className="rounded-md px-4 py-2"
          style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
        >
          Kaydet
        </Button>
      </DialogFooter>
    </form>
  )
}

type EmployeeSheetProps = {
  open: boolean
  onOpenChange: (o: boolean) => void
  roles: string[]
  existingPins: Set<string>
  onSave: (payload: Omit<Employee, "id"> & { id?: string }) => void
  editing?: Employee
  onAddNewRole: (roleName: string) => string
}

function EmployeeSheet({ open, onOpenChange, roles, existingPins, onSave, editing, onAddNewRole }: EmployeeSheetProps) {
  const [name, setName] = useState(editing?.name ?? "")
  const [email, setEmail] = useState(editing?.email ?? "")
  const [phone, setPhone] = useState(editing?.phone ?? "")
  const [role, setRole] = useState(editing?.role ?? roles[0] ?? "Yönetici")
  const [randomPin, setRandomPin] = useState(true)
  const [pin, setPin] = useState(editing?.pin ?? "")
  const [avatar, setAvatar] = useState<string | undefined>(editing?.avatar)

  // New role creation modal state
  const [newRoleModalOpen, setNewRoleModalOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")

  const effectivePin = useMemo(() => {
    if (randomPin) {
      const set = new Set(existingPins)
      if (editing) set.delete(editing.pin)
      return generateUniquePin(set)
    }
    return pin
  }, [randomPin, pin, existingPins, editing])

  const canSave = name.trim().length > 1 && (randomPin || /^\d{4}$/.test(pin))

  const handleCreateNewRole = () => {
    if (newRoleName.trim().length < 2) {
      alert("Rol adı en az 2 karakter olmalıdır.")
      return
    }
    if (roles.includes(newRoleName.trim())) {
      alert("Bu rol adı zaten mevcut.")
      return
    }

    const createdRoleName = onAddNewRole(newRoleName.trim())
    setRole(createdRoleName)
    setNewRoleName("")
    setNewRoleModalOpen(false)
  }

  return (
    <>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl"
        style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
      >
        <SheetHeader>
          <SheetTitle>{editing ? "Personeli Düzenle" : "Yeni Personel Ekle"}</SheetTitle>
          <SheetDescription style={{ color: TEXT_SUBTLE }}>Profil ve erişim bilgilerini doldurun.</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="relative h-16 w-16 overflow-hidden rounded-full ring-2"
              style={{ borderColor: BORDER_SOFT as any }}
            >
              <Image
                src={avatar || "/placeholder.svg?height=64&width=64&query=avatar"}
                alt="Avatar"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div>
              <Label className="text-sm">Profil Fotoğrafı</Label>
              <Input
                type="file"
                accept="image/*"
                className="mt-1 file:text-white"
                style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input
              id="name"
              placeholder="Batıkan Poyraz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="batikan@coffeetainer.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+90 555 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Rol</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition"
                  style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
                >
                  <span>{role}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]"
                style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
              >
                <DropdownMenuLabel>Rol Seçin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {roles.map((r) => (
                  <DropdownMenuItem key={r} onClick={() => setRole(r)}>
                    {r}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setNewRoleModalOpen(true)}
                  className="flex items-center gap-2"
                  style={{ color: ACCENT }}
                >
                  <Plus className="h-4 w-4" />
                  Yeni Rol Oluştur
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator className="bg-white/10" />
          <div className="flex items-center justify-between">
            <Label htmlFor="randomPin">Rastgele PIN Oluştur</Label>
            <Switch id="randomPin" checked={randomPin} onCheckedChange={setRandomPin} />
          </div>
          {!randomPin ? (
            <div className="space-y-1.5">
              <Label htmlFor="pin">PIN (4 hane)</Label>
              <Input
                id="pin"
                type="number"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="text"
                placeholder="••••"
                value={effectivePin}
                readOnly
                style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
              />
            </div>
          )}
        </div>
        <SheetFooter>
          <Button
            disabled={!canSave}
            onClick={() => {
              onSave({ id: editing?.id, name, email, phone, role, pin: effectivePin, active: true, avatar })
            }}
            className="rounded-md px-4 py-2"
            style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
          >
            Kaydet
          </Button>
        </SheetFooter>
      </SheetContent>

      {/* New Role Creation Modal */}
      <Dialog open={newRoleModalOpen} onOpenChange={setNewRoleModalOpen}>
        <DialogContent
          className="sm:max-w-md"
          style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
        >
          <DialogHeader>
            <DialogTitle>Yeni Rol Tanımla</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="newRoleName">Rol Adı</Label>
              <Input
                id="newRoleName"
                placeholder="Örn: Vardiya Şefi Yardımcısı"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleCreateNewRole()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setNewRoleModalOpen(false)
                setNewRoleName("")
              }}
              style={{ borderColor: BORDER_SOFT, color: TEXT }}
            >
              İptal
            </Button>
            <Button
              onClick={handleCreateNewRole}
              disabled={newRoleName.trim().length < 2}
              style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
            >
              Rolü Oluştur ve Seç
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Types for the new components
type RolesTabProps = {
  roles: Role[]
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>
  pushToast: (m: string, undo?: () => void) => void
}

// Roles and permissions management tab
function RolesTab({ roles, setRoles, pushToast }: RolesTabProps) {
  const [selectedId, setSelectedId] = useState<string>(roles[0]?.id ?? "")
  const selected = roles.find((r) => r.id === selectedId) ?? roles[0]

  const [newRoleForm, setNewRoleForm] = useState({ open: false, name: "" })

  const handleAddNewRole = () => {
    if (newRoleForm.name.trim().length < 2) {
      alert("Rol adı en az 2 karakter olmalıdır.")
      return
    }
    if (roles.some((r) => r.name === newRoleForm.name.trim())) {
      alert("Bu rol adı zaten mevcut.")
      return
    }

    const baseNone = MODULES.reduce(
      (acc, m) => ({ ...acc, [m.key]: { ...ALL_FALSE } }),
      {} as Record<ModuleKey, Permission>,
    )
    const newRole: Role = {
      id: "r-" + Date.now(),
      name: newRoleForm.name.trim(),
      perms: baseNone,
    }
    setRoles((prev) => [...prev, newRole])
    setSelectedId(newRole.id)
    setNewRoleForm({ open: false, name: "" })
    pushToast(`"${newRole.name}" rolü oluşturuldu.`)
  }

  const togglePerm = (roleId: string, moduleKey: ModuleKey, key: keyof Permission, value: boolean) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r
        const next = {
          ...r,
          perms: {
            ...r.perms,
            [moduleKey]: { ...r.perms[moduleKey], [key]: value },
          },
        }
        return next
      }),
    )
  }

  const setAllForModule = (roleId: string, moduleKey: ModuleKey, value: boolean) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r
        return {
          ...r,
          perms: {
            ...r.perms,
            [moduleKey]: { view: value, edit: value, del: value },
          },
        }
      }),
    )
  }

  const onSave = () => {
    pushToast("Rol izinleri güncellendi.")
  }

  if (!selected) {
    return (
      <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
        <CardHeader>
          <CardTitle>Roller ve İzinler</CardTitle>
          <CardDescription style={{ color: TEXT_SUBTLE }}>Henüz rol bulunamadı.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-[260px_1fr]">
      {/* Left: Role list */}
      <div className="space-y-4">
        <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
          <CardHeader className="pb-2">
            <CardTitle>Roller</CardTitle>
            <CardDescription style={{ color: TEXT_SUBTLE }}>Bir rol seçin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-left transition"
                  style={{
                    backgroundColor: r.id === selected.id ? "rgba(181,140,130,0.2)" : FILL_SOFT,
                    border: `1px solid ${BORDER_SOFT}`,
                    color: TEXT,
                  }}
                >
                  <span>{r.name}</span>
                  {r.id === selected.id ? (
                    <Badge
                      className="ml-2"
                      style={{
                        backgroundColor: "rgba(181,140,130,0.15)",
                        color: ACCENT,
                        borderColor: "rgba(181,140,130,0.4)",
                      }}
                    >
                      Seçili
                    </Badge>
                  ) : null}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* New Role Creation Card */}
        <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Yeni Rol Ekle</CardTitle>
            <CardDescription style={{ color: TEXT_SUBTLE }}>Yeni bir rol tanımlayın</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!newRoleForm.open ? (
              <Button
                onClick={() => setNewRoleForm({ open: true, name: "" })}
                className="w-full justify-start gap-2"
                variant="outline"
                style={{ borderColor: BORDER_SOFT, color: TEXT }}
              >
                <Plus className="h-4 w-4" />
                Yeni Rol Oluştur
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="newRoleName" className="text-sm">
                    Rol Adı
                  </Label>
                  <Input
                    id="newRoleName"
                    placeholder="Örn: Vardiya Şefi Yardımcısı"
                    value={newRoleForm.name}
                    onChange={(e) => setNewRoleForm((prev) => ({ ...prev, name: e.target.value }))}
                    style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddNewRole()
                      }
                      if (e.key === "Escape") {
                        setNewRoleForm({ open: false, name: "" })
                      }
                    }}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddNewRole}
                    disabled={newRoleForm.name.trim().length < 2}
                    className="flex-1"
                    style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
                  >
                    Oluştur
                  </Button>
                  <Button
                    onClick={() => setNewRoleForm({ open: false, name: "" })}
                    variant="outline"
                    style={{ borderColor: BORDER_SOFT, color: TEXT }}
                  >
                    İptal
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Permissions matrix - keep existing content */}
      <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
        <CardHeader className="pb-2">
          <CardTitle>İzinler - {selected.name}</CardTitle>
          <CardDescription style={{ color: TEXT_SUBTLE }}>
            Modül bazında görüntüleme, düzenleme ve silme yetkileri
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[680px]">
            <div
              className="grid grid-cols-[1fr_110px_110px_110px_120px] items-center px-2 py-2 text-xs"
              style={{ color: TEXT_SUBTLE }}
            >
              <div>Modül</div>
              <div className="text-center">Görüntüle</div>
              <div className="text-center">Düzenle</div>
              <div className="text-center">Sil</div>
              <div className="text-center">Toplu</div>
            </div>
            <Separator className="my-2 opacity-50" />
            <div className="space-y-1">
              {MODULES.map((m) => {
                const perm = selected.perms[m.key] as Permission | undefined
                const p = perm ?? { view: false, edit: false, del: false }
                return (
                  <div
                    key={m.key}
                    className="grid grid-cols-[1fr_110px_110px_110px_120px] items-center rounded-md px-2 py-2"
                    style={{ backgroundColor: FILL_SOFT, border: `1px solid ${BORDER_SOFT}` }}
                  >
                    <div className="text-sm">{m.label}</div>
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={!!p.view}
                        onCheckedChange={(v) => togglePerm(selected.id, m.key, "view", Boolean(v))}
                        aria-label={`${m.label} görüntüle`}
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={!!p.edit}
                        onCheckedChange={(v) => togglePerm(selected.id, m.key, "edit", Boolean(v))}
                        aria-label={`${m.label} düzenle`}
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={!!p.del}
                        onCheckedChange={(v) => togglePerm(selected.id, m.key, "del", Boolean(v))}
                        aria-label={`${m.label} sil`}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        style={{ color: TEXT }}
                        onClick={() => setAllForModule(selected.id, m.key, true)}
                      >
                        Hepsi Aç
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        style={{ color: TEXT }}
                        onClick={() => setAllForModule(selected.id, m.key, false)}
                      >
                        Kapat
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                className="rounded-md px-4 py-2"
                style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
                onClick={onSave}
              >
                Değişiklikleri Kaydet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Placeholder-style tab for simple forms (Şube, Bildirimler, Entegrasyonlar)
type PlaceholderField = { label: string; placeholder?: string }
function PlaceholderTab({
  title,
  description,
  fields,
}: { title: string; description?: string; fields?: PlaceholderField[] }) {
  return (
    <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription style={{ color: TEXT_SUBTLE }}>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {(fields ?? []).map((f, idx) => (
          <div key={`${f.label}-${idx}`} className="space-y-1.5">
            <Label>{f.label}</Label>
            <Input
              placeholder={f.placeholder}
              style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
            />
          </div>
        ))}
        {(!fields || fields.length === 0) && (
          <div className="text-sm" style={{ color: TEXT_SUBTLE }}>
            Bu bölüm yakında doldurulacak ayar alanları için yer tutucudur.
          </div>
        )}
        <div className="sm:col-span-2 flex justify-end">
          <Button className="rounded-md px-4 py-2" style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}>
            Kaydet
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
