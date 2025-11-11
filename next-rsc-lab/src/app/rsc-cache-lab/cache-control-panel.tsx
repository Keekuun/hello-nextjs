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
    <section
      style={{
        border: '1px solid rgba(148,163,184,0.35)',
        borderRadius: 16,
        background: 'rgba(30,41,59,0.12)',
        padding: 20,
        display: 'grid',
        gap: 12,
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <strong style={{ color: '#0f172a', fontSize: 16 }}>缓存控制面板</strong>
        <span style={{ fontSize: 13, color: '#475569' }}>
          通过 Server Actions 调用 `revalidateTag` / `revalidatePath`，观察缓存与流式数据的协同刷新。
        </span>
      </header>
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
        }}
      >
        <button className="cache-lab-btn" onClick={handleRefreshQuote} disabled={isPending}>
          刷新缓存的引用
        </button>
        <button className="cache-lab-btn" onClick={handleRefreshInsight} disabled={isPending}>
          刷新计算指标
        </button>
        <button className="cache-lab-btn primary" onClick={handleRefreshAll} disabled={isPending}>
          刷新全部并重新渲染页面
        </button>
      </div>
      <dl
        style={{
          margin: 0,
          display: 'grid',
          gap: 6,
          gridTemplateColumns: 'auto 1fr',
          fontSize: 13,
          color: '#1f2937',
        }}
      >
        <dt>引用缓存最后更新：</dt>
        <dd>{quoteRefreshedAt}</dd>
        <dt>指标缓存最后更新：</dt>
        <dd>{insightRefreshedAt}</dd>
      </dl>
      {isPending && <span style={{ fontSize: 12, color: '#64748b' }}>等待服务器刷新缓存…</span>}
    </section>
  )
}
