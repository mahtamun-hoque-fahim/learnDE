# 🔐 Add Environment Variables to Vercel

## Step 1: Get Your Clerk Keys

1. Go to **https://dashboard.clerk.com**
2. Navigate to **API Keys** (top menu)
3. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
   - `CLERK_SECRET_KEY` (starts with `sk_`)

## Step 2: Add to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to **https://vercel.com/dashboard**
2. Select your **learnDE** project
3. Click **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value | Scope |
|------|-------|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` | Production, Preview, Development |
| `CLERK_SECRET_KEY` | `sk_test_...` | Production, Preview, Development |
| `DATABASE_URL` | Your Neon connection string | Production, Preview, Development |
| `DATABASE_URL_UNPOOLED` | Your Neon unpooled connection | Production, Preview, Development |
| `RESEND_API_KEY` | Your Resend API key | Production, Preview, Development |

> **Important**: Make sure `NEXT_PUBLIC_*` variables have scope set to all environments

5. Click **Save**

### Option B: Via Vercel CLI

```bash
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# Paste your pk_test_... key when prompted

vercel env add CLERK_SECRET_KEY
# Paste your sk_test_... key when prompted
```

## Step 3: Redeploy

After adding env vars:

```bash
# Option 1: Push to main branch
git push origin main

# Option 2: Manual redeploy on Vercel dashboard
# Go to Deployments → Click on latest → Click "Redeploy"
```

## ✅ Verification

After redeploy completes successfully:

1. Visit your Vercel deployment URL
2. Should NOT see "Missing publishableKey" error
3. Sign up flow should work
4. Role selection should work

---

## 🚨 Why This Matters

During Vercel's build process:
- Next.js tries to pre-render all pages
- ClerkProvider initializes without env vars
- Clerk throws error: "Missing publishableKey"
- Build fails ❌

Once env vars are set:
- Clerk can initialize properly
- Build succeeds ✅
- App deploys to production
