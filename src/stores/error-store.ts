import { create } from "zustand"

export type ErrorSource = "error" | "promise" | "manual"

export interface ErrorLog {
  id: string
  message: string
  detail?: string
  timestamp: number
  source: ErrorSource
  read?: boolean
}

interface ErrorStore {
  errors: ErrorLog[]
  addError: (log: Omit<ErrorLog, "id" | "timestamp" | "read">) => void
  markAllRead: () => void
  clear: () => void
  unreadCount: () => number
}

export const useErrorStore = create<ErrorStore>((set, get) => ({
  errors: [],
  addError: (log) =>
    set((state) => ({
      errors: [
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
          timestamp: Date.now(),
          read: false,
          ...log,
        },
        ...state.errors,
      ].slice(0, 50), // keep last 50
    })),
  markAllRead: () =>
    set((state) => ({
      errors: state.errors.map((e) => ({ ...e, read: true })),
    })),
  clear: () => set({ errors: [] }),
  unreadCount: () => get().errors.filter((e) => !e.read).length,
}))
