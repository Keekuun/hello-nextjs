'use client'

import { useActionState } from 'react'
import SubmitButton from './form-submit-button'
import { submitFeedback, type ActionState } from './actions'

const INITIAL_STATE: ActionState = {
  status: 'idle',
}

export default function FormPanel() {
  const [state, formAction] = useActionState(submitFeedback, INITIAL_STATE)

  return (
    <section
      style={{
        border: '1px solid #d1d5db',
        borderRadius: 12,
        padding: 24,
        background: '#f8fafc',
      }}
    >
      <h2>提交 Server Action 表单</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>
        这里使用原生 form + server action。提交后留意 Network →
        `?__rsc` 的响应，表单结果会封装在 Flight 数据中回到客户端。
      </p>

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span>主题</span>
          <input
            name="topic"
            placeholder="例如：Flight 数据结构"
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #cbd5f5',
              fontSize: 16,
            }}
            required
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span>内容</span>
          <textarea
            name="content"
            rows={4}
            placeholder="写下你想探究的问题或总结（至少 10 个字符）"
            minLength={10}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: '1px solid #cbd5f5',
              fontSize: 16,
            }}
            required
          />
        </label>

        <SubmitButton label="提交到 Server Action" />
      </form>

      <ActionFeedback state={state} />
    </section>
  )
}

function ActionFeedback({ state }: { state: ActionState }) {
  if (state.status === 'idle') {
    return (
      <p style={{ color: '#94a3b8', marginTop: 12 }}>
        等待提交。提交时请打开 DevTools 观察 Flight 更新。
      </p>
    )
  }

  if (state.status === 'error') {
    return (
      <p
        style={{
          color: '#b91c1c',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          padding: '12px 16px',
          borderRadius: 8,
          marginTop: 12,
        }}
      >
        {state.error}
      </p>
    )
  }

  return (
    <div
      style={{
        marginTop: 16,
        padding: '12px 16px',
        borderRadius: 8,
        background: '#ecfdf5',
        border: '1px solid #6ee7b7',
        color: '#047857',
      }}
    >
      <strong>提交成功！</strong>
      <p style={{ margin: '8px 0 0' }}>
        主题：{state.summary.topic}（ID：{state.summary.id.slice(0, 8)}）
      </p>
      <p>字数统计：{state.summary.charCount}</p>
      <p>服务器时间：{state.summary.submittedAt}</p>
    </div>
  )
}

