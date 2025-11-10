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
    <main
      style={{
        padding: '72px 32px 96px',
        fontFamily: 'sans-serif',
        background: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <section
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          display: 'grid',
          gap: 24,
        }}
      >
        <header
          style={{
            background: '#0f172a',
            color: '#e2e8f0',
            borderRadius: 18,
            padding: '36px 32px',
            boxShadow: '0 24px 60px rgba(15,23,42,0.35)',
          }}
        >
          <h1 style={{ fontSize: 36, marginBottom: 12 }}>实验指南</h1>
          <p style={{ fontSize: 18, lineHeight: 1.8, color: '#bfdbfe' }}>
            下方内容来自项目根目录的 <code>README.md</code>，涵盖所有实验的操作说明与拓展建议。
            建议在阅读指南的同时，配合首页的实验导航逐一实践。
          </p>
        </header>

        <article
          style={{
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid rgba(148,163,184,0.25)',
            boxShadow: '0 18px 40px rgba(15,23,42,0.12)',
            padding: '32px 28px',
          }}
        >
          <div
            style={{
              color: '#0f172a',
              lineHeight: 1.75,
              fontSize: 15,
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
          </div>
        </article>
      </section>
    </main>
  )
}

