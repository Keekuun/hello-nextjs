import { cache } from 'react'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import CodeHighlight from './CodeHighlight'

type Props = {
  title: string
  file: string
  language?: string
  lines?: [number, number]
  description?: string
}

const readCodeFile = cache(async (absolutePath: string) => {
  const content = await readFile(absolutePath, 'utf-8')
  return content
})

export default async function CodePreview({
  title,
  file,
  language = inferLanguage(file),
  lines,
  description,
}: Props) {
  const absolute = path.join(process.cwd(), file)
  const source = await readCodeFile(absolute)

  let display = source
  if (lines) {
    const [start, end] = lines
    const list = source.split('\n')
    const sliced = list.slice(Math.max(0, start - 1), end)
    display = sliced.join('\n')
  }

  return (
    <article
      style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid rgba(148,163,184,0.25)',
        boxShadow: '0 18px 40px rgba(15,23,42,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          padding: '18px 22px',
          background: 'linear-gradient(135deg,#0f172a,#1e293b)',
          color: '#e2e8f0',
        }}
      >
        <span
          style={{
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#94a3b8',
          }}
        >
          {file}
        </span>
        <h3 style={{ margin: 0, fontSize: 20 }}>{title}</h3>
        {description && (
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.6,
              color: '#cbd5f5',
            }}
          >
            {description}
          </p>
        )}
      </header>

      <div style={{ padding: 0 }}>
        <CodeHighlight language={language} code={display} />
      </div>
    </article>
  )
}

function inferLanguage(file: string) {
  if (file.endsWith('.ts') || file.endsWith('.tsx')) return 'tsx'
  if (file.endsWith('.js') || file.endsWith('.jsx')) return 'javascript'
  if (file.endsWith('.json')) return 'json'
  if (file.endsWith('.css')) return 'css'
  if (file.endsWith('.md')) return 'markdown'
  return 'tsx'
}

