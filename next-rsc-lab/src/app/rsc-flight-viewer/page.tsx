import CodePreview from '../../components/code/CodePreview'
import FlightViewerClient from './flight-viewer-client'

export default function FlightViewerPage() {
  return (
    <div
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
      <header>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Flight 数据可视化工具</h1>
        <p style={{ color: '#64748b', marginBottom: 24, lineHeight: 1.7 }}>
          这个工具帮助你实时观察和解析 Next.js 生成的 Flight 数据包。Flight 是 React Server Components
          的核心协议，用于在服务器和客户端之间传输组件树、Props 和客户端模块引用。
        </p>
      </header>

      <section
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>使用说明</h2>
        <ol style={{ paddingLeft: 20, lineHeight: 1.8, color: '#475569' }}>
          <li>打开 Chrome DevTools → Network 面板</li>
          <li>访问任意 RSC 页面（如 <code>/rsc-demo</code>）</li>
          <li>找到带有 <code>?__rsc</code> 的请求</li>
          <li>复制 Response 内容，粘贴到下方输入框</li>
          <li>点击"解析 Flight 数据"查看结构化结果</li>
        </ol>
      </section>

      <FlightViewerClient />

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

