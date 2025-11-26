"use client"

import * as React from "react"

import { useErrorStore } from "@/stores/error-store"

interface ErrorProviderProps {
  children: React.ReactNode
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const addError = useErrorStore((state) => state.addError)

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      addError({
        message: event.message || "未知错误",
        detail: event.error?.stack || event.error?.toString(),
        source: "error",
      })
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      addError({
        message: reason?.message || String(reason) || "Unhandled Promise rejection",
        detail: reason?.stack || undefined,
        source: "promise",
      })
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [addError])

  return <>{children}</>
}
