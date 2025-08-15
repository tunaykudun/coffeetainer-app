"use client"

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from "@/components/ui"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Send, Search, Users, MessageSquare, Clock, CheckCircle2, Coffee, Calendar, Settings } from "lucide-react"
import { ACCENT, BG_CARD, BG_DEEP, BORDER_SOFT, TEXT, TEXT_SUBTLE, FILL_SOFT } from "@/lib/palette"

// Types
type MessageType = "text" | "system" | "announcement"
type MessageStatus = "sent" | "delivered" | "read"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: MessageType
  status: MessageStatus
  isNew?: boolean
}

interface ChatRoom {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  userGroups: string[]
  color: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  isOnline: boolean
  lastSeen?: Date
}

// Static data - memoized to prevent re-renders
const CHAT_ROOMS: ChatRoom[] = [
  {
    id: "personel-sohbeti",
    name: "Personel Sohbeti",
    description: "Genel ekip iletişimi",
    icon: <MessageSquare className="h-4 w-4" />,
    userGroups: ["Tüm Personel"],
    color: ACCENT,
  },
  {
    id: "yonetim-odasi",
    name: "Yönetim Odası",
    description: "Yönetici ve kıdemli personel",
    icon: <Settings className="h-4 w-4" />,
    userGroups: ["Yönetici", "Kıdemli Barista", "Operasyon Şefi"],
    color: "#F59E0B",
  },
  {
    id: "vardiya-koordinasyonu",
    name: "Vardiya Koordinasyonu",
    description: "Shift değişimleri ve duyurular",
    icon: <Calendar className="h-4 w-4" />,
    userGroups: ["Tüm Personel"],
    color: "#10B981",
  },
  {
    id: "kahve-uzmanlari",
    name: "Kahve Uzmanları",
    description: "Barista teknikleri ve ipuçları",
    icon: <Coffee className="h-4 w-4" />,
    userGroups: ["Kıdemli Barista", "Deneyimli Barista"],
    color: "#8B5CF6",
  },
]

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tunay",
    name: "Tunay Kudun",
    role: "Yönetici",
    avatar: "/placeholder.svg?height=32&width=32",
    isOnline: true,
  },
  {
    id: "umut",
    name: "Umut Alıtkan",
    role: "Kıdemli Barista",
    avatar: "/placeholder.svg?height=32&width=32",
    isOnline: true,
  },
  {
    id: "zeynep",
    name: "Zeynep Soysal",
    role: "Deneyimli Barista",
    avatar: "/placeholder.svg?height=32&width=32",
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: "nur",
    name: "Nur Özkan",
    role: "Deneyimli Barista",
    avatar: "/placeholder.svg?height=32&width=32",
    isOnline: true,
  },
  {
    id: "ekin",
    name: "Ekin Yağanak",
    role: "Yeni Barista",
    avatar: "/placeholder.svg?height=32&width=32",
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "tugra",
    name: "Tuğra Güneysi",
    role: "Yeni Barista",
    avatar: "/placeholder.svg?height=32&width=32",
    isOnline: true,
  },
  {
    id: "eren",
    name: "Eren Şen",
    role: "Yeni Barista",
    avatar: "/placeholder.svg?height=32&width=32",
    isOnline: false,
    lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: "ezel",
    name: "Ezel Beycioğlu",
    role: "Yeni Barista",
    avatar: "/placeholder.svg?height=32&width=32",
    isOnline: true,
  },
  {
    id: "gizem",
    name: "Gizem Yıldız",
    role: "Yeni Barista",
    avatar: "/placeholder.svg?height=32&width=32",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
]

// Initial messages for demo
const INITIAL_MESSAGES: Record<string, Message[]> = {
  "personel-sohbeti": [
    {
      id: "1",
      senderId: "tunay",
      senderName: "Tunay Kudun",
      content: "Günaydın ekip! Bugün yoğun bir gün olacak, hazır olalım 💪",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "text",
      status: "read",
    },
    {
      id: "2",
      senderId: "umut",
      senderName: "Umut Alıtkan",
      content: "Sabah vardiyası hazır! Yeni kahve çekirdekleri geldi, tadına bakalım ☕",
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      type: "text",
      status: "read",
    },
    {
      id: "3",
      senderId: "system",
      senderName: "Sistem",
      content:
        "📢 Haftalık Shift Planı Güncellendi! Yönetici, (11-17 Kasım) haftası için yeni bir plan yayınladı. Lütfen kendi vardiyalarınızı kontrol ediniz.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: "system",
      status: "delivered",
    },
  ],
  "yonetim-odasi": [
    {
      id: "4",
      senderId: "tunay",
      senderName: "Tunay Kudun",
      content: "Bu hafta satış hedeflerimizi gözden geçirelim. Özellikle öğleden sonra saatleri kritik.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      type: "text",
      status: "read",
    },
  ],
  "vardiya-koordinasyonu": [
    {
      id: "5",
      senderId: "system",
      senderName: "Sistem",
      content: "⏰ Vardiya Hatırlatması: Akşam vardiyası 16:00'da başlayacak. Atanan personel: Umut, Eren, Ezel",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      type: "announcement",
      status: "delivered",
    },
  ],
  "kahve-uzmanlari": [
    {
      id: "6",
      senderId: "umut",
      senderName: "Umut Alıtkan",
      content: "Yeni Ethiopia çekirdekleri için önerilen demleme süresi 4 dakika. Çok güzel aroması var! 🌟",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      type: "text",
      status: "read",
    },
  ],
}

// Isolated input components to prevent re-renders
const MemberSearch = React.memo(({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
    },
    [onChange],
  )

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
      <Input
        placeholder="Ekip üyesi ara..."
        value={value}
        onChange={handleChange}
        className="pl-9"
        style={{ backgroundColor: BG_DEEP, borderColor: BORDER_SOFT, color: TEXT }}
      />
    </div>
  )
})

const MessageInput = React.memo(
  ({
    value,
    onChange,
    onSend,
    onKeyPress,
  }: {
    value: string
    onChange: (value: string) => void
    onSend: () => void
    onKeyPress: (e: React.KeyboardEvent) => void
  }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
      },
      [onChange],
    )

    return (
      <div className="flex gap-2">
        <Input
          placeholder="Mesajınızı yazın..."
          value={value}
          onChange={handleChange}
          onKeyPress={onKeyPress}
          className="flex-1"
          style={{ backgroundColor: BG_DEEP, borderColor: BORDER_SOFT, color: TEXT }}
        />
        <Button onClick={onSend} disabled={!value.trim()} style={{ backgroundColor: ACCENT, color: "#2d1d1e" }}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    )
  },
)

export default function EkipSohbetiPage() {
  const { currentUser } = useAuth()

  // State management
  const [selectedRoom, setSelectedRoom] = useState(CHAT_ROOMS[0])
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES)
  const [newMessage, setNewMessage] = useState("")
  const [memberSearch, setMemberSearch] = useState("")

  // Refs for scroll management
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const selectedRoomRef = useRef(selectedRoom.id)

  // Update room ref when selection changes
  useEffect(() => {
    selectedRoomRef.current = selectedRoom.id
  }, [selectedRoom.id])

  // Memoized static data
  const staticChatRooms = useMemo(() => CHAT_ROOMS, [])
  const staticTeamMembers = useMemo(() => TEAM_MEMBERS, [])

  // Memoized filtered members
  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) return staticTeamMembers
    return staticTeamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        member.role.toLowerCase().includes(memberSearch.toLowerCase()),
    )
  }, [memberSearch, staticTeamMembers])

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Scroll when messages change for current room
  useEffect(() => {
    const currentMessages = messages[selectedRoom.id] || []
    if (currentMessages.length > 0) {
      scrollToBottom()
    }
  }, [messages, selectedRoom.id, scrollToBottom])

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setNewMessage(value)
  }, [])

  // Handle send message
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !currentUser) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: "text",
      status: "sent",
    }

    setMessages((prev) => ({
      ...prev,
      [selectedRoom.id]: [...(prev[selectedRoom.id] || []), message],
    }))

    setNewMessage("")
  }, [newMessage, currentUser, selectedRoom.id])

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

  // Real-time message simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate receiving messages in different rooms
      const rooms = Object.keys(INITIAL_MESSAGES)
      const randomRoom = rooms[Math.floor(Math.random() * rooms.length)]
      const randomMember = staticTeamMembers[Math.floor(Math.random() * staticTeamMembers.length)]

      if (Math.random() > 0.7) {
        // 30% chance every 10 seconds
        const simulatedMessage: Message = {
          id: Date.now().toString() + Math.random(),
          senderId: randomMember.id,
          senderName: randomMember.name,
          content: `Simulated message from ${randomMember.name}`,
          timestamp: new Date(),
          type: "text",
          status: "delivered",
          isNew: selectedRoomRef.current !== randomRoom,
        }

        setMessages((prev) => ({
          ...prev,
          [randomRoom]: [...(prev[randomRoom] || []), simulatedMessage],
        }))
      }
    }, 10000)

    return () => clearInterval(interval)
  }, []) // Empty dependency array - runs once

  // Mark new messages as read when room is selected
  useEffect(() => {
    setMessages((prev) => ({
      ...prev,
      [selectedRoom.id]: (prev[selectedRoom.id] || []).map((msg) => ({
        ...msg,
        isNew: false,
      })),
    }))
  }, [selectedRoom.id])

  // Check if user has access to room
  const hasRoomAccess = useCallback(
    (room: ChatRoom) => {
      if (!currentUser) return false
      if (room.userGroups.includes("Tüm Personel")) return true
      return room.userGroups.some((group) => currentUser.role.includes(group))
    },
    [currentUser],
  )

  // Get unread count for room
  const getUnreadCount = useCallback(
    (roomId: string) => {
      const roomMessages = messages[roomId] || []
      return roomMessages.filter((msg) => msg.isNew && msg.senderId !== currentUser?.id).length
    },
    [messages, currentUser?.id],
  )

  // Format timestamp
  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [])

  // Get message status icon
  const getStatusIcon = useCallback((status: MessageStatus) => {
    switch (status) {
      case "sent":
        return <Clock className="h-3 w-3 opacity-50" />
      case "delivered":
        return <CheckCircle2 className="h-3 w-3 opacity-50" />
      case "read":
        return <CheckCircle2 className="h-3 w-3" style={{ color: ACCENT }} />
      default:
        return null
    }
  }, [])

  const currentMessages = messages[selectedRoom.id] || []

  return (
    <AppShell>
      <div className="grid h-[calc(100vh-120px)] grid-cols-1 gap-4 lg:grid-cols-[300px_1fr_280px]">
        {/* Chat Rooms Sidebar */}
        <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Sohbet Odaları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {staticChatRooms.map((room) => {
              if (!hasRoomAccess(room)) return null

              const unreadCount = getUnreadCount(room.id)
              const isSelected = selectedRoom.id === room.id

              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full rounded-lg border p-3 text-left transition-all hover:scale-[1.02] ${
                    isSelected ? "ring-2" : ""
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${room.color}20` : FILL_SOFT,
                    borderColor: isSelected ? room.color : BORDER_SOFT,
                    ...(isSelected && { ringColor: room.color }),
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div style={{ color: room.color }}>{room.icon}</div>
                      <div>
                        <div className="font-medium text-sm">{room.name}</div>
                        <div className="text-xs opacity-75">{room.description}</div>
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <Badge
                        className="h-5 w-5 rounded-full p-0 text-xs"
                        style={{ backgroundColor: room.color, color: "#000" }}
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div style={{ color: selectedRoom.color }}>{selectedRoom.icon}</div>
              <div>
                <CardTitle className="text-lg">{selectedRoom.name}</CardTitle>
                <p className="text-sm opacity-75">{selectedRoom.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(100%-100px)]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {currentMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center" style={{ color: TEXT_SUBTLE }}>
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Henüz mesaj yok</p>
                    <p className="text-sm">İlk mesajı gönderin!</p>
                  </div>
                </div>
              ) : (
                currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.senderId === currentUser?.id ? "justify-end" : "justify-start"}`}
                  >
                    {message.senderId !== currentUser?.id && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={staticTeamMembers.find((m) => m.id === message.senderId)?.avatar || "/placeholder.svg"}
                          alt={message.senderName}
                        />
                        <AvatarFallback>
                          {message.senderName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={`max-w-[70%] ${message.senderId === currentUser?.id ? "text-right" : ""}`}>
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          message.type === "system"
                            ? "border-2 text-center"
                            : message.type === "announcement"
                              ? "border text-center"
                              : ""
                        }`}
                        style={{
                          backgroundColor:
                            message.type === "system"
                              ? `${ACCENT}20`
                              : message.type === "announcement"
                                ? `${selectedRoom.color}15`
                                : message.senderId === currentUser?.id
                                  ? ACCENT
                                  : FILL_SOFT,
                          color: message.senderId === currentUser?.id && message.type === "text" ? "#2d1d1e" : TEXT,
                          borderColor:
                            message.type === "system"
                              ? ACCENT
                              : message.type === "announcement"
                                ? selectedRoom.color
                                : "transparent",
                        }}
                      >
                        {message.type !== "system" && message.senderId !== currentUser?.id && (
                          <div className="text-xs font-medium mb-1 opacity-75">{message.senderName}</div>
                        )}
                        <div className="text-sm">{message.content}</div>
                      </div>

                      <div
                        className={`flex items-center gap-1 mt-1 text-xs opacity-60 ${
                          message.senderId === currentUser?.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span>{formatTime(message.timestamp)}</span>
                        {message.senderId === currentUser?.id && getStatusIcon(message.status)}
                      </div>
                    </div>

                    {message.senderId === currentUser?.id && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                        <AvatarFallback>
                          {currentUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t pt-4" style={{ borderColor: BORDER_SOFT }}>
              <MessageInput
                value={newMessage}
                onChange={handleInputChange}
                onSend={handleSendMessage}
                onKeyPress={handleKeyPress}
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Members Sidebar */}
        <Card style={{ backgroundColor: BG_CARD, borderColor: BORDER_SOFT, color: TEXT }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Ekip Üyeleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <MemberSearch value={memberSearch} onChange={setMemberSearch} />

            {/* Online Members */}
            <div>
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }}></div>
                Çevrimiçi ({filteredMembers.filter((m) => m.isOnline).length})
              </div>
              <div className="space-y-2">
                {filteredMembers
                  .filter((member) => member.isOnline)
                  .map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg"
                      style={{ backgroundColor: FILL_SOFT }}
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2"
                          style={{ backgroundColor: ACCENT, borderColor: BG_CARD }}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{member.name}</div>
                        <div className="text-xs opacity-75 truncate">{member.role}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Offline Members */}
            {filteredMembers.filter((m) => !m.isOnline).length > 0 && (
              <>
                <Separator style={{ backgroundColor: BORDER_SOFT }} />
                <div>
                  <div className="text-sm font-medium mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                    Çevrimdışı ({filteredMembers.filter((m) => !m.isOnline).length})
                  </div>
                  <div className="space-y-2">
                    {filteredMembers
                      .filter((member) => !member.isOnline)
                      .map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-2 rounded-lg opacity-60"
                          style={{ backgroundColor: FILL_SOFT }}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{member.name}</div>
                            <div className="text-xs opacity-75 truncate">{member.role}</div>
                            {member.lastSeen && (
                              <div className="text-xs opacity-50">{formatTime(member.lastSeen)} son görülme</div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
