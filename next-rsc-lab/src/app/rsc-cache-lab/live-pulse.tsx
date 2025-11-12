type Props = {
  pulse: {
    serverNow: string
    randomSeed: string
    duration: number
  }
}

export default function LivePulseSection({ pulse }: Props) {
  return (
    <section className="grid gap-2.5 rounded-2xl border border-dashed border-slate-400/60 bg-slate-900/5 p-5">
      <header className="flex flex-col gap-1">
        <h3 className="m-0 text-base font-semibold sm:text-lg">实时脉冲（不使用缓存）</h3>
        <span className="text-xs text-slate-600 sm:text-sm">
          每次请求都重新计算，用于对比缓存组件与 `cache: 'no-store'` 数据的差异。
        </span>
      </header>
      <div className="text-sm text-gray-800">
        <div>服务器当前时间：{pulse.serverNow}</div>
        <div>随机种子：{pulse.randomSeed}</div>
        <div>服务器耗时：{pulse.duration} ms</div>
      </div>
    </section>
  )
}
