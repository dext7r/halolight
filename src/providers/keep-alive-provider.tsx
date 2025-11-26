"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

import { useTabsStore } from "@/stores/tabs-store"

interface CacheItem {
  key: string
  element: React.ReactElement
  scrollPosition: number
}

interface KeepAliveContextType {
  cachedPages: Map<string, CacheItem>
  activePath: string
}

const KeepAliveContext = React.createContext<KeepAliveContextType | null>(null)

// 最大缓存页面数
const MAX_CACHE_SIZE = 10

export function KeepAliveProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { tabs } = useTabsStore()
  const [cachedPages, setCachedPages] = React.useState<Map<string, CacheItem>>(
    () => new Map()
  )
  const [activePath, setActivePath] = React.useState(pathname)

  // 保存当前页面的滚动位置
  const saveScrollPosition = React.useCallback(() => {
    const currentPath = activePath
    if (cachedPages.has(currentPath)) {
      const cached = cachedPages.get(currentPath)!
      cached.scrollPosition = window.scrollY
      setCachedPages(new Map(cachedPages))
    }
  }, [activePath, cachedPages])

  // 恢复页面的滚动位置
  const restoreScrollPosition = React.useCallback(
    (path: string) => {
      const cached = cachedPages.get(path)
      if (cached) {
        // 使用 requestAnimationFrame 确保 DOM 已更新
        requestAnimationFrame(() => {
          window.scrollTo(0, cached.scrollPosition)
        })
      }
    },
    [cachedPages]
  )

  // 路径变化时更新缓存
  React.useEffect(() => {
    if (pathname === activePath) return

    // 保存离开页面的滚动位置
    saveScrollPosition()

    // 检查是否需要缓存（只缓存在标签中的页面）
    const isInTabs = tabs.some((tab) => tab.path === pathname)

    if (isInTabs) {
      // 恢复目标页面的滚动位置
      restoreScrollPosition(pathname)
    }

    setActivePath(pathname)
  }, [pathname, activePath, tabs, saveScrollPosition, restoreScrollPosition])

  // 清理不在标签中的缓存
  React.useEffect(() => {
    const tabPaths = new Set(tabs.map((tab) => tab.path))
    const newCache = new Map<string, CacheItem>()

    cachedPages.forEach((item, path) => {
      if (tabPaths.has(path)) {
        newCache.set(path, item)
      }
    })

    // 限制缓存大小
    if (newCache.size > MAX_CACHE_SIZE) {
      const entries = Array.from(newCache.entries())
      const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE)
      toRemove.forEach(([path]) => newCache.delete(path))
    }

    if (newCache.size !== cachedPages.size) {
      setCachedPages(newCache)
    }
  }, [tabs, cachedPages])

  return (
    <KeepAliveContext.Provider value={{ cachedPages, activePath }}>
      {children}
    </KeepAliveContext.Provider>
  )
}

// KeepAlive 包装组件
interface KeepAliveProps {
  children: React.ReactNode
  cacheKey?: string
}

export function KeepAlive({ children, cacheKey }: KeepAliveProps) {
  const pathname = usePathname()
  const key = cacheKey || pathname
  const { tabs } = useTabsStore()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const cachedContentRef = React.useRef<Map<string, HTMLDivElement>>(new Map())
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 缓存当前内容
  React.useEffect(() => {
    if (!mounted || !containerRef.current) return

    const container = containerRef.current
    const content = container.firstElementChild as HTMLDivElement

    if (content) {
      // 克隆并缓存当前内容
      cachedContentRef.current.set(key, content.cloneNode(true) as HTMLDivElement)
    }
  }, [key, mounted, children])

  // 清理不在标签中的缓存
  React.useEffect(() => {
    const tabPaths = new Set(tabs.map((tab) => tab.path))
    cachedContentRef.current.forEach((_, cachedKey) => {
      if (!tabPaths.has(cachedKey)) {
        cachedContentRef.current.delete(cachedKey)
      }
    })
  }, [tabs])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <div ref={containerRef} className="keep-alive-container">
      {children}
    </div>
  )
}

// 使用 keep-alive 上下文
export function useKeepAlive() {
  const context = React.useContext(KeepAliveContext)
  if (!context) {
    throw new Error("useKeepAlive must be used within KeepAliveProvider")
  }
  return context
}
