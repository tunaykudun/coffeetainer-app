"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/contexts/auth-context"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { Coffee, Clock, Play, Square, RotateCcw, CheckCircle } from "lucide-react"
import { BG_CARD, TEXT, ACCENT, BORDER_SOFT, TEXT_SUBTLE, FILL_SOFT } from "@/lib/palette"
import { motion, AnimatePresence } from "framer-motion"

type BreakType = "15min" | "30min"

interface BreakSession {
  type: BreakType
  startTime: Date
  duration: number // in seconds
  remaining: number // in seconds
}

interface BreakRights {
  "15min": { used: number; total: number }
  "30min": { used: number; total: number }
}

// Simulated break rights based on shift length
const getBreakRights = (userRole: string): BreakRights => {
  // In a real app, this would be calculated based on shift length and labor laws
  return {
    "15min": { used: 0, total: 2 },
    "30min": { used: 0, total: 1 },
  }
}

export default function MolaYonetimiPage() {
  const { currentUser } = useAuth()
  const [breakRights, setBreakRights] = useState<BreakRights>(getBreakRights(currentUser?.role || ""))
  const [activeBreak, setActiveBreak] = useState<BreakSession | null>(null)
  const [completedBreaks, setCompletedBreaks] = useState<Array<{ type: BreakType; completedAt: Date }>>([])

  // Timer effect for active break
  useEffect(() => {
    if (!activeBreak) return

    const interval = setInterval(() => {
      setActiveBreak((prev) => {
        if (!prev) return null

        const newRemaining = prev.remaining - 1

        if (newRemaining <= 0) {
          // Break completed
          completeBreak(prev.type, false)
          return null
        }

        return { ...prev, remaining: newRemaining }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [activeBreak])

  const startBreak = (type: BreakType) => {
    const duration = type === "15min" ? 15 * 60 : 30 * 60 // Convert to seconds

    const breakSession: BreakSession = {
      type,
      startTime: new Date(),
      duration,
      remaining: duration,
    }

    setActiveBreak(breakSession)

    // Update break rights
    setBreakRights((prev) => ({
      ...prev,
      [type]: { ...prev[type], used: prev[type].used + 1 },
    }))

    // Send notification to communication center (simulated)
    sendBreakNotification(`☕ ${currentUser?.name}, ${type === "15min" ? "15" : "30"} dakikalık molasına başladı.`)
  }

  const completeBreak = (type: BreakType, isEarly: boolean) => {
    if (activeBreak) {
      setCompletedBreaks((prev) => [...prev, { type, completedAt: new Date() }])
      setActiveBreak(null)

      // Send completion notification
      const message = isEarly
        ? `✅ ${currentUser?.name} molasını erken bitirdi.`
        : `✅ ${currentUser?.name} molasını tamamladı.`
      sendBreakNotification(message)
    }
  }

  const cancelBreak = () => {
    if (activeBreak) {
      // Restore break rights
      setBreakRights((prev) => ({
        ...prev,
        [activeBreak.type]: { ...prev[activeBreak.type], used: prev[activeBreak.type].used - 1 },
      }))

      setActiveBreak(null)
      sendBreakNotification(`❌ ${currentUser?.name} molasını iptal etti.`)
    }
  }

  const sendBreakNotification = (message: string) => {
    // In a real app, this would send to the communication center
    console.log("Break notification:", message)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const canTakeBreak = (type: BreakType) => {
    return breakRights[type].used < breakRights[type].total && !activeBreak
  }

  if (!currentUser) {
    return <AppShell>Loading...</AppShell>
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="p-3 rounded-full"
              style={{
                backgroundColor: "rgba(181,140,130,0.2)",
                color: ACCENT,
              }}
            >
              <Coffee className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: TEXT }}>
              Mola Yönetimi
            </h1>
          </div>
          <p className="text-lg" style={{ color: TEXT_SUBTLE }}>
            Hoş geldin, {currentUser.name}! Mola haklarını yönet ve takip et.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!activeBreak ? (
            <motion.div
              key="break-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Break Rights Display */}
              <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: TEXT }}>
                    <Clock className="h-5 w-5" />
                    Kalan Mola Hakların
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 15 Minute Break */}
                    <div
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: FILL_SOFT,
                        borderColor: BORDER_SOFT,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium" style={{ color: TEXT }}>
                          15 Dakikalık Mola
                        </span>
                        <span
                          className="text-2xl font-bold"
                          style={{
                            color: breakRights["15min"].used < breakRights["15min"].total ? ACCENT : TEXT_SUBTLE,
                          }}
                        >
                          {breakRights["15min"].total - breakRights["15min"].used} / {breakRights["15min"].total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: ACCENT,
                            width: `${((breakRights["15min"].total - breakRights["15min"].used) / breakRights["15min"].total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* 30 Minute Break */}
                    <div
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: FILL_SOFT,
                        borderColor: BORDER_SOFT,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium" style={{ color: TEXT }}>
                          30 Dakikalık Mola
                        </span>
                        <span
                          className="text-2xl font-bold"
                          style={{
                            color: breakRights["30min"].used < breakRights["30min"].total ? ACCENT : TEXT_SUBTLE,
                          }}
                        >
                          {breakRights["30min"].total - breakRights["30min"].used} / {breakRights["30min"].total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: ACCENT,
                            width: `${((breakRights["30min"].total - breakRights["30min"].used) / breakRights["30min"].total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Break Action Buttons */}
              <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                <CardHeader>
                  <CardTitle style={{ color: TEXT }}>Mola Başlat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => startBreak("15min")}
                      disabled={!canTakeBreak("15min")}
                      className="h-16 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                      style={{
                        backgroundColor: canTakeBreak("15min") ? ACCENT : TEXT_SUBTLE,
                        color: canTakeBreak("15min") ? "#2d1d1e" : BG_CARD,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Play className="h-5 w-5" />
                        <div>
                          <div>15 Dakikalık Molaya Başla</div>
                          <div className="text-sm opacity-80">
                            {breakRights["15min"].total - breakRights["15min"].used} hak kaldı
                          </div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => startBreak("30min")}
                      disabled={!canTakeBreak("30min")}
                      className="h-16 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                      style={{
                        backgroundColor: canTakeBreak("30min") ? ACCENT : TEXT_SUBTLE,
                        color: canTakeBreak("30min") ? "#2d1d1e" : BG_CARD,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Play className="h-5 w-5" />
                        <div>
                          <div>30 Dakikalık Molaya Başla</div>
                          <div className="text-sm opacity-80">
                            {breakRights["30min"].total - breakRights["30min"].used} hak kaldı
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="active-break"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Active Break Timer */}
              <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
                <CardContent className="py-12">
                  <div className="text-center space-y-6">
                    <div
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
                      style={{
                        backgroundColor: "rgba(181,140,130,0.2)",
                        color: ACCENT,
                      }}
                    >
                      <Coffee className="h-6 w-6" />
                      <span className="text-lg font-medium">
                        {activeBreak.type === "15min" ? "15 Dakikalık" : "30 Dakikalık"} Mola
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="text-8xl font-bold tabular-nums tracking-tight" style={{ color: TEXT }}>
                        {formatTime(activeBreak.remaining)}
                      </div>
                      <div className="text-xl" style={{ color: TEXT_SUBTLE }}>
                        Kalan Süre
                      </div>
                    </div>

                    {/* Progress Ring */}
                    <div className="flex justify-center">
                      <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="opacity-20"
                            style={{ color: ACCENT }}
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            style={{
                              color: ACCENT,
                              strokeDasharray: `${2 * Math.PI * 56}`,
                              strokeDashoffset: `${2 * Math.PI * 56 * (1 - activeBreak.remaining / activeBreak.duration)}`,
                              transition: "stroke-dashoffset 1s linear",
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Coffee className="h-8 w-8" style={{ color: ACCENT }} />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => completeBreak(activeBreak.type, true)}
                        className="px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                        style={{
                          backgroundColor: "rgba(34, 197, 94, 0.2)",
                          color: "#22c55e",
                          border: "1px solid rgba(34, 197, 94, 0.3)",
                        }}
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Molayı Erken Bitir
                      </Button>

                      <Button
                        onClick={cancelBreak}
                        className="px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                        style={{
                          backgroundColor: "rgba(239, 68, 68, 0.2)",
                          color: "#ef4444",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        <Square className="h-5 w-5 mr-2" />
                        Mola İptal
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Today's Break History */}
        {completedBreaks.length > 0 && (
          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: TEXT }}>
                <RotateCcw className="h-5 w-5" />
                Bugün Tamamlanan Molalar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completedBreaks.map((breakItem, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{
                      backgroundColor: FILL_SOFT,
                      border: `1px solid ${BORDER_SOFT}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Coffee className="h-4 w-4" style={{ color: ACCENT }} />
                      <span style={{ color: TEXT }}>
                        {breakItem.type === "15min" ? "15 Dakikalık" : "30 Dakikalık"} Mola
                      </span>
                    </div>
                    <span className="text-sm" style={{ color: TEXT_SUBTLE }}>
                      {breakItem.completedAt.toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  )
}
