'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CHAPTERS } from '@/lib/chapters'

type CertData = {
  eligible: boolean
  reason?: string
  certificate?: { certificateId: string; issuedAt: string }
  completedChapters?: string[]
  passedQuizzes?: string[]
  totalChapters?: number
}

export default function CertificatePage() {
  const [data, setData] = useState<CertData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [certRes, sessRes] = await Promise.all([
          fetch('/api/certificate'),
          fetch('/api/auth/session'),
        ])
        const certData = await certRes.json()
        const sessData = await sessRes.json()
        setData(certData)
        setUserName(sessData.user?.name || '')
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white/30 text-sm">Checking eligibility...</div>
    </div>
  )

  const completed = data?.completedChapters?.length ?? 0
  const passed = data?.passedQuizzes?.length ?? 0
  const total = data?.totalChapters ?? CHAPTERS.length
  const pct = Math.round(((completed + passed) / (total * 2)) * 100)

  if (!data?.eligible) return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center">
          <Link href="/dashboard" className="text-sm text-white/50 hover:text-white flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
        </div>
      </nav>
      <div className="pt-24 pb-16 px-5 max-w-3xl mx-auto text-center">
        <div className="text-4xl mb-6">📚</div>
        <h1 className="font-syne font-bold text-2xl mb-3">Almost there!</h1>
        <p className="text-white/40 mb-8">Complete all chapters and pass all quizzes to earn your certificate.</p>

        <div className="max-w-sm mx-auto mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/40">Progress</span>
            <span className="text-[#00e676]">{pct}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[#00e676] rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/4 border border-white/8">
              <div className="text-lg font-bold text-white">{completed}/{total}</div>
              <div className="text-xs text-white/40">Chapters read</div>
            </div>
            <div className="p-3 rounded-lg bg-white/4 border border-white/8">
              <div className="text-lg font-bold text-white">{passed}/{total}</div>
              <div className="text-xs text-white/40">Quizzes passed</div>
            </div>
          </div>
        </div>

        <Link href="/learn" className="inline-block px-8 py-3 bg-[#00e676] text-black font-semibold rounded-full text-sm">
          Continue Learning →
        </Link>

        {!data?.eligible && data?.reason === 'Not signed in' && (
          <p className="mt-6 text-sm text-white/30">
            <Link href="/login" className="text-[#00e676] hover:underline">Sign in</Link> to track your progress and earn a certificate.
          </p>
        )}
      </div>
    </div>
  )

  const cert = data.certificate!
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center">
          <Link href="/dashboard" className="text-sm text-white/50 hover:text-white flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-5 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎓</div>
          <h1 className="font-syne font-bold text-2xl text-white">Certificate of Completion</h1>
          <p className="text-white/40 text-sm mt-1">Congratulations on completing the course!</p>
        </div>

        {/* Certificate card */}
        <div id="certificate" className="relative rounded-2xl border-2 border-[#00e676]/30 bg-gradient-to-br from-[#00e676]/5 to-transparent p-8 md:p-12 text-center mb-8 overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00e676]/40 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00e676]/40 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00e676]/40 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00e676]/40 rounded-br-lg" />

          <div className="text-xs text-[#00e676] tracking-widest uppercase mb-6">LearnD.E. · Certificate of Completion</div>

          <p className="text-white/40 text-sm mb-2">This certifies that</p>
          <h2 className="font-syne font-bold text-3xl md:text-4xl text-white mb-4">{userName || 'Student'}</h2>
          <p className="text-white/40 text-sm mb-2">has successfully completed</p>
          <h3 className="font-syne font-semibold text-xl text-[#00e676] mb-6">
            Differential Equations<br />
            <span className="text-base font-normal text-white/60">BSc (Hons.) Computer Science & Engineering · 2nd Semester</span>
          </h3>

          <div className="flex items-center justify-center gap-4 text-xs text-white/30 mb-6">
            <span>8 Chapters Completed</span>
            <span>·</span>
            <span>All Quizzes Passed</span>
            <span>·</span>
            <span>H.K. Dass §3.9–3.11</span>
          </div>

          <div className="inline-block px-4 py-2 rounded-lg bg-white/4 border border-white/8">
            <div className="text-xs text-white/30">Certificate ID</div>
            <div className="font-mono text-sm text-white mt-0.5">{cert.certificateId}</div>
          </div>

          <div className="mt-4 text-xs text-white/20">Issued on {issuedDate}</div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => window.print()}
            className="px-6 py-2.5 rounded-full border border-white/10 text-white/60 text-sm hover:border-white/20 transition-colors">
            🖨 Print Certificate
          </button>
          <Link href="/learn" className="px-6 py-2.5 rounded-full bg-white/5 text-white/60 text-sm hover:bg-white/8 transition-colors border border-white/8">
            ← Back to course
          </Link>
        </div>
      </div>
    </div>
  )
}
