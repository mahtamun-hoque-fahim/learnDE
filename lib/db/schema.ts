import { pgTable, serial, text, timestamp, integer, boolean, json, index } from 'drizzle-orm/pg-core'

// ===========================================================================
// BETTER AUTH TABLES (canonical schema, used with `usePlural: true` adapter)
// ===========================================================================

/**
 * Users — the single source of identity for students, staff, and admins.
 * Passwords are NOT stored here; they live in `accounts.password` (Better Auth
 * stores credential providers under the `credential` providerId).
 */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: text('role').notNull().default('student'), // 'student' | 'staff' | 'admin'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('users_email_idx').on(t.email),
  index('users_role_idx').on(t.role),
])

/**
 * Sessions — active Better Auth sessions. Cookie: `better-auth.session_token`.
 */
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('sessions_user_id_idx').on(t.userId),
  index('sessions_token_idx').on(t.token),
])

/**
 * Accounts — one row per auth method per user. For email/password sign-ups,
 * `providerId = 'credential'` and `password` holds the scrypt hash.
 * For OAuth (future), `providerId = 'google'` etc. with tokens populated.
 */
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('accounts_user_id_idx').on(t.userId),
])

/**
 * Verifications — short-lived tokens for email verification, password reset, etc.
 */
export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('verifications_identifier_idx').on(t.identifier),
])

// ===========================================================================
// LEARNDE DOMAIN TABLES
// ===========================================================================

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
}, (t) => [
  index('student_profiles_user_id_idx').on(t.userId),
])

export const staffProfiles = pgTable('staff_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  displayName: text('display_name').notNull(),
  department: text('department'),
  bio: text('bio'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('staff_profiles_user_id_idx').on(t.userId),
  index('staff_profiles_active_idx').on(t.active),
])

export const progress = pgTable('progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterSlug: text('chapter_slug').notNull(),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  startedAt: timestamp('started_at').defaultNow(),
  lastViewedAt: timestamp('last_viewed_at'),
}, (t) => [
  index('progress_user_id_idx').on(t.userId),
  index('progress_chapter_slug_idx').on(t.chapterSlug),
])

export const quizAttempts = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chapterSlug: text('chapter_slug').notNull(),
  score: integer('score').notNull(),
  total: integer('total').notNull(),
  passed: boolean('passed').default(false),
  answers: json('answers'),
  attemptedAt: timestamp('attempted_at').defaultNow(),
}, (t) => [
  index('quiz_attempts_user_id_idx').on(t.userId),
  index('quiz_attempts_chapter_slug_idx').on(t.chapterSlug),
])

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
  status: text('status').notNull().default('pending'),
  reviewedBy: text('reviewed_by').references(() => users.id),
  reviewNote: text('review_note'),
  reviewedAt: timestamp('reviewed_at'),
  quoteText: text('quote_text'),
  quoteAuthor: text('quote_author'),
  submittedAt: timestamp('submitted_at').defaultNow(),
}, (t) => [
  index('cert_submissions_user_id_idx').on(t.userId),
  index('cert_submissions_status_idx').on(t.status),
])

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  submissionId: integer('submission_id').notNull().references(() => certSubmissions.id),
  certificateId: text('certificate_id').notNull().unique(),
  issuedAt: timestamp('issued_at').defaultNow(),
  profileSnapshot: json('profile_snapshot'),
  quoteText: text('quote_text'),
  quoteAuthor: text('quote_author'),
}, (t) => [
  index('certificates_user_id_idx').on(t.userId),
  index('certificates_cert_id_idx').on(t.certificateId),
])

export const activityLog = pgTable('activity_log', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  resourceType: text('resource_type'),
  resourceId: text('resource_id'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => [
  index('activity_log_user_id_idx').on(t.userId),
  index('activity_log_action_idx').on(t.action),
])

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  createdBy: text('created_by').notNull().references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  targetRole: text('target_role').default('all'),
  scheduledAt: timestamp('scheduled_at'),
  publishedAt: timestamp('published_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => [
  index('announcements_created_by_idx').on(t.createdBy),
  index('announcements_target_role_idx').on(t.targetRole),
])

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  relatedId: text('related_id'),
  read: boolean('read').default(false),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => [
  index('notifications_user_id_idx').on(t.userId),
  index('notifications_read_idx').on(t.read),
])
