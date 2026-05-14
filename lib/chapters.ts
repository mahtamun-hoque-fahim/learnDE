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

  // ═══════════════════════════════════════════════════════════════════
  // CH 1 — INTRODUCTION
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'intro',
    title: 'Introduction to Differential Equations',
    order: 1,
    summary: 'A DE is an equation relating an unknown function and its derivatives. Solutions are functions, not numbers.',
    sections: [
      {
        title: 'What is a Differential Equation?',
        body: 'A **differential equation (DE)** is an equation that contains an unknown function and one or more of its derivatives. Unlike algebra where we solve for a number, here we solve for a **function**.\n\nThe simplest possible DE:\n$$\\frac{dy}{dx} = 2x$$\nThis says "the rate of change of y with respect to x equals 2x". The solution is not a number — it is a whole family of curves:\n$$y = x^2 + C$$\nEvery value of C gives a different parabola. Together they form the **general solution**.',
        sideNote: 'The word "differential" refers to the differentials $dy$ and $dx$. A DE is simply any equation that links a function to how it changes.',
        cards: [
          { title: 'Population growth', content: '$$\\frac{dP}{dt} = kP$$' },
          { title: "Newton's cooling", content: '$$\\frac{dT}{dt} = k(T - T_0)$$' },
          { title: 'RC circuit', content: '$$R\\frac{dq}{dt} + \\frac{q}{C} = V$$' },
        ],
        examples: [
          {
            label: 'Example 1',
            difficulty: 'easy',
            problem: 'Verify that $y = x^2 + C$ is a solution of $\\frac{dy}{dx} = 2x$.',
            steps: [
              { label: 'Differentiate y', content: '$\\frac{dy}{dx} = \\frac{d}{dx}(x^2 + C) = 2x + 0 = 2x$' },
              { label: 'Compare with DE', content: 'The right-hand side of the DE is also $2x$ ✓' },
              { label: 'Conclusion', content: 'Since $\\frac{dy}{dx} = 2x$ is satisfied for every C, $y = x^2 + C$ is indeed the general solution.' },
            ],
          },
          {
            label: 'Example 2',
            difficulty: 'medium',
            problem: 'Show that $y = Ce^{2x}$ satisfies $\\frac{dy}{dx} = 2y$.',
            steps: [
              { label: 'Differentiate y', content: '$\\frac{dy}{dx} = C \\cdot 2e^{2x} = 2Ce^{2x}$' },
              { label: 'Substitute back', content: '$2y = 2 \\cdot Ce^{2x} = 2Ce^{2x}$' },
              { label: 'Verify equality', content: '$\\frac{dy}{dx} = 2Ce^{2x} = 2y$ ✓ The DE is satisfied for all C.' },
            ],
          },
        ],
      },
      {
        title: 'General vs Particular Solution',
        body: 'A **general solution** contains one or more arbitrary constants. It represents a whole **family of curves**.\n\nA **particular solution** is obtained by giving the constants specific values — usually from an **initial condition** such as $y(0) = 3$ or $y(1) = 5$.\n\nThe number of arbitrary constants equals the **order** of the DE.',
        sideNote: 'An initial condition is a known value of the function (or its derivative) at a specific point. It "pins down" one member of the family of curves.',
        examples: [
          {
            label: 'Example 1',
            difficulty: 'easy',
            problem: 'Solve $\\frac{dy}{dx} = 3x^2$, given $y(0) = 5$.',
            steps: [
              { label: 'Integrate both sides', content: '$\\int dy = \\int 3x^2\\,dx$' },
              { label: 'Evaluate the integrals', content: '$y = x^3 + C$ (general solution — a family of cubics)' },
              { label: 'Apply initial condition y(0) = 5', content: 'Substitute $x = 0$, $y = 5$: $\\quad 5 = 0^3 + C \\Rightarrow C = 5$' },
              { label: 'Particular solution', content: '$$y = x^3 + 5$$' },
            ],
          },
          {
            label: 'Example 2',
            difficulty: 'medium',
            problem: 'Solve $\\frac{d^2y}{dx^2} = 6x$, given $y(0) = 1$ and $y\'(0) = 2$.',
            steps: [
              { label: 'First integration', content: '$\\frac{dy}{dx} = \\int 6x\\,dx = 3x^2 + C_1$' },
              { label: 'Apply y\'(0) = 2', content: '$2 = 3(0)^2 + C_1 \\Rightarrow C_1 = 2$, so $y\' = 3x^2 + 2$' },
              { label: 'Second integration', content: '$y = \\int (3x^2 + 2)\\,dx = x^3 + 2x + C_2$' },
              { label: 'Apply y(0) = 1', content: '$1 = 0 + 0 + C_2 \\Rightarrow C_2 = 1$' },
              { label: 'Particular solution', content: '$$y = x^3 + 2x + 1$$' },
            ],
          },
          {
            label: 'Example 3',
            difficulty: 'hard',
            problem: 'Show that $y = A\\sin x + B\\cos x$ is the general solution of $\\frac{d^2y}{dx^2} + y = 0$.',
            steps: [
              { label: 'First derivative', content: '$y\' = A\\cos x - B\\sin x$' },
              { label: 'Second derivative', content: '$y\'\' = -A\\sin x - B\\cos x$' },
              { label: 'Substitute into DE', content: '$y\'\' + y = (-A\\sin x - B\\cos x) + (A\\sin x + B\\cos x) = 0$ ✓' },
              { label: 'Count constants', content: 'Two arbitrary constants A and B match the order-2 DE. This IS the general solution.' },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CH 2 — CLASSIFICATION
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'classification',
    title: 'Classification of Differential Equations',
    order: 2,
    summary: 'DEs are classified by type (ODE/PDE), order, degree, and linearity.',
    sections: [
      {
        title: 'ODE vs PDE',
        body: 'An **ODE** (Ordinary DE) involves derivatives with respect to **one** independent variable.\nA **PDE** (Partial DE) involves partial derivatives with respect to **two or more** independent variables.\n\nYour 2nd semester covers ODEs exclusively.',
        sideNote: 'PDEs appear in heat flow, wave propagation, and quantum mechanics. ODEs appear whenever you track one variable over time — growth, decay, oscillation, circuits.',
        cards: [
          { title: 'ODE (your focus)', content: '$$\\frac{dy}{dx} + 2y = x$$' },
          { title: 'PDE (later semesters)', content: '$$\\frac{\\partial u}{\\partial t} = k\\frac{\\partial^2 u}{\\partial x^2}$$' },
        ],
        examples: [
          {
            label: 'Example 1',
            difficulty: 'easy',
            problem: 'Identify whether each equation is an ODE or PDE:\n(a) $\\frac{dy}{dx} + y = 0$ (b) $\\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2} = 0$',
            steps: [
              { label: 'Equation (a)', content: 'Only one variable x, derivative $\\frac{dy}{dx}$ → **ODE**' },
              { label: 'Equation (b)', content: 'Two independent variables x and y, partial derivatives → **PDE** (Laplace equation)' },
            ],
          },
        ],
      },
      {
        title: 'Order and Degree',
        body: '**Order** = the order of the highest derivative present.\n**Degree** = the power of the highest-order derivative, after clearing all radicals and fractions from the derivatives.',
        sideNote: 'Always clear fractions and radicals from the derivative terms before reading off the degree. Example: $\\sqrt{y\'\'} = x$ has degree 2, not 1, because squaring gives $(y\'\')^2 = x^2$.',
        table: {
          headers: ['Equation', 'Order', 'Degree', 'Why'],
          rows: [
            ['$\\frac{dy}{dx} + y = e^x$', '1', '1', 'Highest derivative is $y\'$, raised to power 1'],
            ['$\\frac{d^2y}{dx^2} + 3\\frac{dy}{dx} = 0$', '2', '1', 'Highest derivative is $y\'\'$, power 1'],
            ['$\\left(\\frac{d^2y}{dx^2}\\right)^3 + y = 0$', '2', '3', 'Highest derivative $y\'\'$ raised to power 3'],
            ['$\\sqrt{\\frac{dy}{dx}} = 1 + x$', '1', '2', 'After squaring: $(y\')^2 = (1+x)^2$'],
          ],
        },
        examples: [
          {
            label: 'Example 1',
            difficulty: 'easy',
            problem: 'Find order and degree of $\\frac{d^3y}{dx^3} + x^2\\left(\\frac{dy}{dx}\\right)^4 + y = \\cos x$.',
            steps: [
              { label: 'Identify highest derivative', content: '$\\frac{d^3y}{dx^3}$ — this is a 3rd derivative → **Order = 3**' },
              { label: 'Find its power', content: 'The 3rd derivative appears to the power 1 (no exponent) → **Degree = 1**' },
              { label: 'Note', content: 'The $(y\')^4$ term does not affect order or degree — only the highest derivative matters.' },
            ],
          },
          {
            label: 'Example 2',
            difficulty: 'medium',
            problem: 'Find order and degree of $\\left[1 + \\left(\\frac{dy}{dx}\\right)^2\\right]^{3/2} = \\frac{d^2y}{dx^2}$.',
            steps: [
              { label: 'Identify highest derivative', content: '$\\frac{d^2y}{dx^2}$ → **Order = 2**' },
              { label: 'Clear the fractional power', content: 'Square both sides: $\\left[1 + (y\')^2\\right]^3 = (y\'\')^2$' },
              { label: 'Read off degree', content: 'Now highest derivative $y\'\'$ is raised to power 2 → **Degree = 2**' },
            ],
          },
        ],
      },
      {
        title: 'Linear vs Non-Linear',
        body: 'A DE is **linear** when:\n- The unknown function y and all its derivatives appear to the **first power** only\n- There are **no products** between y and any of its derivatives\n- The coefficients may be any function of x\n\nViolate any condition → **non-linear**.',
        sideNote: 'Linearity is crucial because linear DEs have much more powerful solution techniques. The superposition principle holds: if $y_1$ and $y_2$ are solutions, so is $c_1 y_1 + c_2 y_2$.',
        cards: [
          { title: 'Linear ✓', content: '$$\\frac{dy}{dx} + 2y = x^2$$\n$$\\frac{d^2y}{dx^2} - 3y = \\sin x$$' },
          { title: 'Non-linear ✗', content: '$$y\\frac{dy}{dx} = x$$\n$$\\left(\\frac{dy}{dx}\\right)^2 = 1 - y^2$$' },
        ],
        examples: [
          {
            label: 'Example 1',
            difficulty: 'easy',
            problem: 'Classify each as linear or non-linear:\n(a) $y\'\' + xy\' - y = e^x$\n(b) $yy\' + x = 0$\n(c) $(y\')^2 + y = 0$',
            steps: [
              { label: 'Equation (a)', content: '$y\'\'$, $y\'$, and $y$ all appear to power 1, no products → **Linear**' },
              { label: 'Equation (b)', content: '$y \\cdot y\'$ is a product of the function and its derivative → **Non-linear**' },
              { label: 'Equation (c)', content: '$(y\')^2$ means $y\'$ raised to power 2 → **Non-linear**' },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CH 3 — FORMATION
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'formation',
    title: 'Formation of Differential Equations',
    order: 3,
    summary: 'n arbitrary constants → differentiate n times → eliminate constants → DE of order n.',
    sections: [
      {
        title: 'The Formation Rule',
        body: 'Every family of curves defined by n arbitrary constants gives rise to exactly one DE of order n. To find that DE:\n\n**Step 1:** Write the equation of the family (with n constants)\n**Step 2:** Differentiate n times to get n extra equations\n**Step 3:** Eliminate all n constants between the original and the n derivative equations\n**Step 4:** The result is the DE',
        sideNote: 'Think of it in reverse: a DE of order n has a general solution with n constants. Formation just goes the other direction — from the family of solutions to the DE that generates them.',
        examples: [
          {
            label: 'Example 1 — One constant',
            difficulty: 'easy',
            problem: 'Form the DE from $y = Cx^2$ (C is arbitrary).',
            steps: [
              { label: 'Count constants', content: 'One constant C → will need to differentiate once' },
              { label: 'Differentiate', content: '$\\frac{dy}{dx} = 2Cx$' },
              { label: 'Find C from original', content: 'From $y = Cx^2$: $C = \\frac{y}{x^2}$' },
              { label: 'Substitute C', content: '$\\frac{dy}{dx} = 2\\left(\\frac{y}{x^2}\\right)x = \\frac{2y}{x}$' },
              { label: 'DE', content: '$$x\\frac{dy}{dx} - 2y = 0$$' },
            ],
          },
          {
            label: 'Example 2 — Two constants',
            difficulty: 'medium',
            problem: 'Form the DE from $y = Ae^x + Be^{-x}$ (A, B arbitrary).',
            steps: [
              { label: 'Two constants → differentiate twice', content: '$y = Ae^x + Be^{-x}$' },
              { label: '1st derivative', content: '$y\' = Ae^x - Be^{-x}$' },
              { label: '2nd derivative', content: '$y\'\' = Ae^x + Be^{-x}$' },
              { label: 'Observe that y\'\' = y', content: '$Ae^x + Be^{-x} = y$ ✓' },
              { label: 'DE', content: '$$y\'\' - y = 0$$' },
            ],
          },
          {
            label: 'Example 3 — Circle family',
            difficulty: 'medium',
            problem: 'Form the DE for all circles centred at the origin: $x^2 + y^2 = r^2$.',
            steps: [
              { label: 'One constant (r)', content: '$x^2 + y^2 = r^2$' },
              { label: 'Differentiate implicitly', content: '$2x + 2y\\frac{dy}{dx} = 0$' },
              { label: 'Simplify', content: '$x + y\\frac{dy}{dx} = 0$' },
              { label: 'DE', content: '$$x + yy\' = 0$$' },
              { label: 'Geometric meaning', content: 'This says: at any point on the circle, the slope $y\'$ satisfies $y\' = -x/y$ (tangent is perpendicular to radius).' },
            ],
          },
          {
            label: 'Example 4 — Trigonometric family',
            difficulty: 'hard',
            problem: 'Form the DE from $y = A\\sin(bx) + B\\cos(bx)$ where b is a given constant.',
            steps: [
              { label: '1st derivative', content: '$y\' = Ab\\cos(bx) - Bb\\sin(bx)$' },
              { label: '2nd derivative', content: '$y\'\' = -Ab^2\\sin(bx) - Bb^2\\cos(bx) = -b^2(A\\sin(bx) + B\\cos(bx))$' },
              { label: 'Recognise y', content: '$y\'\' = -b^2 y$' },
              { label: 'DE', content: '$$y\'\' + b^2 y = 0$$' },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CH 4 — VARIABLE SEPARABLE
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'separable',
    title: 'Variable Separable Method',
    order: 4,
    summary: 'Rearrange so all y terms go left, all x terms go right, then integrate both sides.',
    sections: [
      {
        title: 'The Separable Method',
        body: 'A DE is **variable separable** if it can be written as:\n$$g(y)\\,dy = f(x)\\,dx$$\nOnce separated, integrate both sides independently:\n$$\\int g(y)\\,dy = \\int f(x)\\,dx + C$$\n\n**When can we separate?** When $\\frac{dy}{dx}$ can be written as a product $h(x) \\cdot k(y)$ — then divide both sides by $k(y)$ and multiply by $dx$.',
        sideNote: 'The constant C only needs to appear on one side. Whether you write $C$, $2C$, or $\\ln C$ depends on which form gives the cleanest answer.',
        examples: [
          {
            label: 'Example 1',
            difficulty: 'easy',
            problem: 'Solve $\\frac{dy}{dx} = \\frac{x}{y}$.',
            steps: [
              { label: 'Rewrite to see the product form', content: '$\\frac{dy}{dx} = x \\cdot \\frac{1}{y}$ — separable since it\'s $h(x) \\cdot k(y)$' },
              { label: 'Separate variables', content: 'Multiply both sides by $y$, multiply by $dx$: $\\quad y\\,dy = x\\,dx$' },
              { label: 'Integrate left side', content: '$\\int y\\,dy = \\frac{y^2}{2}$' },
              { label: 'Integrate right side', content: '$\\int x\\,dx = \\frac{x^2}{2}$' },
              { label: 'Combine (absorb 2 into C)', content: '$$y^2 - x^2 = C$$' },
            ],
          },
          {
            label: 'Example 2',
            difficulty: 'easy',
            problem: 'Solve $\\frac{dy}{dx} = y$.',
            steps: [
              { label: 'Separate', content: '$\\frac{dy}{y} = dx$' },
              { label: 'Integrate both sides', content: '$\\int \\frac{1}{y}\\,dy = \\int dx$' },
              { label: 'Evaluate integrals', content: '$\\ln|y| = x + C_1$' },
              { label: 'Exponentiate both sides', content: '$|y| = e^{x+C_1} = e^{C_1} \\cdot e^x$' },
              { label: 'Write with single constant C = ±e^{C₁}', content: '$$y = Ce^x$$' },
            ],
          },
          {
            label: 'Example 3 — With initial condition',
            difficulty: 'medium',
            problem: 'Solve $\\frac{dy}{dx} = -2xy^2$, given $y(0) = 2$.',
            steps: [
              { label: 'Separate (divide by y², multiply by dx)', content: '$y^{-2}\\,dy = -2x\\,dx$' },
              { label: 'Integrate left side', content: '$\\int y^{-2}\\,dy = \\frac{y^{-1}}{-1} = -\\frac{1}{y}$' },
              { label: 'Integrate right side', content: '$\\int -2x\\,dx = -x^2$' },
              { label: 'Combine', content: '$-\\frac{1}{y} = -x^2 + C \\Rightarrow \\frac{1}{y} = x^2 - C$' },
              { label: 'Apply y(0) = 2', content: '$\\frac{1}{2} = 0 - C \\Rightarrow C = -\\frac{1}{2}$' },
              { label: 'Particular solution', content: '$$y = \\frac{2}{2x^2 + 1}$$' },
            ],
          },
          {
            label: 'Example 4',
            difficulty: 'medium',
            problem: 'Solve $\\frac{dy}{dx} = \\frac{1+y^2}{1+x^2}$.',
            steps: [
              { label: 'Separate', content: '$\\frac{dy}{1+y^2} = \\frac{dx}{1+x^2}$' },
              { label: 'Integrate left side', content: '$\\int \\frac{dy}{1+y^2} = \\arctan y$' },
              { label: 'Integrate right side', content: '$\\int \\frac{dx}{1+x^2} = \\arctan x$' },
              { label: 'General solution', content: '$$\\arctan y = \\arctan x + C$$' },
            ],
          },
          {
            label: 'Example 5',
            difficulty: 'hard',
            problem: 'Solve $e^x \\tan y\\,dx + (1-e^x)\\sec^2 y\\,dy = 0$.',
            steps: [
              { label: 'Rearrange', content: '$(1-e^x)\\sec^2 y\\,dy = -e^x\\tan y\\,dx$' },
              { label: 'Separate (divide by tan y · (1-eˣ))', content: '$\\frac{\\sec^2 y}{\\tan y}\\,dy = \\frac{-e^x}{1-e^x}\\,dx$' },
              { label: 'Integrate left side (substitute t = tan y)', content: '$\\int \\frac{\\sec^2 y}{\\tan y}\\,dy = \\ln|\\tan y|$' },
              { label: 'Integrate right side (substitute u = 1-eˣ)', content: '$\\int \\frac{-e^x}{1-e^x}\\,dx = \\ln|1-e^x|$' },
              { label: 'General solution', content: '$$\\ln|\\tan y| = \\ln|1-e^x| + \\ln C \\Rightarrow \\tan y = C(1-e^x)$$' },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CH 5 — HOMOGENEOUS
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'homogeneous',
    title: 'Homogeneous Equations',
    order: 5,
    summary: 'A DE is homogeneous if f(x,y) depends only on y/x. Substitute v = y/x to convert to separable.',
    sections: [
      {
        title: 'The Homogeneous Substitution',
        body: 'A DE $\\frac{dy}{dx} = f(x,y)$ is **homogeneous** if $f(tx, ty) = f(x,y)$ for all t — equivalently, if f can be written as a function of $y/x$ alone.\n\n**Substitution:** Let $v = \\frac{y}{x}$, so $y = vx$ and differentiating:\n$$\\frac{dy}{dx} = v + x\\frac{dv}{dx}$$\nSubstitute these into the DE. The result is always a **separable** DE in v and x. Solve for v, then back-substitute $v = y/x$.',
        sideNote: 'How to check if a DE is homogeneous: try to express $\\frac{dy}{dx}$ purely as a function of $\\frac{y}{x}$. If you can, substitute $v = y/x$.',
        examples: [
          {
            label: 'Example 1',
            difficulty: 'medium',
            problem: 'Solve $\\frac{dy}{dx} = \\frac{y^2 - x^2}{2xy}$.',
            steps: [
              { label: 'Verify homogeneous', content: 'Divide top and bottom by $x^2$: $\\frac{dy}{dx} = \\frac{(y/x)^2 - 1}{2(y/x)}$ — yes, it\'s a function of $v = y/x$' },
              { label: 'Substitute y = vx, dy/dx = v + xv\'', content: '$v + x\\frac{dv}{dx} = \\frac{v^2-1}{2v}$' },
              { label: 'Isolate xv\'', content: '$x\\frac{dv}{dx} = \\frac{v^2-1}{2v} - v = \\frac{v^2-1-2v^2}{2v} = \\frac{-(v^2+1)}{2v}$' },
              { label: 'Separate', content: '$\\frac{2v}{v^2+1}\\,dv = -\\frac{dx}{x}$' },
              { label: 'Integrate both sides', content: '$\\int \\frac{2v}{v^2+1}\\,dv = \\ln(v^2+1)$ and $\\int -\\frac{dx}{x} = -\\ln|x|$' },
              { label: 'Combine', content: '$\\ln(v^2+1) = -\\ln|x| + \\ln C = \\ln\\frac{C}{|x|}$' },
              { label: 'Back-substitute v = y/x', content: '$\\frac{y^2}{x^2}+1 = \\frac{C}{x}$, so $x^2+y^2 = Cx$' },
              { label: 'General solution', content: '$$x^2 + y^2 = Cx$$' },
            ],
          },
          {
            label: 'Example 2',
            difficulty: 'easy',
            problem: 'Solve $x\\frac{dy}{dx} = y + x$.',
            steps: [
              { label: 'Write as dy/dx', content: '$\\frac{dy}{dx} = \\frac{y}{x} + 1$ — function of $v = y/x$' },
              { label: 'Substitute y = vx', content: '$v + x\\frac{dv}{dx} = v + 1$' },
              { label: 'Simplify', content: '$x\\frac{dv}{dx} = 1$' },
              { label: 'Separate', content: '$dv = \\frac{dx}{x}$' },
              { label: 'Integrate', content: '$v = \\ln|x| + C$' },
              { label: 'Back-substitute v = y/x', content: '$$y = x(\\ln|x| + C) = x\\ln|x| + Cx$$' },
            ],
          },
          {
            label: 'Example 3',
            difficulty: 'hard',
            problem: 'Solve $(x+y)\\,dx - (x-y)\\,dy = 0$.',
            steps: [
              { label: 'Write as dy/dx', content: '$\\frac{dy}{dx} = \\frac{x+y}{x-y}$' },
              { label: 'Divide by x to see v = y/x form', content: '$\\frac{dy}{dx} = \\frac{1 + y/x}{1 - y/x} = \\frac{1+v}{1-v}$' },
              { label: 'Substitute', content: '$v + x\\frac{dv}{dx} = \\frac{1+v}{1-v}$' },
              { label: 'Simplify xv\'', content: '$x\\frac{dv}{dx} = \\frac{1+v}{1-v} - v = \\frac{1+v - v(1-v)}{1-v} = \\frac{1+v^2}{1-v}$' },
              { label: 'Separate', content: '$\\frac{1-v}{1+v^2}\\,dv = \\frac{dx}{x}$' },
              { label: 'Split left side', content: '$\\frac{1}{1+v^2}\\,dv - \\frac{v}{1+v^2}\\,dv = \\frac{dx}{x}$' },
              { label: 'Integrate', content: '$\\arctan v - \\frac{1}{2}\\ln(1+v^2) = \\ln|x| + C$' },
              { label: 'Back-substitute v = y/x', content: '$$\\arctan\\frac{y}{x} = \\frac{1}{2}\\ln(x^2+y^2) + C$$' },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CH 6 — LINEAR DE
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'linear-de',
    title: 'Linear DE — Integrating Factor Method',
    order: 6,
    ref: 'H.K. Dass — Section 3.9, p.147',
    summary: 'Standard form: dy/dx + P(x)y = Q(x). Multiply by integrating factor μ = e^(∫P dx).',
    sections: [
      {
        title: 'Standard Form & Integrating Factor',
        body: '**Standard form of a first-order linear DE:**\n$$\\frac{dy}{dx} + P(x)\\,y = Q(x)$$\nwhere P and Q are functions of x only.\n\n**Why multiply by e^{∫P dx}?**\nBecause the left side $\\frac{dy}{dx} + Py$ is almost — but not quite — a derivative of a product. Multiplying by $\\mu = e^{\\int P\\,dx}$ makes:\n$$\\mu\\frac{dy}{dx} + \\mu P y = \\frac{d}{dx}(\\mu y)$$\nSo the equation becomes $\\frac{d}{dx}(\\mu y) = \\mu Q$, which integrates directly.',
        sideNote: 'When finding the integrating factor, drop the constant of integration — you only need one particular $\\mu$, not all of them.',
        examples: [
          {
            label: 'Example 1 (H.K. Dass §3.9)',
            difficulty: 'easy',
            problem: 'Solve $\\frac{dy}{dx} + \\frac{y}{x} = x^2$.',
            steps: [
              { label: 'Standard form — identify P and Q', content: '$P(x) = \\frac{1}{x}$, $\\quad Q(x) = x^2$' },
              { label: 'Compute ∫P dx', content: '$\\int \\frac{1}{x}\\,dx = \\ln x$' },
              { label: 'Find I.F.', content: '$\\mu = e^{\\ln x} = x$' },
              { label: 'Multiply DE by μ = x', content: '$x\\frac{dy}{dx} + y = x^3 \\Rightarrow \\frac{d}{dx}(xy) = x^3$' },
              { label: 'Integrate both sides', content: '$xy = \\int x^3\\,dx = \\frac{x^4}{4} + C$' },
              { label: 'Divide by x', content: '$$y = \\frac{x^3}{4} + \\frac{C}{x}$$' },
            ],
          },
          {
            label: 'Example 2 (H.K. Dass Ex.10)',
            difficulty: 'medium',
            problem: 'Solve $(x+1)\\frac{dy}{dx} - y = e^x(x+1)^2$.',
            steps: [
              { label: 'Divide by (x+1) to get standard form', content: '$\\frac{dy}{dx} - \\frac{1}{x+1}y = e^x(x+1)$' },
              { label: 'P = -1/(x+1), Q = eˣ(x+1)', content: '$\\int P\\,dx = -\\ln(x+1)$' },
              { label: 'I.F.', content: '$\\mu = e^{-\\ln(x+1)} = \\frac{1}{x+1}$' },
              { label: 'Multiply through', content: '$\\frac{d}{dx}\\left(\\frac{y}{x+1}\\right) = e^x$' },
              { label: 'Integrate', content: '$\\frac{y}{x+1} = e^x + C$' },
              { label: 'General solution', content: '$$y = (x+1)(e^x + C)$$' },
            ],
          },
          {
            label: 'Example 3',
            difficulty: 'medium',
            problem: 'Solve $\\frac{dy}{dx} + y = e^x$, with $y(0) = 1$.',
            steps: [
              { label: 'P = 1, Q = eˣ', content: '$\\int P\\,dx = x$' },
              { label: 'I.F.', content: '$\\mu = e^x$' },
              { label: 'Multiply through', content: '$e^x\\frac{dy}{dx} + e^xy = e^{2x} \\Rightarrow \\frac{d}{dx}(e^x y) = e^{2x}$' },
              { label: 'Integrate', content: '$e^x y = \\int e^{2x}\\,dx = \\frac{e^{2x}}{2} + C$' },
              { label: 'Divide by eˣ', content: '$y = \\frac{e^x}{2} + Ce^{-x}$' },
              { label: 'Apply y(0) = 1', content: '$1 = \\frac{1}{2} + C \\Rightarrow C = \\frac{1}{2}$' },
              { label: 'Particular solution', content: '$$y = \\frac{e^x + e^{-x}}{2} = \\cosh x$$' },
            ],
          },
          {
            label: 'Example 4',
            difficulty: 'hard',
            problem: 'Solve $\\frac{dy}{dx} + y\\tan x = \\sec x$.',
            steps: [
              { label: 'P = tan x, Q = sec x', content: '$\\int \\tan x\\,dx = \\ln|\\sec x|$' },
              { label: 'I.F.', content: '$\\mu = e^{\\ln|\\sec x|} = \\sec x$' },
              { label: 'Multiply through', content: '$\\sec x\\frac{dy}{dx} + y\\sec x\\tan x = \\sec^2 x \\Rightarrow \\frac{d}{dx}(y\\sec x) = \\sec^2 x$' },
              { label: 'Integrate', content: '$y\\sec x = \\int \\sec^2 x\\,dx = \\tan x + C$' },
              { label: 'General solution', content: '$$y = \\sin x + C\\cos x$$' },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CH 7 — BERNOULLI
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'bernoulli',
    title: "Bernoulli's Equation",
    order: 7,
    ref: 'H.K. Dass — Section 3.10, p.150',
    summary: "Bernoulli form: dy/dx + Py = Qyⁿ. Substitute z = y^(1-n) to linearize.",
    sections: [
      {
        title: 'Bernoulli Form & Reduction',
        body: "**Standard Bernoulli form:**\n$$\\frac{dy}{dx} + P(x)\\,y = Q(x)\\,y^n \\quad (n \\neq 0, 1)$$\nThis is non-linear due to $y^n$. The trick is a substitution that converts it to linear.\n\n**Reduction (H.K. Dass §3.10):**\n1. Divide both sides by $y^n$: $\\quad y^{-n}\\frac{dy}{dx} + P\\cdot y^{1-n} = Q$\n2. Let $z = y^{1-n}$, so $\\frac{dz}{dx} = (1-n)y^{-n}\\frac{dy}{dx}$\n3. Substitute: DE becomes linear in z:\n$$\\frac{dz}{dx} + (1-n)P\\,z = (1-n)Q$$\n4. Solve using I.F. method, then back-substitute $z = y^{1-n}$",
        sideNote: 'When n = 0, the Bernoulli equation is already linear (just the standard linear DE). When n = 1, divide by y to get a separable equation. The Bernoulli substitution is only needed for n ≠ 0, 1.',
        examples: [
          {
            label: 'Example 1',
            difficulty: 'medium',
            problem: "Solve $\\frac{dy}{dx} - \\frac{y}{x} = -\\frac{y^2}{x^2}$.",
            steps: [
              { label: 'Identify n = 2', content: 'P = -1/x, Q = -1/x², n = 2' },
              { label: 'Divide by y²', content: '$y^{-2}\\frac{dy}{dx} - \\frac{y^{-1}}{x} = -\\frac{1}{x^2}$' },
              { label: 'Let z = y^{1-2} = y^{-1} = 1/y', content: '$\\frac{dz}{dx} = -y^{-2}\\frac{dy}{dx}$, so multiplying by -1:' },
              { label: 'Linear DE in z', content: '$\\frac{dz}{dx} + \\frac{z}{x} = \\frac{1}{x^2}$' },
              { label: 'I.F. = x (P = 1/x)', content: '$\\frac{d}{dx}(xz) = \\frac{1}{x}$' },
              { label: 'Integrate', content: '$xz = \\ln|x| + C$' },
              { label: 'Back-substitute z = 1/y', content: '$$\\frac{x}{y} = \\ln|x| + C$$' },
            ],
          },
          {
            label: 'Example 2 (H.K. Dass Ex.13)',
            difficulty: 'hard',
            problem: 'Solve $x^2\\,dy + y(x+y)\\,dx = 0$.',
            steps: [
              { label: 'Divide by x² dx', content: '$\\frac{dy}{dx} = -\\frac{y(x+y)}{x^2} = -\\frac{y}{x} - \\frac{y^2}{x^2}$' },
              { label: 'Bernoulli with n=2, P=1/x, Q=-1/x²', content: '$\\frac{dy}{dx} + \\frac{y}{x} = -\\frac{y^2}{x^2}$' },
              { label: 'Divide by y²', content: '$y^{-2}\\frac{dy}{dx} + \\frac{1}{xy} = -\\frac{1}{x^2}$' },
              { label: 'z = 1/y, dz/dx = -y⁻²y\'', content: '$-\\frac{dz}{dx} + \\frac{z}{x} = -\\frac{1}{x^2} \\Rightarrow \\frac{dz}{dx} - \\frac{z}{x} = \\frac{1}{x^2}$' },
              { label: 'I.F. = e^{-∫1/x dx} = 1/x', content: '$\\frac{d}{dx}\\left(\\frac{z}{x}\\right) = \\frac{1}{x^3}$' },
              { label: 'Integrate', content: '$\\frac{z}{x} = \\int x^{-3}\\,dx = -\\frac{1}{2x^2} + C$' },
              { label: 'Back-substitute z = 1/y', content: '$$\\frac{1}{xy} = -\\frac{1}{2x^2} + C \\Rightarrow \\frac{2}{xy} + \\frac{1}{x^2} = C$$' },
            ],
          },
          {
            label: 'Example 3 — Product with y²',
            difficulty: 'hard',
            problem: 'Solve $\\frac{dy}{dx} + y = xy^2$.',
            steps: [
              { label: 'Identify Bernoulli form', content: 'This is Bernoulli with $n=2$, $P(x) = 1$, $Q(x) = x$' },
              { label: 'Divide by y²', content: '$y^{-2}\\frac{dy}{dx} + y^{-1} = x$' },
              { label: 'Let z = y^{-1} = 1/y', content: '$\\frac{dz}{dx} = -y^{-2}\\frac{dy}{dx}$, so $-\\frac{dz}{dx} + z = x$' },
              { label: 'Multiply by -1', content: '$\\frac{dz}{dx} - z = -x$ (linear in z)' },
              { label: 'I.F. = $e^{\\int (-1) dx} = e^{-x}$', content: '$\\frac{d}{dx}(e^{-x}z) = -xe^{-x}$' },
              { label: 'Integrate RHS by parts: $u=x$, $dv=e^{-x}dx$', content: '$e^{-x}z = \\int -xe^{-x}\\,dx = xe^{-x} + e^{-x} + C$' },
              { label: 'Divide by $e^{-x}$', content: '$z = x + 1 + Ce^x$' },
              { label: 'Back-substitute z = 1/y', content: '$$\\frac{1}{y} = x + 1 + Ce^x$$' },
              { label: 'Final answer', content: '$$y = \\frac{1}{x + 1 + Ce^x}$$' },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // CH 8 — EXACT
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'exact-de',
    title: 'Exact Differential Equations',
    order: 8,
    ref: 'H.K. Dass — Section 3.11, p.154',
    summary: 'A DE M dx + N dy = 0 is exact if ∂M/∂y = ∂N/∂x. Solution found by direct integration.',
    sections: [
      {
        title: 'Exactness Condition & Working Rule',
        body: 'A DE written as $M\\,dx + N\\,dy = 0$ is **exact** if there exists a function $F(x,y)$ such that:\n$$dF = \\frac{\\partial F}{\\partial x}\\,dx + \\frac{\\partial F}{\\partial y}\\,dy = M\\,dx + N\\,dy$$\nThis means $F_x = M$ and $F_y = N$.\n\n**Condition for exactness** (H.K. Dass §3.11):\n$$\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$$\n\n**Working Rule:**\n1. Check the exactness condition\n2. Integrate M w.r.t. x (keeping y constant) → call it $f(x,y)$\n3. Identify terms in N that are **not** in $\\frac{\\partial f}{\\partial y}$ → integrate those w.r.t. y → call it $g(y)$\n4. Solution: $f(x,y) + g(y) = C$',
        sideNote: 'The solution is just $F(x,y) = C$. Step 2 recovers the x-part of F, and step 3 picks up any y-only terms that Step 2 missed.',
        examples: [
          {
            label: 'Example 1',
            difficulty: 'easy',
            problem: 'Solve $(2x + y)\\,dx + (x + 2y)\\,dy = 0$.',
            steps: [
              { label: 'Identify M and N', content: '$M = 2x+y$, $\\quad N = x+2y$' },
              { label: 'Check exactness', content: '$\\frac{\\partial M}{\\partial y} = 1$, $\\quad \\frac{\\partial N}{\\partial x} = 1$ ✓ Exact.' },
              { label: 'Integrate M w.r.t. x (y constant)', content: '$f = \\int (2x+y)\\,dx = x^2 + xy$' },
              { label: 'Differentiate f w.r.t. y', content: '$\\frac{\\partial f}{\\partial y} = x$' },
              { label: 'Find missing N terms: N - ∂f/∂y = 2y - x... wait', content: 'Compare with N = x+2y: the x part is captured, missing = 2y' },
              { label: 'Integrate missing term w.r.t. y', content: '$g(y) = \\int 2y\\,dy = y^2$' },
              { label: 'Solution', content: '$$x^2 + xy + y^2 = C$$' },
            ],
          },
          {
            label: 'Example 2 (H.K. Dass Ex.21)',
            difficulty: 'medium',
            problem: 'Solve $(5x^4 + 3x^2y^2 - 2xy^3)\\,dx + (2x^3y - 3x^2y^2 - 5y^4)\\,dy = 0$.',
            steps: [
              { label: 'Check ∂M/∂y', content: '$\\frac{\\partial M}{\\partial y} = 6x^2y - 6xy^2$' },
              { label: 'Check ∂N/∂x', content: '$\\frac{\\partial N}{\\partial x} = 6x^2y - 6xy^2$ ✓ Exact.' },
              { label: 'Integrate M w.r.t. x (y constant)', content: '$f = x^5 + x^3y^2 - x^2y^3$' },
              { label: 'Compare ∂f/∂y with N', content: '$\\frac{\\partial f}{\\partial y} = 2x^3y - 3x^2y^2$; N has extra $-5y^4$' },
              { label: 'Integrate -5y⁴ w.r.t. y', content: '$g(y) = -y^5$' },
              { label: 'Solution', content: '$$x^5 + x^3y^2 - x^2y^3 - y^5 = C$$' },
            ],
          },
          {
            label: 'Example 3',
            difficulty: 'hard',
            problem: 'Solve $\\left(\\frac{y}{x} + 6x\\right)dx + (\\ln x - 2)\\,dy = 0$.',
            steps: [
              { label: 'M = y/x + 6x, N = ln x - 2', content: '' },
              { label: 'Check ∂M/∂y = 1/x', content: '$\\frac{\\partial M}{\\partial y} = \\frac{1}{x}$' },
              { label: 'Check ∂N/∂x = 1/x', content: '$\\frac{\\partial N}{\\partial x} = \\frac{1}{x}$ ✓ Exact.' },
              { label: 'Integrate M w.r.t. x', content: '$f = \\int (\\frac{y}{x}+6x)\\,dx = y\\ln x + 3x^2$' },
              { label: 'Find ∂f/∂y and compare with N', content: '$\\frac{\\partial f}{\\partial y} = \\ln x$; N = $\\ln x - 2$; missing: $-2$' },
              { label: 'Integrate -2 w.r.t. y', content: '$g(y) = -2y$' },
              { label: 'Solution', content: '$$y\\ln x + 3x^2 - 2y = C$$' },
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
