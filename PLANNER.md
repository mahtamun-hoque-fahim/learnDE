# PLANNER.md — dy/dx Learn

> Living technical document. Updated whenever `update repo` is triggered.
> Last updated: 2026-05-13

---

## Overview

| Field | Value |
|---|---|
| Project | dy/dx Learn (formerly LearnD.E.) |
| Purpose | Interactive Differential Equations learning platform for CSE 2nd semester students, based on H.K. Dass §3.9–3.11 |
| Target User | University students (primarily CSE), course moderators, admins |
| Key Value | Learn → Quiz → Get certified, with human-verified certificates and personally written quotes |
| Status | 🔄 In Progress |
| Repo | `https://github.com/mahtamun-hoque-fahim/learnDE` |
| Live URL | `https://learn-differential-equation.vercel.app` |

---

## Architecture

**Stack:**
- Framework: Next.js 16 App Router (TypeScript)
- Styling: Tailwind CSS + CSS custom properties (no Tailwind component classes in layouts)
- Database: Neon (PostgreSQL) via Drizzle ORM + `@neondatabase/serverless`
- Auth: Custom JWT (jose) — student cookie `auth-token` (7d), staff cookie `staff-token` (8h)
- Email: Resend (lazy-instantiated to avoid build-time crash)
- Math rendering: KaTeX (CDN via `<Script strategy="beforeInteractive">`)
- Globe: `d3-geo` + `topojson-client` + world-atlas CDN (animated geo-wireframe)
- Deployment: Vercel

**Folder Structure:**
```
/
├── app/
│   ├── (auth)/              # Login + Register pages (split-pane layout)
│   ├── admin/               # Redirects → /staff
│   ├── api/
│   │   ├── auth/            # Student login, logout, register, session
│   │   ├── admin/           # migrate (DB setup), setup (first admin)
│   │   ├── staff/           # auth, submissions (CRUD), moderators (CRUD)
│   │   ├── submissions/     # Student: submit form + get own status
│   │   ├── certificate/     # Backwards-compat cert lookup
│   │   ├── quiz/            # Submit quiz answers, record attempt
│   │   ├── progress/        # Mark chapter as read
│   │   ├── bonus/           # Static bonus problems (AI-generated)
│   │   └── cheatsheet/      # Static cheat sheet
│   ├── certificate/         # Both certificates (completion + quote) — premium design
│   ├── cheatsheet/          # Cheat sheet page
│   ├── components/
│   │   ├── Globe.tsx        # d3-geo animated globe (Bangladesh highlighted)
│   │   └── Logo.tsx         # LogoFull (landing) + LogoMark (inner pages)
│   ├── curriculum/          # Course overview (was /learn) — ChapterList client component
│   │   ├── page.tsx         # Server component (data fetch)
│   │   └── ChapterList.tsx  # Client component (LaTeX summaries, progress bar)
│   ├── dashboard/           # Student dashboard
│   ├── faq/                 # FAQ page (17 questions, 5 categories, accordion)
│   ├── learn/
│   │   ├── page.tsx         # Redirects → /curriculum
│   │   └── [chapter]/       # Chapter reading page (3-col: TOC + article + rail)
│   ├── profile/             # Certificate registration form
│   ├── quiz/[chapter]/      # Quiz page (10 daily-randomized questions, KaTeX rendered)
│   ├── staff/               # Unified admin + moderator dashboard
│   ├── layout.tsx           # Plus Jakarta Sans + JetBrains Mono, KaTeX script
│   └── page.tsx             # Landing page (globe, hero, chapter table, FAQ/CTA)
├── lib/
│   ├── auth.ts              # Student JWT helpers
│   ├── staff-auth.ts        # Staff JWT helpers
│   ├── email.ts             # Resend email (lazy init)
│   ├── chapters.ts          # Chapter metadata array (8 chapters)
│   ├── quiz-data.ts         # 80 questions (10/ch), getDailyQuestions()
│   ├── bonus-data.ts        # 5 bonus problems per chapter (static)
│   └── db/
│       ├── index.ts         # getDb() lazy Neon/Drizzle client
│       └── schema.ts        # All table definitions
├── public/
│   └── logo.svg             # Custom dy/dx SVG logo mark
├── .env.example             # ✅ Added
├── PLANNER.md
├── DESIGN_GUIDE.md
└── README.md
```

---

## User Flows

### Flow 1: Student — Learning
1. Land at `/` → hero with animated globe → click "Get Started"
2. Register at `/register` → login at `/login` → `auth-token` cookie set
3. `/curriculum` shows all 8 chapters with LaTeX summaries + Read/Quiz buttons
4. Read chapter at `/learn/[chapter]` → 3-column layout (TOC + article + progress rail)
5. Take quiz at `/quiz/[chapter]` → 10 questions (seeded daily) → KaTeX-rendered → score saved
6. Repeat for all 8 chapters

### Flow 2: Student — Certificate Application
1. All 8 chapters read + all 8 quizzes passed → dashboard: "Course Complete!"
2. Click → `/profile` — fill registration form (name, university, dept, batch, gender, phone, student ID, note)
3. Submit → status: **pending** → all active staff emailed
4. Dashboard shows status: Pending / Under Review / Approved / Rejected
5. Rejected → student sees reason → can resubmit
6. Approved → two premium certificates appear at `/certificate`

### Flow 3: Student — Certificate View
1. `/certificate` shows two documents:
   - **① Certificate of Completion** — gradient name, corner marks, glowing divider, seal
   - **② Personal Quote Certificate** — custom quote + author written by moderator
2. Both print-ready + Download PDF button

### Flow 4: Moderator — Review Submission
1. `/staff` → login → stat cards (Pending / Under Review / Approved / Rejected)
2. Click submission row → Review Modal
3. Actions: Mark Under Review → Approve (write quote + author) → Reject (write reason)
4. Approve: certificate row created, student emailed
5. Reject: student emailed with reason

### Flow 5: Admin — Staff Management
1. Same `/staff` login → additional **Staff** tab
2. View, add, suspend, restore, promote, demote staff members

---

## DB Schema

```ts
// users — student accounts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),     // bcrypt hashed
  studentId: text('student_id'),
  createdAt: timestamp('created_at').defaultNow(),
})

// staff_users — admins + moderators
export const staffUsers = pgTable('staff_users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('moderator'),  // 'admin' | 'moderator'
  displayName: text('display_name').notNull(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

// cert_submissions — student certificate applications
// Status: pending → under_review → approved | rejected
export const certSubmissions = pgTable('cert_submissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  displayName: text('display_name').notNull(),
  university: text('university').notNull(),
  department: text('department').notNull(),
  batch: text('batch'),
  gender: text('gender').notNull(),
  phone: text('phone'),
  studentIdNo: text('student_id_no'),
  note: text('note'),
  status: text('status').notNull().default('pending'),
  reviewedBy: integer('reviewed_by').references(() => staffUsers.id),
  reviewNote: text('review_note'),
  reviewedAt: timestamp('reviewed_at'),
  quoteText: text('quote_text'),
  quoteAuthor: text('quote_author'),
  submittedAt: timestamp('submitted_at').defaultNow(),
})

// progress — chapter read tracking
export const progress = pgTable('progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  chapterSlug: text('chapter_slug').notNull(),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
})

// quiz_attempts — quiz submissions
export const quizAttempts = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  chapterSlug: text('chapter_slug').notNull(),
  score: integer('score').notNull(),
  total: integer('total').notNull(),
  passed: boolean('passed').default(false),
  answers: json('answers'),
  attemptedAt: timestamp('attempted_at').defaultNow(),
})

// certificates — created only on moderator approval
export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  submissionId: integer('submission_id').notNull().references(() => certSubmissions.id),
  certificateId: text('certificate_id').notNull().unique(),  // LDE-2025-XXXXXXXX
  issuedAt: timestamp('issued_at').defaultNow(),
  profileSnapshot: json('profile_snapshot'),
  quoteText: text('quote_text'),
  quoteAuthor: text('quote_author'),
})
```

---

## API Routes

### Student Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register student |
| POST | `/api/auth/login` | Public | Login, set `auth-token` |
| GET | `/api/auth/logout` | Public | Clear `auth-token` |
| GET | `/api/auth/session` | Public | Return session user |

### Student Learning
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/progress` | Student | Mark chapter read |
| POST | `/api/quiz` | Student | Submit answers, record attempt |
| GET | `/api/bonus` | Public | Static bonus problems |
| GET | `/api/cheatsheet` | Public | Static cheat sheet content |

### Student Certificate
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/submissions` | Student | Own submission + certificate data |
| POST | `/api/submissions` | Student | Submit form (or resubmit if rejected) |
| GET | `/api/certificate` | Student | Backwards-compat cert lookup |

### Staff Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/staff/auth` | Public | Staff login, set `staff-token` (8h) |
| DELETE | `/api/staff/auth` | Public | Staff logout |

### Staff — Submissions
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/staff/submissions` | Staff | All submissions with coursework stats |
| PATCH | `/api/staff/submissions` | Staff | `action`: `approve` / `reject` / `under_review` |

### Staff — Moderator Management
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/staff/moderators` | Admin | List all staff |
| POST | `/api/staff/moderators` | Admin | Add staff member |
| PATCH | `/api/staff/moderators` | Admin | Toggle active / change role |

### One-Time Setup
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/admin/migrate` | `x-setup-key` header | Create all DB tables |
| POST | `/api/admin/setup` | `x-setup-key` header | Create first admin account |

---

## Env Vars

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | ✅ | Neon pooled connection string | `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | ✅ | Shared secret for student + staff JWTs | `a-long-random-secret-min-32-chars` |
| `RESEND_API_KEY` | ✅ | Resend API key for emails | `re_xxxxxxxxxxxx` |
| `EMAIL_FROM` | ⚠️ Optional | Sender name + address | `dy/dx Learn <noreply@learnde.dev>` |
| `NEXT_PUBLIC_BASE_URL` | ⚠️ Optional | Public URL for email links | `https://learn-differential-equation.vercel.app` |
| `ADMIN_SETUP_KEY` | ⚠️ Optional | Key for migrate + setup endpoints | `learnde-setup-2025` |

---

## Phases & Timeline

| Phase | Name | Status | Key Tasks |
|---|---|---|---|
| 1 | Foundation | ✅ | Repo, DB, Drizzle, base layout, fonts |
| 2 | Learning System | ✅ | 8 chapters, reading pages, progress tracking |
| 3 | Quiz System | ✅ | 80 questions (10/ch), daily randomization, pass/fail (60%) |
| 4 | Bonus + Cheat Sheet | ✅ | 5 bonus problems/chapter, static cheat sheet |
| 5 | Student Auth | ✅ | Register, login, JWT cookies, logout |
| 6 | Certificate Flow | ✅ | Registration form, submission lifecycle, dual cert display |
| 7 | Staff System | ✅ | Moderator + admin roles, review modal, quote writing |
| 8 | Email | ✅ | Resend: new submission alerts, approval/rejection emails |
| 9 | Build Fixes | ✅ | Lazy Resend init, renamed export fix, Vercel build passing |
| 10 | V2 Design Overhaul | ✅ | New brand (dy/dx), fonts, colors, globe, auth split-pane, 3-col reader, premium cert |
| 11 | Math Rendering | ✅ | KaTeX fix (Script tag), per-element KatexBlock/KatexInline, quiz unicode→LaTeX converter |
| 12 | Navigation & Routes | ✅ | Logo variants, /curriculum route, FAQ page, chapter card upgrades |
| 13 | Polish & Features | 🔄 | See Next Steps |

---

## Next Steps

> Ordered by priority. Rewritten fresh on each `update repo`.

1. [ ] Add Next.js middleware to protect `/dashboard`, `/profile`, `/certificate` (redirect if no session)
2. [ ] Send "under review" email when submission status changes from pending
3. [ ] Student quiz history page — show past attempts + scores per chapter
4. [ ] Let moderator re-edit quote after approval
5. [ ] Certificate PDF export (html2canvas or Puppeteer API route)
6. [ ] Staff submissions pagination
7. [ ] Add `DATABASE_URL_UNPOOLED` for Drizzle migrations

---

## Notes / Decisions Log

- **2025-05-10** — Merged `admin_users` into `staff_users` with `role` column
- **2025-05-10** — Removed pre-set quote bank. Moderators write unique quotes per student
- **2025-05-10** — Resend lazy init fix: moved `new Resend()` inside each function
- **2025-05-10** — Quiz export rename: `getQuiz` → `getDailyQuestions`
- **2025-05-10** — Rejected submissions reuse same DB row (reset to pending)
- **2025-05-10** — `profileSnapshot` stored in `certificates` at approval time
- **2026-05-13** — Brand renamed: LearnD.E. → dy/dx Learn. Custom SVG logo (public/logo.svg)
- **2026-05-13** — KaTeX was CSS-only (JS missing). Fixed by adding `<Script strategy="beforeInteractive">`
- **2026-05-13** — Replaced `data-math + contentRef` batch render with per-element `KatexBlock`/`KatexInline` components to eliminate empty-box artifacts
- **2026-05-13** — `/learn` (course overview) renamed to `/curriculum`; old `/learn` redirects. Individual chapter pages remain at `/learn/[chapter]`
- **2026-05-13** — Globe: real geo-wireframe via d3-geo + world-atlas. Bangladesh (ISO 50) highlighted with mint glow
- **2026-05-13** — Quiz math: two-strategy system — `injectMath()` for question sentences, `processOption()` for pure-math answers
- **2026-05-13** — FAQ page: 17 questions across 5 categories with accordion UI
