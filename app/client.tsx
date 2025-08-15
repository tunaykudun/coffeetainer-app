"use client"

import type React from "react"

import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { LoginModal } from "@/components/login-modal"
import { BG_PRIMARY } from "@/lib/palette"

function ClientLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoggingOut } = useAuth()

  // Show login modal if no user is logged in and not in the process of logging out
  if (!currentUser && !isLoggingOut) {
    return <LoginModal />
  }

  // Show fade-out effect during logout
  if (isLoggingOut) {
    return (
      <div className="min-h-screen transition-opacity duration-300 opacity-0" style={{ backgroundColor: BG_PRIMARY }}>
        {children}
      </div>
    )
  }

  // Show main app with fade-in effect
  return (
    <div className="min-h-screen transition-opacity duration-300 opacity-100" style={{ backgroundColor: BG_PRIMARY }}>
      {children}
    </div>
  )
}

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ClientLayout>{children}</ClientLayout>
    </AuthProvider>
  )
}
