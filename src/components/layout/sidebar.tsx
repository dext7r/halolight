"use client"

import { AnimatePresence,motion } from "framer-motion"
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Mail,
  Settings,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useNavigationStore } from "@/stores/navigation-store"

const menuItems = [
  {
    title: "仪表盘",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "用户管理",
    icon: Users,
    href: "/users",
  },
  {
    title: "数据分析",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    title: "文档管理",
    icon: FileText,
    href: "/documents",
  },
  {
    title: "文件存储",
    icon: FolderOpen,
    href: "/files",
  },
  {
    title: "消息中心",
    icon: Mail,
    href: "/messages",
  },
  {
    title: "日程安排",
    icon: Calendar,
    href: "/calendar",
  },
  {
    title: "系统设置",
    icon: Settings,
    href: "/settings",
  },
]

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const startNavigation = useNavigationStore((state) => state.startNavigation)

  const handleNavigate = React.useCallback(
    (href: string, label: string) => {
      if (pathname === href) return
      startNavigation({ path: href, label, source: "sidebar" })
      router.push(href)
    },
    [pathname, router, startNavigation]
  )

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar",
          "flex flex-col"
        )}
        style={{ pointerEvents: "auto" }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">
                    A
                  </span>
                </div>
                <span className="font-semibold text-sidebar-foreground">
                  Admin Pro
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary mx-auto">
              <span className="text-sm font-bold text-primary-foreground">
                A
              </span>
            </div>
          )}
        </div>

        {/* 导航菜单 */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              const linkContent = (
                <Link
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigate(item.href, item.title)
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70"
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                  </motion.div>
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="truncate"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <div className="relative">{linkContent}</div>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return (
                <div key={item.href} className="relative">
                  {linkContent}
                </div>
              )
            })}
          </nav>
        </ScrollArea>

        {/* 折叠按钮 */}
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCollapsedChange(!collapsed)}
            className="w-full justify-center"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2"
                >
                  收起菜单
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
