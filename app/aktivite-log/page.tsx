"use client"

import React, { useState, useMemo, useCallback } from "react"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from "@/components/ui"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Download,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react"
import { ACCENT, BG_CARD, BG_DEEP, BORDER_SOFT, TEXT, TEXT_SUBTLE, FILL_SOFT, WARNING, POSITIVE } from "@/lib/palette"

// Types
type ActivityType = "login" | "shift_change" | "inventory_update" | "sale" | "system" | "error"
type ActivityLevel = "info" | "warning" | "error" | "success"

interface ActivityLog {
  id: string
  userId: string
  userName: string
  userRole: string
  action: string
  details: string
  type: ActivityType
  level: ActivityLevel
  timestamp: Date
  ipAddress?: string
  metadata?: Record<string, any>
}

// Static data - memoized to prevent re-renders
const ACTION_TYPES: { value: ActivityType; label: string; icon: React.ReactNode }[] = [
  { value: "login", label: "Giriş/Çıkış", icon: <User className="h-4 w-4" /> },
  { value: "shift_change", label: "Vardiya Değişimi", icon: <Clock className="h-4 w-4" /> },
  { value: "inventory_update", label: "Stok Güncelleme", icon: <Activity className="h-4 w-4" /> },
  { value: "sale", label: "Satış İşlemi", icon: <TrendingUp className="h-4 w-4" /> },
  { value: "system", label: "Sistem", icon: <FileText className="h-4 w-4" /> },
  { value: "error", label: "Hata", icon: <AlertTriangle className="h-4 w-4" /> },
]

const USERS = [
  { id: "tunay", name: "Tunay Kudun", role: "Yönetici" },
  { id: "umut", name: "Umut Alıtkan", role: "Kıdemli Barista" },
  { id: "zeynep", name: "Zeynep Soysal", role: "Deneyimli Barista" },
  { id: "nur", name: "Nur Özkan", role: "Deneyimli Barista" },
  { id: "ekin", name: "Ekin Yağanak", role: "Yeni Barista" },
  { id: "tugra", name: "Tuğra Güneysi", role: "Yeni Barista" },
  { id: "eren", name: "Eren Şen", role: "Yeni Barista" },
  { id: "ezel", name: "Ezel Beycioğlu", role: "Yeni Barista" },
  { id: "gizem", name: "Gizem Yıldız", role: "Yeni Barista" },
  { id: "system", name: "Sistem", role: "Sistem" },
]

// Mock activity logs
const ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "1",
    userId: "tunay",
    userName: "Tunay Kudun",
    userRole: "Yönetici",
    action: "Sistem Girişi",
    details: "Dashboard'a başarılı giriş yapıldı",
    type: "login",
    level: "success",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    userId: "umut",
    userName: "Umut Alıtkan",
    userRole: "Kıdemli Barista",
    action: "Shift Planı Güncellendi",
    details: "Salı akşam vardiyası için özel durum eklendi",
    type: "shift_change",
    level: "info",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    metadata: { shiftDate: "2024-11-12", shiftType: "aksam" },
  },
  {
    id: "3",
    userId: "system",
    userName: "Sistem",
    userRole: "Sistem",
    action: "Otomatik Stok Kontrolü",
    details: "Espresso çekirdekleri kritik seviyede (5 kg kaldı)",
    type: "inventory_update",
    level: "warning",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    metadata: { product: "espresso-beans", quantity: 5, unit: "kg" },
  },
  {
    id: "4",
    userId: "zeynep",
    userName: "Zeynep Soysal",
    userRole: "Deneyimli Barista",
    action: "Satış İşlemi",
    details: "Cappuccino x2, Americano x1 - Toplam: ₺85.00",
    type: "sale",
    level: "success",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    metadata: { total: 85.0, items: ["cappuccino", "americano"] },
  },
  {
    id: "5",
    userId: "system",
    userName: "Sistem",
    userRole: "Sistem",
    action: "Bağlantı Hatası",
    details: "POS sistemi ile bağlantı kesildi, yeniden bağlanıyor...",
    type: "error",
    level: "error",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    metadata: { errorCode: "CONNECTION_LOST", service: "pos-system" },
  },
  {
    id: "6",
    userId: "nur",
    userName: "Nur Özkan",
    userRole: "Deneyimli Barista",
    action: "Stok Güncelleme",
    details: "Süt stoğu güncellendi: 15 litre eklendi",
    type: "inventory_update",
    level: "info",
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    metadata: { product: "milk", quantity: 15, unit: "litre", action: "add" },
  },
  {
    id: "7",
    userId: "ekin",
    userName: "Ekin Yağanak",
    userRole: "Yeni Barista",
    action: "Vardiya Başlangıcı",
    details: "Sabah vardiyasına başladı",
    type: "shift_change",
    level: "info",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    metadata: { shiftType: "sabah", startTime: "08:00" },
  },
  {
    id: "8",
    userId: "system",
    userName: "Sistem",
    userRole: "Sistem",
    action: "Günlük Rapor",
    details: "Günlük satış raporu oluşturuldu ve e-posta ile gönderildi",
    type: "system",
    level: "success",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    metadata: { reportType: "daily-sales", recipients: ["management@coffeetainer.com"] },
  },
]

// Isolated search component to prevent re-renders
const ActivitySearch = React.memo(({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
      <Input
        placeholder="Aktivite ara..."
        value={value}
        onChange={handleChange}
        className="pl-9"
        style={{ backgroundColor: BG_DEEP, borderColor: BORDER_SOFT, color: TEXT }}
      />
    </div>
  )
})

export default function AktiviteLogPage() {
  const { currentUser } = useAuth()

  // State management
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<ActivityType | "all">("all")
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<ActivityLevel | "all">("all")

  // Memoized static data
  const staticActionTypes = useMemo(() => ACTION_TYPES, [])
  const staticUsers = useMemo(() => USERS, [])
  const staticActivityLogs = useMemo(() => ACTIVITY_LOGS, [])

  // Stable search handler
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  // Memoized filtered logs
  const filteredLogs = useMemo(() => {
    return staticActivityLogs
      .filter((log) => {
        const matchesSearch =
          !searchTerm.trim() ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.userName.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = selectedType === "all" || log.type === selectedType
        const matchesUser = selectedUser === "all" || log.userId === selectedUser
        const matchesLevel = selectedLevel === "all" || log.level === selectedLevel

        return matchesSearch && matchesType && matchesUser && matchesLevel
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [searchTerm, selectedType, selectedUser, selectedLevel, staticActivityLogs])

  // Memoized stats
  const stats = useMemo(() => {
    const total = filteredLogs.length
    const byLevel = filteredLogs.reduce(
      (acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1
        return acc
      },
      {} as Record<ActivityLevel, number>,
    )

    return {
      total,
      success: byLevel.success || 0,
      warning: byLevel.warning || 0,
      error: byLevel.error || 0,
      info: byLevel.info || 0,
    }
  }, [filteredLogs])

  // Helper functions
  const getLevelIcon = useCallback((level: ActivityLevel) => {
    switch (level) {
      case "success":
        return <CheckCircle className="h-4 w-4" style={{ color: POSITIVE }} />
      case "warning":
        return <AlertTriangle className="h-4 w-4" style={{ color: WARNING }} />
      case "error":
        return <AlertTriangle className="h-4 w-4" style={{ color: "#EF4444" }} />
      case "info":
      default:
        return <Info className="h-4 w-4" style={{ color: "#3B82F6" }} />
    }
  }, [])

  const getLevelColor = useCallback((level: ActivityLevel) => {
    switch (level) {
      case "success":
        return POSITIVE
      case "warning":
        return WARNING
      case "error":
        return "#EF4444"
      case "info":
      default:
        return "#3B82F6"
    }
  }, [])

  const formatTimestamp = useCallback((date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Az önce"
    if (minutes < 60) return `${minutes} dakika önce`
    if (hours < 24) return `${hours} saat önce`
    if (days < 7) return `${days} gün önce`

    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [])

  const getTypeIcon = useCallback(
    (type: ActivityType) => {
      const actionType = staticActionTypes.find((at) => at.value === type)
      return actionType?.icon || <Activity className="h-4 w-4" />
    },
    [staticActionTypes],
  )

  const exportLogs = useCallback(() => {
    // Simulate export functionality
    const csvContent = filteredLogs
      .map((log) => `${log.timestamp.toISOString()},${log.userName},${log.action},${log.details},${log.level}`)
      .join("\n")

    const blob = new Blob([`Zaman,Kullanıcı,Eylem,Detaylar,Seviye\n${csvContent}`], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `aktivite-log-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }, [filteredLogs])

  // Check if user has admin access
  const hasAdminAccess = currentUser?.role === "Yönetici"

  if (!hasAdminAccess) {
    return (
      <AppShell>
        <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" style={{ color: WARNING }} />
              <h2 className="text-xl font-semibold mb-2">Erişim Yetkisi Gerekli</h2>
              <p style={{ color: TEXT_SUBTLE }}>Bu sayfaya erişim için yönetici yetkisi gereklidir.</p>
            </div>
          </CardContent>
        </Card>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: TEXT }}>
              Aktivite Logları
            </h1>
            <p className="text-sm opacity-75" style={{ color: TEXT }}>
              Sistem ve kullanıcı aktivitelerini izleyin
            </p>
          </div>
          <Button
            onClick={exportLogs}
            className="flex items-center gap-2"
            style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
          >
            <Download className="h-4 w-4" />
            Dışa Aktar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${ACCENT}20` }}>
                  <FileText className="h-5 w-5" style={{ color: ACCENT }} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm opacity-75">Toplam</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${POSITIVE}20` }}>
                  <CheckCircle className="h-5 w-5" style={{ color: POSITIVE }} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.success}</div>
                  <div className="text-sm opacity-75">Başarılı</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `#3B82F620` }}>
                  <Info className="h-5 w-5" style={{ color: "#3B82F6" }} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.info}</div>
                  <div className="text-sm opacity-75">Bilgi</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${WARNING}20` }}>
                  <AlertTriangle className="h-5 w-5" style={{ color: WARNING }} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.warning}</div>
                  <div className="text-sm opacity-75">Uyarı</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#EF444420" }}>
                  <AlertTriangle className="h-5 w-5" style={{ color: "#EF4444" }} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.error}</div>
                  <div className="text-sm opacity-75">Hata</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtreler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ActivitySearch value={searchTerm} onChange={handleSearchChange} />

              <Select value={selectedType} onValueChange={(value: ActivityType | "all") => setSelectedType(value)}>
                <SelectTrigger style={{ backgroundColor: BG_DEEP, borderColor: BORDER_SOFT, color: TEXT }}>
                  <SelectValue placeholder="Tür seçin" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
                  <SelectItem value="all">Tüm Türler</SelectItem>
                  {staticActionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {type.icon}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger style={{ backgroundColor: BG_DEEP, borderColor: BORDER_SOFT, color: TEXT }}>
                  <SelectValue placeholder="Kullanıcı seçin" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
                  <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                  {staticUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={(value: ActivityLevel | "all") => setSelectedLevel(value)}>
                <SelectTrigger style={{ backgroundColor: BG_DEEP, borderColor: BORDER_SOFT, color: TEXT }}>
                  <SelectValue placeholder="Seviye seçin" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
                  <SelectItem value="all">Tüm Seviyeler</SelectItem>
                  <SelectItem value="success">Başarılı</SelectItem>
                  <SelectItem value="info">Bilgi</SelectItem>
                  <SelectItem value="warning">Uyarı</SelectItem>
                  <SelectItem value="error">Hata</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
          <CardHeader className="pb-3">
            <CardTitle>Aktivite Geçmişi ({filteredLogs.length} kayıt)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8" style={{ color: TEXT_SUBTLE }}>
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Filtrelere uygun aktivite bulunamadı</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 rounded-lg border"
                    style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT }}
                  >
                    <div className="flex-shrink-0">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${getLevelColor(log.level)}20` }}>
                        {getTypeIcon(log.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm">{log.action}</h3>
                            {getLevelIcon(log.level)}
                          </div>
                          <p className="text-sm opacity-75 mb-2">{log.details}</p>

                          <div className="flex items-center gap-4 text-xs opacity-60">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {log.userName} ({log.userRole})
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(log.timestamp)}
                            </div>
                            {log.ipAddress && (
                              <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {log.ipAddress}
                              </div>
                            )}
                          </div>
                        </div>

                        <Badge
                          className="flex-shrink-0"
                          style={{
                            backgroundColor: `${getLevelColor(log.level)}20`,
                            color: getLevelColor(log.level),
                            borderColor: getLevelColor(log.level),
                          }}
                        >
                          {log.level.toUpperCase()}
                        </Badge>
                      </div>

                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer opacity-60 hover:opacity-80">
                            Detayları göster
                          </summary>
                          <div className="mt-2 p-2 rounded text-xs" style={{ backgroundColor: BG_DEEP }}>
                            <pre className="whitespace-pre-wrap">{JSON.stringify(log.metadata, null, 2)}</pre>
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
