// nextjs 操作 params
import {NextResponse} from "next/server";

export async function GET(request: NextRequest) {
  // 获取 pathname
  console.log('[pathname]', request.nextUrl.pathname)
  // ?a=1&b=2
  console.log('[searchParams]', request.nextUrl.searchParams)
  // URLSearchParams 转为json
  console.log('[searchParams json]', Object.fromEntries(request.nextUrl.searchParams))
  return NextResponse.json({ pathname: request.nextUrl.pathname, searchParams: Object.fromEntries(request.nextUrl.searchParams) })
}