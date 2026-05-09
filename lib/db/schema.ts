import { pgTable, serial, text, timestamp, integer, boolean, json } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  studentId: text('student_id'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const studentProfiles = pgTable('student_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  displayName: text('display_name').notNull(),
  university: text('university').notNull(),
  department: text('department').notNull(),
  batch: text('batch'),
  gender: text('gender').notNull(), // 'male' | 'female' | 'other'
  createdAt: timestamp('created_at').defaultNow(),
})

export const quotes = pgTable('quotes', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  author: text('author'),
  // Targeting: if null = applies to all; otherwise matches value
  targetGender: text('target_gender'),      // 'male' | 'female' | 'other' | null
  targetDepartment: text('target_department'), // e.g. 'CSE' | null
  priority: integer('priority').default(0), // higher = preferred
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

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

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  issuedAt: timestamp('issued_at').defaultNow(),
  certificateId: text('certificate_id').notNull().unique(),
  quoteId: integer('quote_id').references(() => quotes.id),
  profileSnapshot: json('profile_snapshot'), // snapshot at issue time
})
