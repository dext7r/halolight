import Cookies from "js-cookie"
import { create } from "zustand"
import { createJSONStorage,persist } from "zustand/middleware"

import { authApi, LoginRequest, RegisterRequest,User } from "@/lib/api/client"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null

  // Actions
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.login(data)

          // 保存 token 到 cookie
          Cookies.set("token", response.token, {
            expires: data.remember ? 7 : 1,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          })

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "登录失败",
            isLoading: false,
          })
          throw error
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.register(data)

          Cookies.set("token", response.token, {
            expires: 1,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          })

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "注册失败",
            isLoading: false,
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authApi.logout()
        } finally {
          Cookies.remove("token")
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null })
        try {
          await authApi.forgotPassword(email)
          set({ isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "发送失败",
            isLoading: false,
          })
          throw error
        }
      },

      resetPassword: async (token: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          await authApi.resetPassword(token, password)
          set({ isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "重置失败",
            isLoading: false,
          })
          throw error
        }
      },

      checkAuth: async () => {
        const token = Cookies.get("token")
        const persistedState = get()

        // 如果没有 token，清除所有认证状态
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null })
          return
        }

        // 如果已有用户信息且 token 匹配，直接设置状态
        if (persistedState.user && persistedState.token === token && persistedState.isAuthenticated) {
          set({ isLoading: false })
          return
        }

        // 否则验证 token 并获取用户信息
        set({ isLoading: true })
        try {
          const user = await authApi.getCurrentUser()
          if (user) {
            set({ user, token, isAuthenticated: true, isLoading: false })
          } else {
            Cookies.remove("token")
            set({ isAuthenticated: false, user: null, token: null, isLoading: false })
          }
        } catch {
          Cookies.remove("token")
          set({ isAuthenticated: false, user: null, token: null, isLoading: false })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
