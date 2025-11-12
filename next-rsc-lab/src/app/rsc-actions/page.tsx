import CodePreview from '../../components/code/CodePreview'
import FormPanel from './form-panel'
import ResultStream from './result-stream'

export default function ActionsPage() {
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-6 p-6">
      <header>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Server Actions Demo</h1>
        <p className="leading-relaxed text-slate-600">
          通过原生表单触发 `'use server'` 函数，观察 RSC Flight
          如何携带表单结果回传，并驱动 UI 刷新。
        </p>
      </header>

      <FormPanel />
      <ResultStream />

      <section className="grid w-full gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

