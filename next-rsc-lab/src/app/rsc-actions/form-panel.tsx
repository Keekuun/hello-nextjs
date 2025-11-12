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
    <section className="rounded-xl border border-gray-300 bg-slate-50 p-6">
      <h2 className="mb-2 text-xl font-semibold">提交 Server Action 表单</h2>
      <p className="mb-4 text-slate-500">
        这里使用原生 form + server action。提交后留意 Network →
        `?__rsc` 的响应，表单结果会封装在 Flight 数据中回到客户端。
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">主题</span>
          <input
            name="topic"
            placeholder="例如：Flight 数据结构"
            className="rounded-lg border border-blue-200 px-3.5 py-2.5 text-base"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700">内容</span>
          <textarea
            name="content"
            rows={4}
            placeholder="写下你想探究的问题或总结（至少 10 个字符）"
            minLength={10}
            className="rounded-lg border border-blue-200 px-3.5 py-3 text-base"
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
      <p className="mt-3 text-slate-400">
        等待提交。提交时请打开 DevTools 观察 Flight 更新。
      </p>
    )
  }

  if (state.status === 'error') {
    return (
      <p className="mt-3 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-700">
        {state.error}
      </p>
    )
  }

  return (
    <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-800">
      <strong>提交成功！</strong>
      <p className="m-0 mt-2">
        主题：{state.summary.topic}（ID：{state.summary.id.slice(0, 8)}）
      </p>
      <p className="m-0">字数统计：{state.summary.charCount}</p>
      <p className="m-0">服务器时间：{state.summary.submittedAt}</p>
    </div>
  )
}

