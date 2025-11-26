"use client"

import { motion } from "framer-motion"
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react"

import {
  RecentActivity,
  RevenueChart,
  SourceChart,
  StatsCard,
  TrafficChart,
} from "@/components/dashboard"
import { AdminLayout } from "@/components/layout"

const stats = [
  {
    title: "总用户数",
    value: "12,345",
    description: "较上月",
    icon: Users,
    trend: { value: 12.5, isPositive: true },
  },
  {
    title: "总收入",
    value: "¥ 89,432",
    description: "较上月",
    icon: DollarSign,
    trend: { value: 8.2, isPositive: true },
  },
  {
    title: "订单数",
    value: "1,234",
    description: "较上月",
    icon: ShoppingCart,
    trend: { value: -2.4, isPositive: false },
  },
  {
    title: "转化率",
    value: "3.24%",
    description: "较上月",
    icon: TrendingUp,
    trend: { value: 4.1, isPositive: true },
  },
]

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
          <p className="text-muted-foreground">
            欢迎回来！这是您的业务数据概览。
          </p>
        </motion.div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} index={index} />
          ))}
        </div>

        {/* 图表区域 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <RevenueChart />
          </div>
          <div className="lg:col-span-3">
            <SourceChart />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TrafficChart />
          <RecentActivity />
        </div>
      </div>
    </AdminLayout>
  )
}
