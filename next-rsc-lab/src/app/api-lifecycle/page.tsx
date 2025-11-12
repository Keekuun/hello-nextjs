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
    <main className="mx-auto flex max-w-[1200px] flex-col gap-6 p-6">
      <header className="rounded-2xl bg-slate-900 px-7 py-8 text-slate-200 shadow-[0_22px_60px_rgba(15,23,42,0.35)]">
        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Next.js API 生命周期实验</h1>
        <p className="text-lg leading-relaxed text-blue-200">
          通过 Route Handler、ReadableStream、middleware 与 instrumentation，观察 Next.js
          在请求生命周期中的底层行为与可用 API。
        </p>
        <ul className="mt-4 space-y-1 text-[15px] leading-relaxed text-blue-100">
          <li>Route Handler 展示如何访问 headers、cookies，并返回自定义缓存策略。</li>
          <li>ReadableStream 模拟 Flight 协议类似的分片传输。</li>
          <li>Playground 可实时发起请求，观察响应与日志。</li>
          <li>middleware + instrumentation 捕获请求并输出运行时信息。</li>
        </ul>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-auto rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="m-0 text-lg font-semibold">请求头快照</h2>
          <p className="mt-2 text-sm text-slate-500">
            服务器组件可以通过 <code className="rounded bg-slate-100 px-1 py-0.5">headers()</code> 读取请求上下文。
          </p>
          <ul className="m-0 list-inside list-disc space-y-1 pl-5 text-sm text-gray-800">
            {firstHeaders.length === 0 && <li>暂无匹配的 x-next / x-middleware 请求头</li>}
            {firstHeaders.map(([key, value]) => (
              <li key={key}>
                <code className="rounded bg-slate-100 px-1 py-0.5">{key}</code>: {value}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-auto rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="m-0 text-lg font-semibold">Cookies</h2>
          <p className="mt-2 text-sm text-slate-500">
            使用 <code className="rounded bg-slate-100 px-1 py-0.5">cookies()</code> 读取同一请求内的 Cookie。
          </p>
          <ul className="m-0 list-inside list-disc space-y-1 pl-5 text-sm text-gray-800">
            {requestCookies.length === 0 && <li>本次请求未携带 Cookie。</li>}
            {requestCookies.map((cookie) => (
              <li key={cookie.name}>
                <code className="rounded bg-slate-100 px-1 py-0.5">{cookie.name}</code>: {cookie.value}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-auto rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="m-0 text-lg font-semibold">Draft Mode</h2>
          <p className="mt-2 text-sm text-slate-500">
            <code className="rounded bg-slate-100 px-1 py-0.5">draftMode()</code> 可在请求级别开启临时预览（仅在服务器组件可用）。
          </p>
          <p className="m-0 text-[15px] text-gray-800">
            当前状态：{draft.isEnabled ? '✅ 已开启' : '🚫 未开启'}
          </p>
        </div>
      </section>

      <ApiPlayground />

      <section className="grid gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

