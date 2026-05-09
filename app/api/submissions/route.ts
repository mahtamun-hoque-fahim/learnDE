import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { certSubmissions, staffUsers, users, certificates } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { sendNewSubmissionAlert } from '@/lib/email'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ submission: null, certificate: null })
  const [sub] = await db.select().from(certSubmissions).where(eq(certSubmissions.userId, session.id)).limit(1)
  if (!sub) return NextResponse.json({ submission: null, certificate: null })
  let certificate = null
  if (sub.status === 'approved') {
    const [cert] = await db.select().from(certificates).where(eq(certificates.submissionId, sub.id)).limit(1)
    certificate = cert ?? null
  }
  return NextResponse.json({ submission: sub, certificate })
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  // One submission per student
  const existing = await db.select().from(certSubmissions).where(eq(certSubmissions.userId, session.id)).limit(1)
  if (existing.length > 0) {
    const ex = existing[0]
    // Allow re-submission only if rejected
    if (ex.status !== 'rejected') return NextResponse.json({ error: 'Submission already exists', status: ex.status }, { status: 409 })
    // Delete old rejected one and allow fresh
    // (keep the same row, just reset it)
    const body = await req.json()
    await db.update(certSubmissions).set({ ...body, status: 'pending', reviewedBy: null, reviewNote: null, reviewedAt: null, quoteText: null, quoteAuthor: null, submittedAt: new Date() }).where(eq(certSubmissions.id, ex.id))
    // Notify staff
    await notifyStaff(db, session, body)
    return NextResponse.json({ ok: true, resubmitted: true })
  }

  const { displayName, university, department, batch, gender, phone, studentIdNo, note } = await req.json()
  if (!displayName || !university || !department || !gender) return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })

  await db.insert(certSubmissions).values({ userId: session.id, displayName, university, department, batch: batch || null, gender, phone: phone || null, studentIdNo: studentIdNo || null, note: note || null, status: 'pending' })

  await notifyStaff(db, session, { displayName, university, department })
  return NextResponse.json({ ok: true })
}

async function notifyStaff(db: ReturnType<typeof import('@/lib/db').getDb>, session: { id: number }, data: { displayName: string; university: string; department: string }) {
  try {
    const staff = await db!.select().from(staffUsers).where(eq(staffUsers.active, true))
    const emails = staff.map(s => s.email).filter(Boolean)
    const [sub] = await db!.select().from(certSubmissions).where(eq(certSubmissions.userId, session.id)).limit(1)
    if (emails.length && sub) {
      await sendNewSubmissionAlert({ staffEmails: emails, studentName: data.displayName, university: data.university, department: data.department, submissionId: sub.id })
    }
  } catch {}
}
