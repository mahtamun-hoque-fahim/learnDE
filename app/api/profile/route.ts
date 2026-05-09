import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { studentProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ profile: null })
  const [profile] = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, session.id)).limit(1)
  return NextResponse.json({ profile: profile ?? null })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { displayName, university, department, batch, gender } = await req.json()
  if (!displayName || !university || !department || !gender)
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })

  const existing = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, session.id)).limit(1)
  if (existing.length > 0) {
    await db.update(studentProfiles).set({ displayName, university, department, batch, gender }).where(eq(studentProfiles.userId, session.id))
  } else {
    await db.insert(studentProfiles).values({ userId: session.id, displayName, university, department, batch, gender })
  }
  return NextResponse.json({ ok: true })
}
