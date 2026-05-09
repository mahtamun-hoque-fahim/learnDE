import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'

export async function POST(req: NextRequest) {
  const setupKey = req.headers.get('x-setup-key')
  const envKey = process.env.ADMIN_SETUP_KEY || 'learnde-setup-2025'
  if (setupKey !== envKey) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { username, password } = await req.json()
  if (!username || !password) return NextResponse.json({ error: 'Required' }, { status: 400 })
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })
  const hashed = await bcrypt.hash(password, 10)
  try {
    const [admin] = await db.insert(adminUsers).values({ username, password: hashed }).returning()
    return NextResponse.json({ ok: true, id: admin.id })
  } catch {
    return NextResponse.json({ error: 'Username taken' }, { status: 409 })
  }
}
