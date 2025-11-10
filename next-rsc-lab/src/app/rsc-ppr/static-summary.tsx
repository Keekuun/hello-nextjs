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
    <section
      style={{
        border: '1px solid #bbf7d0',
        borderRadius: 12,
        padding: 24,
        background: '#f0fdf4',
      }}
    >
      <h2>静态摘要（可缓存）</h2>
      <p style={{ color: '#166534', marginTop: 8, fontSize: 18, fontWeight: 600 }}>
        {summary.title}
      </p>
      <p style={{ color: '#1f2937', marginTop: 12, lineHeight: 1.7 }}>{summary.body}</p>
      <p style={{ marginTop: 12, fontSize: 13, color: '#16a34a' }}>
        * 此段内容由构建期预渲染，并在 1 小时内复用缓存。
      </p>
    </section>
  )
}

