import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const steps = [
        '[stream] 👋 连接已建立，准备发送数据块。',
        `[stream] 当前时间：${new Date().toISOString()}`,
        '[stream] Chunk #1：解释如何在 Route Handler 内部使用 ReadableStream。',
        '[stream] Chunk #2：React Server Components 也依赖类似机制输送 Flight 数据。',
        '[stream] ✅ 传输完成，关闭流。',
      ]

      for (const message of steps) {
        controller.enqueue(encoder.encode(`${message}\n`))
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      controller.close()
    },
  })

  return new NextResponse(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-api-lifecycle': 'stream',
    },
  })
}

