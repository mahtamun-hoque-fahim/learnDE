'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

declare global {
  interface Window { katex: { render: (s: string, el: HTMLElement, o: object) => void } }
}

function MathText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!ref.current || !text) return
    const el = ref.current
    const init = () => {
      if (!window.katex) { setTimeout(init, 60); return }
      el.querySelectorAll('[data-m]').forEach(node => {
        const disp = node.getAttribute('data-d') === '1'
        const m = node.getAttribute('data-m') || ''
        try { window.katex.render(m, node as HTMLElement, { displayMode: disp, throwOnError: false }) } catch {}
      })
    }
    init()
  }, [text])

  const parts: React.ReactNode[] = []
  const segs = text.split(/((?:\$\$[\s\S]+?\$\$)|(?:\$[^$]+?\$))/g)
  segs.forEach((seg, i) => {
    if (seg.startsWith('$$') && seg.endsWith('$$')) {
      parts.push(<span key={i} data-m={seg.slice(2, -2)} data-d="1" className="block" />)
    } else if (seg.startsWith('$') && seg.endsWith('$')) {
      parts.push(<span key={i} data-m={seg.slice(1, -1)} data-d="0" className="inline" />)
    } else { parts.push(<span key={i}>{seg}</span>) }
  })
  return <span ref={ref}>{parts}</span>
}

type CheatSection = {
  title: string
  formula: string
  steps: string[]
  tip: string
}

export default function CheatSheetPage() {
  const [sections, setSections] = useState<CheatSection[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cheatsheet', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      const data = await res.json()
      setSections(data.sections || [])
      setLoaded(true)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-white/50 hover:text-white flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
          <span className="font-syne text-sm text-white/40">Cheat Sheet</span>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-5 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-syne font-bold text-2xl text-white mb-1">📋 Exam Cheat Sheet</h1>
          <p className="text-white/40 text-sm">AI-generated quick reference for all DE methods</p>
        </div>

        {!loaded ? (
          <div className="text-center py-16">
            <p className="text-white/40 text-sm mb-6">Generate a personalized cheat sheet covering all 5 key methods from your course.</p>
            <button onClick={generate} disabled={loading}
              className="px-8 py-3 bg-[#00e676] text-black font-semibold rounded-full text-sm disabled:opacity-60">
              {loading ? 'Generating...' : '✦ Generate Cheat Sheet'}
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {sections.map((sec, i) => (
              <div key={i} className="rounded-xl border border-white/8 bg-white/4 p-5">
                <h2 className="font-syne font-semibold text-white mb-3">{sec.title}</h2>
                <div className="math-block mb-4">
                  <MathText text={sec.formula} />
                </div>
                <div className="space-y-1.5 mb-4">
                  {sec.steps.map((step, si) => (
                    <div key={si} className="flex gap-2 text-sm text-white/60">
                      <span className="text-[#00e676]/60 font-mono text-xs mt-0.5">{si + 1}.</span>
                      <span><MathText text={step} /></span>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg bg-[#00e676]/5 border border-[#00e676]/10">
                  <span className="text-xs text-[#00e676] font-medium">💡 Exam tip: </span>
                  <span className="text-xs text-white/50"><MathText text={sec.tip} /></span>
                </div>
              </div>
            ))}

            <button onClick={generate} disabled={loading}
              className="text-xs text-white/30 hover:text-white/50 text-center py-2">
              {loading ? 'Regenerating...' : '↺ Regenerate'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
