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
      parts.push(<span key={i} className="math-block" data-math={seg.slice(2,-2)} data-display="true" />)
    } else if (seg.startsWith('$') && seg.endsWith('$')) {
      parts.push(<span key={i} data-math={seg.slice(1,-1)} data-display="false" style={{ display: 'inline' }} />)
    } else if (seg.startsWith('**') && seg.endsWith('**')) {
      parts.push(<strong key={i} style={{ color: 'var(--text)', fontWeight: 600 }}>{seg.slice(2,-2)}</strong>)
    } else if (seg.startsWith('*') && seg.endsWith('*')) {
      parts.push(<em key={i}>{seg.slice(1,-1)}</em>)
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
    <div ref={contentRef}>
      {chapter.sections.map((section, si) => (
        <div key={si} style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em', margin: '48px 0 14px', display: 'flex', alignItems: 'center', gap: 14, color: 'var(--text)' }}>
            <span style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 12, color: 'var(--mint)', background: 'var(--mint-soft)', border: '1px solid rgba(61,244,154,.2)', padding: '4px 8px', borderRadius: 6 }}>
              {String.fromCharCode(73 + si)}
            </span>
            {section.title}
          </h2>

          <div style={{ marginBottom: 12 }}>
            {section.body.split('\n').map((line, li) =>
              line.trim() ? (
                <p key={li} style={{ margin: '0 0 16px', fontSize: 15.5, lineHeight: 1.65, color: '#CDD3D0' }}>
                  <MathText text={line} />
                </p>
              ) : <br key={li} />
            )}
          </div>

          {/* Cards */}
          {section.cards && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 16 }}>
              {section.cards.map((card, ci) => (
                <div key={ci} style={{ borderRadius: 12, border: '1px solid var(--line-2)', background: 'rgba(255,255,255,.02)', padding: '16px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{card.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}><MathText text={card.content} /></div>
                </div>
              ))}
            </div>
          )}

          {/* Table */}
          {section.table && (
            <div style={{ marginTop: 16, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr>
                    {section.table.headers.map(h => (
                      <th key={h} style={{ textAlign: 'left', fontSize: 11, color: 'var(--muted)', fontWeight: 500, paddingBottom: 8, borderBottom: '1px solid var(--line)', paddingRight: 24 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                      {row.map((cell, ci) => (
                        <td key={ci} style={{ padding: '12px 24px 12px 0', color: 'var(--muted)', fontSize: 14 }}>
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
            <div key={ei} style={{ marginTop: 28, borderRadius: 12, border: '1px solid var(--line-2)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,.02)', borderBottom: '1px solid var(--line-2)' }}>
                <span style={{ fontSize: 11, color: 'var(--mint)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.14em', fontFamily: 'var(--font-mono),monospace' }}>{ex.label}</span>
              </div>
              <div style={{ padding: '20px' }}>
                <p style={{ fontSize: 15, color: '#CDD3D0', marginBottom: 16 }}>
                  <MathText text={ex.problem} />
                </p>
                <details>
                  <summary style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: 13.5, color: 'var(--muted)', userSelect: 'none', listStyle: 'none' }}>
                    <span>Show step-by-step solution</span>
                    <span style={{ fontSize: 18 }}>+</span>
                  </summary>
                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {ex.steps.map((step, sti) => (
                      <div key={sti} style={{ borderLeft: '2px solid rgba(61,244,154,.3)', paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}>
                        <div style={{ fontSize: 10, color: 'var(--dim)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4, fontFamily: 'var(--font-mono),monospace' }}>{step.label}</div>
                        <div style={{ fontSize: 14, color: '#CDD3D0' }}><MathText text={step.content} /></div>
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
  const [activeSection, setActiveSection] = useState(0)

  const chapterIndex = CHAPTERS.findIndex(c => c.slug === slug)
  const prev = chapterIndex > 0 ? CHAPTERS[chapterIndex - 1] : null
  const next = chapterIndex < CHAPTERS.length - 1 ? CHAPTERS[chapterIndex + 1] : null

  useEffect(() => { setMarked(false); setActiveSection(0) }, [slug])

  if (!chapter) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Chapter not found</p>
        <Link href="/learn" style={{ color: 'var(--mint)', textDecoration: 'none', fontSize: 14 }}>← Back to course</Link>
      </div>
    </div>
  )

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

  const readTime = [8, 6, 9, 11, 12, 14, 10, 13][chapterIndex] || 10

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 80, backdropFilter: 'saturate(1.2) blur(14px)', background: 'rgba(7,8,7,.6)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1340, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link href="/learn" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', textDecoration: 'none', fontFamily: 'var(--font-mono),monospace', textTransform: 'uppercase', letterSpacing: '.14em' }}>
            ← All chapters
          </Link>
          <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.14em' }}>
            <span style={{ color: 'var(--mint)' }}>CH {String(chapter.order).padStart(2,'0')}</span> / {chapter.title.split(' ').slice(0,3).join(' ')}...
          </div>
          <Link href={`/quiz/${slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, background: 'var(--mint)', color: '#06160E', fontSize: 12.5, fontWeight: 600, textDecoration: 'none' }}>
            Take quiz →
          </Link>
        </div>
      </nav>

      {/* 3-column reader */}
      <div className="reader-grid">
        {/* TOC */}
        <aside className="toc-aside">
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--muted)', marginBottom: 14 }}>
            Ch {String(chapter.order).padStart(2,'0')} · Sections
          </div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, counterReset: 'c' }}>
            {chapter.sections.map((s, i) => (
              <li key={i} onClick={() => setActiveSection(i)} style={{
                padding: '10px 0', borderTop: i === 0 ? 0 : '1px solid var(--line)',
                fontSize: 13.5, color: activeSection === i ? 'var(--mint)' : 'var(--muted)',
                display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer', transition: '.15s',
              }}>
                <span style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 11, color: activeSection === i ? 'var(--mint)' : 'var(--dim)', minWidth: 20 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.title}
              </li>
            ))}
          </ol>
        </aside>

        {/* Main article */}
        <article style={{ maxWidth: 720, margin: '0 auto', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono),monospace', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 22 }}>
            <span style={{ color: 'var(--mint)', fontWeight: 500 }}>{String(chapter.order).padStart(2,'0')}</span>
            /
            <span>{chapter.title}</span>
            {chapter.ref && <><span>/</span><span>{chapter.ref}</span></>}
          </div>

          <h1 style={{ fontSize: 'clamp(40px,5vw,64px)', fontWeight: 800, lineHeight: .98, letterSpacing: '-0.035em', margin: '0 0 22px', color: 'var(--text)' }}>
            <em style={{ fontStyle: 'normal', color: 'var(--mint)' }}>{chapter.title.split(' ')[0]}</em>{' '}
            {chapter.title.split(' ').slice(1).join(' ')}
          </h1>
          <p style={{ fontSize: 18, color: 'var(--muted)', margin: '0 0 40px', maxWidth: 600, lineHeight: 1.5 }}>{chapter.summary}</p>

          <ChapterContent chapter={chapter} />

          {/* Pager */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 60, paddingTop: 24, borderTop: '1px solid var(--line)', gap: 20 }}>
            {prev ? (
              <div onClick={() => router.push(`/learn/${prev.slug}`)} style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid transparent', cursor: 'pointer', transition: '.18s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,.03)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line-2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent' }}
              >
                <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.14em' }}>← Previous</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 6, letterSpacing: '-.015em' }}>Ch {prev.order} · {prev.title.split(' ').slice(0,3).join(' ')}</div>
              </div>
            ) : <div />}
            {next ? (
              <div onClick={() => router.push(`/learn/${next.slug}`)} style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid transparent', cursor: 'pointer', transition: '.18s', textAlign: 'right' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,.03)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line-2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent' }}
              >
                <div style={{ fontFamily: 'var(--font-mono),monospace', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.14em' }}>Take the quiz →</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 6, letterSpacing: '-.015em', color: 'var(--mint)' }}>Chapter {next.order} · {next.title.split(' ').slice(0,3).join(' ')}</div>
              </div>
            ) : (
              <div style={{ flex: 1, textAlign: 'right' }}>
                <button onClick={markComplete} disabled={marked || marking} style={{
                  padding: '14px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600,
                  background: marked ? 'var(--mint-soft)' : 'var(--mint)',
                  color: marked ? 'var(--mint)' : '#06160E',
                  border: marked ? '1px solid rgba(61,244,154,.3)' : 'none',
                  cursor: 'pointer', transition: '.18s',
                }}>
                  {marked ? '✓ Completed!' : marking ? 'Saving...' : '✓ Mark complete'}
                </button>
              </div>
            )}
          </div>

          {/* Mark complete for non-last chapters */}
          {next && (
            <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
              <button onClick={markComplete} disabled={marked || marking} style={{
                padding: '10px 20px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                background: marked ? 'var(--mint-soft)' : 'var(--mint)',
                color: marked ? 'var(--mint)' : '#06160E',
                border: marked ? '1px solid rgba(61,244,154,.3)' : 'none',
                cursor: marked ? 'default' : 'pointer', transition: '.18s',
              }}>
                {marked ? '✓ Marked as read' : marking ? 'Saving...' : '✓ Mark as read'}
              </button>
              <Link href={`/quiz/${slug}`} style={{ padding: '10px 20px', borderRadius: 999, fontSize: 13, fontWeight: 600, border: '1px solid rgba(61,244,154,.3)', color: 'var(--mint)', textDecoration: 'none', transition: '.18s' }}>
                Take chapter quiz →
              </Link>
            </div>
          )}
        </article>

        {/* Right rail */}
        <aside className="rail-aside">
          <div style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 18, background: 'rgba(255,255,255,.015)', marginBottom: 14 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--muted)', marginBottom: 10 }}>Your progress</div>
            <div style={{ height: 6, background: '#0B0F0D', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--line)' }}>
              <div style={{ height: '100%', background: 'var(--mint)', width: `${Math.round((chapterIndex / CHAPTERS.length) * 100)}%`, boxShadow: '0 0 12px rgba(61,244,154,.5)' }} />
            </div>
            <div style={{ marginTop: 10, fontSize: 12.5, color: 'var(--muted)' }}>{chapterIndex} / {CHAPTERS.length} chapters · {Math.round((chapterIndex / CHAPTERS.length) * 100)}%</div>
          </div>

          {chapter.ref && (
            <div style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 18, background: 'rgba(255,255,255,.015)', marginBottom: 14 }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--muted)', marginBottom: 10 }}>Reference</div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.015em', marginBottom: 6 }}>H.K. Dass</div>
              {[['Section', chapter.ref], ['Read time', readTime + ' min'], ['Chapter', chapter.order + ' / ' + CHAPTERS.length]].map(([k,v]) => (
                <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '6px 0', borderTop: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <b style={{ fontFamily: 'var(--font-mono),monospace', fontWeight: 500, color: 'var(--text)' }}>{v}</b>
                </div>
              ))}
            </div>
          )}

          <div style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 18, background: 'rgba(255,255,255,.015)' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--muted)', marginBottom: 8 }}>Up next</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.015em', marginBottom: 8 }}>Take the quiz</div>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 12.5, marginBottom: 14 }}>5 questions · tests core concepts from this chapter.</p>
            <Link href={`/quiz/${slug}`} style={{ display: 'flex', justifyContent: 'center', padding: '10px 0', borderRadius: 999, background: 'var(--mint)', color: '#06160E', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Start quiz →
            </Link>
          </div>
        </aside>
      </div>

      <style>{`
        .reader-grid { display:grid;grid-template-columns:260px 1fr 260px;gap:48px;padding:56px 32px 120px;max-width:1340px;margin:0 auto }
        .toc-aside { position:sticky;top:96px;align-self:start }
        .rail-aside { position:sticky;top:96px;align-self:start }
        @media(max-width:1100px) { .reader-grid { grid-template-columns:1fr } .toc-aside,.rail-aside { display:none } }
        @media(max-width:600px) { .reader-grid { padding:32px 16px 80px } }
      `}</style>
    </div>
  )
}
