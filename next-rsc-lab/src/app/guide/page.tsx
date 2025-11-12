import { cache } from 'react'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const readReadme = cache(async () => {
  const root = process.cwd()
  const filePath = path.join(root, 'README.md')

  try {
    const content = await readFile(filePath, 'utf-8')
    return content
  } catch (error) {
    console.error('[Guide] 无法读取 README.md', error)
    return 'README.md 暂时无法读取，请检查文件是否存在。'
  }
})

export default async function GuidePage() {
  const readme = await readReadme()

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-8 sm:py-20 md:px-8 md:py-24">
      <section className="mx-auto grid max-w-[1040px] gap-6">
        <header className="rounded-2xl bg-slate-900 px-4 py-9 text-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.35)] sm:px-8">
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">实验指南</h1>
          <p className="text-lg leading-relaxed text-blue-200">
            下方内容来自项目根目录的 <code className="rounded bg-slate-800 px-1 py-0.5">README.md</code>，涵盖所有实验的操作说明与拓展建议。
            建议在阅读指南的同时，配合首页的实验导航逐一实践。
          </p>
        </header>

        <article className="rounded-2xl border border-slate-300/25 bg-white p-7 shadow-[0_18px_40px_rgba(15,23,42,0.12)] sm:p-8">
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
          </div>
        </article>
      </section>
    </main>
  )
}

