import { unstable_noStore as noStore } from 'next/cache'
import { getLatestHistory } from './actions'

export default async function ResultStream() {
  noStore()

  const history = await getLatestHistory()

  return (
    <section
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 24,
        background: '#fff',
      }}
    >
      <h2>最近 5 次提交（实时刷新）</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        Server Action 在处理完表单后会调用 <code>revalidatePath('/rsc-actions')</code>
        ，触发本组件重新渲染。每次刷新可观察 Flight 数据包含最新的提交列表。
      </p>

      {history.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>暂无数据，提交表单后这里会出现记录。</p>
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {history.map((item) => (
            <li
              key={item.id}
              style={{
                border: '1px solid #dbeafe',
                background: '#eff6ff',
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{item.topic}</strong>
                <span style={{ color: '#1d4ed8', fontSize: 12 }}>
                  {new Date(item.submittedAt).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ margin: '8px 0 0', color: '#1f2937' }}>
                {item.contentPreview}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
                字符数：{item.charCount} ｜ 记录 ID：{item.id.slice(0, 8)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

