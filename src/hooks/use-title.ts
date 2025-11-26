"use client"

import * as React from "react"

interface UseTitleOptions {
  suffix?: string
  defaultTitle?: string
  resetOnUnmount?: boolean
}

export function useTitle(title: string | undefined, options: UseTitleOptions = {}) {
  const { suffix = "Admin Pro", defaultTitle, resetOnUnmount = false } = options
  const previousTitleRef = React.useRef<string | undefined>(undefined)

  React.useEffect(() => {
    if (typeof document === "undefined") return

    if (previousTitleRef.current === undefined) {
      previousTitleRef.current = document.title
    }

    const nextTitle = title ? `${title} - ${suffix}` : defaultTitle || previousTitleRef.current || suffix
    if (document.title !== nextTitle) {
      document.title = nextTitle
    }

    return () => {
      if (resetOnUnmount && previousTitleRef.current !== undefined) {
        document.title = previousTitleRef.current
      }
    }
  }, [title, suffix, defaultTitle, resetOnUnmount])
}
