import { auth } from './auth-better'
import { headers } from 'next/headers'

export type Session = typeof auth.$Infer.Session

/**
 * Get current session on the server
 * Use in Server Components, API routes, and Server Actions
 * 
 * @returns Session object with user info, or null if not authenticated
 * @example
 * ```typescript
 * const session = await getServerSession()
 * if (!session) {
 *   redirect('/login')
 * }
 * ```
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    const headersList = await headers()
    const session = await auth.api.getSession({
      headers: headersList,
    })
    return session
  } catch (error) {
    console.error('Failed to get session:', error)
    return null
  }
}

/**
 * Require authentication in Server Components/API routes
 * Throws an error if user is not authenticated
 * 
 * @throws Error if not authenticated
 * @example
 * ```typescript
 * const session = await requireAuth()
 * // Safe to use session.user now
 * ```
 */
export async function requireAuth(): Promise<Session> {
  const session = await getServerSession()
  if (!session?.user) {
    throw new Error('Unauthorized: User not authenticated')
  }
  return session
}

/**
 * Require specific role in Server Components/API routes
 * 
 * @param requiredRole - 'student', 'staff', or 'admin'
 * @throws Error if user doesn't have required role
 * @example
 * ```typescript
 * const session = await requireRole('staff')
 * // Now you know user is staff
 * ```
 */
export async function requireRole(
  requiredRole: 'student' | 'staff' | 'admin'
): Promise<Session> {
  const session = await requireAuth()

  if (session.user.role !== requiredRole) {
    throw new Error(
      `Unauthorized: Requires ${requiredRole} role, got ${session.user.role}`
    )
  }

  return session
}

/**
 * Check if user has any of the specified roles
 * 
 * @param allowedRoles - Array of allowed roles
 * @example
 * ```typescript
 * const session = await requireOneOf(['staff', 'admin'])
 * // User is either staff or admin
 * ```
 */
export async function requireOneOf(
  allowedRoles: ('student' | 'staff' | 'admin')[]
): Promise<Session> {
  const session = await requireAuth()

  if (!allowedRoles.includes(session.user.role as any)) {
    throw new Error(
      `Unauthorized: Requires one of [${allowedRoles.join(', ')}], got ${session.user.role}`
    )
  }

  return session
}

/**
 * Get user ID from session
 * Returns null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
  const session = await getServerSession()
  return session?.user?.id || null
}

/**
 * Get user's role from session
 * Returns null if not authenticated
 */
export async function getUserRole(): Promise<'student' | 'staff' | 'admin' | null> {
  const session = await getServerSession()
  return (session?.user?.role as 'student' | 'staff' | 'admin' | undefined) || null
}

/**
 * Check if current user is authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession()
  return !!session?.user
}

/**
 * Check if current user has a specific role
 * @returns true if user has the role, false otherwise
 */
export async function hasRole(role: 'student' | 'staff' | 'admin'): Promise<boolean> {
  const userRole = await getUserRole()
  return userRole === role
}

/**
 * Check if current user has any of the specified roles
 */
export async function hasAnyRole(
  roles: ('student' | 'staff' | 'admin')[]
): Promise<boolean> {
  const userRole = await getUserRole()
  return roles.includes(userRole as any)
}
