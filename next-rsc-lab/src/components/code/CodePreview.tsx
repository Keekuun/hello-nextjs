import {cache} from 'react'
import {readFile} from 'node:fs/promises'
import path from 'node:path'

import CodeHighlight from './CodeHighlight'
import CodePreviewModalTrigger from './CodePreviewModalTrigger'

type Props = {
  title: string
  file: string
  language?: string
  lines?: [number, number]
  description?: string
  code?: string // 可选的代码内容，用于 Edge Runtime
}

const REPO_BASE_URL =
  'https://github.com/Keekuun/hello-nextjs/blob/main/next-rsc-lab/'

export const readCodeFile = cache(async (file: string): Promise<string | null> => {
  try {
    const absolute = path.join(process.cwd(), file)
    return await readFile(absolute, 'utf-8')
  } catch {
    return null
  }
})

export default async function CodePreview({
  title,
  file,
  language = inferLanguage(file),
  lines,
  description,
  code,
}: Props) {
  // 优先使用传入的 code
  let source: string = code || ''
  
  // 如果没有提供 code，尝试读取文件（仅在非 Edge Runtime）
  if (!source) {
    const fileContent = await readCodeFile(file)
    source = fileContent || ''
  }
  
  // 如果都没有，使用占位符
  if (!source) {
    source = `// Edge Runtime 环境，无法读取文件系统\n// 请查看 GitHub 源码: ${REPO_BASE_URL}${file}`
  }

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
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-300/25 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <header className="relative flex flex-col gap-1.5 bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-4.5 text-slate-200">
        <span className="text-xs uppercase tracking-wider text-slate-400">
          {file}
        </span>
        <h3 className="m-0 text-xl font-semibold">{title}</h3>
        {description && (
          <p className="m-0 text-sm leading-relaxed text-blue-100">
            {description}
          </p>
        )}
        <a
          href={`${REPO_BASE_URL}${file}`}
          target="_blank"
          rel="noreferrer"
          className="absolute right-5 top-4.5 text-xs font-semibold text-blue-400 no-underline hover:text-blue-300"
        >
          查看源码 ↗
        </a>
      </header>

      <div className={`relative p-0 ${shouldClamp ? 'max-h-80 overflow-hidden' : ''}`}>
        <CodeHighlight language={language} code={display} />
        {shouldClamp && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[72px] bg-gradient-to-t from-slate-900/92 to-transparent" />
        )}
      </div>

      <footer className="flex items-center justify-between border-t border-slate-300/20 bg-slate-50 px-5 py-4">
        <span className="text-xs text-slate-600">
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

