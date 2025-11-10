import CodePreview from '../../components/code/CodePreview'
import NotesBoard from './notes-board'
import { listNotes } from './actions'

export default async function OptimisticActionsPage() {
  const initialNotes = await listNotes()

  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'sans-serif',
        maxWidth: 960,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <header
        style={{
          background: '#f8fafc',
          borderRadius: 12,
          padding: 24,
          border: '1px solid #e2e8f0',
        }}
      >
        <h1>Server Actions 乐观更新实验</h1>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          本示例演示如何结合 <code>useOptimistic</code>、Server Actions 与{' '}
          <code>revalidatePath</code> 实现即时反馈。提交表单后立即看到临时数据，
          等待服务器写入完成后再替换为真实返回值，避免界面跳动。
        </p>
        <ul style={{ marginTop: 16, color: '#64748b', lineHeight: 1.7 }}>
          <li>客户端使用 <code>useOptimistic</code> 创建临时笔记，提供瞬时反馈</li>
          <li>Server Action 完成后会 revalidate 当前页面，确保后续请求看到最新数据</li>
          <li>若后端校验失败，临时笔记会被移除，并显示错误信息</li>
        </ul>
      </header>

      <NotesBoard initialNotes={initialNotes} />

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

