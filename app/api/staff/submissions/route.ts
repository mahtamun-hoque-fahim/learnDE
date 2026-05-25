import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { certSubmissions, users, certificates } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { sendCertificateReady, sendRejectionNotice } from '@/lib/email'

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * GET /api/staff/submissions
 * Returns all certificate submissions for staff to review.
 *
 * stats:
 *   - pending, underReview, approved      → real counts by status
 *   - thisMonth                            → approved submissions reviewed this calendar month
 *   - avgReviewHours                       → average hours between submission and review
 *   - deltas.pending                       → submissions received this week vs prior week
 *   - deltas.approved                      → approvals this week vs prior week
 *   - deltas.thisMonth                     → this month vs last month
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || (session.user.role !== 'staff' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const submissions = await db
      .select({
        id: certSubmissions.id,
        userId: certSubmissions.userId,
        displayName: certSubmissions.displayName,
        university: certSubmissions.university,
        department: certSubmissions.department,
        batch: certSubmissions.batch,
        gender: certSubmissions.gender,
        phone: certSubmissions.phone,
        studentIdNo: certSubmissions.studentIdNo,
        note: certSubmissions.note,
        status: certSubmissions.status,
        reviewedBy: certSubmissions.reviewedBy,
        reviewNote: certSubmissions.reviewNote,
        reviewedAt: certSubmissions.reviewedAt,
        quoteText: certSubmissions.quoteText,
        quoteAuthor: certSubmissions.quoteAuthor,
        submittedAt: certSubmissions.submittedAt,
        email: users.email,
      })
      .from(certSubmissions)
      .leftJoin(users, eq(certSubmissions.userId, users.id))
      .orderBy(desc(certSubmissions.submittedAt))

    const pending = submissions.filter(s => s.status === 'pending').length
    const underReview = submissions.filter(s => s.status === 'under_review').length
    const approved = submissions.filter(s => s.status === 'approved').length

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * DAY_MS)
    const twoWeeksAgo = new Date(now.getTime() - 14 * DAY_MS)
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const thisMonth = submissions.filter(
      s => s.status === 'approved' && s.reviewedAt && s.reviewedAt >= firstDayOfMonth,
    ).length
    const lastMonth = submissions.filter(
      s =>
        s.status === 'approved' &&
        s.reviewedAt &&
        s.reviewedAt >= firstDayOfLastMonth &&
        s.reviewedAt < firstDayOfMonth,
    ).length

    // Weekly windows
    const submittedThisWeek = submissions.filter(
      s => s.submittedAt && s.submittedAt >= weekAgo,
    ).length
    const submittedPriorWeek = submissions.filter(
      s => s.submittedAt && s.submittedAt >= twoWeeksAgo && s.submittedAt < weekAgo,
    ).length
    const approvedThisWeek = submissions.filter(
      s => s.status === 'approved' && s.reviewedAt && s.reviewedAt >= weekAgo,
    ).length
    const approvedPriorWeek = submissions.filter(
      s =>
        s.status === 'approved' &&
        s.reviewedAt &&
        s.reviewedAt >= twoWeeksAgo &&
        s.reviewedAt < weekAgo,
    ).length

    // Avg review turnaround (hours) — across all reviewed submissions
    const reviewed = submissions.filter(
      s => s.reviewedAt && s.submittedAt && s.status !== 'pending',
    )
    const avgReviewHours =
      reviewed.length > 0
        ? Math.round(
            reviewed.reduce(
              (acc, s) =>
                acc +
                (s.reviewedAt!.getTime() - s.submittedAt!.getTime()) /
                  (1000 * 60 * 60),
              0,
            ) / reviewed.length,
          )
        : 0

    const formattedSubmissions = submissions.map(sub => {
      const submitted = sub.submittedAt ? new Date(sub.submittedAt) : now
      const hoursAgo = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60))
      const daysAgo = Math.floor(hoursAgo / 24)

      let timeAgo: string
      if (hoursAgo < 1) timeAgo = 'Just now'
      else if (hoursAgo < 24) timeAgo = `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`
      else if (daysAgo === 1) timeAgo = 'Yesterday'
      else timeAgo = `${daysAgo} days ago`

      return { ...sub, submittedAgo: timeAgo }
    })

    return NextResponse.json({
      stats: {
        pending,
        underReview,
        approved,
        thisMonth,
        avgReviewHours,
        deltas: {
          pending: submittedThisWeek - submittedPriorWeek,
          approved: approvedThisWeek - approvedPriorWeek,
          thisMonth: thisMonth - lastMonth,
        },
      },
      submissions: formattedSubmissions,
    })
  } catch (error) {
    console.error('Staff submissions GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/staff/submissions
 * Review a certificate submission (approve/reject/under_review)
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || (session.user.role !== 'staff' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { submissionId, action, reviewNote, quoteText, quoteAuthor } = await req.json()

    const [sub] = await db
      .select()
      .from(certSubmissions)
      .where(eq(certSubmissions.id, submissionId))
      .limit(1)

    if (!sub) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (action === 'approve') {
      if (!quoteText || !quoteAuthor) {
        return NextResponse.json(
          { error: 'Quote and author required for approval' },
          { status: 400 }
        )
      }

      const existing = await db
        .select()
        .from(certificates)
        .where(eq(certificates.submissionId, submissionId))
        .limit(1)

      if (existing.length > 0) {
        return NextResponse.json(
          { error: 'Certificate already issued' },
          { status: 409 }
        )
      }

      const certId = `LDE-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`
      const snapshot = {
        displayName: sub.displayName,
        university: sub.university,
        department: sub.department,
        batch: sub.batch,
        gender: sub.gender,
      }

      await db
        .update(certSubmissions)
        .set({
          status: 'approved',
          reviewedBy: session.user.id,
          reviewNote: reviewNote || null,
          reviewedAt: new Date(),
          quoteText,
          quoteAuthor,
        })
        .where(eq(certSubmissions.id, submissionId))

      await db.insert(certificates).values({
        userId: sub.userId,
        submissionId,
        certificateId: certId,
        profileSnapshot: snapshot,
        quoteText,
        quoteAuthor,
      })

      // Send email notification
      const [student] = await db
        .select()
        .from(users)
        .where(eq(users.id, sub.userId))
        .limit(1)

      if (student?.email) {
        await sendCertificateReady({
          studentEmail: student.email,
          studentName: sub.displayName,
          certificateId: certId,
          quoteText,
          quoteAuthor,
        })
      }

      return NextResponse.json({ ok: true, certificateId: certId })
    }

    if (action === 'reject') {
      await db
        .update(certSubmissions)
        .set({
          status: 'rejected',
          reviewedBy: session.user.id,
          reviewNote: reviewNote || 'Your submission was not approved.',
          reviewedAt: new Date(),
        })
        .where(eq(certSubmissions.id, submissionId))

      // Send email notification
      const [student] = await db
        .select()
        .from(users)
        .where(eq(users.id, sub.userId))
        .limit(1)

      if (student?.email) {
        await sendRejectionNotice({
          studentEmail: student.email,
          studentName: sub.displayName,
          reason: reviewNote || 'Your submission was not approved.',
        })
      }

      return NextResponse.json({ ok: true })
    }

    if (action === 'under_review') {
      await db
        .update(certSubmissions)
        .set({
          status: 'under_review',
          reviewedBy: session.user.id,
          reviewedAt: new Date(),
        })
        .where(eq(certSubmissions.id, submissionId))

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Staff submissions PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

