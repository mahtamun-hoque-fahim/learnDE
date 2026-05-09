import { pgTable, serial, text, timestamp, integer, boolean, json } from 'drizzle-orm/pg-core'

// ── Core users (students) ──────────────────────────────────────────────────
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  studentId: text('student_id'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ── Staff: admins + moderators ─────────────────────────────────────────────
export const staffUsers = pgTable('staff_users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('moderator'), // 'admin' | 'moderator'
  displayName: text('display_name').notNull(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

// ── Student certificate registration submissions ────────────────────────────
// Status flow: pending → under_review → approved | rejected
export const certSubmissions = pgTable('cert_submissions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  // Form fields filled by student
  displayName: text('display_name').notNull(),
  university: text('university').notNull(),
  department: text('department').notNull(),
  batch: text('batch'),
  gender: text('gender').notNull(),         // 'male' | 'female' | 'other'
  phone: text('phone'),
  studentIdNo: text('student_id_no'),
  note: text('note'),                        // optional note from student
  // Review state
  status: text('status').notNull().default('pending'), // 'pending' | 'under_review' | 'approved' | 'rejected'
  reviewedBy: integer('reviewed_by').references(() => staffUsers.id),
  reviewNote: text('review_note'),           // moderator's note/feedback
  reviewedAt: timestamp('reviewed_at'),
  // Quote assigned by moderator
  quoteText: text('quote_text'),
  quoteAuthor: text('quote_author'),
  submittedAt: timestamp('submitted_at').defaultNow(),
})

// ── Completion progress & quizzes (existing) ───────────────────────────────
export const progress = pgTable('progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  chapterSlug: text('chapter_slug').notNull(),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
})

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

// ── Issued certificates (only created on approval) ────────────────────────
export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  submissionId: integer('submission_id').notNull().references(() => certSubmissions.id),
  certificateId: text('certificate_id').notNull().unique(), // e.g. LDE-2025-XXXXX
  issuedAt: timestamp('issued_at').defaultNow(),
  // Snapshot of student data at approval time
  profileSnapshot: json('profile_snapshot'),
  // The personal quote from moderator
  quoteText: text('quote_text'),
  quoteAuthor: text('quote_author'),
})
