import Link from 'next/link'

export default function ItemNotFound() {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col gap-4 p-6 text-center">
      <h2 className="text-2xl font-semibold text-slate-900">找不到该实验项</h2>
      <p className="text-sm leading-relaxed text-slate-600">
        可能是链接已过期或实验数据尚未同步。返回列表重新选择即可。
      </p>
      <div>
        <Link
          href="/intercept-lab"
          className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          返回 Intercepting Routes 实验
        </Link>
      </div>
    </div>
  )
}


