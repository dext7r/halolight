"use client"

import {
  BarChart3,
  Calendar,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Mail,
  Moon,
  Search,
  Settings,
  Sun,
  Users,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import * as React from "react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { CommandInputClear } from "@/components/ui/command-input-clear"
import { useAuthStore } from "@/stores/auth-store"
import { useNavigationStore } from "@/stores/navigation-store"

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const { logout } = useAuthStore()
  const startNavigation = useNavigationStore((state) => state.startNavigation)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  const runCommand = React.useCallback(
    (command: () => void) => {
      onOpenChange(false)
      command()
    },
    [onOpenChange]
  )

  const navigateTo = React.useCallback(
    (path: string, label: string) => {
      if (pathname === path) {
        onOpenChange(false)
        return
      }
      startNavigation({ path, label, source: "command" })
      onOpenChange(false)
      router.push(path)
    },
    [onOpenChange, pathname, router, startNavigation]
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} showCloseButton={false}>
      <CommandInputClear placeholder="输入命令或搜索..." />
      <CommandList>
          <CommandEmpty>未找到结果</CommandEmpty>
          <CommandGroup heading="导航">
            <CommandItem onSelect={() => navigateTo("/", "仪表盘")}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              仪表盘
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("/users", "用户管理")}>
              <Users className="mr-2 h-4 w-4" />
              用户管理
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("/analytics", "数据分析")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              数据分析
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("/documents", "文档管理")}>
              <FileText className="mr-2 h-4 w-4" />
              文档管理
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("/files", "文件存储")}>
              <FolderOpen className="mr-2 h-4 w-4" />
              文件存储
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("/messages", "消息中心")}>
              <Mail className="mr-2 h-4 w-4" />
              消息中心
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("/calendar", "日程安排")}>
              <Calendar className="mr-2 h-4 w-4" />
              日程安排
            </CommandItem>
            <CommandItem onSelect={() => navigateTo("/settings", "系统设置")}>
              <Settings className="mr-2 h-4 w-4" />
              系统设置
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="主题">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              浅色模式
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              深色模式
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="操作">
            <CommandItem onSelect={() => runCommand(() => console.log("全局搜索"))}>
              <Search className="mr-2 h-4 w-4" />
              全局搜索
              <CommandShortcut>⌘F</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(async () => {
                  await logout()
                  router.push("/login")
                })
              }
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
              <CommandShortcut>⌘Q</CommandShortcut>
            </CommandItem>
          </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
