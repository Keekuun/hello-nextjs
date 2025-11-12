import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLabItem } from '../../../../data'

type ModalProps = {
  params: {
    id: string
  }
}

export default function InterceptedItemModal({ params }: ModalProps) {
  const item = getLabItem(params.id)

  if (!item) {
    notFound()
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/60 px-4 py-10 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-[620px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
          <Link
            href="/intercept-lab"
            scroll={false}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
          >
            关闭
          </Link>
        </header>

        <div className="grid gap-4 px-5 py-5">
          <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>

          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <h3 className="text-sm font-semibold text-blue-900">Flight 关注点</h3>
            <p className="mt-1 text-sm leading-relaxed text-blue-800">{item.flightFocus}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/intercept-lab/items/${item.id}`}
              className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-slate-800"
            >
              查看完整页面
            </Link>
            <Link
              href="/intercept-lab"
              scroll={false}
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-colors hover:bg-slate-100"
            >
              返回列表
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


