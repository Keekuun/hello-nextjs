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
    <section
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 24,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <header>
        <h2 style={{ fontSize: 20 }}>快速记录灵感</h2>
        <p style={{ color: '#64748b', marginTop: 8, lineHeight: 1.7 }}>
          提交表单后立即看到乐观更新的条目，等待服务器返回后替换为真实数据。
        </p>
      </header>

      <form
        ref={formRef}
        action={handleAction}
        style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
      >
        <textarea
          name="content"
          placeholder="写下此刻的灵感...（至少 4 个字符）"
          required
          minLength={4}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: '1px solid #cbd5f5',
            fontSize: 15,
            lineHeight: 1.5,
            resize: 'vertical',
            minHeight: 80,
          }}
        />
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '12px 20px',
            borderRadius: 999,
            border: 'none',
            background: isPending ? '#f59e0b' : '#f97316',
            color: '#fff',
            fontWeight: 600,
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease',
          }}
        >
          {isPending ? '提交中...' : '添加笔记'}
        </button>
      </form>

      {errorMessage && (
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: 14,
          }}
        >
          {errorMessage}
        </div>
      )}

      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {notes.map((note) => (
          <li
            key={note.id}
            style={{
              padding: 16,
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              background: note.optimistic ? '#fef3c7' : '#f8fafc',
              boxShadow: note.optimistic
                ? 'inset 0 0 0 1px rgba(251, 191, 36, 0.5)'
                : 'none',
              transition: 'background 0.3s ease',
            }}
          >
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
              {note.content}
            </p>
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                color: '#64748b',
                display: 'flex',
                gap: 12,
              }}
            >
              <span>
                {formatTimestamp(note.createdAt)}
              </span>
              {note.optimistic ? (
                <span style={{ color: '#d97706', fontWeight: 600 }}>等待服务器确认...</span>
              ) : (
                <span style={{ color: '#2563eb' }}>服务器已同步 ✅</span>
              )}
            </div>
          </li>
        ))}
        {notes.length === 0 && (
          <li
            style={{
              padding: 24,
              textAlign: 'center',
              borderRadius: 10,
              background: '#f8fafc',
              color: '#94a3b8',
            }}
          >
            还没有任何笔记，写点什么吧～
          </li>
        )}
      </ul>
    </section>
  )
}

