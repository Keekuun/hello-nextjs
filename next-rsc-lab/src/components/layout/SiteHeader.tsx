'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useMemo, useRef, useState, useEffect } from 'react'

type NavItem = {
  href: string
  label: string
}

type NavGroup = {
  label: '核心概念' | '数据流' | '性能调试' | 'API & 底层'
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: '核心概念',
    items: [
      { href: '/rsc-demo', label: 'RSC 基础 Demo' },
      { href: '/rsc-streaming', label: 'Streaming Suspense' },
      { href: '/rsc-actions', label: 'Server Actions' },
      { href: '/rsc-actions-optimistic', label: 'Optimistic Actions' },
      { href: '/rsc-ppr', label: 'Partial Prerendering' },
    ],
  },
  {
    label: '数据流',
    items: [
      { href: '/rsc-edge', label: 'Edge Runtime' },
      { href: '/rsc-flight-viewer', label: 'Flight 数据可视化' },
      { href: '/rsc-flight-recorder', label: 'Flight Recorder' },
    ],
  },
  {
    label: '性能调试',
    items: [{ href: '/rsc-performance', label: '性能监控' }],
  },
  {
    label: 'API & 底层',
    items: [{ href: '/api-lifecycle', label: 'API 生命周期实验' }],
  },
]

const extraLinks: NavItem[] = [
  { href: '/guide', label: '实验指南' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMobile = useRef(false)

  useEffect(() => {
    const update = () => {
      isMobile.current = window.matchMedia('(max-width: 960px)').matches
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const activeMap = useMemo(() => {
    const map = new Map<string, boolean>()
    navGroups.forEach((group) => {
      group.items.forEach((item) => {
        map.set(item.href, pathname.startsWith(item.href))
      })
    })
    extraLinks.forEach((link) => {
      map.set(link.href, pathname.startsWith(link.href))
    })
    map.set('/', pathname === '/')
    return map
  }, [pathname])

  const handleToggleNav = () => {
    setIsOpen((prev) => {
      const next = !prev
      if (!next) {
        setOpenGroup(null)
      }
      return next
    })
  }

  const closeNav = () => {
    setIsOpen(false)
    setOpenGroup(null)
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
  }

  const handleGroupClick = (label: string) => {
    if (!isOpen && isMobile.current) {
      setIsOpen(true)
    }
    setOpenGroup((prev) => (prev === label ? null : label))
  }

  const handleGroupMouseEnter = (label: string) => {
    if (isMobile.current) return
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
    setOpenGroup(label)
  }

  const handleGroupMouseLeave = () => {
    if (isMobile.current) return
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current)
    }
    hoverTimer.current = setTimeout(() => {
      setOpenGroup(null)
      hoverTimer.current = null
    }, 180)
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand" onClick={closeNav}>
          <div className="site-header__brandmark">
            <Image src="/logo.svg" alt="Next.js RSC Lab" width={36} height={36} priority />
          </div>
          <div className="site-header__brandtext">
            <span className="site-header__logo">Next.js RSC Lab</span>
            <span className="site-header__subtitle">React Server Components 实验室</span>
          </div>
        </Link>

        <button
          className="site-header__toggle"
          type="button"
          aria-label="切换导航"
          aria-expanded={isOpen}
          onClick={handleToggleNav}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="site-header__nav" data-open={isOpen}>
          {navGroups.map((group) => {
            const groupActive = group.items.some((item) => activeMap.get(item.href))
            const groupOpen = openGroup === group.label
            return (
              <div
                key={group.label}
                className="site-header__group"
                data-active={groupActive}
                data-open={groupOpen}
                onMouseEnter={() => handleGroupMouseEnter(group.label)}
                onMouseLeave={handleGroupMouseLeave}
              >
                <button
                  type="button"
                  className="site-header__groupButton"
                  onClick={() => handleGroupClick(group.label)}
                  aria-expanded={groupOpen}
                >
                  <span>{group.label}</span>
                  <span className="site-header__caret" aria-hidden="true" />
                </button>
                <div className="site-header__dropdown" data-open={groupOpen}>
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="site-header__sublink"
                      data-active={activeMap.get(item.href) ?? false}
                      onClick={closeNav}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}

          <div className="site-header__navDivider" aria-hidden="true" />

          {extraLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="site-header__link"
              data-active={activeMap.get(link.href) ?? false}
              onClick={closeNav}
            >
              {link.label}
            </Link>
          ))}

          <a
            href="https://github.com/Keekuun/hello-nextjs/tree/main/next-rsc-lab"
            target="_blank"
            rel="noreferrer"
            className="site-header__link site-header__link--external"
            onClick={closeNav}
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  )
}

