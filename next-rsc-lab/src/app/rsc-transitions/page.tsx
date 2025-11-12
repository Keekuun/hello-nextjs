import CodePreview from '../../components/code/CodePreview'
import TransitionsDemo from './transitions-demo'

export default function TransitionsPage() {
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-6 p-6">
      <header>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">React 并发特性实验</h1>
        <p className="leading-relaxed text-slate-600">
          探索 React 18+ 的并发特性：<code className="rounded bg-slate-100 px-1 py-0.5">useTransition</code> 和{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5">useDeferredValue</code>。
          这些 Hook 让你可以标记非紧急更新，保持 UI 响应性。
        </p>
      </header>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
        <h2 className="mb-3 text-xl font-semibold">并发特性说明</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold text-indigo-900">useTransition</h3>
            <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-indigo-700">
              <li>标记状态更新为"过渡"（非紧急）</li>
              <li>返回 <code className="rounded bg-indigo-100 px-1 py-0.5">isPending</code> 状态</li>
              <li>允许在更新期间保持 UI 响应</li>
              <li>适合列表过滤、搜索等场景</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-indigo-900">useDeferredValue</h3>
            <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-indigo-700">
              <li>延迟更新值，直到紧急更新完成</li>
              <li>自动处理过渡状态</li>
              <li>适合输入框、自动完成等场景</li>
              <li>与 useTransition 类似，但用于值而非状态更新</li>
            </ul>
          </div>
        </div>
      </section>

      <TransitionsDemo />

      <section className="grid gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CodePreview
            title="useTransition 基础用法"
            file="src/app/rsc-transitions/transitions-demo.tsx"
            description="使用 useTransition 标记非紧急更新，保持 UI 响应性。"
          />
          <CodePreview
            title="useDeferredValue 用法"
            file="src/app/rsc-transitions/transitions-demo.tsx"
            description="使用 useDeferredValue 延迟更新值，优化输入体验。"
          />
          <CodePreview
            title="性能对比"
            file="src/app/rsc-transitions/transitions-demo.tsx"
            description="对比使用并发特性前后的性能差异。"
          />
        </div>
      </section>
    </main>
  )
}

