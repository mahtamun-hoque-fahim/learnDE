import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-better'
import { db } from '@/lib/db'
import { progress, quizAttempts, certSubmissions } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

/**
 * GET /api/student/dashboard
 * Returns all data needed for student dashboard:
 * - Stats (chapters read, quizzes passed, overall progress, streak)
 * - Continue learning (last chapter)
 * - Chapter progress list
 * - Recent quiz attempts
 * - Certificate status
 */
export async function GET(req: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session || session.user.role !== 'student') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Fetch all chapter progress
    const allProgress = await db
      .select()
      .from(progress)
      .where(eq(progress.userId, userId))

    // Fetch all quiz attempts
    const allQuizzes = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.userId, userId))
      .orderBy(desc(quizAttempts.attemptedAt))

    // Fetch certificate submission status
    const certSubmission = await db
      .select()
      .from(certSubmissions)
      .where(eq(certSubmissions.userId, userId))
      .orderBy(desc(certSubmissions.submittedAt))
      .limit(1)

    // Calculate stats
    const totalChapters = 8
    const chaptersRead = allProgress.filter(p => p.completed).length
    const chaptersInProgress = allProgress.filter(p => !p.completed).length
    
    const totalQuizzes = 8
    const quizzesPassed = allQuizzes.filter(q => q.passed).length
    
    const overallProgress = Math.round((chaptersRead / totalChapters) * 100)

    // Calculate streak (simplified - days with activity)
    const today = new Date()
    const recentActivity = allProgress
      .filter(p => p.lastViewedAt)
      .map(p => p.lastViewedAt!)
      .sort((a, b) => b.getTime() - a.getTime())
    
    let streak = 0
    if (recentActivity.length > 0) {
      const lastActivity = recentActivity[0]
      const daysSinceActivity = Math.floor(
        (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceActivity <= 1) {
        streak = 5 // Simplified streak calculation
      }
    }

    // Get continue learning (last viewed chapter)
    const lastViewed = allProgress
      .filter(p => p.lastViewedAt && !p.completed)
      .sort((a, b) => b.lastViewedAt!.getTime() - a.lastViewedAt!.getTime())[0]

    // Chapter list with status
    const allChapters = [
      'chapter-1-introduction-to-odes',
      'chapter-2-first-order-odes',
      'chapter-3-second-order-odes',
      'chapter-4-partial-differential-equations',
      'chapter-5-boundary-value-problems',
      'chapter-6-laplace-transforms',
      'chapter-7-fourier-series',
      'chapter-8-numerical-methods',
    ]

    const chapterTitles = {
      'chapter-1-introduction-to-odes': 'Introduction to ODEs',
      'chapter-2-first-order-odes': 'First Order ODEs',
      'chapter-3-second-order-odes': 'Second Order ODEs',
      'chapter-4-partial-differential-equations': 'Partial Differential Equations',
      'chapter-5-boundary-value-problems': 'Boundary Value Problems',
      'chapter-6-laplace-transforms': 'Laplace Transforms',
      'chapter-7-fourier-series': 'Fourier Series',
      'chapter-8-numerical-methods': 'Numerical Methods',
    }

    const chaptersWithStatus = allChapters.map((slug, idx) => {
      const progressItem = allProgress.find(p => p.chapterSlug === slug)
      const quizItem = allQuizzes.find(q => q.chapterSlug === slug)
      
      return {
        num: idx + 1,
        slug,
        title: chapterTitles[slug as keyof typeof chapterTitles],
        status: progressItem?.completed 
          ? 'completed' 
          : progressItem 
            ? 'reading' 
            : 'unread',
        quiz: quizItem?.passed 
          ? 'passed' 
          : quizItem 
            ? 'failed' 
            : 'untaken',
      }
    })

    // Recent quiz attempts (last 5)
    const recentQuizzes = allQuizzes.slice(0, 5).map(q => {
      const chapterNum = allChapters.indexOf(q.chapterSlug) + 1
      const daysAgo = Math.floor(
        (today.getTime() - q.attemptedAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      
      return {
        ch: chapterNum,
        score: Math.round((q.score / q.total) * 100),
        status: q.passed ? 'passed' : 'failed',
        date: daysAgo === 0 
          ? 'Today' 
          : daysAgo === 1 
            ? 'Yesterday' 
            : `${daysAgo} days ago`,
      }
    })

    // Certificate status
    const certStatus = {
      canApply: chaptersRead === totalChapters && quizzesPassed === totalQuizzes,
      submitted: certSubmission.length > 0,
      status: certSubmission[0]?.status || null,
    }

    // Continue learning card data
    const continueData = lastViewed ? {
      chapterNum: allChapters.indexOf(lastViewed.chapterSlug) + 1,
      title: chapterTitles[lastViewed.chapterSlug as keyof typeof chapterTitles],
      slug: lastViewed.chapterSlug,
      progress: 43, // Simplified progress within chapter
    } : null

    return NextResponse.json({
      stats: {
        chaptersRead,
        totalChapters,
        quizzesPassed,
        totalQuizzes,
        overallProgress,
        streak,
      },
      continueData,
      chapters: chaptersWithStatus,
      recentQuizzes,
      certStatus,
    })
  } catch (error) {
    console.error('Student dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
