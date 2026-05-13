import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/certificate(.*)',
  '/learn(.*)',
  '/quiz(.*)',
  '/staff(.*)',
  '/admin(.*)',
  '/api/student(.*)',
  '/api/staff(.*)',
  '/api/admin(.*)',
])

// Routes only students can access
const isStudentRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/certificate(.*)',
  '/learn(.*)',
  '/quiz(.*)',
  '/api/student(.*)',
])

// Routes only staff can access
const isStaffRoute = createRouteMatcher([
  '/staff(.*)',
  '/api/staff(.*)',
])

// Routes only admins can access
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/api/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  const { pathname } = req.nextUrl

  // If not authenticated and trying to access protected route, redirect to sign in
  if (!userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn()
  }

  // User is authenticated, check role-based access
  if (userId) {
    const user = await auth().getUser?.()
    const role = user?.publicMetadata?.role as string | undefined

    // Staff route access control
    if (isStaffRoute(req) && role !== 'staff' && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Admin route access control
    if (isAdminRoute(req) && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Student route access control
    if (isStudentRoute(req) && !['student', 'staff', 'admin'].includes(role || '')) {
      return NextResponse.redirect(new URL('/auth/select-role', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
