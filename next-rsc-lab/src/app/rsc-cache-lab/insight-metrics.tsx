import type { InsightMetrics } from './data'

type Props = {
  insight: InsightMetrics
}

export default function InsightMetricsSection({ insight }: Props) {
  return (
    <section className="grid gap-3 rounded-2xl border border-slate-300/30 bg-white p-5">
      <header className="flex flex-col gap-1">
        <h2 className="m-0 text-lg font-semibold sm:text-xl">使用 `unstable_cache` 的计算结果</h2>
        <span className="text-xs text-slate-600 sm:text-sm">
          服务器通过 `unstable_cache` 缓存昂贵计算，并绑定 `insight-metrics` tag，可手动刷新。
        </span>
      </header>
      <div>
        <div className="mb-1.5 text-sm text-gray-800">Fibonacci 采样：</div>
        <div className="flex flex-wrap gap-2 font-mono text-slate-900">
          {insight.fibonacciSample.map((num, index) => (
            <span
              key={index}
              className="rounded-lg bg-indigo-100/60 px-2 py-1"
            >
              {num}
            </span>
          ))}
        </div>
      </div>
      <div className="text-xs text-slate-600 sm:text-sm">
        <div>平均值：{insight.average.toFixed(2)}</div>
        <div>生成时间：{insight.generatedAt}</div>
        <div>服务器耗时：{insight.duration} ms</div>
      </div>
    </section>
  )
}
