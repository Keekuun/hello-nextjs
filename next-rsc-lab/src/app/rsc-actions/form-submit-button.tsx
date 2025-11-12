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
      className={`self-start rounded-full border-0 px-5 py-2.5 font-semibold text-white transition-colors ${
        status.pending
          ? 'cursor-not-allowed bg-sky-400'
          : 'cursor-pointer bg-sky-500 hover:bg-sky-600'
      }`}
    >
      {status.pending ? '正在提交...' : label}
    </button>
  )
}

