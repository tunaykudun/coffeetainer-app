"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { BG_CARD, BORDER_SOFT, TEXT, TEXT_SUBTLE, ACCENT, DISABLED_TEXT } from "@/lib/palette"
import {
  Home,
  BarChart3,
  Package,
  TrendingUp,
  Coffee,
  DollarSign,
  Settings,
  Trash2,
  Calendar,
  MessageSquare,
  Clock,
  ScrollText,
  Lock,
} from "lucide-react"

interface NavigationItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  requiredRole?: string[]
  disabled?: boolean
}

const navigationItems: NavigationItem[] = [
  {
    href: "/",
    label: "Ana Sayfa",
    icon: Home,
  },
  {
    href: "/satis-akisi",
    label: "Satış Akışı",
    icon: TrendingUp,
  },
  {
    href: "/shift-planlama",
    label: "Shift Planlama",
    icon: Calendar,
  },
  {
    href: "/mola-yonetimi",
    label: "Mola Yönetimi",
    icon: Clock,
  },
  {
    href: "/ekip-sohbeti",
    label: "Ekip Sohbeti",
    icon: MessageSquare,
  },
  {
    href: "/raporlar",
    label: "Raporlar",
    icon: BarChart3,
    requiredRole: ["Yönetici", "Yönetici/Kıdemli"],
    disabled: true, // Finance reports are disabled
  },
  {
    href: "/stok-yonetimi",
    label: "Stok Yönetimi",
    icon: Package,
  },
  {
    href: "/urunler",
    label: "Ürünler",
    icon: Coffee,
  },
  {
    href: "/zayi-yonetimi",
    label: "Zayi Yönetimi",
    icon: Trash2,
  },
  {
    href: "/muhasebe",
    label: "Muhasebe",
    icon: DollarSign,
    requiredRole: ["Yönetici", "Yönetici/Kıdemli"],
    disabled: true, // Accounting is disabled
  },
  {
    href: "/aktivite-log",
    label: "Aktivite Logları",
    icon: ScrollText,
    requiredRole: ["Yönetici"],
  },
  {
    href: "/ayarlar",
    label: "Ayarlar",
    icon: Settings,
    requiredRole: ["Yönetici", "Yönetici/Kıdemli"],
  },
]

interface SideNavigationProps {
  isOpen: boolean
  onClose: () => void
}

export function SideNavigation({ isOpen, onClose }: SideNavigationProps) {
  const pathname = usePathname()
  const { currentUser } = useAuth()

  const hasAccess = (requiredRole?: string[]) => {
    if (!requiredRole || !currentUser) return true

    // Special check for "Yönetici" only access
    if (requiredRole.includes("Yönetici") && requiredRole.length === 1) {
      return currentUser.role === "Yönetici"
    }

    return requiredRole.some((role) => currentUser.role.includes(role))
  }

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out border-r"
      style={{
        width: "256px",
        backgroundColor: BG_CARD,
        borderColor: BORDER_SOFT,
      }}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor: BORDER_SOFT }}>
        <span className="font-semibold" style={{ color: TEXT }}>
          Menü
        </span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          if (!hasAccess(item.requiredRole)) return null

          const isActive = isActiveRoute(item.href)
          const Icon = item.icon
          const isDisabled = item.disabled

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 hover:scale-105 group relative"
              style={{
                backgroundColor: isActive && !isDisabled ? ACCENT : "transparent",
                color: isDisabled ? DISABLED_TEXT : isActive ? "#000" : TEXT,
                opacity: isDisabled ? 0.6 : 1,
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{item.label}</span>
              {isDisabled && <Lock className="w-3 h-3 ml-auto flex-shrink-0" style={{ color: DISABLED_TEXT }} />}
            </Link>
          )
        })}
      </nav>

      {/* User Info at Bottom */}
      {currentUser && (
        <div className="p-4 border-t" style={{ borderColor: BORDER_SOFT }}>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ backgroundColor: ACCENT, color: "#000" }}
            >
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: TEXT }}>
                {currentUser.name}
              </p>
              <p className="text-xs truncate" style={{ color: TEXT_SUBTLE }}>
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
