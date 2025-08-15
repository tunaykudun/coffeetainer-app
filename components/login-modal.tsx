"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BackgroundPattern } from "@/components/background-pattern"
import { BG_PRIMARY, BG_CARD, TEXT, TEXT_SUBTLE, ACCENT, BORDER_SOFT, FILL_SOFT } from "@/lib/palette"
import { LogIn, User, Lock } from "lucide-react"

// Mock users for demo
const DEMO_USERS = [
  {
    id: 1,
    name: "Tunay Kudun",
    username: "tunaykudun",
    pin: "1234",
    role: "Yönetici",
    avatar: "/placeholder.svg?height=40&width=40",
    branch: "Merkez Şube",
  },
  {
    id: 2,
    name: "Batıkan Poyraz",
    username: "batikanpoyraz",
    pin: "5678",
    role: "Operasyon Şefi",
    avatar: "/placeholder.svg?height=40&width=40",
    branch: "Merkez Şube",
  },
  {
    id: 3,
    name: "Damla Alıtkan",
    username: "damlaalitkan",
    pin: "9999",
    role: "Muhasebe & Genel Müdür",
    avatar: "/placeholder.svg?height=40&width=40",
    branch: "Merkez Şube",
  },
  {
    id: 4,
    name: "Umut Alıtkan",
    username: "umutalitkan",
    pin: "9876",
    role: "Kıdemli Barista",
    avatar: "/placeholder.svg?height=40&width=40",
    branch: "Merkez Şube",
  },
]

export function LoginModal() {
  const [username, setUsername] = useState("")
  const [pin, setPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with:", { username, pin })

    if (!username.trim() || !pin.trim()) {
      setError("Lütfen kullanıcı adı ve PIN giriniz")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Find user by username and pin
      const user = DEMO_USERS.find((u) => u.username === username && u.pin === pin)

      if (user) {
        console.log("User found, logging in:", user)
        await login(user)
      } else {
        console.log("Invalid credentials")
        setError("Geçersiz kullanıcı adı veya PIN")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Oturum açma sırasında bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (user: (typeof DEMO_USERS)[0]) => {
    console.log("Demo login for:", user)
    setIsLoading(true)
    setError("")

    try {
      await login(user)
    } catch (err) {
      console.error("Demo login error:", err)
      setError("Oturum açma sırasında bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundColor: BG_PRIMARY }}>
      <BackgroundPattern />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 mb-4 relative">
            <Image
              src="/images/company-logo.png"
              alt="Coffeetainer Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: TEXT }}>
            Coffeetainer POS
          </h1>
          <p className="text-sm" style={{ color: TEXT_SUBTLE }}>
            Kahve Dükkanı Yönetim Sistemi
          </p>
        </div>

        {/* Login Form */}
        <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2" style={{ color: TEXT }}>
              <LogIn className="w-5 h-5" />
              Oturum Aç
            </CardTitle>
            <CardDescription style={{ color: TEXT_SUBTLE }}>
              Kullanıcı adınız ve PIN kodunuzla oturum açın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" style={{ color: TEXT }}>
                  <User className="w-4 h-4 inline mr-2" />
                  Kullanıcı Adı
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Kullanıcı adınızı giriniz"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  style={{
                    backgroundColor: FILL_SOFT,
                    borderColor: BORDER_SOFT,
                    color: TEXT,
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin" style={{ color: TEXT }}>
                  <Lock className="w-4 h-4 inline mr-2" />
                  PIN Kodu
                </Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="PIN kodunuzu giriniz"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  disabled={isLoading}
                  maxLength={4}
                  style={{
                    backgroundColor: FILL_SOFT,
                    borderColor: BORDER_SOFT,
                    color: TEXT,
                  }}
                />
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded border border-red-800">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                style={{
                  backgroundColor: ACCENT,
                  color: "#2d1d1e",
                }}
              >
                {isLoading ? "Oturum açılıyor..." : "Oturum Aç"}
              </Button>
            </form>

            <Separator style={{ backgroundColor: BORDER_SOFT }} />

            {/* Demo Accounts */}
            <div className="space-y-3">
              <p className="text-xs text-center" style={{ color: TEXT_SUBTLE }}>
                Demo hesapları ile hızlı giriş:
              </p>
              <div className="grid gap-2">
                {DEMO_USERS.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    className="w-full justify-start h-auto p-3 bg-transparent"
                    onClick={() => handleDemoLogin(user)}
                    disabled={isLoading}
                    style={{
                      borderColor: BORDER_SOFT,
                      backgroundColor: "transparent",
                      color: TEXT,
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs" style={{ color: TEXT_SUBTLE }}>
                          {user.role} • PIN: {user.pin}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
            © 2024 Coffeetainer. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  )
}
