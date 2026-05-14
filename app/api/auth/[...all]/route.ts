import { auth } from '@/lib/auth-better'

/**
 * Better Auth Unified Handler
 * 
 * All /api/auth/* requests are routed here.
 * BetterAuth automatically creates routes for:
 * - POST /api/auth/sign-up
 * - POST /api/auth/sign-in
 * - POST /api/auth/sign-out
 * - GET /api/auth/session
 * - POST /api/auth/reset-password
 * - POST /api/auth/list-accounts
 * - + 15+ more endpoints
 * 
 * No manual request/response handling needed.
 * Better Auth handles everything automatically.
 */
export const { GET, POST } = auth.handler({
  prefix: '/api/auth',
})
