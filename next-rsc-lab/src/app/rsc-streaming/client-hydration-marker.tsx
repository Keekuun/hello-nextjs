'use client'

import { useEffect, useRef, useState } from 'react'

export default function ClientHydrationMarker() {
  const hydratedRef = useRef(false)
  const [mountedAt, setMountedAt] = useState<string | null>(null)

  useEffect(() => {
    const now = new Date().toISOString()
    hydratedRef.current = true
    setMountedAt(now)
    console.log('[Hydration] ClientHydrationMarker 已水合:', now)
  }, [])

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        border: '1px solid #2563eb',
        background: '#eff6ff',
        color: '#1e3a8a',
      }}
    >
      <p>客户端水合状态：{hydratedRef.current ? '已完成' : '等待中'} </p>
      <p>水合时间：{mountedAt ?? '尚未执行 useEffect'}</p>
      <button
        style={{
          marginTop: 12,
          padding: '8px 16px',
          borderRadius: 6,
          background: '#2563eb',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => {
          const clickTime = new Date().toISOString()
          console.log('[Hydration] 客户端交互触发:', clickTime)
          alert(`浏览器交互成功，时间：${clickTime}`)
        }}
      >
        验证客户端交互
      </button>
    </div>
  )
}

