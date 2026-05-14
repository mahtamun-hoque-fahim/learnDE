import { createAuthClient } from "better-auth/client"

/**
 * Client-side Better Auth instance
 * Use in React components for sign-in, sign-up, session checks, sign-out
 * 
 * Docs: https://better-auth.com/docs/client
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
})

// Re-export commonly used functions
export const {
  signIn,
  signUp,
  signOut,
  session,
  useSession,
  listAccounts,
  getSession,
  changePassword,
  resetPassword,
} = authClient

/**
 * Session type for TypeScript
 */
export type Session = typeof authClient.$Inferred.Session
