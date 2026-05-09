import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function POST(req: NextRequest) {
  const setupKey = req.headers.get('x-setup-key')
  const envKey = process.env.ADMIN_SETUP_KEY || 'learnde-setup-2025'
  if (setupKey !== envKey) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const sql = neon(process.env.DATABASE_URL!)
  try {
    await sql`CREATE TABLE IF NOT EXISTS staff_users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'moderator', display_name TEXT NOT NULL, active BOOLEAN DEFAULT TRUE, created_at TIMESTAMP DEFAULT NOW())`
    await sql`CREATE TABLE IF NOT EXISTS cert_submissions (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), display_name TEXT NOT NULL, university TEXT NOT NULL, department TEXT NOT NULL, batch TEXT, gender TEXT NOT NULL, phone TEXT, student_id_no TEXT, note TEXT, status TEXT NOT NULL DEFAULT 'pending', reviewed_by INTEGER REFERENCES staff_users(id), review_note TEXT, reviewed_at TIMESTAMP, quote_text TEXT, quote_author TEXT, submitted_at TIMESTAMP DEFAULT NOW())`
    await sql`CREATE TABLE IF NOT EXISTS certificates (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), submission_id INTEGER NOT NULL REFERENCES cert_submissions(id), certificate_id TEXT NOT NULL UNIQUE, issued_at TIMESTAMP DEFAULT NOW(), profile_snapshot JSONB, quote_text TEXT, quote_author TEXT)`
    // Drop old tables from previous session
    await sql`DROP TABLE IF EXISTS student_profiles`
    await sql`DROP TABLE IF EXISTS quotes`
    await sql`DROP TABLE IF EXISTS admin_users`
    return NextResponse.json({ ok: true, message: 'All tables created successfully' })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
