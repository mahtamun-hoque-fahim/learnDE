import { pgTable, serial, text, timestamp, integer, boolean, json, varchar, index } from 'drizzle-orm/pg-core'

// ═══════════════════════════════════════════════════════════════
// BETTER AUTH TABLES
// These are required for Better Auth to function
// ═══════════════════════════════════════════════════════════════

/**
 * Unified Users table
 * Students, Staff, and Admins all use this table
 * Role determines access level: 'student' | 'staff' | 'admin'
 */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  image: text('image'),
  role: text('role').notNull().default('student'), // 'student' | 'staff' | 'admin'
  password: text('password'), // Hashed password (can be null for OAuth users)
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('users_email_idx').on(table.email),
  index('users_role_idx').on(table.role),
])

/**
 * Sessions table
 * Stores active sessions for authenticated users
 */
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('sessions_user_id_idx').on(table.userId),
  index('sessions_token_idx').on(table.token),
])

/**
 * Verification tokens
 * For email verification, password reset, etc.
 */
export const verificationTokens = pgTable('verification_tokens', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
}, (table) => [
  index('verification_tokens_email_idx').on(table.email),
  index('verification_tokens_token_idx').on(table.token),
])

/**
 * Accounts table
 * For OAuth integrations (Google, GitHub, etc.)
 * Optional - only needed if you add OAuth later
 */
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('accounts_user_id_idx').on(table.userId),
  index('accounts_provider_idx').on(table.provider),
])

// ═══════════════════════════════════════════════════════════════
// LEARNDE DOMAIN TABLES
// These store course-specific data (progress, quizzes, certs, etc.)
// ═══════════════════════════════════════════════════════════════

/**
 * Student-specific profile data
 * Extended info beyond what's in users table
 */
export const studentProfiles = pgTable('student_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  studentId: text('student_id'),
  university: text('university'),
  department: text('department'),
  batch: text('batch'),
  phone: text('phone'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('student_profiles_user_id_idx').on(table.userId),
])

/**
 * Staff-specific profile data
 */
export const staffProfiles = pgTable('staff_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  displayName: text('display_name').notNull(),
  department: text('department'),
  bio: text('bio'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('staff_profiles_user_id_idx').on(table.userId),
  index('staff_profiles_active_idx').on(table.active),
])

// ── Chapter Reading Progress ───────────────────────────────────
export const progress = pgTable('progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterSlug: text('chapter_slug').notNull(),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  startedAt: timestamp('started_at').defaultNow(),
  lastViewedAt: timestamp('last_viewed_at'),
}, (table) => [
  index('progress_user_id_idx').on(table.userId),
  index('progress_chapter_slug_idx').on(table.chapterSlug),
])

// ── Quiz Attempts ──────────────────────────────────────────────
export const quizAttempts = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterSlug: text('chapter_slug').notNull(),
  score: integer('score').notNull(),
  total: integer('total').notNull(),
  passed: boolean('passed').default(false),
  answers: json('answers'),
  attemptedAt: timestamp('attempted_at').defaultNow(),
}, (table) => [
  index('quiz_attempts_user_id_idx').on(table.userId),
  index('quiz_attempts_chapter_slug_idx').on(table.chapterSlug),
])

// ── Certificate Submissions ────────────────────────────────────
export const certSubmissions = pgTable('cert_submissions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  displayName: text('display_name').notNull(),
  university: text('university').notNull(),
  department: text('department').notNull(),
  batch: text('batch'),
  gender: text('gender').notNull(),
  phone: text('phone'),
  studentIdNo: text('student_id_no'),
  note: text('note'),
  status: text('status').notNull().default('pending'), // 'pending' | 'under_review' | 'approved' | 'rejected'
  reviewedBy: text('reviewed_by').references(() => users.id),
  reviewNote: text('review_note'),
  reviewedAt: timestamp('reviewed_at'),
  quoteText: text('quote_text'),
  quoteAuthor: text('quote_author'),
  submittedAt: timestamp('submitted_at').defaultNow(),
}, (table) => [
  index('cert_submissions_user_id_idx').on(table.userId),
  index('cert_submissions_status_idx').on(table.status),
])

// ── Issued Certificates ────────────────────────────────────────
export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  submissionId: integer('submission_id').notNull().references(() => certSubmissions.id),
  certificateId: text('certificate_id').notNull().unique(),
  issuedAt: timestamp('issued_at').defaultNow(),
  profileSnapshot: json('profile_snapshot'),
  quoteText: text('quote_text'),
  quoteAuthor: text('quote_author'),
}, (table) => [
  index('certificates_user_id_idx').on(table.userId),
  index('certificates_cert_id_idx').on(table.certificateId),
])

/**
 * Activity Log
 * Audit trail for all major actions
 */
export const activityLog = pgTable('activity_log', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // 'chapter_read', 'quiz_attempted', etc.
  resourceType: text('resource_type'), // 'chapter', 'quiz', 'submission'
  resourceId: text('resource_id'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('activity_log_user_id_idx').on(table.userId),
  index('activity_log_action_idx').on(table.action),
])

/**
 * Announcements
 */
export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  createdBy: text('created_by').notNull().references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  targetRole: text('target_role').default('all'), // 'all' | 'student' | 'staff' | 'admin'
  scheduledAt: timestamp('scheduled_at'),
  publishedAt: timestamp('published_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('announcements_created_by_idx').on(table.createdBy),
  index('announcements_target_role_idx').on(table.targetRole),
])

/**
 * In-app Notifications
 */
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'submission_review', 'announcement', etc.
  title: text('title').notNull(),
  message: text('message').notNull(),
  relatedId: text('related_id'),
  read: boolean('read').default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('notifications_user_id_idx').on(table.userId),
  index('notifications_read_idx').on(table.read),
])
