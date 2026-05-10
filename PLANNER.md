# PLANNER.md — LearnD.E.

> Living technical document. Updated whenever `update repo` is triggered.
> Last updated: 2025-05-10

---

## Overview

| Field | Value |
|---|---|
| Project | LearnD.E. |
| Purpose | Interactive Differential Equations learning platform for CSE 2nd semester students, based on H.K. Dass §3.9–3.11 |
| Target User | University students (primarily CSE), course moderators, and admins |
| Key Value | Learn → Quiz → Get certified, with human-verified certificates and personally written quotes |
| Status | 🔄 In Progress |
| Repo | `https://github.com/mahtamun-hoque-fahim/learnDE` |
| Live URL | `https://learnde.vercel.app` |

---

## Architecture

**Stack:**
- Framework: Next.js 16 App Router (TypeScript)
- Styling: Tailwind CSS
- Database: Neon (PostgreSQL) via Drizzle ORM + `@neondatabase/serverless`
- Auth: Custom JWT (jose) — student cookie `auth-token` (7d), staff cookie `staff-token` (8h)
- Email: Resend (lazy-instantiated to avoid build-time crash)
- Math rendering: KaTeX (CDN)
- Deployment: Vercel

**Folder Structure:**
```
/
├── app/
│   ├── (auth)/              # Login + Register pages
│   ├── admin/               # Redirects → /staff
│   ├── api/
│   │   ├── auth/            # Student login, logout, register, session
│   │   ├── admin/           # migrate (DB setup), setup (first admin)
│   │   ├── staff/           # auth, submissions (CRUD), moderators (CRUD)
│   │   ├── submissions/     # Student: submit form + get own status
│   │   ├── certificate/     # Backwards-compat cert lookup
│   │   ├── quiz/            # Submit quiz answers, record attempt
│   │   ├── progress/        # Mark chapter as read
│   │   ├── bonus/           # Static bonus problems
│   │   └── cheatsheet/      # Static cheat sheet
│   ├── certificate/         # Both certificates (completion + quote)
│   ├── cheatsheet/          # Cheat sheet page
│   ├── dashboard/           # Student dashboard
│   ├── learn/[chapter]/     # Chapter reading page
│   ├── learn/               # Chapter list
│   ├── profile/             # Certificate registration form
│   ├── quiz/[chapter]/      # Quiz page (10 daily-randomized questions)
│   ├── staff/               # Unified admin + moderator dashboard
│   ├── layout.tsx
│   └── page.tsx             # Landing page
├── lib/
│   ├── auth.ts              # Student JWT helpers
│   ├── staff-auth.ts        # Staff JWT helpers
│   ├── email.ts             # Resend email (lazy init)
│   ├── chapters.ts          # Chapter metadata array
│   ├── quiz-data.ts         # 80 questions (10/ch), getDailyQuestions()
│   ├── bonus-data.ts        # 5 bonus problems per chapter (static)
│   └── db/
│       ├── index.ts         # getDb() lazy Neon/Drizzle client
│       └── schema.ts        # All table definitions
├── PLANNER.md
├── DESIGN_GUIDE.md
└── README.md
```

---

## User Flows

### Flow 1: Student — Learning
1. Register at `/register` → login at `/login` → `auth-token` cookie set
2. `/dashboard` shows chapter progress + quiz progress
3. Read chapter at `/learn/[chapter]` → marked complete
4. Take quiz at `/quiz/[chapter]` → 10 questions (seeded daily) → score saved
5. Repeat for all 8 chapters

### Flow 2: Student — Certificate Application
1. All 8 chapters read + all 8 quizzes passed → dashboard: "Course Complete!"
2. Click → `/profile` — fill registration form (name, university, dept, batch, gender, phone, student ID, note)
3. Submit → status: **pending** → all active staff emailed
4. Dashboard shows status: Pending / Under Review / Approved / Rejected
5. Rejected → student sees reason → can resubmit
6. Approved → two certificate cards appear on dashboard

### Flow 3: Student — Certificate View
1. `/certificate` shows two documents:
   - **① Certificate of Completion** — name, university, dept, batch, cert ID, date
   - **② Personal Quote Certificate** — quote personally written by moderator
2. Both print-ready (watermark, corner decorations)

### Flow 4: Moderator — Review Submission
1. `/staff` → login → sees stat cards (Pending / Under Review / Approved / Rejected)
2. Click submission row → Review Modal
3. Modal shows: student info, coursework stats (N/8 read, N/8 passed), student's note
4. Actions: Mark Under Review → Approve (write quote + author) → Reject (write reason)
5. Approve: certificate row created, student emailed
6. Reject: student emailed with reason

### Flow 5: Admin — Staff Management
1. Same `/staff` login → additional **Staff** tab visible
2. View all moderators/admins
3. Add new staff (username, email, password, display name, role)
4. Suspend / Restore / Promote / Demote any staff member

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
  gender: text('gender').notNull(),          // 'male' | 'female' | 'other'
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
  profileSnapshot: json('profile_snapshot'),  // student data at approval time
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
| POST | `/api/submissions` | Student | Submit registration form (or resubmit if rejected) |
| GET | `/api/certificate` | Student | Backwards-compat cert lookup |

### Staff Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/staff/auth` | Public | Staff login, set `staff-token` (8h) |
| DELETE | `/api/staff/auth` | Public | Staff logout |

### Staff — Submissions
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/staff/submissions` | Staff | All submissions, enriched with coursework stats |
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
| POST | `/api/admin/migrate` | `x-setup-key` header | Create all new DB tables |
| POST | `/api/admin/setup` | `x-setup-key` header | Create first admin account |

---

## Env Vars

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | ✅ | Neon pooled connection string | `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | ✅ | Shared secret for student + staff JWTs | `a-long-random-secret` |
| `RESEND_API_KEY` | ✅ | Resend API key for emails | `re_xxxxxxxxxxxx` |
| `EMAIL_FROM` | ⚠️ Optional | Sender name + address (must match Resend domain) | `LearnD.E. <noreply@learnde.dev>` |
| `NEXT_PUBLIC_BASE_URL` | ⚠️ Optional | Public URL for email links | `https://learnde.vercel.app` |
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
| 10 | Polish & Features | 🔄 | See Next Steps |

---

## Next Steps

> Ordered by priority. Rewritten fresh on each `update repo`.

1. [ ] Add `.env.example` to repo root
2. [ ] Fix `next.config.ts` — remove deprecated `eslint` key causing build warnings
3. [ ] Add Next.js middleware to protect `/dashboard`, `/profile`, `/certificate` (redirect if no session)
4. [ ] Let moderator update quote after approval (reopen flow)
5. [ ] Send "under review" email to student when status changes from pending
6. [ ] Student quiz history page — show past attempts + scores per chapter
7. [ ] Certificate PDF export (html2canvas or Puppeteer API route)
8. [ ] Pagination for staff submissions list
9. [ ] Add `DATABASE_URL_UNPOOLED` for Drizzle migrations

---

## Notes / Decisions Log

- **2025-05-10** — Merged `admin_users` into `staff_users` with `role` column — one login page, one cookie, two roles (admin/moderator)
- **2025-05-10** — Removed pre-set quote bank. Moderators now write a unique personal quote per student at review time
- **2025-05-10** — Resend lazy init fix: `new Resend()` was running at module load → crashed Next.js build. Moved inside each function
- **2025-05-10** — Quiz export rename bug: `getQuiz` → `getDailyQuestions` wasn't updated in quiz API route → build error. Fixed in hotfix
- **2025-05-10** — Rejected submissions reuse same DB row (reset to pending) — students aren't permanently blocked
- **2025-05-10** — `profileSnapshot` stored in `certificates` row at approval time — certificate stays unchanged if student later edits their profile
