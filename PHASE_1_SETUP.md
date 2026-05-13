# 🔐 LearnDE — Phase 1 Auth Setup (Clerk)

## Setup Status

✅ Code files created  
⏳ Ready for Clerk configuration  
⏳ Ready to install dependencies  
⏳ Ready to test locally  

---

## 📋 Quick Setup Steps

### 1. Create Clerk Account

1. Go to **https://dashboard.clerk.com**
2. Sign up with email (free tier works great)
3. Create a new application: `LearnDE`
4. Copy your API keys

### 2. Add Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   CLERK_SECRET_KEY=sk_test_YOUR_SECRET_HERE
   ```

   Get these from **https://dashboard.clerk.com → API Keys**

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

This installs `@clerk/nextjs` (we removed `next-auth`)

### 4. Test Locally

```bash
npm run dev
```

Visit **http://localhost:3000**

You should see the landing page. Click any auth-related button → redirects to Clerk sign-up.

### 5. Test Role Selection

1. Sign up at the Clerk UI
2. You're redirected to `/auth/select-role`
3. Choose "Student" or "Faculty"
4. You're redirected to `/dashboard` or `/staff` respectively

---

## 🎯 What's Now Protected

These routes **require authentication**:

```
/dashboard       → Students only
/learn           → Students only
/quiz            → Students only
/profile         → Students only
/certificate     → Students only
/staff           → Staff + Admin only
/admin           → Admin only
/api/student/*   → Students only (API calls)
/api/staff/*     → Staff + Admin only (API calls)
/api/admin/*     → Admin only (API calls)
```

**Public routes** (anyone can access):
- `/` (landing)
- `/auth/sign-up` (Clerk)
- `/auth/sign-in` (Clerk)

---

## 🏗️ Architecture Overview

```
User Signs Up
    ↓
Clerk UI (handled by Clerk)
    ↓
Redirected to `/auth/select-role`
    ↓
Selects Student/Faculty
    ↓
Role stored in Clerk.publicMetadata
    ↓
Redirected to `/dashboard` or `/staff`
    ↓
Middleware checks role on every request
```

---

## 🔑 Key Files Created

| File | Purpose |
|------|---------|
| `middleware.ts` | Protects routes based on authentication & role |
| `app/providers.tsx` | ClerkProvider wrapper |
| `app/auth/select-role/page.tsx` | Role selection UI after signup |
| `app/api/auth/me/route.ts` | GET current user session |
| `lib/auth-utils.ts` | Custom hooks: `useAuth()`, `useCanAccess()` |
| `.env.example` | Environment template (updated) |
| `package.json` | Dependencies (updated, Clerk added) |

---

## 💻 Using Auth in Components

### Get current user in client components:

```tsx
'use client'
import { useAuth } from '@/lib/auth-utils'

export function MyComponent() {
  const { name, role, isStudent, isStaff } = useAuth()
  
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {isStudent && <p>You're a student</p>}
      {isStaff && <p>You're faculty</p>}
    </div>
  )
}
```

### Check permissions:

```tsx
import { useCanAccess } from '@/lib/auth-utils'

export function AdminFeature() {
  const { canAccessAdmin } = useCanAccess()
  
  if (!canAccessAdmin()) {
    return <div>Access denied</div>
  }
  
  return <div>Admin panel</div>
}
```

### Get user in API routes:

```tsx
import { auth } from '@clerk/nextjs/server'

export async function GET(req: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Your code here
}
```

---

## 🚨 Troubleshooting

### "ClerkProvider not found"
→ Make sure you're wrapping your app with `<AuthProvider>` in `layout.tsx`

### "Middleware not protecting routes"
→ Restart dev server: `npm run dev`

### "Role not saving"
→ Check Clerk dashboard → User → verify `publicMetadata` has `role`

### "Stuck on select-role"
→ User might not have `publicMetadata` set. Try signing out & back in.

---

## ✅ Phase 1 Complete When:

- [ ] Clerk account created
- [ ] `.env.local` filled with Clerk keys
- [ ] `npm install` successful
- [ ] `npm run dev` runs without errors
- [ ] Can sign up at Clerk UI
- [ ] Redirected to role selection
- [ ] Role selected & saved
- [ ] Redirected to correct dashboard
- [ ] Can access `/api/auth/me` (returns user data)

---

## 📝 Next: Phase 2 (Dashboard UI)

Once Phase 1 is verified working, we'll start building the 3 dashboard shells with full UI matching the design reference.

**Estimated Phase 1 time: 30 minutes setup + testing**

---

## ❓ Questions?

If you get stuck, check:
1. Clerk dashboard → API Keys (correct?)
2. `.env.local` → Keys pasted correctly?
3. Browser console → any errors?
4. Terminal → any build errors?

Good luck! 🚀
