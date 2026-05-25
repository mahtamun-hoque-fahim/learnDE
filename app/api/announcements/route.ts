import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { announcements, users } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

/**
 * GET /api/announcements
 * Lists all announcements (newest first). Staff and admin only.
 */
export async function GET() {
  const session = await getServerSession()
  if (!session || (session.user.role !== 'staff' && session.user.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await db
    .select({
      id: announcements.id,
      title: announcements.title,
      content: announcements.content,
      targetRole: announcements.targetRole,
      publishedAt: announcements.publishedAt,
      scheduledAt: announcements.scheduledAt,
      expiresAt: announcements.expiresAt,
      createdAt: announcements.createdAt,
      createdBy: announcements.createdBy,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(announcements)
    .leftJoin(users, eq(announcements.createdBy, users.id))
    .orderBy(desc(announcements.createdAt))

  return NextResponse.json({ announcements: rows })
}

/**
 * POST /api/announcements
 * Creates an announcement. Staff and admin only.
 * Body: { title, content, targetRole?: 'all' | 'student' | 'staff' }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session || (session.user.role !== 'staff' && session.user.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, content, targetRole } = await req.json()

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }
  const validTargets = ['all', 'student', 'staff']
  const target = validTargets.includes(targetRole) ? targetRole : 'all'

  const [row] = await db
    .insert(announcements)
    .values({
      createdBy: session.user.id,
      title: title.trim(),
      content: content.trim(),
      targetRole: target,
      publishedAt: new Date(),
    })
    .returning()

  return NextResponse.json({ ok: true, announcement: row })
}

/**
 * DELETE /api/announcements?id=N
 * Removes an announcement. Staff (own only) and admin (any).
 */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession()
  if (!session || (session.user.role !== 'staff' && session.user.role !== 'admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const idParam = req.nextUrl.searchParams.get('id')
  const id = idParam ? parseInt(idParam, 10) : NaN
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const [existing] = await db
    .select()
    .from(announcements)
    .where(eq(announcements.id, id))
    .limit(1)

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Staff can only delete their own; admin can delete anyone's.
  if (session.user.role === 'staff' && existing.createdBy !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await db.delete(announcements).where(eq(announcements.id, id))
  return NextResponse.json({ ok: true })
}
