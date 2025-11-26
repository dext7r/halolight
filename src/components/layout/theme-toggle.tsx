"use client"

import { motion } from "framer-motion"
import { Monitor,Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = React.useState(false)

  // 等待客户端挂载
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = async (newTheme: string) => {
    const currentTheme = resolvedTheme || theme || "light"
    const isDark = currentTheme === "dark"

    let willBeDark = false
    if (newTheme === "dark") {
      willBeDark = true
    } else if (newTheme === "light") {
      willBeDark = false
    } else if (newTheme === "system") {
      willBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    if (isDark === willBeDark) {
      setTheme(newTheme)
      return
    }

    const supportsViewTransitions =
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      typeof document.startViewTransition === "function"

    if (!supportsViewTransitions) {
      setTheme(newTheme)
      return
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(newTheme)
      return
    }

    const button = triggerRef.current
    if (!button) {
      setTheme(newTheme)
      return
    }

    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const clipPathStart = `circle(0px at ${x}px ${y}px)`
    const clipPathEnd = `circle(${maxRadius}px at ${x}px ${y}px)`

    if (!willBeDark) {
      document.documentElement.classList.add("transitioning-to-light")
    }

    try {
      const transition = document.startViewTransition(() => {
        setTheme(newTheme)
      })

      await transition.ready

      const animation = document.documentElement.animate(
        {
          clipPath: willBeDark
            ? [clipPathStart, clipPathEnd]
            : [clipPathEnd, clipPathStart],
        },
        {
          duration: 400,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: willBeDark
            ? "::view-transition-new(root)"
            : "::view-transition-old(root)",
        }
      )

      await animation.finished
    } catch {
      setTheme(newTheme)
    } finally {
      document.documentElement.classList.remove("transitioning-to-light")
    }
  }

  // 防止 SSR 时的 hydration 问题
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Sun className="h-5 w-5" />
        <span className="sr-only">切换主题</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button ref={triggerRef} variant="ghost" size="icon" className="relative">
          <motion.div
            initial={false}
            animate={{
              scale: resolvedTheme === "dark" ? 0 : 1,
              rotate: resolvedTheme === "dark" ? -90 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Sun className="h-5 w-5" />
          </motion.div>
          <motion.div
            initial={false}
            animate={{
              scale: resolvedTheme === "dark" ? 1 : 0,
              rotate: resolvedTheme === "dark" ? 0 : 90,
            }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Moon className="h-5 w-5" />
          </motion.div>
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <Sun className="mr-2 h-4 w-4" />
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          深色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
