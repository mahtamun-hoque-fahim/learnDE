'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CHAPTERS } from '@/lib/chapters'

type Profile = {
  displayName: string
  university: string
  department: string
  batch?: string | null
  gender: string
}

type Quote = {
  id: number
  text: string
  author?: string | null
}

type CertData = {
  eligible: boolean
  needsProfile?: boolean
  reason?: string
  certificate?: {
    certificateId: string
    issuedAt: string
    profileSnapshot?: Profile
  }
  profile?: Profile | null
  quote?: Quote | null
  completedChapters?: string[]
  passedQuizzes?: string[]
  totalChapters?: number
}

export default function CertificatePage() {
  const router = useRouter()
  const [data, setData] = useState<CertData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/certificate')
      .then(r => r.json())
      .then(d => {
        setData(d)
        if (d.needsProfile) router.replace('/profile')
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white/30 text-sm animate-pulse">Loading certificate...</div>
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
        <div className="text-5xl mb-6">📚</div>
        <h1 className="font-syne font-bold text-2xl text-white mb-3">Not eligible yet</h1>
        <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">{data?.reason}</p>
        <div className="rounded-xl border border-white/8 bg-white/4 p-5 mb-6 max-w-sm mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-white/60">Progress</span>
            <span className="text-sm font-syne text-[#00e676]">{pct}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-[#00e676] rounded-full transition-all" style={{ width: `${pct}%` }} />
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
      </div>
    </div>
  )

  const cert = data.certificate!
  const profile: Profile = (cert.profileSnapshot ?? data.profile) as Profile
  const quote = data.quote

  const issuedDate = new Date(cert.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md print:hidden">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-white/50 hover:text-white flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/profile" className="text-xs text-white/30 hover:text-white/60">Edit profile</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-5 max-w-3xl mx-auto">
        <div className="text-center mb-8 print:hidden">
          <div className="text-4xl mb-3">🎓</div>
          <h1 className="font-syne font-bold text-2xl text-white">Certificate of Completion</h1>
          <p className="text-white/40 text-sm mt-1">Congratulations on completing the course!</p>
        </div>

        {/* Certificate */}
        <div
          id="certificate"
          className="relative rounded-2xl border-2 border-[#00e676]/30 bg-gradient-to-br from-[#00e676]/5 via-transparent to-transparent p-8 md:p-12 text-center mb-8 overflow-hidden"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {/* Decorative corners */}
          {[
            'top-4 left-4 border-t-2 border-l-2 rounded-tl-lg',
            'top-4 right-4 border-t-2 border-r-2 rounded-tr-lg',
            'bottom-4 left-4 border-b-2 border-l-2 rounded-bl-lg',
            'bottom-4 right-4 border-b-2 border-r-2 rounded-br-lg',
          ].map((cls, i) => (
            <div key={i} className={`absolute w-8 h-8 border-[#00e676]/40 ${cls}`} />
          ))}

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
            <span className="font-syne font-black text-[120px] text-white rotate-[-30deg]">DE</span>
          </div>

          <div className="relative z-10">
            <div className="text-[10px] text-[#00e676] tracking-[0.2em] uppercase mb-8">
              LearnD.E. · Certificate of Completion
            </div>

            <p className="text-white/40 text-sm mb-2">This certifies that</p>
            <h2 className="font-syne font-bold text-3xl md:text-4xl text-white mb-1">
              {profile?.displayName || 'Student'}
            </h2>
            {profile?.batch && (
              <p className="text-white/30 text-xs mb-4">{profile.batch}</p>
            )}

            <p className="text-white/40 text-sm mb-2">from</p>
            <p className="font-syne font-semibold text-lg text-white/90 mb-1">
              {profile?.university || '—'}
            </p>
            <p className="text-[#00e676]/60 text-sm mb-6">
              Department of {profile?.department || '—'}
            </p>

            <p className="text-white/40 text-sm mb-2">has successfully completed</p>
            <h3 className="font-syne font-semibold text-xl text-[#00e676] mb-1">
              Differential Equations
            </h3>
            <p className="text-white/50 text-sm mb-8">
              BSc (Hons.) Computer Science &amp; Engineering · 2nd Semester
            </p>

            <div className="flex items-center justify-center gap-4 text-xs text-white/25 mb-8">
              <span>8 Chapters</span>
              <span>·</span>
              <span>8 Quizzes Passed</span>
              <span>·</span>
              <span>H.K. Dass §3.9–3.11</span>
            </div>

            {/* Quote */}
            {quote && (
              <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-white/4 border border-[#00e676]/10">
                <p className="text-white/60 text-sm italic leading-relaxed">
                  &ldquo;{quote.text}&rdquo;
                </p>
                {quote.author && (
                  <p className="text-[#00e676]/50 text-xs mt-2">— {quote.author}</p>
                )}
              </div>
            )}

            {/* Cert ID + date */}
            <div className="inline-block px-4 py-2 rounded-lg bg-white/4 border border-white/8 mb-3">
              <div className="text-[10px] text-white/30 uppercase tracking-wider">Certificate ID</div>
              <div className="font-mono text-sm text-white mt-0.5">{cert.certificateId}</div>
            </div>
            <div className="text-xs text-white/20">Issued on {issuedDate}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center print:hidden">
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 rounded-full border border-white/10 text-white/60 text-sm hover:border-white/20 transition-colors"
          >
            🖨 Print
          </button>
          <Link
            href="/profile"
            className="px-6 py-2.5 rounded-full bg-white/5 text-white/60 text-sm hover:bg-white/8 transition-colors border border-white/8"
          >
            ✏️ Edit Profile
          </Link>
          <Link
            href="/learn"
            className="px-6 py-2.5 rounded-full bg-white/5 text-white/60 text-sm hover:bg-white/8 transition-colors border border-white/8"
          >
            ← Back to course
          </Link>
        </div>
      </div>
    </div>
  )
}
