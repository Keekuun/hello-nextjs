'use client'

import CodeHighlight from './CodeHighlight'
import { useCodePreview } from './CodePreviewContext'

export default function CodePreviewModal() {
  const {
    items,
    currentIndex,
    closeModal,
    navigateNext,
    navigatePrev,
    canNavigateNext,
    canNavigatePrev,
  } = useCodePreview()

  if (currentIndex === null || !items[currentIndex]) {
    return null
  }

  const currentItem = items[currentIndex]
  const currentItemIndex = currentIndex + 1
  const totalItems = items.length

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-6 sm:p-10"
      onClick={closeModal}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-2xl border border-slate-300/35 bg-slate-950 shadow-[0_32px_80px_rgba(15,23,42,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* 上一个按钮 */}
        {canNavigatePrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigatePrev()
            }}
            className="cursor-pointer absolute left-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-300/35 bg-slate-800/60 p-1 text-slate-200 transition-all hover:bg-slate-700/80 hover:shadow-lg"
            aria-label="上一个代码预览"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* 下一个按钮 */}
        {canNavigateNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigateNext()
            }}
            className="cursor-pointer absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-300/35 bg-slate-800/60 p-1 text-slate-200 transition-all hover:bg-slate-700/80 hover:shadow-lg"
            aria-label="下一个代码预览"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <header className="flex items-center justify-between gap-3 border-b border-slate-300/25 px-6 py-4.5 text-slate-200">
          <div className="flex flex-col gap-1">
            <span className="text-xs tracking-wider text-slate-400">{currentItem.file}</span>
            <h3 className="m-0 text-xl font-semibold">{currentItem.title}</h3>
            {totalItems > 1 && (
              <span className="text-xs text-slate-500">
                {currentItemIndex} / {totalItems}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {totalItems > 1 && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <kbd className="rounded bg-slate-800/50 px-2 py-1">←</kbd>
                <kbd className="rounded bg-slate-800/50 px-2 py-1">→</kbd>
                <span>切换</span>
              </div>
            )}
            <button
              type="button"
              onClick={closeModal}
              className="cursor-pointer whitespace-nowrap rounded-full border border-slate-300/35 bg-slate-800/20 px-3 py-2 text-[13px] text-blue-100 transition-colors hover:bg-slate-800/40"
            >
              关闭
            </button>
          </div>
        </header>
        <div className="max-h-[70vh] overflow-auto p-0 no-scrollbar">
          <CodeHighlight language={currentItem.language} code={currentItem.code} />
        </div>
      </div>
    </div>
  )
}

