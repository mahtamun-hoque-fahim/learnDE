# ✅ BetterAuth Integration: Setup Complete (Mostly)

**Last Updated:** May 14, 2026  
**Status:** 🟢 **80% Ready** | Last 2 commits merged

---

## What Was Just Done

### ✅ Fixed Mathematical Content
- **Bernoulli Example 3** replaced with verified solution
- All integrals now use elementary functions only
- Solution: $dy/dx + y = xy^2 \Rightarrow y = \frac{1}{x+1+Ce^x}$
- **Pushed to main** (commit: `c07ef3d`)

### ✅ Added BetterAuth Infrastructure
1. **`lib/auth-client.ts`** — Client-side auth instance
   ```typescript
   import { authClient, useSession, signUp, signIn } from '@/lib/auth-client'
   ```

2. **`lib/auth-server.ts`** — Server-side utilities
   ```typescript
   import { requireAuth, requireRole, getServerSession } from '@/lib/auth-server'
   // Use in API routes, Server Components, Server Actions
   ```

3. **`BETTERAUTH_COMPLETE_GUIDE.md`** — Full setup documentation with code examples

4. **Verified existing setup:**
   - ✅ Middleware (`middleware.ts`) — Route protection configured
   - ✅ API handler (`app/api/auth/[...all]/route.ts`) — Auto-routes all auth endpoints
   - ✅ Database schema (`lib/db/schema.ts`) — Users, sessions, tokens tables ready
   - ✅ Auth config (`lib/auth-better.ts`) — Better Auth instance initialized
   - ✅ Set-role endpoint (`app/api/auth/set-role/route.ts`) — Role assignment ready

---

## What's Still TODO (Next Steps)

### 🔴 **CRITICAL** — Do These First:

#### 1️⃣ Generate and Configure Secret
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output: abc123def456789...
```

Add to `.env.local`:
```env
BETTER_AUTH_SECRET=<paste_your_secret>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=<your_neon_connection_string>
DATABASE_URL_UNPOOLED=<your_neon_connection_string>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 2️⃣ Push Database Schema
```bash
npm run db:push
# This creates tables in Neon PostgreSQL
```

Verify in [Neon Console](https://console.neon.tech):
- `users` ✓
- `sessions` ✓
- `verification_tokens` ✓
- `accounts` ✓
- `student_profiles` ✓

---

### 🟡 **IMPORTANT** — Create Auth UI Pages

#### 3️⃣ Create Sign-Up Page
File: `app/(auth)/sign-up/page.tsx`

```typescript
'use client'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await authClient.signUp.email({
        email,
        password,
        name,
      }, {
        onSuccess: () => {
          toast.success('Account created!')
          window.location.href = '/role-selection'
        },
        onError: (ctx) => {
          toast.error(ctx.error.message)
        },
      })
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <form onSubmit={handleSignUp} className="max-w-md mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password (min 8)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Sign Up
      </button>
    </form>
  )
}
```

#### 4️⃣ Create Sign-In Page
File: `app/(auth)/sign-in/page.tsx`

```typescript
'use client'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await authClient.signIn.email({
        email,
        password,
      }, {
        onSuccess: () => {
          toast.success('Signed in!')
          router.push('/dashboard')
        },
        onError: (ctx) => {
          toast.error(ctx.error.message)
        },
      })
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <form onSubmit={handleSignIn} className="max-w-md mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Sign In
      </button>
    </form>
  )
}
```

#### 5️⃣ Create Role Selection Page
File: `app/role-selection/page.tsx`

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RoleSelectionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const selectRole = async (role: 'student' | 'staff') => {
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
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl w-full mx-4 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Role</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => selectRole('student')}
            disabled={loading}
            className="p-6 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition"
          >
            <h3 className="text-xl font-bold mb-2">Student</h3>
            <p className="text-gray-600 mb-4">
              Learn at your own pace. Access chapters, quizzes, and track progress.
            </p>
            <span className="text-blue-600 font-semibold">Continue →</span>
          </button>

          <button
            onClick={() => selectRole('staff')}
            disabled={loading}
            className="p-6 border-2 border-green-200 rounded-lg hover:bg-green-50 transition"
          >
            <h3 className="text-xl font-bold mb-2">Faculty</h3>
            <p className="text-gray-600 mb-4">
              Manage courses and track student progress.
            </p>
            <span className="text-green-600 font-semibold">Continue →</span>
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## Usage Examples

### Client Component (React)
```typescript
'use client'
import { useAuth } from '@/lib/auth-utils'

export function UserProfile() {
  const { user, isSignedIn, logout, isStudent } = useAuth()

  if (!isSignedIn) return <div>Loading...</div>

  return (
    <div>
      <h1>Hello, {user?.name}</h1>
      {isStudent && <p>You are a student</p>}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Server Component
```typescript
import { requireRole, getServerSession } from '@/lib/auth-server'

export default async function StaffDashboard() {
  const session = await requireRole('staff')

  return <div>Welcome, {session.user.name}</div>
}
```

### API Route
```typescript
import { requireRole } from '@/lib/auth-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await requireRole('staff')

  // Now you know user is staff
  // Do staff-only operations

  return NextResponse.json({ ok: true })
}
```

---

## Testing Checklist

- [ ] Generate `BETTER_AUTH_SECRET`
- [ ] Configure `.env.local`
- [ ] Run `npm run db:push`
- [ ] Create sign-up page
- [ ] Create sign-in page
- [ ] Create role-selection page
- [ ] Test: Sign up → Role selection → Dashboard
- [ ] Test: Sign out → Redirect to sign-in
- [ ] Test: Session persists across page reload
- [ ] Test: Protected routes redirect unauthenticated users

---

## Important Files

| File | Purpose | Status |
|------|---------|--------|
| `lib/auth-better.ts` | Better Auth instance | ✅ Done |
| `lib/auth-client.ts` | Client-side auth | ✅ Done |
| `lib/auth-server.ts` | Server-side auth | ✅ Done |
| `lib/auth-utils.ts` | React hooks | ✅ Done |
| `middleware.ts` | Route protection | ✅ Done |
| `app/api/auth/[...all]/route.ts` | Auth endpoints | ✅ Done |
| `app/(auth)/sign-up/page.tsx` | Sign-up form | 🟡 TODO |
| `app/(auth)/sign-in/page.tsx` | Sign-in form | 🟡 TODO |
| `app/role-selection/page.tsx` | Role selection | 🟡 TODO |

---

## Environment Variables Needed

```env
# Authentication
BETTER_AUTH_SECRET=<generated-32-char-secret>
BETTER_AUTH_URL=http://localhost:3000

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Optional, for verification)
RESEND_API_KEY=<your-resend-key>
EMAIL_FROM=LearnDE <noreply@learnde.dev>
```

---

## Helpful Links

- **Better Auth Docs:** https://better-auth.com/docs
- **Neon Console:** https://console.neon.tech
- **Drizzle Docs:** https://orm.drizzle.team
- **Next.js Middleware:** https://nextjs.org/docs/app/building-your-application/routing/middleware

---

## Quick Start Command

```bash
# 1. Install deps (already done)
npm install

# 2. Setup env
cp .env.example .env.local
# Edit .env.local with your values

# 3. Push database
npm run db:push

# 4. Create auth pages (see above)
# 5. Start dev server
npm run dev

# 6. Visit http://localhost:3000/auth/sign-up
```

---

**Next:** Set environment variables → push DB schema → create auth pages → test!

Ready to implement? Start with the `.env.local` setup and `npm run db:push`.
