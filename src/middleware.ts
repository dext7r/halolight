import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// 公开路由 - 无需认证
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]

// 认证路由 - 已登录用户不能访问
const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  // 检查是否是公开路由
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // 检查是否是认证路由
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // 如果用户已登录且尝试访问认证页面，重定向到首页
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // 如果用户未登录且尝试访问受保护页面，重定向到登录页
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api 路由
     * - _next 静态文件
     * - _next 图片优化
     * - favicon.ico
     * - 静态文件 (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
}
