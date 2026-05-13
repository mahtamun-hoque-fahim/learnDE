import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/auth/me
 * Returns current authenticated user's info and role
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { getUser } = await auth()
    const user = await getUser?.(userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const role = user.publicMetadata?.role || null

    return NextResponse.json({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      name: user.fullName || user.username,
      role,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
