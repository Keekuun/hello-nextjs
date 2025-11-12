import CodePreview from '../../components/code/CodePreview'
import FlightRecorderClient from './recorder-client'

export default function FlightRecorderPage() {
  return (
    <main className="mx-auto flex max-w-[1100px] flex-col gap-6 p-6">
      <header className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Flight Recorder（实时截获 Flight 数据）</h1>
        <p className="leading-relaxed text-slate-600">
          当你浏览任意 RSC 页面时，Next.js 会在浏览器端维护 <code className="rounded bg-slate-200 px-1 py-0.5">window.__next_f</code>{' '}
          队列，存放最新抵达的 Flight chunk。这个工具定时读取该队列，并将新增 chunk 记录下来，方便你快速对比不同请求之间的差异。
        </p>
        <ol className="mt-4 space-y-1 leading-relaxed text-slate-500">
          <li>在另一个标签页访问任意 RSC 页面（例如 <code className="rounded bg-slate-200 px-1 py-0.5">/rsc-demo</code> 或 <code className="rounded bg-slate-200 px-1 py-0.5">/rsc-actions</code>）</li>
          <li>确保该页面产生新的 Flight 数据（刷新页面、提交表单等）</li>
          <li>回到本页面即可看到 Flight chunk 实时追加，可以点击解析查看结构</li>
          <li>需要重新开始时，可点击"清空记录"按钮</li>
        </ol>
      </header>

      <FlightRecorderClient />
      <section className="grid w-full gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CodePreview
            title="FlightRecorderPage"
            file="src/app/rsc-flight-recorder/page.tsx"
            description="服务器端页面提供使用指引并挂载捕获器客户端组件。"
          />
          <CodePreview
            title="recorder-client.tsx"
            file="src/app/rsc-flight-recorder/recorder-client.tsx"
            description="轮询 window.__next_f、记录 chunk、支持暂停与清空操作。"
          />
        </div>
      </section>
    </main>
  )
}

