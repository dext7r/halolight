import { useQuery } from "@tanstack/react-query"

import { dashboardService } from "@/lib/api/services"

// 查询键
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  visits: () => [...dashboardKeys.all, "visits"] as const,
  sales: () => [...dashboardKeys.all, "sales"] as const,
  products: () => [...dashboardKeys.all, "products"] as const,
  orders: () => [...dashboardKeys.all, "orders"] as const,
  activities: () => [...dashboardKeys.all, "activities"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
}

// 获取仪表盘统计
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardService.getStats(),
    refetchInterval: 60000, // 1分钟刷新
  })
}

// 获取访问趋势
export function useVisitTrends() {
  return useQuery({
    queryKey: dashboardKeys.visits(),
    queryFn: () => dashboardService.getVisits(),
  })
}

// 获取销售趋势
export function useSalesTrends() {
  return useQuery({
    queryKey: dashboardKeys.sales(),
    queryFn: () => dashboardService.getSales(),
  })
}

// 获取热门产品
export function useTopProducts() {
  return useQuery({
    queryKey: dashboardKeys.products(),
    queryFn: () => dashboardService.getProducts(),
  })
}

// 获取最近订单
export function useRecentOrders() {
  return useQuery({
    queryKey: dashboardKeys.orders(),
    queryFn: () => dashboardService.getOrders(),
  })
}

// 获取用户活动
export function useUserActivities() {
  return useQuery({
    queryKey: dashboardKeys.activities(),
    queryFn: () => dashboardService.getActivities(),
  })
}

// 获取系统概览
export function useSystemOverview() {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: () => dashboardService.getOverview(),
    refetchInterval: 30000, // 30秒刷新
  })
}
