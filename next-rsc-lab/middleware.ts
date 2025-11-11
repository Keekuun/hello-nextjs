import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: ['/api-lifecycle/:path*'],
}

export function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID()
  console.log('[middleware] 请求捕获:', {
    requestId,
    url: request.nextUrl.href,
    method: request.method,
  })

  const response = NextResponse.next()
  response.headers.set('x-middleware-request-id', requestId)
  response.headers.set('x-middleware-note', 'Edge middleware injected header')

  return response
}

