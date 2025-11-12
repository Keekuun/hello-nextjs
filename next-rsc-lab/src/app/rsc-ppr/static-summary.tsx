async function fetchStaticSummary() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    console.error('[PPR] fetchStaticSummary 失败:', response.status, response.statusText)
    throw new Error('无法加载静态摘要')
  }

  const data = await response.json()

  console.log('[PPR] 静态摘要命中缓存')

  return data as { title: string; body: string }
}

export default async function StaticSummary() {
  const summary = await fetchStaticSummary()

  return (
    <section className="rounded-xl border border-green-200 bg-green-50 p-6">
      <h2 className="mb-2 text-xl font-semibold">静态摘要（可缓存）</h2>
      <p className="mt-2 text-lg font-semibold text-green-800">
        {summary.title}
      </p>
      <p className="mt-3 leading-relaxed text-gray-800">{summary.body}</p>
      <p className="m-0 mt-3 text-sm text-green-700">
        * 此段内容由构建期预渲染，并在 1 小时内复用缓存。
      </p>
    </section>
  )
}

