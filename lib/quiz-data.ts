export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

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

// Return questions sorted by difficulty (easy first), then daily-shuffle within each tier
export function getDailyQuestions(slug: string, count = 10): QuizQuestion[] {
  const pool = QUIZ_QUESTIONS[slug] ?? []
  if (pool.length === 0) return []
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  // Shuffle within each difficulty tier, then concatenate easy → medium → hard
  const easy   = seededShuffle(pool.filter(q => q.difficulty === 'easy'),   seed)
  const medium = seededShuffle(pool.filter(q => q.difficulty === 'medium'), seed + 1)
  const hard   = seededShuffle(pool.filter(q => q.difficulty === 'hard'),   seed + 2)
  return [...easy, ...medium, ...hard].slice(0, Math.min(count, pool.length))
}

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {

  // ──────────────────────────────────────────────
  // CH 1 — INTRODUCTION
  // ──────────────────────────────────────────────
  intro: [
    { id: 'i1',  difficulty: 'easy',   question: 'What is a differential equation?', options: ['An equation involving only algebraic variables', 'An equation relating a function and one or more of its derivatives', 'An equation with two unknowns', 'An equation involving integration only'], correct: 1, explanation: 'A DE relates an unknown function with its derivatives. We solve for a function, not a number.' },
    { id: 'i2',  difficulty: 'easy',   question: 'The general solution of $\\frac{dy}{dx} = 2x$ is:', options: ['$y = 2$', '$y = x^2 + C$', '$y = 2x + C$', '$y = x^2 - C$'], correct: 1, explanation: 'Integrating gives $y = x^2 + C$, where C is an arbitrary constant.' },
    { id: 'i10', difficulty: 'easy',   question: 'The solution of $\\frac{dy}{dx} = 0$ is:', options: ['$y = x$', '$y = C$ (constant)', '$y = Cx$', '$y = x + C$'], correct: 1, explanation: 'If $\\frac{dy}{dx} = 0$, integrating gives $y = C$.' },
    { id: 'i5',  difficulty: 'easy',   question: 'A particular solution differs from a general solution in that it:', options: ['Has higher order', 'Has no arbitrary constants', 'Always equals zero', 'Contains more variables'], correct: 1, explanation: 'A particular solution assigns specific values to the arbitrary constants using initial conditions.' },
    { id: 'i8',  difficulty: 'medium', question: 'The general solution of an nth-order DE contains:', options: ['No constants', 'Exactly n arbitrary constants', 'More than n constants', 'n² constants'], correct: 1, explanation: 'The general solution of an nth-order DE contains exactly n arbitrary constants.' },
    { id: 'i6',  difficulty: 'medium', question: 'Which of the following is a linear DE?', options: ['$y\\frac{dy}{dx} + x = 0$', '$\\frac{d^2y}{dx^2} + y^2 = 0$', '$\\frac{d^2y}{dx^2} + 3\\frac{dy}{dx} + 2y = e^x$', '$(\\frac{dy}{dx})^2 = y$'], correct: 2, explanation: 'A linear DE has y and its derivatives to the first power only, no products.' },
    { id: 'i3',  difficulty: 'medium', question: 'The order of the DE $\\frac{d^2y}{dx^2} + 3\\frac{dy}{dx} = 0$ is:', options: ['0', '1', '2', '3'], correct: 2, explanation: 'Order = highest derivative present. $\\frac{d^2y}{dx^2}$ makes it second order.' },
    { id: 'i9',  difficulty: 'medium', question: 'The DE representing all circles centred at the origin is:', options: ['$x + y\\frac{dy}{dx} = 0$', '$y = mx + c$', '$x\\,dx + y\\,dy = 0$', '$\\frac{dy}{dx} = \\frac{x}{y}$'], correct: 2, explanation: 'From $x^2 + y^2 = r^2$: differentiating gives $2x + 2y\\frac{dy}{dx} = 0$, i.e., $x\\,dx + y\\,dy = 0$.' },
    { id: 'i4',  difficulty: 'hard',   question: 'The degree of $(\\frac{d^2y}{dx^2})^3 + \\frac{dy}{dx} = x$ is:', options: ['1', '2', '3', '6'], correct: 2, explanation: 'Degree = power of the highest-order derivative. $(y\'\')^3$ → degree 3.' },
    { id: 'i7',  difficulty: 'hard',   question: 'Forming a DE from $y = Ax + B$ (A, B constants) gives:', options: ['$\\frac{dy}{dx} = A$', '$\\frac{d^2y}{dx^2} = 0$', '$\\frac{d^2y}{dx^2} = A$', '$\\frac{dy}{dx} = 0$'], correct: 1, explanation: 'Two constants → differentiate twice: $y\' = A$, $y\'\' = 0$. The DE is $y\'\' = 0$.' },
  ],

  // ──────────────────────────────────────────────
  // CH 2 — CLASSIFICATION
  // ──────────────────────────────────────────────
  classification: [
    { id: 'c1',  difficulty: 'easy',   question: 'An ODE involves derivatives with respect to:', options: ['Two or more variables', 'One independent variable', 'Partial derivatives only', 'Time only'], correct: 1, explanation: 'ODE = ordinary DE — one independent variable. PDE = partial DE — two or more.' },
    { id: 'c2',  difficulty: 'easy',   question: 'The order of $\\frac{dy}{dx} + 2y = \\sin x$ is:', options: ['0', '1', '2', '3'], correct: 1, explanation: 'Highest derivative is $\\frac{dy}{dx}$ — first derivative → order 1.' },
    { id: 'c3',  difficulty: 'easy',   question: 'Which is a non-linear DE?', options: ['$\\frac{d^2y}{dx^2} + 3y = 0$', '$\\frac{dy}{dx} + 2y = x$', '$y\\frac{dy}{dx} = x$', '$\\frac{d^2y}{dx^2} - y = e^x$'], correct: 2, explanation: '$y \\cdot \\frac{dy}{dx}$ is a product of y and its derivative — non-linear.' },
    { id: 'c4',  difficulty: 'easy',   question: 'The degree of $\\frac{dy}{dx} + y = e^x$ is:', options: ['0', '1', '2', 'Undefined'], correct: 1, explanation: 'Highest derivative $y\'$ appears to power 1 → degree 1.' },
    { id: 'c5',  difficulty: 'medium', question: 'Degree of $\\left(\\frac{d^2y}{dx^2}\\right)^3 + y = 0$:', options: ['1', '2', '3', '6'], correct: 2, explanation: 'Highest derivative $y\'\'$ raised to power 3 → degree 3.' },
    { id: 'c6',  difficulty: 'medium', question: 'The DE $\\frac{\\partial u}{\\partial t} = k\\frac{\\partial^2 u}{\\partial x^2}$ is a:', options: ['First-order ODE', 'Second-order ODE', 'First-order PDE', 'Second-order PDE'], correct: 3, explanation: 'Partial derivatives present → PDE. Highest partial is $\\frac{\\partial^2 u}{\\partial x^2}$ → second-order.' },
    { id: 'c7',  difficulty: 'medium', question: 'What is the order of $\\frac{d^3y}{dx^3} + x^2 y = 0$?', options: ['1', '2', '3', '4'], correct: 2, explanation: 'Highest derivative is $\\frac{d^3y}{dx^3}$ → order 3.' },
    { id: 'c8',  difficulty: 'medium', question: 'To find the degree of $\\sqrt{\\frac{dy}{dx}} = 1+x$, we first:', options: ['Differentiate', 'Square both sides', 'Integrate', 'Divide by x'], correct: 1, explanation: 'Clear the radical by squaring: $(y\')^2 = (1+x)^2$. Now degree = 2.' },
    { id: 'c9',  difficulty: 'hard',   question: 'Which is true about $\\left[1 + \\left(\\frac{dy}{dx}\\right)^2\\right]^{3/2} = \\frac{d^2y}{dx^2}$?', options: ['Order 1, Degree 2', 'Order 2, Degree 1', 'Order 2, Degree 2', 'Order 1, Degree 3'], correct: 2, explanation: 'Squaring both sides: $[1+(y\')^2]^3 = (y\'\')^2$. Highest derivative $y\'\'$ to power 2 → Order 2, Degree 2.' },
    { id: 'c10', difficulty: 'hard',   question: 'Superposition applies only to:', options: ['Non-linear DEs', 'Linear DEs', 'Exact DEs', 'Bernoulli DEs'], correct: 1, explanation: 'Superposition: if $y_1$ and $y_2$ satisfy a linear homogeneous DE, so does $c_1y_1 + c_2y_2$.' },
  ],

  // ──────────────────────────────────────────────
  // CH 3 — FORMATION
  // ──────────────────────────────────────────────
  formation: [
    { id: 'f1',  difficulty: 'easy',   question: 'A family of curves with 2 arbitrary constants gives a DE of order:', options: ['1', '2', '3', '4'], correct: 1, explanation: 'n constants → DE of order n. Two constants → second-order DE.' },
    { id: 'f2',  difficulty: 'easy',   question: 'The DE for $y = Cx^3$ (C arbitrary) is:', options: ['$3y = xy\'$', '$y\' = 3Cx^2$', '$xy\' - 3y = 0$', '$y\' = C$'], correct: 2, explanation: 'Differentiate: $y\' = 3Cx^2$. From original: $C = y/x^3$. So $y\' = 3(y/x^3)x^2 = 3y/x$, giving $xy\' - 3y = 0$.' },
    { id: 'f3',  difficulty: 'easy',   question: 'To eliminate n constants from a curve family you need to differentiate:', options: ['Once', 'n-1 times', 'n times', '2n times'], correct: 2, explanation: 'You differentiate n times to generate n extra equations to eliminate n constants.' },
    { id: 'f4',  difficulty: 'medium', question: 'DE for all straight lines through the origin ($y = mx$) is:', options: ['$y\' = m$', '$xy\' - y = 0$', '$y\' = y/x^2$', '$y\' - x = 0$'], correct: 1, explanation: 'Differentiate $y = mx$: $y\' = m = y/x$, so $xy\' - y = 0$.' },
    { id: 'f5',  difficulty: 'medium', question: 'DE formed from $y = Ae^x + Be^{-x}$ is:', options: ['$y\'\' - y = 0$', '$y\'\' + y = 0$', '$y\' - y = 0$', '$y\'\' - y\' = 0$'], correct: 0, explanation: '$y\'\' = Ae^x + Be^{-x} = y$, so $y\'\' - y = 0$.' },
    { id: 'f6',  difficulty: 'medium', question: 'DE for circles centred on the x-axis ($x^2 + (y-a)^2 = r^2$, a,r constants) has order:', options: ['1', '2', '3', '4'], correct: 1, explanation: 'Two constants (a and r) → differentiate twice → order 2.' },
    { id: 'f7',  difficulty: 'medium', question: 'Which DE represents $y = C_1\\sin x + C_2\\cos x$?', options: ['$y\'\' - y = 0$', '$y\'\' + y = 0$', '$y\' + y = 0$', '$y\'\' - y\' = 0$'], correct: 1, explanation: '$y\'\' = -C_1\\sin x - C_2\\cos x = -y$, so $y\'\' + y = 0$.' },
    { id: 'f8',  difficulty: 'hard',   question: 'DE for $y = Ae^{2x} + Be^{3x}$ is:', options: ['$y\'\' - 5y\' + 6y = 0$', '$y\'\' + 5y\' + 6y = 0$', '$y\'\' - 5y\' - 6y = 0$', '$y\'\' + 5y\' - 6y = 0$'], correct: 0, explanation: 'Characteristic roots 2 and 3 → $(m-2)(m-3) = m^2 - 5m + 6 = 0$ → $y\'\' - 5y\' + 6y = 0$.' },
    { id: 'f9',  difficulty: 'hard',   question: 'The DE for parabolas with axis along x-axis ($y^2 = 4ax$) is:', options: ['$y = 2xy\'$', '$yy\' = 2$', '$2y\' = y/x$', '$y = xy\'$'], correct: 0, explanation: 'Differentiate: $2y y\' = 4a$. From original: $4a = y^2/x$. So $2yy\' = y^2/x$, giving $2xy\' = y$, i.e., $y = 2xy\'$.' },
    { id: 'f10', difficulty: 'hard',   question: 'A DE of order 3 has a general solution with:', options: ['2 constants', '3 constants', '6 constants', '1 constant'], correct: 1, explanation: 'Order n ↔ n arbitrary constants in the general solution.' },
  ],

  // ──────────────────────────────────────────────
  // CH 4 — VARIABLE SEPARABLE
  // ──────────────────────────────────────────────
  separable: [
    { id: 's1',  difficulty: 'easy',   question: 'Which DE is variable separable?', options: ['$\\frac{dy}{dx} = x + y$', '$\\frac{dy}{dx} = xy$', '$\\frac{dy}{dx} = x^2 + y^2$', '$x\\,dy + y\\,dx = xy\\,dy$'], correct: 1, explanation: '$\\frac{dy}{dx} = xy$ → $\\frac{dy}{y} = x\\,dx$. Variables are cleanly separated.' },
    { id: 's2',  difficulty: 'easy',   question: 'Solving $\\frac{dy}{dx} = y$ gives:', options: ['$y = x + C$', '$y = Ce^x$', '$y = Ce^{-x}$', '$y = e^x + C$'], correct: 1, explanation: 'Separating: $\\frac{dy}{y} = dx$ → $\\ln|y| = x + C_1$ → $y = Ce^x$.' },
    { id: 's8',  difficulty: 'easy',   question: 'Particular solution of $\\frac{dy}{dx} = 2y$ with $y(0) = 3$:', options: ['$y = 3e^{2x}$', '$y = 2e^{3x}$', '$y = 3e^{-2x}$', '$y = e^x + 2$'], correct: 0, explanation: 'General: $y = Ce^{2x}$. At $x=0$: $3 = C$. So $y = 3e^{2x}$.' },
    { id: 's3',  difficulty: 'easy',   question: 'General solution of $\\frac{dy}{dx} = \\frac{x}{y}$ is:', options: ['$y^2 = x^2 + C$', '$y = x + C$', '$y^2 - x^2 = C$', '$y^2 = 2x^2 + C$'], correct: 0, explanation: '$y\\,dy = x\\,dx$ → $\\frac{y^2}{2} = \\frac{x^2}{2} + C_1$ → $y^2 = x^2 + C$.' },
    { id: 's5',  difficulty: 'medium', question: 'Solving $(1+x)\\,dy = y\\,dx$ gives:', options: ['$y = C(1+x)$', '$y = Ce^x/(1+x)$', '$y = C/(1+x)$', '$y = x/(1+x)$'], correct: 0, explanation: '$\\frac{dy}{y} = \\frac{dx}{1+x}$ → $\\ln|y| = \\ln|1+x| + C_1$ → $y = C(1+x)$.' },
    { id: 's4',  difficulty: 'medium', question: 'For $\\frac{dy}{dx} = \\frac{1+y^2}{1+x^2}$, after separating you get:', options: ['$\\frac{dy}{1+y^2} = \\frac{dx}{1+x^2}$', '$dy(1+y^2) = dx(1+x^2)$', '$(1+y^2)\\,dy = dx$', '$dy = (1+x^2)\\,dx/(1+y^2)$'], correct: 0, explanation: 'Rearranging: $\\frac{dy}{1+y^2} = \\frac{dx}{1+x^2}$. Integrating gives $\\arctan y = \\arctan x + C$.' },
    { id: 's6',  difficulty: 'medium', question: 'Solution of $\\frac{dy}{dx} = e^{x-y}$ is:', options: ['$e^y = e^x + C$', '$e^{-y} = e^x + C$', '$e^y + e^x = C$', '$e^y - e^x = C$'], correct: 0, explanation: '$e^y\\,dy = e^x\\,dx$ → $e^y = e^x + C$.' },
    { id: 's9',  difficulty: 'medium', question: 'Which substitution reduces $\\frac{dy}{dx} = f(ax+by+c)$ to separable form?', options: ['$v = y/x$', '$v = ax+by+c$', '$v = x+y$', '$v = x/y$'], correct: 1, explanation: 'Setting $v = ax+by+c$ gives $\\frac{dv}{dx} = a + b f(v)$, which is separable.' },
    { id: 's7',  difficulty: 'hard',   question: 'Solution of $\\sec^2 x\\tan y\\,dx + \\sec^2 y\\tan x\\,dy = 0$:', options: ['$\\tan x \\cdot \\tan y = C$', '$\\tan x + \\tan y = C$', '$\\sec x \\cdot \\sec y = C$', '$\\sin x + \\sin y = C$'], correct: 0, explanation: 'Dividing by $\\tan x \\tan y$: $\\frac{\\sec^2 x}{\\tan x}dx + \\frac{\\sec^2 y}{\\tan y}dy = 0$. Integrating: $\\ln|\\tan x| + \\ln|\\tan y| = \\ln C$.' },
    { id: 's10', difficulty: 'hard',   question: 'Particular solution of $\\frac{dy}{dx} = -2xy^2$, $y(0) = 2$:', options: ['$y = \\frac{2}{2x^2+1}$', '$y = \\frac{1}{x^2+1}$', '$y = 2e^{-x^2}$', '$y = \\frac{1}{2x^2-1}$'], correct: 0, explanation: '$-y^{-2}\\,dy = 2x\\,dx$ → $\\frac{1}{y} = x^2 + C$. At $y(0)=2$: $C=\\frac{1}{2}$, so $y = \\frac{2}{2x^2+1}$.' },
  ],

  // ──────────────────────────────────────────────
  // CH 5 — HOMOGENEOUS
  // ──────────────────────────────────────────────
  homogeneous: [
    { id: 'h2',  difficulty: 'easy',   question: 'The substitution for a homogeneous DE $\\frac{dy}{dx} = f(y/x)$ is:', options: ['$y = vx^2$', '$y = vx$', '$x = vy$', '$y = v + x$'], correct: 1, explanation: '$y = vx$ gives $\\frac{dy}{dx} = v + x\\frac{dv}{dx}$, converting any homogeneous DE to separable form.' },
    { id: 'h8',  difficulty: 'easy',   question: 'General solution of $\\frac{dy}{dx} = \\frac{y}{x}$ is:', options: ['$y = Cx^2$', '$y = x + C$', '$y = Cx$', '$\\ln y = x + C$'], correct: 2, explanation: '$\\frac{dy}{y} = \\frac{dx}{x}$ → $\\ln|y| = \\ln|x| + \\ln|C|$ → $y = Cx$.' },
    { id: 'h5',  difficulty: 'easy',   question: 'Solution of $x\\frac{dy}{dx} = y + x$ is:', options: ['$y = x\\ln x + Cx$', '$y = x\\ln x + C$', '$y = Cx - x$', '$y = Cx$'], correct: 0, explanation: 'Substitute $y = vx$: $x\\frac{dv}{dx} = 1$ → $v = \\ln x + C$ → $y = x(\\ln x + C)$.' },
    { id: 'h1',  difficulty: 'medium', question: 'A function $f(x,y)$ is homogeneous of degree n if:', options: ['$f(x,y) = n\\cdot f(x,y)$', '$f(tx,ty) = t^n f(x,y)$', '$f(x+t,y+t) = t^n f(x,y)$', '$f(x,y) = x^n + y^n$'], correct: 1, explanation: 'Definition: $f(tx,ty) = t^n f(x,y)$ for all t.' },
    { id: 'h3',  difficulty: 'medium', question: '$(x^2 + y^2)\\,dx - 2xy\\,dy = 0$ is:', options: ['Linear', 'Exact', 'Homogeneous of degree 2', 'Bernoulli'], correct: 2, explanation: 'Each term is degree 2. $f(tx,ty) = t^2 f(x,y)$ → homogeneous degree 2.' },
    { id: 'h6',  difficulty: 'medium', question: 'Is $x^2\\frac{dy}{dx} = y^2 + xy$ homogeneous?', options: ['No, mixed terms', 'Yes, degree 2', 'Yes, degree 0 in dy/dx', 'No, it is linear'], correct: 2, explanation: '$\\frac{dy}{dx} = \\frac{y^2+xy}{x^2}$ — numerator and denominator both degree 2 → $\\frac{dy}{dx}$ is degree 0 → homogeneous.' },
    { id: 'h9',  difficulty: 'medium', question: 'After solving in v and x, the final step is:', options: ['Leave in v', 'Substitute back $v = y/x$', 'Differentiate once more', 'Multiply by x'], correct: 1, explanation: 'Since $v = y/x$, substitute back to express in x and y.' },
    { id: 'h4',  difficulty: 'hard',   question: 'After $y = vx$ in $\\frac{dy}{dx} = \\frac{x+y}{x-y}$, $x\\frac{dv}{dx}$ equals:', options: ['$\\frac{1+v^2}{1-v}$', '$v + 1$', '$\\frac{1}{1-v}$', '$\\frac{1+v}{1-v} - v$'], correct: 0, explanation: '$x\\frac{dv}{dx} = \\frac{1+v}{1-v} - v = \\frac{1+v - v(1-v)}{1-v} = \\frac{1+v^2}{1-v}$.' },
    { id: 'h7',  difficulty: 'hard',   question: 'For $\\frac{dy}{dx} = \\frac{ax+by+c}{dx+ey+f}$ with $a/d = b/e$, the substitution is:', options: ['$y = vx$', 'Shift $x = X+h, y = Y+k$', '$v = ax + by$', '$v = x + y$'], correct: 2, explanation: 'When $a/d = b/e$, lines are parallel — shifting fails. Set $v = ax + by$ to get separable.' },
    { id: 'h10', difficulty: 'hard',   question: '$\\frac{dy}{dx} = \\frac{x^3 + y^3}{xy^2}$ is:', options: ['Separable', 'Linear', 'Homogeneous of degree 0', 'Exact'], correct: 2, explanation: 'Numerator degree 3, denominator degree 3 → $\\frac{dy}{dx}$ is degree 0 in x,y → homogeneous.' },
  ],

  // ──────────────────────────────────────────────
  // CH 6 — LINEAR DE
  // ──────────────────────────────────────────────
  'linear-de': [
    { id: 'l1',  difficulty: 'easy',   question: 'Standard form of a first-order linear DE is:', options: ['$\\frac{dy}{dx} + P(x)y = Q(x)$', '$\\frac{dy}{dx} = P(x) + Q(x)y$', '$P(x)y^2 + Q(x)y = R(x)$', '$\\frac{d^2y}{dx^2} + Py = Q$'], correct: 0, explanation: 'Standard form: $\\frac{dy}{dx} + P(x)y = Q(x)$, with P and Q functions of x only.' },
    { id: 'l2',  difficulty: 'easy',   question: 'The integrating factor (I.F.) for $\\frac{dy}{dx} + P(x)y = Q(x)$ is:', options: ['$e^{\\int P\\,dx}$', '$e^{\\int Q\\,dx}$', '$\\int P\\,dx$', '$P(x)$'], correct: 0, explanation: 'I.F. $= e^{\\int P\\,dx}$.' },
    { id: 'l4',  difficulty: 'easy',   question: 'The I.F. for $\\frac{dy}{dx} + \\frac{y}{x} = x^2$ is:', options: ['$x$', '$e^x$', '$\\ln x$', '$1/x$'], correct: 0, explanation: '$P(x) = 1/x$. I.F. $= e^{\\int 1/x\\,dx} = e^{\\ln x} = x$.' },
    { id: 'l6',  difficulty: 'easy',   question: 'A first-order linear DE has how many arbitrary constants?', options: ['0', '1', '2', 'Depends on P(x)'], correct: 1, explanation: 'Order 1 → exactly 1 arbitrary constant.' },
    { id: 'l3',  difficulty: 'medium', question: 'After multiplying by I.F., the linear DE becomes:', options: ['$\\frac{d}{dx}[y \\cdot \\text{I.F.}] = Q \\cdot \\text{I.F.}$', '$\\frac{d}{dx}[\\text{I.F.}] = Q$', '$y \\cdot \\text{I.F.} = \\int Q\\,dx$', '$\\text{I.F.}\\frac{dy}{dx} = Q$'], correct: 0, explanation: 'Left side collapses to $\\frac{d}{dx}[y \\cdot \\text{I.F.}]$, which integrates directly.' },
    { id: 'l8',  difficulty: 'medium', question: 'For $x\\frac{dy}{dx} + 2y = x^3$ in standard form, $P(x)$ is:', options: ['2', '$2/x$', '$x$', '$x^2$'], correct: 1, explanation: 'Divide by x: $\\frac{dy}{dx} + \\frac{2}{x}y = x^2$. So $P(x) = 2/x$.' },
    { id: 'l7',  difficulty: 'medium', question: 'The DE $\\frac{dy}{dx} + y\\tan x = \\sec x$ has I.F.:', options: ['$\\sec x$', '$\\cos x$', '$\\sin x$', '$\\tan x$'], correct: 0, explanation: '$P = \\tan x$. I.F. $= e^{\\int \\tan x\\,dx} = e^{\\ln|\\sec x|} = \\sec x$.' },
    { id: 'l9',  difficulty: 'medium', question: 'Which is NOT a first-order linear DE?', options: ['$\\frac{dy}{dx} + 2y = \\sin x$', '$\\frac{dy}{dx} = y\\tan x + \\sec x$', '$\\frac{dy}{dx} + y^2 = x$', '$x\\frac{dy}{dx} - y = x^2$'], correct: 2, explanation: '$\\frac{dy}{dx} + y^2 = x$ is non-linear — $y$ appears squared.' },
    { id: 'l5',  difficulty: 'hard',   question: 'Solving $\\frac{dy}{dx} - y = e^x$ gives:', options: ['$y = (x+C)e^x$', '$y = xe^x + Ce^x$', '$y = Ce^{-x} + e^x$', '$y = xe^x + C$'], correct: 0, explanation: 'P = -1, I.F. = $e^{-x}$. $\\frac{d}{dx}[ye^{-x}] = 1$ → $ye^{-x} = x + C$ → $y = (x+C)e^x$.' },
    { id: 'l10', difficulty: 'hard',   question: 'After finding $y \\cdot \\text{I.F.} = \\int Q \\cdot \\text{I.F.}\\,dx + C$, $y$ equals:', options: ['$\\text{I.F.} \\cdot (\\int Q\\cdot\\text{I.F.}\\,dx + C)$', '$(\\int Q\\cdot\\text{I.F.}\\,dx + C) / \\text{I.F.}$', '$\\int Q\\cdot\\text{I.F.}\\,dx$', '$(Q + C)/\\text{I.F.}$'], correct: 1, explanation: 'Divide both sides by I.F.: $y = (\\int Q\\cdot\\text{I.F.}\\,dx + C) / \\text{I.F.}$.' },
  ],

  // ──────────────────────────────────────────────
  // CH 7 — BERNOULLI
  // ──────────────────────────────────────────────
  bernoulli: [
    { id: 'b1',  difficulty: 'easy',   question: "Bernoulli's equation has the form:", options: ['$\\frac{dy}{dx} + P(x)y = Q(x)y^n$', '$\\frac{dy}{dx} + P(x)y^2 = Q(x)$', '$\\frac{d^2y}{dx^2} + Py = Qy^n$', '$\\frac{dy}{dx} + Py = Q/y^n$'], correct: 0, explanation: "Standard Bernoulli form: $\\frac{dy}{dx} + Py = Qy^n$, $n \\neq 0, 1$." },
    { id: 'b3',  difficulty: 'easy',   question: 'For $\\frac{dy}{dx} + y = y^2$, $n$ equals:', options: ['0', '1', '2', '-1'], correct: 2, explanation: 'Comparing with $\\frac{dy}{dx} + Py = Qy^n$: the right side is $y^2$ so $n = 2$.' },
    { id: 'b6',  difficulty: 'easy',   question: 'If $n = 0$ in Bernoulli, the equation is:', options: ['Homogeneous', 'Already linear', 'Separable only', 'Exact'], correct: 1, explanation: '$y^0 = 1$, giving $\\frac{dy}{dx} + Py = Q$ — standard linear DE.' },
    { id: 'b7',  difficulty: 'easy',   question: 'If $n = 1$, Bernoulli DE $\\frac{dy}{dx} + Py = Qy$ is solved by:', options: ['Bernoulli substitution', 'Separating variables', 'Homogeneous method', 'I.F. only'], correct: 1, explanation: '$n=1$: $\\frac{dy}{dx} = (Q-P)y$ → $\\frac{dy}{y} = (Q-P)dx$ — separable.' },
    { id: 'b2',  difficulty: 'medium', question: 'Substitution that linearises a Bernoulli DE is:', options: ['$v = y^n$', '$v = y^{1-n}$', '$v = 1/y$', '$v = \\ln y$'], correct: 1, explanation: '$v = y^{1-n}$ so $\\frac{dv}{dx} = (1-n)y^{-n}\\frac{dy}{dx}$, converting to linear in v.' },
    { id: 'b4',  difficulty: 'medium', question: 'After substituting $v = y^{1-n}$, the DE in v is:', options: ['Separable', 'Homogeneous', 'Linear in v', 'Exact'], correct: 2, explanation: 'Substitution always gives $\\frac{dv}{dx} + (1-n)Pv = (1-n)Q$ — linear in v.' },
    { id: 'b8',  difficulty: 'medium', question: '$\\frac{dy}{dx} + \\frac{y}{x} = x^2 y^3$ has $n = ?$ and substitution $v = ?$', options: ['$n=2$, $v = y^{-1}$', '$n=3$, $v = y^{-2}$', '$n=3$, $v = y^{-3}$', '$n=2$, $v = y^{2}$'], correct: 1, explanation: 'Right side is $x^2 y^3$ → $n = 3$. Substitution: $v = y^{1-3} = y^{-2}$.' },
    { id: 'b5',  difficulty: 'hard',   question: 'For $\\frac{dy}{dx} - y = xy^2$, setting $v = y^{-1}$ gives:', options: ['$\\frac{dv}{dx} + v = -x$', '$\\frac{dv}{dx} - v = -x$', '$\\frac{dv}{dx} + v = x$', '$\\frac{dv}{dx} - v = x$'], correct: 0, explanation: 'Divide by $y^2$, set $v = y^{-1}$, recall $v\' = -y^{-2}y\'$: gives $-v\' - v = -x \\cdot$ ... rearranging yields $v\' + v = -x$.' },
    { id: 'b9',  difficulty: 'hard',   question: 'Dividing Bernoulli DE by $y^n$ gives:', options: ['$y^{-n}\\frac{dy}{dx} + Py^{1-n} = Q$', '$\\frac{dy}{dx} + P = Q$', '$y^{-n}\\frac{dy}{dx} - Py^{1-n} = Q$', '$\\frac{dy}{dx} + Py^n = Q$'], correct: 0, explanation: 'Dividing $\\frac{dy}{dx} + Py = Qy^n$ by $y^n$: $y^{-n}\\frac{dy}{dx} + Py^{1-n} = Q$.' },
    { id: 'b10', difficulty: 'hard',   question: 'After solving for v, the final step is:', options: ['Leave in v', 'Substitute back $v = y^{1-n}$', 'Multiply by n', 'Differentiate v'], correct: 1, explanation: 'Since $v = y^{1-n}$, back-substitution gives the answer in the original variable y.' },
  ],

  // ──────────────────────────────────────────────
  // CH 8 — EXACT
  // ──────────────────────────────────────────────
  'exact-de': [
    { id: 'e1',  difficulty: 'easy',   question: '$M\\,dx + N\\,dy = 0$ is exact if:', options: ['$\\frac{\\partial M}{\\partial x} = \\frac{\\partial N}{\\partial y}$', '$\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$', '$M = N$', '$\\frac{\\partial^2 M}{\\partial x^2} = \\frac{\\partial^2 N}{\\partial y^2}$'], correct: 1, explanation: 'Exactness condition: $\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$.' },
    { id: 'e4',  difficulty: 'easy',   question: 'Is $(2xy)\\,dx + (x^2 - 1)\\,dy = 0$ exact?', options: ['Yes, $\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x} = 2x$', 'No', 'Yes, because $M + N = x^2 + 2xy - 1$', 'Cannot be determined'], correct: 0, explanation: '$\\frac{\\partial M}{\\partial y} = 2x$ and $\\frac{\\partial N}{\\partial x} = 2x$ → equal → exact.' },
    { id: 'e8',  difficulty: 'easy',   question: 'After finding $F(x,y)$, the solution is written as:', options: ['$F(x,y) = 0$', '$F(x,y) = C$', '$dF = 0$', '$F(x,y) + C = 0$'], correct: 1, explanation: 'General solution: $F(x,y) = C$.' },
    { id: 'e3',  difficulty: 'easy',   question: 'When integrating M w.r.t. x, the "constant" is:', options: ['A number', 'A function of y only, $\\phi(y)$', 'A function of x only', 'Zero'], correct: 1, explanation: 'Integration constant can depend on y: it is $\\phi(y)$, determined from $\\frac{\\partial F}{\\partial y} = N$.' },
    { id: 'e2',  difficulty: 'medium', question: 'If $M\\,dx + N\\,dy = 0$ is exact, $F(x,y)$ satisfies:', options: ['$F_x = N$ and $F_y = M$', '$F_x = M$ and $F_y = N$', '$F = \\int M\\,dx = \\int N\\,dy$', '$F_x = F_y$'], correct: 1, explanation: '$dF = M\\,dx + N\\,dy$ means $\\frac{\\partial F}{\\partial x} = M$ and $\\frac{\\partial F}{\\partial y} = N$.' },
    { id: 'e5',  difficulty: 'medium', question: 'Solution of $(2x+y)\\,dx + (x-2y)\\,dy = 0$:', options: ['$x^2+xy-y^2 = C$', '$x^2+xy+y^2 = C$', '$x^2-xy-y^2 = C$', '$2x+xy = C$'], correct: 0, explanation: '$F = x^2+xy+\\phi(y)$. $F_y = x+\\phi\'(y) = x-2y$ → $\\phi\' = -2y$ → $\\phi = -y^2$. So $x^2+xy-y^2 = C$.' },
    { id: 'e7',  difficulty: 'medium', question: 'Is $(y^2 + 2xy)\\,dx + (2xy + x^2)\\,dy = 0$ exact?', options: ['Yes, $M_y = N_x = 2y+2x$', 'No', 'Yes, terms cancel', 'It is separable'], correct: 0, explanation: '$M_y = 2y+2x$, $N_x = 2y+2x$ → equal → exact.' },
    { id: 'e9',  difficulty: 'medium', question: 'Shortcut for solution of exact DE:', options: ['$\\int M\\,dx + \\int(\\text{N terms free of x})\\,dy = C$', '$\\int M\\,dx \\cdot \\int N\\,dy = C$', '$\\int(M+N)\\,dx = C$', '$\\int M/N\\,dx = C$'], correct: 0, explanation: '$F = \\int M\\,dx$ (y constant) + $\\int$(N terms with no x) $dy = C$.' },
    { id: 'e6',  difficulty: 'hard',   question: 'An I.F. $\\mu(x)$ for a non-exact DE exists when:', options: ['$(M_y - N_x)/N$ is a function of x only', '$(M_y - N_x)/M$ is a function of y only', 'Both', 'Neither'], correct: 0, explanation: 'If $(M_y - N_x)/N = f(x)$ only, then I.F. $= e^{\\int f\\,dx}$ makes the equation exact.' },
    { id: 'e10', difficulty: 'hard',   question: "Exactness condition $M_y = N_x$ follows from:", options: ['Mean Value Theorem', "Clairaut's theorem on mixed partials", "Green's theorem", "Euler's theorem"], correct: 1, explanation: "If $F_x = M$ and $F_y = N$, Clairaut's theorem gives $F_{yx} = F_{xy}$ → $M_y = N_x$." },
  ],
}
