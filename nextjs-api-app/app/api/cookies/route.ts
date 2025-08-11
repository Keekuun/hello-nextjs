// nextjs 操作 cookies

import { cookies } from 'next/headers'
import {NextResponse} from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  console.log('[cookies]', request.cookies)

  const a = cookieStore.get('a')
  const b = cookieStore.set('b', '1')

  return NextResponse.json({ success: true })
}