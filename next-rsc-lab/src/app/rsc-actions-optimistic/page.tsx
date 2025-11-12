import CodePreview from '../../components/code/CodePreview'
import NotesBoard from './notes-board'
import { listNotes } from './actions'

export default async function OptimisticActionsPage() {
  const initialNotes = await listNotes()

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-6 p-6">
      <header className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Server Actions 乐观更新实验</h1>
        <p className="leading-relaxed text-slate-600">
          本示例演示如何结合 <code className="rounded bg-slate-200 px-1 py-0.5">useOptimistic</code>、Server Actions 与{' '}
          <code className="rounded bg-slate-200 px-1 py-0.5">revalidatePath</code> 实现即时反馈。提交表单后立即看到临时数据，
          等待服务器写入完成后再替换为真实返回值，避免界面跳动。
        </p>
        <ul className="mt-4 space-y-1 leading-relaxed text-slate-500">
          <li>客户端使用 <code className="rounded bg-slate-200 px-1 py-0.5">useOptimistic</code> 创建临时笔记，提供瞬时反馈</li>
          <li>Server Action 完成后会 revalidate 当前页面，确保后续请求看到最新数据</li>
          <li>若后端校验失败，临时笔记会被移除，并显示错误信息</li>
        </ul>
      </header>

      <NotesBoard initialNotes={initialNotes} />

      <section className="grid w-full gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CodePreview
            title="OptimisticActionsPage"
            file="src/app/rsc-actions-optimistic/page.tsx"
            description="服务端页面载入初始笔记，并渲染客户端乐观更新面板。"
          />
          <CodePreview
            title="notes-board.tsx"
            file="src/app/rsc-actions-optimistic/notes-board.tsx"
            description="客户端组件使用 useOptimistic / useTransition 管理临时条目与回滚。"
          />
          <CodePreview
            title="actions.ts"
            file="src/app/rsc-actions-optimistic/actions.ts"
            description="Server Action 校验与延迟模拟，完成后触发 revalidatePath。"
          />
        </div>
      </section>
    </main>
  )
}

