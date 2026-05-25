import { auth } from './auth-better'
import { headers } from 'next/headers'
import { db } from './db'
import { users } from './db/schema'
import { eq, and, or, isNull, lt, sql } from 'drizzle-orm'

export type Session = typeof auth.$Infer.Session

/**
 * Fire-and-forget activity ping. Updates users.last_active_at if the prior value
 * is older than 5 minutes (or null). The WHERE clause does the throttling
 * server-side so we never burn a write on a freshly-touched row.
 */
async function touchLastActive(userId: string): Promise<void> {
  try {
    await db
      .update(users)
      .set({ lastActiveAt: new Date() })
      .where(
        and(
          eq(users.id, userId),
          or(
            isNull(users.lastActiveAt),
            lt(users.lastActiveAt, sql`NOW() - INTERVAL '5 minutes'`),
          ),
        ),
      )
  } catch (err) {
    // Activity tracking must never break the request path.
    console.error('touchLastActive failed:', err)
  }
}

/**
 * Get current session on the server.
 * Side effect: pings users.last_active_at (throttled to once per 5 min) so the
 * admin dashboard can show real "active this week" counts.
 *
 * Use in Server Components, API routes, and Server Actions.
 *
 * @returns Session object with user info, or null if not authenticated
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    const headersList = await headers()
    const session = await auth.api.getSession({ headers: headersList })
    if (session?.user?.id) {
      // Don't await; activity tracking should never delay the response.
      void touchLastActive(session.user.id)
    }
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
