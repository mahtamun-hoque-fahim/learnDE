import { auth } from '@/lib/auth-better'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/auth/get-session
 * Returns current authenticated user's session
 * Used by useAuth() hook in components
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session) {
      return NextResponse.json(
        { error: 'No session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      session: {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          emailVerified: session.user.emailVerified,
          image: session.user.image,
          role: session.user.role || 'student',
          createdAt: session.user.createdAt,
        },
        expiresAt: session.session.expiresAt,
      },
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
