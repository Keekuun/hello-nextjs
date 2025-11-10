import Link from 'next/link'

type DemoCard = {
  title: string
  description: string
  href: string
  accent: string
  category: '核心概念' | '数据流' | '性能调试'
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
    title: '性能监控',
    description: '收集 FCP、Hydration、TTI 等指标，量化 RSC 渲染表现。',
    href: '/rsc-performance',
    accent: '#dc2626',
    category: '性能调试',
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
]

export default function Home() {
  const grouped = demoCards.reduce<Record<string, DemoCard[]>>((acc, card) => {
    if (!acc[card.category]) acc[card.category] = []
    acc[card.category].push(card)
    return acc
  }, {})

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '72px 40px 96px',
        fontFamily: 'sans-serif',
        background: 'linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      <section
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'grid',
          gap: 32,
          gridTemplateColumns: 'minmax(0, 1fr)',
        }}
      >
        <div
          style={{
            background: '#0f172a',
            color: '#e2e8f0',
            borderRadius: 20,
            padding: '40px 32px',
            boxShadow: '0 24px 80px rgba(15, 23, 42, 0.35)',
          }}
        >
          <p
            style={{
              fontSize: 14,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 16,
              color: '#60a5fa',
              fontWeight: 600,
            }}
          >
            Next.js RSC 实验室
          </p>
          <h1 style={{ fontSize: 42, lineHeight: 1.2, marginBottom: 20 }}>
            拆解 React Server Components 的完整运行链路
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.8, color: '#cbd5f5' }}>
            通过一系列可运行的 Demo，逐步理解 Flight 协议、服务器渲染、水合、Server Actions、
            Edge Runtime 与性能调试。每个实验都附带操作指引与抓包提示，帮助你快速定位关键细节。
          </p>
          <div
            style={{
              marginTop: 28,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <Link
              href="/rsc-demo"
              style={{
                padding: '12px 22px',
                borderRadius: 999,
                background: '#2563eb',
                color: '#fff',
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              从基础 Demo 开始
            </Link>
            <Link
              href="/guide"
              style={{
                padding: '12px 22px',
                borderRadius: 999,
                background: 'rgba(148, 163, 184, 0.15)',
                color: '#cbd5f5',
                fontWeight: 600,
                fontSize: 15,
                border: '1px solid rgba(148, 163, 184, 0.35)',
              }}
            >
              阅读完整实验指南
            </Link>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'grid',
          gap: 28,
        }}
      >
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} style={{ display: 'grid', gap: 16 }}>
            <header
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#64748b',
                  fontWeight: 600,
                }}
              >
                {category}
              </span>
            </header>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
                gap: 18,
              }}
            >
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    borderRadius: 16,
                    padding: 20,
                    background: '#ffffff',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    color: '#0f172a',
                    textDecoration: 'none',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignSelf: 'flex-start',
                      padding: '6px 12px',
                      borderRadius: 999,
                      background: item.accent,
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Explore
                  </span>
                  <h3
                    style={{
                      fontSize: 20,
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: '#475569',
                      lineHeight: 1.6,
                      fontSize: 15,
                    }}
                  >
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: 16,
          padding: 28,
          border: '1px solid rgba(148, 163, 184, 0.25)',
          boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
        }}
      >
        <h2 style={{ fontSize: 24, marginBottom: 16, color: '#0f172a' }}>
          操作备忘
        </h2>
        <ul
          style={{
            paddingLeft: 20,
            margin: 0,
            color: '#1f2937',
            lineHeight: 1.75,
            fontSize: 15,
          }}
        >
          {guidePoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
