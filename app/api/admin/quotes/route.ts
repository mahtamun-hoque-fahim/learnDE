import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { getDb } from '@/lib/db'
import { quotes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ quotes: [] })
  const all = await db.select().from(quotes).orderBy(quotes.priority)
  return NextResponse.json({ quotes: all })
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const { text, author, targetGender, targetDepartment, priority } = await req.json()
  if (!text) return NextResponse.json({ error: 'Quote text required' }, { status: 400 })
  const [q] = await db.insert(quotes).values({
    text,
    author: author || null,
    targetGender: targetGender || null,
    targetDepartment: targetDepartment || null,
    priority: priority ?? 0,
    active: true,
  }).returning()
  return NextResponse.json({ quote: q })
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const { id, text, author, targetGender, targetDepartment, priority, active } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  await db.update(quotes).set({
    text,
    author: author || null,
    targetGender: targetGender || null,
    targetDepartment: targetDepartment || null,
    priority: priority ?? 0,
    active,
  }).where(eq(quotes.id, id))
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminSession()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const { id } = await req.json()
  await db.delete(quotes).where(eq(quotes.id, id))
  return NextResponse.json({ ok: true })
}
