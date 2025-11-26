import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import Cookies from "js-cookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove("token")
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

// API 响应类型
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 用户相关类型
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginResponse {
  user: User
  token: string
  expiresIn: number
}

// 模拟 API 调用（实际项目中替换为真实 API）
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模拟登录验证
    if (data.email === "admin@example.com" && data.password === "123456") {
      return {
        user: {
          id: "1",
          email: data.email,
          name: "管理员",
          avatar: "",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
        token: "mock_jwt_token_" + Date.now(),
        expiresIn: 86400,
      }
    }
    throw new Error("邮箱或密码错误")
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (data.password !== data.confirmPassword) {
      throw new Error("两次密码输入不一致")
    }

    return {
      user: {
        id: "2",
        email: data.email,
        name: data.name,
        avatar: "",
        role: "user",
        createdAt: new Date().toISOString(),
      },
      token: "mock_jwt_token_" + Date.now(),
      expiresIn: 86400,
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("发送重置密码邮件到:", email)
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("重置密码:", token, password)
  },

  logout: async (): Promise<void> => {
    Cookies.remove("token")
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = Cookies.get("token")
    if (!token) return null

    // 模拟获取当前用户
    return {
      id: "1",
      email: "admin@example.com",
      name: "管理员",
      avatar: "",
      role: "admin",
      createdAt: new Date().toISOString(),
    }
  },
}

export default apiClient
