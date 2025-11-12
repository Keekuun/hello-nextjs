import { Metadata } from 'next'
import CodePreview from '../../components/code/CodePreview'
import MetadataDemo from './metadata-demo'

// 动态生成元数据
export async function generateMetadata(): Promise<Metadata> {
  const timestamp = new Date().toISOString()

  return {
    title: `元数据实验 - ${timestamp}`,
    description: '演示 Next.js Metadata API 的动态生成和 SEO 优化',
    openGraph: {
      title: 'Next.js Metadata API 实验',
      description: '探索动态元数据生成、Open Graph 和 Twitter Cards',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Next.js RSC Lab',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Next.js Metadata API 实验',
      description: '探索动态元数据生成',
    },
    alternates: {
      canonical: 'https://example.com/rsc-metadata',
    },
  }
}

export default function MetadataPage() {
  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-6 p-6">
      <header>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Metadata API 实验</h1>
        <p className="leading-relaxed text-slate-600">
          Next.js 13+ 的 Metadata API 让你可以在 Server Components 中动态生成 SEO 元数据、
          Open Graph 标签和 Twitter Cards。支持静态和动态元数据生成。
        </p>
      </header>

      <section className="rounded-xl border border-teal-200 bg-teal-50 p-6">
        <h2 className="mb-3 text-xl font-semibold">Metadata API 特性</h2>
        <ul className="list-inside list-disc space-y-2 leading-relaxed text-slate-700">
          <li>
            <strong>静态元数据：</strong>在 <code className="rounded bg-teal-100 px-1 py-0.5">layout.tsx</code> 或{' '}
            <code className="rounded bg-teal-100 px-1 py-0.5">page.tsx</code> 中导出 <code className="rounded bg-teal-100 px-1 py-0.5">metadata</code> 对象
          </li>
          <li>
            <strong>动态元数据：</strong>导出 <code className="rounded bg-teal-100 px-1 py-0.5">generateMetadata</code> 函数，异步生成元数据
          </li>
          <li>
            <strong>Open Graph：</strong>自动生成 OG 标签，优化社交媒体分享
          </li>
          <li>
            <strong>Twitter Cards：</strong>支持 Twitter 卡片格式
          </li>
          <li>
            <strong>结构化数据：</strong>支持 JSON-LD 等结构化数据格式
          </li>
        </ul>
      </section>

      <MetadataDemo />

      <section className="grid gap-5">
        <h2 className="m-0 text-xl font-semibold sm:text-2xl">关键代码预览</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <CodePreview
            title="generateMetadata 函数"
            file="src/app/rsc-metadata/page.tsx"
            description="使用 generateMetadata 动态生成页面元数据，支持异步数据获取。"
          />
          <CodePreview
            title="Open Graph 配置"
            file="src/app/rsc-metadata/page.tsx"
            description="配置 Open Graph 标签，优化社交媒体分享体验。"
          />
          <CodePreview
            title="元数据查看器"
            file="src/app/rsc-metadata/metadata-demo.tsx"
            description="客户端组件展示当前页面的元数据信息。"
          />
        </div>
      </section>
    </main>
  )
}

