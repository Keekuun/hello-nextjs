'use server'

import { revalidatePath } from 'next/cache'

export type ActionState =
  | {
      status: 'idle'
    }
  | {
      status: 'error'
      error: string
    }
  | {
      status: 'success'
      summary: SubmissionSummary
    }

export type SubmissionSummary = {
  id: string
  topic: string
  contentPreview: string
  charCount: number
  submittedAt: string
}

export type SubmissionRecord = SubmissionSummary & {
  contentFull: string
}

const history: SubmissionRecord[] = []

export async function submitFeedback(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const topic = String(formData.get('topic') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()

  if (!topic || !content) {
    return {
      status: 'error',
      error: '请填写主题和内容，服务器才能处理你的请求。',
    }
  }

  const start = Date.now()
  console.log('[Server Action] 收到表单，准备模拟处理...')

  await new Promise((resolve) => setTimeout(resolve, 1500))

  const end = Date.now()
  const timestamp = new Date(end).toISOString()

  const record: SubmissionRecord = {
    id: crypto.randomUUID(),
    topic,
    contentFull: content,
    contentPreview: content.slice(0, 32) + (content.length > 32 ? '...' : ''),
    charCount: content.length,
    submittedAt: timestamp,
  }

  history.unshift(record)

  console.log(
    '[Server Action] 处理完成，耗时(ms):',
    end - start,
    '记录 id:',
    record.id,
  )

  revalidatePath('/rsc-actions')

  return {
    status: 'success',
    summary: record,
  }
}

export async function getLatestHistory(): Promise<SubmissionSummary[]> {
  console.log('[Server Action] 获取提交历史，当前条数:', history.length)
  return history.slice(0, 5).map((item) => ({
    id: item.id,
    topic: item.topic,
    contentPreview: item.contentPreview,
    charCount: item.charCount,
    submittedAt: item.submittedAt,
  }))
}

