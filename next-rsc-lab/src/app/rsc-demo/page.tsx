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
    <div className="flex flex-col gap-6 p-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="m-0 text-2xl font-bold sm:text-3xl">RSC Demo 页面</h1>
        <p className="text-base leading-relaxed">
          服务器数据：{data.title}
        </p>

        <ServerChild parentTitle={data.title} />

        <ClientButton label="点我查看客户端渲染" />
      </section>

      <section className="grid gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

