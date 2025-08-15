"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, AlertCircle, Info, CheckCircle } from "lucide-react"
import { TEXT, TEXT_SUBTLE, ACCENT, BG_CARD, BORDER_SOFT, WARNING } from "@/lib/palette"

interface Notification {
  id: string
  type: "info" | "warning" | "success"
  title: string
  message: string
  time: string
  read: boolean
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Stok Uyarısı",
    message: "Espresso çekirdekleri azalıyor (5 kg kaldı)",
    time: "5 dk önce",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Shift Değişimi",
    message: "Akşam vardiyası 18:00'da başlayacak",
    time: "15 dk önce",
    read: false,
  },
  {
    id: "3",
    type: "success",
    title: "Günlük Hedef",
    message: "Bugünkü satış hedefine ulaşıldı!",
    time: "1 saat önce",
    read: true,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-4 w-4" style={{ color: WARNING }} />
      case "success":
        return <CheckCircle className="h-4 w-4" style={{ color: ACCENT }} />
      default:
        return <Info className="h-4 w-4" style={{ color: "#4D79FF" }} />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" style={{ color: TEXT }}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs flex items-center justify-center font-medium"
              style={{ backgroundColor: ACCENT, color: "#000" }}
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="end"
        style={{
          backgroundColor: BG_CARD,
          borderColor: BORDER_SOFT,
          color: TEXT,
        }}
      >
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <span style={{ color: TEXT }}>Bildirimler</span>
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: ACCENT, color: "#000" }}>
                {unreadCount} yeni
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator style={{ backgroundColor: BORDER_SOFT }} />

        {notifications.length === 0 ? (
          <div className="p-4 text-center" style={{ color: TEXT_SUBTLE }}>
            Henüz bildirim yok
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="cursor-pointer p-4 focus:bg-opacity-10"
              onClick={() => markAsRead(notification.id)}
              style={{
                backgroundColor: notification.read ? "transparent" : `${ACCENT}10`,
              }}
            >
              <div className="flex gap-3 w-full">
                <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate" style={{ color: TEXT }}>
                      {notification.title}
                    </p>
                    <span className="text-xs flex-shrink-0 ml-2" style={{ color: TEXT_SUBTLE }}>
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: TEXT_SUBTLE }}>
                    {notification.message}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}

        <DropdownMenuSeparator style={{ backgroundColor: BORDER_SOFT }} />
        <DropdownMenuItem className="cursor-pointer text-center justify-center" style={{ color: ACCENT }}>
          Tümünü görüntüle
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
