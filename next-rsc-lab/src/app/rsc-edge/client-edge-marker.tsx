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
    <div className="rounded-lg border border-yellow-400 bg-amber-50 p-4">
      <p className="m-0">客户端水合时间：{hydratedAt || '等待中...'}</p>
      <p className="m-0 mt-2 text-xs text-amber-900">
        User Agent：{userAgent || '获取中...'}
      </p>
      <button
        className="mt-3 rounded-md border-0 bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
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

