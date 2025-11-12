'use client'

import { useState, useTransition } from 'react'
import { refreshCachedQuote, refreshEverything, refreshInsightMetrics } from './actions'

type Props = {
  initialQuoteRefreshedAt: string
  initialInsightRefreshedAt: string
}

export default function CacheControlPanel({
  initialQuoteRefreshedAt,
  initialInsightRefreshedAt,
}: Props) {
  const [quoteRefreshedAt, setQuoteRefreshedAt] = useState(initialQuoteRefreshedAt)
  const [insightRefreshedAt, setInsightRefreshedAt] = useState(initialInsightRefreshedAt)
  const [isPending, startTransition] = useTransition()

  const handleRefreshQuote = () => {
    startTransition(async () => {
      const result = await refreshCachedQuote()
      setQuoteRefreshedAt(result.refreshedAt)
    })
  }

  const handleRefreshInsight = () => {
    startTransition(async () => {
      const result = await refreshInsightMetrics()
      setInsightRefreshedAt(result.refreshedAt)
    })
  }

  const handleRefreshAll = () => {
    startTransition(async () => {
      const result = await refreshEverything()
      setQuoteRefreshedAt(result.refreshedAt)
      setInsightRefreshedAt(result.refreshedAt)
    })
  }

  return (
    <section className="grid gap-3 rounded-2xl border border-slate-300/35 bg-slate-800/12 p-5">
      <header className="flex flex-col gap-1">
        <strong className="text-base font-semibold text-slate-900">缓存控制面板</strong>
        <span className="text-xs text-slate-600 sm:text-sm">
          通过 Server Actions 调用 `revalidateTag` / `revalidatePath`，观察缓存与流式数据的协同刷新。
        </span>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <button
          className="cursor-pointer rounded-xl border border-slate-300/45 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/18 disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none disabled:shadow-none"
          onClick={handleRefreshQuote}
          disabled={isPending}
        >
          刷新缓存的引用
        </button>
        <button
          className="cursor-pointer rounded-xl border border-slate-300/45 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/18 disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none disabled:shadow-none"
          onClick={handleRefreshInsight}
          disabled={isPending}
        >
          刷新计算指标
        </button>
        <button
          className="cursor-pointer rounded-xl border-0 bg-gradient-to-br from-cyan-400 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_18px_36px_rgba(99,102,241,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none disabled:shadow-[0_18px_36px_rgba(99,102,241,0.25)]"
          onClick={handleRefreshAll}
          disabled={isPending}
        >
          刷新全部并重新渲染页面
        </button>
      </div>
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-1.5 text-sm text-gray-800">
        <dt>引用缓存最后更新：</dt>
        <dd>{quoteRefreshedAt}</dd>
        <dt>指标缓存最后更新：</dt>
        <dd>{insightRefreshedAt}</dd>
      </dl>
      {isPending && <span className="text-xs text-slate-500">等待服务器刷新缓存…</span>}
    </section>
  )
}
