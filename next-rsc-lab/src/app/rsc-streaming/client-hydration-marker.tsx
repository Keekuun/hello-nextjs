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
    <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 text-blue-900">
      <p className="m-0">客户端水合状态：{hydratedRef.current ? '已完成' : '等待中'} </p>
      <p className="m-0">水合时间：{mountedAt ?? '尚未执行 useEffect'}</p>
      <button
        className="mt-3 rounded-md border-0 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
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

