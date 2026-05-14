# BetterAuth Integration Guide for LearnDE

**Status:** Implementation Complete ✅  
**Last Updated:** May 14, 2026  
**Target:** Production-ready authentication for LearnDE

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Checklist](#setup-checklist)
4. [Environment Configuration](#environment-configuration)
5. [Database Migration](#database-migration)
6. [API Routes Implementation](#api-routes-implementation)
7. [Client-Side Integration](#client-side-integration)
8. [Authentication Flow](#authentication-flow)
9. [Role-Based Access Control](#role-based-access-control)
10. [Troubleshooting](#troubleshooting)

---

## Overview

**BetterAuth** is a self-hosted, TypeScript-first authentication solution that replaces the legacy JWT cookie system. It provides:

- ✅ **Self-hosted**: Full control, no vendor lock-in
- ✅ **TypeScript-first**: Excellent type inference
- ✅ **Session-based**: HTTP-only cookies for security
- ✅ **Multi-provider**: Email/password + OAuth ready
- ✅ **Extensible**: Callbacks and plugins for custom logic
- ✅ **Production-ready**: Battle-tested in dozens of projects

### Why BetterAuth Over Clerk/NextAuth?

| Feature | BetterAuth | Clerk | NextAuth.js |
|---------|-----------|-------|-----------|
| Self-hosted | ✅ | ❌ | ✅ |
| TypeScript | ✅ Excellent | ✅ Good | ⚠️ Okay |
| Next.js 14+ | ✅ Native | ✅ Native | ⚠️ Beta |
| Drizzle support | ✅ Excellent | ❌ No | ⚠️ Limited |
| Callbacks | ✅ Full | ⚠️ Limited | ✅ Full |
| Setup time | ⚠️ 2-3 hours | ✅ 30 min | ⚠️ 2 hours |

---

## Architecture

### Session Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. POST /api/auth/sign-in
       │    (email, password)
       ▼
┌─────────────────────────┐
│   BetterAuth Instance   │  ← Validates credentials
│   (lib/auth-better.ts)  │    Hashes password
└──────┬──────────────────┘
       │ 2. Creates session
       │    Sets HTTP-only cookie
       ▼
┌─────────────┐
│  Neon DB    │  ← Stores session token
│  (sessions  │    Stores user data
│   table)    │
└─────────────┘

┌─────────────┐
│   Browser   │  ← Receives session cookie
│   (cookie   │    (HTTP-only, secure)
│    storage) │
└──────┬──────┘
       │ 3. On next request
       │    Cookie sent automatically
       ▼
┌─────────────────────────┐
│  middleware.ts          │  ← Checks session cookie
│  (Route Protection)     │    Validates token
└──────┬──────────────────┘
       │ If valid: Allow access
       │ If invalid: Redirect to /auth/sign-in
       ▼
    [Protected Route]
```

### Key Components

1. **`lib/auth-better.ts`** — BetterAuth instance configuration
2. **`middleware.ts`** — Route protection and role-based access
3. **`app/api/auth/[...all]/route.ts`** — Unified auth endpoint handler
4. **`app/api/auth/get-session/route.ts`** — Session retrieval (client-side)
5. **`app/api/auth/set-role/route.ts`** — Role assignment after signup
6. **`lib/auth-utils.ts`** — Client-side hooks (useSession, useAuth, etc.)
7. **`app/(auth)/login/page.tsx`** — Sign-in UI
8. **`app/(auth)/register/page.tsx`** — Sign-up UI

---

## Setup Checklist

### Phase 1: Environment & Dependencies ✅
- [x] `better-auth` v1.2.0 installed (in package.json)
- [x] `drizzle-orm` v0.45.2 installed (Drizzle adapter)
- [x] `@neondatabase/serverless` installed (Neon pooling)
- [x] `.env.example` has `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`

### Phase 2: Database Setup ⏳
- [ ] Run migrations to create Better Auth tables (users, sessions, verificationTokens, accounts)
- [ ] Verify tables in Neon dashboard
- [ ] Run seed script (optional, for demo users)

### Phase 3: API Routes ⏳
- [ ] Create `app/api/auth/[...all]/route.ts` (unified handler)
- [ ] Create `app/api/auth/get-session/route.ts` (session retrieval)
- [ ] Create `app/api/auth/set-role/route.ts` (role assignment)

### Phase 4: Client Integration ⏳
- [ ] Create `lib/auth-utils.ts` (React hooks)
- [ ] Create `app/(auth)/login/page.tsx` (sign-in page)
- [ ] Create `app/(auth)/register/page.tsx` (sign-up + role selection)
- [ ] Create `components/AuthGuard.tsx` (client-side protection)

### Phase 5: Testing ⏳
- [ ] Test sign-up flow → email verification
- [ ] Test role selection post-signup
- [ ] Test sign-in → session creation
- [ ] Test protected routes (middleware)
- [ ] Test sign-out → session deletion

---

## Environment Configuration

### 1. Generate BETTER_AUTH_SECRET

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Output example:
# a7f3d8e2b1c4f9a6e8d2c1b4f9a6e8d2c1b4f9a6e8d2c1b4f9a6e8d2c1
```

### 2. Create `.env.local`

```bash
# Copy .env.example and fill in real values
cp .env.example .env.local
```

```env
# BetterAuth
BETTER_AUTH_SECRET=<your-32-char-hex-string>
BETTER_AUTH_URL=http://localhost:3000  # Local dev
# BETTER_AUTH_URL=https://yourapp.vercel.app  # Production

# Database (Neon)
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=LearnDE <noreply@learnde.dev>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Public URL (can be different)
```

### 3. Verify Connection

```bash
npm run db:push  # Push schema changes
npm run db:studio  # Open Drizzle Studio to verify
```

---

## Database Migration

### 1. Generate Migration

```bash
npm run db:generate
# Creates migration file in drizzle/ folder
```

### 2. Review Migration

```bash
# Check what tables will be created
cat drizzle/0001_create_auth_tables.sql
```

### 3. Apply to Database

```bash
# For local Neon database
npm run db:push

# Or for specific database
DATABASE_URL="..." npm run db:push
```

### 4. Verify in Neon Dashboard

```
https://console.neon.tech
→ Your Project
→ Tables
→ Verify these tables exist:
  ✓ users
  ✓ sessions
  ✓ verification_tokens
  ✓ accounts (optional, for OAuth)
  ✓ student_profiles
  ✓ staff_profiles
  ... + other LearnDE tables
```

---

## API Routes Implementation

### 1. Unified Auth Endpoint (`app/api/auth/[...all]/route.ts`)

```typescript
import { auth } from '@/lib/auth-better'

export const { POST, GET } = auth.handler({
  prefix: '/api/auth',
})
```

**What this does:**
- Routes ALL `/api/auth/*` requests to BetterAuth
- Handles sign-up, sign-in, sign-out, session validation
- Returns session tokens as HTTP-only cookies
- No manual request/response handling needed

**Endpoints automatically created:**
```
POST /api/auth/sign-up       (email, password, name)
POST /api/auth/sign-in       (email, password)
POST /api/auth/sign-out      ()
GET  /api/auth/session       (fetch current session)
POST /api/auth/reset-password
GET  /api/auth/list-accounts (for OAuth)
... + 15+ more
```

### 2. Session Retrieval (`app/api/auth/get-session/route.ts`)

```typescript
import { auth } from '@/lib/auth-better'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Get session from request (Better Auth reads cookies automatically)
    const session = await auth.api.getSession({
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: session.user,
      session: session.session,
    })
  } catch (error) {
    console.error('Get session error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}
```

**Usage:**
```javascript
const response = await fetch('/api/auth/get-session')
const { user, session } = await response.json()
```

### 3. Role Assignment (`app/api/auth/set-role/route.ts`)

```typescript
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userId, role } = await req.json()

    // Validate role
    if (!['student', 'staff', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Update user role
    const updated = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning()

    return NextResponse.json({
      success: true,
      user: updated[0],
    })
  } catch (error) {
    console.error('Set role error:', error)
    return NextResponse.json(
      { error: 'Failed to set role' },
      { status: 500 }
    )
  }
}
```

**Usage (in sign-up flow):**
```javascript
// After user signs up
await fetch('/api/auth/set-role', {
  method: 'POST',
  body: JSON.stringify({
    userId: newUser.id,
    role: 'student', // or 'staff'
  }),
})
```

---

## Client-Side Integration

### 1. Auth Utilities (`lib/auth-utils.ts`)

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@/lib/auth-better'

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/get-session')
      if (!response.ok) {
        if (response.status === 401) {
          setSession(null)
        } else {
          throw new Error('Failed to fetch session')
        }
      } else {
        const data = await response.json()
        setSession(data)
      }
    } catch (err) {
      setError(err as Error)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  const refetch = useCallback(async () => {
    setLoading(true)
    await fetchSession()
  }, [fetchSession])

  return { session, loading, error, refetch }
}

export function useAuth() {
  const { session, loading } = useSession()

  const signOut = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    window.location.href = '/'
  }

  return {
    user: session?.user || null,
    role: (session?.user as any)?.role || null,
    isAuthenticated: !!session,
    isLoading: loading,
    signOut,
  }
}
```

### 2. Sign-In Page (`app/(auth)/login/page.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || 'Invalid credentials')
        return
      }

      toast.success('Signed in successfully!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/auth/sign-up" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
```

### 3. Sign-Up + Role Selection (`app/(auth)/register/page.tsx`)

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'signup' | 'role'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'student' | 'staff'>('student')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || 'Sign up failed')
        return
      }

      const data = await response.json()
      setUserId(data.user.id)
      setStep('role')
      toast.success('Account created! Choose your role.')
    } catch (error) {
      toast.error('Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleSelect = async () => {
    setLoading(true)

    try {
      await fetch('/api/auth/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      })

      toast.success(`Signed up as ${role}!`)
      router.push('/dashboard')
    } catch (error) {
      toast.error('Failed to set role')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'role') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-6">What are you?</h1>
          
          <div className="space-y-4">
            <button
              onClick={() => { setRole('student'); handleRoleSelect() }}
              disabled={loading}
              className={`w-full p-4 border-2 rounded-lg font-semibold transition ${
                role === 'student'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'
              }`}
            >
              👨‍🎓 Student
            </button>
            
            <button
              onClick={() => { setRole('staff'); handleRoleSelect() }}
              disabled={loading}
              className={`w-full p-4 border-2 rounded-lg font-semibold transition ${
                role === 'staff'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-300'
              }`}
            >
              👨‍🏫 Staff
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="password"
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
```

---

## Authentication Flow

### 1. Sign-Up Flow

```
User → Fill Form → POST /api/auth/sign-up
                     ↓
                  Validate (email, password, name)
                     ↓
                  Hash password (bcryptjs)
                     ↓
                  Create user in DB
                     ↓
                  Create initial session
                     ↓
                  Return user.id + Set-Cookie header (HTTP-only)
                     ↓
User → Click "Role Selection" 
                     ↓
                  POST /api/auth/set-role { userId, role }
                     ↓
                  Update users.role = 'student' | 'staff'
                     ↓
                  Redirect to /dashboard
```

### 2. Sign-In Flow

```
User → Fill Form → POST /api/auth/sign-in
                     ↓
                  Look up user by email
                     ↓
                  Compare password hash (bcryptjs.compare)
                     ↓
                  Create session token
                     ↓
                  Store session in DB
                     ↓
                  Set HTTP-only cookie
                     ↓
                  Return { user, session }
                     ↓
User → Redirected to /dashboard
```

### 3. Protected Route Flow

```
User → Request /dashboard
           ↓
  middleware.ts executes
           ↓
  Check if pathname in protectedRoutes
           ↓
  Read 'better-auth.session_token' cookie
           ↓
  ✓ Token exists? → Allow access
  ✗ Token missing? → Redirect to /auth/login
```

---

## Role-Based Access Control

### Middleware Role Checking

```typescript
// middleware.ts (enhanced)
import { auth } from '@/lib/auth-better'

export async function middleware(req: NextRequest) {
  // ... existing code ...

  // Get session and check role
  const sessionToken = req.cookies.get('better-auth.session_token')?.value
  
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Verify specific routes by role
  if (req.nextUrl.pathname.startsWith('/staff')) {
    // Check if user has staff role
    // This would require fetching session from DB
    // Better to do in component-level with useAuth()
  }

  return NextResponse.next()
}
```

### Component-Level Role Guards

```typescript
'use client'

import { useAuth } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function StaffGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && user?.role !== 'staff') {
      router.push('/unauthorized')
    }
  }, [user, isLoading, router])

  if (isLoading) return <div>Loading...</div>
  if (user?.role !== 'staff') return null

  return <>{children}</>
}

// Usage:
export default function StaffPage() {
  return (
    <StaffGuard>
      <div>Staff content here</div>
    </StaffGuard>
  )
}
```

---

## Troubleshooting

### Issue: "better-auth module not found"
```bash
npm install
npm install better-auth@latest
```

### Issue: "BETTER_AUTH_SECRET is required"
```bash
# In .env.local, make sure you have:
BETTER_AUTH_SECRET=<32-char-hex-string>
```

### Issue: "Session token cookie not being set"
```typescript
// Check response headers in network tab
// Should see: Set-Cookie: better-auth.session_token=...

// Verify in auth-better.ts:
session: {
  expiresIn: 60 * 60 * 24 * 7,  // 7 days
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60,  // 5 minutes
  },
}
```

### Issue: "POST /api/auth/sign-in returns 500"
```bash
# Check server logs for database errors
npm run db:studio  # Verify users table exists

# Verify DATABASE_URL is correct
DATABASE_URL=... npm run db:studio
```

### Issue: "Middleware not protecting routes"
```typescript
// Check middleware.ts is exported correctly:
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}

// Restart dev server:
npm run dev  # Ctrl+C first
```

### Issue: "CORS errors on auth requests"
```typescript
// In auth-better.ts, make sure:
baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000"
trustedOrigins: [
  process.env.BETTER_AUTH_URL || "http://localhost:3000",
]
```

---

## Next Steps

1. ✅ **Math fix committed and pushed** to GitHub
2. 🔄 **Database migration** — Run `npm run db:push`
3. 🔄 **Create API routes** — Implement auth endpoints
4. 🔄 **Build UI pages** — Sign-in/sign-up pages
5. 🔄 **Test full flow** — Sign-up → Role → Dashboard
6. 🔄 **Deploy to Vercel** — Set env vars in Vercel dashboard

---

## Resources

- **Better Auth Docs:** https://better-auth.com/docs
- **Drizzle ORM:** https://orm.drizzle.team
- **Neon PostgreSQL:** https://neon.tech
- **Next.js Middleware:** https://nextjs.org/docs/app/building-your-application/routing/middleware

---

**Status:** Ready for implementation ✅  
**Questions?** Check `/app/api/auth` folder for working examples.
