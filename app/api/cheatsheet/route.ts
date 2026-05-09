import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  await req.json()

  const prompt = `Generate a concise exam cheat sheet for BSc CSE 2nd Semester Differential Equations covering:
1. Variable Separable Method
2. Homogeneous Equations (v = y/x substitution)
3. Linear DE - Integrating Factor (dy/dx + Py = Q, IF = e^∫P dx)
4. Bernoulli's Equation (dy/dx + Py = Qy^n, z = y^(1-n))
5. Exact DE (M dx + N dy = 0, condition ∂M/∂y = ∂N/∂x)

Return ONLY valid JSON (no markdown, no backticks):
{
  "sections": [
    {
      "title": "Section title",
      "formula": "Key formula in LaTeX with $$...$$",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "tip": "Exam tip or memory aid"
    }
  ]
}`

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
    console.error('Cheat sheet error:', err)
    return NextResponse.json({ sections: [] }, { status: 500 })
  }
}
