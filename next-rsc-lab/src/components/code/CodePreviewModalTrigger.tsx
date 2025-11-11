'use client'

import { useState } from 'react'
import CodeHighlight from './CodeHighlight'

type Props = {
  code: string
  language: string
  title: string
  file: string
}

export default function CodePreviewModalTrigger({ code, language, title, file }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          borderRadius: 999,
          border: '1px solid rgba(148,163,184,0.4)',
          background: 'rgba(37,99,235,0.12)',
          color: '#1d4ed8',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
          transition: 'background 0.18s ease, transform 0.18s ease',
          whiteSpace: 'nowrap',
        }}
      >
        查看代码
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.55)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              maxWidth: 'min(1080px, 100%)',
              width: '100%',
              background: '#0b1120',
              borderRadius: 18,
              border: '1px solid rgba(148,163,184,0.35)',
              boxShadow: '0 32px 80px rgba(15,23,42,0.35)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <header
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid rgba(148,163,184,0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                color: '#e2e8f0',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, letterSpacing: '0.12em', color: '#94a3b8' }}>{file}</span>
                <h3 style={{ margin: 0, fontSize: 20 }}>{title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(148,163,184,0.2)',
                  color: '#cbd5f5',
                  borderRadius: 999,
                  border: '1px solid rgba(148,163,184,0.35)',
                  fontSize: 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                关闭
              </button>
            </header>
            <div
              style={{
                padding: 0,
                maxHeight: '70vh',
                overflow: 'auto',
              }}
            >
              <CodeHighlight language={language} code={code} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

