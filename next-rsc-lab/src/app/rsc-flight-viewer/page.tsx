import CodePreview from '../../components/code/CodePreview'
import FlightViewerClient from './flight-viewer-client'

export default function FlightViewerPage() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6 p-6">
      <header>
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">Flight 数据可视化工具</h1>
        <p className="mb-6 leading-relaxed text-slate-500">
          这个工具帮助你实时观察和解析 Next.js 生成的 Flight 数据包。Flight 是 React Server Components
          的核心协议，用于在服务器和客户端之间传输组件树、Props 和客户端模块引用。
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="mb-3 text-xl font-semibold">使用说明</h2>
        <ol className="list-inside list-decimal space-y-2 pl-5 leading-relaxed text-slate-600">
          <li>打开 Chrome DevTools → Network 面板</li>
          <li>访问任意 RSC 页面（如 <code className="rounded bg-slate-200 px-1 py-0.5">/rsc-demo</code>）</li>
          <li>找到带有 <code className="rounded bg-slate-200 px-1 py-0.5">?__rsc</code> 的请求</li>
          <li>复制 Response 内容，粘贴到下方输入框</li>
          <li>点击"解析 Flight 数据"查看结构化结果</li>
        </ol>
      </section>

      <FlightViewerClient />

      <section className="grid gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CodePreview
            title="FlightViewerPage"
            file="src/app/rsc-flight-viewer/page.tsx"
            description="服务器组件提供使用说明，并渲染客户端可视化工具。"
          />
          <CodePreview
            title="recorder-client.tsx"
            file="src/app/rsc-flight-recorder/recorder-client.tsx"
            description="捕获 window.__next_f 队列的逻辑，可与可视化工具搭配调试。"
          />
          <CodePreview
            title="flight-viewer-client.tsx"
            file="src/app/rsc-flight-viewer/flight-viewer-client.tsx"
            description="解析 Flight JSON 并可视化结构，包含 props 展开与客户端标记。"
          />
        </div>
      </section>
    </div>
  )
}

