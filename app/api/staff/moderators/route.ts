import { NextRequest, NextResponse } from 'next/server'
import { getStaffSessionFromRequest } from '@/lib/staff-auth'
import { getDb } from '@/lib/db'
import { staffUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  const staff = await getStaffSessionFromRequest(req)
  if (!staff || staff.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  const db = getDb()
  if (!db) return NextResponse.json({ moderators: [] })
  const all = await db.select({ id: staffUsers.id, username: staffUsers.username, email: staffUsers.email, displayName: staffUsers.displayName, role: staffUsers.role, active: staffUsers.active, createdAt: staffUsers.createdAt }).from(staffUsers)
  return NextResponse.json({ moderators: all })
}

export async function POST(req: NextRequest) {
  const staff = await getStaffSessionFromRequest(req)
  if (!staff || staff.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const { username, email, password, displayName, role } = await req.json()
  if (!username || !email || !password || !displayName) return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  const hashed = await bcrypt.hash(password, 10)
  try {
    const [m] = await db.insert(staffUsers).values({ username, email, password: hashed, displayName, role: role || 'moderator', active: true }).returning()
    return NextResponse.json({ ok: true, id: m.id })
  } catch { return NextResponse.json({ error: 'Username/email taken' }, { status: 409 }) }
}

export async function PATCH(req: NextRequest) {
  const staff = await getStaffSessionFromRequest(req)
  if (!staff || staff.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const { id, active, role } = await req.json()
  await db.update(staffUsers).set({ active, role }).where(eq(staffUsers.id, id))
  return NextResponse.json({ ok: true })
}
