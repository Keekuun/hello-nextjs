export const dynamic = 'force-dynamic'

import { type NextRequest } from 'next/server'

// proxy  https://cdn2.ear0.com:3321/preview?soundid=38984&type=mp3
export async function GET(request: NextRequest) {
  console.log('[request params]', request.nextUrl.searchParams)

  // 获取查询参数
  const searchParams = request.nextUrl.searchParams
  const soundid = searchParams.get('soundid')
  const type = searchParams.get('type') || 'mp3'

  // 构建目标URL
  const targetUrl = `https://cdn2.ear0.com:3321/preview?soundid=${soundid}&type=${type}`

  // 代理请求到目标地址并返回响应
  const response = await fetch(targetUrl);

  console.log('[response]', response)

  // 返回目标地址的响应内容
  return response
}
