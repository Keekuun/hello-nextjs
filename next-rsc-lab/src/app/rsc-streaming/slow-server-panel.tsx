export default async function SlowServerPanel() {
  const start = Date.now()

  console.log('[RSC][Streaming] SlowServerPanel 开始阻塞:', start)

  await new Promise((resolve) => setTimeout(resolve, 3000))

  const end = Date.now()
  const iso = new Date(end).toISOString()

  console.log('[RSC][Streaming] SlowServerPanel 数据准备完成:', iso)

  return (
    <div className="rounded-lg border border-emerald-400 bg-emerald-50 p-4 text-emerald-800">
      <h3 className="m-0 mb-2 text-lg font-semibold">SlowServerPanel</h3>
      <p className="m-0">数据准备时间：{iso}</p>
      <p className="m-0">服务器阻塞时长：{((end - start) / 1000).toFixed(2)} 秒</p>
    </div>
  )
}

