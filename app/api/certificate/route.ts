import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { certificates, progress, quizAttempts, studentProfiles, quotes } from '@/lib/db/schema'
import { getSessionFromRequest } from '@/lib/auth'
import { CHAPTERS } from '@/lib/chapters'
import { eq, and } from 'drizzle-orm'
import { randomUUID } from 'crypto'

// Pick the best matching quote for a student profile
function pickQuote(allQuotes: typeof quotes.$inferSelect[], profile: typeof studentProfiles.$inferSelect | null) {
  if (!allQuotes.length) return null
  const active = allQuotes.filter(q => q.active)
  if (!active.length) return null

  if (!profile) {
    // Return highest priority general quote
    const general = active.filter(q => !q.targetGender && !q.targetDepartment)
    return general.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))[0] ?? active[0]
  }

  // Score each quote
  const scored = active.map(q => {
    let score = q.priority ?? 0
    if (q.targetGender && q.targetGender === profile.gender) score += 100
    if (q.targetGender && q.targetGender !== profile.gender) score -= 9999 // disqualify
    if (q.targetDepartment && q.targetDepartment.toLowerCase() === profile.department.toLowerCase()) score += 50
    if (q.targetDepartment && q.targetDepartment.toLowerCase() !== profile.department.toLowerCase()) score -= 9999
    return { quote: q, score }
  })

  const valid = scored.filter(s => s.score > -9000).sort((a, b) => b.score - a.score)
  return valid[0]?.quote ?? null
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ eligible: false, reason: 'Not signed in' })

  const db = getDb()
  if (!db) return NextResponse.json({ eligible: false, reason: 'Database unavailable' })

  const [userProgress, userAttempts, existingCert, profileRows, allQuotes] = await Promise.all([
    db.select().from(progress).where(eq(progress.userId, session.id)),
    db.select().from(quizAttempts).where(eq(quizAttempts.userId, session.id)),
    db.select().from(certificates).where(eq(certificates.userId, session.id)).limit(1),
    db.select().from(studentProfiles).where(eq(studentProfiles.userId, session.id)).limit(1),
    db.select().from(quotes),
  ])

  const completedChapters = userProgress.filter(p => p.completed).map(p => p.chapterSlug)
  const passedQuizzes = userAttempts.filter(a => a.passed).map(a => a.chapterSlug)
  const profile = profileRows[0] ?? null

  const allDone = CHAPTERS.every(ch =>
    completedChapters.includes(ch.slug) && passedQuizzes.includes(ch.slug)
  )

  if (existingCert.length > 0) {
    const cert = existingCert[0]
    // Attach quote if stored
    let quote = null
    if (cert.quoteId) {
      const [q] = allQuotes.filter(q => q.id === cert.quoteId)
      quote = q ?? null
    }
    return NextResponse.json({
      eligible: true,
      certificate: cert,
      profile,
      quote,
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

  // Need profile before issuing
  if (!profile) {
    return NextResponse.json({
      eligible: false,
      needsProfile: true,
      completedChapters,
      passedQuizzes,
      totalChapters: CHAPTERS.length,
      reason: 'Please complete your profile to receive your certificate.',
    })
  }

  // Pick quote
  const quote = pickQuote(allQuotes, profile)

  // Issue certificate
  const certId = `LDE-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`
  const profileSnapshot = {
    displayName: profile.displayName,
    university: profile.university,
    department: profile.department,
    batch: profile.batch,
    gender: profile.gender,
  }

  const [cert] = await db.insert(certificates).values({
    userId: session.id,
    certificateId: certId,
    quoteId: quote?.id ?? null,
    profileSnapshot,
  }).returning()

  return NextResponse.json({
    eligible: true,
    certificate: cert,
    profile,
    quote,
    completedChapters,
    passedQuizzes,
    totalChapters: CHAPTERS.length,
  })
}
