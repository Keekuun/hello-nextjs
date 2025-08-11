export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'

// https://cdn2.ear0.com:3321/preview?soundid=38984&type=mp3
export async function GET(request: NextRequest) {
  // 获取 Range 请求头
  const rangeHeader = request.headers.get('Range')
  console.log('[Range Header]', rangeHeader)

  // 获取查询参数
  const searchParams = request.nextUrl.searchParams
  const soundid = searchParams.get('soundid')
  const type = searchParams.get('type') || 'mp3'

  // 构建目标 URL
  const targetUrl = `https://cdn2.ear0.com:3321/preview?soundid=${soundid}&type=${type}`

  // 构造请求头（带 Range）
  const headers: Record<string, string> = {}
  if (rangeHeader) {
    headers['Range'] = rangeHeader
  }

  // 向源服务器发起带 Range 的请求
  const response = await fetch(targetUrl, {
    headers,
  })

  // 获取源响应头
  const responseHeaders = new Headers(response.headers)

  // 设置 CORS 和 Range 相关响应头
  responseHeaders.set('Access-Control-Allow-Origin', '*')
  responseHeaders.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Content-Type')

  // 返回响应
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  })
}
