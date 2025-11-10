import FormPanel from './form-panel'
import ResultStream from './result-stream'

export default function ActionsPage() {
  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        maxWidth: 960,
        margin: '0 auto',
      }}
    >
      <header>
        <h1>Server Actions Demo</h1>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          通过原生表单触发 `'use server'` 函数，观察 RSC Flight
          如何携带表单结果回传，并驱动 UI 刷新。
        </p>
      </header>

      <FormPanel />
      <ResultStream />
    </main>
  )
}

