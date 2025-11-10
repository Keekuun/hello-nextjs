'use client'

import { useEffect, useState } from 'react'

export default function ClientEdgeMarker() {
  const [hydratedAt, setHydratedAt] = useState<string>('')
  const [userAgent, setUserAgent] = useState<string>('')

  useEffect(() => {
    const now = new Date().toISOString()
    setHydratedAt(now)
    setUserAgent(navigator.userAgent)
    console.log('[Edge Runtime] ClientEdgeMarker 水合完成时间:', now)
  }, [])

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: '#fef3c7',
        border: '1px solid #facc15',
      }}
    >
      <p>客户端水合时间：{hydratedAt || '等待中...'}</p>
      <p style={{ fontSize: 12, color: '#92400e', marginTop: 8 }}>
        User Agent：{userAgent || '获取中...'}
      </p>
      <button
        style={{
          marginTop: 12,
          padding: '8px 16px',
          borderRadius: 6,
          background: '#f97316',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={() => {
          const clickTime = new Date().toISOString()
          console.log('[Edge Runtime] 客户端交互触发时间:', clickTime)
          alert(`Edge 页面客户端交互成功：${clickTime}`)
        }}
      >
        验证 Edge 页面交互
      </button>
    </div>
  )
}

