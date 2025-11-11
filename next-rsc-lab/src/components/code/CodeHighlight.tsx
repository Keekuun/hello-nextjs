'use client'

import { useMemo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

type Props = {
  language?: string
  code: string
}

export default function CodeHighlight({ language = 'tsx', code }: Props) {
  const formatted = useMemo(() => code.trimEnd(), [code])

  return (
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      customStyle={{
        margin: 0,
        borderRadius: 0,
        padding: '18px 20px',
        fontSize: 13,
        lineHeight: 1.6,
        background: '#0f172a',
      }}
      wrapLongLines
      showLineNumbers
    >
      {formatted}
    </SyntaxHighlighter>
  )
}

