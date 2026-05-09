import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { chapterSlug, chapterTitle } = await req.json()

  const prompt = `You are a mathematics professor. Generate exactly 3 bonus practice problems for the topic: "${chapterTitle}" (${chapterSlug}) from a BSc CSE 2nd semester differential equations course based on H.K. Dass.

Return ONLY valid JSON (no markdown, no backticks, no explanation outside JSON):
{
  "problems": [
    {
      "problem": "Problem statement using LaTeX math notation with $...$ for inline and $$...$$ for block math",
      "hint": "A helpful hint pointing to the method",
      "solution": "Step-by-step solution with LaTeX math"
    }
  ]
}

Make problems exam-level, varied difficulty, and different from textbook examples. Use proper differential equations notation.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await res.json()
    const text = data.content?.map((c: { type: string; text?: string }) => c.text || '').join('')
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Bonus problems error:', err)
    return NextResponse.json({ problems: [] }, { status: 500 })
  }
}
