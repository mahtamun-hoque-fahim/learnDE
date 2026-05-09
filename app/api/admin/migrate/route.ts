import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(req: NextRequest) {
  const setupKey = req.headers.get('x-setup-key')
  const envKey = process.env.ADMIN_SETUP_KEY || 'learnde-setup-2025'
  if (setupKey !== envKey) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const sql = neon(process.env.DATABASE_URL!)
  try {
    await sql`CREATE TABLE IF NOT EXISTS student_profiles (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), display_name TEXT NOT NULL, university TEXT NOT NULL, department TEXT NOT NULL, batch TEXT, gender TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())`
    await sql`CREATE TABLE IF NOT EXISTS quotes (id SERIAL PRIMARY KEY, text TEXT NOT NULL, author TEXT, target_gender TEXT, target_department TEXT, priority INTEGER DEFAULT 0, active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW())`
    await sql`CREATE TABLE IF NOT EXISTS admin_users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())`
    await sql`ALTER TABLE certificates ADD COLUMN IF NOT EXISTS quote_id INTEGER REFERENCES quotes(id)`
    await sql`ALTER TABLE certificates ADD COLUMN IF NOT EXISTS profile_snapshot JSONB`
    return NextResponse.json({ ok: true, message: 'Tables created' })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
