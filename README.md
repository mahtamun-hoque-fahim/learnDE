# LearnD.E.

Interactive Differential Equations course platform for CSE 2nd semester — read, quiz, get a human-verified certificate.

---

## Stack

- Next.js 16 App Router (TypeScript)
- Tailwind CSS
- Neon (PostgreSQL) + Drizzle ORM
- Custom JWT auth (jose) — students + staff
- Resend (transactional email)
- Vercel

---

## Prerequisites

- Node.js 18+
- npm
- Neon account + database
- Resend account (for email)

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/mahtamun-hoque-fahim/learnDE.git
cd learnDE

# 2. Install
npm install

# 3. Env
cp .env.example .env.local
# Fill in values — see Env Vars below

# 4. Run
npm run dev
```

---

## Env Vars

```env
DATABASE_URL=postgresql://...           # Neon pooled connection string
JWT_SECRET=your-long-random-secret      # Shared for student + staff tokens
RESEND_API_KEY=re_xxxxxxxxxxxx          # Resend API key
EMAIL_FROM=LearnD.E. <noreply@...>      # Must match verified Resend domain
NEXT_PUBLIC_BASE_URL=https://...        # Public URL (used in email links)
ADMIN_SETUP_KEY=learnde-setup-2025      # Key for one-time setup endpoints
```

Full descriptions → `PLANNER.md` → Env Vars.

---

## Commands

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

---

## One-Time DB Setup (after first deploy)

```bash
# 1. Create tables
curl -X POST https://your-domain.vercel.app/api/admin/migrate \
  -H "x-setup-key: learnde-setup-2025"

# 2. Create first admin account
curl -X POST https://your-domain.vercel.app/api/admin/setup \
  -H "x-setup-key: learnde-setup-2025" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"you@email.com","password":"yourpassword","displayName":"Your Name"}'
```

Then go to `/staff` and log in.

---

## Deploy

Pushes to `main` auto-deploy on Vercel. Set all env vars in Vercel dashboard (Production + Preview).

---

## Folder Structure

```
app/          # Pages + API routes
lib/          # DB client, auth helpers, quiz data, email
public/       # Static assets
```

Full architecture + DB schema → `PLANNER.md`.
