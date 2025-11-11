type Props = {
  pulse: {
    serverNow: string
    randomSeed: string
    duration: number
  }
}

export default function LivePulseSection({ pulse }: Props) {
  return (
    <section
      style={{
        border: '1px dashed rgba(148,163,184,0.6)',
        borderRadius: 16,
        padding: 20,
        background: 'rgba(15,23,42,0.05)',
        display: 'grid',
        gap: 10,
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h3 style={{ fontSize: 18, margin: 0 }}>实时脉冲（不使用缓存）</h3>
        <span style={{ fontSize: 13, color: '#475569' }}>
          每次请求都重新计算，用于对比缓存组件与 `cache: 'no-store'` 数据的差异。
        </span>
      </header>
      <div style={{ fontSize: 13, color: '#1f2937' }}>
        <div>服务器当前时间：{pulse.serverNow}</div>
        <div>随机种子：{pulse.randomSeed}</div>
        <div>服务器耗时：{pulse.duration} ms</div>
      </div>
    </section>
  )
}
