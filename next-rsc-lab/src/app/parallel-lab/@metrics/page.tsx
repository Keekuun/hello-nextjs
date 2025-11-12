import { cache } from 'react'

type Metric = {
  id: string
  label: string
  value: number
  unit: string
}

const fetchMetrics = cache(async (): Promise<Metric[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const now = Date.now()
  return [
    {
      id: 'fcp',
      label: 'FCP',
      value: Number((Math.random() * 1800 + 1200).toFixed(0)),
      unit: 'ms',
    },
    {
      id: 'tti',
      label: 'TTI',
      value: Number((Math.random() * 2200 + 2400).toFixed(0)),
      unit: 'ms',
    },
    {
      id: 'flight',
      label: 'Flight Payload',
      value: Number((Math.random() * 18 + 12).toFixed(1)),
      unit: 'KB',
    },
    {
      id: 'hydration',
      label: 'Hydration',
      value: Number((Math.random() * 120 + 80).toFixed(0)),
      unit: 'ms',
    },
    {
      id: 'timestamp',
      label: '刷新时间',
      value: now,
      unit: '',
    },
  ]
})

export default async function MetricsPanel() {
  const metrics = await fetchMetrics()

  return (
    <article>
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">性能指标（缓存 60s）</h2>
        <p className="text-sm text-slate-600">
          使用 <code className="rounded bg-slate-200 px-1 py-0.5">cache()</code> 包裹数据获取函数，演示多个并行区域共享缓存结果。
        </p>
      </header>

      <ul className="grid gap-3">
        {metrics.map((metric) => (
          <li
            key={metric.id}
            className="flex items-center justify-between rounded-lg border border-sky-200 bg-white px-4 py-3"
          >
            <span className="text-sm font-medium text-slate-700">{metric.label}</span>
            {metric.id === 'timestamp' ? (
              <span className="text-xs text-slate-500">
                {new Date(metric.value).toLocaleTimeString()}
              </span>
            ) : (
              <span className="font-mono text-base font-semibold text-sky-700">
                {metric.value}
                <span className="ml-1 text-xs text-slate-500">{metric.unit}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </article>
  )
}


