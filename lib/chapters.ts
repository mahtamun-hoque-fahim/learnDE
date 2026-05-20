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
  body: string
  sideNote?: string
  examples?: Example[]
  cards?: { title: string; content: string }[]
  table?: { headers: string[]; rows: string[][] }
}

export interface Example {
  label: string
  problem: string
  difficulty?: 'easy' | 'medium' | 'hard'
  steps: { label: string; content: string }[]
}

export const CHAPTERS: Chapter[] = [

  // =====================================================================
  // CH 1 -- FOUNDATIONS: DEFINITIONS, ORDER, DEGREE AND FORMATION
  // =====================================================================
  {
    slug: 'foundations',
    title: 'Foundations -- Definitions, Order, Degree and Formation',
    order: 1,
    ref: 'H.K. Dass 3.1-3.3',
    summary: 'An equation containing derivatives is called a differential equation. We classify DEs by order, degree, and type (ODE vs PDE), and learn to form DEs by eliminating arbitrary constants.',
    sections: [
      {
        title: 'What is a Differential Equation?',
        body: 'An equation that contains derivatives is called a **differential equation (DE)**.\n\nA normal equation like $y = 3x + 2$ tells you the direct relationship between $y$ and $x$. A differential equation like $\\frac{dy}{dx} = 3$ tells you something about the **rate of change** of $y$ with respect to $x$.\n\nThere are two types:\n\n**Ordinary Differential Equation (ODE):** Only one independent variable is involved. All derivatives are ordinary derivatives ($d/dx$).\nExample: $\\frac{dy}{dx} + 3y = x$\n\n**Partial Differential Equation (PDE):** More than one independent variable. Derivatives are partial derivatives.\nExample: $\\frac{\\partial u}{\\partial x} + \\frac{\\partial u}{\\partial y} = 0$\n\nWe will only study ODEs in this course.',
        sideNote: 'Think of it this way: in algebra we solve for a number, but in differential equations we solve for a function. The solution is an entire curve, not a single point.',
        cards: [
          { title: 'Population growth', content: '$$\\frac{dP}{dt} = kP$$' },
          { title: "Newton's cooling", content: '$$\\frac{dT}{dt} = k(T - T_0)$$' },
          { title: 'RC circuit', content: '$$R\\frac{dq}{dt} + \\frac{q}{C} = V$$' },
        ],
      },
      {
        title: 'Order and Degree',
        body: '**Order** = the highest derivative that appears in the equation.\n- If the highest derivative is $dy/dx$, the order is 1.\n- If the highest derivative is $d^2y/dx^2$, the order is 2.\n- If the highest derivative is $d^3y/dx^3$, the order is 3.\n\n**Degree** = the power (exponent) of that highest-order derivative, BUT only after you have removed all roots and fractions from the derivative terms.\n\nImportant: If the equation contains $\\sin(dy/dx)$ or $e^{dy/dx}$ or $\\log(dy/dx)$, the degree is **not defined** because these are transcendental functions of the derivative.',
        sideNote: 'Always remove radicals and fractions from derivative terms FIRST, then read the degree. The degree of lower-order derivatives does not matter -- we only care about the highest-order derivative.',
        examples: [
          {
            label: 'Example 1',
            difficulty: 'easy',
            problem: 'Find the order and degree of $\\frac{d^2y}{dx^2} + a^2 x = 0$.',
            steps: [
              { label: 'Identify highest derivative', content: 'The highest derivative is $\\frac{d^2y}{dx^2}$, a second derivative.' },
              { label: 'Read the order', content: 'Order = 2.' },
              { label: 'Read the degree', content: 'The power of $\\frac{d^2y}{dx^2}$ is 1. Degree = 1.' },
            ],
          },
          {
            label: 'Example 2',
            difficulty: 'medium',
            problem: 'Find the order and degree of $\\left[1 + \\left(\\frac{dy}{dx}\\right)^2\\right]^{3/2} = \\frac{d^2y}{dx^2}$.',
            steps: [
              { label: 'Highest derivative', content: '$\\frac{d^2y}{dx^2}$ appears, so Order = 2.' },
              { label: 'Remove the fractional power', content: 'Square both sides: $\\left[1 + (dy/dx)^2\\right]^3 = (d^2y/dx^2)^2$' },
              { label: 'Read degree', content: 'Now $d^2y/dx^2$ has power 2. Degree = 2.' },
            ],
          },
          {
            label: 'Example 3',
            difficulty: 'hard',
            problem: 'Find the order and degree of $x^2(d^2y/dx^2)^3 + y(dy/dx)^4 + y^4 = 0$.',
            steps: [
              { label: 'Highest derivative', content: '$d^2y/dx^2$ is present, so Order = 2.' },
              { label: 'Power of highest derivative', content: 'It is raised to the third power.' },
              { label: 'Degree', content: 'Degree = 3. Note: $(dy/dx)^4$ has lower order so it does not determine the degree.' },
            ],
          },
        ],
      },
      {
        title: 'Formation of Differential Equations',
        body: 'If a relation between $x$ and $y$ contains arbitrary constants, we can form a DE by:\n1. Differentiating the relation as many times as there are constants\n2. Eliminating all the constants\n\nThe number of arbitrary constants = the order of the resulting DE.',
        sideNote: 'When we write $(dy/dx)^2$, it means "square the entire derivative," not $d^2y/dx^2$. These are completely different things!',
        examples: [
          {
            label: 'Example 1 (Easy)',
            difficulty: 'easy',
            problem: 'Form the DE from $y = Ax + A^2$.',
            steps: [
              { label: 'Count constants', content: 'One constant $A$, so differentiate once.' },
              { label: 'Differentiate', content: '$dy/dx = A$, so $A = dy/dx$.' },
              { label: 'Substitute back', content: '$y = (dy/dx) \\cdot x + (dy/dx)^2$' },
              { label: 'Result', content: 'First-order DE (one constant eliminated). This is Clairaut\'s equation form.' },
            ],
          },
          {
            label: 'Example 2 (Medium)',
            difficulty: 'medium',
            problem: 'Form the DE from $y = A\\cos x + B\\sin x$.',
            steps: [
              { label: 'Count constants', content: 'Two constants ($A, B$), so differentiate twice.' },
              { label: 'First differentiation', content: '$dy/dx = -A\\sin x + B\\cos x$' },
              { label: 'Second differentiation', content: '$d^2y/dx^2 = -A\\cos x - B\\sin x$' },
              { label: 'Key observation', content: '$d^2y/dx^2 = -(A\\cos x + B\\sin x) = -y$' },
              { label: 'Final DE', content: '$$d^2y/dx^2 + y = 0$$' },
            ],
          },
          {
            label: 'Example 3 (Hard)',
            difficulty: 'hard',
            problem: 'Obtain the DE of which $y^2 = 4a(x + a)$ is a solution.',
            steps: [
              { label: 'Setup', content: 'One constant ($a$), differentiate once. But $a$ appears nonlinearly.' },
              { label: 'Expand and differentiate', content: '$y^2 = 4ax + 4a^2$. Differentiating: $2yy\' = 4a$, so $a = yy\'/2$.' },
              { label: 'Substitute back', content: '$y^2 = 4(yy\'/2)x + 4(yy\'/2)^2 = 2xyy\' + y^2(y\')^2$' },
              { label: 'Final DE', content: '$$y^2(y\')^2 + 2xyy\' - y^2 = 0$$' },
            ],
          },
        ],
      },
    ],
  },

  // =====================================================================
  // CH 2 -- VARIABLES SEPARABLE METHOD
  // =====================================================================
  {
    slug: 'separable',
    title: 'Variables Separable Method',
    order: 2,
    ref: 'H.K. Dass 3.6',
    summary: 'If you can rearrange a first-order DE so that all y terms (including dy) are on one side and all x terms (including dx) are on the other, just integrate both sides.',
    sections: [
      {
        title: 'What is this method?',
        body: 'If you can rearrange a first-order DE so that:\n- ALL the $y$ stuff (including $dy$) is on one side\n- ALL the $x$ stuff (including $dx$) is on the other side\n\nthen you have "separated the variables." Just integrate both sides.\n\n**Working Rule:**\n1. Rearrange: $f(y)\\,dy = g(x)\\,dx$\n2. Integrate both sides: $\\int f(y)\\,dy = \\int g(x)\\,dx$\n3. Add constant $C$ on one side.',
        sideNote: '$\\int \\frac{1}{1+t^2}\\,dt = \\tan^{-1}(t)$ and $\\int \\frac{1}{\\sqrt{1-t^2}}\\,dt = \\sin^{-1}(t)$ are standard formulae you should memorize.',
      },
      {
        title: 'Direct Separation and Substitution Type',
        body: 'Sometimes variables cannot be separated directly. Common substitutions:\n- If $(x + y)$ appears: put $z = x + y$\n- If $(ax + by + c)$ appears: put $z = ax + by + c$\n\nAfter substitution, the new equation in $z$ becomes separable.',
        examples: [
          {
            label: 'Example 1 (Easy)',
            difficulty: 'easy',
            problem: 'Solve $\\frac{dy}{dx} = \\frac{1+y^2}{1+x^2}$.',
            steps: [
              { label: 'Separate variables', content: '$\\frac{dy}{1+y^2} = \\frac{dx}{1+x^2}$' },
              { label: 'Integrate both sides', content: '$\\tan^{-1}(y) = \\tan^{-1}(x) + C$' },
              { label: 'Final answer', content: '$$\\tan^{-1}(y) - \\tan^{-1}(x) = C$$' },
            ],
          },
          {
            label: 'Example 2 (Medium)',
            difficulty: 'medium',
            problem: 'Solve $\\frac{dy}{dx} = \\frac{x(2\\log x + 1)}{\\sin y + y\\cos y}$.',
            steps: [
              { label: 'Separate', content: '$(\\sin y + y\\cos y)\\,dy = x(2\\log x + 1)\\,dx$' },
              { label: 'Integrate left side', content: 'Using integration by parts on $\\int y\\cos y\\,dy$: result is $y\\sin y$.' },
              { label: 'Integrate right side', content: 'The terms cancel beautifully to give $x^2\\log x$.' },
              { label: 'Final answer', content: '$$y\\sin y = x^2\\log x + C$$' },
            ],
          },
          {
            label: 'Example 3 (Substitution)',
            difficulty: 'medium',
            problem: 'Solve $\\cos(x+y)\\,dy = dx$.',
            steps: [
              { label: 'Rewrite', content: '$dy/dx = \\sec(x+y)$. Not directly separable.' },
              { label: 'Substitute z = x + y', content: '$dz/dx = 1 + dy/dx = 1 + \\sec z$.' },
              { label: 'Separate and integrate', content: 'Using half-angle identities: $z - \\tan(z/2) = x + C$.' },
              { label: 'Substitute back', content: '$$y - \\tan\\frac{x+y}{2} = C$$' },
            ],
          },
          {
            label: 'Example 4 (Hard)',
            difficulty: 'hard',
            problem: 'Solve $(2x^2+3y^2-7)x\\,dx - (3x^2+2y^2-8)y\\,dy = 0$.',
            steps: [
              { label: 'Rearrange ratio', content: '$\\frac{x\\,dx}{y\\,dy} = \\frac{3x^2+2y^2-8}{2x^2+3y^2-7}$' },
              { label: 'Apply componendo-dividendo', content: 'Recognize exact differentials $d(x^2+y^2)$ and $d(x^2-y^2)$.' },
              { label: 'Integrate', content: '$\\ln|x^2+y^2-3| = 5\\ln|x^2-y^2-1| + \\ln C$' },
              { label: 'Final answer', content: '$$x^2 + y^2 - 3 = C(x^2 - y^2 - 1)^5$$' },
            ],
          },
        ],
      },
    ],
  },

  // =====================================================================
  // CH 3 -- HOMOGENEOUS DIFFERENTIAL EQUATIONS
  // =====================================================================
  {
    slug: 'homogeneous',
    title: 'Homogeneous Differential Equations',
    order: 3,
    ref: 'H.K. Dass 3.7',
    summary: 'A DE dy/dx = f(x,y)/g(x,y) is homogeneous if f and g are homogeneous functions of the same degree. Substitute y = vx to convert it into a separable equation.',
    sections: [
      {
        title: 'What is a Homogeneous DE?',
        body: 'A DE of the form $\\frac{dy}{dx} = \\frac{f(x,y)}{g(x,y)}$ is called **homogeneous** if both $f$ and $g$ are homogeneous functions of the **same degree**.\n\n**Quick test:** Replace every $x$ with $tx$ and every $y$ with $ty$. If all the $t$\'s cancel out, it is homogeneous.\n\n**Solving method: Put $y = vx$** (where $v$ is a new function of $x$).\nThen: $dy/dx = v + x(dv/dx)$.\n\nThis substitution ALWAYS converts a homogeneous DE into a separable one. After solving, replace $v = y/x$.',
        sideNote: 'If $y = vx$ makes the algebra ugly, try $x = vy$ instead. Choose whichever makes the separation cleaner.',
        examples: [
          {
            label: 'Example 1 (Easy)',
            difficulty: 'easy',
            problem: 'Solve $(x^2-y^2)\\,dx + 2xy\\,dy = 0$.',
            steps: [
              { label: 'Write in dy/dx form', content: '$dy/dx = (y^2-x^2)/(2xy)$. Degree 2 each. Homogeneous.' },
              { label: 'Put y = vx', content: '$v + x(dv/dx) = (v^2-1)/(2v)$' },
              { label: 'Isolate and separate', content: '$x(dv/dx) = -(v^2+1)/(2v)$, so $2v/(v^2+1)\\,dv = -dx/x$.' },
              { label: 'Integrate', content: '$\\ln(v^2+1) = -\\ln|x| + \\ln C$' },
              { label: 'Replace v = y/x', content: '$$x^2 + y^2 = Cx$$' },
            ],
          },
          {
            label: 'Example 2 (Medium)',
            difficulty: 'medium',
            problem: 'Solve $\\frac{dy}{dx} = \\frac{y}{x} + \\sin\\frac{y}{x}$.',
            steps: [
              { label: 'Put y = vx', content: '$v + x(dv/dx) = v + \\sin v$, so $x(dv/dx) = \\sin v$.' },
              { label: 'Separate', content: '$\\csc v\\,dv = dx/x$' },
              { label: 'Integrate and replace v = y/x', content: '$$\\ln|\\tan(y/(2x))| = \\ln|x| + C$$' },
            ],
          },
          {
            label: 'Example 3 (Hard -- using x = vy)',
            difficulty: 'hard',
            problem: 'Solve $(x^2+y^2)\\,dy = xy\\,dx$.',
            steps: [
              { label: 'Try x = vy', content: '$dx/dy = (x^2+y^2)/(xy)$. Put $x = vy$.' },
              { label: 'Substitute', content: '$v + y(dv/dy) = (v^2+1)/v$, so $y(dv/dy) = 1/v$.' },
              { label: 'Separate and integrate', content: '$v\\,dv = dy/y$, giving $v^2/2 = \\ln|y| + C$.' },
              { label: 'Replace v = x/y', content: '$$x^2 = 2y^2\\ln|y| + Cy^2$$' },
            ],
          },
        ],
      },
    ],
  },

  // =====================================================================
  // CH 4 -- EQUATIONS REDUCIBLE TO HOMOGENEOUS FORM
  // =====================================================================
  {
    slug: 'reducible-homogeneous',
    title: 'Equations Reducible to Homogeneous Form',
    order: 4,
    ref: 'H.K. Dass 3.8',
    summary: 'Equations like dy/dx = (ax+by+c)/(Ax+By+C) look almost homogeneous, but constants c and C spoil things. A coordinate shift or substitution fixes this.',
    sections: [
      {
        title: 'Two Cases',
        body: '**Case I: $a/A \\neq b/B$**\nSubstitute $x = X + h$, $y = Y + k$. Choose $h, k$ so that $ah + bk + c = 0$ and $Ah + Bk + C = 0$. This removes the constants, giving a homogeneous equation.\n\n**Case II: $a/A = b/B$** (the "failure" case)\nThe above fails because $h, k$ become infinite. Put $z = ax + by$ and use separation of variables.',
        sideNote: 'Case II occurs when the two lines are parallel. Since parallel lines never intersect, we cannot find a finite $(h, k)$.',
        examples: [
          {
            label: 'Example 1 (Case I)',
            difficulty: 'medium',
            problem: 'Solve $\\frac{dy}{dx} = \\frac{x+2y-3}{2x+y-3}$.',
            steps: [
              { label: 'Check', content: '$a/A = 1/2 \\neq 2/1 = b/B$. Case I.' },
              { label: 'Find h, k', content: 'Solving: $h = 1, k = 1$. Put $X = x-1, Y = y-1$.' },
              { label: 'Homogeneous equation', content: '$dY/dX = (X+2Y)/(2X+Y)$. Put $Y = vX$, use partial fractions.' },
              { label: 'Final answer', content: '$$x + y - 2 = a(x - y)^3$$' },
            ],
          },
          {
            label: 'Example 2 (Case II)',
            difficulty: 'medium',
            problem: 'Solve $(x + 2y)(dx - dy) = dx + dy$.',
            steps: [
              { label: 'Rewrite', content: '$dy/dx = (x+2y-1)/(x+2y+1)$. Here $a/A = b/B = 1$. Case II.' },
              { label: 'Put z = x + 2y', content: '$dz/dx = (3z-1)/(z+1)$.' },
              { label: 'Separate and integrate', content: '$\\frac{z+1}{3z-1}\\,dz = dx$.' },
              { label: 'Final answer', content: '$$3x - 3y + a = 2\\log(3x + 6y - 1)$$' },
            ],
          },
        ],
      },
    ],
  },

  // =====================================================================
  // CH 5 -- LINEAR DEs OF FIRST ORDER
  // =====================================================================
  {
    slug: 'linear-first-order',
    title: 'Linear Differential Equations of First Order',
    order: 5,
    ref: 'H.K. Dass 3.9',
    summary: 'A first-order linear DE has the form dy/dx + P(x)y = Q(x). Multiply by the integrating factor e^(integral P dx) and the left side becomes an exact derivative.',
    sections: [
      {
        title: 'The Standard Form and I.F. Method',
        body: 'A first-order linear DE:\n$$\\frac{dy}{dx} + P(x) \\cdot y = Q(x)$$\n\n**Step 1:** Compute the Integrating Factor: I.F. $= e^{\\int P\\,dx}$\n\n**Step 2:** Solution: $y \\cdot (\\text{I.F.}) = \\int Q \\cdot (\\text{I.F.})\\,dx + C$\n\nMultiplying by I.F. makes the left side become $\\frac{d}{dx}[y \\cdot \\text{I.F.}]$, which integrates directly.',
        sideNote: '$e^{\\ln(\\text{something})} = \\text{something}$. This is the most common trick in finding I.F.',
        examples: [
          {
            label: 'Example 1 (Easy)',
            difficulty: 'easy',
            problem: 'Solve $\\frac{dy}{dx} + \\frac{1}{x}y = x^3 - 3$.',
            steps: [
              { label: 'I.F.', content: '$e^{\\int dx/x} = e^{\\ln x} = x$' },
              { label: 'Apply formula', content: '$xy = \\int (x^4 - 3x)\\,dx + C$' },
              { label: 'Answer', content: '$$xy = x^5/5 - 3x^2/2 + C$$' },
            ],
          },
          {
            label: 'Example 2 (Medium)',
            difficulty: 'medium',
            problem: 'Solve $x\\log x \\cdot \\frac{dy}{dx} + y = 2\\log x$.',
            steps: [
              { label: 'Standard form', content: '$dy/dx + y/(x\\log x) = 2/x$.' },
              { label: 'I.F.', content: '$e^{\\int dx/(x\\log x)} = e^{\\ln(\\log x)} = \\log x$' },
              { label: 'Answer', content: '$$y\\log x = (\\log x)^2 + C$$' },
            ],
          },
          {
            label: 'Example 3 (Linear in x)',
            difficulty: 'hard',
            problem: 'Solve $(1+y^2)\\,dx = (\\tan^{-1}y - x)\\,dy$.',
            steps: [
              { label: 'Rewrite', content: '$dx/dy + x/(1+y^2) = \\tan^{-1}y/(1+y^2)$. Linear in $x$.' },
              { label: 'I.F.', content: '$e^{\\tan^{-1}y}$' },
              { label: 'Evaluate RHS by substitution', content: 'Put $t = \\tan^{-1}y$. RHS becomes $\\int te^t\\,dt = te^t - e^t$.' },
              { label: 'Answer', content: '$$x = (\\tan^{-1}y - 1) + Ce^{-\\tan^{-1}y}$$' },
            ],
          },
        ],
      },
    ],
  },

  // =====================================================================
  // CH 6 -- BERNOULLI EQUATIONS
  // =====================================================================
  {
    slug: 'bernoulli',
    title: 'Bernoulli Equations',
    order: 6,
    ref: 'H.K. Dass 3.10',
    summary: 'A Bernoulli equation has the form dy/dx + Py = Qy^n. Divide by y^n, substitute z = y^(1-n) to convert it into a linear equation.',
    sections: [
      {
        title: 'The Bernoulli Reduction',
        body: 'The form: $\\frac{dy}{dx} + Py = Qy^n$ where $n \\neq 0, 1$.\n\n**Method:**\n1. Divide by $y^n$\n2. Let $z = y^{1-n}$\n3. Equation becomes linear: $\\frac{dz}{dx} + (1-n)Pz = (1-n)Q$\n4. Solve using I.F. method\n5. Recover $y$ from $z = y^{1-n}$.',
        examples: [
          {
            label: 'Example 1',
            difficulty: 'easy',
            problem: 'Solve $x^2\\,dy + y(x+y)\\,dx = 0$.',
            steps: [
              { label: 'Rewrite', content: '$dy/dx + y/x = -y^2/x^2$. Bernoulli with $n = 2$.' },
              { label: 'Divide by y^2, put z = 1/y', content: '$dz/dx - z/x = 1/x^2$. I.F. $= 1/x$.' },
              { label: 'Answer', content: '$$1/(xy) = C - 1/(2x^2)$$' },
            ],
          },
          {
            label: 'Example 2',
            difficulty: 'medium',
            problem: 'Solve $\\frac{dy}{dx} = y\\tan x - y^2\\sec x$.',
            steps: [
              { label: 'Bernoulli', content: '$n = 2$. Divide by $y^2$, put $z = 1/y$.' },
              { label: 'Linear equation', content: '$dz/dx + z\\tan x = \\sec x$. I.F. $= \\sec x$.' },
              { label: 'Answer', content: '$$\\sec x = y(\\tan x + C)$$' },
            ],
          },
          {
            label: 'Example 3',
            difficulty: 'medium',
            problem: 'Solve $\\tan y\\,\\frac{dy}{dx} + \\tan x = \\cos y\\cos^2 x$.',
            steps: [
              { label: 'Multiply by sec y', content: '$\\sec y\\tan y\\,dy/dx + \\sec y\\tan x = \\cos^2 x$.' },
              { label: 'Substitute z = sec y', content: '$dz/dx + z\\tan x = \\cos^2 x$. I.F. $= \\sec x$.' },
              { label: 'Answer', content: '$$\\sec y = (\\sin x + C)\\cos x$$' },
            ],
          },
        ],
      },
    ],
  },

  // =====================================================================
  // CH 7 -- EXACT DIFFERENTIAL EQUATIONS
  // =====================================================================
  {
    slug: 'exact',
    title: 'Exact Differential Equations',
    order: 7,
    ref: 'H.K. Dass 3.11-3.12',
    summary: 'M dx + N dy = 0 is exact if dM/dy = dN/dx. The solution: integrate M w.r.t. x (y constant) plus the y-only terms of N integrated w.r.t. y.',
    sections: [
      {
        title: 'Exactness and Solution',
        body: '$M\\,dx + N\\,dy = 0$ is **exact** if $\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$.\n\n**How to Solve:**\n1. Verify: $\\partial M/\\partial y = \\partial N/\\partial x$.\n2. Integrate $M$ w.r.t. $x$ (y constant) $\\to I_1$.\n3. From $N$, identify terms without $x$. Integrate w.r.t. $y$ $\\to I_2$.\n4. Solution: $I_1 + I_2 = C$.',
      },
      {
        title: 'Integrating Factors',
        body: 'If not exact, multiply by an I.F.:\n\n**Rule 1:** If $(\\partial M/\\partial y - \\partial N/\\partial x)/N = f(x)$, then I.F. $= e^{\\int f(x)\\,dx}$.\n**Rule 2:** If $(\\partial N/\\partial x - \\partial M/\\partial y)/M = g(y)$, then I.F. $= e^{\\int g(y)\\,dy}$.\n**Rule 3:** If $M = yf_1(xy)$, $N = xf_2(xy)$, then I.F. $= 1/(Mx - Ny)$.\n**Rule 5:** If homogeneous and $Mx + Ny \\neq 0$, then I.F. $= 1/(Mx + Ny)$.',
        examples: [
          {
            label: 'Example 1 (Exact)',
            difficulty: 'easy',
            problem: 'Solve $(5x^4 + 3x^2y^2 - 2xy^3)dx + (2x^3y - 3x^2y^2 - 5y^4)dy = 0$.',
            steps: [
              { label: 'Verify', content: '$\\partial M/\\partial y = 6x^2y - 6xy^2 = \\partial N/\\partial x$. Exact.' },
              { label: 'Integrate M w.r.t. x', content: '$x^5 + x^3y^2 - x^2y^3$.' },
              { label: 'N terms without x', content: '$-5y^4 \\to -y^5$.' },
              { label: 'Solution', content: '$$x^5 + x^3y^2 - x^2y^3 - y^5 = C$$' },
            ],
          },
          {
            label: 'Example 2 (Using Rule 5 I.F.)',
            difficulty: 'hard',
            problem: 'Solve $(x^3 + y^3)dx - xy^2\\,dy = 0$.',
            steps: [
              { label: 'Homogeneous, degree 3', content: '$Mx + Ny = x^4 \\neq 0$. I.F. $= 1/x^4$.' },
              { label: 'Multiply and verify exact', content: '$(1/x + y^3/x^4)dx - (y^2/x^3)dy = 0$. Now exact.' },
              { label: 'Solution', content: '$$\\ln|x| - y^3/(3x^3) = C$$' },
            ],
          },
        ],
      },
    ],
  },

  // =====================================================================
  // CH 8 -- SECOND ORDER LINEAR DEs WITH CONSTANT COEFFICIENTS
  // =====================================================================
  {
    slug: 'second-order',
    title: 'Second Order Linear DEs with Constant Coefficients',
    order: 8,
    ref: 'H.K. Dass 3.18-3.25',
    summary: 'For ay\'\' + by\' + cy = R(x), the complete solution is y = C.F. + P.I. The C.F. comes from the auxiliary equation; the P.I. depends on the form of R(x).',
    sections: [
      {
        title: 'The Complementary Function',
        body: 'General form: $ay\'\' + by\' + cy = R(x)$. Solution: $y = \\text{C.F.} + \\text{P.I.}$\n\nFor C.F., set $R = 0$, assume $y = e^{mx}$. Get the **Auxiliary Equation**: $am^2 + bm + c = 0$.\n\n**Case I -- Distinct real roots $m_1, m_2$:** C.F. $= C_1 e^{m_1 x} + C_2 e^{m_2 x}$\n**Case II -- Repeated roots $m, m$:** C.F. $= (C_1 + C_2 x)e^{mx}$\n**Case III -- Complex roots $\\alpha \\pm i\\beta$:** C.F. $= e^{\\alpha x}[C_1\\cos\\beta x + C_2\\sin\\beta x]$',
        sideNote: 'The A.E. is just a quadratic. Use the quadratic formula if factoring is difficult.',
      },
      {
        title: 'Particular Integrals',
        body: 'Write $f(D)y = R$ where $D = d/dx$. Then P.I. $= R/f(D)$.\n\n**Type 1: $R = e^{ax}$** $\\to$ P.I. $= e^{ax}/f(a)$. If $f(a) = 0$, multiply by $x$.\n**Type 2: $R = \\sin ax$ or $\\cos ax$** $\\to$ Replace $D^2$ by $-a^2$. If 0 results, multiply by $x$.\n**Type 3: $R = x^n$** $\\to$ Expand $[f(D)]^{-1}$ by binomial series.\n**Type 4: $R = e^{ax}\\phi(x)$** $\\to$ P.I. $= e^{ax} \\cdot \\phi(x)/f(D+a)$ (exponential shift).',
        examples: [
          {
            label: 'Example 1 (Distinct roots)',
            difficulty: 'easy',
            problem: 'Solve $y\'\' - 8y\' + 15y = 0$.',
            steps: [
              { label: 'A.E.', content: '$(m-3)(m-5) = 0$.' },
              { label: 'Answer', content: '$$y = C_1 e^{3x} + C_2 e^{5x}$$' },
            ],
          },
          {
            label: 'Example 2 (P.I. with e^ax)',
            difficulty: 'medium',
            problem: 'Solve $(D^2 + 6D + 9)y = 5e^{3x}$.',
            steps: [
              { label: 'A.E.', content: '$(m+3)^2 = 0$. C.F. $= (C_1 + C_2 x)e^{-3x}$.' },
              { label: 'P.I.', content: '$5e^{3x}/(9+18+9) = 5e^{3x}/36$.' },
              { label: 'Answer', content: '$$y = (C_1 + C_2 x)e^{-3x} + 5e^{3x}/36$$' },
            ],
          },
          {
            label: 'Example 3 (Failure case)',
            difficulty: 'hard',
            problem: 'Solve $(D^2 + 4)y = \\cos 2x$.',
            steps: [
              { label: 'C.F.', content: '$A\\cos 2x + B\\sin 2x$.' },
              { label: 'P.I. fails', content: '$\\cos 2x/(-4+4) = 0/0$. Multiply by $x$.' },
              { label: 'Answer', content: '$$y = A\\cos 2x + B\\sin 2x + (x/4)\\sin 2x$$' },
            ],
          },
          {
            label: 'Example 4 (Exponential shift)',
            difficulty: 'hard',
            problem: 'Solve $(D^2 - 4D + 4)y = x^3 e^{2x}$.',
            steps: [
              { label: 'C.F.', content: '$(C_1 + C_2 x)e^{2x}$.' },
              { label: 'Exponential shift', content: 'P.I. $= e^{2x} \\cdot x^3/D^2$. Integrate $x^3$ twice: $x^5/20$.' },
              { label: 'Answer', content: '$$y = (C_1 + C_2 x)e^{2x} + (x^5/20)e^{2x}$$' },
            ],
          },
        ],
      },
    ],
  },

  // =====================================================================
  // CH 9 -- CAUCHY-EULER EQUATIONS
  // =====================================================================
  {
    slug: 'cauchy-euler',
    title: 'Cauchy-Euler Equations',
    order: 9,
    ref: 'H.K. Dass 3.28',
    summary: 'A Cauchy-Euler equation has variable coefficients as powers of x. Substitute x = e^z to convert it into a constant-coefficient equation.',
    sections: [
      {
        title: 'The Transformation',
        body: 'Form: $x^2 y\'\' + axy\' + by = f(x)$.\n\nPut $x = e^z$ (so $z = \\ln x$, $D = d/dz$).\n\n**Rules:** $xy\' = Dy$, $x^2 y\'\' = D(D-1)y$, $x^3 y\'\'\' = D(D-1)(D-2)y$.\n\nAfter substitution, solve the constant-coefficient equation in $z$, then replace $z = \\ln x$.',
        examples: [
          {
            label: 'Example 1',
            difficulty: 'easy',
            problem: 'Solve $x^2 y\'\' + xy\' + y = \\sin(2\\ln x)$.',
            steps: [
              { label: 'Substitute', content: '$(D^2+1)y = \\sin 2z$. C.F. $= C_1\\cos z + C_2\\sin z$.' },
              { label: 'P.I.', content: '$\\sin 2z/(-4+1) = -\\sin 2z/3$.' },
              { label: 'Answer', content: '$$y = C_1\\cos(\\ln x) + C_2\\sin(\\ln x) - \\tfrac{1}{3}\\sin(2\\ln x)$$' },
            ],
          },
          {
            label: 'Example 2',
            difficulty: 'medium',
            problem: 'Solve $x^2 y\'\' - 2xy\' - 4y = x^4$.',
            steps: [
              { label: 'Substitute', content: '$(D^2-3D-4)y = e^{4z}$. Roots: $m = 4, -1$.' },
              { label: 'P.I. fails (m=4 is root)', content: 'Multiply by $z$: P.I. $= ze^{4z}/5$.' },
              { label: 'Answer', content: '$$y = C_1/x + C_2 x^4 + (x^4\\ln x)/5$$' },
            ],
          },
        ],
      },
    ],
  },

  // =====================================================================
  // CH 10 -- VARIATION OF PARAMETERS
  // =====================================================================
  {
    slug: 'variation-parameters',
    title: 'Variation of Parameters',
    order: 10,
    ref: 'H.K. Dass 3.30',
    summary: 'Works for ANY second-order linear DE. Especially useful when R(x) is sec x, tan x, cosec x, or log x where standard operator methods fail.',
    sections: [
      {
        title: 'The Method',
        body: 'Given C.F. $= Ay_1 + By_2$, the P.I. $= uy_1 + vy_2$ where:\n$$u = \\int \\frac{-y_2 R}{W}\\,dx, \\quad v = \\int \\frac{y_1 R}{W}\\,dx$$\nwhere $W = y_1 y_2\' - y_1\' y_2$ is the **Wronskian**.',
        examples: [
          {
            label: 'Example 1',
            difficulty: 'medium',
            problem: 'Solve $y\'\' + y = \\csc x$.',
            steps: [
              { label: 'C.F.', content: '$y_1 = \\cos x, y_2 = \\sin x, W = 1$.' },
              { label: 'u and v', content: '$u = -x$, $v = \\ln|\\sin x|$.' },
              { label: 'Answer', content: '$$y = C_1\\cos x + C_2\\sin x - x\\cos x + \\sin x\\ln|\\sin x|$$' },
            ],
          },
          {
            label: 'Example 2',
            difficulty: 'medium',
            problem: 'Solve $y\'\' + y = \\tan x$.',
            steps: [
              { label: 'C.F.', content: '$y_1 = \\cos x, y_2 = \\sin x, W = 1$.' },
              { label: 'Compute u', content: '$u = \\sin x - \\ln|\\sec x + \\tan x|$.' },
              { label: 'Compute v', content: '$v = -\\cos x$.' },
              { label: 'P.I. simplifies to', content: '$-\\cos x\\ln|\\sec x + \\tan x|$.' },
              { label: 'Answer', content: '$$y = A\\cos x + B\\sin x - \\cos x\\ln|\\sec x + \\tan x|$$' },
            ],
          },
        ],
      },
    ],
  },

  // =====================================================================
  // CH 11 -- SIMULTANEOUS DIFFERENTIAL EQUATIONS
  // =====================================================================
  {
    slug: 'simultaneous',
    title: 'Simultaneous Differential Equations',
    order: 11,
    ref: 'H.K. Dass 3.31',
    summary: 'When two dependent variables are functions of a single independent variable with linked derivatives, eliminate one variable to get a single ODE, solve, then back-substitute.',
    sections: [
      {
        title: 'Working Rule',
        body: '1. Write equations using $D = d/dt$.\n2. Eliminate $y$ (or $x$) algebraically.\n3. Solve the resulting single ODE.\n4. Find the other variable by substituting back into an ORIGINAL equation.',
        sideNote: 'Always find the second variable by substituting back. Do not solve from scratch.',
        examples: [
          {
            label: 'Example 1',
            difficulty: 'easy',
            problem: 'Solve $dx/dt = y + 1$, $dy/dt = x + 1$.',
            steps: [
              { label: 'Eliminate y', content: '$(D^2 - 1)x = 1$. A.E.: $m = \\pm 1$.' },
              { label: 'x', content: '$x = c_1 e^t + c_2 e^{-t} - 1$.' },
              { label: 'y from equation (1)', content: '$y = c_1 e^t - c_2 e^{-t} - 1$.' },
            ],
          },
          {
            label: 'Example 2',
            difficulty: 'medium',
            problem: 'Solve $dx/dt + y = \\sin t$, $dy/dt + x = \\cos t$, with $y(0) = 0, x(0) = 2$.',
            steps: [
              { label: 'Eliminate to get', content: '$(D^2 - 1)y = -2\\sin t$.' },
              { label: 'Solve', content: '$y = C_1 e^t + C_2 e^{-t} + \\sin t$.' },
              { label: 'Apply conditions', content: '$C_1 = -1, C_2 = 1$.' },
              { label: 'Answer', content: '$x = e^t + e^{-t}$, $y = -e^t + e^{-t} + \\sin t$.' },
            ],
          },
        ],
      },
    ],
  },

  // =====================================================================
  // CH 12 -- APPLICATIONS OF DIFFERENTIAL EQUATIONS
  // =====================================================================
  {
    slug: 'applications',
    title: 'Applications of Differential Equations',
    order: 12,
    ref: 'H.K. Dass 3.14-3.17',
    summary: 'DEs model real-world phenomena: electrical circuits, Newton\'s cooling, orthogonal trajectories, population growth/decay, spring-mass systems, and more.',
    sections: [
      {
        title: 'Electrical Circuits',
        body: '**L-R Series Circuit:** $L\\frac{di}{dt} + Ri = E$. Solution: $i = \\frac{E}{R}[1 - e^{-Rt/L}]$.\n\n**R-C Series Circuit:** $R\\frac{dq}{dt} + q/C = E$.',
        examples: [
          {
            label: 'Circuit Example',
            difficulty: 'medium',
            problem: 'R = 15 ohms, L = 10 H, E = 90 V. Find current after 2 seconds.',
            steps: [
              { label: 'DE', content: '$di/dt + 1.5i = 9$. Solution: $i = 6(1 - e^{-1.5t})$.' },
              { label: 'At t = 2', content: '$i = 6(1 - e^{-3}) \\approx 5.70$ A.' },
            ],
          },
        ],
      },
      {
        title: "Newton's Law of Cooling",
        body: '$\\frac{dT}{dt} = k(T - T_{\\text{surr}})$. Solution: $T - T_{\\text{surr}} = Ae^{kt}$.',
        examples: [
          {
            label: 'Cooling Example',
            difficulty: 'medium',
            problem: 'Body cools from 100C to 75C in 1 min (air at 25C). Find T at 3 min.',
            steps: [
              { label: 'Setup', content: '$T - 25 = 75e^{kt}$. At $t=1$: $e^k = 2/3$.' },
              { label: 'At t = 3', content: '$T = 25 + 75(2/3)^3 \\approx 47.22$C.' },
            ],
          },
        ],
      },
      {
        title: 'Orthogonal Trajectories',
        body: 'Two families are orthogonal trajectories if they cut at right angles.\n\n**Rule:** Find DE of family, replace $dy/dx$ by $-dx/dy$, solve.',
        examples: [
          {
            label: 'OT of xy = c',
            difficulty: 'easy',
            problem: 'Find the orthogonal trajectories of $xy = c$.',
            steps: [
              { label: 'DE of family', content: '$dy/dx = -y/x$. Replace: $dy/dx = x/y$.' },
              { label: 'Solve', content: '$y^2 - x^2 = C$ (hyperbolas).' },
            ],
          },
          {
            label: 'OT of y = ax^2',
            difficulty: 'medium',
            problem: 'Find OT of the parabolas $y = ax^2$.',
            steps: [
              { label: 'DE', content: '$y\' = 2y/x$. OT: $y\' = -x/(2y)$.' },
              { label: 'Solve', content: '$$x^2 + 2y^2 = C \\text{ (ellipses)}$$' },
            ],
          },
        ],
      },
      {
        title: 'Growth, Decay, and Other Applications',
        body: '$dy/dt = ky$. Solution: $y = y_0 e^{kt}$. Growth if $k > 0$, decay if $k < 0$.',
        examples: [
          {
            label: 'Population',
            difficulty: 'easy',
            problem: 'Population doubles in 50 years. When does it triple?',
            steps: [
              { label: 'Find k', content: '$k = \\ln 2/50$.' },
              { label: 'Tripling time', content: '$t = 50\\ln 3/\\ln 2 \\approx 79.25$ years.' },
            ],
          },
          {
            label: 'Decay',
            difficulty: 'easy',
            problem: 'Radium: 5% gone in 50 years. How much after 100 years?',
            steps: [
              { label: 'At 50 years', content: '$e^{-50k} = 0.95$.' },
              { label: 'At 100 years', content: '$(0.95)^2 = 0.9025$. Answer: **90.25%** remains.' },
            ],
          },
          {
            label: 'Spring-mass',
            difficulty: 'medium',
            problem: 'Solve $x\'\' + 4x = 0$ with $x(0) = 3, x\'(0) = 0$.',
            steps: [
              { label: 'A.E.', content: '$m = \\pm 2i$. $x = A\\cos 2t + B\\sin 2t$.' },
              { label: 'Apply conditions', content: '$A = 3, B = 0$.' },
              { label: 'Answer', content: '$$x = 3\\cos 2t$$' },
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
