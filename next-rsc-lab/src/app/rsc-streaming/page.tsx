import CodePreview from '../../components/code/CodePreview'
import { Suspense } from 'react'
import SlowServerPanel from './slow-server-panel'
import ClientHydrationMarker from './client-hydration-marker'

export default function StreamingPage() {
  const renderTime = new Date().toISOString()

  console.log('[RSC][Streaming] 页面入口渲染时间:', renderTime)

  return (
    <main className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">RSC Streaming Demo</h1>
        <p className="leading-relaxed text-slate-600">
          这个页面演示 Suspense + Server Component 的流式输出。先观察 fallback
          提前抵达客户端，再留意真正的数据块补全 DOM。
        </p>
      </header>

      <section className="rounded-xl border border-blue-200 bg-slate-50 p-5">
        <h2 className="mb-3 text-xl font-semibold">流式数据区域</h2>
        <p className="mb-3">
          fallback 会立即返回，真实内容约 3 秒后抵达，记得在 Network →
          Fetch/XHR 中关注 `?__rsc` 的分段传输。
        </p>

        <Suspense fallback={<StreamingFallback />}>
          <SlowServerPanel />
        </Suspense>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">客户端水合标记</h2>
        <ClientHydrationMarker />
      </section>

      <section className="grid gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CodePreview
            title="Streaming 页面入口"
            file="src/app/rsc-streaming/page.tsx"
            description="页面开启 Suspense，fallback 先行返回，3 秒后慢组件流式补全。"
          />
          <CodePreview
            title="SlowServerPanel"
            file="src/app/rsc-streaming/slow-server-panel.tsx"
            description="模拟后端延迟，查看 Flight 分片如何按序抵达。"
          />
          <CodePreview
            title="ClientHydrationMarker"
            file="src/app/rsc-streaming/client-hydration-marker.tsx"
            description="记录水合完成时间并提供交互，验证客户端增量加载。"
          />
        </div>
      </section>
    </main>
  )
}

function StreamingFallback() {
  const fallbackTime = new Date().toISOString()

  console.log('[RSC][Streaming] Suspense fallback 渲染时间:', fallbackTime)

  return (
    <div className="rounded-lg border border-dashed border-orange-400 bg-orange-50 p-4 text-orange-800">
      <strong>等待服务器数据...</strong>
      <p className="m-0 mt-2">fallback 渲染时间：{fallbackTime}</p>
    </div>
  )
}

