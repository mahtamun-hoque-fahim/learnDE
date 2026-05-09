import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { SignJWT } from 'jose'

const ADMIN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'learnde-admin-secret-2025')

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()
  if (!username || !password) return NextResponse.json({ error: 'Required' }, { status: 400 })

  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1)
  if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const ok = await bcrypt.compare(password, admin.password)
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const token = await new SignJWT({ id: admin.id, username: admin.username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(ADMIN_SECRET)

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('admin-token')
  return res
}
