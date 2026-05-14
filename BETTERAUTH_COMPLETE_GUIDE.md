# Better Auth Complete Integration Guide
**LearnDE Project**  
**Status:** Partial ✅ | In-Progress 🔄

---

## Current Status ✅

### Already Implemented:
1. ✅ **Better Auth instance** (`lib/auth-better.ts`)
   - Email/password authentication enabled
   - Session management with 7-day expiry
   - Role-based callbacks (student/staff/admin)
   - Drizzle adapter configured for PostgreSQL

2. ✅ **Database schema** (`lib/db/schema.ts`)
   - `users` table with role field
   - `sessions` table (Better Auth managed)
   - `verificationTokens` table
   - `accounts` table (for future OAuth)
   - Student profiles table

3. ✅ **API Handler** (`app/api/auth/[...all]/route.ts`)
   - Unified catch-all for all `/api/auth/*` endpoints
   - Better Auth auto-generates 25+ endpoints

4. ✅ **Middleware** (`middleware.ts`)
   - Route protection for `/dashboard`, `/learn`, `/quiz`, `/staff`, `/admin`
   - Session token validation from cookies
   - Redirects to sign-in for unauthenticated access

5. ✅ **Environment setup** (`.env.example`)
   - `BETTER_AUTH_SECRET` (generate on setup)
   - `BETTER_AUTH_URL`
   - `DATABASE_URL` (Neon PostgreSQL)
   - `RESEND_API_KEY` (email verification)

6. ✅ **Package dependencies** (`package.json`)
   - `better-auth@^1.2.0` installed
   - `drizzle-orm` & `drizzle-kit` for DB
   - `jose` for JWT handling

---

## What's Missing 🔄

### 1. **Client-side auth context/hook**
Need to create a wrapper to use Better Auth on the frontend.

### 2. **Sign-up/Sign-in pages**
UI forms that consume the `/api/auth/sign-up` and `/api/auth/sign-in` endpoints.

### 3. **Role selection after sign-up**
Flow to let users choose student/staff role after registration.

### 4. **Session validation utility**
TypeScript utilities for checking session & role on client/server.

### 5. **Database migrations**
Push schema changes to Neon PostgreSQL.

---

## Setup Steps (Do These Now)

### Step 1: Generate Better Auth Secret
```bash
# Terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: abc123def456...
```

Copy this and add to `.env.local`:
```
BETTER_AUTH_SECRET=your_generated_secret_here
BETTER_AUTH_URL=http://localhost:3000
```

### Step 2: Set up Neon PostgreSQL
If not already done:
1. Go to [neon.tech](https://neon.tech)
2. Create project → get connection string
3. Add to `.env.local`:
```
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
```

### Step 3: Push database schema
```bash
npm run db:push
# This creates all tables in Neon
```

### Step 4: Create sign-up page
```bash
# If not already at app/(auth)/sign-up/page.tsx
touch app/\(auth\)/sign-up/page.tsx
```

---

## Implementation: Create Auth Utilities

### File 1: `lib/auth-client.ts` (NEW)
```typescript
import { createAuthClient } from "better-auth/client"

/**
 * Client-side Better Auth instance
 * Used in React components for sign-in, sign-up, session checks
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
})

export const {
  signIn,
  signUp,
  signOut,
  session,
  useSession,
  listAccounts,
  getSession,
} = authClient
```

### File 2: `app/(auth)/sign-up/page.tsx` (NEW)
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const response = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }, {
        onRequest: () => {
          setLoading(true)
        },
        onSuccess: () => {
          toast.success('Sign up successful! Redirecting...')
          router.push('/role-selection')
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || 'Sign up failed')
        },
      })
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password (min 8 chars)"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <a href="/auth/sign-in" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </div>
  )
}
```

### File 3: `app/(auth)/sign-in/page.tsx` (NEW)
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: () => {
            toast.success('Signed in successfully!')
            router.push('/dashboard')
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || 'Sign in failed')
          },
        }
      )
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <form onSubmit={handleSignIn} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <a href="/auth/sign-up" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  )
}
```

### File 4: `app/role-selection/page.tsx` (NEW)
```typescript
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function RoleSelectionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRoleSelect = async (role: 'student' | 'staff') => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (!res.ok) throw new Error('Failed to set role')

      toast.success(`Welcome, ${role}!`)
      router.push(role === 'student' ? '/dashboard' : '/staff')
    } catch (error: any) {
      toast.error(error.message || 'Failed to set role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Choose Your Role</h1>
        <p className="text-gray-600 text-center mb-8">
          Tell us how you'll be using LearnDE
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Card */}
          <button
            onClick={() => handleRoleSelect('student')}
            disabled={loading}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition disabled:opacity-50"
          >
            <h3 className="text-xl font-bold mb-2">Student</h3>
            <p className="text-gray-600 mb-4">
              Learn differential equations at your own pace. Access chapters, quizzes, and track your progress.
            </p>
            <span className="text-blue-600 font-semibold">Continue as Student →</span>
          </button>

          {/* Staff Card */}
          <button
            onClick={() => handleRoleSelect('staff')}
            disabled={loading}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition disabled:opacity-50"
          >
            <h3 className="text-xl font-bold mb-2">Staff</h3>
            <p className="text-gray-600 mb-4">
              Manage courses, view student progress, and create assessments. Instructor-only dashboard.
            </p>
            <span className="text-green-600 font-semibold">Continue as Staff →</span>
          </button>
        </div>
      </div>
    </div>
  )
}
```

### File 5: `app/api/auth/set-role/route.ts` (NEW)
```typescript
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth-better'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json()

    // Validate role
    if (!['student', 'staff'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Get current session
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Update user role
    await db
      .update(users)
      .set({ role })
      .where(eq(users.id, session.user.id))

    return NextResponse.json(
      { message: 'Role set successfully', role },
      { status: 200 }
    )
  } catch (error) {
    console.error('Set role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### File 6: `lib/auth-utils.ts` (Helper utilities)
```typescript
import { auth } from './auth-better'
import { Session } from './auth-better'
import { headers } from 'next/headers'

/**
 * Get current session on the server
 * Use in Server Components and API routes
 */
export async function getServerSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    return session
  } catch {
    return null
  }
}

/**
 * Require authentication in Server Components
 * Throws if user is not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session
}

/**
 * Require specific role in Server Components
 */
export async function requireRole(role: 'student' | 'staff' | 'admin') {
  const session = await requireAuth()
  if (session.user.role !== role) {
    throw new Error(`Requires ${role} role`)
  }
  return session
}

/**
 * Type-safe session type
 */
export type Session = typeof auth.$Inferred.Session
```

---

## Database Migration

### Run migrations:
```bash
npm run db:push
# Or step-by-step:
npm run db:generate  # Generate from schema
npm run db:migrate   # Apply to database
```

Check in [Neon Console](https://console.neon.tech) that tables were created:
- `users`
- `sessions`
- `verification_tokens`
- `accounts`
- `student_profiles`

---

## Testing the Flow

### 1. **Start dev server:**
```bash
npm run dev
```

### 2. **Test sign-up:**
- Navigate to `http://localhost:3000/auth/sign-up`
- Fill form → Submit
- Should redirect to `/role-selection`

### 3. **Select role:**
- Choose "Student" or "Staff"
- Should redirect to `/dashboard` or `/staff`

### 4. **Verify session:**
- Session should be stored in HTTP-only cookie
- Check DevTools: Application → Cookies → `better-auth.session_token`

### 5. **Test protected routes:**
- Sign out → Try accessing `/dashboard`
- Should redirect to `/auth/sign-in`

---

## Key Differences from Legacy JWT

| Feature | Legacy | Better Auth |
|---------|--------|------------|
| Token type | JWT cookie (7d/8h) | Session token + refresh |
| Storage | `auth-token` / `staff-token` | `better-auth.session_token` |
| User info | Encoded in JWT | Fetched from DB on each request |
| Refresh | Manual | Automatic via cookies |
| Password hashing | Custom bcryptjs | Better Auth handles |
| Role management | Custom logic | Built-in callback |

---

## Database Cleanup (When Ready)

After dashboards are finalized:
```bash
# Create migration to drop old auth tables
npm run db:generate -- --name drop_legacy_auth

# Run migration
npm run db:migrate
```

---

## Checklist

- [ ] Generate `BETTER_AUTH_SECRET`
- [ ] Add to `.env.local`
- [ ] Set `DATABASE_URL` & `DATABASE_URL_UNPOOLED`
- [ ] Run `npm run db:push`
- [ ] Create `lib/auth-client.ts`
- [ ] Create sign-up page
- [ ] Create sign-in page
- [ ] Create role-selection page
- [ ] Create set-role API route
- [ ] Update `lib/auth-utils.ts`
- [ ] Test full auth flow
- [ ] Update existing pages to use new auth
- [ ] Remove old auth files once stable

---

## Support
- Better Auth docs: https://better-auth.com/docs
- Examples: https://github.com/better-auth/better-auth
- Issues: Check GitHub or ask in discussions

