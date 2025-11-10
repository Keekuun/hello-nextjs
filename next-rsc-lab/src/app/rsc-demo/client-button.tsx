'use client'

import { useState } from 'react'

type Props = {
  label: string
}

export default function ClientButton({ label }: Props) {
  const [count, setCount] = useState(0)

  return (
    <div style={{ marginTop: 16 }}>
      <button
        style={{
          padding: '8px 16px',
          borderRadius: 4,
          border: '1px solid #333',
          background: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => setCount((c) => c + 1)}
      >
        {label}（点击次数：{count}）
      </button>
    </div>
  )
}

