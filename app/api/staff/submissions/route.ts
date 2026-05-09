import { NextRequest, NextResponse } from 'next/server'
import { getStaffSessionFromRequest } from '@/lib/staff-auth'
import { getDb } from '@/lib/db'
import { certSubmissions, users, progress, quizAttempts, staffUsers, certificates } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { sendCertificateReady, sendRejectionNotice, sendNewSubmissionAlert } from '@/lib/email'

export async function GET(req: NextRequest) {
  const staff = await getStaffSessionFromRequest(req)
  if (!staff) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ submissions: [] })

  const subs = await db.select().from(certSubmissions).orderBy(desc(certSubmissions.submittedAt))
  const allUsers = await db.select().from(users)
  const allProgress = await db.select().from(progress)
  const allAttempts = await db.select().from(quizAttempts)
  const allCerts = await db.select().from(certificates)
  const allStaff = await db.select().from(staffUsers)

  const enriched = subs.map(s => {
    const u = allUsers.find(u => u.id === s.userId)
    const up = allProgress.filter(p => p.userId === s.userId && p.completed)
    const ua = allAttempts.filter(a => a.userId === s.userId && a.passed)
    const cert = allCerts.find(c => c.submissionId === s.id)
    const reviewer = allStaff.find(st => st.id === s.reviewedBy)
    return {
      ...s,
      userEmail: u?.email,
      userName: u?.name,
      chaptersRead: up.length,
      quizzesPassed: ua.length,
      certificateId: cert?.certificateId ?? null,
      reviewerName: reviewer?.displayName ?? null,
    }
  })
  return NextResponse.json({ submissions: enriched })
}

export async function PATCH(req: NextRequest) {
  const staff = await getStaffSessionFromRequest(req)
  if (!staff) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getDb()
  if (!db) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  const { submissionId, action, reviewNote, quoteText, quoteAuthor } = await req.json()
  // action: 'approve' | 'reject' | 'under_review'

  const [sub] = await db.select().from(certSubmissions).where(eq(certSubmissions.id, submissionId)).limit(1)
  if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const [student] = await db.select().from(users).where(eq(users.id, sub.userId)).limit(1)

  if (action === 'approve') {
    // Check no existing cert
    const existing = await db.select().from(certificates).where(eq(certificates.submissionId, submissionId)).limit(1)
    if (existing.length > 0) return NextResponse.json({ error: 'Already approved' }, { status: 409 })
    if (!quoteText) return NextResponse.json({ error: 'Quote required for approval' }, { status: 400 })

    const certId = `LDE-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`
    const snapshot = { displayName: sub.displayName, university: sub.university, department: sub.department, batch: sub.batch, gender: sub.gender }

    await db.update(certSubmissions).set({ status: 'approved', reviewedBy: staff.id, reviewNote: reviewNote || null, reviewedAt: new Date(), quoteText, quoteAuthor: quoteAuthor || null }).where(eq(certSubmissions.id, submissionId))
    await db.insert(certificates).values({ userId: sub.userId, submissionId, certificateId: certId, profileSnapshot: snapshot, quoteText, quoteAuthor: quoteAuthor || null })

    // Email student
    if (student?.email) {
      await sendCertificateReady({ studentEmail: student.email, studentName: sub.displayName, certificateId: certId, quoteText, quoteAuthor: quoteAuthor || undefined })
    }
    return NextResponse.json({ ok: true, certificateId: certId })
  }

  if (action === 'reject') {
    await db.update(certSubmissions).set({ status: 'rejected', reviewedBy: staff.id, reviewNote: reviewNote || 'Your submission was not approved.', reviewedAt: new Date() }).where(eq(certSubmissions.id, submissionId))
    if (student?.email) {
      await sendRejectionNotice({ studentEmail: student.email, studentName: sub.displayName, reason: reviewNote || 'Your submission was not approved.' })
    }
    return NextResponse.json({ ok: true })
  }

  if (action === 'under_review') {
    await db.update(certSubmissions).set({ status: 'under_review', reviewedBy: staff.id, reviewedAt: new Date() }).where(eq(certSubmissions.id, submissionId))
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
