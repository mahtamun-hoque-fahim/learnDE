import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { progress, quizAttempts, certSubmissions, certificates } from '@/lib/db/schema'
import { CHAPTERS } from '@/lib/chapters'
import { eq } from 'drizzle-orm'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const db = getDb()
  let completedChapters: string[] = []
  let passedQuizzes: string[] = []
  let submission: typeof certSubmissions.$inferSelect | null = null
  let certificate: typeof certificates.$inferSelect | null = null

  if (db) {
    const [prog, attempts, subs, certs] = await Promise.all([
      db.select().from(progress).where(eq(progress.userId, session.id)),
      db.select().from(quizAttempts).where(eq(quizAttempts.userId, session.id)),
      db.select().from(certSubmissions).where(eq(certSubmissions.userId, session.id)).limit(1),
      db.select().from(certificates).where(eq(certificates.userId, session.id)).limit(1),
    ])
    completedChapters = prog.filter(p => p.completed).map(p => p.chapterSlug)
    passedQuizzes = attempts.filter(a => a.passed).map(a => a.chapterSlug)
    submission = subs[0] ?? null
    certificate = certs[0] ?? null
  }

  const totalRead = completedChapters.length
  const totalPassed = passedQuizzes.length
  const totalChapters = CHAPTERS.length
  const overallPct = Math.round(((totalRead + totalPassed) / (totalChapters * 2)) * 100)
  const allDone = totalRead === totalChapters && totalPassed === totalChapters
  const nextChapter = CHAPTERS.find(ch => !completedChapters.includes(ch.slug) || !passedQuizzes.includes(ch.slug))

  const statusStyle: Record<string, { bg: string; text: string; border: string; icon: string; label: string }> = {
    pending:      { bg: 'bg-amber-500/5',   text: 'text-amber-400',   border: 'border-amber-500/20',   icon: '⏳', label: 'Pending Review' },
    under_review: { bg: 'bg-blue-500/5',    text: 'text-blue-400',    border: 'border-blue-500/20',    icon: '🔍', label: 'Under Review' },
    approved:     { bg: 'bg-[#00e676]/5',   text: 'text-[#00e676]',  border: 'border-[#00e676]/20',   icon: '🎓', label: 'Certificate Ready!' },
    rejected:     { bg: 'bg-red-500/5',     text: 'text-red-400',     border: 'border-red-500/20',     icon: '✗',  label: 'Not Approved — Resubmit' },
  }

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="font-syne font-semibold text-base">Learn<span className="text-[#00e676]">D.E.</span></Link>
          <Link href="/api/auth/logout" className="text-sm text-white/40 hover:text-white/70">Sign out</Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-5 max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-white/30 text-sm">Welcome back,</p>
          <h1 className="font-syne font-bold text-2xl text-white">{session.name}</h1>
        </div>

        {/* Overall progress */}
        <div className="rounded-xl border border-white/8 bg-white/4 p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-white">Overall Progress</span>
            <span className="text-sm font-syne text-[#00e676]">{overallPct}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#00e676] rounded-full transition-all duration-700" style={{ width: `${overallPct}%` }} />
          </div>
          <div className="flex gap-6 mt-4">
            <div><div className="text-lg font-syne font-bold text-white">{totalRead}/{totalChapters}</div><div className="text-xs text-white/40">Chapters read</div></div>
            <div><div className="text-lg font-syne font-bold text-white">{totalPassed}/{totalChapters}</div><div className="text-xs text-white/40">Quizzes passed</div></div>
            <div><div className="text-lg font-syne font-bold text-white">{totalChapters - totalRead}</div><div className="text-xs text-white/40">Remaining</div></div>
          </div>
        </div>

        {/* ── Certificate section ── */}
        {certificate ? (
          /* Approved: show both certificate cards */
          <div className="mb-6 space-y-3">
            <Link href="/certificate" className="flex items-center gap-4 p-5 rounded-xl border border-[#00e676]/30 bg-[#00e676]/5 hover:bg-[#00e676]/8 transition-colors">
              <div className="text-3xl">📜</div>
              <div className="flex-1">
                <div className="font-syne font-semibold text-[#00e676]">Certificate of Completion</div>
                <div className="text-xs text-white/40 mt-0.5">View your verified completion certificate</div>
              </div>
              <svg className="w-5 h-5 text-[#00e676]/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </Link>
            {certificate.quoteText && (
              <Link href="/certificate" className="flex items-center gap-4 p-5 rounded-xl border border-white/10 bg-white/3 hover:bg-white/5 transition-colors">
                <div className="text-3xl">💬</div>
                <div className="flex-1">
                  <div className="font-syne font-semibold text-white/80">Personal Quote Certificate</div>
                  <p className="text-xs text-white/30 mt-0.5 italic truncate max-w-xs">&ldquo;{certificate.quoteText}&rdquo;</p>
                </div>
                <svg className="w-5 h-5 text-white/20 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Link>
            )}
          </div>
        ) : submission ? (
          /* Submitted: show status card */
          <div className={`mb-6 p-5 rounded-xl border ${statusStyle[submission.status]?.border ?? 'border-white/8'} ${statusStyle[submission.status]?.bg ?? 'bg-white/4'}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{statusStyle[submission.status]?.icon ?? '📋'}</span>
              <div className="flex-1">
                <div className={`font-syne font-semibold ${statusStyle[submission.status]?.text ?? 'text-white'}`}>
                  {statusStyle[submission.status]?.label ?? submission.status}
                </div>
                <div className="text-xs text-white/30 mt-0.5">
                  {submission.status === 'pending' && 'Your request is in the queue. Expect a response within 3 days.'}
                  {submission.status === 'under_review' && 'A moderator is reviewing your coursework right now.'}
                  {submission.status === 'rejected' && (submission.reviewNote || 'Your submission was not approved.')}
                </div>
              </div>
              {submission.status === 'rejected' && (
                <Link href="/profile" className="text-xs px-3 py-1.5 rounded-lg bg-white/8 text-white/60 hover:text-white border border-white/10">Resubmit</Link>
              )}
            </div>
          </div>
        ) : allDone ? (
          /* Course done but not submitted */
          <Link href="/profile" className="flex items-center gap-4 p-5 rounded-xl border border-[#00e676]/30 bg-[#00e676]/5 mb-6 hover:bg-[#00e676]/8 transition-colors">
            <div className="text-3xl">🎓</div>
            <div>
              <div className="font-syne font-semibold text-[#00e676]">Course Complete!</div>
              <div className="text-sm text-white/50">Apply for your certificate now</div>
            </div>
            <svg className="w-5 h-5 text-[#00e676] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </Link>
        ) : nextChapter ? (
          <div className="rounded-xl border border-white/8 bg-white/4 p-5 mb-6">
            <div className="text-xs text-white/30 mb-1">Continue where you left off</div>
            <div className="font-medium text-white mb-3">{nextChapter.title}</div>
            <div className="flex gap-2">
              {!completedChapters.includes(nextChapter.slug) && <Link href={`/learn/${nextChapter.slug}`} className="text-xs px-3 py-1.5 bg-[#00e676] text-black font-semibold rounded-lg">Read chapter →</Link>}
              {completedChapters.includes(nextChapter.slug) && !passedQuizzes.includes(nextChapter.slug) && <Link href={`/quiz/${nextChapter.slug}`} className="text-xs px-3 py-1.5 bg-[#00e676] text-black font-semibold rounded-lg">Take quiz →</Link>}
            </div>
          </div>
        ) : null}

        {/* Chapter list */}
        <h2 className="font-syne font-semibold text-base mb-3 text-white/70">All Chapters</h2>
        <div className="space-y-2 mb-8">
          {CHAPTERS.map(ch => {
            const read = completedChapters.includes(ch.slug)
            const passed = passedQuizzes.includes(ch.slug)
            return (
              <div key={ch.slug} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/2">
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0 ${read && passed ? 'bg-[#00e676] text-black' : 'bg-white/5 text-white/30'}`}>{read && passed ? '✓' : ch.order}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{ch.title}</div>
                  <div className="flex gap-3 mt-0.5">
                    <span className={`text-[10px] ${read ? 'text-[#00e676]' : 'text-white/20'}`}>{read ? '✓ Read' : '○ Not read'}</span>
                    <span className={`text-[10px] ${passed ? 'text-[#00e676]' : 'text-white/20'}`}>{passed ? '✓ Quiz passed' : '○ Quiz pending'}</span>
                  </div>
                </div>
                <Link href={`/learn/${ch.slug}`} className="text-xs text-white/20 hover:text-white/50">→</Link>
              </div>
            )
          })}
        </div>

        <Link href="/cheatsheet" className="flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/4 hover:border-white/15 transition-colors">
          <div className="text-xl">📋</div>
          <div><div className="text-sm font-medium text-white">Exam Cheat Sheet</div><div className="text-xs text-white/40">Quick reference for all DE methods</div></div>
          <svg className="w-4 h-4 text-white/20 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </Link>
      </div>
    </div>
  )
}
