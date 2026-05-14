# 🔐 Environment Variables Guide

**Complete guide for setting up environment variables for LearnDE**

---

## 📋 Required Environment Variables

Create a `.env.local` file in the project root with these variables:

```bash
# ═══════════════════════════════════════════════════════════════
# DATABASE (Neon PostgreSQL)
# ═══════════════════════════════════════════════════════════════

# Pooled connection (for API routes)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Direct connection (for migrations)
DATABASE_URL_UNPOOLED="postgresql://user:password@host/database?sslmode=require"

# ═══════════════════════════════════════════════════════════════
# BETTER AUTH
# ═══════════════════════════════════════════════════════════════

# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-32-character-secret-key-here"

# Base URL (change for production)
BETTER_AUTH_URL="http://localhost:3000"

# ═══════════════════════════════════════════════════════════════
# EMAIL (Resend)
# ═══════════════════════════════════════════════════════════════

# Get from: https://resend.com/api-keys
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"

# Email sender address
EMAIL_FROM="LearnD.E. <noreply@learnde.dev>"

# ═══════════════════════════════════════════════════════════════
# OPTIONAL: PUBLIC VARIABLES
# ═══════════════════════════════════════════════════════════════

# Base URL for links in emails
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Neon Database

1. Go to https://console.neon.tech
2. Create new project
3. Copy both connection strings:
   - **Pooled** → `DATABASE_URL`
   - **Direct** → `DATABASE_URL_UNPOOLED`

**Example**:
```bash
DATABASE_URL="postgresql://user:pass@ep-xyz-123.region.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://user:pass@ep-xyz-123.region.aws.neon.tech/neondb?sslmode=require"
```

### Step 2: Generate Auth Secret

Run in terminal:
```bash
openssl rand -base64 32
```

Copy output to `BETTER_AUTH_SECRET`

**Example**:
```bash
BETTER_AUTH_SECRET="Kx8pQ2rT5wY9zA3bC6dE7fH0iJ1kL4mN8oP9qR2sT5uV"
```

### Step 3: Set Up Resend (Email)

1. Go to https://resend.com
2. Sign up / login
3. Go to **API Keys** → **Create API Key**
4. Copy key to `RESEND_API_KEY`

**Example**:
```bash
RESEND_API_KEY="re_abc123xyz789_abcdefghijklmnop"
```

---

## 🔍 Variable Details

### DATABASE_URL vs DATABASE_URL_UNPOOLED

**DATABASE_URL (Pooled)**:
- Used by: API routes, runtime queries
- Connection pooling: ✅ Yes
- Max connections: ~100
- Best for: Production traffic

**DATABASE_URL_UNPOOLED (Direct)**:
- Used by: Migrations, Drizzle Studio
- Connection pooling: ❌ No
- Max connections: 1-5
- Best for: Schema changes

Both URLs point to same database, just different connection methods.

### BETTER_AUTH_SECRET

- **Purpose**: Encrypts session tokens
- **Length**: 32+ characters
- **Format**: Base64 string
- **Security**: ⚠️ Never commit to git!

**Generate securely**:
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online
# https://generate-secret.vercel.app/32
```

### BETTER_AUTH_URL

- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`

Used for:
- Callback URLs
- Cookie domains
- CSRF protection

### RESEND_API_KEY

Get from https://resend.com/api-keys

**Test mode vs Live mode**:
- Test: Emails only go to verified addresses
- Live: Emails sent to anyone (requires domain verification)

**For development**: Test mode is fine

### EMAIL_FROM

Must be:
- Format: `Name <email@domain.com>`
- Domain: Verified in Resend (or use `onboarding@resend.dev` for testing)

**Development**:
```bash
EMAIL_FROM="LearnD.E. <onboarding@resend.dev>"
```

**Production**:
```bash
EMAIL_FROM="LearnD.E. <noreply@learnde.dev>"
```

---

## ✅ Verify Setup

### 1. Check .env.local exists

```bash
# Should show your file
ls -la .env.local

# Should NOT be tracked by git
git status | grep .env.local
# (should show nothing)
```

### 2. Test database connection

```bash
# Should connect and show tables
npm run db:studio
```

### 3. Test environment in code

Create `test-env.js`:
```js
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing')
console.log('BETTER_AUTH_SECRET:', process.env.BETTER_AUTH_SECRET ? '✅ Set' : '❌ Missing')
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing')
```

Run:
```bash
node test-env.js
```

Should show all ✅

---

## 🚨 Common Issues

### Issue: "connect ECONNREFUSED"

**Cause**: DATABASE_URL incorrect or Neon database not accessible

**Fix**:
1. Check URL format: `postgresql://user:pass@host/db`
2. Verify Neon project is active (not paused)
3. Check firewall/network allows PostgreSQL (port 5432)

### Issue: "Invalid session token"

**Cause**: BETTER_AUTH_SECRET changed or missing

**Fix**:
1. Ensure BETTER_AUTH_SECRET is set
2. If changed, all users must re-login
3. Clear cookies: `document.cookie.split(";").forEach(c => document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"))`

### Issue: "Resend API key invalid"

**Cause**: Wrong API key or expired key

**Fix**:
1. Go to https://resend.com/api-keys
2. Verify key shows "Active"
3. If expired, create new key
4. Ensure key starts with `re_`

### Issue: "Email not sending"

**Cause**: Sender address not verified

**Fix for development**:
```bash
# Use Resend's test address
EMAIL_FROM="LearnD.E. <onboarding@resend.dev>"
```

**Fix for production**:
1. Add domain in Resend dashboard
2. Add DNS records (SPF, DKIM)
3. Verify domain
4. Use your verified domain

---

## 🔒 Security Best Practices

### DO ✅

- ✅ Keep `.env.local` out of git (in `.gitignore`)
- ✅ Use different secrets for dev/staging/prod
- ✅ Rotate secrets periodically (every 90 days)
- ✅ Use environment variables in hosting platform
- ✅ Store secrets in password manager

### DON'T ❌

- ❌ Commit `.env.local` to git
- ❌ Share secrets in Slack/Discord/email
- ❌ Use same secrets across environments
- ❌ Hardcode secrets in code
- ❌ Log secrets to console

---

## 🌐 Production Setup

### Vercel

1. Go to project settings
2. Navigate to **Environment Variables**
3. Add each variable:
   - Name: `DATABASE_URL`
   - Value: `postgresql://...`
   - Environment: Production, Preview, Development

4. Redeploy for changes to take effect

### Railway / Render

Similar process:
1. Project settings → Environment
2. Add variables
3. Restart service

---

## 📁 File Structure

```
learnDE/
├── .env.local              ← Your secrets (gitignored)
├── .env.example            ← Template (committed)
├── .gitignore              ← Must include .env.local
└── lib/
    ├── db/index.ts         ← Uses DATABASE_URL
    ├── auth-better.ts      ← Uses BETTER_AUTH_SECRET
    └── email.ts            ← Uses RESEND_API_KEY
```

---

## 📋 Checklist

Before running the app:

- [ ] `.env.local` file created
- [ ] All 5 required variables set
- [ ] DATABASE_URL connects to Neon
- [ ] BETTER_AUTH_SECRET is 32+ chars
- [ ] RESEND_API_KEY starts with `re_`
- [ ] `.gitignore` includes `.env.local`
- [ ] Test database: `npm run db:studio`
- [ ] No secrets in git history

---

## 🎯 Ready to Go

Once all variables are set:

```bash
# 1. Push schema to database
npm run db:push

# 2. Seed sample data
npm run db:seed

# 3. Start dev server
npm run dev

# 4. Test login
# Student: ananya@example.com / password123
```

---

**Environment ready!** 🎉
