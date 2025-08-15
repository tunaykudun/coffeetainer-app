"use client"

import type React from "react"
import { useState } from "react"
import { SideNavigation } from "./side-navigation"
import { NotificationCenter } from "./notification-center"
import { UserMenu } from "./user-menu"
import { BackgroundPattern } from "./background-pattern"
import { PageTransition } from "./page-transition"
import { BG_CARD, BORDER_SOFT, TEXT, ACCENT } from "@/lib/palette"
import { Bell, Menu, X } from "lucide-react"
import Image from "next/image"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1a1f2e" }}>
      <BackgroundPattern />

      {/* Fixed Sidebar */}
      <SideNavigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <header
          className="sticky top-0 z-20 h-16 border-b backdrop-blur-sm"
          style={{
            backgroundColor: `${BG_CARD}95`,
            borderColor: BORDER_SOFT,
          }}
        >
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors"
                style={{ color: TEXT }}
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo */}
              <div className="flex items-center gap-3">
                <Image
                  src="/images/company-logo.png"
                  alt="Coffeetainer"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="font-bold text-lg" style={{ color: TEXT }}>
                  Coffeetainer
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 rounded-lg transition-colors hover:bg-opacity-10"
                style={{ color: TEXT }}
              >
                <Bell className="w-5 h-5" />
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-xs flex items-center justify-center"
                  style={{ backgroundColor: ACCENT, color: "#000" }}
                >
                  3
                </span>
              </button>

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Page Content with Transitions */}
        <main className="p-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationCenter isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </div>
  )
}
