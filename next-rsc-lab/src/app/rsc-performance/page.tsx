import PerformanceMonitorClient from './performance-monitor-client'

export default function PerformancePage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>RSC 性能监控</h1>
      <p style={{ color: '#64748b', marginBottom: 24, lineHeight: 1.7 }}>
        实时监控 React Server Components 的渲染性能指标，包括服务器渲染时间、Flight
        数据传输、客户端水合时间等关键指标。
      </p>

      <PerformanceMonitorClient />
    </div>
  )
}

