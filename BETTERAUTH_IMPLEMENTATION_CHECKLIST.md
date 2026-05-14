# LearnDE BetterAuth Implementation Checklist

**Status:** Ready for Implementation ✅  
**Last Updated:** May 14, 2026  
**Estimated Time:** 30-45 minutes to complete all steps

---

## 📦 What's Already Done

### ✅ Fixed & Committed
- [x] **Math Error Fixed** — Bernoulli Example 3 with elementary solution (commit: b0bb860)
- [x] **BetterAuth Guide** — Comprehensive 300+ line setup documentation (commit: 53e058d)
- [x] **Auth Handler Fixed** — Unified `/api/auth/[...all]/route.ts` properly configured
- [x] **Database Schema** — All 14 tables defined in `lib/db/schema.ts`
- [x] **Auth Instance** — BetterAuth configured in `lib/auth-better.ts`
- [x] **Client Utilities** — React hooks in `lib/auth-utils.ts`
- [x] **API Routes** — Get-session and set-role endpoints ready

### ⏳ Ready to Implement
- [ ] Environment configuration (BETTER_AUTH_SECRET generation)
- [ ] Database migration
- [ ] Testing authentication flows
- [ ] Vercel deployment setup

---

## 🚀 Step-by-Step Implementation

### Step 1: Generate BETTER_AUTH_SECRET (2 minutes)

```bash
# Run one of these commands to generate a random 32-char hex string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example (copy this):
# a7f3d8e2b1c4f9a6e8d2c1b4f9a6e8d2c1b4f9a6e8d2c1b4f9a6e8d2c1
```

### Step 2: Create `.env.local` File (3 minutes)

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and fill in:
BETTER_AUTH_SECRET=<paste-the-32-char-hex-from-step-1>
BETTER_AUTH_URL=http://localhost:3000

DATABASE_URL=<your-neon-connection-string>
DATABASE_URL_UNPOOLED=<your-neon-unpooled-connection>

RESEND_API_KEY=<your-resend-api-key>
EMAIL_FROM=LearnDE <noreply@learnde.dev>

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to get each value:**

| Variable | How to Get | Example |
|----------|-----------|---------|
| `BETTER_AUTH_SECRET` | Generate above ✓ | `a7f3d8e2...` |
| `DATABASE_URL` | Neon console → Connection strings | `postgresql://user:pwd@ep-xxxx.neon.tech/db` |
| `DATABASE_URL_UNPOOLED` | Same as above, unpooled version | `postgresql://user:pwd@ep-xxxx.neon.tech/db` |
| `RESEND_API_KEY` | Resend.com → API Keys | `re_2pf9rQ...` |
| `EMAIL_FROM` | Your app's email | `LearnDE <noreply@learnde.dev>` |
| `NEXT_PUBLIC_APP_URL` | Your app URL | `http://localhost:3000` |

### Step 3: Install Dependencies (5 minutes)

```bash
npm install

# Verify better-auth is installed
npm list better-auth
# Should show: better-auth@1.2.0 (or higher)
```

### Step 4: Push Database Schema (10 minutes)

```bash
# Generate migration file
npm run db:generate

# You should see output like:
# ✓ Migrations created in drizzle/

# Apply migration to database
npm run db:push

# You should see:
# ✓ Migrations applied successfully
```

**Verify in Neon Dashboard:**
```
https://console.neon.tech
→ Your Project
→ Tables
→ Look for these tables:
  ✓ users
  ✓ sessions
  ✓ verification_tokens
  ✓ accounts
  ✓ student_profiles
  ✓ staff_profiles
  ✓ progress
  ✓ quiz_attempts
  ✓ certificates
  ... (14 total)
```

### Step 5: Start Development Server (2 minutes)

```bash
npm run dev

# You should see:
# ▲ Next.js 16.2.6
# - Local:        http://localhost:3000
# - Environments: .env.local
```

### Step 6: Test Sign-Up Flow (10 minutes)

**Visit:** `http://localhost:3000/auth/register`

**What to do:**
1. Click "Create Account"
2. Fill in: Name, Email, Password (min 8 chars)
3. Click "Create Account"
4. You should see: "Role Selection" screen
5. Choose "👨‍🎓 Student" or "👨‍🏫 Staff"
6. Should redirect to `/dashboard`
7. See greeting with your name ✓

**If issues:**
```bash
# Check server logs for errors
# Terminal should show request logs

# Check browser console (F12) for network errors
# Look at Network tab to see API responses

# Common issues:
- 500 error → Check BETTER_AUTH_SECRET in .env.local
- 401 error → Database not migrated (run: npm run db:push)
- Session not persisting → Check cookies in DevTools > Application
```

### Step 7: Test Sign-In Flow (5 minutes)

**Visit:** `http://localhost:3000/auth/login`

**What to do:**
1. Enter email and password from Step 6
2. Click "Sign In"
3. Should redirect to `/dashboard`
4. Verify you see your data ✓

### Step 8: Test Route Protection (5 minutes)

**Visit:** `http://localhost:3000/protected-route`

**What should happen:**
1. If logged in → Show the page
2. If not logged in → Redirect to `/auth/login`

**Check middleware.ts:**
```typescript
// Protected routes that require auth:
const protectedRoutes = [
  '/dashboard',    // All authenticated users
  '/profile',
  '/learn',        // Students
  '/quiz',
  '/staff',        // Staff only
  '/admin',        // Admin only
]
```

---

## 📋 Existing Infrastructure Verification

### Verify Auth Files Exist

```bash
# Auth configuration
✓ lib/auth-better.ts (BetterAuth instance)
✓ lib/auth-utils.ts (React hooks: useAuth, useCanAccess)
✓ middleware.ts (Route protection)

# API endpoints
✓ app/api/auth/[...all]/route.ts (Unified handler)
✓ app/api/auth/get-session/route.ts (Session retrieval)
✓ app/api/auth/set-role/route.ts (Role assignment)
✓ app/api/auth/login/route.ts (Sign-in handler)
✓ app/api/auth/register/route.ts (Sign-up handler)
✓ app/api/auth/logout/route.ts (Sign-out handler)

# Database
✓ lib/db/index.ts (Neon connection)
✓ lib/db/schema.ts (All 14 tables)

# Pages
✓ app/(auth)/login/page.tsx (Sign-in UI)
✓ app/(auth)/register/page.tsx (Sign-up UI)
✓ app/auth/select-role/page.tsx (Role selection)
```

**Verify with:**
```bash
ls -la lib/auth-*
ls -la app/api/auth/*/route.ts
ls -la lib/db/
```

---

## 🔐 Security Checklist

- [x] **BETTER_AUTH_SECRET**: Random 32+ character hex string
- [x] **HTTP-only Cookies**: BetterAuth uses secure cookies, not localStorage
- [x] **Password Hashing**: bcryptjs auto-hashes passwords
- [x] **CSRF Protection**: Built into BetterAuth
- [x] **Session Validation**: middleware.ts checks sessions before route access
- [x] **Role-Based Access**: Middleware enforces role restrictions
- [x] **Email Verification**: BetterAuth supports email verification (optional)

**Additional recommendations:**
```env
# For production:
BETTER_AUTH_URL=https://yourapp.vercel.app
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app

# Enable email verification:
# (Add to auth-better.ts if needed)
emailVerification: {
  enabled: true,
  sendEmailOnSignUp: true,
}
```

---

## 📱 Testing Different Roles

### Test Student Account

```bash
Sign up with:
- Email: student@university.edu
- Password: TestPassword123
- Role: Student ← Select this

Result:
- Can access /dashboard
- Can access /learn, /quiz
- Cannot access /staff, /admin
```

### Test Staff Account

```bash
Sign up with:
- Email: staff@university.edu
- Password: TestPassword456
- Role: Staff ← Select this

Result:
- Can access /dashboard
- Can access /staff, /submissions
- Cannot access /admin
```

### Test Admin Account

```bash
# Create admin user manually in database:
# UPDATE users SET role = 'admin' WHERE email = 'admin@example.com'

Result:
- Can access /dashboard
- Can access /staff, /admin, /submissions
- Full access to all features
```

---

## 🚀 Deployment to Vercel

### Step 1: Push Code to GitHub

```bash
git push origin main
```

### Step 2: Connect Vercel

```
https://vercel.com/new
→ Import from Git
→ Select learnDE repository
→ Click "Deploy"
```

### Step 3: Set Environment Variables

```
Vercel Dashboard
→ Settings → Environment Variables
→ Add:

BETTER_AUTH_SECRET=<your-32-char-secret>
BETTER_AUTH_URL=https://yourapp.vercel.app
DATABASE_URL=<your-neon-string>
DATABASE_URL_UNPOOLED=<your-neon-unpooled>
RESEND_API_KEY=<your-resend-key>
EMAIL_FROM=LearnDE <noreply@learnde.dev>
NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
```

### Step 4: Deploy

```
Vercel automatically deploys on git push
Monitor build at: https://vercel.com/your-project
```

**Verify deployment:**
```bash
# Visit your Vercel URL
https://learnde-xxxx.vercel.app

# Test sign-up flow
# Check Vercel logs for errors:
Deployments → Latest → Logs
```

---

## 🧪 Example Test Cases

### Test Case 1: Complete Sign-Up Flow
```
START: Visit /auth/register
STEP 1: Fill form (name, email, password)
STEP 2: Click "Create Account"
STEP 3: See role selection screen
STEP 4: Choose "Student"
STEP 5: Redirected to /dashboard
EXPECTED: Dashboard loads with user info
VERIFY: Name, email, role displayed
```

### Test Case 2: Sign-In After Sign-Out
```
START: Sign in with existing account
STEP 1: Visit /auth/login
STEP 2: Enter credentials
STEP 3: Click "Sign In"
STEP 4: See /dashboard
STEP 5: Click "Sign Out"
EXPECTED: Redirected to /auth/login
VERIFY: Session cookie deleted
```

### Test Case 3: Protected Route Access
```
START: Not logged in
STEP 1: Visit /dashboard
EXPECTED: Redirected to /auth/login
VERIFY: Can't access without session
```

### Test Case 4: Role-Based Access
```
START: Logged in as Student
STEP 1: Try to visit /staff
EXPECTED: Denied or redirected
VERIFY: Role checking works
```

---

## 🐛 Troubleshooting

### Issue: "BETTER_AUTH_SECRET is required"
```bash
# Solution: Add to .env.local
BETTER_AUTH_SECRET=<your-32-char-hex>

# Restart dev server:
npm run dev  # Ctrl+C first
```

### Issue: Database connection error
```bash
# Solution 1: Verify DATABASE_URL
echo $DATABASE_URL  # Should show your Neon string

# Solution 2: Check Neon status
https://console.neon.tech → Your Project → Status

# Solution 3: Migrate schema
npm run db:push
```

### Issue: "Session token not found" on login
```bash
# Check:
1. BETTER_AUTH_SECRET is set (min 32 chars)
2. Database is migrated (sessions table exists)
3. Browser cookies are enabled
4. No browser security restrictions

# Debug:
DevTools → Application → Cookies → http://localhost:3000
Should see: better-auth.session_token=...
```

### Issue: Sign-up succeeds but stuck on role selection
```bash
# Check:
1. /api/auth/set-role endpoint works
   curl -X POST http://localhost:3000/api/auth/set-role \
     -H "Content-Type: application/json" \
     -d '{"role": "student"}'

2. Check server logs for errors

3. Verify users table was migrated
   npm run db:studio → users table → Check columns
```

### Issue: Middleware blocking all routes
```typescript
// Check middleware.ts config:
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}

// Should allow:
- Static files (_next/*)
- Images (_next/image/*)
- Favicon
- Public folder

// If still blocking:
1. Restart dev server
2. Clear .next folder: rm -rf .next
3. Run: npm run dev
```

---

## 📚 Resources & Documentation

### Official Docs
- **Better Auth:** https://better-auth.com/docs
- **Next.js App Router:** https://nextjs.org/docs
- **Drizzle ORM:** https://orm.drizzle.team
- **Neon PostgreSQL:** https://neon.tech/docs
- **Vercel Deployment:** https://vercel.com/docs

### LearnDE Documentation
- **Main Guide:** `BETTERAUTH_SETUP.md` (300+ lines, comprehensive)
- **PLANNER.md:** Architecture and folder structure
- **DESIGN_GUIDE.md:** UI/UX specifications
- **README.md:** Quick start guide

### Code Examples in Repo
```bash
# Check these files for working examples:

lib/auth-better.ts
  ↳ Full BetterAuth configuration

lib/auth-utils.ts
  ↳ React hooks (useAuth, useCanAccess)

app/api/auth/get-session/route.ts
  ↳ How to fetch session

app/api/auth/set-role/route.ts
  ↳ How to update user role

app/(auth)/login/page.tsx
  ↳ Sign-in UI implementation

app/(auth)/register/page.tsx
  ↳ Sign-up + role selection UI
```

---

## ✅ Final Verification Checklist

Before considering implementation complete:

- [ ] `.env.local` created with all variables
- [ ] `npm run db:push` executed successfully
- [ ] No errors in `npm run dev`
- [ ] Can sign up at `/auth/register` ✓
- [ ] Can sign in at `/auth/login` ✓
- [ ] Role selection works ✓
- [ ] Redirected to `/dashboard` ✓
- [ ] Can access protected routes when logged in ✓
- [ ] Redirected to login when not authenticated ✓
- [ ] Session persists on page refresh ✓
- [ ] Sign out deletes session ✓
- [ ] Role-based access works (student ≠ staff) ✓

---

## 🎯 Next Phases

### Phase 1: Local Testing (Today)
- [ ] Complete this checklist
- [ ] Test all flows locally
- [ ] Verify database connectivity

### Phase 2: Production Ready (This Week)
- [ ] Deploy to Vercel
- [ ] Test sign-up/sign-in on production
- [ ] Set up email verification (optional)
- [ ] Monitor logs for errors

### Phase 3: Feature Enhancements (Next Week)
- [ ] Add OAuth (Google, GitHub)
- [ ] Email verification on signup
- [ ] Password reset flow
- [ ] Two-factor authentication
- [ ] Email notifications

---

## 📞 Support

If you encounter issues:

1. **Check server logs:** `npm run dev` terminal output
2. **Check browser console:** F12 → Console tab
3. **Check network requests:** F12 → Network tab → Filter by XHR
4. **Check Neon:** https://console.neon.tech → Logs
5. **Check Better Auth docs:** https://better-auth.com/docs/troubleshooting

---

**Status:** Ready to implement ✅  
**Time to complete:** ~45 minutes  
**Questions?** Reference `BETTERAUTH_SETUP.md` for detailed explanations

Last updated: May 14, 2026
