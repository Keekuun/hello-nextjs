'use client'

import { useOptimistic, useRef, useState, useTransition } from 'react'
import type { Note } from './actions'
import { createNote } from './actions'

type OptimisticAction =
  | {
      type: 'add'
      note: OptimisticNote
    }
  | {
      type: 'replace'
      optimisticId: string
      note: Note
    }
  | {
      type: 'remove'
      optimisticId: string
    }

type OptimisticNote = Note & {
  optimistic?: boolean
  error?: string
}

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'UTC',
})

function formatTimestamp(iso: string) {
  try {
    return `${timeFormatter.format(new Date(iso))} UTC`
  } catch {
    return iso
  }
}

type Props = {
  initialNotes: Note[]
}

export default function NotesBoard({ initialNotes }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [notes, mutate] = useOptimistic<OptimisticNote[], OptimisticAction>(
    initialNotes,
    (state, action) => {
      switch (action.type) {
        case 'add':
          return [action.note, ...state]
        case 'replace':
          return state.map((item) =>
            item.id === action.optimisticId ? action.note : item,
          )
        case 'remove':
          return state.filter((item) => item.id !== action.optimisticId)
        default:
          return state
      }
    },
  )

  async function handleAction(formData: FormData) {
    const content = String(formData.get('content') ?? '').trim()
    if (!content) {
      setErrorMessage('请输入一些想法再提交～')
      return
    }

    setErrorMessage(null)

    const optimisticNote: OptimisticNote = {
      id: `optimistic-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      optimistic: true,
    }

    mutate({ type: 'add', note: optimisticNote })
    formRef.current?.reset()

    startTransition(async () => {
      const result = await createNote(content)

      if (!result.ok) {
        setErrorMessage(result.error)
        mutate({ type: 'remove', optimisticId: optimisticNote.id })
        return
      }

      mutate({
        type: 'replace',
        optimisticId: optimisticNote.id,
        note: result.note,
      })
    })
  }

  return (
    <section className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-6">
      <header>
        <h2 className="text-xl font-semibold">快速记录灵感</h2>
        <p className="mt-2 leading-relaxed text-slate-500">
          提交表单后立即看到乐观更新的条目，等待服务器返回后替换为真实数据。
        </p>
      </header>

      <form
        ref={formRef}
        action={handleAction}
        className="flex items-start gap-3"
      >
        <textarea
          name="content"
          placeholder="写下此刻的灵感...（至少 4 个字符）"
          required
          minLength={4}
          className="min-h-20 flex-1 resize-y rounded-lg border border-blue-200 px-3 py-3 text-[15px] leading-normal"
        />
        <button
          type="submit"
          disabled={isPending}
          className={`rounded-full border-0 px-5 py-3 font-semibold text-white transition-colors ${
            isPending
              ? 'cursor-not-allowed bg-amber-500'
              : 'cursor-pointer bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {isPending ? '提交中...' : '添加笔记'}
        </button>
      </form>

      {errorMessage && (
        <div className="rounded-lg border border-red-300 bg-red-100 px-3 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {notes.map((note) => (
          <li
            key={note.id}
            className={`rounded-lg border border-slate-200 p-4 transition-colors ${
              note.optimistic
                ? 'bg-amber-50 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.5)]'
                : 'bg-slate-50'
            }`}
          >
            <p className="m-0 text-[15px] leading-relaxed">
              {note.content}
            </p>
            <div className="mt-2.5 flex gap-3 text-xs text-slate-500">
              <span>
                {formatTimestamp(note.createdAt)}
              </span>
              {note.optimistic ? (
                <span className="font-semibold text-amber-700">等待服务器确认...</span>
              ) : (
                <span className="text-blue-600">服务器已同步 ✅</span>
              )}
            </div>
          </li>
        ))}
        {notes.length === 0 && (
          <li className="rounded-lg bg-slate-50 p-6 text-center text-slate-400">
            还没有任何笔记，写点什么吧～
          </li>
        )}
      </ul>
    </section>
  )
}

