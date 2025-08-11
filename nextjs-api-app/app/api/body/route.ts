// nextjs 操作 body
import {NextResponse} from "next/server";

export async function POST(request: NextRequest) {
  console.log('[body]', await request.body)
  return NextResponse.json({
    pathname: request.nextUrl.pathname,
    searchParams: Object.fromEntries(request.nextUrl.searchParams),
    body: await request.json(),
    headers: Object.fromEntries(request.headers),
    cookies: Object.fromEntries(request.cookies),
  })
}