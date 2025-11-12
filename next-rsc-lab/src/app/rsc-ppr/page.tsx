export const revalidate = 120

import CodePreview from '../../components/code/CodePreview'
import { Suspense } from 'react'
import StaticSummary from './static-summary'
import DynamicInsights from './dynamic-insights'

export default function PprDemoPage() {
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-6 p-6">
      <header>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Partial Prerendering（PPR）实验</h1>
        <p className="leading-relaxed text-slate-600">
          本页面演示如何将静态可缓存内容与动态实时内容结合。Next.js 在构建阶段预渲染静态部分，
          动态部分通过 Suspense 在请求时流式补充，实现「静态 + 动态」的平衡。
        </p>
      </header>

      <StaticSummary />

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="mb-3 text-xl font-semibold">动态洞察（实时数据）</h2>
        <p className="mb-3 text-slate-500">
          以下内容不会被缓存，每次请求都会重新生成，配合 Suspense fallback
          可实现首屏快速可见，再增量更新的体验。
        </p>

        <Suspense fallback={<DynamicFallback />}>
          <DynamicInsights />
        </Suspense>
      </section>

      <section className="grid gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CodePreview
            title="PprDemoPage"
            file="src/app/rsc-ppr/page.tsx"
            description="配置 revalidate，组合静态与动态部分形成 PPR 页面。"
          />
          <CodePreview
            title="static-summary.tsx"
            file="src/app/rsc-ppr/static-summary.tsx"
            description="使用 force-cache + revalidate 拉取静态摘要，命中缓存可观测日志。"
          />
          <CodePreview
            title="dynamic-insights.tsx"
            file="src/app/rsc-ppr/dynamic-insights.tsx"
            description="通过 no-store 获取实时数据，并模拟延迟以触发 Suspense fallback。"
          />
        </div>
      </section>
    </main>
  )
}

function DynamicFallback() {
  const time = new Date().toISOString()

  console.log('[PPR] DynamicFallback 渲染时间:', time)

  return (
    <div className="rounded-lg border border-dashed border-amber-500 bg-amber-50 p-4 text-amber-900">
      <strong>正在加载实时数据...</strong>
      <p className="m-0 mt-2 text-[13px]">Fallback 渲染时间：{time}</p>
    </div>
  )
}

