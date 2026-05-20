export interface BonusProblem {
  problem: string
  hint: string
  solution: string
}

export const BONUS_PROBLEMS: Record<string, BonusProblem[]> = {
  foundations: [
    { problem: 'Form the DE by eliminating constants from $y = Ae^{3x} + Be^{-3x}$.', hint: 'Differentiate twice, then eliminate A and B.', solution: '$y\'\' = 9Ae^{3x} + 9Be^{-3x} = 9y$. Answer: $y\'\' - 9y = 0$.' },
    { problem: 'Find order and degree: $[1 + (dy/dx)^2]^{3/2} = k(d^2y/dx^2)$.', hint: 'Square both sides to clear the fractional exponent.', solution: 'Squaring: $[1+(y\')^2]^3 = k^2(y\'\')^2$. Order = 2 (highest derivative is $y\'\'$). Degree = 2 (power of $y\'\'$).' },
    { problem: 'Verify $y = e^x\\sin x$ satisfies $y\'\' - 2y\' + 2y = 0$.', hint: 'Compute $y\'$ and $y\'\'$, substitute into the DE.', solution: '$y\' = e^x(\\sin x + \\cos x)$. $y\'\' = 2e^x\\cos x$. Substituting: $2e^x\\cos x - 2e^x(\\sin x + \\cos x) + 2e^x\\sin x = 0$.' },
    { problem: 'Form the DE from $y^2 = Ax^2 + Bx + C$.', hint: 'Three constants means differentiate three times.', solution: 'After three differentiations and elimination: $y(d^3y/dx^3) + 3(dy/dx)(d^2y/dx^2) = 0$. Order 3.' },
  ],
  separable: [
    { problem: 'Solve $\\sec^2 x \\tan y\\,dx + \\sec^2 y \\tan x\\,dy = 0$.', hint: 'Divide by $\\tan x \\tan y$ and separate.', solution: '$\\frac{\\sec^2 x}{\\tan x}dx + \\frac{\\sec^2 y}{\\tan y}dy = 0$. Integrating: $\\ln|\\tan x| + \\ln|\\tan y| = \\ln C$. Answer: $\\tan x \\cdot \\tan y = C$.' },
    { problem: 'Solve $(e^y + 1)\\cos x\\,dx + e^y\\sin x\\,dy = 0$.', hint: 'Separate: $\\cos x/\\sin x\\,dx + e^y/(e^y+1)\\,dy = 0$.', solution: '$\\ln|\\sin x| + \\ln(e^y + 1) = \\ln C$. Answer: $(e^y + 1)\\sin x = C$.' },
    { problem: 'Solve $dy/dx = 1 + \\tan(y-x)$, using substitution $z = y - x$.', hint: 'If $z = y-x$, then $dz/dx = dy/dx - 1$.', solution: '$dz/dx = \\tan z$. Separate: $\\cot z\\,dz = dx$. Integrating: $\\ln|\\sin z| = x + C$. Answer: $\\sin(y-x) = e^{x+C}$.' },
    { problem: 'Solve $(2x^2+3y^2-7)x\\,dx - (3x^2+2y^2-8)y\\,dy = 0$.', hint: 'Use componendo-dividendo on the ratio $x\\,dx/(y\\,dy)$.', solution: 'Recognise $d(x^2+y^2)$ and $d(x^2-y^2)$. Result: $x^2+y^2-3 = C(x^2-y^2-1)^5$.' },
  ],
  homogeneous: [
    { problem: 'Solve $(y^2 - xy)dx + x^2\\,dy = 0$.', hint: 'Put $y = vx$, separate, and integrate.', solution: 'After substitution and partial fractions: $x/y = \\ln|x| + C$. Answer: $x/y - \\ln|x| = C$.' },
    { problem: 'Solve $x\\sin(y/x)\\,dy = [y\\sin(y/x) - x]\\,dx$.', hint: 'Put $y = vx$, the $\\sin(y/x)$ terms simplify nicely.', solution: 'After substitution: $\\cos v\\,dv = -dx/x$. Integrating: $\\cos(y/x) = \\ln|x| + C$.' },
    { problem: 'Show that the OT of $r = a(1-\\cos\\theta)$ is $r = c(1+\\cos\\theta)$.', hint: 'Replace $dr/d\\theta$ by $-r^2(d\\theta/dr)$ in the DE.', solution: 'DE of family: $(1/r)(dr/d\\theta) = \\sin\\theta/(1-\\cos\\theta) = \\cot(\\theta/2)$. For OT: $r(d\\theta/dr) = -\\cot(\\theta/2)$, giving $dr/r = -\\tan(\\theta/2)d\\theta$. Integrating: $r = c\\cos^2(\\theta/2) = c(1+\\cos\\theta)/2$.' },
  ],
  'reducible-homogeneous': [
    { problem: 'Solve $dy/dx = (y-x+1)/(y+x+5)$.', hint: 'Check $a/A$ vs $b/B$: $-1/1 \\neq 1/1$. Case I: find $h, k$.', solution: 'Solve $-h+k+1=0$ and $h+k+5=0$: $h=-3, k=-2$. Shift and solve homogeneous. Answer involves $\\log$ and $\\tan^{-1}$ terms.' },
    { problem: 'Solve $(2x+y+1)dx + (4x+2y-1)dy = 0$.', hint: '$a/A = 2/4 = 1/2 = b/B = 1/2$. Case II. Put $z = 2x+y$.', solution: 'After substitution: $2(2x+y) + \\log(2x+y-1) = 3x + C$.' },
  ],
  'linear-first-order': [
    { problem: 'Solve $\\cos^2 x(dy/dx) + y = \\tan x$.', hint: 'Standard form: $dy/dx + y\\sec^2 x = \\tan x\\sec^2 x$. Find I.F.', solution: 'I.F. $= e^{\\tan x}$. Solution: $ye^{\\tan x} = \\int \\tan x \\sec^2 x \\cdot e^{\\tan x}\\,dx$. Put $t = \\tan x$: RHS $= (t-1)e^t$. Answer: $y = \\tan x - 1 + Ce^{-\\tan x}$.' },
    { problem: 'Solve $y\\log y\\,dx + (x - \\log y)\\,dy = 0$.', hint: 'Rewrite as linear in $x$: $dx/dy + x/(y\\log y) = 1/y$.', solution: 'I.F. $= \\log y$. Solution: $x\\log y = (\\log y)^2/2 + C$.' },
    { problem: 'Solve $(x+1)dy/dx - y = e^x(x+1)^2$.', hint: '$dy/dx - y/(x+1) = e^x(x+1)$. I.F. $= 1/(x+1)$.', solution: '$y/(x+1) = e^x + C$. Answer: $y = (x+1)(e^x + C)$.' },
  ],
  bernoulli: [
    { problem: 'Solve $x(dy/dx) + y\\log y = xye^x$.', hint: 'Divide by $xy$, put $z = \\log y$.', solution: '$dz/dx + z/x = e^x$. I.F. $= x$. Solution: $xz = xe^x - e^x + C$. Answer: $x\\log y = xe^x - e^x + C$.' },
    { problem: 'Solve $dy/dx + y\\tan x = y^2\\sec x$.', hint: 'Bernoulli with $n=2$. Divide by $y^2$, put $v = 1/y$.', solution: '$dv/dx + v\\tan x = \\sec x$. I.F. $= \\sec x$. Answer: $\\sec x = y(\\tan x + C)$.' },
    { problem: 'Solve $r\\sin\\theta - (dr/d\\theta)\\cos\\theta = r^2$.', hint: 'Bernoulli in $r$ with $n=2$.', solution: 'Divide by $r^2$, put $v = 1/r$: $dv/d\\theta + v\\tan\\theta = \\sec\\theta$. I.F. $= \\sec\\theta$. Answer: $1/r = (\\sin\\theta + C\\cos\\theta)$.' },
  ],
  exact: [
    { problem: 'Solve $(y\\cos x + \\sin y + y)dx + (\\sin x + x\\cos y + x)dy = 0$.', hint: 'Check exactness: $M_y = \\cos x + \\cos y + 1 = N_x$.', solution: '$F = y\\sin x + x\\sin y + xy = C$.' },
    { problem: 'Solve $(y\\log y)dx + (x - \\log y)dy = 0$ using an I.F.', hint: '$(M_y - N_x)/N = ?$. Try finding I.F. as function of $y$.', solution: 'I.F. $= 1/(y\\log y)$ or use Rule 2. After making exact: $2x\\log y = c + (\\log y)^2$.' },
    { problem: 'Solve $[1 + \\log(xy)]dx + (x/y)dy = 0$.', hint: 'Check: $M = 1 + \\log x + \\log y$, $N = x/y$. $M_y = 1/y = N_x$.', solution: 'Exact. $\\int M\\,dx = x + x\\log x - x + x\\log y = x\\log(xy)$. Solution: $x\\log(xy) + y = C$... actually $x\\log(xy) = C$ after checking N terms.' },
  ],
  'second-order': [
    { problem: 'Solve $(D^2 - 6D + 9)y = 6e^{3x} + 7e^{-2x} - \\log 2$.', hint: 'P.I. for $e^{3x}$ fails (repeated root). Use $x^2$ multiplier. Others are straightforward.', solution: 'C.F. $= (C_1+C_2x)e^{3x}$. P.I. $= 3x^2e^{3x} + 7e^{-2x}/25 - \\log 2/9$.' },
    { problem: 'Solve $(D^2+4)y = \\cos 2x$.', hint: 'P.I. fails since $\\cos 2x$ is part of C.F. Multiply by $x$.', solution: 'C.F. $= A\\cos 2x + B\\sin 2x$. P.I. $= (x/4)\\sin 2x$.' },
    { problem: 'Solve $(D^2-4D+4)y = 8x^2e^{2x}\\sin 2x$.', hint: 'Use exponential shift: factor out $e^{2x}$, then integrate $x^2\\sin 2x$ twice.', solution: 'P.I. $= -e^{2x}[4x\\cos 2x + (2x^2-3)\\sin 2x]$.' },
    { problem: 'Solve $y\'\' + y = e^x + \\cos x$.', hint: 'Find P.I. for each term separately.', solution: 'P.I. for $e^x$: $e^x/2$. P.I. for $\\cos x$ fails, multiply by $x$: $(x/2)\\sin x$. Total: $y = C_1\\cos x + C_2\\sin x + e^x/2 + (x/2)\\sin x$.' },
  ],
  'cauchy-euler': [
    { problem: 'Solve $x^3y\'\'\' + 3x^2y\'\' + xy\' = x^3\\log x$.', hint: 'Put $x = e^z$: $D^3y = ze^{3z}$.', solution: 'C.F. $= C_1 + C_2z + C_3z^2$. P.I. $= e^{3z}(z-1)/27 = x^3(\\ln x - 1)/27$.' },
    { problem: 'Solve $x^2y\'\' - xy\' + y = \\log x$.', hint: 'Put $x = e^z$: $(D^2-2D+1)y = z$.', solution: 'C.F. $= (C_1+C_2z)e^z = (C_1+C_2\\ln x)x$. P.I. $= z + 2 = \\ln x + 2$.' },
  ],
  'variation-parameters': [
    { problem: 'Solve $y\'\' + y = \\sec x\\tan x$.', hint: '$y_1 = \\cos x, y_2 = \\sin x, W = 1$.', solution: '$u = \\int -\\sin x\\sec x\\tan x\\,dx = \\sec x$. $v = \\int \\cos x\\sec x\\tan x\\,dx = -\\ln|\\cos x|$... P.I. involves $\\sec x$ and log terms.' },
    { problem: 'Solve $y\'\' - y = 2/(1+e^x)$.', hint: '$y_1 = e^x, y_2 = e^{-x}, W = -2$.', solution: '$u = -e^{-x} + \\log(e^{-x}+1)$. $v = -\\log(1+e^x)$. Complete: $y = C_1e^x + C_2e^{-x} - 1 + e^x\\log(e^{-x}+1) - e^{-x}\\log(e^x+1)$.' },
  ],
  simultaneous: [
    { problem: 'Solve $dx/dt + 4x + 3y = t$, $dy/dt + 2x + 5y = e^t$.', hint: 'Operate (1) by $(D+5)$ and multiply (2) by 3, subtract.', solution: '$(D^2+9D+14)x = 1+5t-3e^t$. Roots $-2, -7$. Full solution involves exponentials plus polynomial and exponential P.I.' },
    { problem: 'Solve $dx/dt = 2y, dy/dt = 2z, dz/dt = 2x$.', hint: 'Differentiate three times to get $(D^3-8)x = 0$.', solution: 'Roots: $2, -1 \\pm i\\sqrt{3}$. $x = C_1e^{2t} + e^{-t}(A\\cos\\sqrt{3}t + B\\sin\\sqrt{3}t)$. Then find $z$ and $y$ by back-substitution.' },
  ],
  applications: [
    { problem: 'A body cools from 100C to 75C in 1 min (air 25C). Find T at 3 min.', hint: '$T - 25 = 75e^{kt}$. Use $T(1) = 75$ to find $k$.', solution: '$e^k = 2/3$. At $t=3$: $T = 25 + 75(2/3)^3 = 47.22$C.' },
    { problem: 'Find OT of $y = ax^2$ (parabolas).', hint: 'DE: $y\' = 2y/x$. OT: $y\' = -x/(2y)$.', solution: '$2y\\,dy = -x\\,dx$. Answer: $x^2 + 2y^2 = C$ (ellipses).' },
    { problem: 'Solve the L-R-C circuit: $L(di/dt) + Ri = E_0\\sin\\omega t$.', hint: 'Linear DE. I.F. $= e^{Rt/L}$.', solution: '$i = E_0/(R^2+L^2\\omega^2)^{1/2} \\cdot \\sin(\\omega t - \\tan^{-1}(L\\omega/R)) + Ae^{-Rt/L}$. Transient dies out, steady state oscillates.' },
    { problem: 'Population doubles in 50 years. When does it triple?', hint: '$k = \\ln 2/50$.', solution: '$t = \\ln 3/k = 50 \\cdot \\ln 3/\\ln 2 \\approx 79.25$ years.' },
  ],
}
