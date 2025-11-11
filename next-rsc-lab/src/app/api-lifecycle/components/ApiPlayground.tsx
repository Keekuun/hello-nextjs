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
    <section
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: 24,
        background: '#ffffff',
        display: 'grid',
        gap: 20,
      }}
    >
      <header>
        <h2 style={{ fontSize: 20, margin: 0 }}>API Playground</h2>
        <p style={{ marginTop: 8, color: '#475569', lineHeight: 1.7 }}>
          这里可以实时调用 Route Handler，观察请求上下文与响应流。
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
        }}
      >
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={action.handler}
            disabled={isPending}
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid rgba(148,163,184,0.35)',
              background: isPending
                ? 'rgba(148,163,184,0.2)'
                : 'rgba(37,99,235,0.08)',
              color: '#0f172a',
              fontWeight: 600,
              textAlign: 'left',
              cursor: isPending ? 'not-allowed' : 'pointer',
              transition: 'transform 0.16s ease, box-shadow 0.16s ease',
            }}
          >
            <div style={{ fontSize: 15, marginBottom: 6 }}>{action.label}</div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              {action.description}
            </div>
          </button>
        ))}
      </div>

      <section
        style={{
          border: '1px solid rgba(148,163,184,0.35)',
          borderRadius: 12,
          padding: 16,
          background: '#f8fafc',
          display: 'grid',
          gap: 12,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16 }}>最近日志</h3>
        {logs.length === 0 ? (
          <p style={{ margin: 0, color: '#94a3b8' }}>
            尚未触发任何接口，点击上方按钮开始。
          </p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gap: 12,
            }}
          >
            {logs.map((log) => (
              <li
                key={log.id}
                style={{
                  border: '1px solid rgba(148,163,184,0.35)',
                  borderRadius: 10,
                  padding: 12,
                  background: '#ffffff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 13,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: '#0369a1' }}>{log.label}</span>
                  <span
                    style={{
                      color:
                        log.status === 'error'
                          ? '#dc2626'
                          : Number(log.status) >= 400
                            ? '#f97316'
                            : '#059669',
                      fontWeight: 600,
                    }}
                  >
                    {log.status}
                  </span>
                </div>
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily:
                      '"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace',
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: '#1f2937',
                  }}
                >
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

