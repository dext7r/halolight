# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Next.js 14 App Router 的中文后台管理系统 (Admin Pro)，使用 TypeScript、Tailwind CSS 4、shadcn/ui 和 framer-motion 构建。

## 常用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
```

## 架构

### Provider 层级结构 (src/app/layout.tsx)
```
ThemeProvider → MockProvider → QueryProvider → AuthProvider → PermissionProvider → WebSocketProvider
```

### 核心目录结构

- **src/app/** - Next.js App Router 页面
  - `(auth)/` - 认证相关页面 (login, register, forgot-password, reset-password)
  - 其他顶级目录为功能模块页面

- **src/components/**
  - `ui/` - shadcn/ui 基础组件
  - `layout/` - 布局组件 (AdminLayout, Header, Sidebar, CommandMenu)
  - `dashboard/` - 仪表盘组件 (可配置拖拽式仪表盘)
  - `data-table/` - 数据表格组件

- **src/hooks/** - React Query hooks，每个资源一个文件
  - use-users, use-files, use-calendar, use-messages, use-documents, use-notifications, use-dashboard

- **src/lib/api/**
  - `services.ts` - API 服务层，包含所有接口定义和类型导出
  - `client.ts` - 认证相关 API

- **src/stores/** - Zustand 状态管理
  - `auth-store.ts` - 认证状态
  - `dashboard-store.ts` - 仪表盘布局状态

- **src/mock/** - Mock.js 数据生成器，通过 `NEXT_PUBLIC_MOCK=true` 环境变量启用

- **src/providers/** - Context providers

### 数据流模式

1. **API 请求**: `src/lib/api/services.ts` 定义服务 → `src/hooks/` 封装 React Query hooks → 页面组件使用
2. **Mock 数据**: 设置 `NEXT_PUBLIC_MOCK=true` 后，MockProvider 会拦截 fetch 请求返回模拟数据
3. **状态管理**: Zustand stores 用于认证和仪表盘布局等全局状态

### 代码规范

- ESLint 配置自动移除未使用的 imports (`unused-imports/no-unused-imports`)
- Import 语句自动排序 (`simple-import-sort`)
- 使用 `@/*` 路径别名指向 `./src/*`
- 注意避免与全局类型冲突，如使用 `Document as DocumentType` 导入

### UI 组件

- 基于 Radix UI 原语构建的 shadcn/ui 组件
- framer-motion 用于动画效果
- lucide-react 图标库
- recharts 用于图表
- react-grid-layout 用于可配置仪表盘

## 环境变量

- `NEXT_PUBLIC_MOCK=true` - 启用 Mock.js 数据拦截
- `NEXT_PUBLIC_API_URL` - API 基础 URL (默认 `/api`)
