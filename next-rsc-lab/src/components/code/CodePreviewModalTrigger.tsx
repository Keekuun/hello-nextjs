'use client'

import { useEffect } from 'react'
import { useCodePreview } from './CodePreviewContext'

type Props = {
  code: string
  language: string
  title: string
  file: string
  id: string
}

export default function CodePreviewModalTrigger({ code, language, title, file, id }: Props) {
  const { register, unregister, openModal } = useCodePreview()

  // 注册和注销
  useEffect(() => {
    register({ id, code, language, title, file })
    return () => {
      unregister(id)
    }
  }, [id, code, language, title, file, register, unregister])

  return (
    <button
      type="button"
      onClick={() => openModal(id)}
      className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-300/40 bg-blue-50 px-4 py-2.5 text-[13px] font-semibold text-blue-700 transition-all hover:bg-blue-100 hover:shadow-sm"
    >
      查看代码
    </button>
  )
}

