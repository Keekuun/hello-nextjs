'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const transition = { duration: 0.25, ease: [0.33, 1, 0.68, 1] }

type Props = {
  children: ReactNode
}

export default function RouteTransition({ children }: Props) {
  const pathname = usePathname()
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={hasHydrated ? { opacity: 0, y: 18 } : false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={transition}
        style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
