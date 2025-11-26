"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import * as React from "react"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useTitle } from "@/hooks"
import { KeepAliveWrapper } from "@/hooks/use-keep-alive"
import { useNavigationStore } from "@/stores/navigation-store"

import { CommandMenu } from "./command-menu"
import { Footer } from "./footer"
import { Header } from "./header"
import { PendingOverlay } from "./pending-overlay"
import { Sidebar } from "./sidebar"
import { TabBar } from "./tab-bar"

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed"
const FOOTER_VISIBLE_KEY = "footer-visible"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    // 初始化时从 localStorage 读取
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      return saved === "true"
    }
    return false
  })
  const [footerVisible, setFooterVisible] = React.useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [isDesktop, setIsDesktop] = React.useState(true)
  const { pendingPath, label, finishNavigation } = useNavigationStore()
  const pathname = usePathname()
  const titleMap: Record<string, string> = {
    "/": "仪表盘",
    "/users": "用户管理",
    "/analytics": "数据分析",
    "/documents": "文档管理",
    "/files": "文件存储",
    "/messages": "消息中心",
    "/calendar": "日程安排",
    "/notifications": "通知中心",
    "/settings": "系统设置",
    "/profile": "个人资料",
    "/docs": "帮助文档",
  }
  useTitle(titleMap[pathname] ?? "Admin Pro")

  // 持久化侧边栏状态
  const handleSidebarCollapse = React.useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
  }, [])

  React.useEffect(() => {
    // 客户端挂载后读取存储的状态
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
    if (saved !== null) {
      setSidebarCollapsed(saved === "true")
    }

    const savedFooter = localStorage.getItem(FOOTER_VISIBLE_KEY)
    if (savedFooter !== null) {
      setFooterVisible(savedFooter !== "false")
    }
  }, [])

  React.useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkIsDesktop()
    window.addEventListener("resize", checkIsDesktop)
    return () => window.removeEventListener("resize", checkIsDesktop)
  }, [])

  React.useEffect(() => {
    localStorage.setItem(FOOTER_VISIBLE_KEY, String(footerVisible))
  }, [footerVisible])

  React.useEffect(() => {
    if (pendingPath && pathname === pendingPath) {
      finishNavigation()
    }
  }, [pathname, pendingPath, finishNavigation])

  const marginLeft = isDesktop ? (sidebarCollapsed ? 64 : 240) : 0

  return (
    <div className="bg-background min-h-screen lg:h-dvh overflow-hidden flex flex-col">
      {/* 桌面端侧边栏 */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={handleSidebarCollapse}
        />
      </div>

      {/* 移动端侧边栏 */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar collapsed={false} onCollapsedChange={() => {}} />
        </SheetContent>
      </Sheet>

      {/* 主内容区 */}
      <motion.div
        initial={false}
        animate={{ marginLeft }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="relative grid h-full min-h-0 grid-rows-[auto_auto_1fr_auto] overflow-hidden"
      >
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
          onSearchClick={() => setCommandOpen(true)}
          footerVisible={footerVisible}
          onFooterToggle={setFooterVisible}
        />

        {/* 多标签栏 */}
        <TabBar />

        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 min-h-0 overflow-y-auto"
          >
            <KeepAliveWrapper>
              {children}
            </KeepAliveWrapper>
          </motion.main>
        </AnimatePresence>
        {footerVisible && <Footer />}
      </motion.div>

      {/* 命令面板 */}
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />

      <PendingOverlay visible={!!pendingPath} label={label} />
    </div>
  )
}
