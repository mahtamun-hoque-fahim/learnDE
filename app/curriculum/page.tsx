import Link from 'next/link'
import { LogoMark } from '@/app/components/Logo'
import { getServerSession } from '@/lib/auth-server'
import { CHAPTERS } from '@/lib/chapters'
import { getDb } from '@/lib/db'
import { progress, quizAttempts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import ChapterList from './ChapterList'

export default async function LearnPage() {
  const session = await getServerSession()
  let completedChapters: string[] = []
  let passedQuizzes: string[] = []

  if (session) {
    const db = getDb()
    if (db) {
      const userId = session.user.id
      const [prog, attempts] = await Promise.all([
        db.select().from(progress).where(eq(progress.userId, userId)),
        db.select().from(quizAttempts).where(eq(quizAttempts.userId, userId)),
      ])
      completedChapters = prog.filter(p => p.completed).map(p => p.chapterSlug)
      passedQuizzes = attempts.filter(a => a.passed).map(a => a.chapterSlug)
    }
  }

  const totalCompleted = completedChapters.length
  const totalPassed    = passedQuizzes.length
  const overallPct     = Math.round(((totalCompleted + totalPassed) / (CHAPTERS.length * 2)) * 100)

  const chapters = CHAPTERS.map(ch => ({
    slug: ch.slug,
    title: ch.title,
    order: ch.order,
    ref: ch.ref,
    summary: ch.summary,
    read: completedChapters.includes(ch.slug),
    passed: passedQuizzes.includes(ch.slug),
  }))

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 80, backdropFilter: 'saturate(1.2) blur(14px)', background: 'rgba(7,8,7,.65)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <LogoMark size={32} />
          <div>
            {session ? (
              <Link href="/dashboard" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
                {session.user.name.split(' ')[0]}
              </Link>
            ) : (
              <Link href="/login" style={{ fontSize: 13, color: 'var(--mint)', textDecoration: 'none' }}>
                Sign in to track progress
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 32px 120px' }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.18em', color: 'var(--mint)', fontFamily: 'var(--font-mono),monospace', marginBottom: 16 }}>
            / Curriculum
          </div>
          <h1 style={{ fontSize: 'clamp(48px,6vw,80px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: .95, margin: '0 0 16px', color: 'var(--text)' }}>
            Course Overview
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted)', margin: 0 }}>
            8 chapters · H.K. Dass Engineering Mathematics §3.9–3.11
          </p>
        </div>

        <ChapterList
          chapters={chapters}
          overallPct={overallPct}
          isLoggedIn={!!session}
        />
      </div>
    </div>
  )
}
