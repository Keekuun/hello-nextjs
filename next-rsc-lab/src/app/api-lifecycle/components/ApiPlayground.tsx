'use client'

import { useCallback, useMemo, useState } from 'react'

type LogEntry = {
  id: string
  label: string
  status: number | string
  body: string
}

const endpoints = [
  {
    key: 'echo',
    label: 'POST /api-lifecycle/api/echo',
    method: 'POST',
    description: '回显请求头、Cookies、Body，并展示响应缓存策略。',
    path: '/api-lifecycle/api/echo',
    payload: () => ({
      message: 'Hello from API Playground',
      sentAt: new Date().toISOString(),
    }),
  },
  {
    key: 'stream',
    label: 'GET /api-lifecycle/api/stream',
    method: 'GET',
    description: '通过 ReadableStream 逐步返回 Flight 片段风格的数据块。',
    path: '/api-lifecycle/api/stream',
  },
]

export default function ApiPlayground() {
  const [isPending, setIsPending] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])

  const appendLog = useCallback((entry: Omit<LogEntry, 'id'>) => {
    setLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        ...entry,
      },
      ...prev.slice(0, 4),
    ])
  }, [])

  const handleEcho = useCallback(async () => {
    const endpoint = endpoints[0]
    setIsPending(true)
    try {
      const body = endpoint.payload?.()
      const res = await fetch(endpoint.path, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'x-demo-client': 'api-playground',
        },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      appendLog({
        label: endpoint.label,
        status: res.status,
        body: JSON.stringify(json, null, 2),
      })
    } catch (error) {
      appendLog({
        label: endpoint.label,
        status: 'error',
        body:
          error instanceof Error
            ? error.message
            : 'Unknown error while calling echo API。',
      })
    } finally {
      setIsPending(false)
    }
  }, [appendLog])

  const handleStream = useCallback(async () => {
    const endpoint = endpoints[1]
    setIsPending(true)
    try {
      const res = await fetch(endpoint.path, {
        method: endpoint.method,
      })
      const reader = res.body?.getReader()
      if (!reader) {
        appendLog({
          label: endpoint.label,
          status: res.status,
          body: '响应没有 body，可查看网络面板验证。',
        })
        return
      }

      const decoder = new TextDecoder()
      let aggregated = ''
      let done = false

      while (!done) {
        const result = await reader.read()
        done = result.done ?? false
        if (result.value) {
          aggregated += decoder.decode(result.value, { stream: !done })
        }
      }

      appendLog({
        label: endpoint.label,
        status: res.status,
        body: aggregated || '(空响应)',
      })
    } catch (error) {
      appendLog({
        label: endpoint.label,
        status: 'error',
        body:
          error instanceof Error
            ? error.message
            : 'Unknown error while calling stream API。',
      })
    } finally {
      setIsPending(false)
    }
  }, [appendLog])

  const actions = useMemo(
    () => [
      {
        key: 'echo',
        label: '调用 Echo 接口',
        description: endpoints[0].description,
        handler: handleEcho,
      },
      {
        key: 'stream',
        label: '调用 Stream 接口',
        description: endpoints[1].description,
        handler: handleStream,
      },
    ],
    [handleEcho, handleStream],
  )

  return (
    <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6">
      <header>
        <h2 className="m-0 text-xl font-semibold">API Playground</h2>
        <p className="mt-2 leading-relaxed text-slate-600">
          这里可以实时调用 Route Handler，观察请求上下文与响应流。
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={action.handler}
            disabled={isPending}
            className={`rounded-xl border border-slate-300/35 bg-blue-50 p-4 text-left font-semibold text-slate-900 transition-all ${
              isPending
                ? 'cursor-not-allowed bg-slate-200/20'
                : 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/18'
            }`}
          >
            <div className="mb-1.5 text-[15px]">{action.label}</div>
            <div className="text-sm leading-relaxed text-slate-600">
              {action.description}
            </div>
          </button>
        ))}
      </div>

      <section className="grid gap-3 rounded-xl border border-slate-300/35 bg-slate-50 p-4">
        <h3 className="m-0 text-base font-semibold">最近日志</h3>
        {logs.length === 0 ? (
          <p className="m-0 text-slate-400">
            尚未触发任何接口，点击上方按钮开始。
          </p>
        ) : (
          <ul className="m-0 grid list-none gap-3 p-0">
            {logs.map((log) => (
              <li
                key={log.id}
                className="rounded-lg border border-slate-300/35 bg-white p-3"
              >
                <div className="mb-2 flex items-center justify-between text-[13px]">
                  <span className="text-sky-700">{log.label}</span>
                  <span
                    className={`font-semibold ${
                      log.status === 'error'
                        ? 'text-red-600'
                        : Number(log.status) >= 400
                          ? 'text-orange-600'
                          : 'text-emerald-600'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
                <pre className="m-0 break-words whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-800">
                  {log.body}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}

