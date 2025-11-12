import Link from 'next/link'

type DemoCard = {
  title: string
  description: string
  href: string
  accent: string
  category: '核心概念' | '数据流' | '性能调试' | 'API & 底层'
}

const demoCards: DemoCard[] = [
  {
    title: 'RSC 基础 Demo',
    description: '最小化示例，观察服务器组件执行与客户端水合。',
    href: '/rsc-demo',
    accent: '#0f172a',
    category: '核心概念',
  },
  {
    title: 'Streaming Suspense',
    description: '体验 Suspense fallback 先行返回与流式补全流程。',
    href: '/rsc-streaming',
    accent: '#1d4ed8',
    category: '核心概念',
  },
  {
    title: 'Server Actions 基础',
    description: '原生表单 + Server Action，查看 Flight 回传与重验证。',
    href: '/rsc-actions',
    accent: '#047857',
    category: '核心概念',
  },
  {
    title: 'Optimistic Actions',
    description: '结合 useOptimistic 与 Server Action，实现乐观更新体验。',
    href: '/rsc-actions-optimistic',
    accent: '#10b981',
    category: '核心概念',
  },
  {
    title: 'Partial Prerendering',
    description: '静态与动态内容协同，演示 PPR 的缓存策略与流式输出。',
    href: '/rsc-ppr',
    accent: '#f97316',
    category: '核心概念',
  },
  {
    title: 'Edge Runtime',
    description: '对比 Edge vs Node 运行时的网络与日志差异，集成地理信息。',
    href: '/rsc-edge',
    accent: '#0ea5e9',
    category: '数据流',
  },
  {
    title: 'Flight 数据可视化',
    description: '手动粘贴 Flight chunk，树状展开组件节点与客户端引用。',
    href: '/rsc-flight-viewer',
    accent: '#7c3aed',
    category: '数据流',
  },
  {
    title: 'Flight Recorder',
    description: '自动轮询 window.__next_f，实时捕获 Flight chunk 变化。',
    href: '/rsc-flight-recorder',
    accent: '#111827',
    category: '数据流',
  },
  {
    title: '缓存策略实验',
    description: '`revalidateTag`、`unstable_cache` 与实时数据对比，掌握 RSC 缓存刷新模式。',
    href: '/rsc-cache-lab',
    accent: '#0ea5e9',
    category: '数据流',
  },
  {
    title: 'Next.js API 生命周期',
    description: 'Route Handler、ReadableStream、middleware 与 instrumentation。',
    href: '/api-lifecycle',
    accent: '#f59e0b',
    category: 'API & 底层',
  },
  {
    title: '性能监控',
    description: '收集 FCP、Hydration、TTI 等指标，量化 RSC 渲染表现。',
    href: '/rsc-performance',
    accent: '#dc2626',
    category: '性能调试',
  },
  {
    title: 'React 19 use() Hook',
    description: '探索 use() Hook 直接使用 Promise 和 Context，无需 useEffect 的新方式。',
    href: '/rsc-use-hook',
    accent: '#8b5cf6',
    category: '核心概念',
  },
  {
    title: '并发特性 (Transitions)',
    description: 'useTransition 和 useDeferredValue 实现非阻塞更新，保持 UI 响应性。',
    href: '/rsc-transitions',
    accent: '#ec4899',
    category: '性能调试',
  },
  {
    title: 'Metadata API',
    description: '动态生成 SEO 元数据、Open Graph 和 Twitter Cards，优化搜索引擎和社交媒体分享。',
    href: '/rsc-metadata',
    accent: '#14b8a6',
    category: 'API & 底层',
  },
  {
    title: 'Parallel Routes',
    description: '使用 @segment 并行渲染多个区域，构建高并发仪表盘页面。',
    href: '/parallel-lab',
    accent: '#0ea5e9',
    category: 'API & 底层',
  },
  {
    title: 'Intercepting Routes',
    description: '通过模态拦截路由体验 SPA 与 SSR 的混合导航模式。',
    href: '/intercept-lab',
    accent: '#8b5cf6',
    category: 'API & 底层',
  },
]

const guidePoints = [
  '观察服务器组件的执行日志与数据抓取',
  '分析 Flight 数据包内的模块引用与 Props 编码',
  '验证客户端组件的水合与增量加载路径',
  '体验 Suspense 流式输出与客户端水合时间标记',
  '提交 Server Action，分析 Flight 回传与路径重新验证',
  '使用 Flight 可视化与 Recorder 工具调试 Flight chunk',
  '监控 RSC 渲染性能指标，包括 FCP、水合时间、TTI',
  '对比 Edge 与 Node Runtime 的执行上下文和网络能力',
  '体验 Partial Prerendering，将静态缓存与动态实时内容组合',
  '在客户端使用 useOptimistic 实现无闪烁的乐观更新流',
  '使用 Route Handler、middleware、instrumentation 观察 Next.js API 生命周期',
  '实践 revalidateTag / unstable_cache，构建 RSC 缓存刷新与实时数据协同策略',
  '探索 React 19 use() Hook，直接在组件中使用 Promise 和 Context',
  '使用 useTransition 和 useDeferredValue 实现非阻塞更新，保持 UI 响应性',
  '动态生成 SEO 元数据、Open Graph 和 Twitter Cards，优化搜索引擎和社交媒体分享',
  '利用 Parallel Routes 让多个仪表盘区域并行加载，降低感知等待时间',
  '通过 Intercepting Routes 构建模态预览与完整页面之间的无缝切换',
]

export default function Home() {
  const grouped = demoCards.reduce<Record<string, DemoCard[]>>((acc, card) => {
    if (!acc[card.category]) acc[card.category] = []
    acc[card.category].push(card)
    return acc
  }, {})

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-16 sm:gap-8 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:py-32">
      <section className="mx-auto grid max-w-[1080px] gap-8">
        <div className="rounded-[20px] bg-slate-900 px-4 py-10 text-slate-200 shadow-[0_24px_80px_rgba(15,23,42,0.35)] sm:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-400">
            Next.js RSC 实验室
          </p>
          <h1 className="mb-5 text-[clamp(28px,6vw,44px)] leading-tight">
            拆解 React Server Components 的完整运行链路
          </h1>
          <p className="mb-0 text-[clamp(15px,2.8vw,18px)] leading-relaxed text-blue-100">
            通过一系列可运行的 Demo，逐步理解 Flight 协议、服务器渲染、水合、Server Actions、
            Edge Runtime 与性能调试。每个实验都附带操作指引与抓包提示，帮助你快速定位关键细节。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/rsc-demo"
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 sm:text-base"
            >
              从基础 Demo 开始
            </Link>
            <Link
              href="/guide"
              className="rounded-full border border-slate-400/35 bg-slate-400/15 px-5 py-3 text-sm font-semibold text-blue-100 transition-all hover:bg-slate-400/20 sm:text-base"
            >
              阅读完整实验指南
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1080px] gap-7">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="grid gap-4">
            <header className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                {category}
              </span>
            </header>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-300/25 bg-white p-5 text-slate-900 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_50px_rgba(15,23,42,0.1)]"
                  style={{ textDecoration: 'none' }}
                >
                  <span
                    className="inline-flex self-start rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
                    style={{ backgroundColor: item.accent }}
                  >
                    Explore
                  </span>
                  <h3 className="m-0 text-xl font-semibold">{item.title}</h3>
                  <p className="m-0 text-[clamp(14px,2.8vw,15px)] leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-[1080px] rounded-2xl border border-slate-300/25 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-8">
        <h2 className="mb-4 text-[clamp(20px,4vw,24px)] font-semibold text-slate-900">
          操作备忘
        </h2>
        <ul className="m-0 list-inside list-disc space-y-2 pl-5 text-[clamp(14px,2.8vw,15px)] leading-relaxed text-gray-800">
          {guidePoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
