export interface BonusProblem {
  problem: string
  hint: string
  solution: string
}

export const BONUS_PROBLEMS: Record<string, BonusProblem[]> = {
  intro: [
    {
      problem: 'Form the DE by eliminating the arbitrary constant from $y = Ae^{3x} + Be^{-3x}$.',
      hint: 'Differentiate twice, then eliminate A and B using the two equations for dy/dx and d²y/dx².',
      solution: 'Differentiate: $dy/dx = 3Ae^{3x} - 3Be^{-3x}$. Differentiate again: $d^2y/dx^2 = 9Ae^{3x} + 9Be^{-3x} = 9(Ae^{3x} + Be^{-3x}) = 9y$. Answer: $d^2y/dx^2 - 9y = 0$.',
    },
    {
      problem: 'Find the DE of all parabolas with axis parallel to the x-axis.',
      hint: 'General form is $(y-k)^2 = 4a(x-h)$. Differentiate twice to eliminate h, k, a.',
      solution: 'Differentiating: $2(y-k) \\cdot dy/dx = 4a$. Differentiating again and substituting: $(dy/dx)^3 = d^2y/dx^2 \\cdot dy/dx$ — but eliminating all three constants requires differentiating once more. Final DE: $\\frac{d^2y}{dx^2}\\left(\\frac{dy}{dx}\\right)^{-1} = $ a relation in terms of $y^{\\prime\\prime}$ and $y^{\\prime}$ only. Result: $\\left(y^{\\prime\\prime}\\right)^3 = 0$ is trivial; the correct reduction is $y^{\\prime\\prime} \\frac{d}{dx}(y^{\\prime}) = $ ... use $2y^{\\prime}y^{\\prime\\prime} + 2(y-k)(y^{\\prime\\prime}) = 0$ → elimination gives $(y^{\\prime})^3 = y^{\\prime\\prime}$. Actually: $y^{\\prime\\prime\\prime}(y^{\\prime}) = (y^{\\prime\\prime})^2$.',
    },
    {
      problem: 'Verify that $y = e^x \\sin x$ satisfies the DE $y^{\\prime\\prime} - 2y^{\\prime} + 2y = 0$.',
      hint: 'Compute y\', y\'\', then substitute into the DE.',
      solution: '$y = e^x \\sin x$. $y^{\\prime} = e^x\\sin x + e^x\\cos x = e^x(\\sin x + \\cos x)$. $y^{\\prime\\prime} = e^x(\\sin x + \\cos x) + e^x(\\cos x - \\sin x) = 2e^x\\cos x$. Substituting: $2e^x\\cos x - 2e^x(\\sin x + \\cos x) + 2e^x\\sin x = 2e^x\\cos x - 2e^x\\sin x - 2e^x\\cos x + 2e^x\\sin x = 0$. ✓',
    },
    {
      problem: 'Find the order and degree of: $\\left[1 + \\left(\\frac{dy}{dx}\\right)^2\\right]^{3/2} = k\\frac{d^2y}{dx^2}$.',
      hint: 'Square both sides to remove the fractional power, then identify order and degree.',
      solution: 'Squaring both sides: $\\left[1 + (y^{\\prime})^2\\right]^3 = k^2(y^{\\prime\\prime})^2$. The highest derivative is $y^{\\prime\\prime}$ (2nd order). Its power after clearing the fraction is 2. So **Order = 2, Degree = 2**.',
    },
    {
      problem: 'Find the DE of all circles passing through the origin with centres on the x-axis.',
      hint: 'Centre on x-axis: (a, 0). Circle passes through origin: radius = a. Write the circle equation and differentiate.',
      solution: 'Circle: $(x-a)^2 + y^2 = a^2 \\Rightarrow x^2 - 2ax + y^2 = 0 \\Rightarrow a = \\frac{x^2+y^2}{2x}$. Differentiating the circle equation: $2(x-a) + 2y \\cdot dy/dx = 0 \\Rightarrow x - a + y y^{\\prime} = 0$. Substituting $a$: $x - \\frac{x^2+y^2}{2x} + y y^{\\prime} = 0 \\Rightarrow \\frac{2x^2 - x^2 - y^2}{2x} + y y^{\\prime} = 0 \\Rightarrow (x^2 - y^2) + 2xy y^{\\prime} = 0$.',
    },
  ],

  separable: [
    {
      problem: 'Solve: $\\frac{dy}{dx} = \\frac{1-y^2}{1-x^2}$ (H.K. Dass §3.5)',
      hint: 'Separate variables: $\\frac{dy}{1-y^2} = \\frac{dx}{1-x^2}$. Use partial fractions on both sides.',
      solution: '$\\frac{dy}{1-y^2} = \\frac{dx}{1-x^2}$. Both sides: $\\frac{1}{2}\\ln\\left|\\frac{1+y}{1-y}\\right| = \\frac{1}{2}\\ln\\left|\\frac{1+x}{1-x}\\right| + C_1$. So $\\ln\\left|\\frac{1+y}{1-y}\\right| = \\ln\\left|\\frac{1+x}{1-x}\\right| + \\ln k$. Result: $\\frac{1+y}{1-y} = k\\cdot\\frac{1+x}{1-x}$.',
    },
    {
      problem: 'Solve: $\\cos x(1+\\cos y)\\,dx - \\sin y(1+\\sin x)\\,dy = 0$',
      hint: 'Separate: $\\frac{\\cos x}{1+\\sin x}dx = \\frac{\\sin y}{1+\\cos y}dy$. Integrate each side.',
      solution: '$\\int\\frac{\\cos x}{1+\\sin x}dx = \\ln|1+\\sin x|$. $\\int\\frac{\\sin y}{1+\\cos y}dy = -\\ln|1+\\cos y|$. So $\\ln|1+\\sin x| + \\ln|1+\\cos y| = \\ln C$. Answer: $(1+\\sin x)(1+\\cos y) = C$.',
    },
    {
      problem: 'Solve the initial value problem: $e^y\\,dx + (1+x^2)\\,dy = 0$, $y(0)=0$.',
      hint: 'Separate: $\\frac{dx}{1+x^2} = -e^{-y}dy$. Integrate and apply initial condition.',
      solution: '$\\int\\frac{dx}{1+x^2} = -\\int e^{-y}dy \\Rightarrow \\arctan x = e^{-y} + C$. At $x=0, y=0$: $0 = 1 + C \\Rightarrow C = -1$. Particular solution: $\\arctan x = e^{-y} - 1$.',
    },
    {
      problem: 'Solve: $(x^2+1)(y^2-1)\\,dx + xy\\,dy = 0$',
      hint: 'Rearrange to $\\frac{(x^2+1)}{x}dx = -\\frac{(y^2-1)}{y}dy$... wait, group as $\\frac{x^2+1}{x}dx + \\frac{y}{y^2-1}dy = 0$.',
      solution: 'Rewrite: $\\frac{(x^2+1)dx}{x} + \\frac{y\\,dy}{y^2-1} = 0$ is not separable as is. Rearrange original: $(x^2+1)(y^2-1)dx = -xy\\,dy$ → $\\frac{(x^2+1)}{x}dx = \\frac{-y}{y^2-1}dy$. Integrate: $(x - \\frac{1}{x}) + \\frac{1}{2}\\ln|y^2-1| = C$... Full: $\\int\\left(x+\\frac{1}{x}\\right)dx + \\int\\frac{y}{y^2-1}dy = C$ → $\\frac{x^2}{2} + \\ln|x| + \\frac{1}{2}\\ln|y^2-1| = C$.',
    },
    {
      problem: 'A population doubles in 30 years. How long does it take to triple? (Use separable DE model)',
      hint: 'Model: $dP/dt = kP$, solution $P = P_0 e^{kt}$. Use $P = 2P_0$ at $t=30$ to find $k$, then solve $P = 3P_0$.',
      solution: '$P = P_0 e^{kt}$. Doubles: $2P_0 = P_0 e^{30k} \\Rightarrow k = \\frac{\\ln 2}{30}$. Triple: $3P_0 = P_0 e^{kt} \\Rightarrow t = \\frac{\\ln 3}{k} = \\frac{30\\ln 3}{\\ln 2} = 30\\cdot\\frac{1.0986}{0.6931} \\approx 47.6$ years.',
    },
  ],

  homogeneous: [
    {
      problem: 'Solve: $(x^2 + y^2)\\,dx - 2xy\\,dy = 0$ (H.K. Dass §3.6)',
      hint: 'Use y = vx. Compute dy/dx and substitute. The equation becomes separable in v and x.',
      solution: 'Put $y = vx$, $dy/dx = v + x dv/dx$. The DE: $dy/dx = \\frac{x^2+y^2}{2xy} = \\frac{1+v^2}{2v}$. So $v + x\\frac{dv}{dx} = \\frac{1+v^2}{2v}$. $x\\frac{dv}{dx} = \\frac{1+v^2}{2v} - v = \\frac{1-v^2}{2v}$. Separate: $\\frac{2v\\,dv}{1-v^2} = \\frac{dx}{x}$. Integrate: $-\\ln|1-v^2| = \\ln|x| + \\ln C$. So $x(1-v^2) = C$. Back-substitute $v = y/x$: $x(1 - y^2/x^2) = C \\Rightarrow x^2 - y^2 = Cx$.',
    },
    {
      problem: 'Solve: $x\\,dy - y\\,dx = \\sqrt{x^2+y^2}\\,dx$',
      hint: 'Rearrange as dy/dx = (y + sqrt(x²+y²))/x. Put y = vx.',
      solution: '$\\frac{dy}{dx} = \\frac{y + \\sqrt{x^2+y^2}}{x}$. Put $y = vx$: $v + x\\frac{dv}{dx} = v + \\sqrt{1+v^2}$. So $x\\frac{dv}{dx} = \\sqrt{1+v^2}$. Separate: $\\frac{dv}{\\sqrt{1+v^2}} = \\frac{dx}{x}$. Integrate: $\\ln|v + \\sqrt{1+v^2}| = \\ln|x| + C = \\ln|Cx|$. So $v + \\sqrt{1+v^2} = Cx$. Back-substitute $v = y/x$: $y + \\sqrt{x^2+y^2} = Cx^2$.',
    },
    {
      problem: 'Solve: $(y^2 - 2xy)\\,dx + x^2\\,dy = 0$',
      hint: 'Write dy/dx = (2xy - y²)/x². Put y = vx.',
      solution: '$\\frac{dy}{dx} = \\frac{2xy-y^2}{x^2} = 2v - v^2$ (after y=vx). $v + x\\frac{dv}{dx} = 2v-v^2$. $x\\frac{dv}{dx} = v - v^2 = v(1-v)$. Separate: $\\frac{dv}{v(1-v)} = \\frac{dx}{x}$. Partial fractions: $\\left(\\frac{1}{v} + \\frac{1}{1-v}\\right)dv = \\frac{dx}{x}$. Integrate: $\\ln|v| - \\ln|1-v| = \\ln|x| + C$. So $\\frac{v}{1-v} = Cx$. Substitute $v = y/x$: $\\frac{y/x}{1-y/x} = Cx \\Rightarrow \\frac{y}{x-y} = Cx \\Rightarrow y = Cx(x-y) = Cx^2 - Cxy$.',
    },
    {
      problem: 'Solve: $\\frac{dy}{dx} = \\frac{x^3+y^3}{3xy^2}$ (from H.K. Dass exercises)',
      hint: 'Check homogeneity (degree 0). Put y = vx and simplify.',
      solution: 'Homogeneous (both top and bottom degree 3). Put $y = vx$, $dy/dx = v + x\\frac{dv}{dx}$. $\\frac{x^3+v^3x^3}{3x\\cdot v^2x^2} = \\frac{1+v^3}{3v^2}$. So $x\\frac{dv}{dx} = \\frac{1+v^3}{3v^2} - v = \\frac{1+v^3-3v^3}{3v^2} = \\frac{1-2v^3}{3v^2}$. Separate: $\\frac{3v^2}{1-2v^3}dv = \\frac{dx}{x}$. Integrate: $-\\frac{1}{2}\\ln|1-2v^3| = \\ln|x| + C$. So $(1-2v^3)x^2 = C$. Substitute $v=y/x$: $x^2 - 2y^3/x = C$, i.e., $x^3 - 2y^3 = Cx$.',
    },
    {
      problem: 'Solve the IVP: $(x+y)\\,dx - x\\,dy = 0$, $y(1) = 0$.',
      hint: 'Rewrite as dy/dx = (x+y)/x = 1 + y/x. Use v = y/x.',
      solution: '$\\frac{dy}{dx} = 1 + \\frac{y}{x}$. Put $y = vx$: $v + x\\frac{dv}{dx} = 1+v$. $x\\frac{dv}{dx} = 1$. $dv = \\frac{dx}{x}$. Integrate: $v = \\ln|x| + C$. So $y/x = \\ln|x| + C \\Rightarrow y = x\\ln|x| + Cx$. At $x=1, y=0$: $0 = 0 + C \\Rightarrow C = 0$. Particular solution: $y = x\\ln x$.',
    },
  ],

  linear: [
    {
      problem: 'Solve: $\\frac{dy}{dx} + \\frac{2y}{x} = x^2$ (H.K. Dass §3.7)',
      hint: 'P = 2/x, Q = x². IF = e^(∫2/x dx) = x². Multiply through and integrate.',
      solution: '$P = 2/x$, $Q = x^2$. IF $= e^{\\int 2/x\\,dx} = e^{2\\ln x} = x^2$. Multiply: $\\frac{d}{dx}[yx^2] = x^4$. Integrate: $yx^2 = \\frac{x^5}{5} + C$. Divide by $x^2$: $y = \\frac{x^3}{5} + \\frac{C}{x^2}$.',
    },
    {
      problem: 'Solve: $\\cos^2 x\\,\\frac{dy}{dx} + y = \\tan x$',
      hint: 'Divide by cos²x to get standard form. P = sec²x, Q = tan x sec²x. Find IF = e^(tan x).',
      solution: 'Standard form: $\\frac{dy}{dx} + y\\sec^2 x = \\tan x \\sec^2 x$. IF $= e^{\\int \\sec^2 x\\,dx} = e^{\\tan x}$. Multiply: $\\frac{d}{dx}[ye^{\\tan x}] = \\tan x \\sec^2 x \\cdot e^{\\tan x}$. Let $u = \\tan x$: $\\int u e^u du = (u-1)e^u$. So $ye^{\\tan x} = (\\tan x - 1)e^{\\tan x} + C$. Answer: $y = \\tan x - 1 + Ce^{-\\tan x}$.',
    },
    {
      problem: 'Solve: $x\\,\\frac{dy}{dx} - 3y = x^4$',
      hint: 'Divide by x: dy/dx - (3/x)y = x³. P = -3/x, IF = x⁻³. Multiply and integrate.',
      solution: 'Standard form: $\\frac{dy}{dx} - \\frac{3}{x}y = x^3$. IF $= e^{-3\\ln x} = x^{-3}$. Multiply: $\\frac{d}{dx}[yx^{-3}] = 1$. Integrate: $yx^{-3} = x + C$. Answer: $y = x^4 + Cx^3$.',
    },
    {
      problem: 'Solve the IVP: $\\frac{dy}{dx} + 2xy = 2xe^{-x^2}$, $y(0) = 1$.',
      hint: 'P = 2x, IF = e^(x²). Multiply and integrate the right side. Apply initial condition.',
      solution: 'IF $= e^{x^2}$. Multiply: $\\frac{d}{dx}[ye^{x^2}] = 2x$. Integrate: $ye^{x^2} = x^2 + C$. So $y = (x^2 + C)e^{-x^2}$. At $x=0, y=1$: $1 = C$. Particular solution: $y = (x^2+1)e^{-x^2}$.',
    },
    {
      problem: 'Solve: $\\frac{dy}{dx} + y\\cot x = \\sin 2x$ (H.K. Dass §3.7)',
      hint: 'P = cot x, IF = e^(∫cot x dx) = sin x. Multiply and use sin 2x = 2 sin x cos x.',
      solution: 'IF $= e^{\\ln\\sin x} = \\sin x$. Multiply: $\\frac{d}{dx}[y\\sin x] = \\sin x \\cdot \\sin 2x = 2\\sin^2 x \\cos x$. Integrate RHS: $\\int 2\\sin^2 x \\cos x\\,dx = \\frac{2}{3}\\sin^3 x + C$. So $y\\sin x = \\frac{2\\sin^3 x}{3} + C$. Answer: $y = \\frac{2\\sin^2 x}{3} + C\\csc x$.',
    },
  ],

  bernoulli: [
    {
      problem: "Solve the Bernoulli DE: $\\frac{dy}{dx} + y = y^2$ (H.K. Dass §3.8)",
      hint: 'n = 2. Divide by y², set v = y⁻¹ (so dv/dx = -y⁻² dy/dx). Get a linear DE in v.',
      solution: 'Divide by $y^2$: $y^{-2}\\frac{dy}{dx} + y^{-1} = 1$. Let $v = y^{-1}$, $\\frac{dv}{dx} = -y^{-2}\\frac{dy}{dx}$. So $-\\frac{dv}{dx} + v = 1 \\Rightarrow \\frac{dv}{dx} - v = -1$. IF $= e^{-x}$. $\\frac{d}{dx}[ve^{-x}] = -e^{-x}$. Integrate: $ve^{-x} = e^{-x} + C$. So $v = 1 + Ce^x$. Back: $1/y = 1 + Ce^x$, i.e., $y = \\frac{1}{1+Ce^x}$.',
    },
    {
      problem: 'Solve: $\\frac{dy}{dx} - \\frac{y}{x} = -y^3 x^2$',
      hint: 'n = 3. Multiply by -y⁻³, set v = y⁻². Get linear DE in v.',
      solution: 'Multiply by $-y^{-3}$: $-y^{-3}\\frac{dy}{dx} + \\frac{y^{-2}}{x} = x^2$. Let $v = y^{-2}$, $dv/dx = -2y^{-3}dy/dx$. So $\\frac{1}{2}\\frac{dv}{dx} + \\frac{v}{x} = x^2 \\Rightarrow \\frac{dv}{dx} + \\frac{2v}{x} = 2x^2$. IF $= x^2$. $\\frac{d}{dx}[vx^2] = 2x^4$. $vx^2 = \\frac{2x^5}{5} + C$. So $v = \\frac{2x^3}{5} + Cx^{-2}$. Back: $y^{-2} = \\frac{2x^3}{5} + Cx^{-2}$.',
    },
    {
      problem: 'Solve: $x\\frac{dy}{dx} + y = x^3 y^3$ (H.K. Dass §3.8)',
      hint: 'Rewrite in standard form, identify n, divide by yⁿ, substitute v = y^(1-n).',
      solution: 'Standard form: $\\frac{dy}{dx} + \\frac{y}{x} = x^2 y^3$. Here $n=3$, $P=1/x$, $Q=x^2$. Divide by $y^3$: $y^{-3}\\frac{dy}{dx} + \\frac{y^{-2}}{x} = x^2$. Let $v = y^{-2}$, $dv/dx = -2y^{-3}dy/dx$. $-\\frac{1}{2}\\frac{dv}{dx} + \\frac{v}{x} = x^2 \\Rightarrow \\frac{dv}{dx} - \\frac{2v}{x} = -2x^2$. IF $= x^{-2}$. $\\frac{d}{dx}[vx^{-2}] = -2$. $vx^{-2} = -2x + C$. $v = -2x^3 + Cx^2$. Back: $y^{-2} = Cx^2 - 2x^3$.',
    },
    {
      problem: 'Solve: $\\frac{dy}{dx} + \\frac{y}{x} = y^2 \\ln x$',
      hint: 'n = 2. Divide by y², substitute v = y⁻¹, solve the resulting linear DE using IF = 1/x.',
      solution: 'Divide by $y^2$: $y^{-2}\\frac{dy}{dx} + \\frac{1}{xy} = \\ln x$. Let $v = y^{-1}$, $dv/dx = -y^{-2}dy/dx$. $-\\frac{dv}{dx} + \\frac{v}{x} = \\ln x \\Rightarrow \\frac{dv}{dx} - \\frac{v}{x} = -\\ln x$. IF $= e^{-\\ln x} = 1/x$. $\\frac{d}{dx}[v/x] = -\\ln x/x$. $\\int \\frac{\\ln x}{x}dx = \\frac{(\\ln x)^2}{2}$. So $v/x = -\\frac{(\\ln x)^2}{2} + C$. Answer: $1/(xy) = C - \\frac{(\\ln x)^2}{2}$.',
    },
    {
      problem: "Reduce $\\frac{dy}{dx} + xy = x y^{1/2}$ to linear form and solve.",
      hint: 'n = 1/2. Substitution: v = y^(1 - 1/2) = y^(1/2). Compute dv/dx and substitute.',
      solution: 'Here $n = 1/2$. Divide by $y^{1/2}$: $y^{-1/2}\\frac{dy}{dx} + xy^{1/2} = x$. Let $v = y^{1/2}$, $dv/dx = \\frac{1}{2}y^{-1/2}dy/dx$. So $2\\frac{dv}{dx} + xv = x \\Rightarrow \\frac{dv}{dx} + \\frac{x}{2}v = \\frac{x}{2}$. IF $= e^{x^2/4}$. $\\frac{d}{dx}[ve^{x^2/4}] = \\frac{x}{2}e^{x^2/4}$. Integrate: $ve^{x^2/4} = e^{x^2/4} + C$. So $v = 1 + Ce^{-x^2/4}$. Back: $y^{1/2} = 1 + Ce^{-x^2/4}$, i.e., $y = (1 + Ce^{-x^2/4})^2$.',
    },
  ],

  exact: [
    {
      problem: 'Test for exactness and solve: $(3x^2+6xy^2)dx + (6x^2y+4y^3)dy = 0$',
      hint: 'Compute ∂M/∂y and ∂N/∂x. If equal, find F(x,y) by integrating M w.r.t. x, then determine φ(y) from ∂F/∂y = N.',
      solution: '$M = 3x^2+6xy^2$, $N = 6x^2y+4y^3$. $\\partial M/\\partial y = 12xy = \\partial N/\\partial x$. Exact. $F = \\int(3x^2+6xy^2)dx = x^3 + 3x^2y^2 + \\phi(y)$. $\\partial F/\\partial y = 6x^2y + \\phi^{\\prime}(y) = 6x^2y + 4y^3$. So $\\phi^{\\prime}(y) = 4y^3 \\Rightarrow \\phi(y) = y^4$. Answer: $x^3 + 3x^2y^2 + y^4 = C$.',
    },
    {
      problem: 'Solve: $(e^y + 1)\\cos x\\,dx + e^y \\sin x\\,dy = 0$',
      hint: 'Check exactness: ∂M/∂y = eʸ cos x, ∂N/∂x = eʸ cos x. Exact. Find F.',
      solution: '$\\partial M/\\partial y = e^y\\cos x = \\partial N/\\partial x$. Exact. $F = \\int(e^y+1)\\cos x\\,dx = (e^y+1)\\sin x + \\phi(y)$. $\\partial F/\\partial y = e^y\\sin x + \\phi^{\\prime}(y) = e^y\\sin x$. So $\\phi^{\\prime}(y) = 0 \\Rightarrow \\phi = $ const. Answer: $(1+e^y)\\sin x = C$.',
    },
    {
      problem: 'Find an IF of the form $\\mu(x)$ and solve: $(2y)dx + (3x)dy = 0$.',
      hint: 'Check: My = 2, Nx = 3. Not exact. Compute (My - Nx)/N = (2-3)/(3x) = -1/(3x) — function of x only. IF = e^(∫-1/(3x)dx) = x^(-1/3).',
      solution: '$(M_y - N_x)/N = (2-3)/(3x) = -1/(3x)$. IF $= e^{-\\frac{1}{3}\\ln x} = x^{-1/3}$. Multiply: $2yx^{-1/3}dx + 3x^{2/3}dy = 0$. Check: $\\partial(2yx^{-1/3})/\\partial y = 2x^{-1/3}$, $\\partial(3x^{2/3})/\\partial x = 2x^{-1/3}$. Exact. $F = 3x^{2/3}y + \\phi(y)$, $\\phi^{\\prime}(y) = 0$. Answer: $3x^{2/3}y = C$ or $yx^{2/3} = C$.',
    },
    {
      problem: 'Solve: $(x^2 - ay)dx + (y^2 - ax)dy = 0$. Determine a for which this is exact.',
      hint: 'My = -a, Nx = -a. They are always equal for any a! So always exact. Find F.',
      solution: '$M = x^2-ay$, $N = y^2-ax$. $\\partial M/\\partial y = -a = \\partial N/\\partial x$ for any value of $a$. Always exact. $F = \\int(x^2-ay)dx = x^3/3 - axy + \\phi(y)$. $\\partial F/\\partial y = -ax + \\phi^{\\prime}(y) = y^2-ax$. So $\\phi^{\\prime}(y) = y^2 \\Rightarrow \\phi = y^3/3$. Answer: $x^3/3 - axy + y^3/3 = C$, i.e., $x^3 + y^3 - 3axy = K$.',
    },
    {
      problem: 'Verify exactness and solve: $(\\sin y - y\\sin x)dx + (\\cos x + x\\cos y - y)dy = 0$.',
      hint: 'M = sin y - y sin x, N = cos x + x cos y - y. Compute My and Nx.',
      solution: '$\\partial M/\\partial y = \\cos y - \\sin x$. $\\partial N/\\partial x = -\\sin x + \\cos y = \\cos y - \\sin x$. Equal → exact. $F = \\int(\\sin y - y\\sin x)dx = x\\sin y + y\\cos x + \\phi(y)$. $\\partial F/\\partial y = x\\cos y + \\cos x + \\phi^{\\prime}(y) = \\cos x + x\\cos y - y$. So $\\phi^{\\prime}(y) = -y \\Rightarrow \\phi = -y^2/2$. Answer: $x\\sin y + y\\cos x - y^2/2 = C$.',
    },
  ],

  applications: [
    {
      problem: 'A body at 80°C is placed in a room at 20°C. After 10 min its temp is 60°C. Find the time to reach 30°C.',
      hint: "Newton's cooling: T(t) = Tₛ + (T₀ - Tₛ)e^(-kt). Use T(10) = 60 to find k.",
      solution: '$T(t) = 20 + 60e^{-kt}$. At $t=10$: $60 = 20 + 60e^{-10k} \\Rightarrow e^{-10k} = 2/3 \\Rightarrow k = \\frac{\\ln(3/2)}{10}$. At $T=30$: $10 = 60e^{-kt} \\Rightarrow e^{-kt} = 1/6 \\Rightarrow t = \\frac{\\ln 6}{k} = \\frac{10\\ln 6}{\\ln(3/2)} \\approx \\frac{10 \\times 1.792}{0.405} \\approx 44.2$ min.',
    },
    {
      problem: 'A tank has 100 L of brine with 10 kg of salt. Pure water enters at 5 L/min and mixture drains at 5 L/min. Find salt Q(t).',
      hint: 'dQ/dt = rate in - rate out = 0 - Q/100 · 5 = -Q/20. Separable.',
      solution: '$\\frac{dQ}{dt} = -\\frac{Q}{20}$. Separate: $\\frac{dQ}{Q} = -\\frac{dt}{20}$. Integrate: $\\ln Q = -t/20 + C$. So $Q = Q_0 e^{-t/20}$. At $t=0$, $Q_0 = 10$ kg. Answer: $Q(t) = 10e^{-t/20}$ kg.',
    },
    {
      problem: 'The population of a town decreases at a rate proportional to the population. If it was 10,000 in 2000 and 8,000 in 2010, find the population in 2020.',
      hint: 'P = P₀ eᵏᵗ with k < 0 (decay). Use P(10) = 8000 to find k.',
      solution: '$P = 10000e^{kt}$. At $t=10$: $8000 = 10000e^{10k} \\Rightarrow e^{10k} = 0.8 \\Rightarrow k = \\frac{\\ln 0.8}{10}$. At $t=20$: $P = 10000e^{20k} = 10000(e^{10k})^2 = 10000(0.8)^2 = 6400$.',
    },
    {
      problem: 'A 10 ohm resistor and 5 H inductor are connected to a 50 V battery. Find i(t) given i(0) = 0.',
      hint: 'L di/dt + Ri = E → 5 di/dt + 10i = 50. Standard linear DE.',
      solution: 'Standard form: $\\frac{di}{dt} + 2i = 10$. IF $= e^{2t}$. $\\frac{d}{dt}[ie^{2t}] = 10e^{2t}$. Integrate: $ie^{2t} = 5e^{2t} + C$. So $i = 5 + Ce^{-2t}$. At $t=0, i=0$: $0 = 5 + C \\Rightarrow C = -5$. Answer: $i(t) = 5(1 - e^{-2t})$ amperes.',
    },
    {
      problem: 'Carbon-14 has half-life 5730 years. A fossil has 25% of original C-14. How old is it?',
      hint: 'N = N₀ e^(-kt). Use half-life to find k, then solve for t when N = 0.25 N₀.',
      solution: 'Half-life: $5730 = \\frac{\\ln 2}{k} \\Rightarrow k = \\frac{\\ln 2}{5730}$. At 25%: $0.25 = e^{-kt} \\Rightarrow t = \\frac{\\ln 4}{k} = \\frac{5730\\ln 4}{\\ln 2} = 5730 \\times 2 = 11460$ years.',
    },
  ],

  higher: [
    {
      problem: 'Solve: $\\frac{d^2y}{dx^2} - 5\\frac{dy}{dx} + 6y = 0$',
      hint: 'Write auxiliary equation m² - 5m + 6 = 0. Factor and find roots.',
      solution: 'AE: $m^2 - 5m + 6 = 0 \\Rightarrow (m-2)(m-3) = 0 \\Rightarrow m = 2, 3$. Real distinct roots. General solution: $y = C_1 e^{2x} + C_2 e^{3x}$.',
    },
    {
      problem: 'Solve: $\\frac{d^2y}{dx^2} - 6\\frac{dy}{dx} + 9y = 0$',
      hint: 'AE: m² - 6m + 9 = 0. Note this is a perfect square.',
      solution: 'AE: $(m-3)^2 = 0 \\Rightarrow m = 3$ (repeated). General solution: $y = (C_1 + C_2 x)e^{3x}$.',
    },
    {
      problem: 'Solve: $\\frac{d^2y}{dx^2} + 4y = 0$',
      hint: 'AE: m² + 4 = 0. Roots are complex.',
      solution: 'AE: $m^2 + 4 = 0 \\Rightarrow m = \\pm 2i$. Complex roots $\\alpha=0, \\beta=2$. General solution: $y = C_1\\cos 2x + C_2\\sin 2x$.',
    },
    {
      problem: 'Solve: $\\frac{d^2y}{dx^2} - 2\\frac{dy}{dx} + 5y = 0$',
      hint: 'AE: m² - 2m + 5 = 0. Use quadratic formula; expect complex roots.',
      solution: 'AE: $m = \\frac{2 \\pm \\sqrt{4-20}}{2} = \\frac{2 \\pm \\sqrt{-16}}{2} = 1 \\pm 2i$. Complex roots: $\\alpha=1, \\beta=2$. General solution: $y = e^x(C_1\\cos 2x + C_2\\sin 2x)$.',
    },
    {
      problem: 'Solve the IVP: $y^{\\prime\\prime} - 3y^{\\prime} + 2y = 0$, $y(0) = 0$, $y^{\\prime}(0) = 1$.',
      hint: 'Find general solution first (two distinct real roots), then apply both initial conditions to find C₁ and C₂.',
      solution: 'AE: $m^2 - 3m + 2 = 0 \\Rightarrow (m-1)(m-2) = 0 \\Rightarrow m=1,2$. GS: $y = C_1e^x + C_2e^{2x}$. $y(0)=0$: $C_1+C_2=0$. $y^{\\prime} = C_1e^x + 2C_2e^{2x}$. $y^{\\prime}(0)=1$: $C_1+2C_2=1$. Subtract: $C_2=1, C_1=-1$. Particular solution: $y = e^{2x} - e^x$.',
    },
  ],
}
