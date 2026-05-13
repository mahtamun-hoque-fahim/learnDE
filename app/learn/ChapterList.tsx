'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

declare global {
  interface Window { katex: { render: (s: string, el: HTMLElement, o: object) => void } }
}

type ChapterItem = {
  slug: string; title: string; order: number; ref?: string; summary: string
  read: boolean; passed: boolean
}

// Inject math into summary text using the same pattern as quiz page
function injectMath(raw: string): string {
  return raw
    .replace(/d²y\/dx²/g,  '$\\dfrac{d^2y}{dx^2}$')
    .replace(/dy\/dx/g,     '$\\dfrac{dy}{dx}$')
    .replace(/dv\/dx/g,     '$\\dfrac{dv}{dx}$')
    .replace(/d\/dx/g,      '$\\dfrac{d}{dx}$')
    .replace(/∂M\/∂y/g,    '$\\partial M/\\partial y$')
    .replace(/∂N\/∂x/g,    '$\\partial N/\\partial x$')
    .replace(/([a-zA-Z\)])²/g,  (_, c) => `$${c}^2$`)
    .replace(/([a-zA-Z\)])ⁿ/g,  (_, c) => `$${c}^n$`)
    .replace(/y\^\(1-n\)/g,     '$y^{(1-n)}$')
    .replace(/e\^\(∫P dx\)/g,   '$e^{\\int P\\,dx}$')
    .replace(/e\^\(([^)]+)\)/g, (_, i) => `$e^{${i}}$`)
    .replace(/μ/g, '$\\mu$')
    .replace(/→/g, ' → ')
}

function SummaryText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const processed = injectMath(text)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const run = () => {
      if (!window.katex) { setTimeout(run, 60); return }
      el.querySelectorAll('[data-m]').forEach(node => {
        const m = node.getAttribute('data-m') || ''
        try { window.katex.render(m, node as HTMLElement, { displayMode: false, throwOnError: false }) }
        catch { (node as HTMLElement).textContent = m }
      })
    }
    run()
  }, [processed])

  const segs = processed.split(/(\$[^$]+?\$)/g)
  return (
    <span ref={ref}>
      {segs.map((seg, i) =>
        seg.startsWith('$') && seg.endsWith('$')
          ? <span key={i} data-m={seg.slice(1, -1)} style={{ display: 'inline' }} />
          : <span key={i}>{seg}</span>
      )}
    </span>
  )
}

export default function ChapterList({ chapters, overallPct, isLoggedIn }: {
  chapters: ChapterItem[]
  overallPct: number
  isLoggedIn: boolean
}) {
  return (
    <div>
      {/* Progress bar */}
      {isLoggedIn && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontFamily: 'var(--font-mono),monospace', textTransform: 'uppercase', letterSpacing: '.12em' }}>
            <span>Overall progress</span>
            <span style={{ color: overallPct === 100 ? 'var(--mint)' : 'var(--text)' }}>{overallPct}%</span>
          </div>
          <div style={{ height: 5, background: 'var(--line)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--mint)', width: `${overallPct}%`, transition: 'width .6s ease', boxShadow: '0 0 12px rgba(61,244,154,.4)' }} />
          </div>
        </div>
      )}

      {/* Chapter cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {chapters.map((ch) => {
          const done = ch.read && ch.passed
          return (
            <div key={ch.slug} style={{
              borderRadius: 16, border: `1px solid ${done ? 'rgba(61,244,154,.2)' : 'var(--line-2)'}`,
              background: done ? 'rgba(61,244,154,.03)' : 'rgba(255,255,255,.02)',
              padding: '28px 32px', transition: '.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                {/* Number badge */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center',
                  flexShrink: 0, fontWeight: 700, fontSize: 16,
                  background: done ? 'var(--mint)' : 'rgba(255,255,255,.06)',
                  color: done ? '#06160E' : 'var(--muted)',
                  border: done ? 'none' : '1px solid var(--line-2)',
                }}>
                  {done ? '✓' : ch.order}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                    <h3 style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--text)', margin: 0 }}>{ch.title}</h3>
                    {ch.ref && (
                      <span style={{ fontSize: 11, color: 'var(--mint)', fontFamily: 'var(--font-mono),monospace', background: 'var(--mint-soft)', border: '1px solid rgba(61,244,154,.2)', padding: '2px 8px', borderRadius: 5 }}>
                        {ch.ref}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 18px', lineHeight: 1.6 }}>
                    <SummaryText text={ch.summary} />
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Link href={`/learn/${ch.slug}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px',
                      borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: '.15s',
                      background: ch.read ? 'rgba(255,255,255,.06)' : 'var(--mint)',
                      color: ch.read ? 'var(--muted)' : '#06160E',
                    }}>
                      {ch.read ? '✓ Read again' : 'Read chapter'}
                    </Link>
                    <Link href={`/quiz/${ch.slug}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px',
                      borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: '.15s',
                      border: `1px solid ${ch.passed ? 'rgba(255,255,255,.12)' : 'rgba(61,244,154,.35)'}`,
                      color: ch.passed ? 'var(--muted)' : 'var(--mint)',
                      background: 'transparent',
                    }}>
                      {ch.passed ? '✓ Quiz passed' : 'Take quiz'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* All done */}
      {isLoggedIn && overallPct === 100 && (
        <div style={{ marginTop: 28, padding: '32px', borderRadius: 16, border: '1px solid rgba(61,244,154,.3)', background: 'rgba(61,244,154,.05)', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
          <p style={{ fontWeight: 700, fontSize: 20, color: 'var(--mint)', marginBottom: 8 }}>All chapters complete!</p>
          <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: 14 }}>You're ready for your certificate.</p>
          <Link href="/certificate" style={{ display: 'inline-flex', padding: '12px 28px', borderRadius: 999, background: 'var(--mint)', color: '#06160E', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            Get Certificate →
          </Link>
        </div>
      )}
    </div>
  )
}
