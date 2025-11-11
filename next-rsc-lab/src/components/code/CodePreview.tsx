import { cache } from 'react'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import CodeHighlight from './CodeHighlight'
import CodePreviewModalTrigger from './CodePreviewModalTrigger'

type Props = {
  title: string
  file: string
  language?: string
  lines?: [number, number]
  description?: string
}

const REPO_BASE_URL =
  'https://github.com/Keekuun/hello-nextjs/blob/main/next-rsc-lab/'

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

  const lineCount = display.split('\n').length
  const shouldClamp = lineCount > 24

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
          position: 'relative',
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
        <a
          href={`${REPO_BASE_URL}${file}`}
          target="_blank"
          rel="noreferrer"
          style={{
            position: 'absolute',
            top: 18,
            right: 22,
            fontSize: 12,
            color: '#60a5fa',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          查看源码 ↗
        </a>
      </header>

      <div
        style={{
          padding: 0,
          position: 'relative',
          maxHeight: shouldClamp ? 320 : undefined,
          overflow: shouldClamp ? 'hidden' : undefined,
        }}
      >
        <CodeHighlight language={language} code={display} />
        {shouldClamp && (
          <div
            style={{
              position: 'absolute',
              inset: 'auto 0 0 0',
              height: 72,
              background:
                'linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.92) 80%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderTop: '1px solid rgba(148,163,184,0.2)',
          background: '#f8fafc',
        }}
      >
        <span style={{ fontSize: 12, color: '#475569' }}>
          显示 {lineCount} 行 ·{' '}
          {shouldClamp ? '内容已折叠，可放大查看完整代码' : '当前已展示全部代码'}
        </span>
        <CodePreviewModalTrigger code={source} language={language} title={title} file={file} />
      </footer>
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

