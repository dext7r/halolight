"use client"

import { motion } from "framer-motion"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const recentActivities = [
  {
    id: 1,
    user: "张三",
    avatar: "",
    action: "创建了新订单",
    target: "#ORD-2024001",
    time: "2 分钟前",
    type: "order",
  },
  {
    id: 2,
    user: "李四",
    avatar: "",
    action: "更新了用户资料",
    target: "",
    time: "15 分钟前",
    type: "user",
  },
  {
    id: 3,
    user: "王五",
    avatar: "",
    action: "上传了文件",
    target: "report-2024.pdf",
    time: "1 小时前",
    type: "file",
  },
  {
    id: 4,
    user: "赵六",
    avatar: "",
    action: "发表了评论",
    target: "产品反馈",
    time: "2 小时前",
    type: "comment",
  },
  {
    id: 5,
    user: "孙七",
    avatar: "",
    action: "完成了任务",
    target: "数据迁移",
    time: "3 小时前",
    type: "task",
  },
]

const typeColors: Record<string, string> = {
  order: "bg-blue-500/10 text-blue-500",
  user: "bg-green-500/10 text-green-500",
  file: "bg-yellow-500/10 text-yellow-500",
  comment: "bg-purple-500/10 text-purple-500",
  task: "bg-pink-500/10 text-pink-500",
}

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
          <CardDescription>团队成员的最近操作记录</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback>{activity.user.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.user}</span>
                      <Badge variant="secondary" className={typeColors[activity.type]}>
                        {activity.action}
                      </Badge>
                    </div>
                    {activity.target && (
                      <p className="text-sm text-muted-foreground">
                        {activity.target}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}
