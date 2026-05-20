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

export function getDailyQuestions(slug: string, count = 10): QuizQuestion[] {
  const pool = QUIZ_QUESTIONS[slug] ?? []
  if (pool.length === 0) return []
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const easy   = seededShuffle(pool.filter(q => q.difficulty === 'easy'),   seed)
  const medium = seededShuffle(pool.filter(q => q.difficulty === 'medium'), seed + 1)
  const hard   = seededShuffle(pool.filter(q => q.difficulty === 'hard'),   seed + 2)
  return [...easy, ...medium, ...hard].slice(0, Math.min(count, pool.length))
}

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {

  // CH 1 -- FOUNDATIONS
  foundations: [
    { id: 'f1',  difficulty: 'easy',   question: 'What is a differential equation?', options: ['An equation involving only algebraic variables', 'An equation relating a function and one or more of its derivatives', 'An equation with two unknowns', 'An equation involving integration only'], correct: 1, explanation: 'A DE relates an unknown function with its derivatives.' },
    { id: 'f2',  difficulty: 'easy',   question: 'The order of $\\frac{d^2y}{dx^2} + 3\\frac{dy}{dx} = 0$ is:', options: ['0', '1', '2', '3'], correct: 2, explanation: 'Order = highest derivative present. $d^2y/dx^2$ is second order.' },
    { id: 'f3',  difficulty: 'easy',   question: 'A family with 2 arbitrary constants gives a DE of order:', options: ['1', '2', '3', '4'], correct: 1, explanation: 'n constants -> DE of order n. Two constants -> second-order DE.' },
    { id: 'f4',  difficulty: 'easy',   question: 'The degree of $\\frac{dy}{dx} + y = e^x$ is:', options: ['0', '1', '2', 'Undefined'], correct: 1, explanation: 'Highest derivative $y\'$ appears to power 1, so degree 1.' },
    { id: 'f5',  difficulty: 'medium', question: 'The degree of $(d^2y/dx^2)^3 + y = 0$ is:', options: ['1', '2', '3', '6'], correct: 2, explanation: 'Highest derivative $y\'\'$ raised to power 3, so degree 3.' },
    { id: 'f6',  difficulty: 'medium', question: 'Which DE represents $y = A\\cos x + B\\sin x$?', options: ['$y\'\' - y = 0$', '$y\'\' + y = 0$', '$y\' + y = 0$', '$y\'\' - y\' = 0$'], correct: 1, explanation: '$y\'\' = -A\\cos x - B\\sin x = -y$, so $y\'\' + y = 0$.' },
    { id: 'f7',  difficulty: 'medium', question: 'To find degree of $\\sqrt{dy/dx} = 1+x$, we first:', options: ['Differentiate', 'Square both sides', 'Integrate', 'Divide by x'], correct: 1, explanation: 'Clear the radical by squaring: $(y\')^2 = (1+x)^2$. Degree = 2.' },
    { id: 'f8',  difficulty: 'medium', question: 'DE for all straight lines through the origin ($y = mx$) is:', options: ['$y\' = m$', '$xy\' - y = 0$', '$y\' = y/x^2$', '$y\' - x = 0$'], correct: 1, explanation: 'Differentiate $y = mx$: $y\' = m = y/x$, so $xy\' - y = 0$.' },
    { id: 'f9',  difficulty: 'hard',   question: 'Order and degree of $[1 + (dy/dx)^2]^{3/2} = d^2y/dx^2$:', options: ['Order 1, Degree 2', 'Order 2, Degree 1', 'Order 2, Degree 2', 'Order 1, Degree 3'], correct: 2, explanation: 'Squaring: $[1+(y\')^2]^3 = (y\'\')^2$. Order 2, Degree 2.' },
    { id: 'f10', difficulty: 'hard',   question: 'DE formed from $y = Ae^{2x} + Be^{3x}$ is:', options: ['$y\'\' - 5y\' + 6y = 0$', '$y\'\' + 5y\' + 6y = 0$', '$y\'\' - 5y\' - 6y = 0$', '$y\'\' + y = 0$'], correct: 0, explanation: 'Characteristic roots 2 and 3 give $(m-2)(m-3) = m^2 - 5m + 6 = 0$.' },
    { id: 'f11', difficulty: 'hard',   question: 'The DE for parabolas $y^2 = 4ax$ is:', options: ['$y = 2xy\'$', '$yy\' = 2$', '$2y\' = y/x$', '$y = xy\'$'], correct: 0, explanation: 'Differentiate: $2yy\' = 4a = y^2/x$. So $2xy\' = y$, i.e., $y = 2xy\'$.' },
    { id: 'f12', difficulty: 'easy',   question: 'An ODE involves derivatives with respect to:', options: ['Two or more variables', 'One independent variable', 'Partial derivatives only', 'Time only'], correct: 1, explanation: 'ODE = one independent variable. PDE = two or more.' },
  ],

  // CH 2 -- VARIABLES SEPARABLE
  separable: [
    { id: 's1',  difficulty: 'easy',   question: 'Which DE is variable separable?', options: ['$dy/dx = x + y$', '$dy/dx = xy$', '$dy/dx = x^2 + y^2$', '$x\\,dy + y\\,dx = xy\\,dy$'], correct: 1, explanation: '$dy/dx = xy$ separates to $dy/y = x\\,dx$.' },
    { id: 's2',  difficulty: 'easy',   question: 'Solving $dy/dx = y$ gives:', options: ['$y = x + C$', '$y = Ce^x$', '$y = Ce^{-x}$', '$y = e^x + C$'], correct: 1, explanation: '$dy/y = dx$ integrates to $\\ln|y| = x + C_1$, so $y = Ce^x$.' },
    { id: 's3',  difficulty: 'easy',   question: 'General solution of $dy/dx = x/y$ is:', options: ['$y^2 = x^2 + C$', '$y = x + C$', '$y^2 - x^2 = C$', '$y^2 = 2x^2 + C$'], correct: 0, explanation: '$y\\,dy = x\\,dx$ gives $y^2/2 = x^2/2 + C_1$, i.e., $y^2 = x^2 + C$.' },
    { id: 's4',  difficulty: 'easy',   question: 'Particular solution of $dy/dx = 2y$ with $y(0) = 3$:', options: ['$y = 3e^{2x}$', '$y = 2e^{3x}$', '$y = 3e^{-2x}$', '$y = e^x + 2$'], correct: 0, explanation: 'General: $y = Ce^{2x}$. At $x=0$: $C = 3$. So $y = 3e^{2x}$.' },
    { id: 's5',  difficulty: 'medium', question: 'Solving $(1+x)\\,dy = y\\,dx$ gives:', options: ['$y = C(1+x)$', '$y = Ce^x/(1+x)$', '$y = C/(1+x)$', '$y = x/(1+x)$'], correct: 0, explanation: '$dy/y = dx/(1+x)$ gives $\\ln|y| = \\ln|1+x| + C_1$, so $y = C(1+x)$.' },
    { id: 's6',  difficulty: 'medium', question: 'Solution of $dy/dx = e^{x-y}$ is:', options: ['$e^y = e^x + C$', '$e^{-y} = e^x + C$', '$e^y + e^x = C$', '$e^y - e^x = C$'], correct: 0, explanation: '$e^y\\,dy = e^x\\,dx$ gives $e^y = e^x + C$.' },
    { id: 's7',  difficulty: 'medium', question: 'Which substitution reduces $dy/dx = f(ax+by+c)$?', options: ['$v = y/x$', '$v = ax+by+c$', '$v = x+y$', '$v = x/y$'], correct: 1, explanation: 'Setting $v = ax+by+c$ gives $dv/dx = a + bf(v)$, which is separable.' },
    { id: 's8',  difficulty: 'medium', question: 'For $dy/dx = (1+y^2)/(1+x^2)$, after separating:', options: ['$dy/(1+y^2) = dx/(1+x^2)$', '$dy(1+y^2) = dx(1+x^2)$', '$(1+y^2)\\,dy = dx$', '$dy = (1+x^2)\\,dx/(1+y^2)$'], correct: 0, explanation: 'Rearranging directly: $dy/(1+y^2) = dx/(1+x^2)$. Both integrate to arctan.' },
    { id: 's9',  difficulty: 'hard',   question: 'Solution of $\\sec^2 x\\tan y\\,dx + \\sec^2 y\\tan x\\,dy = 0$:', options: ['$\\tan x \\cdot \\tan y = C$', '$\\tan x + \\tan y = C$', '$\\sec x \\cdot \\sec y = C$', '$\\sin x + \\sin y = C$'], correct: 0, explanation: 'Divide by $\\tan x\\tan y$, integrate: $\\ln|\\tan x| + \\ln|\\tan y| = \\ln C$.' },
    { id: 's10', difficulty: 'hard',   question: 'Particular solution of $dy/dx = -2xy^2$, $y(0) = 2$:', options: ['$y = 2/(2x^2+1)$', '$y = 1/(x^2+1)$', '$y = 2e^{-x^2}$', '$y = 1/(2x^2-1)$'], correct: 0, explanation: '$-y^{-2}\\,dy = 2x\\,dx$ gives $1/y = x^2 + C$. At $y(0)=2$: $C=1/2$, so $y = 2/(2x^2+1)$.' },
  ],

  // CH 3 -- HOMOGENEOUS
  homogeneous: [
    { id: 'h1',  difficulty: 'easy',   question: 'The substitution for a homogeneous DE is:', options: ['$y = vx^2$', '$y = vx$', '$x = vy$', '$y = v + x$'], correct: 1, explanation: '$y = vx$ gives $dy/dx = v + x(dv/dx)$, converting to separable form.' },
    { id: 'h2',  difficulty: 'easy',   question: 'General solution of $dy/dx = y/x$ is:', options: ['$y = Cx^2$', '$y = x + C$', '$y = Cx$', '$\\ln y = x + C$'], correct: 2, explanation: '$dy/y = dx/x$ integrates to $y = Cx$.' },
    { id: 'h3',  difficulty: 'easy',   question: 'A function $f(x,y)$ is homogeneous of degree n if:', options: ['$f(x,y) = n \\cdot f(x,y)$', '$f(tx,ty) = t^n f(x,y)$', '$f(x+t,y+t) = t^n f(x,y)$', '$f(x,y) = x^n + y^n$'], correct: 1, explanation: 'Definition: $f(tx,ty) = t^n f(x,y)$ for all t.' },
    { id: 'h4',  difficulty: 'medium', question: '$(x^2 + y^2)\\,dx - 2xy\\,dy = 0$ is:', options: ['Linear', 'Exact', 'Homogeneous of degree 2', 'Bernoulli'], correct: 2, explanation: 'Each term is degree 2 in $x, y$. Homogeneous.' },
    { id: 'h5',  difficulty: 'medium', question: 'Solution of $x(dy/dx) = y + x$ is:', options: ['$y = x\\ln x + Cx$', '$y = x\\ln x + C$', '$y = Cx - x$', '$y = Cx$'], correct: 0, explanation: 'Put $y = vx$: $x(dv/dx) = 1$ gives $v = \\ln x + C$, so $y = x(\\ln x + C)$.' },
    { id: 'h6',  difficulty: 'medium', question: 'After solving in $v$ and $x$, the final step is:', options: ['Leave in v', 'Substitute back $v = y/x$', 'Differentiate once more', 'Multiply by x'], correct: 1, explanation: 'Since $v = y/x$, substitute back to get the answer in $x$ and $y$.' },
    { id: 'h7',  difficulty: 'hard',   question: 'After $y = vx$ in $dy/dx = (x+y)/(x-y)$, $x(dv/dx)$ equals:', options: ['$(1+v^2)/(1-v)$', '$v + 1$', '$1/(1-v)$', '$(1+v)/(1-v) - v$'], correct: 0, explanation: '$x(dv/dx) = (1+v)/(1-v) - v = (1+v^2)/(1-v)$.' },
    { id: 'h8',  difficulty: 'hard',   question: 'For $dy/dx = (ax+by+c)/(dx+ey+f)$ with $a/d = b/e$, the substitution is:', options: ['$y = vx$', 'Shift $x = X+h, y = Y+k$', '$v = ax + by$', '$v = x + y$'], correct: 2, explanation: 'When $a/d = b/e$ (parallel lines), shifting fails. Use $v = ax + by$.' },
    { id: 'h9',  difficulty: 'hard',   question: '$dy/dx = (x^3 + y^3)/(xy^2)$ is:', options: ['Separable', 'Linear', 'Homogeneous of degree 0', 'Exact'], correct: 2, explanation: 'Numerator degree 3, denominator degree 3, so $dy/dx$ is degree 0. Homogeneous.' },
  ],

  // CH 4 -- REDUCIBLE TO HOMOGENEOUS
  'reducible-homogeneous': [
    { id: 'rh1', difficulty: 'easy',   question: 'For $dy/dx = (ax+by+c)/(Ax+By+C)$, Case I applies when:', options: ['$a/A = b/B$', '$a/A \\neq b/B$', '$c = C$', '$a = A$'], correct: 1, explanation: 'Case I: $a/A \\neq b/B$, meaning the lines are not parallel. We can find a finite $(h,k)$.' },
    { id: 'rh2', difficulty: 'easy',   question: 'In Case I, the substitution is:', options: ['$z = ax + by$', '$x = X+h, y = Y+k$', '$y = vx$', '$v = x+y$'], correct: 1, explanation: 'Shift origin to the intersection point: $x = X+h, y = Y+k$ where $h,k$ satisfy both constant equations.' },
    { id: 'rh3', difficulty: 'medium', question: 'Case II (failure case) occurs when:', options: ['The two lines intersect', 'The two lines are parallel ($a/A = b/B$)', 'c = 0 and C = 0', 'a = 0'], correct: 1, explanation: 'Parallel lines never intersect, so no finite $(h,k)$ exists.' },
    { id: 'rh4', difficulty: 'medium', question: 'In Case II, the substitution is:', options: ['$x = X+h, y = Y+k$', '$y = vx$', '$z = ax + by$', '$z = x/y$'], correct: 2, explanation: 'When $a/A = b/B$, put $z = ax + by$ to get a separable equation.' },
    { id: 'rh5', difficulty: 'medium', question: 'For $dy/dx = (x+2y-3)/(2x+y-3)$, $h$ and $k$ are:', options: ['$h=1, k=1$', '$h=0, k=0$', '$h=3, k=0$', '$h=-1, k=2$'], correct: 0, explanation: 'Solve $h+2k-3=0$ and $2h+k-3=0$ simultaneously: $h=1, k=1$.' },
    { id: 'rh6', difficulty: 'hard',   question: 'After shifting to $(X,Y)$ in Case I, the resulting equation is:', options: ['Separable', 'Homogeneous', 'Linear', 'Exact'], correct: 1, explanation: 'The shift removes constants, leaving $dY/dX = (aX+bY)/(AX+BY)$, which is homogeneous.' },
    { id: 'rh7', difficulty: 'hard',   question: 'For $(x+2y)(dx-dy) = dx+dy$, we get $dy/dx = (x+2y-1)/(x+2y+1)$. The right substitution is:', options: ['$z = x+2y$', '$x = X+h$', '$y = vx$', '$z = x-y$'], correct: 0, explanation: 'Here $a/A = 1/1 = b/B = 2/2$, so Case II. Put $z = x+2y$.' },
  ],

  // CH 5 -- LINEAR FIRST ORDER
  'linear-first-order': [
    { id: 'lf1', difficulty: 'easy',   question: 'Standard form of a first-order linear DE is:', options: ['$dy/dx + P(x)y = Q(x)$', '$dy/dx = P(x) + Q(x)y$', '$P(x)y^2 + Q(x)y = R(x)$', '$d^2y/dx^2 + Py = Q$'], correct: 0, explanation: 'Standard form: $dy/dx + P(x)y = Q(x)$, with P and Q functions of x only.' },
    { id: 'lf2', difficulty: 'easy',   question: 'The integrating factor is:', options: ['$e^{\\int P\\,dx}$', '$e^{\\int Q\\,dx}$', '$\\int P\\,dx$', '$P(x)$'], correct: 0, explanation: 'I.F. $= e^{\\int P\\,dx}$.' },
    { id: 'lf3', difficulty: 'easy',   question: 'The I.F. for $dy/dx + y/x = x^2$ is:', options: ['$x$', '$e^x$', '$\\ln x$', '$1/x$'], correct: 0, explanation: '$P = 1/x$. I.F. $= e^{\\int dx/x} = x$.' },
    { id: 'lf4', difficulty: 'easy',   question: 'A first-order linear DE has how many arbitrary constants?', options: ['0', '1', '2', 'Depends on P(x)'], correct: 1, explanation: 'Order 1 gives exactly 1 arbitrary constant.' },
    { id: 'lf5', difficulty: 'medium', question: 'After multiplying by I.F., the left side becomes:', options: ['$d/dx[y \\cdot \\text{I.F.}]$', '$d/dx[\\text{I.F.}]$', '$y \\cdot \\text{I.F.}$', '$\\text{I.F.} \\cdot dy/dx$'], correct: 0, explanation: 'Left side collapses to $d/dx[y \\cdot \\text{I.F.}]$, which integrates directly.' },
    { id: 'lf6', difficulty: 'medium', question: 'For $x(dy/dx) + 2y = x^3$ in standard form, $P(x)$ is:', options: ['2', '$2/x$', '$x$', '$x^2$'], correct: 1, explanation: 'Divide by x: $dy/dx + (2/x)y = x^2$. So $P = 2/x$.' },
    { id: 'lf7', difficulty: 'medium', question: '$dy/dx + y\\tan x = \\sec x$ has I.F.:', options: ['$\\sec x$', '$\\cos x$', '$\\sin x$', '$\\tan x$'], correct: 0, explanation: '$P = \\tan x$. I.F. $= e^{\\int \\tan x\\,dx} = \\sec x$.' },
    { id: 'lf8', difficulty: 'medium', question: 'Which is NOT a first-order linear DE?', options: ['$dy/dx + 2y = \\sin x$', '$dy/dx = y\\tan x + \\sec x$', '$dy/dx + y^2 = x$', '$x(dy/dx) - y = x^2$'], correct: 2, explanation: '$dy/dx + y^2 = x$ has $y^2$, making it non-linear.' },
    { id: 'lf9', difficulty: 'hard',   question: 'Solving $dy/dx - y = e^x$ gives:', options: ['$y = (x+C)e^x$', '$y = xe^x + Ce^x$', '$y = Ce^{-x} + e^x$', '$y = xe^x + C$'], correct: 0, explanation: 'I.F. $= e^{-x}$. Then $d/dx[ye^{-x}] = 1$ gives $ye^{-x} = x + C$, so $y = (x+C)e^x$.' },
    { id: 'lf10', difficulty: 'hard',  question: 'For $(1+y^2)dx = (\\tan^{-1}y - x)dy$, the I.F. is:', options: ['$e^{\\tan^{-1}y}$', '$1/(1+y^2)$', '$e^y$', '$\\tan^{-1}y$'], correct: 0, explanation: 'Rewrite as $dx/dy + x/(1+y^2) = \\tan^{-1}y/(1+y^2)$. I.F. $= e^{\\int dy/(1+y^2)} = e^{\\tan^{-1}y}$.' },
  ],

  // CH 6 -- BERNOULLI
  bernoulli: [
    { id: 'b1',  difficulty: 'easy',   question: "Bernoulli's equation has the form:", options: ['$dy/dx + Py = Qy^n$', '$dy/dx + Py^2 = Q$', '$d^2y/dx^2 + Py = Qy^n$', '$dy/dx + Py = Q/y^n$'], correct: 0, explanation: "Standard Bernoulli: $dy/dx + Py = Qy^n$, $n \\neq 0, 1$." },
    { id: 'b2',  difficulty: 'easy',   question: 'For $dy/dx + y = y^2$, $n$ equals:', options: ['0', '1', '2', '-1'], correct: 2, explanation: 'Right side has $y^2$, so $n = 2$.' },
    { id: 'b3',  difficulty: 'easy',   question: 'If $n = 0$ in Bernoulli, the equation is:', options: ['Homogeneous', 'Already linear', 'Separable only', 'Exact'], correct: 1, explanation: '$y^0 = 1$: $dy/dx + Py = Q$, which is standard linear.' },
    { id: 'b4',  difficulty: 'medium', question: 'Substitution that linearises Bernoulli is:', options: ['$v = y^n$', '$v = y^{1-n}$', '$v = 1/y$', '$v = \\ln y$'], correct: 1, explanation: '$v = y^{1-n}$ converts to a linear equation in $v$.' },
    { id: 'b5',  difficulty: 'medium', question: 'After substituting $v = y^{1-n}$, the DE in $v$ is:', options: ['Separable', 'Homogeneous', 'Linear in v', 'Exact'], correct: 2, explanation: 'Always gives $dv/dx + (1-n)Pv = (1-n)Q$, which is linear.' },
    { id: 'b6',  difficulty: 'medium', question: '$dy/dx + y/x = x^2 y^3$ has $n = ?$ and $v = ?$:', options: ['$n=2, v = y^{-1}$', '$n=3, v = y^{-2}$', '$n=3, v = y^{-3}$', '$n=2, v = y^2$'], correct: 1, explanation: 'Right side is $x^2 y^3$, so $n = 3$. Substitution: $v = y^{1-3} = y^{-2}$.' },
    { id: 'b7',  difficulty: 'hard',   question: 'For $dy/dx - y = xy^2$, setting $v = y^{-1}$ gives:', options: ['$dv/dx + v = -x$', '$dv/dx - v = -x$', '$dv/dx + v = x$', '$dv/dx - v = x$'], correct: 0, explanation: 'Divide by $y^2$, set $v = 1/y$: $-dv/dx - v = -x$, i.e., $dv/dx + v = x$... wait, rearranging carefully gives $dv/dx + v = -x$.' },
    { id: 'b8',  difficulty: 'hard',   question: 'After solving for $v$, the final step is:', options: ['Leave in v', 'Substitute $v = y^{1-n}$ back', 'Multiply by n', 'Differentiate v'], correct: 1, explanation: 'Recover the original variable $y$ from $v = y^{1-n}$.' },
  ],

  // CH 7 -- EXACT
  exact: [
    { id: 'e1',  difficulty: 'easy',   question: '$M\\,dx + N\\,dy = 0$ is exact if:', options: ['$\\partial M/\\partial x = \\partial N/\\partial y$', '$\\partial M/\\partial y = \\partial N/\\partial x$', '$M = N$', '$\\partial^2 M/\\partial x^2 = \\partial^2 N/\\partial y^2$'], correct: 1, explanation: 'Exactness condition: $\\partial M/\\partial y = \\partial N/\\partial x$.' },
    { id: 'e2',  difficulty: 'easy',   question: 'Is $(2xy)dx + (x^2 - 1)dy = 0$ exact?', options: ['Yes, $M_y = N_x = 2x$', 'No', 'Cannot determine', 'Only if $x > 0$'], correct: 0, explanation: '$M_y = 2x$ and $N_x = 2x$. Equal, so exact.' },
    { id: 'e3',  difficulty: 'easy',   question: 'When integrating M w.r.t. x, the constant of integration is:', options: ['A number', 'A function of y only', 'A function of x only', 'Zero'], correct: 1, explanation: 'The "constant" can depend on y, written as $\\phi(y)$.' },
    { id: 'e4',  difficulty: 'medium', question: 'If $F_x = M$ and $F_y = N$, the exactness follows from:', options: ['Mean Value Theorem', "Clairaut's theorem on mixed partials", "Green's theorem", "Euler's theorem"], correct: 1, explanation: "Clairaut: $F_{xy} = F_{yx}$ means $M_y = N_x$." },
    { id: 'e5',  difficulty: 'medium', question: 'Solution of $(2x+y)dx + (x-2y)dy = 0$:', options: ['$x^2+xy-y^2 = C$', '$x^2+xy+y^2 = C$', '$x^2-xy-y^2 = C$', '$2x+xy = C$'], correct: 0, explanation: '$F = x^2+xy+\\phi(y)$. $F_y = x+\\phi\'(y) = x-2y$, so $\\phi = -y^2$. Answer: $x^2+xy-y^2 = C$.' },
    { id: 'e6',  difficulty: 'medium', question: 'Shortcut for exact DE solution:', options: ['$\\int M\\,dx + \\int(\\text{N terms free of x})\\,dy = C$', '$\\int M\\,dx \\cdot \\int N\\,dy = C$', '$\\int(M+N)\\,dx = C$', '$\\int M/N\\,dx = C$'], correct: 0, explanation: '$F = \\int M\\,dx$ (y const) + $\\int$(N terms without x) $dy = C$.' },
    { id: 'e7',  difficulty: 'hard',   question: 'An I.F. $\\mu(x)$ exists when:', options: ['$(M_y - N_x)/N$ depends only on $x$', '$(M_y - N_x)/M$ depends only on $y$', 'Both conditions work (for different I.F.s)', 'Neither'], correct: 2, explanation: 'Rule 1: $(M_y-N_x)/N = f(x)$ gives I.F. $e^{\\int f\\,dx}$. Rule 2: $(N_x-M_y)/M = g(y)$ gives I.F. $e^{\\int g\\,dy}$.' },
    { id: 'e8',  difficulty: 'hard',   question: 'For a homogeneous non-exact DE with $Mx+Ny \\neq 0$, the I.F. is:', options: ['$1/(Mx+Ny)$', '$Mx+Ny$', '$1/(M-N)$', '$e^{\\int M\\,dx}$'], correct: 0, explanation: 'Rule 5: If homogeneous and $Mx+Ny \\neq 0$, I.F. $= 1/(Mx+Ny)$.' },
  ],

  // CH 8 -- SECOND ORDER
  'second-order': [
    { id: 'so1', difficulty: 'easy',   question: 'The complete solution of a 2nd-order linear DE is:', options: ['C.F. only', 'P.I. only', 'C.F. + P.I.', 'C.F. * P.I.'], correct: 2, explanation: 'Complete solution = Complementary Function + Particular Integral.' },
    { id: 'so2', difficulty: 'easy',   question: 'The A.E. of $y\'\' - 5y\' + 6y = 0$ is:', options: ['$m^2 - 5m + 6 = 0$', '$m^2 + 5m + 6 = 0$', '$m^2 - 5m - 6 = 0$', '$m - 6 = 0$'], correct: 0, explanation: 'Replace $y$ by $e^{mx}$: $m^2 - 5m + 6 = 0$.' },
    { id: 'so3', difficulty: 'easy',   question: 'If A.E. has roots $m = 3, 5$, the C.F. is:', options: ['$(C_1+C_2x)e^{3x}$', '$C_1e^{3x} + C_2e^{5x}$', '$C_1\\cos 3x + C_2\\sin 5x$', '$C_1e^{8x}$'], correct: 1, explanation: 'Distinct real roots: C.F. $= C_1e^{m_1x} + C_2e^{m_2x}$.' },
    { id: 'so4', difficulty: 'medium', question: 'If A.E. has repeated root $m = 3, 3$, the C.F. is:', options: ['$C_1e^{3x} + C_2e^{3x}$', '$(C_1+C_2x)e^{3x}$', '$C_1e^{3x} + C_2xe^{6x}$', '$C_1\\cos 3x$'], correct: 1, explanation: 'Repeated roots: C.F. $= (C_1+C_2x)e^{mx}$.' },
    { id: 'so5', difficulty: 'medium', question: 'If A.E. has roots $2 \\pm 3i$, the C.F. is:', options: ['$e^{2x}(C_1\\cos 3x + C_2\\sin 3x)$', '$C_1e^{2x}\\cos 3x$', '$e^{3x}(C_1\\cos 2x + C_2\\sin 2x)$', '$C_1e^{(2+3i)x}$'], correct: 0, explanation: 'Complex roots $\\alpha \\pm i\\beta$: C.F. $= e^{\\alpha x}(C_1\\cos\\beta x + C_2\\sin\\beta x)$.' },
    { id: 'so6', difficulty: 'medium', question: 'P.I. of $1/f(D) \\cdot e^{ax}$ equals:', options: ['$e^{ax}/f(a)$ (if $f(a) \\neq 0$)', '$ae^{ax}/f(a)$', '$e^{ax} \\cdot f(a)$', '$xe^{ax}/f(a)$'], correct: 0, explanation: 'Replace $D$ by $a$: P.I. $= e^{ax}/f(a)$, provided $f(a) \\neq 0$.' },
    { id: 'so7', difficulty: 'hard',   question: 'If $f(a) = 0$ for P.I. of $e^{ax}$, we:', options: ['Give up', 'Multiply by $x$ and use $1/f\'(a)$', 'Use variation of parameters', 'Set P.I. = 0'], correct: 1, explanation: 'Failure case: multiply by $x$, use $f\'(a)$. If that is also 0, multiply by $x^2$.' },
    { id: 'so8', difficulty: 'hard',   question: 'P.I. of $\\sin ax$ via $1/f(D^2)$: replace $D^2$ by:', options: ['$a^2$', '$-a^2$', '$a$', '$-a$'], correct: 1, explanation: 'Since $D^2(\\sin ax) = -a^2\\sin ax$, replace $D^2$ by $-a^2$.' },
    { id: 'so9', difficulty: 'hard',   question: 'The exponential shift rule states $1/f(D) \\cdot e^{ax}\\phi(x) =$:', options: ['$e^{ax}/f(D+a) \\cdot \\phi(x)$', '$e^{ax}\\phi(x)/f(a)$', '$e^{ax} \\cdot 1/f(D-a) \\cdot \\phi(x)$', '$\\phi(x)/f(D) \\cdot e^{ax}$'], correct: 0, explanation: 'Exponential shift: $1/f(D) \\cdot e^{ax}\\phi(x) = e^{ax} \\cdot 1/f(D+a) \\cdot \\phi(x)$.' },
  ],

  // CH 9 -- CAUCHY-EULER
  'cauchy-euler': [
    { id: 'ce1', difficulty: 'easy',   question: 'A Cauchy-Euler equation has the form:', options: ['$ay\'\' + by\' + cy = f(x)$', '$x^2y\'\' + axy\' + by = f(x)$', '$e^xy\'\' + y = 0$', '$y\'\' + xy = 0$'], correct: 1, explanation: 'Cauchy-Euler: coefficients are powers of $x$.' },
    { id: 'ce2', difficulty: 'easy',   question: 'The substitution for Cauchy-Euler is:', options: ['$y = vx$', '$x = e^z$', '$y = e^z$', '$z = y/x$'], correct: 1, explanation: 'Put $x = e^z$ (so $z = \\ln x$) to get constant coefficients.' },
    { id: 'ce3', difficulty: 'medium', question: 'Under $x = e^z$, $xy\'$ becomes:', options: ['$Dy$', '$D(D-1)y$', '$D^2y$', '$y/D$'], correct: 0, explanation: '$xy\' = Dy$ where $D = d/dz$.' },
    { id: 'ce4', difficulty: 'medium', question: 'Under $x = e^z$, $x^2y\'\'$ becomes:', options: ['$D^2y$', '$D(D-1)y$', '$D(D+1)y$', '$(D-1)^2y$'], correct: 1, explanation: '$x^2y\'\' = D(D-1)y$.' },
    { id: 'ce5', difficulty: 'medium', question: 'After substitution, $x^2y\'\' + xy\' + y = 0$ becomes:', options: ['$D^2y + y = 0$', '$(D^2+1)y = 0$', '$D(D-1)y + Dy + y = 0$', 'Both B and C'], correct: 3, explanation: '$D(D-1)y + Dy + y = (D^2 - D + D + 1)y = (D^2+1)y = 0$.' },
    { id: 'ce6', difficulty: 'hard',   question: 'After solving in $z$, to get the answer in $x$ we replace:', options: ['$z = e^x$', '$z = \\ln x$', '$z = x^2$', '$z = 1/x$'], correct: 1, explanation: 'Since $x = e^z$, we have $z = \\ln x$. Replace every $z$ by $\\ln x$.' },
    { id: 'ce7', difficulty: 'hard',   question: '$x^2y\'\' - 2xy\' - 4y = x^4$: after substitution, the A.E. roots are:', options: ['$4, -1$', '$2, -2$', '$4, 1$', '$-4, 1$'], correct: 0, explanation: 'Becomes $(D^2-3D-4)y = e^{4z}$. A.E.: $(m-4)(m+1) = 0$, roots $4, -1$.' },
  ],

  // CH 10 -- VARIATION OF PARAMETERS
  'variation-parameters': [
    { id: 'vp1', difficulty: 'easy',   question: 'Variation of parameters finds the:', options: ['C.F.', 'P.I.', 'A.E.', 'I.F.'], correct: 1, explanation: 'It is a method for finding the Particular Integral.' },
    { id: 'vp2', difficulty: 'easy',   question: 'The Wronskian $W = y_1y_2\' - y_1\'y_2$ must be:', options: ['Zero', 'Non-zero', 'Positive', 'Negative'], correct: 1, explanation: 'If $W = 0$, the solutions are linearly dependent and the method fails.' },
    { id: 'vp3', difficulty: 'medium', question: 'For $y\'\' + y = R(x)$ with $y_1 = \\cos x, y_2 = \\sin x$, $W$ equals:', options: ['0', '1', '-1', '$\\cos 2x$'], correct: 1, explanation: '$W = \\cos x \\cdot \\cos x - (-\\sin x)\\sin x = \\cos^2x + \\sin^2x = 1$.' },
    { id: 'vp4', difficulty: 'medium', question: 'In the formula $u = \\int -y_2 R/W\\,dx$, $R$ is:', options: ['The C.F.', 'The right-hand side of the DE', 'The A.E.', 'The I.F.'], correct: 1, explanation: '$R(x)$ is the non-homogeneous term (right-hand side).' },
    { id: 'vp5', difficulty: 'medium', question: 'Variation of parameters works for:', options: ['Only constant-coefficient DEs', 'Only $e^{ax}$ type RHS', 'ANY second-order linear DE', 'Only homogeneous DEs'], correct: 2, explanation: 'It works for any $y\'\' + Py\' + Qy = R$, regardless of the form of $R$.' },
    { id: 'vp6', difficulty: 'hard',   question: 'For $y\'\' + y = \\tan x$, P.I. by variation of parameters is:', options: ['$-\\cos x\\ln|\\sec x + \\tan x|$', '$\\sin x\\ln|\\sin x|$', '$x\\sin x$', '$-x\\cos x$'], correct: 0, explanation: 'Computing $u$ and $v$ and simplifying gives $-\\cos x\\ln|\\sec x + \\tan x|$.' },
    { id: 'vp7', difficulty: 'hard',   question: 'Which RHS is best handled by variation of parameters?', options: ['$e^{2x}$', '$\\sin 3x$', '$x^2$', '$\\sec x$'], correct: 3, explanation: '$\\sec x$ cannot be handled by standard operator methods. Variation of parameters is ideal.' },
  ],

  // CH 11 -- SIMULTANEOUS DEs
  simultaneous: [
    { id: 'sim1', difficulty: 'easy',   question: 'Simultaneous DEs involve:', options: ['One dependent variable', 'Two or more dependent variables with one independent variable', 'Only algebraic equations', 'Partial derivatives'], correct: 1, explanation: 'e.g., $dx/dt = f(x,y,t)$ and $dy/dt = g(x,y,t)$ -- two dependent variables ($x, y$), one independent ($t$).' },
    { id: 'sim2', difficulty: 'easy',   question: 'The main solving technique is:', options: ['Separation of variables', 'Elimination of one dependent variable', 'Integration by parts', 'Substitution $y = vx$'], correct: 1, explanation: 'Eliminate one variable to get a single ODE, solve it, then back-substitute.' },
    { id: 'sim3', difficulty: 'medium', question: 'For $Dx + y = 1$ and $-x + Dy = 1$, eliminating $y$ gives:', options: ['$(D^2-1)x = 1$', '$(D^2+1)x = 2$', '$(D-1)x = 0$', '$(D^2-1)x = 2$'], correct: 0, explanation: 'Differentiate eq.1: $D^2x - Dy = 0$. Add to eq.2: $(D^2-1)x = 1$.' },
    { id: 'sim4', difficulty: 'medium', question: 'After finding $x(t)$, we find $y(t)$ by:', options: ['Solving a new equation for y from scratch', 'Substituting x back into an original equation', 'Differentiating x', 'Setting y = x'], correct: 1, explanation: 'Substitute the known $x(t)$ into one of the original equations to find $y(t)$.' },
    { id: 'sim5', difficulty: 'hard',   question: 'For $dx/dt + \\omega y = 0$, $dy/dt - \\omega x = 0$, the path is:', options: ['A straight line', 'A parabola', 'A circle', 'An ellipse'], correct: 2, explanation: 'Eliminating gives $x^2 + y^2 = A^2 + B^2 =$ constant, which is a circle.' },
    { id: 'sim6', difficulty: 'hard',   question: 'To solve $dx/dt = 2y$, $dy/dt = 2z$, $dz/dt = 2x$, we differentiate to get:', options: ['A third-order ODE in $x$', 'A second-order ODE in $x$', 'A first-order ODE in $x$', 'An algebraic equation'], correct: 0, explanation: '$x\' = 2y$, $x\'\' = 2y\' = 4z$, $x\'\'\' = 4z\' = 8x$. So $(D^3 - 8)x = 0$.' },
  ],

  // CH 12 -- APPLICATIONS
  applications: [
    { id: 'ap1', difficulty: 'easy',   question: 'The DE for exponential growth/decay is:', options: ['$dy/dt = ky$', '$dy/dt = k/y$', '$d^2y/dt^2 = ky$', '$dy/dt = k$'], correct: 0, explanation: '$dy/dt = ky$: growth if $k > 0$, decay if $k < 0$.' },
    { id: 'ap2', difficulty: 'easy',   question: "Newton's law of cooling states:", options: ['$dT/dt = k(T - T_s)$', '$dT/dt = kT^2$', '$dT/dt = k$', '$T = T_0 e^{kt}$'], correct: 0, explanation: 'Rate of cooling is proportional to temperature difference from surroundings.' },
    { id: 'ap3', difficulty: 'easy',   question: 'In an L-R circuit, the DE is:', options: ['$L(di/dt) + Ri = E$', '$L(di/dt) - Ri = E$', '$R(di/dt) + Li = E$', '$di/dt = E$'], correct: 0, explanation: 'Kirchhoff: $L(di/dt) + Ri = E$.' },
    { id: 'ap4', difficulty: 'medium', question: 'If population doubles in 50 years, it triples in:', options: ['75 years', '$50\\ln 3/\\ln 2$ years', '100 years', '$50 \\cdot 3/2$ years'], correct: 1, explanation: '$k = \\ln 2/50$. Tripling time $= \\ln 3/k = 50\\ln 3/\\ln 2 \\approx 79.25$ years.' },
    { id: 'ap5', difficulty: 'medium', question: 'For orthogonal trajectories, replace $dy/dx$ by:', options: ['$dx/dy$', '$-dx/dy$', '$-dy/dx$', '$1/(dy/dx)$'], correct: 1, explanation: 'Since $m_1 \\cdot m_2 = -1$ for perpendicular curves, replace $dy/dx$ by $-dx/dy$.' },
    { id: 'ap6', difficulty: 'medium', question: 'OT of $xy = c$ (rectangular hyperbolas) is:', options: ['$x^2 + y^2 = C$', '$x^2 - y^2 = C$', '$y = Cx$', '$y = C/x$'], correct: 1, explanation: 'DE: $dy/dx = -y/x$. Replace: $dy/dx = x/y$. Solve: $y^2 - x^2 = C$.' },
    { id: 'ap7', difficulty: 'hard',   question: 'Steady-state current in L-R circuit with DC voltage $E$ is:', options: ['$E/L$', '$E/R$', '$E/(R+L)$', '0'], correct: 1, explanation: 'As $t \\to \\infty$, $e^{-Rt/L} \\to 0$, so $i \\to E/R$.' },
    { id: 'ap8', difficulty: 'hard',   question: 'A body falls with air resistance $kv$. Terminal velocity is:', options: ['$g/k$', '$k/g$', '$\\sqrt{g/k}$', '$g \\cdot k$'], correct: 0, explanation: '$dv/dt = g - kv$. At terminal velocity $dv/dt = 0$: $v = g/k$.' },
  ],
}
