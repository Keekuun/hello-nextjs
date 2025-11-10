import CodePreview from '../../components/code/CodePreview'
import ServerChild from './server-child'
import ClientButton from './client-button'

async function fetchTitle() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
    cache: 'no-store',
  })

  if (!res.ok) {
    console.error(
      '[RSC] ServerPage fetchTitle failed:',
      res.status,
      res.statusText,
    )
    throw new Error('无法获取示例标题数据')
  }

  return res.json()
}

export default async function ServerPage() {
  const data = await fetchTitle()

  console.log('[RSC] ServerPage fetchTitle result:', data)

  return (
    <div
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <section
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h1 style={{ fontSize: 28, margin: 0 }}>RSC Demo 页面</h1>
        <p style={{ fontSize: 16, lineHeight: 1.7 }}>
          服务器数据：{data.title}
        </p>

        <ServerChild parentTitle={data.title} />

        <ClientButton label="点我查看客户端渲染" />
      </section>

      <section
        style={{
          display: 'grid',
          gap: 20,
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
            title="服务器页面入口"
            file="src/app/rsc-demo/page.tsx"
            description="服务器组件负责获取数据并串联 Server/Client 子组件。"
          />
          <CodePreview
            title="ServerChild 组件"
            file="src/app/rsc-demo/server-child.tsx"
            description="在服务器侧生成时间戳，观察 Flight 数据中的嵌套节点。"
          />
          <CodePreview
            title="ClientButton 组件"
            file="src/app/rsc-demo/client-button.tsx"
            description="客户端组件响应点击事件，展示 hydration 后的交互。"
          />
        </div>
      </section>
    </div>
  )
}

