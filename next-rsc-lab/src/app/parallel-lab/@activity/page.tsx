import { unstable_noStore as noStore } from 'next/cache'

type ActivityLog = {
  id: string
  type: 'flight' | 'cache' | 'action'
  message: string
  at: string
}

function generateActivity(): ActivityLog[] {
  const now = Date.now()
  const messages: ActivityLog[] = [
    {
      id: 'a1',
      type: 'flight',
      message: 'Flight chunk #52 已抵达客户端，触发 Client Component hydrate',
      at: new Date(now - 1200).toLocaleTimeString(),
    },
    {
      id: 'a2',
      type: 'cache',
      message: '调用 revalidateTag("dashboard:stats")，刷新指标缓存',
      at: new Date(now - 4200).toLocaleTimeString(),
    },
    {
      id: 'a3',
      type: 'action',
      message: 'Server Action 更新用户偏好，使用 optimistic UI 已回写',
      at: new Date(now - 6500).toLocaleTimeString(),
    },
    {
      id: 'a4',
      type: 'flight',
      message: '流式渲染补齐延迟面板，Suspense fallback 已替换',
      at: new Date(now - 9200).toLocaleTimeString(),
    },
  ]

  return messages
}

export default async function ActivityStream() {
  noStore()
  await new Promise((resolve) => setTimeout(resolve, 1400))

  const activities = generateActivity()

  return (
    <article>
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">实时活动流（不缓存）</h2>
        <p className="text-sm text-slate-600">
          该区域禁用缓存（<code className="rounded bg-slate-200 px-1 py-0.5">noStore()</code>），每次请求都会重新生成数据。
          可与其他并行区域比较加载顺序与 Suspense 行为差异。
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                  activity.type === 'flight'
                    ? 'bg-sky-100 text-sky-700'
                    : activity.type === 'cache'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {activity.type}
              </span>
              <span className="text-xs text-emerald-600">{activity.at}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{activity.message}</p>
          </li>
        ))}
      </ul>
    </article>
  )
}


