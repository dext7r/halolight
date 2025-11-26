"use client"

import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import {
  BarChart,
  BarChart3,
  Bell,
  Calendar,
  CheckSquare,
  GripVertical,
  LineChart,
  PieChart,
  Plus,
  RotateCcw,
  Save,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react"
import * as React from "react"
import GridLayout, { Layout } from "react-grid-layout"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  type DashboardLayout,
  type DashboardWidget,
  useDashboardStore,
  widgetTemplates,
  type WidgetType,
} from "@/stores/dashboard-store"

// 图标映射
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3,
  LineChart,
  BarChart,
  PieChart,
  Users,
  Bell,
  CheckSquare,
  Calendar,
  Zap,
}

// 统计数据小部件
function StatsWidget() {
  const stats = [
    { label: "总用户", value: "12,453", change: "+12%", up: true },
    { label: "活跃用户", value: "8,234", change: "+8%", up: true },
    { label: "总收入", value: "¥543,210", change: "+23%", up: true },
    { label: "转化率", value: "12.5%", change: "-2%", up: false },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col justify-center">
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className="text-2xl font-bold">{stat.value}</p>
          <div className={cn("flex items-center text-sm", stat.up ? "text-green-500" : "text-red-500")}>
            {stat.up ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  )
}

// 折线图小部件
function LineChartWidget() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <LineChart className="h-16 w-16 mx-auto mb-2 opacity-50" />
        <p>访问趋势图表</p>
        <p className="text-xs">（集成 recharts 后显示）</p>
      </div>
    </div>
  )
}

// 柱状图小部件
function BarChartWidget() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <BarChart className="h-16 w-16 mx-auto mb-2 opacity-50" />
        <p>销售统计图表</p>
        <p className="text-xs">（集成 recharts 后显示）</p>
      </div>
    </div>
  )
}

// 饼图小部件
function PieChartWidget() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <PieChart className="h-16 w-16 mx-auto mb-2 opacity-50" />
        <p>占比分析图表</p>
        <p className="text-xs">（集成 recharts 后显示）</p>
      </div>
    </div>
  )
}

// 最近用户小部件
function RecentUsersWidget() {
  const users = [
    { name: "张三", email: "zhangsan@example.com", time: "刚刚" },
    { name: "李四", email: "lisi@example.com", time: "5分钟前" },
    { name: "王五", email: "wangwu@example.com", time: "10分钟前" },
  ]

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <div key={user.email} className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <span className="text-xs text-muted-foreground">{user.time}</span>
        </div>
      ))}
    </div>
  )
}

// 通知小部件
function NotificationsWidget() {
  const notifications = [
    { title: "新用户注册", type: "user", time: "5分钟前" },
    { title: "系统更新", type: "system", time: "30分钟前" },
    { title: "任务完成", type: "task", time: "1小时前" },
  ]

  return (
    <div className="space-y-3">
      {notifications.map((n, i) => (
        <div key={i} className="flex items-center gap-3">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">{n.title}</p>
            <p className="text-xs text-muted-foreground">{n.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// 任务小部件
function TasksWidget() {
  const tasks = [
    { title: "完成项目文档", status: "pending" },
    { title: "代码审查", status: "in_progress" },
    { title: "发布新版本", status: "pending" },
  ]

  return (
    <div className="space-y-3">
      {tasks.map((task, i) => (
        <div key={i} className="flex items-center gap-3">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm flex-1">{task.title}</span>
          <Badge variant={task.status === "in_progress" ? "default" : "outline"} className="text-xs">
            {task.status === "in_progress" ? "进行中" : "待处理"}
          </Badge>
        </div>
      ))}
    </div>
  )
}

// 日历小部件
function CalendarWidget() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <Calendar className="h-16 w-16 mx-auto mb-2 opacity-50" />
        <p>今日日程</p>
        <p className="text-xs">3 个事件</p>
      </div>
    </div>
  )
}

// 快捷操作小部件
function QuickActionsWidget() {
  const actions = [
    { label: "添加用户", icon: Users },
    { label: "新建文档", icon: BarChart3 },
    { label: "发送通知", icon: Bell },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {actions.map((action) => (
        <Button key={action.label} variant="outline" className="flex flex-col h-auto py-3">
          <action.icon className="h-5 w-5 mb-1" />
          <span className="text-xs">{action.label}</span>
        </Button>
      ))}
    </div>
  )
}

// 小部件内容渲染
function WidgetContent({ type }: { type: WidgetType }) {
  switch (type) {
    case "stats":
      return <StatsWidget />
    case "chart-line":
      return <LineChartWidget />
    case "chart-bar":
      return <BarChartWidget />
    case "chart-pie":
      return <PieChartWidget />
    case "recent-users":
      return <RecentUsersWidget />
    case "notifications":
      return <NotificationsWidget />
    case "tasks":
      return <TasksWidget />
    case "calendar":
      return <CalendarWidget />
    case "quick-actions":
      return <QuickActionsWidget />
    default:
      return <div>未知部件类型</div>
  }
}

// 单个小部件组件
interface WidgetCardProps {
  widget: DashboardWidget
  isEditing: boolean
  onRemove: () => void
}

function WidgetCard({ widget, isEditing, onRemove }: WidgetCardProps) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          {isEditing && (
            <div className="cursor-grab active:cursor-grabbing drag-handle">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
        </div>
        {isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <WidgetContent type={widget.type} />
      </CardContent>
    </Card>
  )
}

// 可配置仪表盘组件
export function ConfigurableDashboard() {
  const {
    widgets,
    layouts,
    isEditing,
    setLayouts,
    setIsEditing,
    addWidget,
    removeWidget,
    resetToDefault,
  } = useDashboardStore()

  const [containerWidth, setContainerWidth] = React.useState(1200)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // 监听容器宽度变化
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayouts(newLayout as DashboardLayout[])
  }

  const handleAddWidget = (type: WidgetType, title: string) => {
    addWidget({ type, title })
  }

  return (
    <div ref={containerRef} className="space-y-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditing && (
            <Badge variant="secondary" className="animate-pulse">
              编辑模式
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    添加部件
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>添加部件</SheetTitle>
                    <SheetDescription>选择要添加到仪表盘的部件</SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-3 mt-4">
                    {widgetTemplates.map((template) => {
                      const Icon = iconMap[template.icon] || BarChart3
                      return (
                        <Button
                          key={template.type}
                          variant="outline"
                          className="justify-start h-auto py-3"
                          onClick={() => {
                            handleAddWidget(template.type, template.title)
                          }}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <p className="font-medium">{template.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </SheetContent>
              </Sheet>
              <Button variant="outline" size="sm" onClick={resetToDefault}>
                <RotateCcw className="h-4 w-4 mr-1" />
                重置
              </Button>
              <Button size="sm" onClick={() => setIsEditing(false)}>
                <Save className="h-4 w-4 mr-1" />
                保存
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Settings className="h-4 w-4 mr-1" />
              自定义
            </Button>
          )}
        </div>
      </div>

      {/* 网格布局 */}
      <GridLayout
        className="layout"
        layout={layouts}
        cols={12}
        rowHeight={80}
        width={containerWidth}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditing}
        isResizable={isEditing}
        draggableHandle=".drag-handle"
        compactType="vertical"
        preventCollision={false}
      >
        {widgets.map((widget) => (
          <div key={widget.id} className={cn(isEditing && "ring-2 ring-primary/20 rounded-lg")}>
            <WidgetCard
              widget={widget}
              isEditing={isEditing}
              onRemove={() => removeWidget(widget.id)}
            />
          </div>
        ))}
      </GridLayout>

      {/* 空状态 */}
      {widgets.length === 0 && (
        <Card className="p-8 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">没有部件</h3>
          <p className="mt-2 text-muted-foreground">
            点击「自定义」按钮添加仪表盘部件
          </p>
        </Card>
      )}
    </div>
  )
}
