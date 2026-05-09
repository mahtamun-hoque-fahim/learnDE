export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

// Daily-seeded shuffle — questions rotate every day automatically
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function getDailyQuestions(slug: string, count = 10): QuizQuestion[] {
  const pool = QUIZ_QUESTIONS[slug] ?? []
  if (pool.length === 0) return []
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const shuffled = seededShuffle(pool, seed)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  intro: [
    { id: 'i1', question: 'What is a differential equation?', options: ['An equation involving only algebraic variables', 'An equation relating a function and one or more of its derivatives', 'An equation with two unknowns', 'An equation involving integration only'], correct: 1, explanation: 'A DE relates an unknown function with its derivatives. We solve for a function, not a number.' },
    { id: 'i2', question: 'The general solution of dy/dx = 2x is:', options: ['y = 2', 'y = x² + C', 'y = 2x + C', 'y = x² - C'], correct: 1, explanation: 'Integrating dy/dx = 2x gives y = x² + C, where C is an arbitrary constant.' },
    { id: 'i3', question: 'The order of the DE d²y/dx² + 3(dy/dx) = 0 is:', options: ['0', '1', '2', '3'], correct: 2, explanation: 'Order = highest derivative present. Here d²y/dx² makes it second order.' },
    { id: 'i4', question: 'The degree of the DE (d²y/dx²)³ + dy/dx = x is:', options: ['1', '2', '3', '6'], correct: 2, explanation: 'Degree = power of the highest order derivative when polynomial in derivatives. (d²y/dx²)³ → degree 3.' },
    { id: 'i5', question: 'A particular solution differs from a general solution in that it:', options: ['Has higher order', 'Has no arbitrary constants', 'Always equals zero', 'Contains more variables'], correct: 1, explanation: 'A particular solution is obtained by assigning specific values to the arbitrary constants (e.g., using initial conditions).' },
    { id: 'i6', question: 'Which of the following is a linear DE?', options: ['y dy/dx + x = 0', 'd²y/dx² + y² = 0', 'd²y/dx² + 3 dy/dx + 2y = eˣ', '(dy/dx)² = y'], correct: 2, explanation: 'A linear DE has y and its derivatives to the first power only. d²y/dx² + 3dy/dx + 2y = eˣ satisfies this.' },
    { id: 'i7', question: 'Formation of a DE from y = Ax + B (A, B constants) gives:', options: ['dy/dx = A', 'd²y/dx² = 0', 'd²y/dx² = A', 'dy/dx = 0'], correct: 1, explanation: 'Differentiating twice: dy/dx = A, d²y/dx² = 0. The DE is d²y/dx² = 0.' },
    { id: 'i8', question: 'The general solution of an nth-order DE contains:', options: ['No constants', 'Exactly n arbitrary constants', 'More than n constants', 'n² constants'], correct: 1, explanation: 'The general solution of an nth-order DE contains exactly n arbitrary constants.' },
    { id: 'i9', question: 'The DE representing all circles centred at the origin is:', options: ['x + y dy/dx = 0', 'y = mx + c', 'x dx + y dy = 0', 'dy/dx = x/y'], correct: 2, explanation: 'x² + y² = r². Differentiating: 2x + 2y dy/dx = 0 → x dx + y dy = 0.' },
    { id: 'i10', question: 'The solution of dy/dx = 0 is:', options: ['y = x', 'y = C (constant)', 'y = Cx', 'y = x + C'], correct: 1, explanation: 'If dy/dx = 0, integrating gives y = C, meaning y is a constant function.' },
  ],
  separable: [
    { id: 's1', question: 'Which DE is variable separable?', options: ['dy/dx = x + y', 'dy/dx = xy', 'dy/dx = x² + y²', 'x dy + y dx = xy dy'], correct: 1, explanation: 'dy/dx = xy → dy/y = x dx. Variables x and y are separated on opposite sides.' },
    { id: 's2', question: 'Solving dy/dx = y gives:', options: ['y = x + C', 'y = Ceˣ', 'y = Ce⁻ˣ', 'y = eˣ + C'], correct: 1, explanation: 'Separating: dy/y = dx → ln|y| = x + C₁ → y = Ceˣ.' },
    { id: 's3', question: 'The general solution of dy/dx = x/y is:', options: ['y² = x² + C', 'y = x + C', 'y² - x² = C', 'y² = 2x² + C'], correct: 0, explanation: 'y dy = x dx → y²/2 = x²/2 + C₁ → y² = x² + C.' },
    { id: 's4', question: 'For dy/dx = (1+y²)/(1+x²), after separating variables you get:', options: ['dy/(1+y²) = dx/(1+x²)', 'dy(1+y²) = dx(1+x²)', '(1+y²)dy = dx', 'dy = (1+x²)dx/(1+y²)'], correct: 0, explanation: 'Rearranging: dy/(1+y²) = dx/(1+x²). Integrating gives arctan y = arctan x + C.' },
    { id: 's5', question: 'Solving (1+x) dy = y dx gives:', options: ['y = C(1+x)', 'y = Ceˣ/(1+x)', 'y = C/(1+x)', 'y = x/(1+x)'], correct: 0, explanation: 'dy/y = dx/(1+x) → ln|y| = ln|1+x| + C₁ → y = C(1+x).' },
    { id: 's6', question: 'The solution of dy/dx = e^(x-y) is:', options: ['eʸ = eˣ + C', 'e⁻ʸ = eˣ + C', 'eʸ + eˣ = C', 'eʸ - eˣ = C'], correct: 0, explanation: 'dy/dx = eˣ·e⁻ʸ → eʸ dy = eˣ dx → eʸ = eˣ + C.' },
    { id: 's7', question: 'For a separable DE f(x) dx + g(y) dy = 0, the solution is:', options: ['∫f(x)dx = ∫g(y)dy', '∫f(x)dx + ∫g(y)dy = C', 'f(x) + g(y) = C', 'f(x)g(y) = C'], correct: 1, explanation: 'Integrating both sides of f(x)dx + g(y)dy = 0 gives ∫f(x)dx + ∫g(y)dy = C.' },
    { id: 's8', question: 'The particular solution of dy/dx = 2y, y(0) = 3 is:', options: ['y = 3e²ˣ', 'y = 2e³ˣ', 'y = 3e⁻²ˣ', 'y = eˣ + 2'], correct: 0, explanation: 'General: y = Ce²ˣ. At x=0: 3 = C → y = 3e²ˣ.' },
    { id: 's9', question: 'Which substitution reduces dy/dx = f(ax + by + c) to separable form?', options: ['v = y/x', 'v = ax + by + c', 'v = x + y', 'v = x/y'], correct: 1, explanation: 'Setting v = ax + by + c gives dv/dx = a + b·f(v), which is separable.' },
    { id: 's10', question: 'The solution of sec²x tan y dx + sec²y tan x dy = 0 is:', options: ['tan x · tan y = C', 'tan x + tan y = C', 'sec x · sec y = C', 'sin x + sin y = C'], correct: 0, explanation: 'Separating and integrating: ln|tan x| + ln|tan y| = ln C → tan x · tan y = C.' },
  ],
  homogeneous: [
    { id: 'h1', question: 'A homogeneous function of degree n satisfies:', options: ['f(x,y) = n·f(x,y)', 'f(tx,ty) = tⁿ f(x,y)', 'f(x+t, y+t) = tⁿ f(x,y)', 'f(x,y) = xⁿ + yⁿ'], correct: 1, explanation: 'A function is homogeneous of degree n if f(tx,ty) = tⁿ f(x,y) for all t.' },
    { id: 'h2', question: 'The substitution used to solve a homogeneous DE dy/dx = f(y/x) is:', options: ['y = vx²', 'y = vx', 'x = vy', 'y = v + x'], correct: 1, explanation: 'y = vx (dy/dx = v + x dv/dx) transforms any homogeneous DE into separable form.' },
    { id: 'h3', question: 'The DE (x² + y²)dx - 2xy dy = 0 is:', options: ['Linear', 'Exact', 'Homogeneous of degree 2', 'Bernoulli'], correct: 2, explanation: 'Each term has degree 2 in x and y. f(tx,ty) = t² f(x,y) confirms homogeneous degree 2.' },
    { id: 'h4', question: 'After y = vx in dy/dx = (x+y)/(x-y), x dv/dx equals:', options: ['(1+v²)/(1-v)', 'v + 1', '1/(1-v)', '(1+v)/(1-v) - v'], correct: 3, explanation: 'dy/dx = (1+v)/(1-v). Since dy/dx = v + x dv/dx: x dv/dx = (1+v)/(1-v) - v.' },
    { id: 'h5', question: 'The solution of x dy/dx = y + x is:', options: ['y = x ln x + Cx', 'y = x ln x + C', 'y = Cx - x', 'y = Cx'], correct: 0, explanation: 'Put y = vx: x dv/dx = 1 → v = ln x + C → y = x(ln x + C) = x ln x + Cx.' },
    { id: 'h6', question: 'Is x² dy/dx = y² + xy homogeneous?', options: ['No, mixed terms', 'Yes, degree 2', 'Yes, degree 1', 'No, it is linear'], correct: 1, explanation: 'dy/dx = (y² + xy)/x². f(tx,ty)/t² = same → degree 0 in dy/dx → homogeneous.' },
    { id: 'h7', question: 'For dy/dx = (ax+by+c)/(dx+ey+f) with a/d = b/e, the substitution is:', options: ['y = vx', 'Shift x = X+h, y = Y+k', 'v = ax + by', 'v = x + y'], correct: 2, explanation: 'When a/d = b/e lines are parallel; shift fails. Set v = ax + by to get separable.' },
    { id: 'h8', question: 'The general solution of dy/dx = y/x is:', options: ['y = Cx²', 'y = x + C', 'y = Cx', 'ln y = x + C'], correct: 2, explanation: 'Separating: dy/y = dx/x → ln|y| = ln|x| + ln|C| → y = Cx.' },
    { id: 'h9', question: 'After solving in terms of v and x, the final step is:', options: ['Leave in v', 'Substitute back v = y/x', 'Differentiate once more', 'Multiply by x'], correct: 1, explanation: 'Since v = y/x, substitute back to express the solution in x and y.' },
    { id: 'h10', question: 'The DE dy/dx = (x³ + y³)/(xy²) is:', options: ['Separable', 'Linear of order 1', 'Homogeneous of degree 0', 'Exact'], correct: 2, explanation: 'Numerator degree 3, denominator degree 3 → dy/dx has degree 0 → homogeneous.' },
  ],
  linear: [
    { id: 'l1', question: 'The standard form of a first-order linear DE is:', options: ['dy/dx + P(x)y = Q(x)', 'dy/dx = P(x) + Q(x)y', 'P(x)y² + Q(x)y = R(x)', 'd²y/dx² + Py = Q'], correct: 0, explanation: 'Standard form: dy/dx + P(x)y = Q(x), with P and Q functions of x only.' },
    { id: 'l2', question: 'The integrating factor (IF) for dy/dx + P(x)y = Q(x) is:', options: ['e^(∫P dx)', 'e^(∫Q dx)', '∫P dx', 'P(x)'], correct: 0, explanation: 'IF = e^(∫P dx) makes the left side the exact derivative d/dx[y·IF].' },
    { id: 'l3', question: 'After multiplying by IF, the linear DE becomes:', options: ['d/dx[y·IF] = Q·IF', 'd/dx[IF] = Q', 'y·IF = ∫Q dx', 'IF·dy/dx = Q'], correct: 0, explanation: 'The left side collapses to d/dx[y·IF] = Q·IF, which integrates directly.' },
    { id: 'l4', question: 'The IF for dy/dx + (1/x)y = x² is:', options: ['x', 'eˣ', 'ln x', '1/x'], correct: 0, explanation: 'P(x) = 1/x. IF = e^(∫1/x dx) = e^(ln x) = x.' },
    { id: 'l5', question: 'Solving dy/dx - y = eˣ gives:', options: ['y = (x+C)eˣ', 'y = xeˣ + Ceˣ', 'y = Ce⁻ˣ + eˣ', 'y = xeˣ + C'], correct: 0, explanation: 'P = -1, IF = e^(-x). d/dx[ye^(-x)] = 1. Integrate: ye^(-x) = x + C → y = (x+C)eˣ.' },
    { id: 'l6', question: 'A first-order linear DE general solution has how many arbitrary constants?', options: ['0', '1', '2', 'Depends on P(x)'], correct: 1, explanation: 'Order 1 → exactly 1 arbitrary constant in the general solution.' },
    { id: 'l7', question: 'The DE dy/dx + y tan x = sec x has IF:', options: ['sec x', 'cos x', 'sin x', 'tan x'], correct: 0, explanation: 'P = tan x. IF = e^(∫tan x dx) = e^(ln sec x) = sec x.' },
    { id: 'l8', question: 'For x dy/dx + 2y = x³ in standard form, P(x) is:', options: ['2', '2/x', 'x', 'x²'], correct: 1, explanation: 'Divide by x: dy/dx + (2/x)y = x². So P(x) = 2/x.' },
    { id: 'l9', question: 'Which is NOT a first-order linear DE?', options: ['dy/dx + 2y = sin x', 'dy/dx = y tan x + sec x', 'dy/dx + y² = x', 'x dy/dx - y = x²'], correct: 2, explanation: 'dy/dx + y² = x is non-linear due to y². Linear DEs need y to the first power only.' },
    { id: 'l10', question: 'After finding y·IF = ∫Q·IF dx + C, y equals:', options: ['IF · (∫Q·IF dx + C)', '(∫Q·IF dx + C) / IF', '∫Q·IF dx', '(Q + C) / IF'], correct: 1, explanation: 'Dividing both sides by IF: y = (∫Q·IF dx + C) / IF.' },
  ],
  bernoulli: [
    { id: 'b1', question: "Bernoulli's equation has the form:", options: ['dy/dx + P(x)y = Q(x)yⁿ', 'dy/dx + P(x)y² = Q(x)', 'd²y/dx² + Py = Qyⁿ', 'dy/dx + Py = Q/yⁿ'], correct: 0, explanation: "Bernoulli's standard form is dy/dx + P(x)y = Q(x)yⁿ, where n ≠ 0,1." },
    { id: 'b2', question: 'The substitution that reduces a Bernoulli DE to linear is:', options: ['v = yⁿ', 'v = y^(1-n)', 'v = 1/y', 'v = ln y'], correct: 1, explanation: 'v = y^(1-n) so dv/dx = (1-n)y^(-n)dy/dx, turning the equation linear in v.' },
    { id: 'b3', question: 'For dy/dx + y = y², n equals:', options: ['0', '1', '2', '-1'], correct: 2, explanation: 'Comparing with dy/dx + Py = Qyⁿ: n = 2.' },
    { id: 'b4', question: 'After substituting v = y^(1-n) in a Bernoulli DE, the resulting equation in v is:', options: ['Separable', 'Homogeneous', 'Linear in v', 'Exact'], correct: 2, explanation: 'Substitution always gives dv/dx + (1-n)P(x)v = (1-n)Q(x), linear in v.' },
    { id: 'b5', question: 'For dy/dx - y = xy², setting v = y⁻¹ gives:', options: ['dv/dx + v = -x', 'dv/dx - v = -x', 'dv/dx + v = x', 'dv/dx - v = x'], correct: 0, explanation: 'Multiply by -y⁻², set v = y⁻¹: dv/dx + v = -x.' },
    { id: 'b6', question: 'If n = 0 in a Bernoulli DE, the equation is:', options: ['A homogeneous DE', 'Already a standard linear DE', 'Separable only', 'An exact DE'], correct: 1, explanation: 'n = 0: yⁿ = 1, giving dy/dx + Py = Q — already linear.' },
    { id: 'b7', question: 'If n = 1, the Bernoulli DE dy/dx + Py = Qy is solved by:', options: ['Bernoulli substitution', 'Separating variables', 'Homogeneous substitution', 'IF only'], correct: 1, explanation: 'n = 1: dy/dx = (Q-P)y → dy/y = (Q-P)dx — separable.' },
    { id: 'b8', question: 'The DE dy/dx + (1/x)y = x²y³ has n = ?', options: ['1', '2', '3', '-3'], correct: 2, explanation: 'Right side is x²y³, so n = 3. Substitution: v = y^(1-3) = y⁻².' },
    { id: 'b9', question: 'Dividing Bernoulli DE by yⁿ gives:', options: ['y⁻ⁿ dy/dx + Py^(1-n) = Q', 'dy/dx + P = Q', 'y⁻ⁿ dy/dx - Py^(1-n) = Q', 'dy/dx + Pyⁿ = Q'], correct: 0, explanation: 'Dividing by yⁿ: y⁻ⁿ dy/dx + P·y^(1-n) = Q. Now set v = y^(1-n).' },
    { id: 'b10', question: 'After solving for v, the final answer is obtained by:', options: ['Leaving in v', 'Substituting back v = y^(1-n)', 'Multiplying by n', 'Differentiating v'], correct: 1, explanation: 'Since v = y^(1-n), substitute back to express in original variable y.' },
  ],
  exact: [
    { id: 'e1', question: 'The DE M dx + N dy = 0 is exact if:', options: ['∂M/∂x = ∂N/∂y', '∂M/∂y = ∂N/∂x', 'M = N', '∂²M/∂x² = ∂²N/∂y²'], correct: 1, explanation: 'Exactness condition: ∂M/∂y = ∂N/∂x. This ensures M dx + N dy = dF for some F(x,y).' },
    { id: 'e2', question: 'If M dx + N dy = 0 is exact, F(x,y) satisfies:', options: ['∂F/∂x = N and ∂F/∂y = M', '∂F/∂x = M and ∂F/∂y = N', 'F = ∫M dx = ∫N dy', '∂F/∂x = ∂F/∂y'], correct: 1, explanation: 'dF = M dx + N dy means ∂F/∂x = M and ∂F/∂y = N.' },
    { id: 'e3', question: 'When integrating M w.r.t. x for an exact DE, the "constant" is:', options: ['A numeric constant', 'A function of y only, φ(y)', 'A function of x only', 'Zero'], correct: 1, explanation: 'Integrating M w.r.t. x, the constant can depend on y: it is φ(y), found from ∂F/∂y = N.' },
    { id: 'e4', question: 'Is (2xy) dx + (x² - 1) dy = 0 exact?', options: ['Yes, ∂M/∂y = ∂N/∂x = 2x', 'No, ∂M/∂y ≠ ∂N/∂x', 'Yes, because M + N = x² + 2xy - 1', 'Cannot be determined'], correct: 0, explanation: '∂M/∂y = 2x and ∂N/∂x = 2x. Equal → exact.' },
    { id: 'e5', question: 'The solution of (2x + y) dx + (x - 2y) dy = 0 is:', options: ['x² + xy - y² = C', 'x² + xy + y² = C', 'x² - xy - y² = C', '2x + xy = C'], correct: 0, explanation: 'F = ∫(2x+y)dx = x²+xy+φ(y). ∂F/∂y = x+φ(y) = x-2y → φ = -y². So x²+xy-y² = C.' },
    { id: 'e6', question: 'An IF μ(x) for a non-exact DE exists when:', options: ['(∂M/∂y - ∂N/∂x)/N is a function of x only', '(∂M/∂y - ∂N/∂x)/M is a function of y only', 'Both of the above', 'Neither'], correct: 0, explanation: 'If (My - Nx)/N = f(x) only, then IF = e^(∫f dx).' },
    { id: 'e7', question: 'Is (y² + 2xy) dx + (2xy + x²) dy = 0 exact?', options: ['Yes, ∂M/∂y = ∂N/∂x = 2y + 2x', 'No', 'Yes, terms cancel', 'It is separable'], correct: 0, explanation: '∂M/∂y = 2y+2x and ∂N/∂x = 2y+2x. Equal → exact.' },
    { id: 'e8', question: 'After finding F(x,y), the general solution is written as:', options: ['F(x,y) = 0', 'F(x,y) = C', 'dF = 0', 'F(x,y) + C = 0'], correct: 1, explanation: 'General solution: F(x,y) = C, with C an arbitrary constant.' },
    { id: 'e9', question: 'The shortcut for F in exact DEs is:', options: ['∫M dx + ∫(terms in N not involving x) dy = C', '∫M dx · ∫N dy = C', '∫(M+N) dx = C', '∫M/N dx = C'], correct: 0, explanation: 'F = ∫M dx (y constant) + ∫(N terms free of x) dy = C.' },
    { id: 'e10', question: 'The exactness condition ∂M/∂y = ∂N/∂x comes from:', options: ['Mean Value Theorem', "Clairaut's theorem on mixed partials", "Green's theorem", "Euler's theorem"], correct: 1, explanation: "If F exists with Fx = M, Fy = N, Clairaut's theorem gives Fyx = Fxy → My = Nx." },
  ],
  applications: [
    { id: 'a1', question: "Newton's law of cooling states:", options: ['dT/dt = k(T - Tₛ) where k > 0', 'dT/dt = k(Tₛ - T) where k > 0', 'dT/dt = kT²', 'dT/dt = -kTₛ'], correct: 1, explanation: 'Rate of cooling proportional to temperature difference: dT/dt = k(Tₛ - T), k > 0.' },
    { id: 'a2', question: 'DE for exponential population growth with rate k:', options: ['dP/dt = k', 'dP/dt = kP', 'dP/dt = k/P', 'd²P/dt² = kP'], correct: 1, explanation: 'Malthusian growth: rate proportional to population → dP/dt = kP.' },
    { id: 'a3', question: 'A body falls with air resistance proportional to velocity. The DE is:', options: ['m dv/dt = mg', 'm dv/dt = mg - kv', 'm dv/dt = mg + kv', 'm dv/dt = -kv'], correct: 1, explanation: 'Gravity mg downward, resistance kv upward: m dv/dt = mg - kv.' },
    { id: 'a4', question: 'Solution of dP/dt = kP with P(0) = P₀:', options: ['P = P₀ + kt', 'P = P₀eᵏᵗ', 'P = P₀e⁻ᵏᵗ', 'P = P₀/(1+kt)'], correct: 1, explanation: 'Separating and integrating: P = P₀eᵏᵗ.' },
    { id: 'a5', question: 'In a simple LR circuit, the DE for current i(t) is:', options: ['L di/dt + Ri = E', 'L di/dt - Ri = E', 'R di/dt + Li = E', 'L d²i/dt² = E'], correct: 0, explanation: 'Kirchhoff: L di/dt + Ri = E.' },
    { id: 'a6', question: 'Terminal velocity in m dv/dt = mg - kv is:', options: ['mg', 'k/mg', 'mg/k', 'mk/g'], correct: 2, explanation: 'At terminal velocity dv/dt = 0 → v_terminal = mg/k.' },
    { id: 'a7', question: 'Radioactive decay follows:', options: ['dN/dt = kN (k>0)', 'dN/dt = -kN (k>0)', 'dN/dt = k/N', 'd²N/dt² = -kN'], correct: 1, explanation: 'Decay: dN/dt = -kN, k > 0 (negative = decreasing).' },
    { id: 'a8', question: 'Half-life T₁/₂ of N = N₀e^(-kt) is:', options: ['k/ln2', 'ln2/k', '1/k', '2/k'], correct: 1, explanation: 'N₀/2 = N₀e^(-kT₁/₂) → T₁/₂ = ln2/k.' },
    { id: 'a9', question: 'For a mixture tank problem, dQ/dt equals:', options: ['rate in - rate out', 'rate in + rate out', '-rate in', 'rate out'], correct: 0, explanation: 'Conservation: dQ/dt = (concentration in × flow in) - (concentration out × flow out).' },
    { id: 'a10', question: "Long-term temperature in Newton's cooling law approaches:", options: ['0°C', 'Initial temperature', 'Surrounding temperature Tₛ', 'Infinity'], correct: 2, explanation: 'As t → ∞, e^(-kt) → 0 → T → Tₛ.' },
  ],
  higher: [
    { id: 'ho1', question: 'General solution of 2nd-order linear homogeneous DE with constant coefficients:', options: ['y = C₁y₁ + C₂y₂ (linearly independent solutions)', 'y = y₁ · y₂', 'y = C₁ + C₂x', 'y = y₁ + C'], correct: 0, explanation: 'By superposition, y = C₁y₁ + C₂y₂ for two linearly independent solutions.' },
    { id: 'ho2', question: 'Characteristic equation of d²y/dx² - 5dy/dx + 6y = 0:', options: ['m² - 5m + 6 = 0', 'm² + 5m + 6 = 0', 'm² - 5m - 6 = 0', '5m² - m + 6 = 0'], correct: 0, explanation: 'Substituting y = eᵐˣ gives auxiliary equation m² - 5m + 6 = 0.' },
    { id: 'ho3', question: 'Real distinct roots m₁ and m₂ give general solution:', options: ['y = (C₁ + C₂x)e^(m₁x)', 'y = C₁e^(m₁x) + C₂e^(m₂x)', 'y = eˣ(C₁cos m₁x + C₂sin m₂x)', 'y = C₁cos m₁x + C₂sin m₂x'], correct: 1, explanation: 'Distinct real roots: y = C₁e^(m₁x) + C₂e^(m₂x).' },
    { id: 'ho4', question: 'Repeated root m gives general solution:', options: ['y = C₁e^(mx)', 'y = (C₁ + C₂x)e^(mx)', 'y = C₁e^(mx) + C₂e^(-mx)', 'y = e^(mx)(C₁cos x + C₂sin x)'], correct: 1, explanation: 'Repeated root m: y = (C₁ + C₂x)e^(mx).' },
    { id: 'ho5', question: 'Complex roots α ± βi give general solution:', options: ['y = C₁e^(αx) + C₂e^(βx)', 'y = e^(αx)(C₁cos βx + C₂sin βx)', 'y = C₁cos αx + C₂sin βx', 'y = e^(βx)(C₁cos αx + C₂sin αx)'], correct: 1, explanation: 'Complex roots α ± βi: y = e^(αx)(C₁cos βx + C₂sin βx).' },
    { id: 'ho6', question: 'Wronskian W(y₁, y₂) ≠ 0 means:', options: ['y₁ and y₂ are linearly dependent', 'y₁ and y₂ are linearly independent', 'The DE has no solution', 'y₁ = y₂'], correct: 1, explanation: 'W ≠ 0 guarantees linear independence — y₁, y₂ form a fundamental set.' },
    { id: 'ho7', question: 'Method of undetermined coefficients applies when right side is:', options: ['Any function', 'Polynomials, exponentials, sin/cos, or their products', 'Only eˣ', 'Only polynomials'], correct: 1, explanation: 'Works for eˣ, sin x, cos x, xⁿ, and products — functions whose derivatives stay in the same family.' },
    { id: 'ho8', question: 'General solution of a non-homogeneous DE is:', options: ['y = yₚ only', 'y = yₕ + yₚ', 'y = yₕ - yₚ', 'y = yₚ/yₕ'], correct: 1, explanation: 'General = complementary (yₕ) + particular integral (yₚ).' },
    { id: 'ho9', question: 'Roots of m² + 4 = 0 are:', options: ['m = ±2', 'm = ±2i', 'm = 2, -2', 'm = 4, -4'], correct: 1, explanation: 'm² = -4 → m = ±2i. Solution: y = C₁cos 2x + C₂sin 2x.' },
    { id: 'ho10', question: 'General solution of d³y/dx³ - y = 0 has how many arbitrary constants?', options: ['1', '2', '3', '0'], correct: 2, explanation: '3rd-order DE → 3 arbitrary constants → 3 linearly independent solutions.' },
  ],
}
