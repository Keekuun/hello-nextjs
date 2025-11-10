import Link from 'next/link'

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '64px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        fontFamily: 'sans-serif',
        background: '#f5f5f5',
      }}
    >
      <section
        style={{
          maxWidth: 840,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 12,
          padding: 32,
          boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
        }}
      >
        <h1 style={{ fontSize: 36, marginBottom: 16 }}>Next.js RSC 实验室</h1>
        <p style={{ fontSize: 18, lineHeight: 1.7, color: '#475569' }}>
          这是一个用于拆解 React Server Components（RSC）运行机理的教学项目，
          你可以循序渐进体验 Flight 数据流、服务器渲染、客户端水合与增量加载流程。
        </p>
        <div style={{ marginTop: 24 }}>
          <Link
            href="/rsc-demo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 999,
              background: '#0f172a',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            进入 RSC Demo
          </Link>
          <Link
            href="/rsc-streaming"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 999,
              background: '#1d4ed8',
              color: '#fff',
              fontWeight: 600,
              marginLeft: 12,
            }}
          >
            体验 Streaming Suspense
          </Link>
          <Link
            href="/rsc-actions"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 999,
              background: '#047857',
              color: '#fff',
              fontWeight: 600,
              marginLeft: 12,
            }}
          >
            实验 Server Actions
          </Link>
        </div>
        <div style={{ marginTop: 16 }}>
          <Link
            href="/rsc-flight-viewer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 999,
              background: '#7c3aed',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Flight 数据可视化
          </Link>
          <Link
            href="/rsc-performance"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 999,
              background: '#dc2626',
              color: '#fff',
              fontWeight: 600,
              marginLeft: 12,
            }}
          >
            性能监控
          </Link>
          <Link
            href="/rsc-edge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 999,
              background: '#0ea5e9',
              color: '#fff',
              fontWeight: 600,
              marginLeft: 12,
            }}
          >
            Edge Runtime
          </Link>
          <Link
            href="/rsc-ppr"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 999,
              background: '#f97316',
              color: '#fff',
              fontWeight: 600,
              marginLeft: 12,
            }}
          >
            Partial Prerender
          </Link>
        </div>
      </section>
      <section
        style={{
          maxWidth: 840,
          margin: '0 auto',
          color: '#1f2937',
          fontSize: 16,
          lineHeight: 1.7,
        }}
      >
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>快速导览</h2>
        <ul style={{ paddingLeft: 20, listStyle: 'disc' }}>
          <li>观察服务器组件的执行日志与数据抓取</li>
          <li>分析 Flight 数据包内的模块引用与 Props 编码</li>
          <li>验证客户端组件的水合与增量加载</li>
          <li>体验 Suspense 流式输出与客户端水合时间标记</li>
          <li>提交 Server Action，分析 Flight 回传与路径重新验证</li>
          <li>使用 Flight 可视化工具解析和查看 Flight 数据包结构</li>
          <li>监控 RSC 渲染性能指标，包括 FCP、水合时间等</li>
          <li>对比 Edge Runtime 与 Node Runtime 的执行上下文和日志差异</li>
          <li>体验 Partial Prerendering，将静态缓存与动态实时内容组合</li>
        </ul>
      </section>
    </main>
  )
}
