"use client"

import * as React from "react"

import { mockRoles } from "@/lib/api/mock-data"
import type { Permission, Role } from "@/lib/api/types"
import { useAuthStore } from "@/stores/auth-store"

// 权限上下文
interface PermissionContextType {
  permissions: Permission[]
  role: Role | null
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
}

const PermissionContext = React.createContext<PermissionContextType | null>(null)

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()

  // 获取用户角色，默认为 admin（开发阶段）
  const role = React.useMemo(() => {
    if (user?.role) {
      return typeof user.role === "string"
        ? mockRoles.find((r) => r.id === user.role) || mockRoles[0]
        : user.role
    }
    return mockRoles[0] // 默认 admin
  }, [user])

  const permissions = role?.permissions || []

  const hasPermission = React.useCallback(
    (permission: Permission) => permissions.includes(permission),
    [permissions]
  )

  const hasAnyPermission = React.useCallback(
    (perms: Permission[]) => perms.some((p) => permissions.includes(p)),
    [permissions]
  )

  const hasAllPermissions = React.useCallback(
    (perms: Permission[]) => perms.every((p) => permissions.includes(p)),
    [permissions]
  )

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        role,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

// Hook: 使用权限
export function usePermission() {
  const context = React.useContext(PermissionContext)
  if (!context) {
    throw new Error("usePermission must be used within PermissionProvider")
  }
  return context
}

// 权限守卫组件
interface PermissionGuardProps {
  permission?: Permission
  permissions?: Permission[]
  mode?: "any" | "all"
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({
  permission,
  permissions,
  mode = "any",
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()

  const hasAccess = React.useMemo(() => {
    if (permission) {
      return hasPermission(permission)
    }
    if (permissions) {
      return mode === "all"
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions)
    }
    return true
  }, [permission, permissions, mode, hasPermission, hasAnyPermission, hasAllPermissions])

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// HOC: 高阶组件包装权限检查
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: Permission,
  Fallback?: React.ComponentType
) {
  return function PermissionWrappedComponent(props: P) {
    return (
      <PermissionGuard
        permission={permission}
        fallback={Fallback ? <Fallback /> : null}
      >
        <Component {...props} />
      </PermissionGuard>
    )
  }
}
