# 🔐 LearnDE — PHASE 1: Better Auth Setup

**Status**: Ready for setup & testing  
**Framework**: Better Auth (https://better-auth.com/)  
**Database**: Neon PostgreSQL with Drizzle ORM  

---

## 📋 Overview

Better Auth is a **self-hosted, TypeScript-first authentication solution** designed for Next.js applications.

**Key Benefits**:
✅ Self-hosted (no external auth service dependency)
✅ TypeScript-first development
✅ Works seamlessly with Drizzle ORM
✅ HTTP-only cookies for secure sessions
✅ No lock-in (complete control)
✅ Production-ready

---

## 🚀 Quick Setup (5 steps)

### Step 1: Generate Auth Secret

Generate a random secret (32+ characters):

```bash
openssl rand -base64 32
```

Or use this online tool: https://generate-random.org/

Copy the output, you'll need it in step 2.

### Step 2: Update `.env.local`

Copy from `.env.example` and add your values:

```env
# From step 1:
BETTER_AUTH_SECRET=your-random-secret-min-32-chars

# Your database connection (Neon):
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require

# Optional (defaults to http://localhost:3000 for local dev):
BETTER_AUTH_URL=http://localhost:3000
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs:
- `better-auth@^1.2.0` (main auth package)
- All other dependencies (drizzle, neon, etc.)

### Step 4: Create Database Tables

Better Auth requires specific tables in your database. You have two options:

#### Option A: Auto-create tables (Recommended for first time)

```bash
# Drizzle kit will create all tables defined in lib/db/schema.ts
npx drizzle-kit push
```

This creates:
- `users` (unified: students, staff, admins)
- `sessions` (session management)
- `verification_tokens` (email verification, password reset)
- `accounts` (OAuth, optional)
- `progress`, `quiz_attempts`, `certificates` (LearnDE specific)

#### Option B: Manual SQL (Advanced)

If you prefer to create tables manually, the schema is in `lib/db/schema.ts`

### Step 5: Run Dev Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🧪 Testing the Auth Flow

### 1. Sign Up

1. Click "Sign Up" on the landing page
2. Enter email and password
3. You'll be redirected to `/auth/select-role`

### 2. Select Role

1. Choose "Student" or "Faculty"
2. Click "Continue"
3. You'll be redirected to `/dashboard` or `/staff`

### 3. Test Session

Try these:

```bash
# Open browser DevTools → Application → Cookies
# Should see: `better-auth.session_token`

# Or check session in code:
# Visit http://localhost:3000/api/auth/get-session
# Should return: { session: { user: {...}, expiresAt: ... } }
```

### 4. Test Protected Routes

- Sign out
- Try accessing `/dashboard` → redirects to `/auth/sign-in`
- Try accessing `/staff` as student → redirects to `/dashboard`
- Try accessing `/admin` as student → redirects to `/dashboard`

---

## 📁 What's Been Created

### Core Auth Files

```
✅ lib/auth-better.ts              — Better Auth configuration
✅ lib/auth-utils.ts               — useAuth() hook & utilities
✅ middleware.ts                   — Route protection
✅ app/api/auth/[...all]/route.ts  — Better Auth endpoints
✅ app/api/auth/get-session/route.ts — Get session
✅ app/api/auth/set-role/route.ts  — Set user role
✅ app/auth/select-role/page.tsx   — Role selection UI
```

### Database

```
✅ lib/db/schema.ts                — Better Auth + LearnDE tables
✅ lib/db/index.ts                 — Database instance
✅ drizzle.config.ts               — Drizzle configuration
```

### Configuration

```
✅ .env.example                    — Environment template
✅ package.json                    — Dependencies updated
✅ app/layout.tsx                  — No provider needed
```

---

## 🛠️ How It Works

### Auth Flow

```
User visits app
    ↓
Middleware checks for session cookie (better-auth.session_token)
    ↓
If no session: Redirect to /auth/sign-in
    ↓
User signs up/in via Better Auth
    ↓
Session cookie is set (HTTP-only, secure)
    ↓
Redirected to /auth/select-role
    ↓
Selects role (student/staff)
    ↓
Role saved to users.role column in DB
    ↓
Redirected to /dashboard or /staff
```

### Session Management

Better Auth handles everything:
- Creates session on login
- Stores in HTTP-only cookies (safe from XSS)
- Validates on every request
- Auto-expires after 7 days
- Client components can fetch session via `useAuth()` hook

---

## 💻 Using Auth in Your Code

### Client Components (useAuth hook)

```tsx
'use client'
import { useAuth } from '@/lib/auth-utils'

export function Header() {
  const { user, isSignedIn, role, logout } = useAuth()
  
  if (!isSignedIn) {
    return <div>Please sign in</div>
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      {role === 'student' && <p>Dashboard: Learn chapters</p>}
      {role === 'staff' && <p>Dashboard: Review submissions</p>}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Server Components (getSession)

```tsx
import { auth } from '@/lib/auth-better'
import { headers } from 'next/headers'

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  
  if (!session) {
    return <div>Not authenticated</div>
  }
  
  return <div>Hello, {session.user.name}!</div>
}
```

### API Routes

```tsx
import { auth } from '@/lib/auth-better'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  })
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  return NextResponse.json({ user: session.user })
}
```

---

## 🔑 Environment Variables

### Required

```env
BETTER_AUTH_SECRET=your-random-secret-min-32-chars
DATABASE_URL=postgresql://...
```

### Optional

```env
# Defaults to http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000

# Resend for emails (Phase 6)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@learnde.dev
```

---

## 🚨 Common Issues & Solutions

### Issue: "Error: Unexpected token ')'"

**Cause**: Environment variables not set  
**Fix**: Make sure `.env.local` has `BETTER_AUTH_SECRET` and `DATABASE_URL`

```bash
echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
```

### Issue: "Database connection failed"

**Cause**: DATABASE_URL is wrong or database is down  
**Fix**: 
```bash
# Test connection
npx drizzle-kit push
```

If fails, check:
1. URL is correct (copy from Neon dashboard)
2. Network access allowed (Neon firewall)
3. Database exists

### Issue: "No session" on /api/auth/get-session

**Cause**: User not logged in  
**Fix**: This is correct! Sign in first, then try again

### Issue: "Role not saving"

**Cause**: Database not created properly  
**Fix**: Run migrations:
```bash
npx drizzle-kit push
```

### Issue: Stuck on /auth/select-role

**Cause**: User doesn't have a role yet, but API is failing  
**Fix**: Check browser console for errors, check `/api/auth/set-role` logs

---

## ✅ Verification Checklist

Before moving to Phase 2, verify:

- [ ] BETTER_AUTH_SECRET set in `.env.local`
- [ ] DATABASE_URL set in `.env.local`
- [ ] `npm install` completed without errors
- [ ] `npx drizzle-kit push` succeeded
- [ ] `npm run dev` runs without errors
- [ ] Can visit http://localhost:3000
- [ ] Can sign up with email
- [ ] Redirected to role selection
- [ ] Can select role
- [ ] Redirected to dashboard based on role
- [ ] Can access `/api/auth/get-session` (returns user data)
- [ ] Session cookie visible in DevTools
- [ ] Can sign out
- [ ] Protected routes redirect to sign-in

---

## 📚 Additional Resources

- **Better Auth Docs**: https://better-auth.com/docs
- **Better Auth GitHub**: https://github.com/better-auth/better-auth
- **Drizzle ORM**: https://orm.drizzle.team/docs
- **Neon Docs**: https://neon.tech/docs

---

## 🎯 Next Steps

Once Phase 1 is verified working:

1. ✅ Auth system is complete
2. ✅ Protected routes work
3. ✅ Role system works
4. ⏳ **Phase 2**: Build dashboard UI (3-4 days)

---

## 📞 Need Help?

1. Check this guide first
2. Check Better Auth docs
3. Check browser console for errors
4. Check server logs: `npm run dev` terminal

---

## 🚀 You're Ready!

Better Auth is now set up. Run:

```bash
npm run dev
```

Then visit http://localhost:3000 and test the flow! 🎉

