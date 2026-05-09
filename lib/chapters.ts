export interface Chapter {
  slug: string
  title: string
  order: number
  sections: Section[]
  summary: string
  ref?: string
}

export interface Section {
  title: string
  body: string // markdown-like text with $...$ for inline math and $$...$$ for block
  examples?: Example[]
  cards?: { title: string; content: string }[]
  table?: { headers: string[]; rows: string[][] }
}

export interface Example {
  label: string
  problem: string
  steps: { label: string; content: string }[]
}

export const CHAPTERS: Chapter[] = [
  {
    slug: 'intro',
    title: 'Introduction to Differential Equations',
    order: 1,
    summary: 'A DE is an equation relating an unknown function and its derivatives. Solutions are functions, not numbers.',
    sections: [
      {
        title: 'What is a Differential Equation?',
        body: 'A **differential equation (DE)** is an equation relating an unknown function and one or more of its derivatives. You solve not for a number — but for a **function**.\n\nThe simplest example:\n$$\\frac{dy}{dx} = 2x$$\nThis says "rate of change of y equals 2x". The solution is $y = x^2 + C$ — a whole family of parabolas.',
        cards: [
          { title: 'Population growth', content: '$$\\frac{dP}{dt} = kP$$' },
          { title: "Newton's cooling", content: '$$\\frac{dT}{dt} = k(T - T_0)$$' },
          { title: 'RC circuit', content: '$$R\\frac{dq}{dt} + \\frac{q}{C} = V$$' },
        ],
      },
      {
        title: 'General vs Particular Solution',
        body: 'A **general solution** contains an arbitrary constant C (infinitely many solutions). An **initial condition** pins down C to give a **particular solution**.',
        examples: [
          {
            label: 'Example',
            problem: 'Solve $\\frac{dy}{dx} = 3x^2$, given $y(0) = 5$',
            steps: [
              { label: 'Integrate both sides', content: '$y = x^3 + C$' },
              { label: 'Apply y(0) = 5', content: '$5 = 0 + C \\Rightarrow C = 5$' },
              { label: 'Particular solution', content: '$$y = x^3 + 5$$' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'classification',
    title: 'Classification of Differential Equations',
    order: 2,
    summary: 'DEs are classified by type (ODE/PDE), order, degree, and linearity.',
    sections: [
      {
        title: 'ODE vs PDE',
        body: '**ODE** (Ordinary DE): one independent variable — this is what your 2nd semester covers entirely.\n**PDE** (Partial DE): two or more independent variables — studied in later semesters.',
        cards: [
          { title: 'ODE example', content: '$$\\frac{dy}{dx} + 2y = x$$' },
          { title: 'PDE example', content: '$$\\frac{\\partial u}{\\partial t} = k\\frac{\\partial^2 u}{\\partial x^2}$$' },
        ],
      },
      {
        title: 'Order and Degree',
        body: '**Order** = highest derivative present.\n**Degree** = power of that highest derivative (after clearing radicals/fractions).',
        table: {
          headers: ['Equation', 'Order', 'Degree'],
          rows: [
            ['$\\frac{dy}{dx} + y = e^x$', '1', '1'],
            ['$\\frac{d^2y}{dx^2} + 3\\frac{dy}{dx} = 0$', '2', '1'],
            ['$\\left(\\frac{d^2y}{dx^2}\\right)^3 + y = 0$', '2', '3'],
          ],
        },
      },
      {
        title: 'Linear vs Non-Linear',
        body: '**Linear**: y and all its derivatives appear to the first power only, no products between them.',
        cards: [
          { title: 'Linear ✓', content: '$$\\frac{dy}{dx} + 2y = x$$\n$$\\frac{d^2y}{dx^2} - 3y = \\sin x$$' },
          { title: 'Non-linear ✗', content: '$$y\\frac{dy}{dx} = x$$\n$$\\left(\\frac{dy}{dx}\\right)^2 = 1 - y^2$$' },
        ],
      },
    ],
  },
  {
    slug: 'formation',
    title: 'Formation of Differential Equations',
    order: 3,
    summary: 'n arbitrary constants → differentiate n times → eliminate constants → DE of order n.',
    sections: [
      {
        title: 'Formation Rule',
        body: 'To form a DE from a family of curves:\n1. Count the arbitrary constants (say n)\n2. Differentiate the equation n times\n3. Eliminate all n constants\n4. Result is a DE of order n',
        examples: [
          {
            label: 'Example 1 — one constant',
            problem: 'Given $y = Cx^2$. Eliminate C.',
            steps: [
              { label: 'Differentiate once', content: "$y' = 2Cx$" },
              { label: 'Divide equations', content: "$y'/y = 2Cx/Cx^2 = 2/x$" },
              { label: 'Result', content: '$$x\\frac{dy}{dx} - 2y = 0$$' },
            ],
          },
          {
            label: 'Example 2 — two constants',
            problem: 'Given $y = Ae^x + Be^{-x}$. Eliminate A and B.',
            steps: [
              { label: '1st derivative', content: "$y' = Ae^x - Be^{-x}$" },
              { label: '2nd derivative', content: "$y'' = Ae^x + Be^{-x} = y$" },
              { label: 'Result', content: "$$y'' - y = 0$$" },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'separable',
    title: 'Variable Separable Method',
    order: 4,
    summary: 'Rearrange so all y terms go left, all x terms go right, then integrate both sides.',
    sections: [
      {
        title: 'The Separable Method',
        body: 'If a DE can be written as $g(y)\\,dy = f(x)\\,dx$, integrate both sides:\n$$\\int g(y)\\,dy = \\int f(x)\\,dx$$',
        examples: [
          {
            label: 'Example 1',
            problem: 'Solve $\\frac{dy}{dx} = \\frac{x}{y}$',
            steps: [
              { label: 'Separate', content: '$y\\,dy = x\\,dx$' },
              { label: 'Integrate both sides', content: '$\\int y\\,dy = \\int x\\,dx$' },
              { label: 'General solution', content: '$$y^2 - x^2 = C$$' },
            ],
          },
          {
            label: 'Example 2 — with initial condition y(0) = 2',
            problem: 'Solve $\\frac{dy}{dx} = -2xy^2$',
            steps: [
              { label: 'Separate', content: '$\\frac{dy}{y^2} = -2x\\,dx$' },
              { label: 'Integrate', content: '$-\\frac{1}{y} = -x^2 + C$' },
              { label: 'Apply y(0) = 2', content: '$-\\frac{1}{2} = C$' },
              { label: 'Particular solution', content: '$$y = \\frac{2}{2x^2 + 1}$$' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'homogeneous',
    title: 'Homogeneous Equations',
    order: 5,
    summary: 'A DE is homogeneous if f(x,y) depends only on y/x. Substitute v = y/x to convert to separable.',
    sections: [
      {
        title: 'The Homogeneous Substitution',
        body: 'A DE $\\frac{dy}{dx} = f(x,y)$ is **homogeneous** if $f(tx, ty) = f(x,y)$.\n\n**Substitution:** Let $v = y/x$, so $y = vx$ and:\n$$\\frac{dy}{dx} = v + x\\frac{dv}{dx}$$\nThis converts the equation to a separable DE in v and x.',
        examples: [
          {
            label: 'Example',
            problem: 'Solve $\\frac{dy}{dx} = \\frac{y^2 - x^2}{2xy}$',
            steps: [
              { label: 'Substitute y = vx', content: '$v + x\\frac{dv}{dx} = \\frac{v^2 - 1}{2v}$' },
              { label: 'Simplify', content: '$x\\frac{dv}{dx} = \\frac{v^2-1}{2v} - v = \\frac{-(v^2+1)}{2v}$' },
              { label: 'Separate and integrate', content: '$\\ln(v^2+1) = -\\ln|x| + C$' },
              { label: 'Back-substitute v = y/x', content: '$$x^2 + y^2 = Cx$$' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'linear-de',
    title: 'Linear DE — Integrating Factor Method',
    order: 6,
    ref: 'H.K. Dass — Section 3.9, p.147',
    summary: 'Standard form: dy/dx + P(x)y = Q(x). Multiply by integrating factor μ = e^(∫P dx).',
    sections: [
      {
        title: 'Standard Form & Integrating Factor',
        body: '**Standard form:**\n$$\\frac{dy}{dx} + P(x)\\,y = Q(x)$$\nwhere P and Q are functions of x only.\n\n**Working Rule (H.K. Dass §3.9):**\n1. Write in standard form\n2. Find I.F. $= e^{\\int P\\,dx}$\n3. Solution: $y \\cdot (\\text{I.F.}) = \\int Q \\cdot (\\text{I.F.})\\,dx + C$',
        examples: [
          {
            label: 'Example 1 (H.K. Dass Ex.10)',
            problem: 'Solve $(x+1)\\frac{dy}{dx} - y = e^x(x+1)^2$',
            steps: [
              { label: 'Standard form', content: '$\\frac{dy}{dx} - \\frac{1}{x+1}y = e^x(x+1)$' },
              { label: 'Find I.F.', content: '$\\text{I.F.} = e^{\\int \\frac{-1}{x+1}dx} = \\frac{1}{x+1}$' },
              { label: 'Apply formula', content: '$\\frac{y}{x+1} = \\int e^x\\,dx + C$' },
              { label: 'General solution', content: '$$y = (x+1)(e^x + C)$$' },
            ],
          },
          {
            label: 'Example 2',
            problem: "Solve $y' + y = e^x$, $y(0) = 1$",
            steps: [
              { label: 'P = 1, Q = eˣ → I.F. = eˣ', content: '$\\frac{d}{dx}(e^x y) = e^{2x}$' },
              { label: 'Integrate', content: '$e^x y = \\frac{e^{2x}}{2} + C$' },
              { label: 'Apply y(0) = 1 → C = 1/2', content: '$$y = \\frac{e^x}{2} + \\frac{e^{-x}}{2} = \\cosh x$$' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'bernoulli',
    title: "Bernoulli's Equation",
    order: 7,
    ref: 'H.K. Dass — Section 3.10, p.150',
    summary: "Bernoulli form: dy/dx + Py = Qyⁿ. Substitute z = y^(1-n) to linearize.",
    sections: [
      {
        title: 'Bernoulli Form & Reduction',
        body: "**Standard Bernoulli form:**\n$$\\frac{dy}{dx} + P\\,y = Q\\,y^n$$\nThis is *non-linear* because of $y^n$. But a substitution converts it to linear.\n\n**Reduction steps:**\n1. Divide both sides by $y^n$: $\\frac{1}{y^n}\\frac{dy}{dx} + P \\cdot \\frac{1}{y^{n-1}} = Q$\n2. Let $z = y^{1-n}$, so $\\frac{dz}{dx} = \\frac{(1-n)}{y^n}\\frac{dy}{dx}$\n3. Equation becomes linear in z: $\\frac{dz}{dx} + (1-n)P\\,z = (1-n)Q$\n4. Solve using I.F. method, then back-substitute",
        examples: [
          {
            label: 'Example 1 (H.K. Dass Ex.13)',
            problem: 'Solve $x^2\\,dy + y(x+y)\\,dx = 0$',
            steps: [
              { label: 'Rewrite as dy/dx (n=2)', content: '$\\frac{dy}{dx} = -\\frac{y}{x} - \\frac{y^2}{x^2}$' },
              { label: 'Divide by y²', content: '$\\frac{1}{y^2}\\frac{dy}{dx} + \\frac{1}{xy} = -\\frac{1}{x^2}$' },
              { label: 'Let z = 1/y', content: '$\\frac{dz}{dx} - \\frac{z}{x} = \\frac{1}{x^2}$' },
              { label: 'I.F. = 1/x, integrate', content: '$\\frac{z}{x} = \\int \\frac{1}{x^3}\\,dx = -\\frac{1}{2x^2} + C$' },
              { label: 'Back-substitute z = 1/y', content: '$$\\frac{2}{xy} + \\frac{1}{x^2} = C$$' },
            ],
          },
          {
            label: 'Example 2 (H.K. Dass Ex.14) — log substitution',
            problem: 'Solve $x\\,\\frac{dy}{dx} = y\\log y - xye^x$',
            steps: [
              { label: 'Divide by xy', content: '$\\frac{1}{y}\\frac{dy}{dx} = \\frac{\\log y}{x} - e^x$' },
              { label: 'Let z = log y', content: '$\\frac{dz}{dx} - \\frac{z}{x} = -e^x$' },
              { label: 'I.F. = 1/x', content: '$\\frac{d}{dx}\\left(\\frac{z}{x}\\right) = -\\frac{e^x}{x}$' },
              { label: 'General solution', content: '$$x\\log y = xe^x - e^x + C$$' },
            ],
          },
          {
            label: 'Example 3',
            problem: "Solve $y' - y = xy^{-1}$",
            steps: [
              { label: 'Multiply by y (n = -1)', content: '$y\\frac{dy}{dx} - y^2 = x$' },
              { label: 'Let z = y²', content: '$\\frac{dz}{dx} - 2z = 2x$' },
              { label: 'I.F. = e^(-2x)', content: '$\\frac{d}{dx}(ze^{-2x}) = 2xe^{-2x}$' },
              { label: 'Integrate and solve', content: '$$y^2 + x + \\frac{1}{2} = Ce^{2x}$$' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'exact-de',
    title: 'Exact Differential Equations',
    order: 8,
    ref: 'H.K. Dass — Section 3.11, p.154',
    summary: 'A DE M dx + N dy = 0 is exact if ∂M/∂y = ∂N/∂x. Solution found by direct integration.',
    sections: [
      {
        title: 'Exactness Condition & Working Rule',
        body: 'A DE $M\\,dx + N\\,dy = 0$ is **exact** if it equals $dF = 0$ for some $F(x,y)$.\n\n**Condition for exactness:**\n$$\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$$\n\n**Working Rule (H.K. Dass §3.11):**\n1. **Step I:** Integrate M w.r.t. x, keeping y constant\n2. **Step II:** Integrate w.r.t. y *only those terms of N that do not contain x*\n3. **Step III:** Result of Step I + Result of Step II = C',
        examples: [
          {
            label: 'Example 1 (H.K. Dass Ex.21)',
            problem: 'Solve $(5x^4 + 3x^2y^2 - 2xy^3)\\,dx + (2x^3y - 3x^2y^2 - 5y^4)\\,dy = 0$',
            steps: [
              { label: 'Check exactness', content: '$\\frac{\\partial M}{\\partial y} = 6x^2y - 6xy^2 = \\frac{\\partial N}{\\partial x}$ ✓' },
              { label: 'Step I: ∫M dx (y constant)', content: '$x^5 + x^3y^2 - x^2y^3$' },
              { label: 'Step II: terms of N without x = −5y⁴', content: '$\\int -5y^4\\,dy = -y^5$' },
              { label: 'Solution', content: '$$x^5 + x^3y^2 - x^2y^3 - y^5 = C$$' },
            ],
          },
          {
            label: 'Example 2 (H.K. Dass Ex.22)',
            problem: 'Solve $(2xy\\cos x^2 - 2xy + 1)\\,dx + (\\sin x^2 - x^2 + 3)\\,dy = 0$',
            steps: [
              { label: 'Check exactness', content: '$\\frac{\\partial M}{\\partial y} = 2x\\cos x^2 - 2x = \\frac{\\partial N}{\\partial x}$ ✓' },
              { label: 'Step I: ∫M dx (let t = x²)', content: '$y\\sin x^2 - x^2y + x$' },
              { label: 'Step II: terms of N without x = 3', content: '$\\int 3\\,dy = 3y$' },
              { label: 'Solution', content: '$$y\\sin x^2 - x^2y + x + 3y = C$$' },
            ],
          },
        ],
      },
    ],
  },
]

export function getChapter(slug: string) {
  return CHAPTERS.find(c => c.slug === slug)
}

export function getChapterByOrder(order: number) {
  return CHAPTERS.find(c => c.order === order)
}
