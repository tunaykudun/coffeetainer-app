"use client"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { BG_CARD, BORDER_SOFT, TEXT, TEXT_SUBTLE, ACCENT, ACCENT_SECONDARY, WARNING } from "@/lib/palette"
import { ResponsiveContainer, AreaChart, Area } from "recharts"
import {
  TrendingUp,
  DollarSign,
  Coffee,
  Package,
  AlertTriangle,
  Clock,
  Target,
  Calendar,
  MessageCircle,
  UserCheck,
  ClipboardList,
  Award,
  Bell,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data
const todayTeam = [
  { id: 1, name: "Tunay Kudun", role: "Yönetici", shift: "sabah", avatar: "TK" },
  { id: 2, name: "Umut Alıtkan", role: "Kıdemli Barista", shift: "sabah", avatar: "UA" },
  { id: 3, name: "Zeynep Soysal", role: "Deneyimli Barista", shift: "sabah", avatar: "ZS" },
  { id: 4, name: "Nur Özkan", role: "Deneyimli Barista", shift: "akşam", avatar: "NÖ" },
  { id: 5, name: "Ekin Yağanak", role: "Yeni Barista", shift: "akşam", avatar: "EY" },
]

const financialData = [
  { name: "Pzt", value: 4200 },
  { name: "Sal", value: 3800 },
  { name: "Çar", value: 5200 },
  { name: "Per", value: 4800 },
  { name: "Cum", value: 6200 },
  { name: "Cmt", value: 7800 },
  { name: "Paz", value: 6400 },
]

const branchPerformance = [
  { branch: "Merkez Şube", sales: 45200, growth: "+12%" },
  { branch: "AVM Şube", sales: 38900, growth: "+8%" },
  { branch: "Üniversite Şube", sales: 32100, growth: "+15%" },
]

const recentActivities = [
  { user: "Umut Alıtkan", action: "yeni bir zayi ekledi", time: "5 dk önce", type: "warning" },
  { user: "Zeynep Soysal", action: "shift planını güncelledi", time: "12 dk önce", type: "info" },
  { user: "Nur Özkan", action: "stok sayımı tamamladı", time: "25 dk önce", type: "success" },
  { user: "Ekin Yağanak", action: "sisteme giriş yaptı", time: "1 saat önce", type: "info" },
]

const personalTasks = [
  { id: 1, task: "Depodan şurupları getir", completed: false, priority: "high" },
  { id: 2, task: "Kahve makinesinin temizliğini yap", completed: true, priority: "medium" },
  { id: 3, task: "Günlük satış raporunu hazırla", completed: false, priority: "high" },
  { id: 4, task: "Yeni personele eğitim ver", completed: false, priority: "low" },
]

const recentMessages = [
  { user: "Tunay Kudun", message: "Bugün yeni kampanyayı unutmayın!", time: "10 dk önce" },
  { user: "Umut Alıtkan", message: "Akşam vardiyası için ekstra malzeme hazırladım", time: "25 dk önce" },
  { user: "Zeynep Soysal", message: "Kahve makinesi bakımı tamamlandı ✅", time: "1 saat önce" },
]

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const router = useRouter()

  if (!currentUser) return null

  const isManager = currentUser.role === "Yönetici/Kıdemli" || currentUser.role === "Kıdemli Barista"
  const isBarista = currentUser.role === "Deneyimli Barista" || currentUser.role === "Yeni Barista"

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Yönetici/Kıdemli":
        return ACCENT
      case "Kıdemli Barista":
        return "#4D79FF"
      case "Deneyimli Barista":
        return "#FF8A4D"
      default:
        return TEXT_SUBTLE
    }
  }

  const morningTeam = todayTeam.filter((member) => member.shift === "sabah")
  const eveningTeam = todayTeam.filter((member) => member.shift === "akşam")

  const currentUserShift = todayTeam.find((member) => member.name === currentUser.name)

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Common Components - Personalized Greeting */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold" style={{ color: TEXT }}>
              Hoş geldin, {currentUser.name.split(" ")[0]}! 👋
            </h1>
            <p style={{ color: TEXT_SUBTLE }}>Bugün harika bir gün olacak! İşte bugünün özeti:</p>
          </div>

          {/* Today's Duty Team */}
          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2" style={{ color: TEXT }}>
                <UserCheck className="h-5 w-5" style={{ color: ACCENT }} />
                Günün Nöbetçi Ekibi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: TEXT }}>
                    <Clock className="h-4 w-4" style={{ color: ACCENT_SECONDARY }} />
                    Sabah Vardiyası (08:00 - 16:00)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {morningTeam.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 p-2 rounded-lg"
                        style={{ backgroundColor: `${ACCENT}10` }}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback
                            className="text-xs"
                            style={{
                              backgroundColor: getRoleColor(member.role),
                              color: member.role === "Yönetici/Kıdemli" ? "#000" : "#fff",
                            }}
                          >
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm" style={{ color: TEXT }}>
                          {member.name.split(" ")[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: TEXT }}>
                    <Clock className="h-4 w-4" style={{ color: WARNING }} />
                    Akşam Vardiyası (16:00 - 00:00)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {eveningTeam.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 p-2 rounded-lg"
                        style={{ backgroundColor: `${WARNING}10` }}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback
                            className="text-xs"
                            style={{
                              backgroundColor: getRoleColor(member.role),
                              color: member.role === "Yönetici/Kıdemli" ? "#000" : "#fff",
                            }}
                          >
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm" style={{ color: TEXT }}>
                          {member.name.split(" ")[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => router.push("/mola-yonetimi")}
              className="flex items-center gap-2"
              style={{ backgroundColor: ACCENT, color: "#000" }}
            >
              <Coffee className="h-4 w-4" />
              Mola Paneli
            </Button>
            {isManager && (
              <Button
                onClick={() => router.push("/shift-planlama")}
                variant="outline"
                className="flex items-center gap-2"
                style={{ borderColor: ACCENT, color: ACCENT }}
              >
                <Calendar className="h-4 w-4" />
                Shift Planlama
              </Button>
            )}
            <Button
              onClick={() => router.push("/ekip-sohbeti")}
              variant="outline"
              className="flex items-center gap-2"
              style={{ borderColor: ACCENT_SECONDARY, color: ACCENT_SECONDARY }}
            >
              <MessageCircle className="h-4 w-4" />
              Ekip Sohbeti
            </Button>
          </div>
        </div>

        {/* Role-Based Dynamic Panels */}
        {isManager ? (
          // Manager/Senior Barista View - "Big Picture"
          <div className="space-y-6">
            <h2 className="text-xl font-semibold" style={{ color: TEXT }}>
              İşletme Durumu
            </h2>

            {/* Financial Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: TEXT_SUBTLE }}>
                        Dünkü Ciro
                      </p>
                      <p className="text-2xl font-bold" style={{ color: TEXT }}>
                        ₺6,240
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" style={{ color: ACCENT }} />
                        <span className="text-xs" style={{ color: ACCENT }}>
                          +12.5%
                        </span>
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8" style={{ color: ACCENT }} />
                  </div>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: TEXT_SUBTLE }}>
                        Haftalık Ciro
                      </p>
                      <p className="text-2xl font-bold" style={{ color: TEXT }}>
                        ₺42,800
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" style={{ color: ACCENT }} />
                        <span className="text-xs" style={{ color: ACCENT }}>
                          +8.2%
                        </span>
                      </div>
                    </div>
                    <div className="w-16 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={financialData}>
                          <Area type="monotone" dataKey="value" stroke={ACCENT} fill={`${ACCENT}20`} strokeWidth={1} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: TEXT_SUBTLE }}>
                        Aylık Hedefe Kalan
                      </p>
                      <p className="text-2xl font-bold" style={{ color: TEXT }}>
                        ₺28,200
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Target className="h-3 w-3" style={{ color: WARNING }} />
                        <span className="text-xs" style={{ color: WARNING }}>
                          %68 tamamlandı
                        </span>
                      </div>
                    </div>
                    <Target className="h-8 w-8" style={{ color: WARNING }} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Operational Alerts & Branch Performance */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: TEXT }}>
                    <Bell className="h-5 w-5" style={{ color: WARNING }} />
                    Operasyonel Uyarılar
                  </CardTitle>
                  <CardDescription style={{ color: TEXT_SUBTLE }}>Acil eylem gerektiren konular</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: `${WARNING}15` }}
                    onClick={() => router.push("/stok-yonetimi")}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4" style={{ color: WARNING }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: TEXT }}>
                          Kritik Stok Seviyesi
                        </p>
                        <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                          3 ürün kritik seviyede
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4" style={{ color: WARNING }} />
                  </div>

                  <div
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: `${WARNING}15` }}
                    onClick={() => router.push("/zayi-yonetimi")}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4" style={{ color: WARNING }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: TEXT }}>
                          Bugün Gelen Zayiat
                        </p>
                        <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                          2 adet ürün zayi
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4" style={{ color: WARNING }} />
                  </div>

                  <div
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: `${ACCENT}15` }}
                    onClick={() => router.push("/shift-planlama")}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4" style={{ color: ACCENT }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: TEXT }}>
                          Onay Bekleyen Shift Talepleri
                        </p>
                        <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                          1 talep bekliyor
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4" style={{ color: ACCENT }} />
                  </div>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: TEXT }}>
                    <Award className="h-5 w-5" style={{ color: ACCENT }} />
                    Şube Performans Liderliği
                  </CardTitle>
                  <CardDescription style={{ color: TEXT_SUBTLE }}>Haftalık satış sıralaması</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {branchPerformance.map((branch, index) => (
                    <div
                      key={branch.branch}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: index === 0 ? `${ACCENT}10` : `${TEXT_SUBTLE}05` }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: index === 0 ? ACCENT : index === 1 ? ACCENT_SECONDARY : TEXT_SUBTLE,
                            color: index === 0 ? "#000" : "#fff",
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: TEXT }}>
                            {branch.branch}
                          </p>
                          <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                            ₺{branch.sales.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium" style={{ color: ACCENT }}>
                        {branch.growth}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Activity Log Summary */}
            <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: TEXT }}>
                  <ClipboardList className="h-5 w-5" style={{ color: ACCENT_SECONDARY }} />
                  Son Aktiviteler
                </CardTitle>
                <CardDescription style={{ color: TEXT_SUBTLE }}>Sistemdeki son hareketler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg"
                      style={{ backgroundColor: `${TEXT_SUBTLE}05` }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            activity.type === "warning"
                              ? WARNING
                              : activity.type === "success"
                                ? ACCENT
                                : ACCENT_SECONDARY,
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm" style={{ color: TEXT }}>
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Barista View - "My Day"
          <div className="space-y-6">
            <h2 className="text-xl font-semibold" style={{ color: TEXT }}>
              Benim Günüm
            </h2>

            {/* Today's Shift */}
            {currentUserShift && (
              <Card style={{ backgroundColor: `${ACCENT}10`, borderColor: ACCENT, borderWidth: "2px" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: TEXT }}>
                    <Calendar className="h-5 w-5" style={{ color: ACCENT }} />
                    Bugünkü Vardiyam
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium" style={{ color: TEXT_SUBTLE }}>
                        Vardiya Saati
                      </p>
                      <p className="text-lg font-bold" style={{ color: TEXT }}>
                        {currentUserShift.shift === "sabah" ? "08:00 - 16:00" : "16:00 - 00:00"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: TEXT_SUBTLE }}>
                        Şube
                      </p>
                      <p className="text-lg font-bold" style={{ color: TEXT }}>
                        Merkez Şube
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: TEXT_SUBTLE }}>
                        Ekip Arkadaşları
                      </p>
                      <div className="flex gap-1 mt-1">
                        {todayTeam
                          .filter(
                            (member) => member.shift === currentUserShift.shift && member.id !== currentUserShift.id,
                          )
                          .map((member) => (
                            <Avatar key={member.id} className="h-6 w-6">
                              <AvatarFallback
                                className="text-xs"
                                style={{
                                  backgroundColor: getRoleColor(member.role),
                                  color: member.role === "Yönetici/Kıdemli" ? "#000" : "#fff",
                                }}
                              >
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Personal Task List */}
              <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: TEXT }}>
                    <ClipboardList className="h-5 w-5" style={{ color: ACCENT_SECONDARY }} />
                    Kişisel Görev Listem
                  </CardTitle>
                  <CardDescription style={{ color: TEXT_SUBTLE }}>Bugün tamamlanması gereken görevler</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {personalTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${task.completed ? "opacity-60" : ""}`}
                      style={{ backgroundColor: `${TEXT_SUBTLE}05` }}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: ACCENT }}
                        readOnly
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${task.completed ? "line-through" : ""}`} style={{ color: TEXT }}>
                          {task.task}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                task.priority === "high"
                                  ? WARNING
                                  : task.priority === "medium"
                                    ? ACCENT_SECONDARY
                                    : TEXT_SUBTLE,
                            }}
                          />
                          <span className="text-xs capitalize" style={{ color: TEXT_SUBTLE }}>
                            {task.priority === "high" ? "Yüksek" : task.priority === "medium" ? "Orta" : "Düşük"}{" "}
                            öncelik
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Need to Know Info */}
              <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: TEXT }}>
                    <Bell className="h-5 w-5" style={{ color: WARNING }} />
                    Bilmem Gerekenler
                  </CardTitle>
                  <CardDescription style={{ color: TEXT_SUBTLE }}>Bugünkü önemli bilgiler</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${ACCENT}15` }}>
                    <p className="text-sm font-medium" style={{ color: TEXT }}>
                      📅 Günün Ürünü
                    </p>
                    <p className="text-lg font-bold mt-1" style={{ color: ACCENT }}>
                      Soğuk Demleme (Cold Brew)
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${WARNING}15` }}>
                    <p className="text-sm font-medium" style={{ color: TEXT }}>
                      🎯 Bugünkü Kampanya
                    </p>
                    <p className="text-lg font-bold mt-1" style={{ color: WARNING }}>
                      Kruvasan + Filtre Kahve ₺150
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${ACCENT_SECONDARY}15` }}>
                    <p className="text-sm font-medium" style={{ color: TEXT }}>
                      ⏰ Önemli Hatırlatma
                    </p>
                    <p className="text-sm mt-1" style={{ color: TEXT }}>
                      Saat 14:00'da ekip toplantısı var
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Team Chat Messages */}
            <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: TEXT }}>
                  <MessageCircle className="h-5 w-5" style={{ color: ACCENT_SECONDARY }} />
                  Son Ekip Sohbeti Mesajları
                </CardTitle>
                <CardDescription style={{ color: TEXT_SUBTLE }}>Kaçırmamanız gereken duyurular</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMessages.map((message, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: `${TEXT_SUBTLE}05` }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback
                          className="text-xs"
                          style={{
                            backgroundColor: ACCENT_SECONDARY,
                            color: "#fff",
                          }}
                        >
                          {getInitials(message.user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium" style={{ color: TEXT }}>
                            {message.user.split(" ")[0]}
                          </p>
                          <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                            {message.time}
                          </p>
                        </div>
                        <p className="text-sm" style={{ color: TEXT }}>
                          {message.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => router.push("/ekip-sohbeti")}
                  variant="outline"
                  className="w-full mt-4"
                  style={{ borderColor: ACCENT_SECONDARY, color: ACCENT_SECONDARY }}
                >
                  Tüm Mesajları Görüntüle
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  )
}
