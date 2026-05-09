export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  intro: [
    {
      id: 'i1',
      question: 'What is a differential equation?',
      options: [
        'An equation involving only algebraic variables',
        'An equation relating a function and one or more of its derivatives',
        'An equation with two unknowns',
        'An equation involving integration only',
      ],
      correct: 1,
      explanation: 'A differential equation (DE) relates an unknown function with its derivatives. We solve for a function, not a number.',
    },
    {
      id: 'i2',
      question: 'The general solution of dy/dx = 2x is:',
      options: ['y = 2', 'y = x² + C', 'y = 2x + C', 'y = x² − C'],
      correct: 1,
      explanation: 'Integrating dy/dx = 2x gives y = x² + C, where C is an arbitrary constant.',
    },
    {
      id: 'i3',
      question: 'If y(0) = 3 for the equation dy/dx = 2x, the particular solution is:',
      options: ['y = x²', 'y = x² + 3', 'y = 2x + 3', 'y = x² − 3'],
      correct: 1,
      explanation: 'From y = x² + C, applying y(0) = 3: 3 = 0 + C, so C = 3. Thus y = x² + 3.',
    },
    {
      id: 'i4',
      question: 'Which equation models population growth?',
      options: ['dP/dt = k', 'dP/dt = kP', 'dP/dt = k/P', 'dP/dt = k − P'],
      correct: 1,
      explanation: 'dP/dt = kP models exponential population growth — the rate of change is proportional to the current population.',
    },
    {
      id: 'i5',
      question: 'A general solution contains:',
      options: [
        'No constants',
        'An arbitrary constant C',
        'Only particular values',
        'Two specific values',
      ],
      correct: 1,
      explanation: 'A general solution contains an arbitrary constant C, representing a family of solutions.',
    },
  ],
  classification: [
    {
      id: 'c1',
      question: "What is the order of the DE: d²y/dx² + 3(dy/dx) = 0?",
      options: ['0', '1', '2', '3'],
      correct: 2,
      explanation: 'Order = highest derivative present. Here d²y/dx² is the highest, so order = 2.',
    },
    {
      id: 'c2',
      question: "What is the degree of (d²y/dx²)³ + y = 0?",
      options: ['1', '2', '3', '6'],
      correct: 2,
      explanation: 'Degree = power of the highest derivative. The highest derivative d²y/dx² is raised to power 3.',
    },
    {
      id: 'c3',
      question: 'Which is an ODE (ordinary differential equation)?',
      options: [
        '∂u/∂t = k ∂²u/∂x²',
        'dy/dx + 2y = x',
        '∂²φ/∂x² + ∂²φ/∂y² = 0',
        'None of the above',
      ],
      correct: 1,
      explanation: 'An ODE has only one independent variable. dy/dx + 2y = x has only x as the independent variable.',
    },
    {
      id: 'c4',
      question: 'Which DE is linear?',
      options: [
        'y(dy/dx) = x',
        '(dy/dx)² = 1 − y²',
        'dy/dx + 2y = x',
        "y'' + y² = sin x",
      ],
      correct: 2,
      explanation: 'dy/dx + 2y = x is linear because y and dy/dx both appear to the first power only, with no products between them.',
    },
    {
      id: 'c5',
      question: 'A PDE involves:',
      options: [
        'One independent variable',
        'Only constants',
        'Two or more independent variables',
        'No derivatives',
      ],
      correct: 2,
      explanation: 'A Partial Differential Equation (PDE) involves partial derivatives with respect to two or more independent variables.',
    },
  ],
  formation: [
    {
      id: 'f1',
      question: 'To form a DE from y = Cx², how many times must we differentiate?',
      options: ['0 times', '1 time', '2 times', '3 times'],
      correct: 1,
      explanation: 'There is 1 arbitrary constant (C), so we differentiate 1 time and then eliminate C to get a 1st order DE.',
    },
    {
      id: 'f2',
      question: 'The DE formed from y = Cx² is:',
      options: ['dy/dx = 2C', 'x dy/dx − 2y = 0', 'dy/dx + 2y = 0', 'y dx − 2x dy = 0'],
      correct: 1,
      explanation: "From y = Cx²: y' = 2Cx. Dividing: y'/y = 2/x → x dy/dx = 2y → x dy/dx − 2y = 0.",
    },
    {
      id: 'f3',
      question: 'The DE formed from y = Aeˣ + Be⁻ˣ is:',
      options: ["y'' + y = 0", "y'' − y = 0", "y' − y = 0", "y'' + 2y' = 0"],
      correct: 1,
      explanation: "y = Aeˣ + Be⁻ˣ → y'' = Aeˣ + Be⁻ˣ = y → y'' − y = 0.",
    },
    {
      id: 'f4',
      question: 'A family of curves with 2 arbitrary constants produces a DE of order:',
      options: ['1', '2', '3', 'Depends on the curve'],
      correct: 1,
      explanation: 'The order of the resulting DE equals the number of arbitrary constants being eliminated.',
    },
    {
      id: 'f5',
      question: 'Which is the correct DE for y = A sin x + B cos x?',
      options: ["y'' + y = 0", "y'' − y = 0", "y' + y = 0", "y'' + 2y' = 0"],
      correct: 0,
      explanation: "y' = A cos x − B sin x, y'' = −A sin x − B cos x = −y → y'' + y = 0.",
    },
  ],
  separable: [
    {
      id: 's1',
      question: 'Which step is correct to separate dy/dx = x/y?',
      options: ['y dx = x dy', 'y dy = x dx', 'dy/x = dx/y', 'x dy = y dx'],
      correct: 1,
      explanation: 'Cross-multiplying dy/dx = x/y gives y dy = x dx — all y terms on left, all x terms on right.',
    },
    {
      id: 's2',
      question: 'The general solution of dy/dx = x/y is:',
      options: ['y² = x² + C', 'y² − x² = C', 'y = x + C', 'y/x = C'],
      correct: 1,
      explanation: 'Integrating y dy = x dx: y²/2 = x²/2 + C₁, or y² − x² = C (where C = 2C₁).',
    },
    {
      id: 's3',
      question: 'For dy/dx = −2xy², y(0) = 2, what is the particular solution?',
      options: [
        'y = 2/(2x² + 1)',
        'y = 1/(x² + 1)',
        'y = 2/(x² + 2)',
        'y = 1/(2x² + 1)',
      ],
      correct: 0,
      explanation: 'Separating: dy/y² = −2x dx → −1/y = −x² + C. At y(0)=2: C = −1/2. So 1/y = x² + 1/2 → y = 2/(2x²+1).',
    },
    {
      id: 's4',
      question: 'The method works when a DE can be written as:',
      options: ['f(x)y = g(x)', 'g(y) dy = f(x) dx', 'dy + dx = 0', 'f(x,y) = 0'],
      correct: 1,
      explanation: 'Variable separable method applies when we can write the DE as g(y) dy = f(x) dx — completely separated.',
    },
    {
      id: 's5',
      question: 'Integrating dy/y gives:',
      options: ['y + C', 'ln|y| + C', '1/y + C', 'e^y + C'],
      correct: 1,
      explanation: '∫ dy/y = ln|y| + C. This is a standard integral used frequently in separable DEs.',
    },
  ],
  homogeneous: [
    {
      id: 'h1',
      question: 'A DE dy/dx = f(x,y) is homogeneous if:',
      options: [
        'f(x,y) = x + y',
        'f(tx, ty) = f(x, y) for all t',
        'f depends only on x',
        'The DE is linear',
      ],
      correct: 1,
      explanation: 'A function is homogeneous of degree 0 if f(tx, ty) = f(x, y). The DE is then solvable by substitution v = y/x.',
    },
    {
      id: 'h2',
      question: 'For the substitution y = vx in a homogeneous DE, dy/dx becomes:',
      options: ['v', 'x dv/dx', 'v + x dv/dx', 'dv/dx'],
      correct: 2,
      explanation: 'By product rule: d/dx(vx) = v·1 + x·dv/dx = v + x dv/dx.',
    },
    {
      id: 'h3',
      question: 'After substituting v = y/x in dy/dx = (y² − x²)/(2xy), the equation becomes:',
      options: [
        'x dv/dx = v',
        'x dv/dx = −(v²+1)/(2v)',
        'dv/dx = v²/(2v)',
        'v + x dv/dx = v',
      ],
      correct: 1,
      explanation: 'After substitution: v + x dv/dx = (v²−1)/(2v). Simplifying: x dv/dx = −(v²+1)/(2v).',
    },
    {
      id: 'h4',
      question: 'The solution of dy/dx = (y² − x²)/(2xy) is:',
      options: ['x² + y² = C', 'x² + y² = Cx', 'y² − x² = Cx', 'x² − y² = C'],
      correct: 1,
      explanation: 'After solving and back-substituting v = y/x, we get x² + y² = Cx.',
    },
    {
      id: 'h5',
      question: 'Which substitution converts a homogeneous DE to separable?',
      options: ['y = v + x', 'y = vx', 'y = v/x', 'y = xe^v'],
      correct: 1,
      explanation: 'The standard substitution for homogeneous DEs is y = vx (or equivalently v = y/x).',
    },
  ],
  'linear-de': [
    {
      id: 'l1',
      question: 'The standard form of a linear first-order DE is:',
      options: [
        'dy/dx = P(x)y',
        'dy/dx + P(x)y = Q(x)',
        'P(x)dy/dx + Q(x)y = 0',
        'dy/dx · y = P(x)',
      ],
      correct: 1,
      explanation: 'The standard form is dy/dx + P(x)y = Q(x), where P and Q are functions of x only.',
    },
    {
      id: 'l2',
      question: 'The integrating factor (I.F.) for dy/dx + Py = Q is:',
      options: ['e^(Px)', 'e^(∫P dx)', 'e^Q', '∫P dx'],
      correct: 1,
      explanation: 'The integrating factor is μ(x) = e^(∫P dx). Multiplying both sides by this makes the left side a perfect derivative.',
    },
    {
      id: 'l3',
      question: 'For y\' − y/(x+1) = e^x(x+1), the I.F. is:',
      options: ['e^x', '1/(x+1)', 'x+1', 'e^(1/(x+1))'],
      correct: 1,
      explanation: 'P = −1/(x+1), so I.F. = e^(∫ −1/(x+1) dx) = e^(−ln|x+1|) = 1/(x+1).',
    },
    {
      id: 'l4',
      question: "After finding I.F., the solution formula is:",
      options: [
        'y = ∫Q dx + C',
        'y · (I.F.) = ∫Q · (I.F.) dx + C',
        'y = Q · (I.F.) + C',
        'y / (I.F.) = ∫Q dx + C',
      ],
      correct: 1,
      explanation: 'The solution formula is y · (I.F.) = ∫ Q · (I.F.) dx + C. Multiplying by I.F. creates d/dx[y · I.F.] on the left.',
    },
    {
      id: 'l5',
      question: "For y' + y = e^x with y(0) = 1, the particular solution is:",
      options: ['y = eˣ/2 + e⁻ˣ/2', 'y = eˣ − e⁻ˣ', 'y = (eˣ + 1)/2', 'y = cosh x + 1'],
      correct: 0,
      explanation: 'I.F. = eˣ. Solution: eˣy = e²ˣ/2 + C. At y(0)=1: 1 = 1/2 + C → C = 1/2. So y = eˣ/2 + e⁻ˣ/2 = cosh x.',
    },
  ],
  bernoulli: [
    {
      id: 'b1',
      question: 'The standard Bernoulli form is:',
      options: [
        'dy/dx + Py = Q',
        'dy/dx + Py = Qyⁿ',
        'dy/dx = Py + Qyⁿ',
        'y dy/dx + Py = Q',
      ],
      correct: 1,
      explanation: 'Bernoulli form: dy/dx + Py = Qyⁿ. When n=0 or n=1, it reduces to a standard linear DE.',
    },
    {
      id: 'b2',
      question: 'For a Bernoulli DE with power n, the substitution is:',
      options: ['z = yⁿ', 'z = y^(n+1)', 'z = y^(1−n)', 'z = 1/y'],
      correct: 2,
      explanation: 'The substitution z = y^(1−n) linearizes the Bernoulli equation. For n=2, this gives z = y^(−1) = 1/y.',
    },
    {
      id: 'b3',
      question: 'In solving x² dy + y(x+y) dx = 0, the Bernoulli power n equals:',
      options: ['0', '1', '2', '−1'],
      correct: 2,
      explanation: 'Rewriting: dy/dx = −y/x − y²/x² = Py + Qy². Since the yⁿ term has n=2.',
    },
    {
      id: 'b4',
      question: 'After substituting z = 1/y in a Bernoulli DE (n=2), dz/dx equals:',
      options: ['dy/dx', '−(1/y²)(dy/dx)', '(1/y)(dy/dx)', '−y² dy/dx'],
      correct: 1,
      explanation: 'z = y⁻¹ → dz/dx = −y⁻²(dy/dx) = −(1/y²)(dy/dx). This replaces dy/dx in terms of z.',
    },
    {
      id: 'b5',
      question: "For y' − y = xy⁻¹, the substitution z = y² gives the linear DE:",
      options: ['dz/dx − 2z = 2x', 'dz/dx + 2z = 2x', 'dz/dx − z = x', 'dz/dx = 2x'],
      correct: 0,
      explanation: 'z = y², dz/dx = 2y dy/dx. Multiplying y\' − y = xy⁻¹ by 2y: 2y dy/dx − 2y² = 2x → dz/dx − 2z = 2x.',
    },
  ],
  'exact-de': [
    {
      id: 'e1',
      question: 'A DE M dx + N dy = 0 is exact if:',
      options: ['M = N', '∂M/∂y = ∂N/∂x', '∂M/∂x = ∂N/∂y', 'M·N = constant'],
      correct: 1,
      explanation: 'Exactness condition: ∂M/∂y = ∂N/∂x. This ensures the DE is the total differential of some function F(x,y).',
    },
    {
      id: 'e2',
      question: 'In solving an exact DE, Step I is to:',
      options: [
        'Integrate N w.r.t. y',
        'Integrate M w.r.t. x, keeping y constant',
        'Differentiate M w.r.t. x',
        'Find ∂M/∂y',
      ],
      correct: 1,
      explanation: 'Step I (H.K. Dass): Integrate M w.r.t. x, treating y as a constant.',
    },
    {
      id: 'e3',
      question: 'Step II says to integrate w.r.t. y:',
      options: [
        'All terms of N',
        'All terms of M',
        'Only terms of N that do NOT contain x',
        'Only terms of N that contain x',
      ],
      correct: 2,
      explanation: "Step II: Integrate only those terms of N that don't contain x (to avoid counting x-terms twice).",
    },
    {
      id: 'e4',
      question: 'For (5x⁴ + 3x²y² − 2xy³)dx + (2x³y − 3x²y² − 5y⁴)dy = 0, check ∂M/∂y:',
      options: ['6x²y − 6xy²', '6x²y + 6xy²', '3x²y − 2y³', '2x³ − 6xy²'],
      correct: 0,
      explanation: 'M = 5x⁴ + 3x²y² − 2xy³ → ∂M/∂y = 6x²y − 6xy². This equals ∂N/∂x, confirming exactness.',
    },
    {
      id: 'e5',
      question: 'The solution of the exact DE in Q4 is:',
      options: [
        'x⁵ + x³y² − x²y³ − y⁵ = C',
        'x⁴ + x³y − y⁴ = C',
        'x⁵y − y⁵ = C',
        'x³y² − x²y³ = C',
      ],
      correct: 0,
      explanation: '∫M dx = x⁵ + x³y² − x²y³. Terms of N without x: −5y⁴ → ∫= −y⁵. Solution: x⁵ + x³y² − x²y³ − y⁵ = C.',
    },
  ],
}

export function getQuiz(chapterSlug: string): QuizQuestion[] {
  return QUIZ_QUESTIONS[chapterSlug] ?? []
}
