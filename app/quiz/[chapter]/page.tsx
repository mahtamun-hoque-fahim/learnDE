'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CHAPTERS } from '@/lib/chapters'
import { QUIZ_QUESTIONS } from '@/lib/quiz-data'
import { LogoMark } from '@/app/components/Logo'

declare global {
  interface Window {
    katex: { render: (s: string, el: HTMLElement, o: object) => void }
  }
}

// Convert quiz text (unicode math) → LaTeX delimited strings, then render with KaTeX
// ─── Targeted injection: replace only math sub-expressions with $...$ ─────────
// Used for QUESTION text (natural language + embedded math)
function injectMath(raw: string): string {
  if (raw.includes('$')) return raw
  return raw
    // fractions — replace and immediately wrap in $...$
    .replace(/d²y\/dx²/g,   '$\\dfrac{d^2y}{dx^2}$')
    .replace(/d²y\/dx/g,    '$\\dfrac{d^2y}{dx}$')
    .replace(/dy\/dx/g,     '$\\dfrac{dy}{dx}$')
    .replace(/dv\/dx/g,     '$\\dfrac{dv}{dx}$')
    .replace(/dP\/dt/g,     '$\\dfrac{dP}{dt}$')
    .replace(/dT\/dt/g,     '$\\dfrac{dT}{dt}$')
    .replace(/dq\/dt/g,     '$\\dfrac{dq}{dt}$')
    .replace(/dx\/dt/g,     '$\\dfrac{dx}{dt}$')
    .replace(/d\/dx/g,      '$\\dfrac{d}{dx}$')
    // superscripts on variables
    .replace(/([a-zA-Z\)])²/g,  (_, c) => `$${c}^2$`)
    .replace(/([a-zA-Z\)])³/g,  (_, c) => `$${c}^3$`)
    .replace(/([a-zA-Z\)])⁴/g,  (_, c) => `$${c}^4$`)
    .replace(/([a-zA-Z\)])ⁿ/g,  (_, c) => `$${c}^n$`)
    .replace(/([a-zA-Z\)])ˣ/g,  (_, c) => `$${c}^x$`)
    .replace(/([a-zA-Z\)])⁻ˣ/g, (_, c) => `$${c}^{-x}$`)
    .replace(/([a-zA-Z\)])⁻¹/g, (_, c) => `$${c}^{-1}$`)
    .replace(/([a-zA-Z\)])₁/g,  (_, c) => `$${c}_1$`)
    .replace(/([a-zA-Z\)])₂/g,  (_, c) => `$${c}_2$`)
    // e^(...) pattern
    .replace(/e\^\(([^)]+)\)/g, (_, inner) => `$e^{${inner}}$`)
    // integrals
    .replace(/∫/g, '$\\int$')
    // arrows
    .replace(/→/g, '$\\to$')
    // trig abbreviations when they appear inline in math
    .replace(/\barctan\b/g, '$\\arctan$')
    .replace(/\barcsin\b/g, '$\\arcsin$')
    .replace(/\barccos\b/g, '$\\arccos$')
}

// ─── Pure-math option: convert unicode then wrap whole thing in $...$ ─────────
// Only used when the entire option IS a math expression (no natural language)
const NATURAL_WORDS = /\b(an|the|no|not|has|have|always|more|more than|depends|exactly|leave|higher|contains|occurs|gives|means|equal|only|from)\b/i

function processOption(raw: string): string {
  if (raw.includes('$')) return raw
  // If it has natural-language words, just do targeted injection
  if (NATURAL_WORDS.test(raw) || raw.length > 50) return injectMath(raw)

  // Convert unicode → LaTeX notation
  const converted = raw
    .replace(/d²y\/dx²/g,   '\\dfrac{d^2y}{dx^2}')
    .replace(/dy\/dx/g,     '\\dfrac{dy}{dx}')
    .replace(/dv\/dx/g,     '\\dfrac{dv}{dx}')
    .replace(/dP\/dt/g,     '\\dfrac{dP}{dt}')
    .replace(/d\/dx/g,      '\\dfrac{d}{dx}')
    .replace(/([a-zA-Z0-9\)])²/g, '$1^2')
    .replace(/([a-zA-Z0-9\)])³/g, '$1^3')
    .replace(/([a-zA-Z0-9\)])ⁿ/g, '$1^n')
    .replace(/([a-zA-Z0-9\)])ˣ/g, '$1^x')
    .replace(/([a-zA-Z0-9\)])⁻ˣ/g,'$1^{-x}')
    .replace(/([a-zA-Z0-9\)])⁻¹/g,'$1^{-1}')
    .replace(/([a-zA-Z0-9\)])₁/g, '$1_1')
    .replace(/([a-zA-Z0-9\)])₂/g, '$1_2')
    .replace(/e\^\(([^)]+)\)/g, 'e^{$1}')
    .replace(/∫/g, '\\int ')
    .replace(/\bln\b/g, '\\ln')
    .replace(/\barctan\b/g, '\\arctan')
    .replace(/→/g, '\\to')

  // Wrap the whole thing as inline math only if it looks like a math expression
  const looksLikeMath = /[=\^\_\\]|\\dfrac|\\int|\\ln/.test(converted)
    || /[²³⁴ⁿˣ∫→]/.test(raw)
  if (looksLikeMath) return `$${converted}$`
  return raw
}

function QuizMathText({ text, isOption = false }: { text: string; isOption?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const processed = isOption ? processOption(text) : injectMath(text)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const init = () => {
      if (!window.katex) { setTimeout(init, 60); return }
      el.querySelectorAll('[data-m]').forEach(node => {
        const disp = node.getAttribute('data-d') === '1'
        const m = node.getAttribute('data-m') || ''
        try { window.katex.render(m, node as HTMLElement, { displayMode: disp, throwOnError: false }) }
        catch { (node as HTMLElement).textContent = m }
      })
    }
    init()
  }, [processed])

  const parts: React.ReactNode[] = []
  const segs = processed.split(/((?:\$\$[\s\S]+?\$\$)|(?:\$[^$]+?\$))/g)
  segs.forEach((seg, i) => {
    if (seg.startsWith('$$') && seg.endsWith('$$')) {
      parts.push(<span key={i} data-m={seg.slice(2,-2)} data-d="1" style={{ display: 'block', textAlign: 'center', padding: '4px 0' }} />)
    } else if (seg.startsWith('$') && seg.endsWith('$')) {
      parts.push(<span key={i} data-m={seg.slice(1,-1)} data-d="0" style={{ display: 'inline' }} />)
    } else {
      parts.push(<span key={i}>{seg}</span>)
    }
  })
  return <span ref={ref}>{parts}</span>
}

type QuizResult = {
  score: number; total: number; passed: boolean
  results: { id: string; userAnswer: number; correct: boolean; correctAnswer: number; explanation: string }[]
}
type BonusProblem = { problem: string; hint: string; solution: string }

export default function QuizPage() {
  const params = useParams()
  const slug = params.chapter as string
  const chapter = CHAPTERS.find(c => c.slug === slug)
  const questions = QUIZ_QUESTIONS[slug] ?? []

  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [bonusProblems, setBonusProblems] = useState<BonusProblem[]>([])
  const [loadingBonus, setLoadingBonus] = useState(false)
  const [showBonus, setShowBonus] = useState(false)

  const allAnswered = questions.every((_, i) => answers[i] !== undefined)

  const submit = useCallback(async () => {
    if (!allAnswered) return
    setLoading(true)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterSlug: slug, answers }),
      })
      const data = await res.json()
      setResult(data); setSubmitted(true)
    } catch {}
    setLoading(false)
  }, [allAnswered, slug, answers])

  const fetchBonus = useCallback(async () => {
    setLoadingBonus(true); setShowBonus(true)
    try {
      const res = await fetch('/api/bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterSlug: slug, chapterTitle: chapter?.title }),
      })
      const data = await res.json()
      setBonusProblems(data.problems || [])
    } catch { setBonusProblems([]) }
    setLoadingBonus(false)
  }, [slug, chapter?.title])

  if (!chapter) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1 }}><p style={{ color:'var(--muted)' }}>Quiz not found</p></div>
  if (!questions.length) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1 }}>
      <div style={{ textAlign:'center' }}>
        <p style={{ color:'var(--muted)', marginBottom:16 }}>No quiz available for this chapter yet</p>
        <Link href="/learn" style={{ color:'var(--mint)', textDecoration:'none' }}>← Back to course</Link>
      </div>
    </div>
  )

  return (
    <div style={{ position:'relative', zIndex:1, minHeight:'100vh' }}>
      {/* Nav */}
      <nav style={{ position:'sticky', top:0, zIndex:80, backdropFilter:'saturate(1.2) blur(14px)', background:'rgba(7,8,7,.65)', borderBottom:'1px solid var(--line)' }}>
        <div style={{ maxWidth:820, margin:'0 auto', padding:'0 32px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href={`/learn/${slug}`} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'var(--muted)', textDecoration:'none', fontFamily:'var(--font-mono),monospace', textTransform:'uppercase', letterSpacing:'.14em' }}>
            ← Back to chapter
          </Link>
          <span style={{ fontFamily:'var(--font-mono),monospace', fontSize:12, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.14em' }}>Quiz</span>
          <LogoMark size={30} />
        </div>
      </nav>

      <div style={{ maxWidth:820, margin:'0 auto', padding:'48px 32px 120px' }}>

        {/* Header */}
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 12px', borderRadius:999, border:'1px solid var(--line-2)', background:'rgba(255,255,255,.02)', fontSize:12, color:'var(--muted)', marginBottom:14 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--mint)', boxShadow:'0 0 8px var(--mint)', display:'inline-block' }} />
            Chapter {chapter.order} · {chapter.title} · Quiz
          </div>
          <h1 style={{ fontSize:32, fontWeight:800, letterSpacing:'-0.025em', margin:'0 0 6px' }}>{chapter.title}</h1>
          <p style={{ color:'var(--muted)', fontSize:14, margin:0 }}>{questions.length} questions · Pass with 60%</p>
        </div>

        {/* Progress bar */}
        <div style={{ display:'flex', gap:5, marginBottom:32 }}>
          {questions.map((_, i) => (
            <div key={i} style={{ flex:1, height:4, borderRadius:2, background: submitted ? (result?.results[i]?.correct ? 'var(--mint)' : 'var(--rose)') : answers[i] !== undefined ? 'var(--text)' : 'var(--line)' }} />
          ))}
        </div>

        {/* Result banner */}
        {submitted && result && (
          <div style={{ marginBottom:28, padding:'18px 20px', borderRadius:14, border:`1px solid ${result.passed ? 'rgba(61,244,154,.3)' : 'rgba(242,107,107,.3)'}`, background: result.passed ? 'rgba(61,244,154,.05)' : 'rgba(242,107,107,.05)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
              <div>
                <div style={{ fontSize:22, fontWeight:700, color: result.passed ? 'var(--mint)' : 'var(--rose)', letterSpacing:'-0.02em' }}>
                  {result.score}/{result.total} — {result.passed ? '🎉 Passed!' : 'Not quite'}
                </div>
                <div style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>
                  {Math.round((result.score/result.total)*100)}% · {result.passed ? 'Saved to your progress' : 'Need 60% to pass'}
                </div>
              </div>
              {result.passed && (
                <button onClick={fetchBonus} disabled={loadingBonus} style={{ padding:'9px 18px', borderRadius:999, background:'var(--mint)', color:'#06160E', fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>
                  {loadingBonus ? 'Loading...' : '✦ Bonus problems'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Questions */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {questions.map((q, qi) => {
            const userAns = answers[qi]
            const qResult = result?.results[qi]

            return (
              <div key={q.id} style={{
                borderRadius:18, border:`1px solid ${submitted ? (qResult?.correct ? 'rgba(61,244,154,.2)' : 'rgba(242,107,107,.2)') : 'var(--line-2)'}`,
                background:'linear-gradient(180deg, #0B0F0D, #0A0C0B)',
                padding:'28px 32px', boxShadow:'0 20px 40px -20px rgba(0,0,0,.5)',
              }}>
                <div style={{ fontFamily:'var(--font-mono),monospace', fontSize:12, color:'var(--mint)', marginBottom:10, letterSpacing:'.1em' }}>
                  QUESTION {String(qi+1).padStart(2,'0')} / {String(questions.length).padStart(2,'0')}
                </div>
                <div style={{ fontSize:18, fontWeight:600, lineHeight:1.45, letterSpacing:'-0.01em', marginBottom:6, color:'var(--text)' }}>
                  <QuizMathText text={q.question} />
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:20 }}>
                  {q.options.map((opt, oi) => {
                    const isSelected = userAns === oi
                    const isCorrect  = oi === q.correct
                    let bg = 'rgba(255,255,255,.015)'
                    let border = 'var(--line-2)'
                    let color = '#CDD3D0'
                    let bulletBg = '#0B0F0D'
                    let bulletColor = 'var(--muted)'

                    if (submitted) {
                      if (isCorrect) { bg='var(--mint-soft)'; border='var(--mint)'; color='var(--text)'; bulletBg='var(--mint)'; bulletColor='#06160E' }
                      else if (isSelected) { bg='rgba(242,107,107,.08)'; border='var(--rose)'; color='var(--text)'; bulletBg='var(--rose)'; bulletColor='#fff' }
                    } else if (isSelected) {
                      bg='var(--mint-soft)'; border='var(--mint)'; color='var(--text)'; bulletBg='var(--mint)'; bulletColor='#06160E'
                    }

                    return (
                      <button key={oi} onClick={() => !submitted && setAnswers(p => ({ ...p, [qi]: oi }))} disabled={submitted}
                        style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:12, border:`1px solid ${border}`, background:bg, cursor: submitted ? 'default' : 'pointer', transition:'.15s', textAlign:'left', width:'100%' }}>
                        <div style={{ width:30, height:30, borderRadius:'50%', border:`1px solid ${border}`, display:'grid', placeItems:'center', fontFamily:'var(--font-mono),monospace', fontSize:12, color:bulletColor, flexShrink:0, background:bulletBg, transition:'.15s' }}>
                          {String.fromCharCode(65+oi)}
                        </div>
                        <div style={{ fontSize:14.5, color, flex:1, lineHeight:1.4 }}>
                          <QuizMathText text={opt} isOption />
                        </div>
                      </button>
                    )
                  })}
                </div>

                {submitted && qResult && (
                  <div style={{ marginTop:16, padding:'12px 16px', borderRadius:10, background: qResult.correct ? 'rgba(61,244,154,.05)' : 'rgba(255,255,255,.04)', borderLeft:`2px solid ${qResult.correct ? 'var(--mint)' : 'var(--line-2)'}` }}>
                    <span style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.12em', color: qResult.correct ? 'var(--mint)' : 'var(--muted)', marginRight:8 }}>Explanation</span>
                    <span style={{ fontSize:13, color:'var(--muted)' }}><QuizMathText text={qResult.explanation} /></span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Submit */}
        {!submitted && (
          <div style={{ marginTop:28 }}>
            <button onClick={submit} disabled={!allAnswered || loading} style={{
              width:'100%', padding:'16px', borderRadius:999, fontSize:15, fontWeight:700,
              background: allAnswered ? 'var(--mint)' : 'rgba(255,255,255,.05)',
              color: allAnswered ? '#06160E' : 'var(--muted)',
              border:`1px solid ${allAnswered ? 'var(--mint)' : 'var(--line)'}`,
              cursor: allAnswered ? 'pointer' : 'not-allowed', transition:'.18s',
            }}>
              {loading ? 'Submitting...' : !allAnswered ? `Answer all ${questions.length} questions first` : 'Submit Quiz →'}
            </button>
          </div>
        )}

        {submitted && !result?.passed && (
          <div style={{ marginTop:24, textAlign:'center' }}>
            <button onClick={() => { setAnswers({}); setSubmitted(false); setResult(null) }}
              style={{ fontSize:14, color:'var(--mint)', background:'none', border:'none', cursor:'pointer' }}>
              ↺ Retake quiz
            </button>
          </div>
        )}

        {/* Bonus Problems */}
        {showBonus && (
          <div style={{ marginTop:48, paddingTop:40, borderTop:'1px solid var(--line)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
              <span style={{ color:'var(--mint)', fontSize:18 }}>✦</span>
              <h2 style={{ fontSize:22, fontWeight:700, margin:0, letterSpacing:'-0.02em' }}>Bonus Problems</h2>
              <span style={{ fontSize:12, color:'var(--muted)', fontFamily:'var(--font-mono),monospace' }}>AI-generated</span>
            </div>
            {loadingBonus ? (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[1,2,3].map(i => <div key={i} style={{ height:96, borderRadius:14, background:'rgba(255,255,255,.04)', animation:'pulse 2s infinite' }} />)}
              </div>
            ) : bonusProblems.map((bp, i) => (
              <div key={i} style={{ borderRadius:14, border:'1px solid var(--line-2)', background:'rgba(255,255,255,.02)', padding:'20px', marginBottom:12 }}>
                <div style={{ fontSize:11, color:'var(--mint)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.14em', marginBottom:10, fontFamily:'var(--font-mono),monospace' }}>Problem {i+1}</div>
                <p style={{ fontSize:15, color:'#CDD3D0', marginBottom:14 }}><QuizMathText text={bp.problem} /></p>
                <details style={{ marginBottom:8 }}>
                  <summary style={{ fontSize:12, color:'var(--muted)', cursor:'pointer', listStyle:'none', display:'flex', justifyContent:'space-between' }}>
                    <span>Hint</span><span>+</span>
                  </summary>
                  <p style={{ fontSize:13, color:'var(--muted)', marginTop:8, paddingLeft:12, borderLeft:'2px solid var(--line-2)' }}><QuizMathText text={bp.hint} /></p>
                </details>
                <details>
                  <summary style={{ fontSize:12, color:'var(--muted)', cursor:'pointer', listStyle:'none', display:'flex', justifyContent:'space-between' }}>
                    <span>Show solution</span><span>+</span>
                  </summary>
                  <div style={{ fontSize:13, color:'var(--muted)', marginTop:8, paddingLeft:12, borderLeft:'2px solid rgba(61,244,154,.25)' }}><QuizMathText text={bp.solution} /></div>
                </details>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop:32, display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--muted)' }}>
          <Link href={`/learn/${slug}`} style={{ color:'var(--muted)', textDecoration:'none' }}>← Review chapter</Link>
          <Link href="/learn" style={{ color:'var(--muted)', textDecoration:'none' }}>All chapters →</Link>
        </div>
      </div>
    </div>
  )
}
