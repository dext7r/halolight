"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Bell, HelpCircle, LogOut, Menu, Search, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuthStore } from "@/stores/auth-store"
import { useErrorStore } from "@/stores/error-store"
import { useNavigationStore } from "@/stores/navigation-store"

import { ThemeToggle } from "./theme-toggle"

interface HeaderProps {
  onMenuClick: () => void
  onSearchClick: () => void
  footerVisible: boolean
  onFooterToggle: (visible: boolean) => void
}

export function Header({ onMenuClick, onSearchClick, footerVisible, onFooterToggle }: HeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const startNavigation = useNavigationStore((state) => state.startNavigation)
  const errors = useErrorStore((state) => state.errors)
  const unreadErrors = useErrorStore((state) => state.unreadCount())
  const markErrorsRead = useErrorStore((state) => state.markAllRead)
  const clearErrors = useErrorStore((state) => state.clear)

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleNavigate = (href: string, label: string) => {
    startNavigation({ path: href, label, source: "header" })
    router.push(href)
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* 搜索栏 */}
        <Button
          variant="outline"
          className="hidden w-64 justify-start text-muted-foreground sm:flex"
          onClick={onSearchClick}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>搜索...</span>
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* 搜索按钮（移动端） */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={onSearchClick}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* 通知 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>通知</span>
              <Link
                href="/notifications"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigate("/notifications", "通知中心")
                }}
                className="text-xs font-normal text-primary hover:underline"
              >
                查看全部
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/notifications", "通知中心")
              }}
            >
              <Link href="/notifications" className="flex flex-col items-start gap-1 cursor-pointer">
                <p className="font-medium">新用户注册</p>
                <p className="text-xs text-muted-foreground">
                  用户 张三 刚刚完成注册
                </p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/notifications", "通知中心")
              }}
            >
              <Link href="/notifications" className="flex flex-col items-start gap-1 cursor-pointer">
                <p className="font-medium">系统更新</p>
                <p className="text-xs text-muted-foreground">
                  系统将于今晚 23:00 进行维护
                </p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/notifications", "通知中心")
              }}
            >
              <Link href="/notifications" className="flex flex-col items-start gap-1 cursor-pointer">
                <p className="font-medium">任务完成</p>
                <p className="text-xs text-muted-foreground">
                  数据备份任务已完成
                </p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/notifications", "通知中心")
              }}
            >
              <Link
                href="/notifications"
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground cursor-pointer justify-center"
              >
                查看所有通知
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 错误收集 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <AlertTriangle className="h-5 w-5" />
              {unreadErrors > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 px-1.5 rounded-full p-0 text-[10px]">
                  {unreadErrors > 99 ? "99+" : unreadErrors}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>错误收集</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  markErrorsRead()
                  clearErrors()
                }}
              >
                清空
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-72 overflow-auto">
              {errors.length === 0 && (
                <div className="py-3 text-sm text-muted-foreground text-center">
                  暂无错误
                </div>
              )}
              {errors.map((err) => (
                <DropdownMenuItem key={err.id} className="flex items-start gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      {new Date(err.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-sm font-medium text-foreground leading-snug">
                      {err.message}
                    </span>
                    {err.detail && (
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {err.detail}
                      </span>
                    )}
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {err.source}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                markErrorsRead()
              }}
              className="text-primary cursor-pointer"
            >
              标记已读
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 rounded-lg border border-transparent px-2 py-1 transition hover:border-border/70">
              <span className="hidden text-xs text-muted-foreground xl:inline">显示页脚</span>
              <Switch
                checked={footerVisible}
                onCheckedChange={onFooterToggle}
                aria-label="切换页脚显示"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end" className="bg-background text-foreground shadow-lg">
            {footerVisible ? "隐藏页脚" : "显示页脚"}
          </TooltipContent>
        </Tooltip>

        {/* 主题切换 */}
        <ThemeToggle />

        {/* 用户菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatar.png" alt="用户头像" />
                <AvatarFallback>
                  {user?.name?.charAt(0) || "AD"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "管理员"}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/profile", "个人资料")
              }}
            >
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                个人资料
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/settings", "账户设置")
              }}
            >
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                账户设置
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/docs", "帮助文档")
              }}
            >
              <Link href="/docs" className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                帮助文档
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
