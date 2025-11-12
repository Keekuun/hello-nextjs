import type { CachedQuote } from './data'

type Props = {
  quote: CachedQuote
}

export default function CachedQuoteSection({ quote }: Props) {
  return (
    <section className="grid gap-3 rounded-2xl border border-slate-300/30 bg-white p-5">
      <header className="flex flex-col gap-1">
        <h2 className="m-0 text-lg font-semibold sm:text-xl">使用 `revalidateTag` 的缓存数据</h2>
        <span className="text-xs text-slate-600 sm:text-sm">
          每次重新验证前都复用服务器缓存，请观察终端中的 `[CacheLab]` 日志和下方时间戳。
        </span>
      </header>
      <blockquote className="m-0 rounded-xl border-l-4 border-blue-400/35 bg-blue-50/60 p-4 leading-relaxed text-slate-800">
        <p className="m-0">
          "{quote.quote}"
        </p>
        <footer className="mt-2 text-sm text-slate-700">— {quote.author}</footer>
      </blockquote>
      <div className="text-xs text-slate-600 sm:text-sm">
        <div>服务器耗时：{quote.duration} ms</div>
        <div>缓存生成时间：{quote.fetchedAt}</div>
      </div>
    </section>
  )
}
