'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

const TARGET_PATH = '/rsc-cache-lab'

export async function refreshCachedQuote() {
  revalidateTag('cached-quote')
  return { refreshedAt: new Date().toISOString() }
}

export async function refreshInsightMetrics() {
  revalidateTag('insight-metrics')
  return { refreshedAt: new Date().toISOString() }
}

export async function refreshEverything() {
  revalidateTag('cached-quote')
  revalidateTag('insight-metrics')
  revalidatePath(TARGET_PATH)
  return { refreshedAt: new Date().toISOString() }
}
