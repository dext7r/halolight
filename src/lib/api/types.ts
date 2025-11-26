// API 响应类型
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  code: number
  data: {
    list: T[]
    total: number
    page: number
    pageSize: number
  }
  message: string
}

// 用户相关类型
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  role: Role
  status: "active" | "inactive" | "suspended"
  createdAt: string
  lastLoginAt?: string
}

// 角色和权限
export type Permission =
  | "dashboard:view"
  | "users:view"
  | "users:create"
  | "users:edit"
  | "users:delete"
  | "analytics:view"
  | "analytics:export"
  | "settings:view"
  | "settings:edit"
  | "documents:view"
  | "documents:create"
  | "documents:edit"
  | "documents:delete"
  | "files:view"
  | "files:upload"
  | "files:delete"
  | "messages:view"
  | "messages:send"
  | "calendar:view"
  | "calendar:edit"
  | "notifications:view"
  | "notifications:manage"

export interface Role {
  id: string
  name: string
  label: string
  permissions: Permission[]
  description?: string
}

// 通知类型
export interface Notification {
  id: string
  type: "system" | "user" | "task" | "alert"
  title: string
  content: string
  read: boolean
  createdAt: string
  link?: string
}

// 仪表盘统计
export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  conversionRate: number
  recentOrders: number
  pendingTasks: number
}

export interface ChartData {
  date: string
  value: number
  category?: string
}

// 文档类型
export interface Document {
  id: string
  title: string
  content?: string
  type: "document" | "spreadsheet" | "presentation"
  size: number
  createdAt: string
  updatedAt: string
  createdBy: string
  shared: boolean
}

// 消息类型
export interface Message {
  id: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  createdAt: string
  read: boolean
}

// 日历事件
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: string
  end: string
  allDay?: boolean
  color?: string
}
