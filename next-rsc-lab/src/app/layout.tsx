import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import SiteHeader from '../components/layout/SiteHeader'
import RouteTransition from '../components/layout/RouteTransition'
import RouteProgress from '../components/layout/RouteProgress'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Next.js RSC Lab',
  description:
    '一个拆解 React Server Components、Next.js App Router 与底层运行原理的实验项目。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          跳到主要内容
        </a>
        <div className="app-shell">
          <RouteProgress />
          <SiteHeader />
          <main id="main-content" className="app-main">
            <RouteTransition>{children}</RouteTransition>
          </main>
          <footer className="site-footer flex justify-center items-center text-center">
            <div className="flex justify-center">
              <span>Next.js RSC Lab © {new Date().getFullYear()}</span>
              <span className="site-footer__divider" aria-hidden="true">
                ·
              </span>
              <a
                href="https://github.com/Keekuun/hello-nextjs/tree/main/next-rsc-lab"
                target="_blank"
                rel="noreferrer"
              >
                GitHub 仓库
              </a>
            </div>
            <p>跟随导航逐步探索 RSC、Server Actions、Streaming 与 Next.js 底层机制。</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
