# dy/dx Learn

Interactive Differential Equations course for CSE 2nd semester — read chapters, take quizzes, earn a human-verified certificate.

---

## Stack

- Next.js 16 App Router (TypeScript)
- Tailwind CSS + CSS custom properties
- Neon (PostgreSQL) + Drizzle ORM
- Custom JWT auth (jose) — no Clerk/Auth.js
- Resend (email)
- KaTeX (math rendering, CDN)
- d3-geo + topojson-client (globe)
- Vercel (deployment)

---

## Prerequisites

- Node.js 20+
- A Neon database (free tier works)
- A Resend account (free tier works)

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/mahtamun-hoque-fahim/learnDE.git
cd learnDE

# 2. Install
npm install

# 3. Copy env
cp .env.example .env.local
# Fill in all values in .env.local

# 4. Run DB migrations (first time only)
curl -X POST http://localhost:3000/api/admin/migrate \
  -H "x-setup-key: YOUR_ADMIN_SETUP_KEY"

# 5. Create first admin (first time only)
curl -X POST http://localhost:3000/api/admin/setup \
  -H "x-setup-key: YOUR_ADMIN_SETUP_KEY" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"yourpassword","displayName":"Admin"}'

# 6. Start dev server
npm run dev
```

---

## Env Vars

See `PLANNER.md → Env Vars` for full descriptions.

```
DATABASE_URL=
JWT_SECRET=
RESEND_API_KEY=
EMAIL_FROM=          # optional
NEXT_PUBLIC_BASE_URL= # optional
ADMIN_SETUP_KEY=     # optional, used for /api/admin/* endpoints
```

---

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

---

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/curriculum` | Course overview (chapter list) |
| `/learn/[chapter]` | Chapter reading page |
| `/quiz/[chapter]` | Chapter quiz |
| `/faq` | FAQ page |
| `/login` `/register` | Student auth |
| `/dashboard` | Student progress |
| `/profile` | Certificate application form |
| `/certificate` | Certificate display |
| `/staff` | Moderator + admin panel |

---

## Folder Structure

```
app/           Next.js App Router pages + API routes
  components/  Globe.tsx, Logo.tsx
  curriculum/  Course overview (was /learn)
  faq/         FAQ page
  learn/       Individual chapter pages + redirect
  quiz/        Quiz pages
lib/           Auth helpers, DB client, chapters, quiz data
public/        logo.svg
```

For API routes, DB schema, and architecture details → `PLANNER.md`
For design tokens and component specs → `DESIGN_GUIDE.md`
