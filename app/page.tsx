import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { CHAPTERS } from '@/lib/chapters'

export default async function HomePage() {
  const session = await getSession()

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="font-syne font-semibold text-base tracking-tight">
            Learn<span className="text-[#00e676]">D.E.</span>
          </span>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">Dashboard</Link>
                <Link href="/learn" className="text-sm px-4 py-1.5 rounded-full font-medium bg-[#00e676] text-black">Continue</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">Sign in</Link>
                <Link href="/register" className="text-sm px-4 py-1.5 rounded-full font-medium bg-[#00e676] text-black">Get started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-5 max-w-5xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-[#00e676] text-[#00e676] bg-[#00e676]/10 mb-6">
            BSc (Hons.) CSE · 2nd Semester · H.K. Dass §3.9–3.11
          </div>
          <h1 className="font-syne font-bold text-4xl md:text-6xl leading-tight mb-5">
            Master<br /><span className="text-[#00e676]">Differential Equations</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
            Read every chapter interactively, test yourself with quizzes, earn bonus problems, and get a certificate when you are done.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/learn" className="px-7 py-3 rounded-full font-semibold text-sm bg-[#00e676] text-black hover:opacity-90 transition-opacity">
              Start Learning →
            </Link>
            {!session && (
              <Link href="/register" className="px-7 py-3 rounded-full font-medium text-sm border border-white/10 text-white/70 hover:border-white/20 transition-colors">
                Sign up free
              </Link>
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[['8', 'Chapters'], ['40+', 'Quiz Qs'], ['1', 'Certificate']].map(([n, l]) => (
            <div key={l} className="rounded-xl p-4 text-center border border-white/8 bg-white/4">
              <div className="font-syne text-2xl font-bold text-[#00e676]">{n}</div>
              <div className="text-xs text-white/40 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-24 max-w-5xl mx-auto">
        <h2 className="font-syne font-semibold text-xl mb-6">Course Chapters</h2>
        <div className="grid gap-3">
          {CHAPTERS.map((ch) => (
            <Link key={ch.slug} href={"/learn/" + ch.slug}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/4 hover:border-white/20 transition-all">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-syne font-bold flex-shrink-0 bg-[#00e676]/10 text-[#00e676]">
                {ch.order}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-white">{ch.title}</div>
                {ch.ref && <div className="text-xs text-white/30 mt-0.5">{ch.ref}</div>}
                <div className="text-xs text-white/40 mt-0.5 truncate">{ch.summary}</div>
              </div>
              <svg className="w-4 h-4 text-white/20 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 py-8 text-center text-xs text-white/20">
        LearnD.E. · Built for CSE 2nd Semester · Reference: H.K. Dass Engineering Mathematics
      </div>
    </div>
  )
}
