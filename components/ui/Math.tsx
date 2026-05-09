'use client'
import { useEffect, useRef } from 'react'

interface MathProps {
  math: string
  display?: boolean
  className?: string
}

declare global {
  interface Window {
    katex: {
      render: (math: string, el: HTMLElement, opts: object) => void
    }
  }
}

export function Math({ math, display = false, className = '' }: MathProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const render = () => {
      if (window.katex && ref.current) {
        try {
          window.katex.render(math, ref.current, {
            displayMode: display,
            throwOnError: false,
          })
        } catch {}
      }
    }
    if (window.katex) {
      render()
    } else {
      const check = setInterval(() => {
        if (window.katex) {
          render()
          clearInterval(check)
        }
      }, 50)
      return () => clearInterval(check)
    }
  }, [math, display])

  return <span ref={ref} className={className} />
}

export function MathBlock({ math, className = '' }: { math: string; className?: string }) {
  return (
    <div className={`math-block ${className}`}>
      <Math math={math} display={true} />
    </div>
  )
}
