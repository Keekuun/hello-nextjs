import CodePreview from '../../components/code/CodePreview'
import FlightRecorderClient from './recorder-client'

export default function FlightRecorderPage() {
  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <header
        style={{
          background: '#f8fafc',
          borderRadius: 12,
          padding: 24,
          border: '1px solid #e2e8f0',
        }}
      >
        <h1>Flight Recorder（实时截获 Flight 数据）</h1>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          当你浏览任意 RSC 页面时，Next.js 会在浏览器端维护 <code>window.__next_f</code>{' '}
          队列，存放最新抵达的 Flight chunk。这个工具定时读取该队列，并将新增 chunk 记录下来，方便你快速对比不同请求之间的差异。
        </p>
        <ol style={{ marginTop: 16, color: '#64748b', lineHeight: 1.7 }}>
          <li>在另一个标签页访问任意 RSC 页面（例如 <code>/rsc-demo</code> 或 <code>/rsc-actions</code>）</li>
          <li>确保该页面产生新的 Flight 数据（刷新页面、提交表单等）</li>
          <li>回到本页面即可看到 Flight chunk 实时追加，可以点击解析查看结构</li>
          <li>需要重新开始时，可点击“清空记录”按钮</li>
        </ol>
      </header>

      <FlightRecorderClient />
      <section
        style={{
          width: '100%',
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

