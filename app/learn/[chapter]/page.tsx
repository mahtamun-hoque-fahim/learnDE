'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { CHAPTERS, Chapter } from '@/lib/chapters'

declare global {
  interface Window {
    katex: { render: (s: string, el: HTMLElement, o: object) => void }
  }
}

function renderMath(el: HTMLElement) {
  if (!window.katex || !el) return
  el.querySelectorAll('[data-math]').forEach(node => {
    const display = node.getAttribute('data-display') === 'true'
    const math = node.getAttribute('data-math') || ''
    try {
      window.katex.render(math, node as HTMLElement, { displayMode: display, throwOnError: false })
    } catch {}
  })
}

function MathText({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  const segments = text.split(/((?:\$\$[\s\S]+?\$\$)|(?:\$[^$]+?\$)|(?:\*\*[^*]+?\*\*)|(?:\*[^*]+?\*))/g)
  segments.forEach((seg, i) => {
    if (seg.startsWith('$$') && seg.endsWith('$$')) {
      const math = seg.slice(2, -2)
      parts.push(
        <span key={i} className="block math-block my-2" data-math={math} data-display="true" />
      )
    } else if (seg.startsWith('$') && seg.endsWith('$')) {
      const math = seg.slice(1, -1)
      parts.push(<span key={i} data-math={math} data-display="false" className="inline" />)
    } else if (seg.startsWith('**') && seg.endsWith('**')) {
      parts.push(<strong key={i} className="text-white font-semibold">{seg.slice(2, -2)}</strong>)
    } else if (seg.startsWith('*') && seg.endsWith('*')) {
      parts.push(<em key={i}>{seg.slice(1, -1)}</em>)
    } else {
      parts.push(<span key={i}>{seg}</span>)
    }
  })
  return <>{parts}</>
}

function ChapterContent({ chapter }: { chapter: Chapter }) {
  const contentRef = (el: HTMLDivElement | null) => {
    if (!el) return
    const init = () => {
      if (window.katex) renderMath(el)
      else setTimeout(init, 50)
    }
    init()
  }

  return (
    <div ref={contentRef} className="space-y-8">
      {chapter.sections.map((section, si) => (
        <div key={si}>
          <h2 className="font-syne font-semibold text-lg text-white mb-3">{section.title}</h2>

          {/* Body text with math */}
          <div className="text-white/60 text-sm leading-relaxed space-y-2">
            {section.body.split('\n').map((line, li) => (
              line.trim() ? (
                <p key={li}><MathText text={line} /></p>
              ) : <br key={li} />
            ))}
          </div>

          {/* Cards */}
          {section.cards && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
              {section.cards.map((card, ci) => (
                <div key={ci} className="rounded-lg border border-white/8 bg-white/4 p-3">
                  <div className="text-xs font-medium text-white mb-2">{card.title}</div>
                  <div className="text-xs text-white/50">
                    <MathText text={card.content} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table */}
          {section.table && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    {section.table.headers.map(h => (
                      <th key={h} className="text-left text-xs text-white/40 font-medium pb-2 border-b border-white/8 pr-6">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-white/5">
                      {row.map((cell, ci) => (
                        <td key={ci} className="py-2.5 pr-6 text-white/60 text-sm">
                          <MathText text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Examples */}
          {section.examples?.map((ex, ei) => (
            <div key={ei} className="mt-4 rounded-xl border border-white/8 overflow-hidden">
              <div className="px-4 py-2 bg-white/3 border-b border-white/8">
                <span className="text-xs text-[#00e676] font-medium uppercase tracking-wide">{ex.label}</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-white/70 mb-4">
                  <MathText text={ex.problem} />
                </p>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm text-white/50 hover:text-white/80 transition-colors list-none select-none">
                    <span>Show step-by-step solution</span>
                    <span className="text-lg group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="mt-3 space-y-2">
                    {ex.steps.map((step, sti) => (
                      <div key={sti} className="border-l-2 border-[#00e676]/30 pl-3 py-1">
                        <div className="text-[10px] text-white/30 font-medium mb-0.5 uppercase tracking-wide">{step.label}</div>
                        <div className="text-sm text-white/60">
                          <MathText text={step.content} />
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function ChapterPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.chapter as string
  const chapter = CHAPTERS.find(c => c.slug === slug)
  const [marked, setMarked] = useState(false)
  const [marking, setMarking] = useState(false)

  const chapterIndex = CHAPTERS.findIndex(c => c.slug === slug)
  const prev = chapterIndex > 0 ? CHAPTERS[chapterIndex - 1] : null
  const next = chapterIndex < CHAPTERS.length - 1 ? CHAPTERS[chapterIndex + 1] : null

  useEffect(() => { setMarked(false) }, [slug])

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">Chapter not found</p>
          <Link href="/learn" className="text-[#00e676] text-sm">← Back to course</Link>
        </div>
      </div>
    )
  }

  const markComplete = async () => {
    setMarking(true)
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterSlug: slug }),
      })
      setMarked(true)
    } catch {}
    setMarking(false)
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <Link href="/learn" className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All chapters
          </Link>
          <span className="font-syne text-sm text-white/40">
            Ch {chapter.order} of {CHAPTERS.length}
          </span>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-5 max-w-3xl mx-auto">
        {/* Chapter header */}
        <div className="mb-8">
          <div className="text-xs text-[#00e676] mb-2">Chapter {chapter.order}</div>
          <h1 className="font-syne font-bold text-2xl md:text-3xl text-white mb-2">{chapter.title}</h1>
          {chapter.ref && <p className="text-sm text-white/30">{chapter.ref}</p>}
          <p className="text-sm text-white/40 mt-2 italic">{chapter.summary}</p>
        </div>

        {/* Content */}
        <ChapterContent chapter={chapter} />

        {/* Actions */}
        <div className="mt-10 pt-6 border-t border-white/8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={markComplete}
              disabled={marked || marking}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${marked ? 'bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20' : 'bg-[#00e676] text-black hover:opacity-90'} disabled:cursor-default`}
            >
              {marked ? '✓ Marked as read' : marking ? 'Saving...' : '✓ Mark as read'}
            </button>
            <Link href={`/quiz/${slug}`}
              className="px-5 py-2.5 rounded-lg text-sm font-medium border border-[#00e676]/30 text-[#00e676] hover:bg-[#00e676]/5 transition-colors">
              Take quiz for this chapter →
            </Link>
          </div>

          {/* Prev / Next */}
          <div className="flex justify-between mt-6">
            {prev ? (
              <Link href={`/learn/${prev.slug}`} className="text-sm text-white/40 hover:text-white transition-colors">
                ← {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/learn/${next.slug}`} className="text-sm text-white/40 hover:text-white transition-colors">
                {next.title} →
              </Link>
            ) : (
              <Link href="/learn" className="text-sm text-white/40 hover:text-white transition-colors">
                All chapters →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
