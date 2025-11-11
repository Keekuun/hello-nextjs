import type { InsightMetrics } from './data'

type Props = {
  insight: InsightMetrics
}

export default function InsightMetricsSection({ insight }: Props) {
  return (
    <section
      style={{
        border: '1px solid rgba(148,163,184,0.3)',
        borderRadius: 16,
        padding: 20,
        background: '#ffffff',
        display: 'grid',
        gap: 12,
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h2 style={{ fontSize: 20, margin: 0 }}>使用 `unstable_cache` 的计算结果</h2>
        <span style={{ fontSize: 13, color: '#475569' }}>
          服务器通过 `unstable_cache` 缓存昂贵计算，并绑定 `insight-metrics` tag，可手动刷新。
        </span>
      </header>
      <div>
        <div style={{ fontSize: 13, color: '#1f2937', marginBottom: 6 }}>Fibonacci 采样：</div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            fontFamily: 'var(--font-geist-mono, monospace)',
            color: '#0f172a',
          }}
        >
          {insight.fibonacciSample.map((num, index) => (
            <span
              key={index}
              style={{
                padding: '4px 8px',
                borderRadius: 8,
                background: 'rgba(99,102,241,0.12)',
              }}
            >
              {num}
            </span>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 13, color: '#475569' }}>
        <div>平均值：{insight.average.toFixed(2)}</div>
        <div>生成时间：{insight.generatedAt}</div>
        <div>服务器耗时：{insight.duration} ms</div>
      </div>
    </section>
  )
}
