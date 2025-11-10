type Props = {
  parentTitle: string
}

export default async function ServerChild({ parentTitle }: Props) {
  const time = new Date().toISOString()

  console.log('[RSC] ServerChild render at', time)

  return (
    <section style={{ border: '1px solid #999', padding: 16, marginTop: 16 }}>
      <h2>ServerChild 组件</h2>
      <p>接收到的标题：{parentTitle}</p>
      <p>服务器渲染时间：{time}</p>
    </section>
  )
}

