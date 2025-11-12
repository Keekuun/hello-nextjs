import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLabItem } from '../../data'

type ItemPageProps = {
  params: {
    id: string
  }
}

export default async function ItemPage({ params }: ItemPageProps) {
  const item = getLabItem(params.id)

  if (!item) {
    notFound()
  }

  return (
    <article className="mx-auto flex max-w-[760px] flex-col gap-4 p-6">
      <Link
        href="/intercept-lab"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 no-underline hover:text-blue-700"
      >
        ← 返回实验列表
      </Link>

      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <h1 className="mb-3 text-3xl font-bold text-slate-900">{item.title}</h1>
        <p className="leading-relaxed text-slate-600">{item.description}</p>
      </header>

      <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="mb-2 text-xl font-semibold text-blue-900">Flight 关注点</h2>
        <p className="text-sm leading-relaxed text-blue-800">{item.flightFocus}</p>
      </section>
    </article>
  )
}


