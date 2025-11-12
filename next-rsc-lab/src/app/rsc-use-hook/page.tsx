import CodePreview from '../../components/code/CodePreview'
import UseHookDemo from './use-hook-demo'

export default function UseHookPage() {
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-6 p-6">
      <header>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">React 19 use() Hook 实验</h1>
        <p className="leading-relaxed text-slate-600">
          React 19 引入了 <code className="rounded bg-slate-100 px-1 py-0.5">use()</code> Hook，用于在组件中直接使用 Promise 和 Context。
          它可以在条件语句和循环中使用，支持 Suspense 边界，是处理异步数据的新方式。
        </p>
      </header>

      <section className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="mb-3 text-xl font-semibold">use() Hook 特性</h2>
        <ul className="list-inside list-disc space-y-2 leading-relaxed text-slate-700">
          <li>
            <strong>直接使用 Promise：</strong>无需 <code className="rounded bg-blue-100 px-1 py-0.5">useEffect</code> 或状态管理，直接在组件中使用 Promise
          </li>
          <li>
            <strong>条件使用：</strong>可以在 <code className="rounded bg-blue-100 px-1 py-0.5">if</code> 语句和循环中使用
          </li>
          <li>
            <strong>Suspense 集成：</strong>自动与 Suspense 边界配合，显示 fallback
          </li>
          <li>
            <strong>Context 支持：</strong>也可以用于读取 Context 值
          </li>
          <li>
            <strong>错误处理：</strong>配合 Error Boundary 处理 Promise rejection
          </li>
        </ul>
      </section>

      <UseHookDemo />

      <section className="grid gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CodePreview
            title="use() Hook 基础用法"
            file="src/app/rsc-use-hook/use-hook-demo.tsx"
            description="演示 use() Hook 直接使用 Promise，无需 useEffect 和状态管理。"
          />
          <CodePreview
            title="条件使用 use()"
            file="src/app/rsc-use-hook/use-hook-demo.tsx"
            description="展示 use() 在条件语句中的使用，这是与 async/await 的重要区别。"
          />
          <CodePreview
            title="Suspense 集成"
            file="src/app/rsc-use-hook/use-hook-demo.tsx"
            description="use() 自动与 Suspense 边界配合，显示加载状态。"
          />
        </div>
      </section>
    </main>
  )
}

