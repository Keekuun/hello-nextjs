import CodePreview from '../../components/code/CodePreview'
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
            title="Server Actions 页面入口"
            file="src/app/rsc-actions/page.tsx"
            description="组合表单与结果展示，构成基础的 Server Action 交互流。"
          />
          <CodePreview
            title="form-panel.tsx"
            file="src/app/rsc-actions/form-panel.tsx"
            description="表单客户端组件，使用 useActionState 捕获 actions 返回值。"
          />
          <CodePreview
            title="actions.ts"
            file="src/app/rsc-actions/actions.ts"
            description="Server Action 实现，模拟后端延迟并触发 revalidatePath。"
          />
        </div>
      </section>
    </main>
  )
}

