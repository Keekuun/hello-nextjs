import Link from 'next/link'
import CodePreview from '../../components/code/CodePreview'
import { labItems } from './data'

export const metadata = {
  title: 'Intercepting Routes 实验',
  description: '演示 Next.js Intercepting Routes 在模态窗口内预览详情的能力。',
}

export default function InterceptLabPage() {
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-6 p-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <h1 className="mb-3 text-3xl font-bold text-slate-900">Intercepting Routes 实验</h1>
        <p className="mb-4 leading-relaxed text-slate-600">
          Intercepting Routes 允许你在保持当前页面上下文的同时，以模态、浮层等形式预览另一个路由的内容。
          当用户刷新或直接访问该详情页时，仍然会显示完整的独立页面，保证良好的 SPA 与 SSR 体验。
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-600">
          <li>
            通过 <code className="rounded bg-slate-200 px-1 py-0.5">@modal/(.)items/[id]</code>{' '}
            拦截同级路由，构建模态窗口。
          </li>
          <li>刷新页面或新窗口打开详情时，会回退到真实的 /items/[id] 页面。</li>
          <li>结合 Parallel Routes，可实现路由级模态、预览与多列布局的组合。</li>
        </ul>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">实验数据集</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {labItems.map((item) => (
            <Link
              key={item.id}
              href={`/intercept-lab/items/${item.id}`}
              className="flex h-full flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
            >
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.summary}</p>
              </div>
              <span className="mt-auto text-xs font-medium uppercase tracking-wide text-slate-500">
                Flight 关注点：{item.flightFocus}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CodePreview
            title="InterceptLab Layout"
            file="src/app/intercept-lab/layout.tsx"
            description="定义 modal 并行路由槽位，让模态窗口与主内容共同渲染。"
          />
          <CodePreview
            title="详情页 (items/[id])"
            file="src/app/intercept-lab/items/[id]/page.tsx"
            description="独立的详情页面，刷新后仍可直接访问。"
          />
          <CodePreview
            title="Intercepting Modal"
            file="src/app/intercept-lab/@modal/(.)items/[id]/page.tsx"
            description="拦截导航，展示模态视图，并提供关闭与继续访问的交互。"
          />
        </div>
      </section>
    </main>
  )
}


