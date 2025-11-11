import { unstable_cache } from 'next/cache'

const QUOTE_ENDPOINT = 'https://dummyjson.com/quotes/random'

export type CachedQuote = {
  quote: string
  author: string
  fetchedAt: string
  duration: number
}

export type InsightMetrics = {
  fibonacciSample: number[]
  average: number
  generatedAt: string
  duration: number
}

export async function getCachedQuote(): Promise<CachedQuote> {
  const start = Date.now()
  const response = await fetch(QUOTE_ENDPOINT, {
    next: { revalidate: 600, tags: ['cached-quote'] },
  })

  if (!response.ok) {
    throw new Error(`获取引用失败: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as { quote: string; author: string }
  return {
    quote: data.quote,
    author: data.author,
    fetchedAt: new Date().toISOString(),
    duration: Date.now() - start,
  }
}

const computeInsightMetrics = unstable_cache(
  async (): Promise<InsightMetrics> => {
    const start = Date.now()
    await new Promise((resolve) => setTimeout(resolve, 700))
    const sample = generateFibonacciSample(7)
    const average = sample.reduce((acc, val) => acc + val, 0) / sample.length

    return {
      fibonacciSample: sample,
      average,
      generatedAt: new Date().toISOString(),
      duration: Date.now() - start,
    }
  },
  ['insight-metrics'],
  { revalidate: 900, tags: ['insight-metrics'] },
)

export async function getInsightMetrics() {
  return computeInsightMetrics()
}

export async function getLivePulse() {
  const start = Date.now()
  await new Promise((resolve) => setTimeout(resolve, 450))

  return {
    serverNow: new Date().toISOString(),
    randomSeed: Math.random().toString(36).slice(2, 10),
    duration: Date.now() - start,
  }
}

function generateFibonacciSample(length: number) {
  const result: number[] = []
  let a = 1
  let b = 1
  for (let i = 0; i < length; i++) {
    result.push(a)
    const next = a + b
    a = b
    b = next
  }
  return result
}
