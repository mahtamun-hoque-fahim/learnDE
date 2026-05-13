import { auth } from '@/lib/auth-better'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 * Sign out the current user
 */
export async function POST(req: NextRequest) {
  try {
    // Better Auth logout is handled by deleting the session
    // This endpoint helps client components logout properly
    
    const response = await auth.api.signOut({
      headers: req.headers,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
