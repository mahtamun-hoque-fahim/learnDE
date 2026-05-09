import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { signToken } from '@/lib/auth'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, studentId } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    const db = getDb()
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const [user] = await db.insert(users).values({ name, email, password: hashed, studentId }).returning()

    const token = await signToken({ id: user.id, email: user.email, name: user.name })

    const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } })
    res.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
