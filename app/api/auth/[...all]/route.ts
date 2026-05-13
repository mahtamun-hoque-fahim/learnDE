import { auth } from '@/lib/auth-better'

/**
 * Better Auth automatically creates routes for:
 * - POST /api/auth/sign-up
 * - POST /api/auth/sign-in
 * - POST /api/auth/logout
 * - GET /api/auth/session
 * - etc.
 * 
 * This catch-all route handles all Better Auth endpoints
 */
export const { GET, POST } = auth.handler
