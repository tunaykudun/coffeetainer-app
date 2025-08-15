"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  name: string
  username: string
  pin: string
  role: string
  avatar: string
  branch: string
}

interface AuthContextType {
  currentUser: User | null
  isLoggingOut: boolean
  login: (user: User) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        console.log("Kaydedilmiş kullanıcı yüklendi:", user)
        setCurrentUser(user)
      } catch (error) {
        console.error("Kullanıcı verisi yüklenirken hata:", error)
        localStorage.removeItem("currentUser")
      }
    }
  }, [])

  const login = async (user: User): Promise<void> => {
    console.log("Login fonksiyonu çağrıldı:", user)

    try {
      // Save to localStorage
      localStorage.setItem("currentUser", JSON.stringify(user))

      // Update state
      setCurrentUser(user)

      console.log("Kullanıcı başarıyla giriş yaptı:", user.name)
    } catch (error) {
      console.error("Login sırasında hata:", error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    console.log("Logout fonksiyonu çağrıldı")

    setIsLoggingOut(true)

    try {
      // Wait for fade-out animation
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Clear localStorage
      localStorage.removeItem("currentUser")

      // Clear state
      setCurrentUser(null)

      // Wait a bit more for smooth transition
      await new Promise((resolve) => setTimeout(resolve, 100))

      console.log("Kullanıcı başarıyla çıkış yaptı")
    } catch (error) {
      console.error("Logout sırasında hata:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const value: AuthContextType = {
    currentUser,
    isLoggingOut,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
