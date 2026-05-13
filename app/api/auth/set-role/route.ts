import { auth } from '@/lib/auth-better'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export type UserRole = 'student' | 'staff' | 'admin'

/**
 * POST /api/auth/set-role
 * Set the user's role (student, staff, admin)
 * Called after user completes role selection
 * 
 * Body: { role: 'student' | 'staff' | 'admin' }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { role } = await req.json()

    if (!role || !['student', 'staff', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Update user role in database
    await db
      .update(users)
      .set({ role })
      .where(eq(users.id, session.user.id))

    return NextResponse.json({
      success: true,
      user: {
        ...session.user,
        role,
      },
    })
  } catch (error) {
    console.error('Set role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
