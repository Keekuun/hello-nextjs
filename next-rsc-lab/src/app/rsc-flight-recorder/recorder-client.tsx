'use client'

import { useEffect, useMemo, useState } from 'react'

type FlightChunk = {
  id: number
  capturedAt: string
  size: number
  preview: string
  raw: unknown
}

type ParsedTree = {
  ok: boolean
  data?: unknown
  error?: string
}

export default function FlightRecorderClient() {
  const [chunks, setChunks] = useState<FlightChunk[]>([])
  const [isRecording, setIsRecording] = useState(true)
  const [selectedChunk, setSelectedChunk] = useState<FlightChunk | null>(null)

  useEffect(() => {
    if (!isRecording) {
      return
    }

    let poller: number | undefined
    let lastLength = 0

    const readFlightQueue = () => {
      const flightQueue = (window as typeof window & { __next_f?: unknown[] })
        .__next_f

      if (!Array.isArray(flightQueue)) {
        return
      }

      if (flightQueue.length === lastLength) {
        return
      }

      const newItems = flightQueue.slice(lastLength)
      lastLength = flightQueue.length

      setChunks((prev) => [
        ...prev,
        ...newItems.map((raw, index) => {
          const stringified =
            typeof raw === 'string' ? raw : JSON.stringify(raw)
          return {
            id: prev.length + index + 1,
            capturedAt: new Date().toISOString(),
            size: stringified.length,
            preview: stringified.slice(0, 160),
            raw,
          }
        }),
      ])
    }

    poller = window.setInterval(readFlightQueue, 800)
    readFlightQueue()

    return () => {
      if (poller) {
        clearInterval(poller)
      }
    }
  }, [isRecording])

  const parsedSelected: ParsedTree | null = useMemo(() => {
    if (!selectedChunk) return null
    try {
      const raw = selectedChunk.raw
      if (typeof raw === 'string') {
        const cleaned = raw.startsWith(")]}'") ? raw.slice(4) : raw
        return {
          ok: true,
          data: JSON.parse(cleaned),
        }
      }
      return {
        ok: true,
        data: raw,
      }
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : '解析失败，可能不是 JSON 格式的 chunk。',
      }
    }
  }, [selectedChunk])

  function handleClear() {
    setChunks([])
    setSelectedChunk(null)
  }

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 480px) minmax(0, 1fr)',
        gap: 20,
        alignItems: 'stretch',
      }}
    >
      <aside
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          background: '#fff',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setIsRecording((prev) => !prev)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: isRecording ? '#22c55e' : '#94a3b8',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isRecording ? '暂停捕获' : '恢复捕获'}
          </button>
          <button
            onClick={handleClear}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            清空记录
          </button>
        </div>

        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            background: '#f8fafc',
            padding: 12,
            fontSize: 14,
            color: '#475569',
          }}
        >
          <p style={{ margin: 0 }}>
            捕获条数：{chunks.length} 条<br />
            最近一次捕获：
            {chunks.length > 0
              ? new Date(chunks[chunks.length - 1].capturedAt).toLocaleTimeString()
              : '暂无'}
          </p>
        </div>

        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            maxHeight: 520,
            overflow: 'auto',
          }}
        >
          {chunks.map((chunk) => (
            <li
              key={chunk.id}
              onClick={() => setSelectedChunk(chunk)}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: 12,
                background:
                  selectedChunk?.id === chunk.id ? '#e0f2fe' : '#fff',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: '#0369a1',
                  marginBottom: 8,
                }}
              >
                <span>Chunk #{chunk.id}</span>
                <span>{chunk.size} bytes</span>
              </div>
              <pre
                style={{
                  margin: 0,
                  fontSize: 12,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: '#334155',
                  maxHeight: 90,
                  overflow: 'hidden',
                }}
              >
                {chunk.preview}
                {chunk.size > chunk.preview.length && '...'}
              </pre>
            </li>
          ))}
          {chunks.length === 0 && (
            <li
              style={{
                padding: 24,
                borderRadius: 10,
                background: '#f1f5f9',
                textAlign: 'center',
                color: '#94a3b8',
              }}
            >
              暂无 Flight chunk，请前往其他页面触发 RSC 请求后回来查看。
            </li>
          )}
        </ul>
      </aside>

      <section
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          background: '#0f172a',
          color: '#e2e8f0',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>解析结果</h2>
          {selectedChunk && (
            <span style={{ fontSize: 12, color: '#cbd5f5' }}>
              捕获时间：{new Date(selectedChunk.capturedAt).toLocaleTimeString()}
            </span>
          )}
        </header>

        {!selectedChunk && (
          <p style={{ color: '#94a3b8' }}>
            在左侧选择一个 chunk，查看完整的 JSON / 对象结构。
          </p>
        )}

        {selectedChunk && parsedSelected && (
          <>
            {parsedSelected.ok ? (
              <pre
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  overflow: 'auto',
                  maxHeight: 520,
                }}
              >
                {JSON.stringify(parsedSelected.data, null, 2)}
              </pre>
            ) : (
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: '#7f1d1d',
                  color: '#fee2e2',
                  fontSize: 14,
                }}
              >
                无法解析为 JSON：{parsedSelected.error}
              </div>
            )}
          </>
        )}
      </section>
    </section>
  )
}

