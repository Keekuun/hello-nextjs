import { BUILD_VERSION } from '../../../lib/version'

export const dynamic = 'force-dynamic'

export async function GET() {
  return Response.json(
    {
      version: BUILD_VERSION,
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  )
}
