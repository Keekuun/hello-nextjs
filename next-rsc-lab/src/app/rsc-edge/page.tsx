export const runtime = 'edge'
export const preferredRegion = 'auto'

import ClientEdgeMarker from './client-edge-marker'
import { headers } from 'next/headers'
import CodePreview from '../../components/code/CodePreview'

async function fetchEdgeTime() {
  const start = Date.now()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', {
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      console.error('[Edge Runtime] 获取时间失败:', response.status, response.statusText)
      throw new Error('Edge Runtime 请求失败')
    }

    const data = await response.json()
    const end = Date.now()

    console.log('[Edge Runtime] fetchEdgeTime 耗时(ms):', end - start)

    return {
      datetime: data.datetime,
      timezone: data.timezone,
      duration: end - start,
    }
  } catch (error) {
    const fallbackTime = new Date().toISOString()
    const duration = Date.now() - start

    console.warn('[Edge Runtime] 外部时间服务不可用，使用本地 UTC 作为兜底。', error)

    return {
      datetime: fallbackTime,
      timezone: 'UTC (fallback)',
      duration,
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchGeoInfoFromApi() {
  const start = Date.now()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch('https://ipapi.co/json/', {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      console.warn('[Edge Runtime] ipapi.co 返回非 200 状态:', response.status)
      return null
    }

    const data = await response.json()
    const duration = Date.now() - start

    console.log('[Edge Runtime] ipapi.co 获取地理信息耗时(ms):', duration)

    return {
      ip: (data.ip as string) ?? null,
      city: (data.city as string) ?? null,
      region: (data.region as string) ?? null,
      country: (data.country_name as string) ?? null,
      timezone: (data.timezone as string) ?? null,
      org: (data.org as string) ?? null,
      duration,
    }
  } catch (error) {
    console.warn('[Edge Runtime] ipapi.co 请求异常，使用 header 兜底。', error)
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export default async function EdgeRuntimePage() {
  let geo = {
    country: '未知',
    region: '未知',
    city: '未知',
  }

  try {
    // headers() 返回 Promise<ReadonlyHeaders>，需要 await
    const edgeHeaders = await headers()
    
    geo = {
      country: edgeHeaders.get('x-vercel-ip-country') ?? '未知',
      region: edgeHeaders.get('x-vercel-ip-country-region') ?? '未知',
      city: edgeHeaders.get('x-vercel-ip-city') ?? '未知',
    }
  } catch (error) {
    console.warn('[Edge Runtime] 获取地理信息失败:', error)
    // 在开发环境中，这些头部可能不存在，使用默认值
  }

  const geoFromApi = await fetchGeoInfoFromApi()

  const timeInfo = await fetchEdgeTime()

  console.log('[Edge Runtime] 请求地理信息:', {
    header: geo,
    api: geoFromApi,
  })

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-6 p-6">
      <header>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">RSC Edge Runtime 实验</h1>
        <p className="leading-relaxed text-slate-600">
          本页面强制运行在 Edge Runtime，验证 RSC 在 Edge 环境中的执行特点：更快的冷启动、就近
          Region 请求、无 Node.js 特定 API、日志体现在 Edge 函数中。
        </p>
      </header>

      <section className="rounded-xl border border-sky-200 bg-sky-50 p-6">
        <h2 className="mb-3 text-xl font-semibold">Edge 请求上下文</h2>
        <div className="grid gap-2 text-[15px]">
          <div>
            <strong>国家：</strong>
            {geoFromApi?.country ?? geo.country}
          </div>
          <div>
            <strong>区域：</strong>
            {geoFromApi?.region ?? geo.region}
          </div>
          <div>
            <strong>城市：</strong>
            {geoFromApi?.city ?? geo.city}
          </div>
          <div>
            <strong>时区：</strong>
            {geoFromApi?.timezone ?? '未知'}
          </div>
          <div>
            <strong>IP：</strong>
            {geoFromApi?.ip ?? '未知'}
          </div>
          <div>
            <strong>运营商：</strong>
            {geoFromApi?.org ?? '未知'}
          </div>
        </div>
        <p className="mt-3 text-sm text-sky-700">
          * 优先使用 ipapi.co 实时地理信息，若外部服务不可用则回退 Edge 请求头。
        </p>
        {geoFromApi && (
          <p className="mt-2 text-xs text-teal-700">
            外部 API 耗时：{geoFromApi.duration} ms
          </p>
        )}
      </section>

      <section className="rounded-xl border border-green-200 bg-green-50 p-6">
        <h2 className="mb-3 text-xl font-semibold">Edge fetch 实验</h2>
        <p>
          时区： <strong>{timeInfo.timezone}</strong>
        </p>
        <p>
          当前时间： <strong>{timeInfo.datetime}</strong>
        </p>
        <p>请求耗时：{timeInfo.duration} ms</p>
        <p className="text-sm text-green-700">
          * Edge Runtime 使用 Web Fetch API，支持流式响应和更低延迟。
        </p>
      </section>

      <section className="rounded-xl border border-yellow-300 bg-yellow-50 p-6">
        <h2 className="mb-3 text-xl font-semibold">客户端水合验证</h2>
        <ClientEdgeMarker />
      </section>

      <section className="grid gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CodePreview
            title="EdgeRuntimePage 主页面"
            file="src/app/rsc-edge/page.tsx"
            description="配置 Edge Runtime，获取地理信息与时间数据，展示 Edge 环境的执行特点。"
          />
          <CodePreview
            title="fetchGeoInfoFromApi 函数"
            file="src/app/rsc-edge/page.tsx"
            description="使用 Web Fetch API 获取实时地理信息，支持超时控制与错误处理。"
          />
          <CodePreview
            title="fetchEdgeTime 函数"
            file="src/app/rsc-edge/page.tsx"
            description="通过外部 API 获取 UTC 时间，演示 Edge Runtime 的网络请求能力。"
          />
          <CodePreview
            title="client-edge-marker.tsx"
            file="src/app/rsc-edge/client-edge-marker.tsx"
            description="客户端组件验证 Edge 页面的水合过程，记录水合时间与用户代理信息。"
          />
        </div>
      </section>
    </main>
  )
}

