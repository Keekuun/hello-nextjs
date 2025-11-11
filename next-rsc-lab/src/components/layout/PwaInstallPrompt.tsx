'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

let deferredPrompt: BeforeInstallPromptEvent | null = null

type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[]
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PwaInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!window || !('serviceWorker' in navigator)) return

    const handler = (event: Event) => {
      event.preventDefault()
      deferredPrompt = event as BeforeInstallPromptEvent
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') {
      deferredPrompt = null
      setCanInstall(false)
    } else {
      setDismissed(true)
    }
  }

  if (!canInstall || dismissed) return null

  return (
    <AnimatePresence>
      <motion.button
        key="pwa-install"
        className="pwa-install-btn"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        type="button"
        onClick={handleInstall}
      >
        📲 安装到设备
      </motion.button>
    </AnimatePresence>
  )
}
