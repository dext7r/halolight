"use client"

import { usePathname } from "next/navigation"
import * as React from "react"
import { create } from "zustand"

// 页面状态缓存
interface PageState {
  scrollY: number
  formData?: Record<string, unknown>
  customState?: Record<string, unknown>
  timestamp: number
}

interface PageCacheStore {
  cache: Map<string, PageState>
  setPageState: (path: string, state: Partial<PageState>) => void
  getPageState: (path: string) => PageState | undefined
  clearPageState: (path: string) => void
  clearAllCache: () => void
}

export const usePageCacheStore = create<PageCacheStore>((set, get) => ({
  cache: new Map(),

  setPageState: (path, state) => {
    const cache = new Map(get().cache)
    const existing = cache.get(path) || { scrollY: 0, timestamp: Date.now() }
    cache.set(path, { ...existing, ...state, timestamp: Date.now() })
    set({ cache })
  },

  getPageState: (path) => get().cache.get(path),

  clearPageState: (path) => {
    const cache = new Map(get().cache)
    cache.delete(path)
    set({ cache })
  },

  clearAllCache: () => set({ cache: new Map() }),
}))

// Hook: 自动保存和恢复滚动位置
export function useScrollRestore() {
  const pathname = usePathname()
  const { setPageState, getPageState } = usePageCacheStore()
  const isRestoringRef = React.useRef(false)

  // 保存滚动位置
  React.useEffect(() => {
    const handleScroll = () => {
      if (!isRestoringRef.current) {
        setPageState(pathname, { scrollY: window.scrollY })
      }
    }

    // 使用节流
    let timeoutId: NodeJS.Timeout
    const throttledScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 100)
    }

    window.addEventListener("scroll", throttledScroll)

    return () => {
      window.removeEventListener("scroll", throttledScroll)
      clearTimeout(timeoutId)
    }
  }, [pathname, setPageState])

  // 恢复滚动位置
  React.useEffect(() => {
    const pageState = getPageState(pathname)
    if (pageState && pageState.scrollY > 0) {
      isRestoringRef.current = true
      // 等待页面渲染完成
      requestAnimationFrame(() => {
        window.scrollTo(0, pageState.scrollY)
        // 延迟重置标志，避免立即触发保存
        setTimeout(() => {
          isRestoringRef.current = false
        }, 100)
      })
    }
  }, [pathname, getPageState])
}

// Hook: 保存和恢复表单状态
export function useFormCache<T extends Record<string, unknown>>(
  formKey: string,
  initialValues: T
): [T, (values: T) => void, () => void] {
  const pathname = usePathname()
  const cacheKey = `${pathname}:${formKey}`
  const { setPageState, getPageState } = usePageCacheStore()

  // 从缓存获取初始值
  const getCachedValues = React.useCallback((): T => {
    const pageState = getPageState(cacheKey)
    if (pageState?.formData) {
      return pageState.formData as T
    }
    return initialValues
  }, [cacheKey, getPageState, initialValues])

  const [values, setValues] = React.useState<T>(getCachedValues)

  // 保存表单值到缓存
  const saveValues = React.useCallback(
    (newValues: T) => {
      setValues(newValues)
      setPageState(cacheKey, { formData: newValues })
    },
    [cacheKey, setPageState]
  )

  // 清除缓存
  const clearCache = React.useCallback(() => {
    setValues(initialValues)
    usePageCacheStore.getState().clearPageState(cacheKey)
  }, [cacheKey, initialValues])

  return [values, saveValues, clearCache]
}

// Hook: 保存和恢复自定义状态
export function useStateCache<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const pathname = usePathname()
  const cacheKey = `${pathname}:${key}`
  const { setPageState, getPageState } = usePageCacheStore()

  // 从缓存获取初始值
  const getCachedValue = React.useCallback((): T => {
    const pageState = getPageState(cacheKey)
    if (pageState?.customState?.[key] !== undefined) {
      return pageState.customState[key] as T
    }
    return initialValue
  }, [cacheKey, key, getPageState, initialValue])

  const [value, setValue] = React.useState<T>(getCachedValue)

  // 同步到缓存
  React.useEffect(() => {
    const pageState = getPageState(cacheKey) || { scrollY: 0, timestamp: Date.now() }
    setPageState(cacheKey, {
      customState: { ...pageState.customState, [key]: value },
    })
  }, [value, cacheKey, key, setPageState, getPageState])

  return [value, setValue]
}

// KeepAlive 组件 - 包装页面内容
interface KeepAliveWrapperProps {
  children: React.ReactNode
}

export function KeepAliveWrapper({ children }: KeepAliveWrapperProps) {
  useScrollRestore()
  return <>{children}</>
}
