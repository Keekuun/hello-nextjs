type Props = {
  parentTitle: string
}

export default async function ServerChild({ parentTitle }: Props) {
  const time = new Date().toISOString()

  console.log('[RSC] ServerChild render at', time)

  return (
    <section className="mt-4 rounded-lg border border-gray-400 p-4">
      <h2 className="mb-2 text-lg font-semibold">ServerChild 组件</h2>
      <p className="mb-1 text-sm">接收到的标题：{parentTitle}</p>
      <p className="text-sm text-gray-600">服务器渲染时间：{time}</p>
    </section>
  )
}

