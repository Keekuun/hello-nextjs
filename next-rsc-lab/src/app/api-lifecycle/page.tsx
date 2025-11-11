import CodePreview from '../../components/code/CodePreview'
import ApiPlayground from './components/ApiPlayground'
import { cookies, headers } from 'next/headers'
import { draftMode } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function ApiLifecyclePage() {
  const headerList = await headers()
  const cookieStore = await cookies()
  const draft = await draftMode()

  // ReadonlyHeaders 不支持 entries()，需要手动遍历
  const headerEntries: [string, string][] = []
  headerList.forEach((value, key) => {
    if (key.startsWith('x-next') || key.startsWith('x-middleware')) {
      headerEntries.push([key, value])
    }
  })
  const firstHeaders = headerEntries.slice(0, 6)

  const requestCookies = cookieStore.getAll().slice(0, 6)

  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <header
        style={{
          background: '#0f172a',
          color: '#e2e8f0',
          borderRadius: 18,
          padding: '32px 28px',
          boxShadow: '0 22px 60px rgba(15,23,42,0.35)',
        }}
      >
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>Next.js API 生命周期实验</h1>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: '#bfdbfe' }}>
          通过 Route Handler、ReadableStream、middleware 与 instrumentation，观察 Next.js
          在请求生命周期中的底层行为与可用 API。
        </p>
        <ul
          style={{
            marginTop: 16,
            color: '#cbd5f5',
            lineHeight: 1.7,
            fontSize: 15,
          }}
        >
          <li>Route Handler 展示如何访问 headers、cookies，并返回自定义缓存策略。</li>
          <li>ReadableStream 模拟 Flight 协议类似的分片传输。</li>
          <li>Playground 可实时发起请求，观察响应与日志。</li>
          <li>middleware + instrumentation 捕获请求并输出运行时信息。</li>
        </ul>
      </header>

      <section
        style={{
          display: 'grid',
          gap: 18,
          gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
        }}
      >
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            padding: 18,
            background: '#ffffff',
            overflow: 'auto',
          }}
        >
          <h2 style={{ fontSize: 18, margin: 0 }}>请求头快照</h2>
          <p style={{ marginTop: 8, color: '#64748b', fontSize: 14 }}>
            服务器组件可以通过 <code>headers()</code> 读取请求上下文。
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#334155', fontSize: 14 }}>
            {firstHeaders.length === 0 && <li>暂无匹配的 x-next / x-middleware 请求头</li>}
            {firstHeaders.map(([key, value]) => (
              <li key={key}>
                <code>{key}</code>: {value}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            padding: 18,
            background: '#ffffff',
            overflow: 'auto',
          }}
        >
          <h2 style={{ fontSize: 18, margin: 0 }}>Cookies</h2>
          <p style={{ marginTop: 8, color: '#64748b', fontSize: 14 }}>
            使用 <code>cookies()</code> 读取同一请求内的 Cookie。
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#334155', fontSize: 14 }}>
            {requestCookies.length === 0 && <li>本次请求未携带 Cookie。</li>}
            {requestCookies.map((cookie) => (
              <li key={cookie.name}>
                <code>{cookie.name}</code>: {cookie.value}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            padding: 18,
            background: '#ffffff',
            overflow: 'auto',
          }}
        >
          <h2 style={{ fontSize: 18, margin: 0 }}>Draft Mode</h2>
          <p style={{ marginTop: 8, color: '#64748b', fontSize: 14 }}>
            <code>draftMode()</code> 可在请求级别开启临时预览（仅在服务器组件可用）。
          </p>
          <p style={{ margin: 0, color: '#334155', fontSize: 15 }}>
            当前状态：{draft.isEnabled ? '✅ 已开启' : '🚫 未开启'}
          </p>
        </div>
      </section>

      <ApiPlayground />

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
            title="API 生命周期页面"
            file="src/app/api-lifecycle/page.tsx"
            description="服务器组件读取 headers/cookies/draftMode，并渲染 Playground。"
          />
          <CodePreview
            title="Echo Route Handler"
            file="src/app/api-lifecycle/api/echo/route.ts"
            description="展示如何访问请求上下文并返回自定义 JSON 响应。"
          />
          <CodePreview
            title="Stream Route Handler"
            file="src/app/api-lifecycle/api/stream/route.ts"
            description="使用 ReadableStream 按块返回数据，模拟 Flight 协议。"
          />
          <CodePreview
            title="API Playground 客户端"
            file="src/app/api-lifecycle/components/ApiPlayground.tsx"
            description="通过 fetch 调用 Route Handler，并展示响应日志。"
          />
          <CodePreview
            title="middleware.ts"
            file="middleware.ts"
            description="在边缘层记录请求，注入自定义 Header，观察执行顺序。"
          />
          <CodePreview
            title="instrumentation.ts"
            file="instrumentation.ts"
            description="演示 register 钩子，记录启动时机和执行环境。"
          />
        </div>
      </section>
    </main>
  )
}

