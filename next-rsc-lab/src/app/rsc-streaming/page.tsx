import { Suspense } from 'react'
import SlowServerPanel from './slow-server-panel'
import ClientHydrationMarker from './client-hydration-marker'

export default function StreamingPage() {
  const renderTime = new Date().toISOString()

  console.log('[RSC][Streaming] 页面入口渲染时间:', renderTime)

  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <header>
        <h1>RSC Streaming Demo</h1>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          这个页面演示 Suspense + Server Component 的流式输出。先观察 fallback
          提前抵达客户端，再留意真正的数据块补全 DOM。
        </p>
      </header>

      <section
        style={{
          border: '1px solid #cbd5f5',
          borderRadius: 12,
          padding: 20,
          background: '#f8fafc',
        }}
      >
        <h2>流式数据区域</h2>
        <p style={{ marginBottom: 12 }}>
          fallback 会立即返回，真实内容约 3 秒后抵达，记得在 Network →
          Fetch/XHR 中关注 `?__rsc` 的分段传输。
        </p>

        <Suspense fallback={<StreamingFallback />}>
          <SlowServerPanel />
        </Suspense>
      </section>

      <section>
        <h2>客户端水合标记</h2>
        <ClientHydrationMarker />
      </section>
    </main>
  )
}

function StreamingFallback() {
  const fallbackTime = new Date().toISOString()

  console.log('[RSC][Streaming] Suspense fallback 渲染时间:', fallbackTime)

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: '#fff7ed',
        border: '1px dashed #fb923c',
        color: '#c2410c',
      }}
    >
      <strong>等待服务器数据...</strong>
      <p style={{ margin: '8px 0 0' }}>fallback 渲染时间：{fallbackTime}</p>
    </div>
  )
}

