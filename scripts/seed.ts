import { db } from './lib/db'
import * as schema from './lib/db/schema'
import bcrypt from 'bcryptjs'

/**
 * Seed Script for LearnDE Database
 * 
 * Creates sample data for development and testing:
 * - 3 users (student, staff, admin)
 * - Student progress (4/8 chapters)
 * - Quiz attempts (3 passed)
 * - Certificate submissions (5 total: pending, under review, approved)
 * - Announcements
 * - Notifications
 * 
 * Run: npm run seed
 */

async function main() {
  console.log('🌱 Seeding database...')

  // Hash password for all users (password: "password123")
  const hashedPassword = await bcrypt.hash('password123', 10)

  // ═══════════════════════════════════════════════════════════════
  // 1. Create Users
  // ═══════════════════════════════════════════════════════════════
  
  const studentUser = {
    id: 'user_student_1',
    name: 'Ananya Sharma',
    email: 'ananya@example.com',
    emailVerified: true,
    password: hashedPassword,
    role: 'student',
  }

  const staffUser = {
    id: 'user_staff_1',
    name: 'Dr. Rohit Das',
    email: 'rohit@example.com',
    emailVerified: true,
    password: hashedPassword,
    role: 'staff',
  }

  const adminUser = {
    id: 'user_admin_1',
    name: 'Admin User',
    email: 'admin@example.com',
    emailVerified: true,
    password: hashedPassword,
    role: 'admin',
  }

  await db.insert(schema.users).values([studentUser, staffUser, adminUser])
  console.log('✓ Created 3 users (student, staff, admin)')

  // ═══════════════════════════════════════════════════════════════
  // 2. Create Student Profile
  // ═══════════════════════════════════════════════════════════════
  
  await db.insert(schema.studentProfiles).values({
    id: 'profile_student_1',
    userId: studentUser.id,
    studentId: 'CS2023-045',
    university: 'University of Dhaka',
    department: 'Computer Science & Engineering',
    batch: '2023',
    phone: '+880-1712345678',
  })
  console.log('✓ Created student profile')

  // ═══════════════════════════════════════════════════════════════
  // 3. Create Staff Profile
  // ═══════════════════════════════════════════════════════════════
  
  await db.insert(schema.staffProfiles).values({
    id: 'profile_staff_1',
    userId: staffUser.id,
    displayName: 'Dr. Rohit Das',
    department: 'Mathematics',
    bio: 'Associate Professor, specializing in Differential Equations',
    active: true,
  })
  console.log('✓ Created staff profile')

  // ═══════════════════════════════════════════════════════════════
  // 4. Create Chapter Progress (4/8 completed)
  // ═══════════════════════════════════════════════════════════════
  
  const chapterSlugs = [
    'chapter-1-introduction-to-odes',
    'chapter-2-first-order-odes',
    'chapter-3-second-order-odes',
    'chapter-4-partial-differential-equations',
    'chapter-5-boundary-value-problems',
    'chapter-6-laplace-transforms',
    'chapter-7-fourier-series',
    'chapter-8-numerical-methods',
  ]

  const progressData = chapterSlugs.slice(0, 4).map((slug, idx) => ({
    userId: studentUser.id,
    chapterSlug: slug,
    completed: idx < 3, // First 3 completed, 4th in progress
    completedAt: idx < 3 ? new Date(Date.now() - (7 - idx) * 24 * 60 * 60 * 1000) : null,
    startedAt: new Date(Date.now() - (8 - idx) * 24 * 60 * 60 * 1000),
    lastViewedAt: new Date(Date.now() - (idx === 3 ? 1 : 5) * 60 * 60 * 1000),
  }))

  await db.insert(schema.progress).values(progressData)
  console.log('✓ Created chapter progress (4/8 chapters)')

  // ═══════════════════════════════════════════════════════════════
  // 5. Create Quiz Attempts (3 passed)
  // ═══════════════════════════════════════════════════════════════
  
  const quizData = [
    {
      userId: studentUser.id,
      chapterSlug: 'chapter-1-introduction-to-odes',
      score: 8,
      total: 10,
      passed: true,
      answers: JSON.stringify({ q1: 'A', q2: 'B', q3: 'C' }),
      attemptedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      userId: studentUser.id,
      chapterSlug: 'chapter-2-first-order-odes',
      score: 9,
      total: 10,
      passed: true,
      answers: JSON.stringify({ q1: 'B', q2: 'A', q3: 'D' }),
      attemptedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      userId: studentUser.id,
      chapterSlug: 'chapter-3-second-order-odes',
      score: 7,
      total: 10,
      passed: true,
      answers: JSON.stringify({ q1: 'A', q2: 'C', q3: 'B' }),
      attemptedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]

  await db.insert(schema.quizAttempts).values(quizData)
  console.log('✓ Created quiz attempts (3 passed)')

  // ═══════════════════════════════════════════════════════════════
  // 6. Create Certificate Submissions
  // ═══════════════════════════════════════════════════════════════
  
  const submissions = [
    {
      userId: studentUser.id,
      displayName: 'Ananya Sharma',
      university: 'University of Dhaka',
      department: 'Computer Science & Engineering',
      batch: '2023',
      gender: 'female',
      phone: '+880-1712345678',
      studentIdNo: 'CS2023-045',
      note: 'Looking forward to receiving my certificate!',
      status: 'pending',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ]

  await db.insert(schema.certSubmissions).values(submissions)
  console.log('✓ Created certificate submission (pending)')

  // ═══════════════════════════════════════════════════════════════
  // 7. Create Announcements
  // ═══════════════════════════════════════════════════════════════
  
  const announcementsData = [
    {
      createdBy: staffUser.id,
      title: 'Office Hours Update',
      content: 'Office hours will be held every Tuesday and Thursday from 2-4 PM. Feel free to drop by with any questions!',
      targetRole: 'student',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      createdBy: adminUser.id,
      title: 'Platform Maintenance',
      content: 'The platform will undergo scheduled maintenance this Saturday from 2-4 AM. Please save your work before then.',
      targetRole: 'all',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  ]

  await db.insert(schema.announcements).values(announcementsData)
  console.log('✓ Created 2 announcements')

  // ═══════════════════════════════════════════════════════════════
  // 8. Create Notifications
  // ═══════════════════════════════════════════════════════════════
  
  const notificationsData = [
    {
      userId: studentUser.id,
      type: 'announcement',
      title: 'New Announcement',
      message: 'Office hours update posted by Dr. Rohit Das',
      read: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      userId: staffUser.id,
      type: 'submission',
      title: 'New Certificate Submission',
      message: 'Ananya Sharma submitted a certificate application',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ]

  await db.insert(schema.notifications).values(notificationsData)
  console.log('✓ Created 2 notifications')

  // ═══════════════════════════════════════════════════════════════
  // 9. Create Activity Log
  // ═══════════════════════════════════════════════════════════════
  
  const activityData = [
    {
      userId: studentUser.id,
      action: 'chapter_read',
      resourceType: 'chapter',
      resourceId: 'chapter-1-introduction-to-odes',
      metadata: JSON.stringify({ completionTime: 45 }),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      userId: studentUser.id,
      action: 'quiz_attempted',
      resourceType: 'quiz',
      resourceId: 'chapter-1-introduction-to-odes',
      metadata: JSON.stringify({ score: 8, total: 10 }),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      userId: studentUser.id,
      action: 'cert_submitted',
      resourceType: 'submission',
      resourceId: '1',
      metadata: JSON.stringify({ university: 'University of Dhaka' }),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  ]

  await db.insert(schema.activityLog).values(activityData)
  console.log('✓ Created activity log entries')

  console.log('\n✅ Database seeded successfully!')
  console.log('\n📝 Test Credentials:')
  console.log('   Student: ananya@example.com / password123')
  console.log('   Staff:   rohit@example.com / password123')
  console.log('   Admin:   admin@example.com / password123')
  console.log('\n🚀 You can now run: npm run dev')
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
