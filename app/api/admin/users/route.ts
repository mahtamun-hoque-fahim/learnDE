import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { users, progress } from '@/lib/db/schema'
import { eq, desc, gte, and, sql } from 'drizzle-orm'
import { CHAPTERS } from '@/lib/chapters'

const ACTIVE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/**
 * GET /api/admin/users
 * Returns user list + dashboard stats with real values:
 * - totalUsers, students, staff, admins  → counts from users table
 * - activeThisWeek  → users.last_active_at within last 7 days
 * - completionRate  → avg (chapters completed / total chapters) across all students
 * - deltas          → week-over-week comparisons (this week vs prior week)
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const weekAgo = new Date(now.getTime() - ACTIVE_WINDOW_MS)
    const twoWeeksAgo = new Date(now.getTime() - 2 * ACTIVE_WINDOW_MS)

    // All users
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified,
        lastActiveAt: users.lastActiveAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))

    const totalUsers = allUsers.length
    const students = allUsers.filter(u => u.role === 'student').length
    const staff = allUsers.filter(u => u.role === 'staff').length
    const admins = allUsers.filter(u => u.role === 'admin').length

    // Real activity windows
    const activeThisWeek = allUsers.filter(
      u => u.lastActiveAt && u.lastActiveAt >= weekAgo,
    ).length
    const activePriorWeek = allUsers.filter(
      u => u.lastActiveAt && u.lastActiveAt >= twoWeeksAgo && u.lastActiveAt < weekAgo,
    ).length

    // Week-over-week new signups
    const newThisWeek = allUsers.filter(u => u.createdAt >= weekAgo).length
    const newPriorWeek = allUsers.filter(
      u => u.createdAt >= twoWeeksAgo && u.createdAt < weekAgo,
    ).length

    // Week-over-week new staff
    const newStaffThisWeek = allUsers.filter(
      u => u.role === 'staff' && u.createdAt >= weekAgo,
    ).length
    const newStaffPriorWeek = allUsers.filter(
      u => u.role === 'staff' && u.createdAt >= twoWeeksAgo && u.createdAt < weekAgo,
    ).length

    // Completion rate: avg fraction of chapters completed across all students.
    // SUM(completed) / (student_count * total_chapters)
    const totalChapters = CHAPTERS.length
    let completionRate = 0
    if (students > 0) {
      const [{ done = 0 } = { done: 0 }] = await db
        .select({ done: sql<number>`COUNT(*)::int` })
        .from(progress)
        .where(eq(progress.completed, true))
      completionRate = Math.round(
        (Number(done) / (students * totalChapters)) * 100,
      )
    }

    // Completion rate one week ago (snapshot via completedAt cutoff)
    let priorCompletionRate = 0
    if (students > 0) {
      const [{ done: priorDone = 0 } = { done: 0 }] = await db
        .select({ done: sql<number>`COUNT(*)::int` })
        .from(progress)
        .where(
          and(
            eq(progress.completed, true),
            sql`${progress.completedAt} IS NOT NULL AND ${progress.completedAt} < ${weekAgo.toISOString()}`,
          ),
        )
      priorCompletionRate = Math.round(
        (Number(priorDone) / (students * totalChapters)) * 100,
      )
    }

    return NextResponse.json({
      stats: {
        totalUsers,
        students,
        staff,
        admins,
        activeThisWeek,
        completionRate,
        deltas: {
          totalUsers: newThisWeek - newPriorWeek,
          activeThisWeek: activeThisWeek - activePriorWeek,
          staff: newStaffThisWeek - newStaffPriorWeek,
          completionRate: completionRate - priorCompletionRate,
        },
      },
      users: allUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
        createdAt: u.createdAt,
        // "active" = had any activity in the last 7 days.
        active: !!(u.lastActiveAt && u.lastActiveAt >= weekAgo),
        lastActiveAt: u.lastActiveAt,
      })),
    })
  } catch (error) {
    console.error('Admin users GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/users
 * Update a user's role. (The "active" toggle is intentionally removed —
 * activity is now a derived field from last_active_at, not a settable flag.)
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, role } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    if (role !== undefined && !['student', 'staff', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    // Prevent admin self-demotion
    if (userId === session.user.id && role !== undefined && role !== 'admin') {
      return NextResponse.json(
        { error: 'Cannot change your own admin role' },
        { status: 400 },
      )
    }
    if (role === undefined) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId))
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin users PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
