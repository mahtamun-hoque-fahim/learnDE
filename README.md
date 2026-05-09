# LearnD.E.

Interactive differential equations learning platform for BSc CSE 2nd semester.

## Stack
- Next.js 16 (App Router), TypeScript
- Tailwind CSS, Syne + Onest fonts, KaTeX
- Neon (PostgreSQL), Drizzle ORM
- JWT auth (jose), bcryptjs
- Claude API (claude-sonnet-4-20250514) for AI features
- Vercel deployment

## Prerequisites
- Node.js 18+
- Neon account (neon.tech)
- Vercel account

## Local Setup
```bash
git clone https://github.com/mahtamun-hoque-fahim/learnD.E.
cd learnD.E.
npm install
cp .env.example .env.local   # fill in your values
npx drizzle-kit push         # run migrations
npm run dev
```

## Env Vars
```
DATABASE_URL=
DATABASE_URL_UNPOOLED=
JWT_SECRET=
NEXT_PUBLIC_APP_URL=
```
See PLANNER.md for full description.

## Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npx drizzle-kit push    # Apply DB schema
npx drizzle-kit studio  # Open Drizzle Studio
```

## Deploy
1. Push to GitHub main
2. Connect repo in Vercel dashboard
3. Add env vars in Vercel Settings → Environment Variables
4. Deploy — migrations auto-run via drizzle-kit push if you run it against production
