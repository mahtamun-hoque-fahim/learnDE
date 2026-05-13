'use client'

import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'

/**
 * Safe Clerk Provider wrapper
 * Gracefully handles missing publishableKey during build time
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // During static generation/build, Clerk might not have env vars
  // Provide a safe fallback to prevent build failures
  if (!publishableKey) {
    // Dev environment: warn but don't crash
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '⚠️ Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in environment. ' +
        'Add it to .env.local for auth to work. ' +
        'See: https://clerk.com/docs/references/nextjs/clerk-provider'
      )
    }
    // Production build: this will be caught and fixed by adding env vars to Vercel
    return <>{children}</>
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  )
}

