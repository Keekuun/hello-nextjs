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
        <span style={{ color: '#059669', fontFamily: 'monospace' }}>
          "{node}"
        </span>
      )
    }

    if (!node || typeof node !== 'object') {
      return (
        <span style={{ color: '#64748b', fontFamily: 'monospace' }}>
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
            <div key={idx} style={{ marginBottom: 8 }}>
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
          style={{
            marginLeft: indent,
            marginBottom: 8,
            padding: '8px 12px',
            background: depth === 0 ? '#fff' : '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span
              style={{
                color: '#7c3aed',
                fontWeight: 600,
                fontFamily: 'monospace',
                fontSize: 14,
              }}
            >
              {String(type)}
            </span>
            {key && (
              <span style={{ color: '#64748b', fontSize: 12 }}>key: {String(key)}</span>
            )}
            {typeof props === 'object' && props !== null && Object.keys(props).length > 0 && (
              <span style={{ color: '#dc2626', fontSize: 12 }}>
                props: {Object.keys(props).length} 个
              </span>
            )}
            {typeof type === 'string' && type.includes('Client') && (
              <span
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                客户端组件
              </span>
            )}
          </div>

          {typeof props === 'object' && props !== null && (
            <details style={{ marginTop: 8, marginLeft: 20 }}>
              <summary
                style={{
                  cursor: 'pointer',
                  color: '#475569',
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                查看 Props
              </summary>
              <pre
                style={{
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: 12,
                  borderRadius: 6,
                  fontSize: 12,
                  overflow: 'auto',
                  marginTop: 8,
                }}
              >
                {JSON.stringify(props, null, 2)}
              </pre>
            </details>
          )}

          {children && (
            <div style={{ marginTop: 8 }}>
              {Array.isArray(children) ? (
                children.map((child, idx) => (
                  <div key={idx}>{renderFlightNode(child, depth + 1)}</div>
                ))
              ) : (
                <div style={{ marginLeft: 20, color: '#059669' }}>
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
        <pre
          style={{
            background: '#f1f5f9',
            padding: 12,
            borderRadius: 6,
            fontSize: 12,
            overflow: 'auto',
          }}
        >
          {JSON.stringify(node, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div>
      <section
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h3 style={{ fontSize: 18, marginBottom: 12 }}>输入 Flight 数据</h3>
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder='粘贴 Flight 数据（从 Network → ?__rsc 请求的 Response 中复制）'
          style={{
            width: '100%',
            minHeight: 200,
            padding: 12,
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            fontFamily: 'monospace',
            fontSize: 13,
            lineHeight: 1.6,
            resize: 'vertical',
          }}
        />
        <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
          <button
            onClick={() => parseFlightData(rawInput)}
            style={{
              padding: '10px 20px',
              background: '#0f172a',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            解析 Flight 数据
          </button>
          <button
            onClick={() => {
              setRawInput('')
              setParsedData(null)
              setError(null)
            }}
            style={{
              padding: '10px 20px',
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            清空
          </button>
        </div>
        {error && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              color: '#b91c1c',
            }}
          >
            {error}
          </div>
        )}
      </section>

      {parsedData && (
        <section
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: 24,
          }}
        >
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>解析结果</h3>
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8 }}>
            {parsedData.map((node, idx) => (
              <div key={idx}>{renderFlightNode(node)}</div>
            ))}
          </div>
        </section>
      )}

      <section
        style={{
          marginTop: 24,
          padding: 20,
          background: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: 12,
        }}
      >
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>💡 Flight 数据格式说明</h3>
        <ul style={{ paddingLeft: 20, lineHeight: 1.8, color: '#78350f' }}>
          <li>
            <code>["$", type, key, props, children]</code> 表示一个 React 元素
          </li>
          <li>
            <code>type</code> 可以是 HTML 标签（如 <code>"div"</code>）或组件名（如 <code>"ClientButton"</code>）
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

