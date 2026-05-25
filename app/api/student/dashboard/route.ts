import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { progress, quizAttempts, certSubmissions } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { CHAPTERS } from '@/lib/chapters'

const DAY_MS = 24 * 60 * 60 * 1000

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/**
 * Compute a daily-activity streak. Returns the number of consecutive days
 * (counting back from today, inclusive) on which the user did SOMETHING:
 * viewed a chapter, completed a chapter, or attempted a quiz.
 *
 * Today counts if there's any activity today. Otherwise the streak starts
 * yesterday (if yesterday had activity) and counts backward from there.
 */
function computeStreak(activityTimestamps: Date[]): number {
  if (activityTimestamps.length === 0) return 0

  // Bucket activity into distinct local days.
  const dayKeys = new Set<number>()
  for (const t of activityTimestamps) {
    dayKeys.add(startOfDay(t).getTime())
  }

  const today = startOfDay(new Date()).getTime()
  // Anchor: today if today is in the set, else yesterday.
  let cursor = dayKeys.has(today) ? today : today - DAY_MS
  if (!dayKeys.has(cursor)) return 0

  let streak = 0
  while (dayKeys.has(cursor)) {
    streak++
    cursor -= DAY_MS
  }
  return streak
}

/**
 * GET /api/student/dashboard
 * Returns student dashboard data with real-only values (no literals).
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const [allProgress, allQuizzes, cert] = await Promise.all([
      db.select().from(progress).where(eq(progress.userId, userId)),
      db
        .select()
        .from(quizAttempts)
        .where(eq(quizAttempts.userId, userId))
        .orderBy(desc(quizAttempts.attemptedAt)),
      db
        .select()
        .from(certSubmissions)
        .where(eq(certSubmissions.userId, userId))
        .orderBy(desc(certSubmissions.submittedAt))
        .limit(1),
    ])

    const totalChapters = CHAPTERS.length
    const totalQuizzes = CHAPTERS.length
    const chaptersRead = allProgress.filter(p => p.completed).length
    const quizzesPassed = allQuizzes.filter(q => q.passed).length
    const overallProgress = Math.round(
      ((chaptersRead + quizzesPassed) / (totalChapters * 2)) * 100,
    )

    // Week-over-week deltas
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * DAY_MS)
    const chaptersReadThisWeek = allProgress.filter(
      p => p.completed && p.completedAt && p.completedAt >= weekAgo,
    ).length
    const quizzesPassedThisWeek = allQuizzes.filter(
      q => q.passed && q.attemptedAt && q.attemptedAt >= weekAgo,
    ).length

    // Overall progress one week ago (using completedAt snapshot)
    const chaptersReadPrior = allProgress.filter(
      p => p.completed && p.completedAt && p.completedAt < weekAgo,
    ).length
    const quizzesPassedPrior = allQuizzes.filter(
      q => q.passed && q.attemptedAt && q.attemptedAt < weekAgo,
    ).length
    const priorOverallProgress = Math.round(
      ((chaptersReadPrior + quizzesPassedPrior) / (totalChapters * 2)) * 100,
    )

    // Real streak from all activity timestamps
    const activityStamps: Date[] = [
      ...allProgress.flatMap(p =>
        [p.lastViewedAt, p.completedAt, p.startedAt].filter(
          (d): d is Date => d != null,
        ),
      ),
      ...allQuizzes.flatMap(q => (q.attemptedAt ? [q.attemptedAt] : [])),
    ]
    const streak = computeStreak(activityStamps)

    // Continue learning: last viewed in-progress chapter
    const lastViewed = allProgress
      .filter(p => p.lastViewedAt && !p.completed)
      .sort((a, b) => b.lastViewedAt!.getTime() - a.lastViewedAt!.getTime())[0]

    const continueData = lastViewed
      ? {
          chapterNum:
            CHAPTERS.findIndex(c => c.slug === lastViewed.chapterSlug) + 1,
          title:
            CHAPTERS.find(c => c.slug === lastViewed.chapterSlug)?.title ??
            lastViewed.chapterSlug,
          slug: lastViewed.chapterSlug,
          // Within-chapter progress: 0 if just started, 50 if quiz attempted, 100 if completed.
          progress: allQuizzes.some(q => q.chapterSlug === lastViewed.chapterSlug)
            ? 50
            : 0,
        }
      : null

    // Full chapter list with status
    const chaptersWithStatus = CHAPTERS.map((c, idx) => {
      const p = allProgress.find(x => x.chapterSlug === c.slug)
      const q = allQuizzes.find(x => x.chapterSlug === c.slug)
      return {
        num: idx + 1,
        slug: c.slug,
        title: c.title,
        status: p?.completed ? 'completed' : p ? 'reading' : 'unread',
        quiz: q?.passed ? 'passed' : q ? 'failed' : 'untaken',
      }
    })

    // Recent quizzes (last 5)
    const recentQuizzes = allQuizzes.slice(0, 5).map(q => {
      const chapterNum = CHAPTERS.findIndex(c => c.slug === q.chapterSlug) + 1
      const attemptedTime = q.attemptedAt ? q.attemptedAt.getTime() : now.getTime()
      const daysAgo = Math.floor((now.getTime() - attemptedTime) / DAY_MS)
      return {
        ch: chapterNum,
        score: Math.round((q.score / q.total) * 100),
        status: q.passed ? 'passed' : 'failed',
        date:
          daysAgo === 0
            ? 'Today'
            : daysAgo === 1
            ? 'Yesterday'
            : `${daysAgo} days ago`,
      }
    })

    const certStatus = {
      canApply:
        chaptersRead === totalChapters && quizzesPassed === totalQuizzes,
      submitted: cert.length > 0,
      status: cert[0]?.status || null,
    }

    return NextResponse.json({
      stats: {
        chaptersRead,
        totalChapters,
        quizzesPassed,
        totalQuizzes,
        overallProgress,
        streak,
        deltas: {
          chaptersRead: chaptersReadThisWeek,
          quizzesPassed: quizzesPassedThisWeek,
          overallProgress: overallProgress - priorOverallProgress,
        },
      },
      continueData,
      chapters: chaptersWithStatus,
      recentQuizzes,
      certStatus,
    })
  } catch (error) {
    console.error('Student dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
