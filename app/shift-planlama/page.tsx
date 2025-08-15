"use client"

import { useMemo, useState, useCallback } from "react"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Star,
  Wand2,
  Save,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  UserMinus,
  Settings,
  Send,
  Lock,
  Sparkles,
  User,
} from "lucide-react"
import {
  ACCENT,
  BG_CARD,
  BG_DEEP,
  BORDER_SOFT,
  HOVER_BG,
  TEXT,
  TEXT_SUBTLE,
  FILL_SOFT,
  WARNING,
  BG_SURFACE,
} from "@/lib/palette"
import { motion, AnimatePresence } from "framer-motion"

// Types
type ShiftKey = "sabah" | "aksam"
type Rank = "kidemli" | "deneyimli" | "yeni"
type ShiftRule = "sabah-only" | "aksam-only" | "sabah-aksam" | "flexible"

type Employee = {
  id: string
  name: string
  rank: Rank
  role: string
  rule?: ShiftRule
}

type SpecialSituation = {
  startTime?: string
  endTime?: string
  note?: string
}

type AssignmentMap = Record<string, string[]> // key: "dayIndex:shift" -> employeeIds[]
type SpecialSituationsMap = Record<string, Record<string, SpecialSituation>> // key: "dayIndex:shift" -> employeeId -> situation

const SHIFT_META: Record<ShiftKey, { label: string; time: string; bg: string; fg: string }> = {
  sabah: { label: "Sabah Vardiyası", time: "08:00 - 16:00", bg: HOVER_BG, fg: "#2d1d1e" },
  aksam: { label: "Akşam Vardiyası", time: "16:00 - 00:00", bg: ACCENT, fg: "#2d1d1e" },
}

const RANK_META: Record<
  Rank,
  {
    label: string
    circleBg: string
    circleFg: string
    stars: 1 | 2 | 3
  }
> = {
  kidemli: { label: "Kıdemli Barista", circleBg: "#b58c82", circleFg: "#2d1d1e", stars: 3 },
  deneyimli: { label: "Deneyimli Barista", circleBg: "#684444", circleFg: "#f8f5f4", stars: 2 },
  yeni: { label: "Yeni Barista", circleBg: "#f0e8e4", circleFg: "#2d1d1e", stars: 1 },
}

const SHIFT_RULES: Record<ShiftRule, string> = {
  "sabah-only": "Sadece Sabah Vardiyaları",
  "aksam-only": "Sadece Akşam Vardiyaları",
  "sabah-aksam": "Sabah veya Akşam (Gece Hariç)",
  flexible: "Esnek (Tüm Vardiyalar)",
}

const DAY_LABELS_TR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]
const MONTHS_TR = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
]

// Updated staff with full names and roles
const EMPLOYEES: Employee[] = [
  { id: "tunay", name: "Tunay Kudun", rank: "kidemli", role: "Yönetici", rule: "flexible" },
  { id: "umut", name: "Umut Alıtkan", rank: "kidemli", role: "Kıdemli Barista", rule: "sabah-aksam" },
  { id: "zeynep", name: "Zeynep Soysal", rank: "deneyimli", role: "Deneyimli Barista", rule: "flexible" },
  { id: "nur", name: "Nur Özkan", rank: "deneyimli", role: "Deneyimli Barista", rule: "sabah-only" },
  { id: "ekin", name: "Ekin Yağanak", rank: "yeni", role: "Yeni Barista", rule: "flexible" },
  { id: "tugra", name: "Tuğra Güneysi", rank: "yeni", role: "Yeni Barista", rule: "sabah-only" },
  { id: "eren", name: "Eren Şen", rank: "yeni", role: "Yeni Barista", rule: "flexible" },
  { id: "ezel", name: "Ezel Beycioğlu", rank: "yeni", role: "Yeni Barista", rule: "aksam-only" },
  { id: "gizem", name: "Gizem Yıldız", rank: "yeni", role: "Yeni Barista", rule: "flexible" },
]

// Utils
function startOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay() // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1) - day // move to Monday
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function keyOf(dayIndex: number, shift: ShiftKey) {
  return `${dayIndex}:${shift}`
}

function initials(name: string) {
  const parts = name.split(" ")
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : ""
  return `${first}${last}`.toUpperCase()
}

function formatWeekRange(weekStart: Date) {
  const start = new Date(weekStart)
  const end = new Date(weekStart)
  end.setDate(end.getDate() + 6)
  const s = `${start.getDate()}`
  const e = `${end.getDate()}`
  const monthName = MONTHS_TR[end.getMonth()]
  const year = end.getFullYear()
  return `${s} - ${e} ${monthName} ${year}`
}

function dayName(date: Date) {
  return DAY_LABELS_TR[(date.getDay() + 6) % 7] // Monday start
}

// Page
export default function ShiftPlanlamaPage() {
  const { currentUser } = useAuth()

  const [weekStart, setWeekStart] = useState<Date>(startOfWeek())
  const [assignments, setAssignments] = useState<AssignmentMap>(() => {
    // Demo seed with updated names
    const demo: AssignmentMap = {}
    demo[keyOf(0, "sabah")] = ["tunay", "zeynep", "ekin"]
    demo[keyOf(0, "aksam")] = ["umut", "eren"]
    demo[keyOf(1, "sabah")] = ["nur", "tugra"]
    demo[keyOf(2, "sabah")] = ["tunay", "gizem"]
    demo[keyOf(3, "aksam")] = ["zeynep", "eren", "ezel"]
    demo[keyOf(4, "sabah")] = ["ekin", "umut"]
    demo[keyOf(5, "sabah")] = ["umut", "nur"]
    demo[keyOf(6, "aksam")] = ["tunay", "ekin", "tugra"]
    return demo
  })

  const [specialSituations, setSpecialSituations] = useState<SpecialSituationsMap>(() => {
    // Demo special situations
    const demo: SpecialSituationsMap = {}
    demo[keyOf(1, "aksam")] = {
      ekin: { startTime: "20:00", note: "Sınavı var" },
    }
    return demo
  })

  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES)
  const [editor, setEditor] = useState<{
    open: boolean
    dayIndex: number
    shift: ShiftKey
    dayName: string
  } | null>(null)

  const [specialSituationEditor, setSpecialSituationEditor] = useState<{
    open: boolean
    employeeId: string
    employeeName: string
    dayIndex: number
    shift: ShiftKey
    situation: SpecialSituation
  } | null>(null)

  const [aiPlanningPopover, setAiPlanningPopover] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const days = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(weekStart)
        d.setDate(weekStart.getDate() + i)
        return d
      }),
    [weekStart],
  )

  // Determine editing permissions based on role
  const canEditShifts = currentUser && ["Yönetici", "Kıdemli Barista"].includes(currentUser.role)

  // Check if viewing past week (read-only mode)
  const isCurrentWeek = useMemo(() => {
    const currentWeekStart = startOfWeek()
    return weekStart.getTime() === currentWeekStart.getTime()
  }, [weekStart])

  const isReadOnly = !canEditShifts || !isCurrentWeek

  const goPrevWeek = useCallback(() => {
    setWeekStart((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7))
  }, [])

  const goNextWeek = useCallback(() => {
    setWeekStart((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7))
  }, [])

  const addToShift = useCallback(
    (dayIndex: number, shift: ShiftKey, empId: string) => {
      if (isReadOnly) return
      setAssignments((prev) => {
        const k = keyOf(dayIndex, shift)
        const set = new Set(prev[k] ?? [])
        set.add(empId)
        return { ...prev, [k]: Array.from(set) }
      })
    },
    [isReadOnly],
  )

  const removeFromShift = useCallback(
    (dayIndex: number, shift: ShiftKey, empId: string) => {
      if (isReadOnly) return
      setAssignments((prev) => {
        const k = keyOf(dayIndex, shift)
        const next = (prev[k] ?? []).filter((id) => id !== empId)
        return { ...prev, [k]: next }
      })
      // Also remove any special situations for this employee
      setSpecialSituations((prev) => {
        const k = keyOf(dayIndex, shift)
        if (prev[k] && prev[k][empId]) {
          const newSituations = { ...prev }
          delete newSituations[k][empId]
          if (Object.keys(newSituations[k]).length === 0) {
            delete newSituations[k]
          }
          return newSituations
        }
        return prev
      })
    },
    [isReadOnly],
  )

  const employeesForCell = useCallback(
    (dayIndex: number, shift: ShiftKey): Employee[] => {
      const ids = assignments[keyOf(dayIndex, shift)] ?? []
      return ids.map((id) => employees.find((e) => e.id === id)).filter(Boolean) as Employee[]
    },
    [assignments, employees],
  )

  const eligibleForCell = useCallback(
    (dayIndex: number, shift: ShiftKey): Employee[] => {
      const ids = new Set(assignments[keyOf(dayIndex, shift)] ?? [])
      return employees.filter((e) => !ids.has(e.id))
    },
    [assignments, employees],
  )

  const hasSpecialSituation = useCallback(
    (dayIndex: number, shift: ShiftKey, empId: string): boolean => {
      const k = keyOf(dayIndex, shift)
      return !!(specialSituations[k] && specialSituations[k][empId])
    },
    [specialSituations],
  )

  const getSpecialSituation = useCallback(
    (dayIndex: number, shift: ShiftKey, empId: string): SpecialSituation | null => {
      const k = keyOf(dayIndex, shift)
      return specialSituations[k]?.[empId] || null
    },
    [specialSituations],
  )

  const handleSaveChanges = useCallback(() => {
    // Simulate saving to database
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }, [])

  const handlePublishPlan = useCallback(() => {
    // Simulate publishing and sending notifications
    const weekRange = formatWeekRange(weekStart)

    // Create notification message with special situations
    let message = `📢 Haftalık Shift Planı Güncellendi! Yönetici, (${weekRange}) haftası için yeni bir plan yayınladı. Lütfen kendi vardiyalarınızı kontrol ediniz.`

    // Add special situations to the message
    const specialNotes: string[] = []
    Object.entries(specialSituations).forEach(([shiftKey, empSituations]) => {
      Object.entries(empSituations).forEach(([empId, situation]) => {
        const emp = employees.find((e) => e.id === empId)
        if (emp && situation.note) {
          const [dayIndex, shift] = shiftKey.split(":")
          const dayName = DAY_LABELS_TR[Number.parseInt(dayIndex)]
          specialNotes.push(
            `${emp.name}, ${dayName} günü vardiyasına ${situation.startTime || SHIFT_META[shift as ShiftKey].time.split(" - ")[0]}'da başlayacaktır${situation.note ? ` (${situation.note})` : ""}`,
          )
        }
      })
    })

    if (specialNotes.length > 0) {
      message += ` Önemli Notlar: ${specialNotes.join("; ")}.`
    }

    // In a real app, this would send to the communication center
    console.log("Shift plan published:", message)

    setPublishSuccess(true)
    setTimeout(() => setPublishSuccess(false), 4000)
  }, [weekStart, specialSituations, employees])

  const handleSpecialSituationSave = useCallback(
    (dayIndex: number, shift: ShiftKey, empId: string, situation: SpecialSituation) => {
      setSpecialSituations((prev) => {
        const k = keyOf(dayIndex, shift)
        const newSituations = { ...prev }
        if (!newSituations[k]) {
          newSituations[k] = {}
        }
        newSituations[k][empId] = situation
        return newSituations
      })
      setSpecialSituationEditor(null)
    },
    [],
  )

  const removeSpecialSituation = useCallback((dayIndex: number, shift: ShiftKey, empId: string) => {
    setSpecialSituations((prev) => {
      const k = keyOf(dayIndex, shift)
      if (prev[k] && prev[k][empId]) {
        const newSituations = { ...prev }
        delete newSituations[k][empId]
        if (Object.keys(newSituations[k]).length === 0) {
          delete newSituations[k]
        }
        return newSituations
      }
      return prev
    })
  }, [])

  const handleCellClick = useCallback(
    (dayIndex: number, shift: ShiftKey) => {
      if (isReadOnly) return

      setEditor({
        open: true,
        dayIndex,
        shift,
        dayName: dayName(days[dayIndex]),
      })
    },
    [isReadOnly, days],
  )

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: TEXT }}>
              Shift Planlama
            </h1>
            <p className="text-sm opacity-75" style={{ color: TEXT }}>
              {currentUser?.name} ({currentUser?.role}) -{" "}
              {isReadOnly ? (isCurrentWeek ? "Görüntüleme Modu" : "Geçmiş Hafta (Salt Okunur)") : "Düzenleme Modu"}
            </p>
          </div>
        </div>

        {/* Week Navigation Controls */}
        <Card className="border" style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                className="rounded-md px-4 py-2 text-sm transition-colors flex items-center gap-2"
                style={{ backgroundColor: BG_SURFACE, color: TEXT, border: `1px solid ${BORDER_SOFT}` }}
                onClick={goPrevWeek}
              >
                <ChevronLeft className="h-4 w-4" />
                Önceki Hafta
              </button>

              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <button
                    className="mx-4 rounded-md border px-6 py-2 text-lg font-semibold flex items-center gap-2 transition-colors hover:bg-opacity-80"
                    style={{ borderColor: BORDER_SOFT, backgroundColor: ACCENT, color: "#2d1d1e" }}
                  >
                    <CalendarIcon className="h-5 w-5" />
                    {formatWeekRange(weekStart)}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                  <Calendar
                    mode="single"
                    selected={weekStart}
                    onSelect={(date) => {
                      if (date) {
                        setWeekStart(startOfWeek(date))
                        setCalendarOpen(false)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <button
                className="rounded-md px-4 py-2 text-sm transition-colors flex items-center gap-2"
                style={{ backgroundColor: BG_SURFACE, color: TEXT, border: `1px solid ${BORDER_SOFT}` }}
                onClick={goNextWeek}
              >
                Sonraki Hafta
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Management Controls - Only visible for authorized roles and current week */}
        {canEditShifts && isCurrentWeek && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* AI Planning Button - Disabled */}
            <Popover open={aiPlanningPopover} onOpenChange={setAiPlanningPopover}>
              <PopoverTrigger asChild>
                <Button
                  disabled
                  className="rounded-md px-4 py-2 text-sm transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed"
                  style={{ backgroundColor: BG_SURFACE, color: TEXT_SUBTLE, border: `1px solid ${BORDER_SOFT}` }}
                >
                  <Wand2 className="h-4 w-4" />
                  <Sparkles className="h-4 w-4" />
                  AI ile Otomatik Planla
                  <Lock className="h-3 w-3 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80"
                style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${ACCENT}20` }}
                      >
                        <Sparkles className="w-6 h-6" style={{ color: ACCENT }} />
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2" style={{ color: TEXT }}>
                      Yapay Zeka Destekli Planlama
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: TEXT_SUBTLE }}>
                      Bu özellik, personelinizin sabit vardiya kurallarını, özel durumlarını ve adil bir çalışma
                      dağılımını göz önünde bulundurarak, tüm haftalık shift planını tek bir tıkla, saniyeler içinde
                      akıllıca oluşturur.
                    </p>
                  </div>

                  <div
                    className="p-3 rounded-lg border-2"
                    style={{
                      backgroundColor: `${ACCENT}10`,
                      borderColor: ACCENT,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4" style={{ color: ACCENT }} />
                      <span className="font-medium text-sm" style={{ color: ACCENT }}>
                        Premium Özellik
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: TEXT }}>
                      Bu premium özellik, şu anda aktif değildir. Aktif hale getirmek için yöneticinizle iletişime
                      geçin.
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
                    onClick={() => alert("İletişim formu açılacak (demo)")}
                  >
                    Daha Fazla Bilgi İçin İletişime Geçin
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              onClick={handleSaveChanges}
              className="rounded-md px-4 py-2 text-sm transition-colors flex items-center gap-2"
              style={{ backgroundColor: "#22c55e", color: "white" }}
            >
              <Save className="h-4 w-4" />
              Değişiklikleri Kaydet
            </Button>

            <Button
              onClick={handlePublishPlan}
              className="rounded-md px-4 py-2 text-sm transition-colors flex items-center gap-2 font-semibold"
              style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
            >
              <Send className="h-4 w-4" />📢 Haftalık Planı Yayınla
            </Button>
          </div>
        )}

        {/* Success Messages */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center gap-2 p-3 rounded-lg"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                color: "#22c55e",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <CheckCircle className="h-5 w-5" />
              <span>Shift planı başarıyla kaydedildi!</span>
            </motion.div>
          )}

          {publishSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center gap-2 p-3 rounded-lg"
              style={{
                backgroundColor: `${ACCENT}20`,
                color: ACCENT,
                border: `1px solid ${ACCENT}`,
              }}
            >
              <Send className="h-5 w-5" />
              <span>Haftalık plan yayınlandı ve personele bildirildi! 📢</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shift Planning Grid */}
        <Card className="border" style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
          <CardHeader className="pb-4">
            <CardTitle>
              {isReadOnly
                ? isCurrentWeek
                  ? "Haftalık Shift Programı (Görüntüleme)"
                  : "Geçmiş Hafta Shift Programı"
                : "Shift Planlama (İnteraktif Düzenleme)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 gap-3 min-w-[1000px]">
                {/* Header row */}
                <div className="col-span-1"></div>
                {days.map((d, i) => (
                  <div key={i} className="col-span-1 text-center p-2">
                    <div className="text-xs opacity-70" style={{ color: TEXT_SUBTLE }}>
                      {dayName(d)}
                    </div>
                    <div className="text-sm font-semibold" style={{ color: TEXT }}>
                      {d.getDate()}
                    </div>
                  </div>
                ))}

                {/* Shift rows */}
                {(["sabah", "aksam"] as ShiftKey[]).map((shift) => (
                  <ShiftRow
                    key={shift}
                    shift={shift}
                    days={days}
                    getPeople={employeesForCell}
                    onOpen={!isReadOnly ? handleCellClick : undefined}
                    hasSpecialSituation={hasSpecialSituation}
                    getSpecialSituation={getSpecialSituation}
                    canEdit={!isReadOnly}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personnel Seniority Table */}
        <Card className="border" style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Ekip ve Kıdem Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: BORDER_SOFT }}>
                    <th className="text-left py-3 px-4" style={{ color: TEXT }}>
                      Personel
                    </th>
                    <th className="text-left py-3 px-4" style={{ color: TEXT }}>
                      Rol/Unvan
                    </th>
                    <th className="text-left py-3 px-4" style={{ color: TEXT }}>
                      Kıdem Seviyesi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const meta = RANK_META[emp.rank]
                    return (
                      <tr key={emp.id} className="border-b" style={{ borderColor: BORDER_SOFT }}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <InitialCircle label={initials(emp.name)} bg={meta.circleBg} fg={meta.circleFg} />
                            <span className="font-medium" style={{ color: TEXT }}>
                              {emp.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span style={{ color: TEXT_SUBTLE }}>{emp.role}</span>
                        </td>
                        <td className="py-3 px-4">
                          <StarRow filled={meta.stars} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Personnel Assignment Modal */}
        {!isReadOnly && editor && (
          <Dialog open={editor.open} onOpenChange={(o) => setEditor(o ? editor : null)}>
            <DialogContent
              className="sm:max-w-2xl"
              style={{ backgroundColor: BG_CARD, color: TEXT, borderColor: BORDER_SOFT }}
            >
              <DialogHeader>
                <DialogTitle>{`${editor.dayName} ${SHIFT_META[editor.shift].label} Düzenle`}</DialogTitle>
                <DialogDescription className="opacity-80">{SHIFT_META[editor.shift].time}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 max-h-96 overflow-y-auto">
                {/* Current team */}
                <section className="space-y-3">
                  <div className="text-sm font-medium" style={{ color: TEXT }}>
                    Mevcut Ekip ({(assignments[keyOf(editor.dayIndex, editor.shift)] ?? []).length} kişi)
                  </div>
                  <div className="space-y-2">
                    {(assignments[keyOf(editor.dayIndex, editor.shift)] ?? []).length === 0 ? (
                      <div
                        className="px-4 py-3 rounded-lg border text-center text-sm"
                        style={{ borderColor: BORDER_SOFT, backgroundColor: FILL_SOFT, color: TEXT_SUBTLE }}
                      >
                        Henüz kimse atanmadı.
                      </div>
                    ) : (
                      (assignments[keyOf(editor.dayIndex, editor.shift)] ?? []).map((id) => {
                        const emp = employees.find((e) => e.id === id)!
                        const meta = RANK_META[emp.rank]
                        const hasSpecial = hasSpecialSituation(editor.dayIndex, editor.shift, id)
                        const specialSit = getSpecialSituation(editor.dayIndex, editor.shift, id)

                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border"
                            style={{ borderColor: BORDER_SOFT, backgroundColor: FILL_SOFT }}
                          >
                            <div className="flex items-center gap-3">
                              <InitialCircle label={initials(emp.name)} bg={meta.circleBg} fg={meta.circleFg} />
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{emp.name}</span>
                                  {hasSpecial && (
                                    <AlertTriangle
                                      className="h-4 w-4"
                                      style={{ color: WARNING }}
                                      title={`Özel durum: ${specialSit?.note || "Özel saat"}`}
                                    />
                                  )}
                                </div>
                                <span className="text-xs opacity-75">{meta.label}</span>
                                {hasSpecial && specialSit && (
                                  <span className="text-xs" style={{ color: WARNING }}>
                                    {specialSit.startTime && `Başlangıç: ${specialSit.startTime}`}
                                    {specialSit.note && ` - ${specialSit.note}`}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const currentSituation = getSpecialSituation(editor.dayIndex, editor.shift, id) || {}
                                  setSpecialSituationEditor({
                                    open: true,
                                    employeeId: id,
                                    employeeName: emp.name,
                                    dayIndex: editor.dayIndex,
                                    shift: editor.shift,
                                    situation: currentSituation,
                                  })
                                }}
                                style={{ borderColor: BORDER_SOFT, color: TEXT }}
                              >
                                <Settings className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromShift(editor.dayIndex, editor.shift, id)}
                                style={{ borderColor: BORDER_SOFT, color: TEXT }}
                              >
                                <UserMinus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </section>

                {/* Available personnel */}
                <section className="space-y-3">
                  <div className="text-sm font-medium" style={{ color: TEXT }}>
                    Eklenebilecek Personel ({eligibleForCell(editor.dayIndex, editor.shift).length} kişi)
                  </div>
                  <div className="space-y-2">
                    {eligibleForCell(editor.dayIndex, editor.shift).length === 0 ? (
                      <div
                        className="px-4 py-3 rounded-lg border text-center text-sm"
                        style={{ borderColor: BORDER_SOFT, backgroundColor: FILL_SOFT, color: TEXT_SUBTLE }}
                      >
                        Tüm personel atanmış.
                      </div>
                    ) : (
                      eligibleForCell(editor.dayIndex, editor.shift).map((emp) => {
                        const meta = RANK_META[emp.rank]
                        return (
                          <div
                            key={emp.id}
                            className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border"
                            style={{ borderColor: BORDER_SOFT, backgroundColor: BG_DEEP }}
                          >
                            <div className="flex items-center gap-3">
                              <InitialCircle label={initials(emp.name)} bg={meta.circleBg} fg={meta.circleFg} />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{emp.name}</span>
                                <span className="text-xs opacity-75">{meta.label}</span>
                                {emp.rule && (
                                  <span className="text-xs" style={{ color: ACCENT }}>
                                    {SHIFT_RULES[emp.rule]}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => addToShift(editor.dayIndex, editor.shift, emp.id)}
                              style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}
                            >
                              <UserPlus className="h-3 w-3 mr-1" />
                              Ekle
                            </Button>
                          </div>
                        )
                      })
                    )}
                  </div>
                </section>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditor(null)}
                  style={{ borderColor: BORDER_SOFT, color: TEXT }}
                >
                  Kapat
                </Button>
                <Button onClick={() => setEditor(null)} style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}>
                  Değişiklikleri Kaydet
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Special Situation Editor Modal */}
        {specialSituationEditor && (
          <Dialog
            open={specialSituationEditor.open}
            onOpenChange={(o) => setSpecialSituationEditor(o ? specialSituationEditor : null)}
          >
            <DialogContent
              className="sm:max-w-md"
              style={{ backgroundColor: BG_CARD, color: TEXT, borderColor: BORDER_SOFT }}
            >
              <DialogHeader>
                <DialogTitle>Özel Durum - {specialSituationEditor.employeeName}</DialogTitle>
                <DialogDescription style={{ color: TEXT_SUBTLE }}>
                  {`${DAY_LABELS_TR[specialSituationEditor.dayIndex]} ${SHIFT_META[specialSituationEditor.shift].label} için özel durum belirleyin.`}
                </DialogDescription>
              </DialogHeader>

              <SpecialSituationForm
                situation={specialSituationEditor.situation}
                defaultShiftTime={SHIFT_META[specialSituationEditor.shift].time}
                onSave={(situation) =>
                  handleSpecialSituationSave(
                    specialSituationEditor.dayIndex,
                    specialSituationEditor.shift,
                    specialSituationEditor.employeeId,
                    situation,
                  )
                }
                onRemove={() => {
                  removeSpecialSituation(
                    specialSituationEditor.dayIndex,
                    specialSituationEditor.shift,
                    specialSituationEditor.employeeId,
                  )
                  setSpecialSituationEditor(null)
                }}
                onCancel={() => setSpecialSituationEditor(null)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppShell>
  )
}

// Components

function ShiftRow(props: {
  shift: ShiftKey
  days: Date[]
  getPeople: (dayIndex: number, shift: ShiftKey) => Employee[]
  onOpen?: (dayIndex: number, shift: ShiftKey) => void
  hasSpecialSituation: (dayIndex: number, shift: ShiftKey, empId: string) => boolean
  getSpecialSituation: (dayIndex: number, shift: ShiftKey, empId: string) => SpecialSituation | null
  canEdit: boolean
}) {
  const { shift, days, getPeople, onOpen, hasSpecialSituation, getSpecialSituation, canEdit } = props
  const meta = SHIFT_META[shift]

  return (
    <>
      {/* Shift label column */}
      <div className="col-span-1 flex flex-col justify-center pr-2 text-sm font-semibold">
        <div style={{ color: TEXT }}>{meta.label}</div>
        <div className="text-xs opacity-75" style={{ color: TEXT_SUBTLE }}>
          {meta.time}
        </div>
      </div>

      {/* Day columns */}
      {days.map((d, i) => {
        const people = getPeople(i, shift)
        const hasAnySpecialSituation = people.some((emp) => hasSpecialSituation(i, shift, emp.id))

        return (
          <div key={`${i}-${shift}`} className="col-span-1">
            <button
              onClick={() => canEdit && onOpen?.(i, shift)}
              className={`group relative w-full min-h-[84px] rounded-lg border p-2 text-left transition-all ${
                canEdit ? "hover:scale-[1.01] focus:outline-none cursor-pointer" : "cursor-default"
              }`}
              style={{
                borderColor: meta.bg,
                backgroundColor: meta.bg,
                color: meta.fg,
              }}
              disabled={!canEdit}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                {people.length === 0 ? (
                  <span className="text-xs opacity-80">
                    {canEdit ? "Personel atamak için tıklayın" : "Boş vardiya"}
                  </span>
                ) : (
                  people.map((emp) => {
                    const r = RANK_META[emp.rank]
                    const hasSpecial = hasSpecialSituation(i, shift, emp.id)
                    return (
                      <div key={emp.id} className="relative">
                        <InitialCircle label={initials(emp.name)} bg={r.circleBg} fg={r.circleFg} />
                        {hasSpecial && (
                          <AlertTriangle className="absolute -top-1 -right-1 h-3 w-3" style={{ color: WARNING }} />
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Special situation indicator */}
              {hasAnySpecialSituation && (
                <div className="absolute top-1 right-1">
                  <AlertTriangle className="h-4 w-4" style={{ color: WARNING }} />
                </div>
              )}

              {/* Hover outline for editable mode */}
              {canEdit && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.06)" }}
                />
              )}

              {/* Tooltip on hover */}
              {people.length > 0 && (
                <div
                  className="pointer-events-none absolute -top-2 left-2 z-10 w-max max-w-[220px] translate-y-[-100%] rounded-md border px-2 py-1 text-xs opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ backgroundColor: BG_CARD, color: TEXT, borderColor: BORDER_SOFT }}
                  aria-hidden="true"
                >
                  <div className="space-y-0.5">
                    {people.map((emp) => {
                      const rm = RANK_META[emp.rank]
                      const specialSit = getSpecialSituation(i, shift, emp.id)
                      return (
                        <div key={emp.id} className="flex items-center gap-1.5">
                          <span className="font-medium">{emp.name}</span>
                          <span className="opacity-70">{`(${rm.label})`}</span>
                          {specialSit && <span style={{ color: WARNING }}>⚠️</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </button>
          </div>
        )
      })}
    </>
  )
}

function InitialCircle({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <span
      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ring-1"
      style={{ backgroundColor: bg, color: fg, boxShadow: "0 0 0 1px rgba(0,0,0,0.06) inset" }}
      aria-hidden="true"
    >
      {label}
    </span>
  )
}

function StarRow({ filled }: { filled: 1 | 2 | 3 }) {
  return (
    <div className="inline-flex items-center">
      {[1, 2, 3].map((n) => (
        <Star
          key={n}
          className="h-4 w-4"
          style={{ color: n <= filled ? ACCENT : "rgba(248, 245, 244, 0.35)" }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function SpecialSituationForm({
  situation,
  defaultShiftTime,
  onSave,
  onRemove,
  onCancel,
}: {
  situation: SpecialSituation
  defaultShiftTime: string
  onSave: (situation: SpecialSituation) => void
  onRemove: () => void
  onCancel: () => void
}) {
  const [startTime, setStartTime] = useState(situation.startTime || defaultShiftTime.split(" - ")[0])
  const [endTime, setEndTime] = useState(situation.endTime || defaultShiftTime.split(" - ")[1])
  const [note, setNote] = useState(situation.note || "")

  const handleSave = () => {
    onSave({
      startTime: startTime !== defaultShiftTime.split(" - ")[0] ? startTime : undefined,
      endTime: endTime !== defaultShiftTime.split(" - ")[1] ? endTime : undefined,
      note: note.trim() || undefined,
    })
  }

  const hasChanges =
    startTime !== defaultShiftTime.split(" - ")[0] || endTime !== defaultShiftTime.split(" - ")[1] || note.trim()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Başlangıç Saati</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">Bitiş Saati</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Not (İsteğe bağlı)</Label>
        <Textarea
          id="note"
          placeholder="Örn: Sınavı var, Doktor randevusu, vb."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ backgroundColor: FILL_SOFT, borderColor: BORDER_SOFT, color: TEXT }}
          rows={2}
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={onRemove}
          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white bg-transparent"
        >
          Özel Durumu Kaldır
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} style={{ borderColor: BORDER_SOFT, color: TEXT }}>
            İptal
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges} style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}>
            Kaydet
          </Button>
        </div>
      </div>
    </div>
  )
}
