"use client"

import { useQueryClient } from "@tanstack/react-query"
import * as React from "react"

import { notificationKeys } from "@/hooks/use-notifications"
import type { Notification } from "@/lib/api/types"

// WebSocket 连接状态
type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error"

interface WebSocketContextType {
  status: ConnectionStatus
  lastMessage: Notification | null
  sendMessage: (message: unknown) => void
  reconnect: () => void
}

const WebSocketContext = React.createContext<WebSocketContextType | null>(null)

// Mock WebSocket 实现（模拟实时通知）
class MockWebSocket {
  private callbacks: {
    onOpen?: () => void
    onMessage?: (data: Notification) => void
    onClose?: () => void
    onError?: (error: Error) => void
  } = {}
  private interval: NodeJS.Timeout | null = null
  private isConnected = false

  connect() {
    // 模拟连接延迟
    setTimeout(() => {
      this.isConnected = true
      this.callbacks.onOpen?.()
      this.startMockMessages()
    }, 1000)
  }

  private startMockMessages() {
    // 随机发送模拟通知
    this.interval = setInterval(() => {
      if (!this.isConnected) return

      // 20% 概率发送新通知
      if (Math.random() < 0.2) {
        const mockNotifications: Notification[] = [
          {
            id: `ws-${Date.now()}`,
            type: "user",
            title: "新用户注册",
            content: `用户 ${["张三", "李四", "王五", "赵六"][Math.floor(Math.random() * 4)]} 刚刚完成注册`,
            read: false,
            createdAt: new Date().toISOString(),
            link: "/users",
          },
          {
            id: `ws-${Date.now()}`,
            type: "system",
            title: "系统通知",
            content: "数据备份已完成",
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: `ws-${Date.now()}`,
            type: "task",
            title: "任务更新",
            content: "您有一个新任务待处理",
            read: false,
            createdAt: new Date().toISOString(),
            link: "/tasks",
          },
          {
            id: `ws-${Date.now()}`,
            type: "alert",
            title: "安全提醒",
            content: "检测到异常登录尝试",
            read: false,
            createdAt: new Date().toISOString(),
          },
        ]

        const randomNotification =
          mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
        this.callbacks.onMessage?.(randomNotification)
      }
    }, 10000) // 每10秒检查一次
  }

  onOpen(callback: () => void) {
    this.callbacks.onOpen = callback
  }

  onMessage(callback: (data: Notification) => void) {
    this.callbacks.onMessage = callback
  }

  onClose(callback: () => void) {
    this.callbacks.onClose = callback
  }

  onError(callback: (error: Error) => void) {
    this.callbacks.onError = callback
  }

  send(data: unknown) {
    console.log("WebSocket send:", data)
  }

  close() {
    this.isConnected = false
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.callbacks.onClose?.()
  }
}

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [status, setStatus] = React.useState<ConnectionStatus>("disconnected")
  const [lastMessage, setLastMessage] = React.useState<Notification | null>(null)
  const wsRef = React.useRef<MockWebSocket | null>(null)

  const connect = React.useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
    }

    setStatus("connecting")
    const ws = new MockWebSocket()
    wsRef.current = ws

    ws.onOpen(() => {
      setStatus("connected")
    })

    ws.onMessage((notification) => {
      setLastMessage(notification)
      // 刷新通知列表
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    })

    ws.onClose(() => {
      setStatus("disconnected")
    })

    ws.onError(() => {
      setStatus("error")
    })

    ws.connect()
  }, [queryClient])

  const sendMessage = React.useCallback((message: unknown) => {
    wsRef.current?.send(message)
  }, [])

  const reconnect = React.useCallback(() => {
    connect()
  }, [connect])

  // 自动连接
  React.useEffect(() => {
    connect()

    return () => {
      wsRef.current?.close()
    }
  }, [connect])

  return (
    <WebSocketContext.Provider
      value={{ status, lastMessage, sendMessage, reconnect }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = React.useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider")
  }
  return context
}

// 实时通知 Hook
export function useRealtimeNotifications(
  onNotification?: (notification: Notification) => void
) {
  const { lastMessage, status } = useWebSocket()

  React.useEffect(() => {
    if (lastMessage && onNotification) {
      onNotification(lastMessage)
    }
  }, [lastMessage, onNotification])

  return { status, lastMessage }
}
