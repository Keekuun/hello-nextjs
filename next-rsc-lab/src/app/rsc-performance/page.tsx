import CodePreview from '../../components/code/CodePreview'
import PerformanceMonitorClient from './performance-monitor-client'

export default function PerformancePage() {
  return (
    <div
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <header>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>RSC 性能监控</h1>
        <p style={{ color: '#64748b', marginBottom: 24, lineHeight: 1.7 }}>
          实时监控 React Server Components 的渲染性能指标，包括服务器渲染时间、Flight
          数据传输、客户端水合时间等关键指标。
        </p>
      </header>

      <PerformanceMonitorClient />

      <section
        style={{
          display: 'grid',
          gap: 18,
        }}
      >
        <h2 style={{ fontSize: 22, margin: 0 }}>关键代码预览</h2>
        <div
          style={{
            display: 'grid',
            gap: 18,
            gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
          }}
        >
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

