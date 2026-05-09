import { pgTable, serial, text, timestamp, integer, boolean, json } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  studentId: text('student_id'),
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
})
