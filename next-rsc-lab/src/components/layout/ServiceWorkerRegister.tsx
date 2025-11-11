'use client'

import { useEffect } from 'react'

const SW_PATH = '/sw.js'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const register = async () => {
      try {
        await navigator.serviceWorker.register(SW_PATH, { scope: '/' })
      } catch (error) {
        console.warn('[ServiceWorker] 注册失败:', error)
      }
    }
    register()
  }, [])

  return null
}
