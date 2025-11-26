// Mock fetch 拦截器
// Mock.js 只拦截 XMLHttpRequest，需要手动拦截 fetch

import Mock from "mockjs"

// 保存原始 fetch
const originalFetch = window.fetch

// 提取 URL 的路径部分（去除查询参数和 hash）
function getUrlPathname(url: string): string {
  try {
    // 处理相对路径
    if (url.startsWith("/")) {
      const questionIndex = url.indexOf("?")
      const hashIndex = url.indexOf("#")
      let endIndex = url.length
      if (questionIndex !== -1) endIndex = Math.min(endIndex, questionIndex)
      if (hashIndex !== -1) endIndex = Math.min(endIndex, hashIndex)
      return url.substring(0, endIndex)
    }
    // 处理完整 URL
    const urlObj = new URL(url)
    return urlObj.pathname
  } catch {
    return url
  }
}

// 从 Mock.js 内部获取已注册的 mock 规则
function findMockHandler(url: string, method: string) {
  // @ts-expect-error - 访问 Mock.js 内部 _mocked 对象
  const mocked = Mock._mocked || {}

  // 提取 URL 路径部分用于匹配
  const urlPathname = getUrlPathname(url)
  // 统一转为大写比较
  const normalizedMethod = method.toUpperCase()

  for (const key in mocked) {
    const item = mocked[key]
    const rurl = item.rurl
    // Mock.js 存储的方法可能是 undefined（默认 GET）或任意大小写
    const rtype = (item.rtype || "get").toUpperCase()

    // 检查方法是否匹配
    if (rtype !== normalizedMethod) continue

    // 检查 URL 是否匹配
    if (typeof rurl === "string") {
      // 同时检查完整 URL 和路径部分
      if (url === rurl || urlPathname === rurl || url.endsWith(rurl) || urlPathname.endsWith(rurl)) {
        return item
      }
    } else if (rurl instanceof RegExp) {
      // 对正则表达式同时测试完整 URL 和路径部分
      if (rurl.test(url) || rurl.test(urlPathname)) {
        return item
      }
    }
  }

  return null
}

// 拦截 fetch 请求
export function setupMockFetch() {
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // 提取 URL 和方法
    let url: string
    let method: string = "GET"

    if (typeof input === "string") {
      url = input
      method = init?.method?.toUpperCase() || "GET"
    } else if (input instanceof URL) {
      url = input.href
      method = init?.method?.toUpperCase() || "GET"
    } else if (input instanceof Request) {
      url = input.url
      method = input.method?.toUpperCase() || init?.method?.toUpperCase() || "GET"
    } else {
      url = String(input)
      method = init?.method?.toUpperCase() || "GET"
    }

    // 只处理 /api 开头的请求
    const urlPathname = getUrlPathname(url)
    if (!urlPathname.startsWith("/api")) {
      return originalFetch(input, init)
    }

    // 查找匹配的 mock 规则
    const handler = findMockHandler(url, method)

    if (handler) {
      // 模拟网络延迟
      await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200))

      // 调用 mock 处理函数
      let result
      if (typeof handler.template === "function") {
        result = handler.template({
          url,
          type: method,
          body: init?.body as string,
        })
      } else {
        result = Mock.mock(handler.template)
      }

      console.log(`[Mock] ${method} ${url}`, result)

      // 返回模拟的 Response
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    // 未匹配的 API 请求，记录警告并返回模拟的 404
    console.warn(`[Mock] 未匹配的 API 请求: ${method} ${url}`)

    // @ts-expect-error - 访问 Mock.js 内部 _mocked 对象用于调试
    const mocked = Mock._mocked || {}
    console.warn("[Mock] 已注册的规则:", Object.keys(mocked).map((key) => {
      const item = mocked[key]
      return `${item.rtype || "GET"} ${item.rurl}`
    }))

    // 返回模拟的错误响应，而不是走真实请求（避免 405）
    return new Response(JSON.stringify({
      code: 404,
      message: `未找到 mock 规则: ${method} ${url}`,
      data: null,
    }), {
      status: 200, // 返回 200 但 code 为 404，与其他 mock 响应格式一致
      headers: { "Content-Type": "application/json" },
    })
  }
}

// 恢复原始 fetch
export function restoreFetch() {
  window.fetch = originalFetch
}
