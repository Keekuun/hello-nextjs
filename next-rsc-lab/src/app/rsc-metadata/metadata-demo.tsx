'use client'

import { useEffect, useState } from 'react'

export default function MetadataDemo() {
  const [metadata, setMetadata] = useState<{
    title: string | null
    description: string | null
    ogTitle: string | null
    ogDescription: string | null
    canonical: string | null
  } | null>(null)

  useEffect(() => {
    // 从 DOM 中读取元数据
    const title = document.querySelector('title')?.textContent || null
    const description =
      document.querySelector('meta[name="description"]')?.getAttribute('content') || null
    const ogTitle =
      document.querySelector('meta[property="og:title"]')?.getAttribute('content') || null
    const ogDescription =
      document.querySelector('meta[property="og:description"]')?.getAttribute('content') || null
    const canonical =
      document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null

    setMetadata({
      title,
      description,
      ogTitle,
      ogDescription,
      canonical,
    })
  }, [])

  return (
    <section className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6">
      <header>
        <h2 className="mb-2 text-xl font-semibold">当前页面元数据</h2>
        <p className="text-sm leading-relaxed text-slate-600">
          以下是从 DOM 中读取的实际元数据标签。打开浏览器开发者工具查看完整的 head 标签。
        </p>
      </header>

      {metadata ? (
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div>
            <h3 className="mb-1 text-sm font-semibold text-slate-900">基础元数据</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium text-slate-600">Title:</span>{' '}
                <span className="text-slate-800">{metadata.title || '未设置'}</span>
              </div>
              <div>
                <span className="font-medium text-slate-600">Description:</span>{' '}
                <span className="text-slate-800">{metadata.description || '未设置'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-1 text-sm font-semibold text-slate-900">Open Graph</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium text-slate-600">OG Title:</span>{' '}
                <span className="text-slate-800">{metadata.ogTitle || '未设置'}</span>
              </div>
              <div>
                <span className="font-medium text-slate-600">OG Description:</span>{' '}
                <span className="text-slate-800">{metadata.ogDescription || '未设置'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-1 text-sm font-semibold text-slate-900">其他</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium text-slate-600">Canonical URL:</span>{' '}
                <span className="text-slate-800">{metadata.canonical || '未设置'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-center text-amber-700">
          正在读取元数据...
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="m-0 mb-2 font-semibold">💡 如何验证：</p>
        <ol className="list-inside list-decimal space-y-1">
          <li>打开浏览器开发者工具 (F12)</li>
          <li>查看 Elements 标签页中的 &lt;head&gt; 部分</li>
          <li>检查 <code className="rounded bg-slate-200 px-1 py-0.5">&lt;title&gt;</code>、{' '}
            <code className="rounded bg-slate-200 px-1 py-0.5">&lt;meta&gt;</code> 和{' '}
            <code className="rounded bg-slate-200 px-1 py-0.5">&lt;link&gt;</code> 标签
          </li>
          <li>使用社交媒体调试工具（如 Facebook Debugger）验证 OG 标签</li>
        </ol>
      </div>
    </section>
  )
}

