"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button, Input } from "@/components/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { User, LogOut } from "lucide-react"
import { BG_CARD, BG_DEEP, TEXT, ACCENT, BORDER_SOFT, TEXT_SUBTLE } from "@/lib/palette"

export function AuthPopover() {
  const { currentUser, login, logout, isLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (pin.length !== 4) {
      setError("Lütfen 4 haneli PIN girin")
      return
    }

    setError("")
    const success = await login(pin)
    if (success) {
      setIsOpen(false)
      setPin("")
    } else {
      setError("Hatalı PIN. Lütfen tekrar deneyin.")
    }
  }

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
    setPin("")
    setError("")
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full transition-colors"
          style={{
            color: TEXT,
            backgroundColor: "transparent",
          }}
        >
          {currentUser ? (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={currentUser.avatar || "/placeholder.svg?height=32&width=32&query=avatar"}
                alt={currentUser.name}
              />
              <AvatarFallback style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}>
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4"
        align="end"
        style={{
          backgroundColor: BG_CARD,
          borderColor: BORDER_SOFT,
          color: TEXT,
        }}
      >
        {currentUser ? (
          // Logged in state
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={currentUser.avatar || "/placeholder.svg?height=48&width=48&query=avatar"}
                  alt={currentUser.name}
                />
                <AvatarFallback style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}>
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">Hoş Geldin,</div>
                <div className="text-sm font-medium">{currentUser.name}</div>
                <div className="text-xs" style={{ color: TEXT_SUBTLE }}>
                  {currentUser.role}
                </div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-2 bg-transparent"
              style={{
                borderColor: BORDER_SOFT,
                color: TEXT,
              }}
            >
              <LogOut className="h-4 w-4" />
              Hesaptan Çıkış Yap
            </Button>
          </div>
        ) : (
          // Login state
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Giriş Yap</h3>
              <p className="text-sm" style={{ color: TEXT_SUBTLE }}>
                4 haneli PIN kodunuzu girin
              </p>
            </div>

            <div className="space-y-3">
              {/* PIN Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">4 Haneli PIN</label>
                <Input
                  type="password"
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                    setPin(value)
                    setError("")
                  }}
                  maxLength={4}
                  style={{
                    backgroundColor: BG_DEEP,
                    borderColor: BORDER_SOFT,
                    color: TEXT,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && pin.length === 4) {
                      handleLogin()
                    }
                  }}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>
              )}

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                disabled={pin.length !== 4 || isLoading}
                className="w-full"
                style={{
                  backgroundColor: ACCENT,
                  color: "#2d1d1e",
                }}
              >
                {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
