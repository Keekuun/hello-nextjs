'use client'

import { useState } from 'react'

type Props = {
  label: string
}

export default function ClientButton({ label }: Props) {
  const [count, setCount] = useState(0)

  return (
    <div className="mt-4">
      <button
        className="cursor-pointer rounded border border-gray-800 bg-white px-4 py-2 transition-colors hover:bg-gray-50"
        onClick={() => setCount((c) => c + 1)}
      >
        {label}（点击次数：{count}）
      </button>
    </div>
  )
}

