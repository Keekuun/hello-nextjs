export const revalidate = 120

import { Suspense } from 'react'
import StaticSummary from './static-summary'
import DynamicInsights from './dynamic-insights'

export default function PprDemoPage() {
  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        maxWidth: 960,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <header>
        <h1>Partial Prerendering（PPR）实验</h1>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          本页面演示如何将静态可缓存内容与动态实时内容结合。Next.js 在构建阶段预渲染静态部分，
          动态部分通过 Suspense 在请求时流式补充，实现「静态 + 动态」的平衡。
        </p>
      </header>

      <StaticSummary />

      <section
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 24,
          background: '#f8fafc',
        }}
      >
        <h2>动态洞察（实时数据）</h2>
        <p style={{ color: '#64748b', marginBottom: 12 }}>
          以下内容不会被缓存，每次请求都会重新生成，配合 Suspense fallback
          可实现首屏快速可见，再增量更新的体验。
        </p>

        <Suspense fallback={<DynamicFallback />}>
          <DynamicInsights />
        </Suspense>
      </section>
    </main>
  )
}

function DynamicFallback() {
  const time = new Date().toISOString()

  console.log('[PPR] DynamicFallback 渲染时间:', time)

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: '#fffbeb',
        border: '1px dashed #f59e0b',
        color: '#9a3412',
      }}
    >
      <strong>正在加载实时数据...</strong>
      <p style={{ marginTop: 8, fontSize: 13 }}>Fallback 渲染时间：{time}</p>
    </div>
  )
}

