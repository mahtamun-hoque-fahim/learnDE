'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CHAPTERS } from '@/lib/chapters'
import { QUIZ_QUESTIONS } from '@/lib/quiz-data'

declare global {
  interface Window {
    katex: { render: (s: string, el: HTMLElement, o: object) => void }
  }
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
    } else {
      parts.push(<span key={i}>{seg}</span>)
    }
  })
  return <span ref={ref}>{parts}</span>
}

type QuizResult = {
  score: number
  total: number
  passed: boolean
  results: { id: string; userAnswer: number; correct: boolean; correctAnswer: number; explanation: string }[]
}

type BonusProblem = {
  problem: string
  hint: string
  solution: string
}

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

  const submit = async () => {
    if (!allAnswered) return
    setLoading(true)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterSlug: slug, answers }),
      })
      const data = await res.json()
      setResult(data)
      setSubmitted(true)
    } catch {}
    setLoading(false)
  }

  const fetchBonusProblems = async () => {
    setLoadingBonus(true)
    setShowBonus(true)
    try {
      const res = await fetch('/api/bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterSlug: slug, chapterTitle: chapter?.title }),
      })
      const data = await res.json()
      setBonusProblems(data.problems || [])
    } catch {
      setBonusProblems([])
    }
    setLoadingBonus(false)
  }

  if (!chapter) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-white/40">Quiz not found</p>
    </div>
  )

  if (!questions.length) return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center">
        <p className="text-white/40 mb-4">No quiz available for this chapter yet</p>
        <Link href="/learn" className="text-[#00e676] text-sm">← Back to course</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href={`/learn/${slug}`} className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to chapter
          </Link>
          <span className="font-syne text-sm text-white/40">Quiz</span>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-5 max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="text-xs text-[#00e676] mb-2">Chapter {chapter.order} Quiz</div>
          <h1 className="font-syne font-bold text-2xl text-white">{chapter.title}</h1>
          <p className="text-sm text-white/40 mt-1">{questions.length} questions · Pass with 60%</p>
        </div>

        {/* Result Banner */}
        {submitted && result && (
          <div className={`mb-6 p-4 rounded-xl border ${result.passed ? 'border-[#00e676]/30 bg-[#00e676]/5' : 'border-red-500/30 bg-red-500/5'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-syne font-bold text-xl ${result.passed ? 'text-[#00e676]' : 'text-red-400'}`}>
                  {result.score}/{result.total} {result.passed ? '🎉 Passed!' : '— Try again'}
                </div>
                <div className="text-sm text-white/40 mt-0.5">
                  {Math.round((result.score / result.total) * 100)}% · {result.passed ? 'Quiz saved to your progress' : 'Need 60% to pass'}
                </div>
              </div>
              {result.passed && (
                <button onClick={fetchBonusProblems} disabled={loadingBonus}
                  className="text-xs px-3 py-1.5 bg-[#00e676] text-black font-semibold rounded-full">
                  {loadingBonus ? 'Loading...' : '✦ Bonus problems'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, qi) => {
            const userAns = answers[qi]
            const qResult = result?.results[qi]

            return (
              <div key={q.id} className={`rounded-xl border p-5 ${submitted ? (qResult?.correct ? 'border-[#00e676]/20' : 'border-red-500/20') : 'border-white/8'} bg-white/4`}>
                <div className="text-xs text-white/30 mb-2">Question {qi + 1}</div>
                <p className="text-sm text-white mb-4 leading-relaxed">
                  <MathText text={q.question} />
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = userAns === oi
                    const isCorrect = oi === q.correct
                    let style = 'border-white/8 text-white/60'
                    if (submitted) {
                      if (isCorrect) style = 'border-[#00e676]/40 bg-[#00e676]/5 text-[#00e676]'
                      else if (isSelected && !isCorrect) style = 'border-red-500/40 bg-red-500/5 text-red-400'
                    } else if (isSelected) {
                      style = 'border-[#00e676]/40 bg-[#00e676]/5 text-white'
                    }

                    return (
                      <button
                        key={oi}
                        onClick={() => !submitted && setAnswers(prev => ({ ...prev, [qi]: oi }))}
                        disabled={submitted}
                        className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${style} ${!submitted ? 'hover:border-white/20 hover:bg-white/4' : ''}`}
                      >
                        <MathText text={opt} />
                      </button>
                    )
                  })}
                </div>
                {submitted && qResult && (
                  <div className={`mt-3 p-3 rounded-lg text-xs ${qResult.correct ? 'bg-[#00e676]/5 text-[#00e676]/80' : 'bg-white/5 text-white/50'}`}>
                    <span className="font-medium">Explanation: </span>{qResult.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {!submitted && (
          <div className="mt-8">
            <button
              onClick={submit}
              disabled={!allAnswered || loading}
              className="w-full py-3 rounded-xl bg-[#00e676] text-black font-semibold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              {loading ? 'Submitting...' : !allAnswered ? `Answer all ${questions.length} questions first` : 'Submit Quiz'}
            </button>
          </div>
        )}

        {submitted && !result?.passed && (
          <div className="mt-6 text-center">
            <button onClick={() => { setAnswers({}); setSubmitted(false); setResult(null) }}
              className="text-sm text-[#00e676] hover:underline">
              ↺ Retake quiz
            </button>
          </div>
        )}

        {/* Bonus Problems */}
        {showBonus && (
          <div className="mt-10 border-t border-white/8 pt-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#00e676] text-lg">✦</span>
              <h2 className="font-syne font-semibold text-lg">Bonus Problems</h2>
              <span className="text-xs text-white/30 ml-1">AI-generated for exam prep</span>
            </div>

            {loadingBonus ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-24 rounded-xl bg-white/4 animate-pulse" />
                ))}
              </div>
            ) : bonusProblems.length > 0 ? (
              <div className="space-y-4">
                {bonusProblems.map((bp, i) => (
                  <div key={i} className="rounded-xl border border-white/8 bg-white/4 p-4">
                    <div className="text-xs text-[#00e676] font-medium mb-2">Problem {i + 1}</div>
                    <p className="text-sm text-white/80 mb-3"><MathText text={bp.problem} /></p>
                    <details className="group">
                      <summary className="text-xs text-white/30 cursor-pointer hover:text-white/60 list-none flex justify-between">
                        <span>Hint</span><span className="group-open:rotate-45 text-base transition-transform">+</span>
                      </summary>
                      <p className="text-xs text-white/50 mt-2 pl-2 border-l border-white/10"><MathText text={bp.hint} /></p>
                    </details>
                    <details className="group mt-2">
                      <summary className="text-xs text-white/30 cursor-pointer hover:text-white/60 list-none flex justify-between">
                        <span>Show solution</span><span className="group-open:rotate-45 text-base transition-transform">+</span>
                      </summary>
                      <div className="text-xs text-white/60 mt-2 pl-2 border-l border-[#00e676]/20 space-y-1">
                        <MathText text={bp.solution} />
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/30 text-sm">Could not load bonus problems. Check your connection.</p>
            )}
          </div>
        )}

        {/* Nav */}
        <div className="mt-8 flex justify-between">
          <Link href={`/learn/${slug}`} className="text-sm text-white/40 hover:text-white transition-colors">
            ← Review chapter
          </Link>
          <Link href="/learn" className="text-sm text-white/40 hover:text-white transition-colors">
            All chapters →
          </Link>
        </div>
      </div>
    </div>
  )
}
