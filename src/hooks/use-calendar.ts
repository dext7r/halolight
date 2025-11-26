import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { CalendarEvent,calendarService } from "@/lib/api/services"

// 查询键
export const calendarKeys = {
  all: ["calendar"] as const,
  events: () => [...calendarKeys.all, "events"] as const,
  eventList: (start?: string, end?: string) =>
    [...calendarKeys.events(), { start, end }] as const,
  event: (id: string) => [...calendarKeys.all, "event", id] as const,
}

// 获取事件列表
export function useCalendarEvents(start?: string, end?: string) {
  return useQuery({
    queryKey: calendarKeys.eventList(start, end),
    queryFn: () => calendarService.getEvents(start, end),
  })
}

// 获取单个事件
export function useCalendarEvent(id: string) {
  return useQuery({
    queryKey: calendarKeys.event(id),
    queryFn: () => calendarService.getEvent(id),
    enabled: !!id,
  })
}

// 创建事件
export function useCreateCalendarEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<CalendarEvent>) =>
      calendarService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.events() })
    },
  })
}

// 更新事件
export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CalendarEvent> }) =>
      calendarService.updateEvent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.events() })
      queryClient.invalidateQueries({ queryKey: calendarKeys.event(id) })
    },
  })
}

// 删除事件
export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => calendarService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.events() })
    },
  })
}
