# 🗄️ PHASE 4: Database Setup Guide

**Complete guide for setting up LearnDE's PostgreSQL database with Drizzle ORM**

---

## 📋 Prerequisites

✅ Phase 1 complete (Better Auth configured)  
✅ Environment variables set (DATABASE_URL, DATABASE_URL_UNPOOLED)  
✅ Neon PostgreSQL database created  

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `drizzle-orm` - ORM for TypeScript
- `drizzle-kit` - CLI for migrations
- `@neondatabase/serverless` - Neon driver
- `tsx` - TypeScript execution (for seed script)
- `bcryptjs` - Password hashing

### Step 2: Generate Migrations

```bash
npm run db:generate
```

This creates migration files in `/drizzle` folder based on schema.

### Step 3: Push Schema to Database

```bash
npm run db:push
```

⚠️ **IMPORTANT**: This will **drop and recreate** all tables!  
Only use in development. In production, use `db:migrate`.

**What this creates**:

✅ **Better Auth Tables** (4):
- `users` - Unified user table with role
- `sessions` - Active sessions
- `verification_tokens` - Email verification, password reset
- `accounts` - OAuth accounts (optional)

✅ **LearnDE Tables** (10):
- `student_profiles` - Extended student info
- `staff_profiles` - Extended staff info
- `progress` - Chapter reading progress
- `quiz_attempts` - Quiz scores
- `cert_submissions` - Certificate applications
- `certificates` - Issued certificates
- `announcements` - Announcements
- `notifications` - In-app notifications
- `activity_log` - Audit trail

**Total: 14 tables created** ✨

### Step 4: Seed Sample Data

```bash
npm run db:seed
```

**What this creates**:

👥 **3 Users**:
- Student: `ananya@example.com` / `password123`
- Staff: `rohit@example.com` / `password123`
- Admin: `admin@example.com` / `password123`

📊 **Sample Data**:
- 4/8 chapters read (student)
- 3 quiz attempts (all passed)
- 1 certificate submission (pending)
- 2 announcements
- 2 notifications
- Activity log entries

### Step 5: Verify Database

```bash
npm run db:studio
```

Opens Drizzle Studio at `https://local.drizzle.studio`  
Browse all tables, view data, run queries.

**Or check via Neon Dashboard**:
1. Go to https://console.neon.tech
2. Select your project
3. Click "Tables" → should see all 14 tables

---

## 📊 Database Schema Overview

### Better Auth Tables

```
users
├── id (text, PK)
├── name (text)
├── email (text, unique)
├── emailVerified (boolean)
├── image (text, nullable)
├── role (text: 'student' | 'staff' | 'admin')
├── password (text, hashed)
├── createdAt (timestamp)
└── updatedAt (timestamp)

sessions
├── id (text, PK)
├── userId (text, FK → users.id)
├── expiresAt (timestamp)
├── token (text, unique)
├── createdAt (timestamp)
└── updatedAt (timestamp)

verification_tokens
├── id (text, PK)
├── email (text)
├── token (text, unique)
└── expires (timestamp)

accounts (OAuth)
├── id (text, PK)
├── userId (text, FK → users.id)
├── provider (text)
├── providerAccountId (text)
├── accessToken (text)
├── refreshToken (text)
└── expiresAt (timestamp)
```

### LearnDE Tables

```
student_profiles
├── id (text, PK)
├── userId (text, FK → users.id, unique)
├── studentId (text)
├── university (text)
├── department (text)
├── batch (text)
├── phone (text)
├── createdAt (timestamp)
└── updatedAt (timestamp)

staff_profiles
├── id (text, PK)
├── userId (text, FK → users.id, unique)
├── displayName (text)
├── department (text)
├── bio (text)
├── active (boolean)
├── createdAt (timestamp)
└── updatedAt (timestamp)

progress
├── id (serial, PK)
├── userId (text, FK → users.id)
├── chapterSlug (text)
├── completed (boolean)
├── completedAt (timestamp)
├── startedAt (timestamp)
└── lastViewedAt (timestamp)

quiz_attempts
├── id (serial, PK)
├── userId (text, FK → users.id)
├── chapterSlug (text)
├── score (integer)
├── total (integer)
├── passed (boolean)
├── answers (json)
└── attemptedAt (timestamp)

cert_submissions
├── id (serial, PK)
├── userId (text, FK → users.id)
├── displayName (text)
├── university (text)
├── department (text)
├── batch (text)
├── gender (text)
├── phone (text)
├── studentIdNo (text)
├── note (text)
├── status (text: 'pending' | 'under_review' | 'approved' | 'rejected')
├── reviewedBy (text, FK → users.id)
├── reviewNote (text)
├── reviewedAt (timestamp)
├── quoteText (text)
├── quoteAuthor (text)
└── submittedAt (timestamp)

certificates
├── id (serial, PK)
├── userId (text, FK → users.id)
├── submissionId (integer, FK → cert_submissions.id)
├── certificateId (text, unique)
├── issuedAt (timestamp)
├── profileSnapshot (json)
├── quoteText (text)
└── quoteAuthor (text)

announcements
├── id (serial, PK)
├── createdBy (text, FK → users.id)
├── title (text)
├── content (text)
├── targetRole (text: 'all' | 'student' | 'staff')
├── scheduledAt (timestamp)
├── publishedAt (timestamp)
├── expiresAt (timestamp)
└── createdAt (timestamp)

notifications
├── id (serial, PK)
├── userId (text, FK → users.id)
├── type (text)
├── title (text)
├── message (text)
├── relatedId (text)
├── read (boolean)
├── readAt (timestamp)
└── createdAt (timestamp)

activity_log
├── id (serial, PK)
├── userId (text, FK → users.id)
├── action (text)
├── resourceType (text)
├── resourceId (text)
├── metadata (json)
└── createdAt (timestamp)
```

---

## 🔧 Database Commands Reference

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run db:generate` | Generate migration files | After schema changes |
| `npm run db:push` | Push schema directly (destructive) | Dev only, first setup |
| `npm run db:migrate` | Run migrations (safe) | Production deploys |
| `npm run db:studio` | Open Drizzle Studio GUI | Browse/edit data |
| `npm run db:seed` | Populate sample data | Testing, dev setup |

---

## 🔍 Testing the Database

### 1. Check Tables Exist

Open Drizzle Studio:
```bash
npm run db:studio
```

Should see all 14 tables in sidebar.

### 2. Verify Seeded Data

**Check Users Table**:
```sql
SELECT id, name, email, role FROM users;
```

Should show 3 users (student, staff, admin).

**Check Progress**:
```sql
SELECT * FROM progress WHERE user_id = 'user_student_1';
```

Should show 4 chapters (3 completed, 1 in progress).

**Check Quiz Attempts**:
```sql
SELECT * FROM quiz_attempts WHERE user_id = 'user_student_1';
```

Should show 3 quiz attempts (all passed).

### 3. Test Auth Flow

```bash
npm run dev
```

1. Visit http://localhost:3000/auth/sign-in
2. Login with `ananya@example.com` / `password123`
3. Should redirect to `/dashboard`
4. See: 4/8 chapters, 3/8 quizzes, stats

### 4. Test Staff Dashboard

1. Logout
2. Login with `rohit@example.com` / `password123`
3. Should redirect to `/staff`
4. See: 1 pending submission (Ananya Sharma)

### 5. Test Admin Dashboard

1. Logout
2. Login with `admin@example.com` / `password123`
3. Should redirect to `/admin`
4. See: 3 users in table

---

## 🚨 Common Issues & Solutions

### Issue: "Error connecting to database"

**Cause**: DATABASE_URL not set or incorrect  
**Fix**:
```bash
# Check .env.local has correct DATABASE_URL
cat .env.local | grep DATABASE_URL

# Should show your Neon connection string
# If not, copy from Neon dashboard → Connection Details
```

### Issue: "drizzle-kit: command not found"

**Cause**: Dependencies not installed  
**Fix**:
```bash
npm install
# Or if using pnpm/yarn:
pnpm install
yarn install
```

### Issue: "Table already exists"

**Cause**: Running `db:push` when tables exist  
**Fix**:
```bash
# Option 1: Drop all tables in Neon dashboard, then:
npm run db:push

# Option 2: Use migrations instead:
npm run db:generate
npm run db:migrate
```

### Issue: "Seed script fails"

**Cause**: Tables don't exist yet  
**Fix**:
```bash
# Run migrations first:
npm run db:push

# Then seed:
npm run db:seed
```

### Issue: "Cannot find module 'tsx'"

**Cause**: tsx not installed  
**Fix**:
```bash
npm install tsx --save-dev
```

---

## 📁 File Structure

```
learnDE/
├── lib/
│   └── db/
│       ├── schema.ts         ← All table definitions
│       └── index.ts          ← Database instance
├── drizzle/
│   └── *.sql                 ← Generated migration files
├── scripts/
│   └── seed.ts               ← Seed script
├── drizzle.config.ts         ← Drizzle configuration
└── package.json              ← Database scripts defined
```

---

## 🔐 Security Notes

### Password Hashing

All passwords stored with bcrypt (10 rounds):
```ts
import bcrypt from 'bcryptjs'
const hashed = await bcrypt.hash(password, 10)
```

### Session Security

- HTTP-only cookies (XSS-safe)
- 7-day expiry
- Secure flag in production
- CSRF protection via Better Auth

### Database Access

- Connection pooling via Neon
- Prepared statements (SQL injection safe)
- Role-based access (middleware enforcement)

---

## 📊 Data Relationships

```
users
  ├─→ student_profiles (1:1)
  ├─→ staff_profiles (1:1)
  ├─→ progress (1:N)
  ├─→ quiz_attempts (1:N)
  ├─→ cert_submissions (1:N)
  ├─→ certificates (1:N)
  ├─→ announcements (1:N, created_by)
  ├─→ notifications (1:N)
  ├─→ activity_log (1:N)
  └─→ sessions (1:N)

cert_submissions
  └─→ certificates (1:1, on approval)
```

---

## 🎯 Next Steps

### After Database Setup Complete

✅ All tables created  
✅ Sample data seeded  
✅ Database verified working  

**PHASE 5: API & Data Integration** (3-4 days):

1. Build API routes:
   - GET /api/student/dashboard
   - GET /api/staff/submissions
   - PATCH /api/staff/submission/:id
   - GET /api/admin/users
   - PATCH /api/admin/users/:id
   - POST /api/announcements

2. Connect dashboards to real data
3. Wire up modals to API endpoints
4. Real-time updates

---

## 📞 Troubleshooting

If you encounter issues:

1. **Check environment variables** are set correctly
2. **Verify Neon database** is accessible (check dashboard)
3. **Run migrations** before seeding
4. **Check logs** for specific error messages
5. **Test database connection** via Drizzle Studio

---

**Database ready!** 🎉

Next: **PHASE 5 - API Integration** → Connect everything together!
