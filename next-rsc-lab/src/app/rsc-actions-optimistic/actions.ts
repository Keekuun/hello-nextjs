'use server'

import { revalidatePath } from 'next/cache'

export type Note = {
  id: string
  content: string
  createdAt: string
}

type CreateNoteResult =
  | {
      ok: true
      note: Note
    }
  | {
      ok: false
      error: string
    }

const notes: Note[] = [
  {
    id: 'seed-1',
    content: '欢迎体验 useOptimistic！提交表单后我会保留最新 10 条笔记。',
    createdAt: new Date().toISOString(),
  },
]

export async function listNotes(): Promise<Note[]> {
  // 模拟数据库读取延迟
  await new Promise((resolve) => setTimeout(resolve, 200))
  return notes.slice(0, 10).map((item) => ({ ...item }))
}

export async function createNote(content: string): Promise<CreateNoteResult> {
  const trimmed = content.trim()

  if (trimmed.length === 0) {
    return {
      ok: false,
      error: '请输入一些想法再提交～',
    }
  }

  if (trimmed.length < 4) {
    // 模拟后端校验
    return {
      ok: false,
      error: '内容太短啦，再多写一点点（至少 4 个字符）。',
    }
  }

  // 模拟后端处理耗时
  await new Promise((resolve) => setTimeout(resolve, 1200))

  const note: Note = {
    id: crypto.randomUUID(),
    content: trimmed,
    createdAt: new Date().toISOString(),
  }

  notes.unshift(note)

  // 只保留最近 10 条
  if (notes.length > 10) {
    notes.length = 10
  }

  revalidatePath('/rsc-actions-optimistic')

  return {
    ok: true,
    note,
  }
}

