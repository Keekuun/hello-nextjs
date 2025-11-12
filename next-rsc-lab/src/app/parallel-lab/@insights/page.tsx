import { unstable_noStore as noStore } from 'next/cache'

type Insight = {
  id: string
  title: string
  body: string
  latency: number
}

async function fetchInsights(): Promise<Insight[]> {
  await new Promise((resolve) => setTimeout(resolve, 2200))

  const latency = Number((Math.random() * 180 + 120).toFixed(0))
  return [
    {
      id: 'edge',
      title: 'Edge Runtime 优先策略',
      body: '结合 region 优选与 cache: "no-store"，确保最近区域的响应延迟保持在 200ms 内。',
      latency,
    },
    {
      id: 'ppr',
      title: 'Partial Prerendering',
      body: '静态框架 + 动态补充可优化首次字节时间（TTFB），同时保持实时数据能力。',
      latency: latency + 40,
    },
  ]
}

export default async function InsightsPanel() {
  noStore()
  const insights = await fetchInsights()

  return (
    <article>
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">洞察分析（延迟模拟）</h2>
        <p className="text-sm text-slate-600">
          该区域模拟需要更长时间完成的数据分析任务，触发 Suspense fallback。Parallel Routes 允许其他面板先行渲染。
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-lg border border-violet-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-violet-900">{insight.title}</h3>
              <span className="text-xs text-violet-600">延迟：{insight.latency} ms</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{insight.body}</p>
          </div>
        ))}
      </div>
    </article>
  )
}


