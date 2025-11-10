'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PerformanceMetrics {
  navigationStart: number
  domContentLoaded: number
  loadComplete: number
  hydrationStart?: number
  hydrationEnd?: number
  firstPaint?: number
  firstContentfulPaint?: number
  timeToInteractive?: number
}

export default function PerformanceMonitorClient() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // 标记水合开始
    const hydrationStart = performance.now()

    // 等待一个 tick 确保 React 完成初始渲染
    requestAnimationFrame(() => {
      const hydrationEnd = performance.now()
      setIsHydrated(true)

      // 收集性能指标
      const perfData = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming

      const paintEntries = performance.getEntriesByType('paint')
      const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
      const fp = paintEntries.find((entry) => entry.name === 'first-paint')

      // 计算 TTI（简化版：使用 load 事件作为近似值）
      const loadEventEnd = perfData?.loadEventEnd || 0
      const navigationStart = perfData?.fetchStart || 0

      setMetrics({
        navigationStart,
        domContentLoaded: (perfData?.domContentLoadedEventEnd || 0) - navigationStart,
        loadComplete: loadEventEnd - navigationStart,
        hydrationStart: hydrationStart - navigationStart,
        hydrationEnd: hydrationEnd - navigationStart,
        firstPaint: fp ? fp.startTime : undefined,
        firstContentfulPaint: fcp ? fcp.startTime : undefined,
        timeToInteractive: loadEventEnd - navigationStart,
      })
    })
  }, [])

  function formatTime(ms?: number): string {
    if (ms === undefined) return 'N/A'
    return `${ms.toFixed(2)} ms`
  }

  function getMetricColor(
    value: number | undefined,
    threshold: number,
  ): string {
    if (value === undefined) return '#64748b'
    if (value < threshold) return '#059669'
    if (value < threshold * 1.5) return '#d97706'
    return '#dc2626'
  }

  return (
    <div>
      <section
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>实时性能指标</h2>

        {!isHydrated && (
          <div style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>
            正在收集性能数据...
          </div>
        )}

        {metrics && (
          <div style={{ display: 'grid', gap: 16 }}>
            <MetricCard
              label="首次内容绘制 (FCP)"
              value={formatTime(metrics.firstContentfulPaint)}
              color={getMetricColor(metrics.firstContentfulPaint, 1800)}
              description="浏览器首次渲染文本、图片等内容的时刻"
            />
            <MetricCard
              label="首次绘制 (FP)"
              value={formatTime(metrics.firstPaint)}
              color={getMetricColor(metrics.firstPaint, 1800)}
              description="浏览器首次在屏幕上绘制像素的时刻"
            />
            <MetricCard
              label="DOM 内容加载完成"
              value={formatTime(metrics.domContentLoaded)}
              color={getMetricColor(metrics.domContentLoaded, 2000)}
              description="HTML 文档完全加载和解析完成的时间"
            />
            <MetricCard
              label="页面完全加载"
              value={formatTime(metrics.loadComplete)}
              color={getMetricColor(metrics.loadComplete, 3000)}
              description="所有资源（图片、样式表等）加载完成的时间"
            />
            {metrics.hydrationStart !== undefined && (
              <>
                <MetricCard
                  label="水合开始时间"
                  value={formatTime(metrics.hydrationStart)}
                  color="#7c3aed"
                  description="React 开始将事件处理器附加到 DOM 节点的时刻"
                />
                <MetricCard
                  label="水合完成时间"
                  value={formatTime(metrics.hydrationEnd)}
                  color={getMetricColor(
                    metrics.hydrationEnd && metrics.hydrationStart
                      ? metrics.hydrationEnd - metrics.hydrationStart
                      : undefined,
                    100,
                  )}
                  description="React 完成客户端水合，页面可交互的时刻"
                />
                {metrics.hydrationEnd !== undefined &&
                  metrics.hydrationStart !== undefined && (
                    <MetricCard
                      label="水合耗时"
                      value={formatTime(
                        metrics.hydrationEnd - metrics.hydrationStart,
                      )}
                      color={getMetricColor(
                        metrics.hydrationEnd - metrics.hydrationStart,
                        100,
                      )}
                      description="从开始水合到完成水合的总耗时"
                    />
                  )}
              </>
            )}
            <MetricCard
              label="可交互时间 (TTI)"
              value={formatTime(metrics.timeToInteractive)}
              color={getMetricColor(metrics.timeToInteractive, 3800)}
              description="页面完全可交互的时间（简化计算）"
            />
          </div>
        )}
      </section>

      <section
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>性能优化建议</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: '#475569' }}>
          <li>
            <strong>FCP &lt; 1.8s：</strong> 良好的首屏体验，服务器组件已提前渲染 HTML
          </li>
          <li>
            <strong>水合耗时 &lt; 100ms：</strong> 客户端组件加载迅速，Flight 数据解析高效
          </li>
          <li>
            <strong>TTI &lt; 3.8s：</strong> 页面可快速交互，用户体验流畅
          </li>
          <li>
            使用 <code>cache: 'no-store'</code> 会增加服务器渲染时间，生产环境应合理使用缓存策略
          </li>
          <li>
            减少客户端组件数量可以降低水合时间，优先使用 Server Components
          </li>
        </ul>
      </section>

      <section
        style={{
          background: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>🔍 深入分析</h3>
        <p style={{ color: '#78350f', marginBottom: 12, lineHeight: 1.7 }}>
          打开 Chrome DevTools → Performance 面板，录制页面加载过程，可以更详细地分析：
        </p>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: '#78350f' }}>
          <li>服务器渲染的 HTML 到达时间</li>
          <li>Flight 数据包的传输和解析时间</li>
          <li>客户端 JS chunk 的下载和执行时间</li>
          <li>React 水合过程的详细时间线</li>
        </ul>
        <div style={{ marginTop: 16 }}>
          <Link
            href="/rsc-demo"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: '#0f172a',
              color: '#fff',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            前往 RSC Demo 页面测试
          </Link>
        </div>
      </section>
    </div>
  )
}

function MetricCard({
  label,
  value,
  color,
  description,
}: {
  label: string
  value: string
  color: string
  description: string
}) {
  return (
    <div
      style={{
        padding: 16,
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: 13, color: '#64748b' }}>{description}</div>
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color,
            fontFamily: 'monospace',
          }}
        >
          {value}
        </div>
      </div>
    </div>
  )
}

