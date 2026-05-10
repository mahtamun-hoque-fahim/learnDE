import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { quizAttempts } from '@/lib/db/schema'
import { getSessionFromRequest } from '@/lib/auth'
import { getDailyQuestions } from '@/lib/quiz-data'

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  const { chapterSlug, answers } = await req.json()

  const questions = getDailyQuestions(chapterSlug)
  if (!questions.length) return NextResponse.json({ error: 'No quiz for this chapter' }, { status: 404 })

  let score = 0
  const results = questions.map((q, i) => {
    const userAnswer = answers[i] ?? -1
    const correct = userAnswer === q.correct
    if (correct) score++
    return { id: q.id, userAnswer, correct, correctAnswer: q.correct, explanation: q.explanation }
  })

  const passed = score >= Math.ceil(questions.length * 0.6)

  if (session) {
    const db = getDb()
    if (db) {
      await db.insert(quizAttempts).values({
        userId: session.id,
        chapterSlug,
        score,
        total: questions.length,
        passed,
        answers,
      })
    }
  }

  return NextResponse.json({ score, total: questions.length, passed, results })
}
