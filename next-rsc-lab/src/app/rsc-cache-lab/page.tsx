import CacheControlPanel from './cache-control-panel'
import CachedQuoteSection from './cached-quote'
import InsightMetricsSection from './insight-metrics'
import LivePulseSection from './live-pulse'
import { getCachedQuote, getInsightMetrics, getLivePulse } from './data'
import CodePreview from '../../components/code/CodePreview'

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
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-8 sm:py-20 md:px-8 md:py-24">
      <section className="mx-auto grid max-w-[1080px] gap-8">
        <header className="rounded-2xl bg-slate-900 px-4 py-9 text-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.35)] sm:px-8">
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">RSC 缓存策略实验室</h1>
          <p className="mb-4 text-base leading-relaxed text-blue-200 sm:text-lg">
            通过 `revalidateTag`、`unstable_cache` 与 `cache: 'no-store'` 的组合，探索服务器缓存的命中、强制失效、
            以及与实时数据的对比效果。
          </p>
        </header>

        <CacheControlPanel
          initialQuoteRefreshedAt={quote.fetchedAt}
          initialInsightRefreshedAt={insight.generatedAt}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          <CachedQuoteSection quote={quote} />
          <InsightMetricsSection insight={insight} />
        </div>

        <LivePulseSection pulse={pulse} />

        <section className="grid gap-5">
          <h2 className="text-xl font-semibold sm:text-2xl">关键代码预览</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <CodePreview
              title="CacheLabPage 主页面"
              file="src/app/rsc-cache-lab/page.tsx"
              description="并行获取缓存数据与实时数据，展示不同缓存策略的协同效果。"
            />
            <CodePreview
              title="data.ts 数据源"
              file="src/app/rsc-cache-lab/data.ts"
              description="定义 getCachedQuote（revalidateTag）、getInsightMetrics（unstable_cache）与 getLivePulse（no-store）。"
            />
            <CodePreview
              title="actions.ts Server Actions"
              file="src/app/rsc-cache-lab/actions.ts"
              description="通过 revalidateTag / revalidatePath 强制刷新缓存，触发服务器重新渲染。"
            />
            <CodePreview
              title="cache-control-panel.tsx"
              file="src/app/rsc-cache-lab/cache-control-panel.tsx"
              description="客户端控制面板，使用 useTransition 调用 Server Actions 并更新本地状态。"
            />
            <CodePreview
              title="cached-quote.tsx"
              file="src/app/rsc-cache-lab/cached-quote.tsx"
              description="展示带 revalidateTag 的缓存 Fetch 结果，观察缓存命中与刷新时机。"
            />
            <CodePreview
              title="insight-metrics.tsx"
              file="src/app/rsc-cache-lab/insight-metrics.tsx"
              description="展示 unstable_cache 的计算结果，演示昂贵计算的缓存策略。"
            />
          </div>
        </section>
      </section>
    </main>
  )
}
