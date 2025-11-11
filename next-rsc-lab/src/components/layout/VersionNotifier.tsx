'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const CHECK_INTERVAL = 60_000

export default function VersionNotifier() {
  const [show, setShow] = useState(false)
  const [latestVersion, setLatestVersion] = useState<string | null>(null)
  const currentVersionRef = useRef<string>('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const meta = document.querySelector('meta[name="app-version"]') as HTMLMetaElement | null
    currentVersionRef.current = meta?.content ?? 'unknown'

    const checkUpdate = async () => {
      try {
        const response = await fetch('/api/version', {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) return
        const data = (await response.json()) as { version?: string }
        if (data?.version && data.version !== currentVersionRef.current) {
          setLatestVersion(data.version)
          setShow(true)
        }
      } catch (error) {
        console.warn('[VersionNotifier] 检查新版本失败:', error)
      }
    }

    timerRef.current = setInterval(checkUpdate, CHECK_INTERVAL)
    const initialTimeout = setTimeout(checkUpdate, 10_000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      clearTimeout(initialTimeout)
    }
  }, [])

  const handleRefresh = () => {
    if (latestVersion) {
      currentVersionRef.current = latestVersion
    }
    window.location.reload()
  }

  const handleDismiss = () => {
    setShow(false)
    setLatestVersion(null)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          className="version-notifier"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
        >
          <div className="version-notifier__body">
            <strong>检测到新版本</strong>
            <span>实验室内容已更新，刷新即可体验最新效果。</span>
          </div>
          <div className="version-notifier__actions">
            <button type="button" onClick={handleDismiss}>
              稍后
            </button>
            <button type="button" onClick={handleRefresh} className="primary">
              立即刷新
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
