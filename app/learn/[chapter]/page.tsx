'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { LogoMark } from '@/app/components/Logo'
import { useParams, useRouter } from 'next/navigation'
import { CHAPTERS, Chapter } from '@/lib/chapters'

declare global {
  interface Window {
    katex: { render: (s: string, el: HTMLElement, o: object) => void }
  }
}

// ── Individual KaTeX components — each manages its own rendering ──────────────
function KatexBlock({ math, accent = false }: { math: string; accent?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const run = () => {
      if (window.katex) {
        try { window.katex.render(math, el, { displayMode: true, throwOnError: false }) }
        catch { el.textContent = math }
      } else { setTimeout(run, 60) }
    }
    run()
  }, [math])
  return (
    <div ref={ref} style={{
      textAlign: 'center', padding: '20px 16px', margin: '18px 0',
      background: accent ? 'rgba(61,244,154,.04)' : '#0B0F0D',
      border: '1px solid var(--line-2)',
      borderLeft: `2px solid ${accent ? 'var(--mint)' : 'rgba(255,255,255,.15)'}`,
      borderRadius: 10, overflowX: 'auto',
      color: accent ? 'var(--mint)' : 'rgba(255,255,255,.85)',
      minHeight: 48,
    }} />
  )
}

function KatexInline({ math, accent = false }: { math: string; accent?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const run = () => {
      if (window.katex) {
        try { window.katex.render(math, el, { displayMode: false, throwOnError: false }) }
        catch { el.textContent = math }
      } else { setTimeout(run, 60) }
    }
    run()
  }, [math])
  return <span ref={ref} style={{ color: accent ? 'var(--mint)' : 'rgba(255,255,255,.85)' }} />
}

// ── MathText: parse inline markdown + math ────────────────────────────────────
function MathText({ text, accent = false }: { text: string; accent?: boolean }) {
  const segments = text.split(/((?:\$\$[\s\S]+?\$\$)|(?:\$[^$]+?\$)|(?:\*\*[^*]+?\*\*)|(?:\*[^*]+?\*))/g)
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.startsWith('$$') && seg.endsWith('$$'))
          return <KatexBlock key={i} math={seg.slice(2, -2)} accent={accent} />
        if (seg.startsWith('$') && seg.endsWith('$'))
          return <KatexInline key={i} math={seg.slice(1, -1)} accent={accent} />
        if (seg.startsWith('**') && seg.endsWith('**'))
          return <strong key={i} style={{ color: 'rgba(255,255,255,.9)', fontWeight: 600 }}>{seg.slice(2, -2)}</strong>
        if (seg.startsWith('*') && seg.endsWith('*'))
          return <em key={i}>{seg.slice(1, -1)}</em>
        return <span key={i}>{seg}</span>
      })}
    </>
  )
}

// Roman numeral labels for sections
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

function ChapterContent({ chapter }: { chapter: Chapter }) {
  return (
    <div>
      {chapter.sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 56 }}>
          {/* Section heading — neutral badge, not green */}
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: '48px 0 14px', display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text)' }}>
            <span style={{
              fontFamily: 'var(--font-mono),monospace', fontSize: 11, padding: '4px 10px', borderRadius: 6, flexShrink: 0,
              color: 'rgba(255,255,255,.5)', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)',
            }}>
              {ROMAN[si] ?? si + 1}
            </span>
            {section.title}
          </h2>

          {/* Body text */}
          <div style={{ marginBottom: 12 }}>
            {section.body.split('\n').map((line, li) =>
              line.trim() ? (
                <p key={li} style={{ margin: '0 0 14px', fontSize: 15.5, lineHeight: 1.7, color: 'rgba(255,255,255,.7)' }}>
                  <MathText text={line} />
                </p>
              ) : <br key={li} />
            )}
          </div>

          {/* Side note — neutral callout, not green */}
          {section.sideNote && (
            <div style={{
              margin: '20px 0 24px', padding: '14px 18px',
              background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)',
              borderLeft: '2px solid rgba(255,255,255,.2)', borderRadius: 10,
            }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.14em', color: 'rgba(255,255,255,.3)', marginBottom: 6, fontFamily: 'var(--font-mono),monospace' }}>
                Note
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', margin: 0, lineHeight: 1.65 }}>
                <MathText text={section.sideNote} />
              </p>
            </div>
          )}

          {/* Cards */}
          {section.cards && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 16 }}>
              {section.cards.map((card, ci) => (
                <div key={ci} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,.07)', background: '#0B0F0D', padding: '16px 14px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.5)', marginBottom: 10 }}>{card.title}</div>
                  <div style={{ textAlign: 'center', color: 'var(--mint)' }}>
                    <MathText text={card.content} accent />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table */}
          {section.table && (
            <div style={{ marginTop: 16, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr>{section.table.headers.map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: 11, color: 'rgba(255,255,255,.35)', fontWeight: 500, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,.08)', paddingRight: 24 }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{ padding: '12px 24px 12px 0', color: 'rgba(255,255,255,.6)', fontSize: 14 }}>
                          <MathText text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Examples — white label, not green */}
          {section.examples?.map((ex, ei) => (
            <div key={ei} style={{ marginTop: 28, borderRadius: 14, border: '1px solid rgba(255,255,255,.08)', overflow: 'hidden' }}>
              <div style={{ padding: '10px 20px', background: 'rgba(255,255,255,.03)', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.16em', fontFamily: 'var(--font-mono),monospace' }}>{ex.label}</span>
                {ex.difficulty && (
                  <span style={{
                    fontSize: 9, fontFamily: 'var(--font-mono),monospace', textTransform: 'uppercase', letterSpacing: '.12em', padding: '2px 7px', borderRadius: 4,
                    background: ex.difficulty === 'hard' ? 'rgba(242,107,107,.12)' : ex.difficulty === 'medium' ? 'rgba(255,180,0,.1)' : 'rgba(255,255,255,.05)',
                    color: ex.difficulty === 'hard' ? 'var(--rose)' : ex.difficulty === 'medium' ? '#FFBA00' : 'rgba(255,255,255,.35)',
                    border: `1px solid ${ex.difficulty === 'hard' ? 'rgba(242,107,107,.2)' : ex.difficulty === 'medium' ? 'rgba(255,180,0,.2)' : 'rgba(255,255,255,.08)'}`,
                  }}>{ex.difficulty}</span>
                )}
              </div>
              <div style={{ padding: '20px' }}>
                {/* Problem — green */}
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,.75)', marginBottom: 16 }}>
                  <MathText text={ex.problem} accent />
                </p>
                <details>
                  <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,.35)', userSelect: 'none', listStyle: 'none', padding: '6px 0' }}>
                    <span>Show step-by-step solution</span><span style={{ fontSize: 18 }}>+</span>
                  </summary>
                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {ex.steps.map((step, sti) => {
                      const isFinal = sti === ex.steps.length - 1
                      return (
                        <div key={sti} style={{
                          borderLeft: `2px solid ${isFinal ? 'var(--mint)' : 'rgba(255,255,255,.1)'}`,
                          paddingLeft: 16, paddingTop: 4, paddingBottom: 4,
                          background: isFinal ? 'rgba(61,244,154,.02)' : 'transparent',
                          borderRadius: isFinal ? '0 6px 6px 0' : 0,
                        }}>
                          <div style={{ fontSize: 10, color: isFinal ? 'var(--mint)' : 'rgba(255,255,255,.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6, fontFamily: 'var(--font-mono),monospace' }}>{step.label}</div>
                          {/* Final step — green math; all other steps — white math */}
                          <div style={{ fontSize: 14.5, color: isFinal ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.65)' }}>
                            <MathText text={step.content} accent={isFinal} />
                          </div>
                        </div>
                      )
                    })}
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
  const [activeSection, setActiveSection] = useState(0)

  const chapterIndex = CHAPTERS.findIndex(c => c.slug === slug)
  const prev = chapterIndex > 0 ? CHAPTERS[chapterIndex - 1] : null
  const next = chapterIndex < CHAPTERS.length - 1 ? CHAPTERS[chapterIndex + 1] : null

  useEffect(() => { setMarked(false); setActiveSection(0) }, [slug])

  if (!chapter) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <p style={{ color: 'var(--muted)' }}>Chapter not found · <Link href="/curriculum" style={{ color: 'var(--mint)', textDecoration: 'none' }}>← Back</Link></p>
    </div>
  )

  const markComplete = async () => {
    setMarking(true)
    try {
      await fetch('/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chapterSlug: slug }) })
      setMarked(true)
    } catch {}
    setMarking(false)
  }

  const readTime = [8, 6, 9, 11, 12, 14, 10, 13][chapterIndex] || 10

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 80, backdropFilter: 'saturate(1.2) blur(14px)', background: 'rgba(7,8,7,.65)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1340, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link href="/curriculum" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)', textDecoration: 'none', fontFamily: 'var(--font-mono),monospace', textTransform: 'uppercase', letterSpacing: '.14em' }}>
            ← All chapters
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LogoMark size={32} />
            <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
              <span style={{ color: 'var(--mint)' }}>CH {String(chapter.order).padStart(2,'0')}</span>
              {' / '}{chapter.title}
            </div>
          </div>
          <Link href={`/quiz/${slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 999, background: 'var(--mint)', color: '#06160E', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Take quiz →
          </Link>
        </div>
      </nav>

      {/* 3-column reader */}
      <div className="reader-grid">
        {/* TOC */}
        <aside className="toc-aside">
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--dim)', marginBottom: 14, fontFamily: 'var(--font-mono),monospace' }}>
            Ch {String(chapter.order).padStart(2,'0')} · Sections
          </div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {chapter.sections.map((s, i) => (
              <li key={i} onClick={() => setActiveSection(i)} style={{
                padding: '10px 0', borderTop: i === 0 ? 0 : '1px solid var(--line)',
                fontSize: 13, color: activeSection === i ? 'var(--mint)' : 'var(--muted)',
                display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', transition: '.15s',
              }}>
                <span style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 10, color: activeSection === i ? 'var(--mint)' : 'var(--dim)', minWidth: 20, paddingTop: 2 }}>
                  {ROMAN[i] ?? i+1}
                </span>
                {s.title}
              </li>
            ))}
          </ol>
        </aside>

        {/* Article */}
        <article style={{ maxWidth: 720, margin: '0 auto', minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.13em', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--mint)' }}>Ch {String(chapter.order).padStart(2,'0')}</span>
            <span>/</span><span>{chapter.title}</span>
            {chapter.ref && <><span>/</span><span>{chapter.ref}</span></>}
          </div>

          <h1 style={{ fontSize: 'clamp(36px,4.5vw,58px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', margin: '0 0 20px', color: 'var(--text)' }}>
            {chapter.title}
          </h1>
          <p style={{ fontSize: 17, color: 'var(--muted)', margin: '0 0 40px', lineHeight: 1.6 }}>{chapter.summary}</p>

          <ChapterContent chapter={chapter} />

          {/* Pager */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 60, paddingTop: 24, borderTop: '1px solid var(--line)', gap: 20 }}>
            {prev ? (
              <div onClick={() => router.push(`/learn/${prev.slug}`)} style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid transparent', cursor: 'pointer', transition: '.18s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.cssText += ';background:rgba(255,255,255,.03);border-color:var(--line-2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent' }}>
                <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.14em' }}>← Previous</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6 }}>Ch {prev.order} · {prev.title}</div>
              </div>
            ) : <div />}
            {next ? (
              <div onClick={() => router.push(`/learn/${next.slug}`)} style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid transparent', cursor: 'pointer', transition: '.18s', textAlign: 'right' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.cssText += ';background:rgba(255,255,255,.03);border-color:var(--line-2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent' }}>
                <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.14em' }}>Next chapter →</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6, color: 'var(--mint)' }}>Ch {next.order} · {next.title}</div>
              </div>
            ) : <div />}
          </div>

          {/* Mark complete */}
          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <button onClick={markComplete} disabled={marked || marking} style={{
              padding: '10px 22px', borderRadius: 999, fontSize: 13, fontWeight: 600,
              background: marked ? 'var(--mint-soft)' : 'var(--mint)',
              color: marked ? 'var(--mint)' : '#06160E',
              border: marked ? '1px solid rgba(61,244,154,.3)' : 'none',
              cursor: marked ? 'default' : 'pointer',
            }}>
              {marked ? '✓ Marked as read' : marking ? 'Saving...' : '✓ Mark as read'}
            </button>
            <Link href={`/quiz/${slug}`} style={{ padding: '10px 22px', borderRadius: 999, fontSize: 13, fontWeight: 600, border: '1px solid rgba(61,244,154,.3)', color: 'var(--mint)', textDecoration: 'none' }}>
              Take chapter quiz →
            </Link>
          </div>
        </article>

        {/* Right rail */}
        <aside className="rail-aside">
          <div style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 18, background: 'rgba(255,255,255,.015)', marginBottom: 14 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--dim)', marginBottom: 10, fontFamily: 'var(--font-mono),monospace' }}>Your progress</div>
            <div style={{ height: 5, background: '#0B0F0D', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--line)' }}>
              <div style={{ height: '100%', background: 'var(--mint)', width: `${Math.round((chapterIndex / CHAPTERS.length) * 100)}%`, boxShadow: '0 0 10px rgba(61,244,154,.5)' }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>{chapterIndex} / {CHAPTERS.length} chapters · {Math.round((chapterIndex / CHAPTERS.length) * 100)}%</div>
          </div>

          {chapter.ref && (
            <div style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 18, background: 'rgba(255,255,255,.015)', marginBottom: 14 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--dim)', marginBottom: 10, fontFamily: 'var(--font-mono),monospace' }}>Reference</div>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.015em', marginBottom: 8 }}>H.K. Dass</div>
              {[['Section', chapter.ref], ['Read time', readTime + ' min'], ['Chapter', `${chapter.order} / ${CHAPTERS.length}`]].map(([k,v]) => (
                <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '6px 0', borderTop: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <b style={{ fontFamily: 'var(--font-mono),monospace', fontWeight: 500 }}>{v}</b>
                </div>
              ))}
            </div>
          )}

          <div style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 18, background: 'rgba(255,255,255,.015)' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--dim)', marginBottom: 8, fontFamily: 'var(--font-mono),monospace' }}>Up next</div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Take the quiz</div>
            <p style={{ margin: '0 0 14px', color: 'var(--muted)', fontSize: 12.5 }}>5 questions · tests core concepts.</p>
            <Link href={`/quiz/${slug}`} style={{ display: 'flex', justifyContent: 'center', padding: '10px 0', borderRadius: 999, background: 'var(--mint)', color: '#06160E', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Start quiz →
            </Link>
          </div>
        </aside>
      </div>

      <style>{`
        .reader-grid { display:grid;grid-template-columns:220px 1fr 220px;gap:40px;padding:48px 32px 120px;max-width:1340px;margin:0 auto }
        .toc-aside { position:sticky;top:80px;align-self:start }
        .rail-aside { position:sticky;top:80px;align-self:start }
        @media(max-width:1100px) { .reader-grid{grid-template-columns:1fr} .toc-aside,.rail-aside{display:none} }
      `}</style>
    </div>
  )
}
