import { Suspense } from 'react'
import CacheControlPanel from './cache-control-panel'
import CachedQuoteSection from './cached-quote'
import InsightMetricsSection from './insight-metrics'
import LivePulseSection from './live-pulse'
import { getCachedQuote, getInsightMetrics, getLivePulse } from './data'

export const dynamic = 'force-dynamic'

export default async function CacheLabPage() {
  const [quote, insight, pulse] = await Promise.all([
    getCachedQuote(),
    getInsightMetrics(),
    getLivePulse(),
  ])

  console.log('[CacheLab] Cached quote generated at', quote.fetchedAt)
  console.log('[CacheLab] Insight metrics generated at', insight.generatedAt)

  return (
    <main
      style={{
        padding: '72px 32px 96px',
        fontFamily: 'sans-serif',
        background: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <section
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'grid',
          gap: 32,
        }}
      >
        <header
          style={{
            background: '#0f172a',
            color: '#e2e8f0',
            borderRadius: 18,
            padding: '36px 32px',
            boxShadow: '0 24px 60px rgba(15,23,42,0.35)',
          }}
        >
          <h1 style={{ fontSize: 34, marginBottom: 12 }}>RSC 缓存策略实验室</h1>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: '#bfdbfe', marginBottom: 16 }}>
            通过 `revalidateTag`、`unstable_cache` 与 `cache: 'no-store'` 的组合，探索服务器缓存的命中、强制失效、
            以及与实时数据的对比效果。
          </p>
        </header>

        <CacheControlPanel
          initialQuoteRefreshedAt={quote.fetchedAt}
          initialInsightRefreshedAt={insight.generatedAt}
        />

        <div
          style={{
            display: 'grid',
            gap: 20,
            gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
          }}
        >
          <CachedQuoteSection quote={quote} />
          <InsightMetricsSection insight={insight} />
        </div>

        <LivePulseSection pulse={pulse} />
      </section>
    </main>
  )
}
