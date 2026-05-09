import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { CHAPTERS } from '@/lib/chapters'
import { getDb } from '@/lib/db'
import { progress, quizAttempts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function LearnPage() {
  const session = await getSession()
  let completedChapters: string[] = []
  let passedQuizzes: string[] = []

  if (session) {
    const db = getDb()
    if (db) {
      const [prog, attempts] = await Promise.all([
        db.select().from(progress).where(eq(progress.userId, session.id)),
        db.select().from(quizAttempts).where(eq(quizAttempts.userId, session.id)),
      ])
      completedChapters = prog.filter(p => p.completed).map(p => p.chapterSlug)
      passedQuizzes = attempts.filter(a => a.passed).map(a => a.chapterSlug)
    }
  }

  const totalCompleted = completedChapters.length
  const totalPassed = passedQuizzes.length
  const overallPct = Math.round(((totalCompleted + totalPassed) / (CHAPTERS.length * 2)) * 100)

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="font-syne font-semibold text-base">
            Learn<span className="text-[#00e676]">D.E.</span>
          </Link>
          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">
                {session.name.split(' ')[0]}
              </Link>
            ) : (
              <Link href="/login" className="text-sm text-[#00e676]">Sign in to track progress</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-5 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-syne font-bold text-2xl mb-1">Course Overview</h1>
          <p className="text-white/40 text-sm">8 chapters · H.K. Dass Engineering Mathematics §3.9–3.11</p>

          {session && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-white/40 mb-1.5">
                <span>Overall Progress</span>
                <span>{overallPct}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#00e676] rounded-full transition-all" style={{ width: `${overallPct}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-3">
          {CHAPTERS.map((ch) => {
            const read = completedChapters.includes(ch.slug)
            const passed = passedQuizzes.includes(ch.slug)
            const done = read && passed

            return (
              <div key={ch.slug} className="rounded-xl border border-white/8 bg-white/4 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-syne font-bold flex-shrink-0 ${done ? 'bg-[#00e676] text-black' : 'bg-white/5 text-white/40'}`}>
                      {done ? '✓' : ch.order}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-white">{ch.title}</h3>
                      {ch.ref && <p className="text-xs text-white/30 mt-0.5">{ch.ref}</p>}
                      <p className="text-xs text-white/40 mt-1">{ch.summary}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 ml-11">
                    <Link href={`/learn/${ch.slug}`}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${read ? 'bg-white/5 text-white/50 hover:bg-white/8' : 'bg-[#00e676] text-black hover:opacity-90'}`}>
                      {read ? '✓ Read again' : 'Read chapter'}
                    </Link>
                    <Link href={`/quiz/${ch.slug}`}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${passed ? 'border-white/10 text-white/40' : 'border-[#00e676]/30 text-[#00e676] hover:bg-[#00e676]/5'}`}>
                      {passed ? '✓ Quiz passed' : 'Take quiz'}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {session && overallPct === 100 && (
          <div className="mt-6 p-5 rounded-xl border border-[#00e676]/30 bg-[#00e676]/5 text-center">
            <div className="text-2xl mb-2">🎉</div>
            <p className="font-syne font-semibold text-[#00e676] mb-1">All chapters complete!</p>
            <p className="text-sm text-white/50 mb-4">You&apos;re ready for your certificate.</p>
            <Link href="/certificate" className="inline-block px-6 py-2.5 bg-[#00e676] text-black font-semibold text-sm rounded-full">
              Get Certificate →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
