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
    <section className="grid grid-cols-[minmax(0,480px)_minmax(0,1fr)] items-stretch gap-5">
      <aside className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex gap-3">
          <button
            onClick={() => setIsRecording((prev) => !prev)}
            className={`flex-1 cursor-pointer rounded-lg border-0 px-4 py-2.5 font-semibold text-white transition-colors ${
              isRecording ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-400 hover:bg-slate-500'
            }`}
          >
            {isRecording ? '暂停捕获' : '恢复捕获'}
          </button>
          <button
            onClick={handleClear}
            className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-600 transition-colors hover:bg-slate-100"
          >
            清空记录
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600">
          <p className="m-0">
            捕获条数：{chunks.length} 条<br />
            最近一次捕获：
            {chunks.length > 0
              ? new Date(chunks[chunks.length - 1].capturedAt).toLocaleTimeString()
              : '暂无'}
          </p>
        </div>

        <ul className="m-0 flex max-h-[520px] list-none flex-col gap-3 overflow-auto p-0">
          {chunks.map((chunk) => (
            <li
              key={chunk.id}
              onClick={() => setSelectedChunk(chunk)}
              className={`cursor-pointer rounded-lg border border-slate-200 p-3 ${
                selectedChunk?.id === chunk.id ? 'bg-sky-100' : 'bg-white'
              }`}
            >
              <div className="mb-2 flex justify-between text-[13px] text-sky-700">
                <span>Chunk #{chunk.id}</span>
                <span>{chunk.size} bytes</span>
              </div>
              <pre className="m-0 max-h-[90px] overflow-hidden break-words whitespace-pre-wrap text-xs text-gray-800">
                {chunk.preview}
                {chunk.size > chunk.preview.length && '...'}
              </pre>
            </li>
          ))}
          {chunks.length === 0 && (
            <li className="rounded-lg bg-slate-100 p-6 text-center text-slate-400">
              暂无 Flight chunk，请前往其他页面触发 RSC 请求后回来查看。
            </li>
          )}
        </ul>
      </aside>

      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-900 p-4 text-slate-200">
        <header className="flex justify-between">
          <h2 className="m-0 text-lg font-semibold">解析结果</h2>
          {selectedChunk && (
            <span className="text-xs text-blue-200">
              捕获时间：{new Date(selectedChunk.capturedAt).toLocaleTimeString()}
            </span>
          )}
        </header>

        {!selectedChunk && (
          <p className="text-slate-400">
            在左侧选择一个 chunk，查看完整的 JSON / 对象结构。
          </p>
        )}

        {selectedChunk && parsedSelected && (
          <>
            {parsedSelected.ok ? (
              <pre className="m-0 max-h-[520px] overflow-auto break-words whitespace-pre-wrap text-[13px] leading-relaxed">
                {JSON.stringify(parsedSelected.data, null, 2)}
              </pre>
            ) : (
              <div className="rounded-lg bg-red-950 px-4 py-4 text-sm text-red-200">
                无法解析为 JSON：{parsedSelected.error}
              </div>
            )}
          </>
        )}
      </section>
    </section>
  )
}

