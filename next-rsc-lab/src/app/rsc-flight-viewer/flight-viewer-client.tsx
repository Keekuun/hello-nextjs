'use client'

import { useState } from 'react'

interface FlightNode {
  type: string
  props?: Record<string, unknown>
  children?: FlightNode[] | string
  clientReference?: string
}

export default function FlightViewerClient() {
  const [rawInput, setRawInput] = useState('')
  const [parsedData, setParsedData] = useState<FlightNode[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  function parseFlightData(input: string) {
    try {
      setError(null)

      // 移除 Flight 数据的前缀（如果有）
      let cleaned = input.trim()
      if (cleaned.startsWith(")]}'")) {
        cleaned = cleaned.slice(4)
      }

      // 尝试解析 JSON
      const parsed = JSON.parse(cleaned)

      // Flight 数据通常是一个数组，第一个元素是组件树
      if (Array.isArray(parsed) && parsed.length > 0) {
        const tree = parsed[0]
        setParsedData([tree])
      } else {
        setParsedData([parsed])
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? `解析失败：${err.message}`
          : '解析失败：未知错误',
      )
      setParsedData(null)
    }
  }

  function renderFlightNode(node: FlightNode, depth = 0): React.ReactNode {
    if (typeof node === 'string') {
      return (
        <span className="font-mono text-emerald-600">
          "{node}"
        </span>
      )
    }

    if (!node || typeof node !== 'object') {
      return (
        <span className="font-mono text-slate-500">
          {String(node)}
        </span>
      )
    }

    const indent = depth * 20
    const isArray = Array.isArray(node)

    if (isArray && node.length > 0) {
      return (
        <div style={{ marginLeft: indent }}>
          {node.map((item, idx) => (
            <div key={idx} className="mb-2">
              {renderFlightNode(item, depth + 1)}
            </div>
          ))}
        </div>
      )
    }

    // 处理 Flight 节点格式：["$", type, key, props, children]
    if (Array.isArray(node) && node[0] === '$') {
      const [, type, key, props, children] = node

      return (
        <div
          style={{ marginLeft: indent }}
          className={`mb-2 rounded-md border border-slate-200 px-3 py-2 ${
            depth === 0 ? 'bg-white' : 'bg-slate-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="font-mono text-sm font-semibold text-purple-600">
              {String(type)}
            </span>
            {key && (
              <span className="text-xs text-slate-500">key: {String(key)}</span>
            )}
            {typeof props === 'object' && props !== null && Object.keys(props).length > 0 && (
              <span className="text-xs text-red-600">
                props: {Object.keys(props).length} 个
              </span>
            )}
            {typeof type === 'string' && type.includes('Client') && (
              <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                客户端组件
              </span>
            )}
          </div>

          {typeof props === 'object' && props !== null && (
            <details className="ml-5 mt-2">
              <summary className="mb-1 cursor-pointer text-[13px] text-slate-600">
                查看 Props
              </summary>
              <pre className="mt-2 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-200">
                {JSON.stringify(props, null, 2)}
              </pre>
            </details>
          )}

          {children && (
            <div className="mt-2">
              {Array.isArray(children) ? (
                children.map((child, idx) => (
                  <div key={idx}>{renderFlightNode(child, depth + 1)}</div>
                ))
              ) : (
                <div className="ml-5 text-emerald-600">
                  {String(children)}
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    // 普通对象
    return (
      <div style={{ marginLeft: indent }}>
        <pre className="overflow-auto rounded-md bg-slate-100 p-3 text-xs">
          {JSON.stringify(node, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div>
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-3 text-lg font-semibold">输入 Flight 数据</h3>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder='粘贴 Flight 数据（从 Network → ?__rsc 请求的 Response 中复制）'
          className="min-h-[200px] w-full resize-y rounded-lg border border-slate-300 px-3 py-3 font-mono text-[13px] leading-relaxed"
        />
        <div className="mt-3 flex gap-3">
          <button
            onClick={() => parseFlightData(rawInput)}
            className="cursor-pointer rounded-lg border-0 bg-slate-900 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-slate-800"
          >
            解析 Flight 数据
          </button>
          <button
            onClick={() => {
              setRawInput('')
              setParsedData(null)
              setError(null)
            }}
            className="cursor-pointer rounded-lg border border-slate-300 bg-slate-100 px-5 py-2.5 text-slate-600 transition-colors hover:bg-slate-200"
          >
            清空
          </button>
        </div>
        {error && (
          <div className="mt-3 rounded-lg border border-red-300 bg-red-100 px-3 py-3 text-red-700">
            {error}
          </div>
        )}
      </section>

      {parsedData && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">解析结果</h3>
          <div className="rounded-lg bg-slate-50 p-4">
            {parsedData.map((node, idx) => (
              <div key={idx}>{renderFlightNode(node)}</div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="mb-2 text-base font-semibold">💡 Flight 数据格式说明</h3>
        <ul className="list-inside list-disc space-y-1 pl-5 leading-relaxed text-amber-900">
          <li>
            <code className="rounded bg-amber-100 px-1 py-0.5">["$", type, key, props, children]</code> 表示一个 React 元素
          </li>
          <li>
            <code className="rounded bg-amber-100 px-1 py-0.5">type</code> 可以是 HTML 标签（如 <code className="rounded bg-amber-100 px-1 py-0.5">"div"</code>）或组件名（如 <code className="rounded bg-amber-100 px-1 py-0.5">"ClientButton"</code>）
          </li>
          <li>
            客户端组件会被标记，并在 Flight 数据中包含模块引用路径
          </li>
          <li>
            Props 会被序列化，但函数、Symbol 等不可序列化的值会被特殊处理
          </li>
        </ul>
      </section>
    </div>
  )
}

