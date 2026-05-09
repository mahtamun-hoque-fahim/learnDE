'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Sub = { status: string; displayName: string; university: string; department: string; batch?: string; gender: string; submittedAt: string }
type Cert = { certificateId: string; issuedAt: string; quoteText?: string; quoteAuthor?: string; profileSnapshot?: Record<string, string> }

export default function CertificatePage() {
  const [sub, setSub] = useState<Sub | null>(null)
  const [cert, setCert] = useState<Cert | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/submissions').then(r => r.json()).then(d => {
      setSub(d.submission)
      setCert(d.certificate)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-white/30 text-sm animate-pulse">Loading...</div></div>

  const Nav = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md print:hidden">
      <div className="max-w-3xl mx-auto px-5 h-14 flex items-center gap-3">
        <Link href="/dashboard" className="text-sm text-white/50 hover:text-white flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Dashboard
        </Link>
      </div>
    </nav>
  )

  if (!cert) return (
    <div className="min-h-screen">
      <Nav />
      <div className="pt-24 pb-16 px-5 max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="font-syne font-bold text-xl text-white mb-2">Certificate Not Issued Yet</h1>
        <p className="text-white/40 text-sm mb-6">Your submission is {sub?.status === 'under_review' ? 'under review' : 'pending review'}. You'll be notified by email once it's approved.</p>
        <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-white/5 border border-white/8 text-white/60 text-sm">← Back to Dashboard</Link>
      </div>
    </div>
  )

  const profile = (cert.profileSnapshot ?? sub) as Record<string, string>
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="pt-20 pb-16 px-5 max-w-3xl mx-auto">
        <div className="text-center mb-8 print:hidden">
          <p className="text-[#00e676] text-xs tracking-widest uppercase font-medium mb-2">Verified & Approved</p>
          <h1 className="font-syne font-bold text-2xl text-white">Your Certificates</h1>
          <p className="text-white/30 text-sm mt-1">Two certificates are issued upon approval</p>
        </div>

        {/* ── Certificate 1: Completion ── */}
        <div className="mb-6">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3 font-medium print:hidden">① Certificate of Completion</p>
          <div id="cert-completion" className="relative rounded-2xl border-2 border-[#00e676]/25 bg-gradient-to-br from-[#00e676]/5 via-transparent to-transparent p-8 md:p-12 text-center overflow-hidden">
            {/* Corner decorations */}
            {['top-4 left-4 border-t-2 border-l-2 rounded-tl-lg','top-4 right-4 border-t-2 border-r-2 rounded-tr-lg','bottom-4 left-4 border-b-2 border-l-2 rounded-bl-lg','bottom-4 right-4 border-b-2 border-r-2 rounded-br-lg'].map((c,i) => <div key={i} className={`absolute w-8 h-8 border-[#00e676]/30 ${c}`}/>)}
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] select-none pointer-events-none">
              <span className="font-syne font-black text-[100px] text-white rotate-[-25deg]">D.E.</span>
            </div>
            <div className="relative z-10">
              <div className="text-[10px] text-[#00e676] tracking-[0.25em] uppercase mb-6">LearnD.E. · Certificate of Completion</div>
              <p className="text-white/40 text-xs mb-2">This certifies that</p>
              <h2 className="font-syne font-bold text-3xl md:text-4xl text-white mb-1">{profile.displayName}</h2>
              {profile.batch && <p className="text-white/25 text-xs mb-4">{profile.batch}</p>}
              <p className="text-white/40 text-xs mb-1">from</p>
              <p className="font-syne font-semibold text-lg text-white/90 mb-0.5">{profile.university}</p>
              <p className="text-[#00e676]/60 text-sm mb-6">Department of {profile.department}</p>
              <p className="text-white/40 text-xs mb-1">has successfully completed</p>
              <h3 className="font-syne font-semibold text-xl text-[#00e676] mb-1">Differential Equations</h3>
              <p className="text-white/40 text-sm mb-8">BSc (Hons.) Computer Science &amp; Engineering · 2nd Semester<br/><span className="text-xs">Based on H.K. Dass §3.9–3.11</span></p>
              <div className="flex items-center justify-center gap-4 text-[10px] text-white/20 mb-6">
                <span>8 Chapters Completed</span><span>·</span><span>8 Quizzes Passed</span><span>·</span><span>Coursework Verified</span>
              </div>
              <div className="inline-block px-4 py-2 rounded-lg bg-white/4 border border-white/8 mb-3">
                <div className="text-[10px] text-white/30 uppercase tracking-wider">Certificate ID</div>
                <div className="font-mono text-sm text-white mt-0.5">{cert.certificateId}</div>
              </div>
              <div className="text-[10px] text-white/15">Issued {issuedDate}</div>
            </div>
          </div>
        </div>

        {/* ── Certificate 2: Quote ── */}
        {cert.quoteText && (
          <div className="mb-8">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3 font-medium print:hidden">② Personal Quote Certificate</p>
            <div id="cert-quote" className="relative rounded-2xl border-2 border-white/10 bg-gradient-to-br from-white/4 via-transparent to-transparent p-8 md:p-12 text-center overflow-hidden">
              {['top-4 left-4 border-t border-l rounded-tl-lg','top-4 right-4 border-t border-r rounded-tr-lg','bottom-4 left-4 border-b border-l rounded-bl-lg','bottom-4 right-4 border-b border-r rounded-br-lg'].map((c,i) => <div key={i} className={`absolute w-8 h-8 border-white/15 ${c}`}/>)}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] select-none pointer-events-none">
                <span className="font-syne font-black text-[100px] text-white rotate-[-25deg]">&ldquo;&rdquo;</span>
              </div>
              <div className="relative z-10">
                <div className="text-[10px] text-white/30 tracking-[0.25em] uppercase mb-8">LearnD.E. · Personal Quote Certificate</div>
                <div className="text-5xl mb-6 opacity-20">&ldquo;</div>
                <blockquote className="font-syne text-xl md:text-2xl text-white/90 leading-relaxed mb-6 max-w-lg mx-auto">
                  {cert.quoteText}
                </blockquote>
                {cert.quoteAuthor && <p className="text-[#00e676]/60 text-sm mb-8">— {cert.quoteAuthor}</p>}
                <div className="border-t border-white/8 pt-6 mt-2">
                  <p className="text-white/30 text-xs mb-1">Personally written for</p>
                  <p className="font-syne font-semibold text-white/80">{profile.displayName}</p>
                  <p className="text-white/25 text-xs">{profile.university} · {profile.department}</p>
                </div>
                <div className="mt-4 text-[10px] text-white/15">Issued {issuedDate} · {cert.certificateId}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center print:hidden">
          <button onClick={() => window.print()} className="px-6 py-2.5 rounded-full border border-white/10 text-white/60 text-sm hover:border-white/20">
            🖨 Print Both
          </button>
          <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-white/5 border border-white/8 text-white/60 text-sm hover:bg-white/8">
            ← Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
