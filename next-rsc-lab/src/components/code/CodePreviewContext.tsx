'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

export type CodePreviewItem = {
  id: string
  code: string
  language: string
  title: string
  file: string
}

type CodePreviewContextType = {
  items: CodePreviewItem[]
  register: (item: CodePreviewItem) => void
  unregister: (id: string) => void
  currentIndex: number | null
  setCurrentIndex: (index: number | null) => void
  openModal: (id: string) => void
  closeModal: () => void
  navigateNext: () => void
  navigatePrev: () => void
  canNavigateNext: boolean
  canNavigatePrev: boolean
}

const CodePreviewContext = createContext<CodePreviewContextType | null>(null)

export function CodePreviewProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CodePreviewItem[]>([])
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)

  const register = useCallback((item: CodePreviewItem) => {
    setItems((prev) => {
      // 避免重复注册
      if (prev.some((i) => i.id === item.id)) {
        return prev
      }
      return [...prev, item]
    })
  }, [])

  const unregister = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const openModal = useCallback(
    (id: string) => {
      const index = items.findIndex((item) => item.id === id)
      if (index !== -1) {
        setCurrentIndex(index)
      }
    },
    [items],
  )

  const closeModal = useCallback(() => {
    setCurrentIndex(null)
  }, [])

  const navigateNext = useCallback(() => {
    if (currentIndex !== null && currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, items.length])

  const navigatePrev = useCallback(() => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }, [currentIndex])

  const canNavigateNext = currentIndex !== null && currentIndex < items.length - 1
  const canNavigatePrev = currentIndex !== null && currentIndex > 0

  // 键盘快捷键支持
  useEffect(() => {
    if (currentIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        navigatePrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        navigateNext()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        closeModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentIndex, navigateNext, navigatePrev, closeModal])

  return (
    <CodePreviewContext.Provider
      value={{
        items,
        register,
        unregister,
        currentIndex,
        setCurrentIndex,
        openModal,
        closeModal,
        navigateNext,
        navigatePrev,
        canNavigateNext,
        canNavigatePrev,
      }}
    >
      {children}
    </CodePreviewContext.Provider>
  )
}

export function useCodePreview() {
  const context = useContext(CodePreviewContext)
  if (!context) {
    throw new Error('useCodePreview must be used within CodePreviewProvider')
  }
  return context
}

