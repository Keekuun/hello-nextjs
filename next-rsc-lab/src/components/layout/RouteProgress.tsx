'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const PROGRESS_DURATION = 900

export default function RouteProgress() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const frame = useRef<number | null>(null)
  const hideTimeout = useRef<NodeJS.Timeout | null>(null)
  const settleTimeout = useRef<NodeJS.Timeout | null>(null)
  const startTime = useRef<number>(0)

  useEffect(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current)
      hideTimeout.current = null
    }
    if (settleTimeout.current) {
      clearTimeout(settleTimeout.current)
      settleTimeout.current = null
    }

    startTime.current = performance.now()
    setVisible(true)
    setProgress(0)

    const animate = () => {
      const elapsed = performance.now() - startTime.current
      const ratio = Math.min(elapsed / PROGRESS_DURATION, 0.92)
      setProgress(ratio * 100)
      if (ratio < 0.92) {
        frame.current = requestAnimationFrame(animate)
      }
    }

    frame.current = requestAnimationFrame(animate)

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = null
    }
  }, [pathname])

  useEffect(() => {
    if (!visible) return

    settleTimeout.current = setTimeout(() => {
      setProgress(100)
      hideTimeout.current = setTimeout(() => {
        setVisible(false)
      }, 220)
    }, 320)

    return () => {
      if (settleTimeout.current) {
        clearTimeout(settleTimeout.current)
        settleTimeout.current = null
      }
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current)
        hideTimeout.current = null
      }
    }
  }, [visible, pathname])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="route-progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="route-progress__bar"
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'linear', duration: 0.15 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
