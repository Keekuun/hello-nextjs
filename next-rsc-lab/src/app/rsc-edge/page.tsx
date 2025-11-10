export const runtime = 'edge'
export const preferredRegion = 'auto'

import CodePreview from '../../components/code/CodePreview'
import ClientEdgeMarker from './client-edge-marker'
import { headers } from 'next/headers'

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
    <main
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        maxWidth: 960,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <header>
        <h1>RSC Edge Runtime 实验</h1>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          本页面强制运行在 Edge Runtime，验证 RSC 在 Edge 环境中的执行特点：更快的冷启动、就近
          Region 请求、无 Node.js 特定 API、日志体现在 Edge 函数中。
        </p>
      </header>

      <section
        style={{
          border: '1px solid #bae6fd',
          borderRadius: 12,
          padding: 24,
          background: '#f0f9ff',
        }}
      >
        <h2>Edge 请求上下文</h2>
        <div style={{ display: 'grid', gap: 8, fontSize: 15 }}>
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
        <p style={{ marginTop: 12, color: '#0369a1', fontSize: 14 }}>
          * 优先使用 ipapi.co 实时地理信息，若外部服务不可用则回退 Edge 请求头。
        </p>
        {geoFromApi && (
          <p style={{ marginTop: 8, color: '#0f766e', fontSize: 12 }}>
            外部 API 耗时：{geoFromApi.duration} ms
          </p>
        )}
      </section>

      <section
        style={{
          border: '1px solid #bbf7d0',
          borderRadius: 12,
          padding: 24,
          background: '#f0fdf4',
        }}
      >
        <h2>Edge fetch 实验</h2>
        <p>
          时区： <strong>{timeInfo.timezone}</strong>
        </p>
        <p>
          当前时间： <strong>{timeInfo.datetime}</strong>
        </p>
        <p>请求耗时：{timeInfo.duration} ms</p>
        <p style={{ color: '#16a34a', fontSize: 14 }}>
          * Edge Runtime 使用 Web Fetch API，支持流式响应和更低延迟。
        </p>
      </section>

      <section
        style={{
          border: '1px solid #fcd34d',
          borderRadius: 12,
          padding: 24,
          background: '#fffbeb',
        }}
      >
        <h2>客户端水合验证</h2>
        <ClientEdgeMarker />
      </section>

      <section
        style={{
          display: 'grid',
          gap: 18,
        }}
      >
        <h2 style={{ fontSize: 22, margin: 0 }}>关键代码预览</h2>
        <div
          style={{
            display: 'grid',
            gap: 18,
            gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
          }}
        >
          <CodePreview
            title="EdgeRuntimePage"
            file="src/app/rsc-edge/page.tsx"
            description="设置页面运行在 Edge Runtime，并获取外部 API + headers 数据。"
          />
          <CodePreview
            title="ClientEdgeMarker"
            file="src/app/rsc-edge/client-edge-marker.tsx"
            description="记录水合时间与交互日志，验证 Edge 页面前端行为。"
          />
        </div>
      </section>
    </main>
  )
}

