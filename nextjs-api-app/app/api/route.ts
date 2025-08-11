export const dynamic = 'force-static'

import { type NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse('hello nextjs api')
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ body })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ body })
}

export async function DELETE(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ body })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ body })
}

export async function HEAD(request: NextRequest) {
  return NextResponse.json({})
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({})
}