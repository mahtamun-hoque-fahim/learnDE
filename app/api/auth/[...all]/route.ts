import { auth } from '@/lib/auth-better'
import { toNextJsHandler } from 'better-auth/next-js'

/**
 * Better Auth unified handler.
 * All /api/auth/* requests not handled by sibling routes are routed here.
 * Better Auth exposes: sign-up, sign-in, sign-out, get-session, list-accounts, etc.
 */
export const { GET, POST } = toNextJsHandler(auth)
