"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button, Card, CardContent } from "@/components/ui"
import { BackgroundPattern } from "@/components/background-pattern"
import { Trash2, ArrowLeft } from "lucide-react"
import { BG_CARD, TEXT, ACCENT, BORDER_SOFT, TEXT_SUBTLE, FILL_SOFT } from "@/lib/palette"
import Image from "next/image"

export default function PinPage() {
  const [pin, setPin] = useState("")
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, users } = useAuth()
  const router = useRouter()

  // Filter users to show only Kıdemli Barista and above
  const authorizedUsers = users.filter((user) => user.role === "Kıdemli Barista" || user.role === "Yönetici/Kıdemli")

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num)
      setError("")
    }
  }

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1))
    setError("")
  }

  const handleClear = () => {
    setPin("")
    setError("")
  }

  const handleSubmit = async () => {
    if (!selectedUser) {
      setError("Lütfen bir kullanıcı seçin")
      return
    }

    if (pin.length !== 4) {
      setError("4 haneli PIN kodu girin")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const user = authorizedUsers.find((u) => u.id === selectedUser)
      if (!user) {
        setError("Kullanıcı bulunamadı")
        return
      }

      const success = await login(user.username, pin)
      if (success) {
        router.push("/")
      } else {
        setError("Hatalı PIN kodu")
        setPin("")
      }
    } catch (err) {
      setError("Giriş yapılırken bir hata oluştu")
      setPin("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumberClick(e.key)
      } else if (e.key === "Backspace") {
        handleDelete()
      } else if (e.key === "Enter") {
        handleSubmit()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [pin, selectedUser])

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#2d1d1e" }}>
      <BackgroundPattern />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          className="rounded-full backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(181,140,130,0.1)",
            color: TEXT,
            border: `1px solid ${BORDER_SOFT}`,
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card
          className="w-full max-w-md shadow-2xl backdrop-blur-sm border-2"
          style={{
            backgroundColor: `${BG_CARD}f0`,
            borderColor: BORDER_SOFT,
            color: TEXT,
          }}
        >
          <CardContent className="p-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Image
                  src="/images/company-logo.png"
                  alt="Company Logo"
                  width={80}
                  height={80}
                  className="rounded-2xl shadow-lg"
                />
                <div className="absolute -inset-1 rounded-2xl opacity-20 blur-sm" style={{ backgroundColor: ACCENT }} />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2" style={{ color: TEXT }}>
                Yönetici Girişi
              </h1>
              <p className="text-sm" style={{ color: TEXT_SUBTLE }}>
                Kıdemli Barista ve üstü yetkiler için PIN girin
              </p>
            </div>

            {/* User Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3" style={{ color: TEXT }}>
                Kullanıcı Seçin
              </label>
              <div className="grid gap-2">
                {authorizedUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200"
                    style={{
                      backgroundColor: selectedUser === user.id ? "rgba(181,140,130,0.2)" : FILL_SOFT,
                      borderColor: selectedUser === user.id ? ACCENT : BORDER_SOFT,
                      color: TEXT,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                      style={{
                        backgroundColor: selectedUser === user.id ? ACCENT : TEXT_SUBTLE,
                        color: selectedUser === user.id ? "#2d1d1e" : BG_CARD,
                      }}
                    >
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs" style={{ color: TEXT_SUBTLE }}>
                        {user.role}
                      </div>
                    </div>
                    {selectedUser === user.id && (
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* PIN Display */}
            <div className="flex justify-center mb-6">
              <div className="flex gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-300"
                    style={{
                      backgroundColor: pin[index] ? "rgba(181,140,130,0.1)" : "transparent",
                      borderColor: pin[index] ? ACCENT : BORDER_SOFT,
                      color: pin[index] ? ACCENT : TEXT_SUBTLE,
                      transform: pin[index] ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {pin[index] ? "●" : ""}
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center mb-4">
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-200">{error}</p>
              </div>
            )}

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  onClick={() => handleNumberClick(num.toString())}
                  disabled={isLoading}
                  className="h-14 text-xl font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: FILL_SOFT,
                    color: TEXT,
                    border: `1px solid ${BORDER_SOFT}`,
                  }}
                >
                  {num}
                </Button>
              ))}

              <Button
                onClick={handleClear}
                disabled={isLoading || pin.length === 0}
                className="h-14 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                C
              </Button>

              <Button
                onClick={() => handleNumberClick("0")}
                disabled={isLoading}
                className="h-14 text-xl font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: FILL_SOFT,
                  color: TEXT,
                  border: `1px solid ${BORDER_SOFT}`,
                }}
              >
                0
              </Button>

              <Button
                onClick={handleDelete}
                disabled={isLoading || pin.length === 0}
                className="h-14 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || pin.length !== 4 || !selectedUser}
              className="w-full h-12 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: pin.length === 4 && selectedUser ? ACCENT : TEXT_SUBTLE,
                color: pin.length === 4 && selectedUser ? "#2d1d1e" : BG_CARD,
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Giriş Yapılıyor...
                </div>
              ) : (
                "Giriş Yap"
              )}
            </Button>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                Güvenli giriş için 4 haneli PIN kodunuzu girin
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
