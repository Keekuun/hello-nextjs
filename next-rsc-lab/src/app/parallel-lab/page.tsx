import CodePreview from '../../components/code/CodePreview'

export const metadata = {
  title: 'Parallel Routes 实验',
  description: '演示 Next.js Parallel Routes 的独立并发渲染能力。',
}

export default function ParallelLabPage() {
  return (
    <main className="flex flex-col gap-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <h1 className="mb-3 text-3xl font-bold text-slate-900">Parallel Routes 实验</h1>
        <p className="mb-4 leading-relaxed text-slate-600">
          Parallel Routes 允许在同一级路由中定义多个并行区域，每个区域都可以独立执行渲染、数据请求与 Suspense。
          这对于仪表盘、工作台等需要并行加载不同模块的页面特别有用。
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-600">
          <li>每个并行区域通过 <code className="rounded bg-slate-200 px-1 py-0.5">@segment</code> 目录定义。</li>
          <li>区域组件可以独立控制数据获取策略（缓存、Suspense、流式渲染）。</li>
          <li>
            <code className="rounded bg-slate-200 px-1 py-0.5">layout.tsx</code> 负责组合各个区域的渲染结果。
          </li>
        </ul>
      </header>

      <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CodePreview
            title="ParallelLab Layout"
            file="src/app/parallel-lab/layout.tsx"
            description="定义并行路由的布局，组合 children 与三个并行区域。"
          />
          <CodePreview
            title="@metrics 区域"
            file="src/app/parallel-lab/@metrics/page.tsx"
            description="展示独立缓存策略的指标面板，验证并行渲染。"
          />
          <CodePreview
            title="@activity 区域"
            file="src/app/parallel-lab/@activity/page.tsx"
            description="模拟实时活动流，演示与其他区域完全独立的加载流程。"
          />
          <CodePreview
            title="@insights 区域"
            file="src/app/parallel-lab/@insights/page.tsx"
            description="结合数据延迟与 Suspense fallback，观察局部加载体验。"
          />
        </div>
      </section>
    </main>
  )
}


