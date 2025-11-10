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
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>RSC Demo 页面</h1>
      <p>服务器数据：{data.title}</p>

      <ServerChild parentTitle={data.title} />

      <ClientButton label="点我查看客户端渲染" />
    </div>
  )
}

