"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { BG_CARD, BORDER_SOFT, TEXT, TEXT_SUBTLE, ACCENT, BG_PRIMARY } from "@/lib/palette"
import { Send, Users, MessageCircle, Clock, CheckCircle2 } from "lucide-react"

interface Message {
  id: number
  sender: string
  senderAvatar: string
  content: string
  timestamp: string
  isNew?: boolean
}

interface Room {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  memberCount: number
  lastActivity: string
  unreadCount: number
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    sender: "Ekin Yağanak",
    senderAvatar: "/placeholder.svg?height=32&width=32&text=EY",
    content: "Sabah vardiyası için hazırlıklar tamamlandı. Espresso makinesi kalibre edildi.",
    timestamp: "09:15",
  },
  {
    id: 2,
    sender: "Batıkan Poyraz",
    senderAvatar: "/placeholder.svg?height=32&width=32&text=BP",
    content: "Süt stoğu azalmış, yeni sipariş vermemiz gerekiyor.",
    timestamp: "09:32",
  },
  {
    id: 3,
    sender: "Tunay Kudun",
    senderAvatar: "/placeholder.svg?height=32&width=32&text=TK",
    content: "Süt siparişi verildi. Yarın sabah gelecek. Teşekkürler bilgi için.",
    timestamp: "09:45",
  },
]

const ROOMS: Room[] = [
  {
    id: "genel",
    name: "Genel Sohbet",
    description: "Tüm ekip üyeleri",
    icon: <Users className="h-4 w-4" />,
    memberCount: 12,
    lastActivity: "2 dk önce",
    unreadCount: 3,
  },
  {
    id: "shift",
    name: "Vardiya Koordinasyonu",
    description: "Shift planlaması ve değişiklikleri",
    icon: <Clock className="h-4 w-4" />,
    memberCount: 8,
    lastActivity: "15 dk önce",
    unreadCount: 0,
  },
  {
    id: "yonetim",
    name: "Yönetim",
    description: "Sadece yöneticiler",
    icon: <CheckCircle2 className="h-4 w-4" />,
    memberCount: 3,
    lastActivity: "1 saat önce",
    unreadCount: 1,
  },
]

export default function IletisimMerkeziPage() {
  const { currentUser } = useAuth()
  const [selectedRoom, setSelectedRoom] = useState<Room>(ROOMS[0])
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isAtBottomRef = useRef(true)

  // Memoize the scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (isAtBottomRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  // Handle input change - isolated from other effects
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }, [])

  // Handle send message - stable reference
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !currentUser) return

    const message: Message = {
      id: Date.now(),
      sender: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isNew: true,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    isAtBottomRef.current = true
  }, [newMessage, currentUser])

  // Handle key press
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage],
  )

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Remove isNew flag after animation
  useEffect(() => {
    const newMessages = messages.filter((msg) => msg.isNew)
    if (newMessages.length > 0) {
      const timer = setTimeout(() => {
        setMessages((prev) => prev.map((msg) => ({ ...msg, isNew: false })))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [messages.length]) // Only depend on length, not the entire array

  // Simulate real-time messages (only depends on selectedRoom.id)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance
        const sampleMessages = [
          "Yeni müşteri siparişi alındı ☕",
          "Temizlik tamamlandı ✨",
          "Kasa sayımı yapıldı 💰",
          "Yeni ürün stoğu geldi 📦",
        ]

        const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)]
        const randomSender = ["Sistem", "Otomatik Bildirim"][Math.floor(Math.random() * 2)]

        const message: Message = {
          id: Date.now() + Math.random(),
          sender: randomSender,
          senderAvatar: "/placeholder.svg?height=32&width=32&text=SYS",
          content: randomMessage,
          timestamp: new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isNew: true,
        }

        setMessages((prev) => [...prev, message])
      }
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [selectedRoom.id]) // Only depend on room ID

  // Memoize room list to prevent unnecessary re-renders
  const roomList = useMemo(() => ROOMS, [])

  return (
    <AppShell>
      <div className="h-[calc(100vh-2rem)] flex gap-6">
        {/* Rooms Sidebar */}
        <div className="w-80 space-y-4">
          <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: TEXT }}>
                <MessageCircle className="h-5 w-5" />
                Sohbet Odaları
              </CardTitle>
              <CardDescription style={{ color: TEXT_SUBTLE }}>Ekip iletişimi ve koordinasyon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {roomList.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedRoom.id === room.id ? "ring-2" : ""
                  }`}
                  style={{
                    backgroundColor: selectedRoom.id === room.id ? `${ACCENT}20` : BG_PRIMARY,
                    borderColor: selectedRoom.id === room.id ? ACCENT : "transparent",
                    ringColor: selectedRoom.id === room.id ? ACCENT : "transparent",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div style={{ color: selectedRoom.id === room.id ? ACCENT : TEXT_SUBTLE }}>{room.icon}</div>
                      <div>
                        <h4 className="font-medium" style={{ color: TEXT }}>
                          {room.name}
                        </h4>
                        <p className="text-xs" style={{ color: TEXT_SUBTLE }}>
                          {room.memberCount} üye • {room.lastActivity}
                        </p>
                      </div>
                    </div>
                    {room.unreadCount > 0 && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: ACCENT, color: BG_PRIMARY }}
                      >
                        {room.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col" style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT }}>
            {/* Chat Header */}
            <CardHeader style={{ borderBottom: `1px solid ${BORDER_SOFT}` }}>
              <div className="flex items-center gap-3">
                <div style={{ color: ACCENT }}>{selectedRoom.icon}</div>
                <div>
                  <CardTitle style={{ color: TEXT }}>{selectedRoom.name}</CardTitle>
                  <CardDescription style={{ color: TEXT_SUBTLE }}>
                    {selectedRoom.description} • {selectedRoom.memberCount} üye aktif
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 transition-all duration-500 ${
                    message.isNew ? "animate-in slide-in-from-bottom-2" : ""
                  }`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
                    <AvatarFallback style={{ backgroundColor: ACCENT, color: BG_PRIMARY }}>
                      {message.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm" style={{ color: TEXT }}>
                        {message.sender}
                      </span>
                      <span className="text-xs" style={{ color: TEXT_SUBTLE }}>
                        {message.timestamp}
                      </span>
                    </div>
                    <div
                      className="text-sm p-3 rounded-lg max-w-md"
                      style={{
                        backgroundColor: message.sender === currentUser?.name ? `${ACCENT}20` : BG_PRIMARY,
                        color: TEXT,
                      }}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="p-4" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1"
                  style={{
                    backgroundColor: BG_PRIMARY,
                    borderColor: BORDER_SOFT,
                    color: TEXT,
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  style={{
                    backgroundColor: ACCENT,
                    color: BG_PRIMARY,
                    border: "none",
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
