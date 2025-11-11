import type { CachedQuote } from './data'

type Props = {
  quote: CachedQuote
}

export default function CachedQuoteSection({ quote }: Props) {
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
        <h2 style={{ fontSize: 20, margin: 0 }}>使用 `revalidateTag` 的缓存数据</h2>
        <span style={{ fontSize: 13, color: '#475569' }}>
          每次重新验证前都复用服务器缓存，请观察终端中的 `[CacheLab]` 日志和下方时间戳。
        </span>
      </header>
      <blockquote
        style={{
          margin: 0,
          padding: '16px 20px',
          borderLeft: '4px solid rgba(59,130,246,0.35)',
          background: 'rgba(59,130,246,0.06)',
          borderRadius: 12,
          color: '#1e293b',
          lineHeight: 1.7,
        }}
      >
        <p style={{ margin: 0 }}>
          “{quote.quote}”
        </p>
        <footer style={{ marginTop: 8, fontSize: 14, color: '#334155' }}>— {quote.author}</footer>
      </blockquote>
      <div style={{ fontSize: 13, color: '#475569' }}>
        <div>服务器耗时：{quote.duration} ms</div>
        <div>缓存生成时间：{quote.fetchedAt}</div>
      </div>
    </section>
  )
}
