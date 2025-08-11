import {NextResponse} from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params // 'a', 'b', or 'c'

  return NextResponse.json({
    slug,
  })
}