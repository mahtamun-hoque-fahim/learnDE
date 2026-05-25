import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-server'
import { getDb } from '@/lib/db'
import { certSubmissions, certificates, users } from '@/lib/db/schema'
import { eq, or } from 'drizzle-orm'
import { sendNewSubmissionAlert } from '@/lib/email'

export async function GET() {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  if (!db) return NextResponse.json({ submission: null, certificate: null })

  const userId = session.user.id
  const [sub] = await db.select().from(certSubmissions).where(eq(certSubmissions.userId, userId)).limit(1)
  if (!sub) return NextResponse.json({ submission: null, certificate: null })

  let certificate = null
  if (sub.status === 'approved') {
    const [cert] = await db.select().from(certificates).where(eq(certificates.submissionId, sub.id)).limit(1)
    certificate = cert ?? null
  }
  return NextResponse.json({ submission: sub, certificate })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const userId = session.user.id
  const existing = await db
    .select()
    .from(certSubmissions)
    .where(eq(certSubmissions.userId, userId))
    .limit(1)

  if (existing.length > 0) {
    return NextResponse.json({ error: 'You have already submitted an application' }, { status: 409 })
  }

  const body = await req.json()
  const {
    displayName,
    university,
    department,
    batch,
    gender,
    phone,
    studentIdNo,
    note,
    quoteText,
    quoteAuthor,
  } = body

  if (!displayName || !university || !department || !gender) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const [sub] = await db
    .insert(certSubmissions)
    .values({
      userId,
      displayName,
      university,
      department,
      batch,
      gender,
      phone,
      studentIdNo,
      note,
      quoteText,
      quoteAuthor,
      status: 'pending',
    })
    .returning()

  // Fire-and-forget alert to staff
  try {
    const staffRows = await db
      .select({ email: users.email })
      .from(users)
      .where(or(eq(users.role, 'staff'), eq(users.role, 'admin')))
    const staffEmails = staffRows.map(r => r.email).filter(Boolean)
    if (staffEmails.length > 0) {
      await sendNewSubmissionAlert({
        staffEmails,
        studentName: displayName,
        university,
        department,
        submissionId: sub.id,
      })
    }
  } catch (err) {
    console.error('Failed to send submission alert:', err)
  }

  return NextResponse.json({ ok: true, submission: sub })
}
