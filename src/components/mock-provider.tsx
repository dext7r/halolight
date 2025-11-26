"use client"

import { useEffect, useState } from "react"

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 仅在开发环境且开启 mock 时加载
      if (process.env.NEXT_PUBLIC_MOCK === "true") {
        // 先加载 mock 数据定义
        import("@/mock").then(() => {
          // 再设置 fetch 拦截
          import("@/lib/mock-fetch").then(({ setupMockFetch }) => {
            setupMockFetch()
            console.log("[Mock] Mock.js 已启用，fetch 拦截已设置")
            setReady(true)
          })
        })
      } else {
        setReady(true)
      }
    }
  }, [])

  // 等待 mock 加载完成
  if (!ready && process.env.NEXT_PUBLIC_MOCK === "true") {
    return null
  }

  return <>{children}</>
}
