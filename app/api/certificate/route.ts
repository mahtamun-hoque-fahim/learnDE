import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { certificates, progress, quizAttempts } from '@/lib/db/schema'
import { getSessionFromRequest } from '@/lib/auth'
import { CHAPTERS } from '@/lib/chapters'
import { eq, and } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ eligible: false, reason: 'Not signed in' })

  const db = getDb()
  if (!db) return NextResponse.json({ eligible: false, reason: 'Database unavailable' })

  const [userProgress, userAttempts, existingCert] = await Promise.all([
    db.select().from(progress).where(eq(progress.userId, session.id)),
    db.select().from(quizAttempts).where(eq(quizAttempts.userId, session.id)),
    db.select().from(certificates).where(eq(certificates.userId, session.id)).limit(1),
  ])

  const completedChapters = userProgress.filter(p => p.completed).map(p => p.chapterSlug)
  const passedQuizzes = userAttempts.filter(a => a.passed).map(a => a.chapterSlug)

  const allDone = CHAPTERS.every(ch =>
    completedChapters.includes(ch.slug) && passedQuizzes.includes(ch.slug)
  )

  if (existingCert.length > 0) {
    return NextResponse.json({
      eligible: true,
      certificate: existingCert[0],
      completedChapters,
      passedQuizzes,
      totalChapters: CHAPTERS.length,
    })
  }

  if (!allDone) {
    return NextResponse.json({
      eligible: false,
      completedChapters,
      passedQuizzes,
      totalChapters: CHAPTERS.length,
      reason: 'Complete all chapters and pass all quizzes first',
    })
  }

  // Issue certificate
  const certId = `LDE-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`
  const [cert] = await db.insert(certificates).values({
    userId: session.id,
    certificateId: certId,
  }).returning()

  return NextResponse.json({
    eligible: true,
    certificate: cert,
    completedChapters,
    passedQuizzes,
    totalChapters: CHAPTERS.length,
  })
}
