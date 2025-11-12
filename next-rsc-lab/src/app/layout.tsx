import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import SiteHeader from '../components/layout/SiteHeader'
import RouteTransition from '../components/layout/RouteTransition'
import RouteProgress from '../components/layout/RouteProgress'
import ServiceWorkerRegister from '../components/layout/ServiceWorkerRegister'
import VersionNotifier from '../components/layout/VersionNotifier'
import PwaInstallPrompt from '../components/layout/PwaInstallPrompt'
import BackToTop from '../components/layout/BackToTop'
import { BUILD_VERSION } from '@/lib/version'
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

const isDevelopment = process.env.NODE_ENV === 'development'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="app-version" content={BUILD_VERSION} />
        <link rel="icon" href="/favicon.ico" />
        {!isDevelopment && <link rel="manifest" href="/manifest.json" />}
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          跳到主要内容
        </a>
        <div className="app-shell">
          {!isDevelopment && <ServiceWorkerRegister />}
          <RouteProgress />
          {!isDevelopment && <VersionNotifier />}
          {!isDevelopment && <PwaInstallPrompt />}
          <BackToTop />
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
