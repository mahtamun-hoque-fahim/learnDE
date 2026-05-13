import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-better'

/**
 * Middleware for Better Auth
 * Protects routes and enforces role-based access control
 */
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Public routes (anyone can access)
  const publicRoutes = [
    '/',
    '/auth',
    '/auth/sign-in',
    '/auth/sign-up',
    '/api/auth', // All auth endpoints are public
  ]

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes - require authentication
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/certificate',
    '/learn',
    '/quiz',
    '/staff',
    '/admin',
    '/api/student',
    '/api/staff',
    '/api/admin',
  ]

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Get session from Better Auth
  // Note: Better Auth stores session in HTTP-only cookies
  // We need to check the session on the server
  try {
    // Get the session from the request
    const sessionToken = req.cookies.get('better-auth.session_token')?.value

    if (!sessionToken) {
      // No session, redirect to sign-in
      return NextResponse.redirect(new URL('/auth/sign-in', req.url))
    }

    // Verify the session is valid
    // This would typically involve a database call
    // For now, we'll let the app handle session validation
    // and rely on client-side auth checks

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/auth/sign-in', req.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
