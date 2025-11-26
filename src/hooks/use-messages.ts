import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {type Conversation,messageService } from "@/lib/api/services"

// 查询键
export const messageKeys = {
  all: ["messages"] as const,
  conversations: () => [...messageKeys.all, "conversations"] as const,
  conversation: (id: string) => [...messageKeys.all, "conversation", id] as const,
  messages: (conversationId: string) =>
    [...messageKeys.all, "messages", conversationId] as const,
}

// 获取会话列表
export function useConversations() {
  return useQuery({
    queryKey: messageKeys.conversations(),
    queryFn: () => messageService.getConversations(),
  })
}

// 获取消息历史
export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: messageKeys.messages(conversationId),
    queryFn: () => messageService.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000, // 5分钟内的数据认为是新鲜的
    gcTime: 10 * 60 * 1000, // 10分钟后清理缓存
  })
}

// 发送消息
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      conversationId,
      content,
      type,
    }: {
      conversationId: string
      content: string
      type?: string
    }) => messageService.sendMessage(conversationId, content, type),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.messages(conversationId),
      })
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() })
    },
  })
}

// 标记会话已读
export function useMarkConversationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (conversationId: string) =>
      messageService.markConversationRead(conversationId),
    onMutate: async (conversationId) => {
      // 取消任何进行中的查询
      await queryClient.cancelQueries({ queryKey: messageKeys.conversations() })

      // 获取当前数据快照
      const previousConversations = queryClient.getQueryData(
        messageKeys.conversations()
      )

      // 乐观更新：将未读数设为 0
      queryClient.setQueryData(messageKeys.conversations(), (old: Conversation[]) => {
        if (!old) return old
        return old.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      })

      return { previousConversations }
    },
    onError: (err, conversationId, context) => {
      // 出错时回滚到之前的状态
      queryClient.setQueryData(
        messageKeys.conversations(),
        context?.previousConversations
      )
    },
    })
}

export function useDeleteConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (conversationId: string) =>
      messageService.deleteConversation(conversationId),
    onMutate: async (conversationId) => {
      await queryClient.cancelQueries({ queryKey: messageKeys.conversations() })

      const previousConversations = queryClient.getQueryData<Conversation[]>(
        messageKeys.conversations()
      )

      queryClient.setQueryData(
        messageKeys.conversations(),
        (old: Conversation[] = []) =>
          old.filter((conv) => conv.id !== conversationId)
      )

      queryClient.removeQueries({
        queryKey: messageKeys.messages(conversationId),
      })

      return { previousConversations }
    },
    onError: (_err, conversationId, context) => {
      if (context?.previousConversations) {
        queryClient.setQueryData(
          messageKeys.conversations(),
          context.previousConversations
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() })
    },
  })
}
