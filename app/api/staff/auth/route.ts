import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'
import { staffUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { signStaffToken, StaffSession } from '@/lib/staff-auth'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (!username || !password) return NextResponse.json({ error: 'Required' }, { status: 400 })
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const [staff] = await db.select().from(staffUsers).where(eq(staffUsers.username, username)).limit(1)
  if (!staff || !staff.active) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const ok = await bcrypt.compare(password, staff.password)
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const session: StaffSession = { id: staff.id, username: staff.username, email: staff.email, displayName: staff.displayName, role: staff.role as 'admin' | 'moderator' }
  const token = await signStaffToken(session)
  const res = NextResponse.json({ ok: true, role: staff.role })
  res.cookies.set('staff-token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 8, path: '/' })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('staff-token')
  return res
}
