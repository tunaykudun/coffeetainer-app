"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Settings, LogOut, Users } from "lucide-react"
import { TEXT, TEXT_SUBTLE, ACCENT, BG_CARD, BORDER_SOFT } from "@/lib/palette"

export function UserMenu() {
  const { currentUser, users, logout, canEdit } = useAuth()
  const [showUsers, setShowUsers] = useState(false)

  if (!currentUser) return null

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full" style={{ backgroundColor: "transparent" }}>
          <Avatar className="h-10 w-10">
            <AvatarFallback
              className="text-sm font-medium"
              style={{
                backgroundColor: ACCENT,
                color: "#000",
              }}
            >
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        align="end"
        forceMount
        style={{
          backgroundColor: BG_CARD,
          borderColor: BORDER_SOFT,
          color: TEXT,
        }}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none" style={{ color: TEXT }}>
              {currentUser.name}
            </p>
            <p className="text-xs leading-none" style={{ color: getRoleColor(currentUser.role) }}>
              {currentUser.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator style={{ backgroundColor: BORDER_SOFT }} />

        <DropdownMenuItem className="cursor-pointer" style={{ color: TEXT }} onClick={() => setShowUsers(!showUsers)}>
          <Users className="mr-2 h-4 w-4" />
          <span>Aktif Kullanıcılar</span>
        </DropdownMenuItem>

        {showUsers && (
          <div className="px-2 py-1">
            {users &&
              users
                .filter((user) => user.id !== currentUser.id)
                .map((user) => (
                  <div key={user.id} className="flex items-center gap-2 px-2 py-1 text-xs">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{
                        backgroundColor: getRoleColor(user.role),
                        color: user.role === "Yönetici/Kıdemli" ? "#000" : "#fff",
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p style={{ color: TEXT }}>{user.name}</p>
                      <p style={{ color: TEXT_SUBTLE }}>{user.role}</p>
                    </div>
                  </div>
                ))}
          </div>
        )}

        <DropdownMenuSeparator style={{ backgroundColor: BORDER_SOFT }} />

        <DropdownMenuItem className="cursor-pointer" style={{ color: TEXT }}>
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>

        {canEdit && (
          <DropdownMenuItem className="cursor-pointer" style={{ color: TEXT }}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Ayarlar</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator style={{ backgroundColor: BORDER_SOFT }} />

        <DropdownMenuItem className="cursor-pointer" style={{ color: "#ff6b6b" }} onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Çıkış Yap</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
