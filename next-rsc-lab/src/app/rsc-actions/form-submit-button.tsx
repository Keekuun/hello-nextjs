'use client'

import { useFormStatus } from 'react-dom'

type Props = {
  label: string
}

export default function SubmitButton({ label }: Props) {
  const status = useFormStatus()

  return (
    <button
      type="submit"
      disabled={status.pending}
      style={{
        alignSelf: 'flex-start',
        padding: '10px 20px',
        borderRadius: 999,
        border: 'none',
        background: status.pending ? '#38bdf8' : '#0ea5e9',
        color: '#fff',
        fontWeight: 600,
        cursor: status.pending ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s ease',
      }}
    >
      {status.pending ? '正在提交...' : label}
    </button>
  )
}

