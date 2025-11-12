import CodePreview from '../../components/code/CodePreview'
import PerformanceMonitorClient from './performance-monitor-client'

export default function PerformancePage() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6 p-6">
      <header>
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">RSC 性能监控</h1>
        <p className="mb-6 leading-relaxed text-slate-500">
          实时监控 React Server Components 的渲染性能指标，包括服务器渲染时间、Flight
          数据传输、客户端水合时间等关键指标。
        </p>
      </header>

      <PerformanceMonitorClient />

      <section className="grid gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CodePreview
            title="Performance 页面入口"
            file="src/app/rsc-performance/page.tsx"
            description="服务器组件负责渲染性能面板入口与说明。"
          />
          <CodePreview
            title="performance-monitor-client.tsx"
            file="src/app/rsc-performance/performance-monitor-client.tsx"
            description="客户端组件使用 Performance API 收集 FCP、Hydration、TTI 等指标。"
          />
        </div>
      </section>
    </div>
  )
}

