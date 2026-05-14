# LearnDE

Interactive Differential Equations learning platform for university CSE students.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS 4
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Auth**: Better Auth (self-hosted)
- **Email**: Resend
- **Deployment**: Vercel

---

## Prerequisites

- Node.js 20+ and npm
- Neon PostgreSQL database (free tier works)
- Resend account for email (optional for local dev)

---

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/mahtamun-hoque-fahim/learnDE.git
cd learnDE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env.local`:

```bash
# Database (get from Neon dashboard)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://user:pass@host/db?sslmode=require"

# Auth (generate secret)
BETTER_AUTH_SECRET="your-32-char-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# Email (get from Resend)
RESEND_API_KEY="re_xxxxxxxxxx"
EMAIL_FROM="LearnD.E. <onboarding@resend.dev>"

# Optional
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**Generate secret**:
```bash
openssl rand -base64 32
```

**Full setup guide**: See `ENV_SETUP_GUIDE.md`

### 4. Database Setup

```bash
# Push schema to database
npm run db:push

# Seed with test data
npm run db:seed

# (Optional) Open Drizzle Studio
npm run db:studio
```

**Test accounts created**:
- Student: `ananya@example.com` / `password123`
- Staff: `rohit@example.com` / `password123`
- Admin: `admin@example.com` / `password123`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Database Commands

```bash
npm run db:generate    # Generate migration files
npm run db:push        # Push schema (dev, destructive)
npm run db:migrate     # Run migrations (production)
npm run db:studio      # Open Drizzle Studio
npm run db:seed        # Populate test data
```

---

## Build & Deploy

### Local Build

```bash
npm run build
npm run start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables

# Deploy to production
vercel --prod
```

**Environment variables needed in Vercel**:
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL` (set to production domain)
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `NEXT_PUBLIC_BASE_URL` (set to production domain)

---

## Folder Structure

```
learnDE/
├── app/
│   ├── (auth)/              # Auth pages
│   ├── dashboard/           # Student dashboard
│   ├── staff/               # Staff dashboard
│   ├── admin/               # Admin dashboard
│   ├── api/                 # API routes
│   │   ├── auth/            # Better Auth
│   │   ├── student/         # Student APIs
│   │   ├── staff/           # Staff APIs
│   │   └── admin/           # Admin APIs
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard components
│   │   └── ui/              # UI components
│   └── layout.tsx
├── lib/
│   ├── auth-better.ts       # Auth instance
│   ├── auth-utils.ts        # Auth hooks
│   ├── email.ts             # Email templates
│   └── db/                  # Database
│       ├── index.ts
│       └── schema.ts
├── scripts/
│   └── seed.ts              # Database seed
├── middleware.ts            # Route protection
└── drizzle.config.ts
```

---

## Project Documentation

- **PLANNER.md** — Full technical blueprint (architecture, user flows, DB schema, API routes, timeline)
- **DESIGN_GUIDE.md** — Design system spec (colors, typography, components)
- **ENV_SETUP_GUIDE.md** — Environment variables setup
- **PHASE_*.md** — Phase-by-phase development docs

---

## Development Workflow

### Making Changes

1. **Add new feature** → Update `PLANNER.md` if it affects architecture
2. **Add new component** → Document in `DESIGN_GUIDE.md` if reusable
3. **Add new env var** → Update `ENV_SETUP_GUIDE.md` + `.env.example`
4. **Database changes** → Run `npm run db:generate` + `npm run db:push`

### Testing

```bash
# Test locally with seed data
npm run dev

# Login as different roles:
# - Student: ananya@example.com
# - Staff: rohit@example.com
# - Admin: admin@example.com

# All use password: password123
```

### Committing

```bash
git add .
git commit -m "feat: add feature description"
git push origin main
```

---

## Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` is set correctly
- Verify Neon database is active (not paused)
- Test connection: `npm run db:studio`

### "Auth session not working"
- Ensure `BETTER_AUTH_SECRET` is set and 32+ chars
- Clear browser cookies and retry
- Check `BETTER_AUTH_URL` matches your dev URL

### "Build errors"
- Run `npm install` to ensure dependencies are installed
- Check `node_modules` exists
- TypeScript errors without `node_modules` are expected

### "Email not sending"
- Verify `RESEND_API_KEY` is correct
- Use `onboarding@resend.dev` for testing
- For production, verify your domain in Resend dashboard

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## License

MIT

---

## Contact

For questions or issues, contact project maintainer.

**Repository**: https://github.com/mahtamun-hoque-fahim/learnDE
