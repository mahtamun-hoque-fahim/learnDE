import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-better'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

/**
 * GET /api/admin/users
 * Returns all users for admin management
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))

    // Calculate stats
    const totalUsers = allUsers.length
    const students = allUsers.filter(u => u.role === 'student').length
    const staff = allUsers.filter(u => u.role === 'staff').length
    const admins = allUsers.filter(u => u.role === 'admin').length

    // Active this week (simplified: all verified users)
    const activeThisWeek = allUsers.filter(u => u.emailVerified).length

    return NextResponse.json({
      stats: {
        totalUsers,
        students,
        staff,
        admins,
        activeThisWeek,
      },
      users: allUsers.map(u => ({
        ...u,
        active: u.emailVerified, // Simplified: verified = active
      })),
    })
  } catch (error) {
    console.error('Admin users GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/users/:id
 * Update user role or active status
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, role, active } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Validate role if provided
    if (role && !['student', 'staff', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Build update object
    const updates: any = {}
    if (role !== undefined) {
      updates.role = role
    }
    if (active !== undefined) {
      updates.emailVerified = active // Using emailVerified as active flag
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    // Prevent admin from changing their own role
    if (userId === session.user.id && role !== undefined && role !== 'admin') {
      return NextResponse.json(
        { error: 'Cannot change your own admin role' },
        { status: 400 }
      )
    }

    await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Admin users PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
