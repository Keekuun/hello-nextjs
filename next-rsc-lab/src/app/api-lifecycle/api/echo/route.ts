import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const startedAt = Date.now()

  let payload: unknown = null
  try {
    payload = await request.json()
  } catch {
    payload = '(body 不是合法的 JSON)'
  }

  const headers: Record<string, string> = {}
  for (const [key, value] of request.headers.entries()) {
    if (key.startsWith('x-next') || key.startsWith('x-middleware')) {
      headers[key] = value
    }
  }

  const cookies = request.cookies.getAll().map((cookie) => ({
    name: cookie.name,
    value: cookie.value,
  }))

  const latency = Date.now() - startedAt

  return NextResponse.json(
    {
      message: 'Echoed request context from Route Handler.',
      now: new Date().toISOString(),
      request: {
        method: request.method,
        url: request.url,
        headers,
        cookies,
        body: payload,
      },
      metrics: {
        latency,
      },
    },
    {
      headers: {
        'cache-control': 'no-store',
        'x-api-lifecycle': 'echo',
      },
    },
  )
}

