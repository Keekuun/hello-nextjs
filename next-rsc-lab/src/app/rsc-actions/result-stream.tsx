import { unstable_noStore as noStore } from 'next/cache'
import { getLatestHistory } from './actions'

export default async function ResultStream() {
  noStore()

  const history = await getLatestHistory()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-2 text-xl font-semibold">最近 5 次提交（实时刷新）</h2>
      <p className="mb-4 text-slate-500">
        Server Action 在处理完表单后会调用 <code className="rounded bg-slate-100 px-1 py-0.5">revalidatePath('/rsc-actions')</code>
        ，触发本组件重新渲染。每次刷新可观察 Flight 数据包含最新的提交列表。
      </p>

      {history.length === 0 ? (
        <p className="text-slate-400">暂无数据，提交表单后这里会出现记录。</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {history.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-blue-200 bg-blue-50 p-4"
            >
              <div className="flex justify-between">
                <strong className="text-gray-900">{item.topic}</strong>
                <span className="text-xs text-blue-700">
                  {new Date(item.submittedAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="m-0 mt-2 text-gray-800">
                {item.contentPreview}
              </p>
              <p className="m-0 mt-1 text-xs text-slate-500">
                字符数：{item.charCount} ｜ 记录 ID：{item.id.slice(0, 8)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

