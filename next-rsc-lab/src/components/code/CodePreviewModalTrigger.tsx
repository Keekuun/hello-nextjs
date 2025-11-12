'use client'

import { useState } from 'react'
import CodeHighlight from './CodeHighlight'

type Props = {
  code: string
  language: string
  title: string
  file: string
}

export default function CodePreviewModalTrigger({ code, language, title, file }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-300/40 bg-blue-50 px-4 py-2.5 text-[13px] font-semibold text-blue-700 transition-all hover:bg-blue-100 hover:shadow-sm"
      >
        查看代码
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-6 sm:p-10"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-2xl border border-slate-300/35 bg-slate-950 shadow-[0_32px_80px_rgba(15,23,42,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between gap-3 border-b border-slate-300/25 px-6 py-4.5 text-slate-200">
              <div className="flex flex-col gap-1">
                <span className="text-xs tracking-wider text-slate-400">{file}</span>
                <h3 className="m-0 text-xl font-semibold">{title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer whitespace-nowrap rounded-full border border-slate-300/35 bg-slate-800/20 px-3 py-2 text-[13px] text-blue-100 transition-colors hover:bg-slate-800/40"
              >
                关闭
              </button>
            </header>
            <div className="max-h-[70vh] overflow-auto p-0">
              <CodeHighlight language={language} code={code} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

