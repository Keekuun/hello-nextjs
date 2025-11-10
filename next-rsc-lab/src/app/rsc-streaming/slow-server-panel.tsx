export default async function SlowServerPanel() {
  const start = Date.now()

  console.log('[RSC][Streaming] SlowServerPanel 开始阻塞:', start)

  await new Promise((resolve) => setTimeout(resolve, 3000))

  const end = Date.now()
  const iso = new Date(end).toISOString()

  console.log('[RSC][Streaming] SlowServerPanel 数据准备完成:', iso)

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: '#ecfdf5',
        border: '1px solid #34d399',
        color: '#047857',
      }}
    >
      <h3 style={{ margin: '0 0 8px' }}>SlowServerPanel</h3>
      <p>数据准备时间：{iso}</p>
      <p>服务器阻塞时长：{((end - start) / 1000).toFixed(2)} 秒</p>
    </div>
  )
}

