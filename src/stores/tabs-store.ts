import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Tab {
  id: string
  title: string
  path: string
  icon?: string
  closable?: boolean
}

interface TabsState {
  tabs: Tab[]
  activeTabId: string | null
  // 操作
  addTab: (tab: Omit<Tab, "id">) => string
  removeTab: (id: string) => void
  setActiveTab: (id: string) => void
  updateTab: (id: string, updates: Partial<Tab>) => void
  clearTabs: () => void
  // 查询
  getTab: (id: string) => Tab | undefined
  getTabByPath: (path: string) => Tab | undefined
}

// 首页标签
const homeTab: Tab = {
  id: "home",
  title: "首页",
  path: "/",
  closable: false,
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [homeTab],
      activeTabId: "home",

      addTab: (tab) => {
        const { tabs, getTabByPath } = get()

        // 检查是否已存在相同路径的标签
        const existingTab = getTabByPath(tab.path)
        if (existingTab) {
          set({ activeTabId: existingTab.id })
          return existingTab.id
        }

        const newTab: Tab = {
          ...tab,
          id: `tab-${Date.now()}`,
          closable: tab.closable !== false,
        }

        set({
          tabs: [...tabs, newTab],
          activeTabId: newTab.id,
        })

        return newTab.id
      },

      removeTab: (id) => {
        const { tabs, activeTabId } = get()

        const tabToRemove = tabs.find((t) => t.id === id)
        if (!tabToRemove || tabToRemove.closable === false) return

        const newTabs = tabs.filter((t) => t.id !== id)
        let newActiveId = activeTabId

        // 如果关闭的是当前活动标签，切换到相邻标签
        if (activeTabId === id) {
          const closedIndex = tabs.findIndex((t) => t.id === id)
          if (closedIndex > 0) {
            newActiveId = newTabs[closedIndex - 1]?.id || newTabs[0]?.id
          } else {
            newActiveId = newTabs[0]?.id
          }
        }

        set({
          tabs: newTabs,
          activeTabId: newActiveId,
        })
      },

      setActiveTab: (id) => {
        const { tabs } = get()
        if (tabs.some((t) => t.id === id)) {
          set({ activeTabId: id })
        }
      },

      updateTab: (id, updates) => {
        const { tabs } = get()
        set({
          tabs: tabs.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })
      },

      clearTabs: () => {
        set({
          tabs: [homeTab],
          activeTabId: "home",
        })
      },

      getTab: (id) => {
        return get().tabs.find((t) => t.id === id)
      },

      getTabByPath: (path) => {
        return get().tabs.find((t) => t.path === path)
      },
    }),
    {
      name: "tabs-storage",
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
      }),
    }
  )
)
