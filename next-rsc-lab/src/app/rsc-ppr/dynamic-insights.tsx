async function fetchDynamicInsights() {
  const start = Date.now()

  await new Promise((resolve) => setTimeout(resolve, 2500))

  const fallback = {
    quote: 'Server Components 让我们把大部分 UI 工作留在服务器，客户端只做必要的交互。',
    author: 'Next.js 实验室',
  }

  try {
    const response = await fetch('https://dummyjson.com/quotes/random', {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('[PPR] fetchDynamicInsights 失败:', response.status, response.statusText)
      return {
        quote: fallback.quote,
        author: fallback.author,
        duration: Date.now() - start,
        fetchedAt: new Date().toISOString(),
        isFallback: true,
      }
    }

    const data = await response.json()
    const end = Date.now()

    console.log('[PPR] 动态模块渲染耗时(ms):', end - start)

    return {
      quote: (data.quote as string) ?? fallback.quote,
      author: (data.author as string) ?? fallback.author,
      duration: end - start,
      fetchedAt: new Date(end).toISOString(),
      isFallback: false,
    }
  } catch (error) {
    const duration = Date.now() - start
    console.warn('[PPR] 获取实时引用异常，改用内置兜底。', error)

    return {
      quote: fallback.quote,
      author: fallback.author,
      duration,
      fetchedAt: new Date().toISOString(),
      isFallback: true,
    }
  }
}

export default async function DynamicInsights() {
  const insight = await fetchDynamicInsights()

  return (
    <div className="rounded-lg border border-indigo-300 bg-indigo-50 p-4 text-indigo-900">
      <blockquote className="m-0 text-lg leading-relaxed">
        "{insight.quote}"
      </blockquote>
      <p className="m-0 mt-3 font-semibold">—— {insight.author}</p>
      <p className="m-0 mt-2 text-[13px]">
        拉取耗时：{insight.duration} ms｜时间：{insight.fetchedAt}
      </p>
      {insight.isFallback && (
        <p className="m-0 mt-1.5 text-xs text-red-700">
          提示：实时接口暂不可用，展示兜底引用。
        </p>
      )}
    </div>
  )
}

