# LearnD.E. — PLANNER.md

## Project Overview
**Purpose:** Interactive differential equations learning platform for BSc (Hons.) CSE 2nd semester students  
**Target User:** University CSE students preparing for exams on H.K. Dass §3.9–3.11  
**Key Value:** Read chapters with rendered math → take quizzes → get AI bonus problems → earn certificate

---

## Architecture
**Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS · Neon (PostgreSQL) · Drizzle ORM · Vercel  
**Auth:** JWT cookies via `jose` (httpOnly, 7 days)  
**AI:** Claude API (`claude-sonnet-4-20250514`) for bonus problems and cheat sheet  
**Math:** KaTeX loaded from CDN, rendered client-side  
**Deployment:** Vercel (connect to GitHub)

### Folder Structure
```
app/
├── page.tsx              ← Landing page
├── layout.tsx            ← Root layout (fonts, KaTeX link)
├── globals.css
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── learn/
│   ├── page.tsx          ← Chapter list with progress
│   └── [chapter]/page.tsx ← Chapter reader
├── quiz/
│   └── [chapter]/page.tsx ← Quiz + bonus problems
├── dashboard/page.tsx    ← User progress dashboard
├── certificate/page.tsx  ← Certificate display
├── cheatsheet/page.tsx   ← AI cheat sheet generator
└── api/
    ├── auth/(login|register|logout|session)
    ├── progress/
    ├── quiz/
    ├── bonus/            ← Claude API → 3 bonus problems
    ├── certificate/
    └── cheatsheet/       ← Claude API → quick reference
lib/
├── auth.ts               ← signToken, verifyToken, getSession
├── chapters.ts           ← CHAPTERS data (8 chapters, all content)
├── quiz-data.ts          ← QUIZ_QUESTIONS (5 per chapter)
└── db/
    ├── index.ts          ← Edge-compatible Neon connection
    └── schema.ts         ← users, progress, quizAttempts, certificates
```

---

## User Flows

### Guest user
1. Land on homepage → see 8 chapters listed
2. Click any chapter → read full content with rendered math, expandable examples
3. Click "Take quiz" → answer 5 MCQs → see score (not saved)
4. No certificate available (must sign in)

### Signed-in user
1. Register/Login → redirected to Dashboard
2. Dashboard shows per-chapter read + quiz status
3. Read chapter → click "Mark as read" → saved to DB
4. Take quiz → submit → score saved; if passed, unlock bonus problems (Claude-generated)
5. After all 8 read + all 8 passed → Certificate page becomes available
6. Certificate issued with unique ID and date

---

## DB Schema (Drizzle/Neon)

### users
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| name | text | |
| email | text unique | |
| password | text | bcrypt hashed |
| student_id | text nullable | optional |
| created_at | timestamp | defaultNow() |

### progress
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| user_id | integer FK → users | |
| chapter_slug | text | e.g. "linear-de" |
| completed | boolean | default false |
| completed_at | timestamp nullable | |

### quiz_attempts
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| user_id | integer FK → users | |
| chapter_slug | text | |
| score | integer | |
| total | integer | |
| passed | boolean | score >= 60% |
| answers | json | user's answer array |
| attempted_at | timestamp | |

### certificates
| Column | Type | Notes |
|--------|------|-------|
| id | serial PK | |
| user_id | integer FK → users | |
| issued_at | timestamp | |
| certificate_id | text unique | LDE-{timestamp}-{uuid8} |

---

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Create account, set cookie |
| POST | /api/auth/login | — | Login, set cookie |
| GET | /api/auth/logout | — | Delete cookie, redirect / |
| GET | /api/auth/session | — | Return current user or null |
| GET | /api/progress | cookie | Get user's progress + attempts |
| POST | /api/progress | cookie | Mark chapter as completed |
| POST | /api/quiz | optional | Submit quiz answers, score & save |
| POST | /api/bonus | — | Claude API: 3 bonus problems |
| GET | /api/certificate | cookie | Check eligibility, issue if qualified |
| POST | /api/cheatsheet | — | Claude API: 5-section cheat sheet |

---

## Env Vars

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | ✅ | Neon pooled connection |
| DATABASE_URL_UNPOOLED | ✅ | Neon direct connection (migrations) |
| JWT_SECRET | ✅ | Random string for JWT signing |
| NEXT_PUBLIC_APP_URL | ✅ | https://your-domain.vercel.app |

> No Anthropic API key needed — the artifact API proxy handles auth automatically

---

## Timeline / Phases

| Phase | Status | Tasks |
|-------|--------|-------|
| Foundation | ✅ | Next.js setup, Tailwind, fonts, DB schema, auth |
| Content | ✅ | 8 chapters with full math content (KaTeX), quiz data (40 Qs) |
| Features | ✅ | Progress tracking, quiz scoring, bonus problems, cheat sheet, certificate |
| Polish | ✅ | Dark design, responsive layout, build verified |
| Deploy | ⏳ | Connect Vercel, add Neon env vars, run migrations |

---

## Next Steps
1. Create Neon project at neon.tech → copy DATABASE_URL and DATABASE_URL_UNPOOLED
2. Connect repo to Vercel → add all 4 env vars
3. After first deploy, run migrations: `npx drizzle-kit push` with env set
4. Test full flow: register → read → quiz → bonus → certificate
