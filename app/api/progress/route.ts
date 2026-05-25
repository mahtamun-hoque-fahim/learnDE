import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { progress, quizAttempts } from '@/lib/db/schema'
import { getServerSession } from '@/lib/auth-server'
import { eq, and } from 'drizzle-orm'

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ progress: [], attempts: [] })

  const db = getDb()
  if (!db) return NextResponse.json({ progress: [], attempts: [] })

  const userId = session.user.id
  const [userProgress, userAttempts] = await Promise.all([
    db.select().from(progress).where(eq(progress.userId, userId)),
    db.select().from(quizAttempts).where(eq(quizAttempts.userId, userId)),
  ])

  return NextResponse.json({ progress: userProgress, attempts: userAttempts })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { chapterSlug } = await req.json()
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

  const userId = session.user.id
  const existing = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.chapterSlug, chapterSlug)))
    .limit(1)

  const now = new Date()
  if (existing.length > 0) {
    await db
      .update(progress)
      .set({ completed: true, completedAt: now, lastViewedAt: now })
      .where(eq(progress.id, existing[0].id))
  } else {
    await db.insert(progress).values({
      userId,
      chapterSlug,
      completed: true,
      completedAt: now,
      startedAt: now,
      lastViewedAt: now,
    })
  }

  return NextResponse.json({ ok: true })
}
