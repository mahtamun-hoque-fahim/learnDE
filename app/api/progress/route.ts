import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { progress, quizAttempts } from '@/lib/db/schema'
import { getSessionFromRequest } from '@/lib/auth'
import { eq, and } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ progress: [], attempts: [] })

  const db = getDb()
  if (!db) return NextResponse.json({ progress: [], attempts: [] })

  const [userProgress, userAttempts] = await Promise.all([
    db.select().from(progress).where(eq(progress.userId, session.id)),
    db.select().from(quizAttempts).where(eq(quizAttempts.userId, session.id)),
  ])

  return NextResponse.json({ progress: userProgress, attempts: userAttempts })
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { chapterSlug } = await req.json()
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

  const existing = await db.select().from(progress)
    .where(and(eq(progress.userId, session.id), eq(progress.chapterSlug, chapterSlug)))
    .limit(1)

  if (existing.length === 0) {
    await db.insert(progress).values({
      userId: session.id,
      chapterSlug,
      completed: true,
      completedAt: new Date(),
    })
  }

  return NextResponse.json({ ok: true })
}
