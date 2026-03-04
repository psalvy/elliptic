# Course Plan: Riemann Zeta Function & the Primes

## Goal

A self-contained course tracing the road from Euler's Basel sum to the Riemann Hypothesis.
The central payoff is the **explicit formula**: a contour integral that extracts the prime-counting
function from the zeros of ζ — showing that primes and zeros are two sides of the same coin.

## Prerequisites

Comfort with complex numbers, basic calculus (integrals, series), and the idea of a pole.
Familiarity with the elliptic course is helpful but not required.

---

## Module 1 — The Sum That Started Everything

**Title:** The Sum That Started Everything
**File:** module1.html

### Content

- Euler's Basel problem: $\sum_{n=1}^\infty \frac{1}{n^2} = \frac{\pi^2}{6}$
- Euler's proof via the infinite product for $\sin(\pi x)/(\pi x)$:
  comparing coefficients identifies $\sum 1/n^2$ with $\pi^2/6$
- Natural generalisation: $\zeta(s) = \sum_{n=1}^\infty n^{-s}$ converges for $\text{Re}(s) > 1$
- **The Euler product formula:**
  $$\zeta(s) = \prod_p \frac{1}{1 - p^{-s}}$$
  derived by expanding each factor as a geometric series and invoking unique factorisation
  (every integer appears exactly once in the product — no cancellations, no double-counting)
- The product diverges at $s = 1$ because there are infinitely many primes

### Interactive idea

Build the Euler product term-by-term: slider for the cutoff prime $P$,
show $\prod_{p \leq P} (1-p^{-s})^{-1}$ converging toward $\zeta(s)$ for a fixed $s > 1$.

---

## Module 2 — Riemann's Extension to ℂ

**Title:** Riemann's Extension to ℂ
**File:** module2.html

### Content

- Riemann's 1859 paper: 9 pages that reshaped number theory
- Analytic continuation: extending $\zeta(s)$ from $\text{Re}(s) > 1$ to all $\mathbb{C} \setminus \{1\}$
  via the integral representation $\zeta(s) = \frac{1}{\Gamma(s)}\int_0^\infty \frac{t^{s-1}}{e^t - 1}\,dt$
- The **pole at $s = 1$**: the harmonic series $\sum 1/n$ diverges; $\zeta$ must blow up there
  (simple pole, residue 1)
- **Trivial zeros** at $s = -2, -4, -6, \ldots$: they come from the $\Gamma$-factor, not from
  number theory; they encode no information about primes
- **The functional equation:**
  $$\xi(s) = \xi(1-s), \qquad \xi(s) = \frac{1}{2}s(s-1)\pi^{-s/2}\Gamma\!\left(\tfrac{s}{2}\right)\zeta(s)$$
  This symmetry about $\text{Re}(s) = \frac{1}{2}$ is fundamental to everything that follows

### Interactive idea

Colour-map of $|\zeta(s)|$ on $\mathbb{C}$: the pole at $s=1$ (bright),
trivial zeros (dark spots on the negative real axis), the critical strip visible.

---

## Module 3 — The Critical Strip

**Title:** The Critical Strip
**File:** module3.html

### Content

- The functional equation + Euler product rule out non-trivial zeros outside $0 < \text{Re}(s) < 1$
- **Non-trivial zeros** must lie in the critical strip; the functional equation pairs them:
  if $\rho$ is a zero, so is $1 - \rho$ (and $\bar\rho$, and $1-\bar\rho$)
- First zero: $\rho_1 = \frac{1}{2} + 14.134\ldots\, i$ (Riemann computed several by hand)
- **The Riemann Hypothesis:** all non-trivial zeros lie on the critical line $\text{Re}(s) = \frac{1}{2}$
  — one of the Millennium Prize Problems, unsolved since 1859
- Numerical evidence: the first $10^{13}$ zeros verified on the critical line

### Interactive idea

Plot the first 30 non-trivial zeros on the critical strip; allow zoom.
Mark the symmetry lines ($\text{Re}(s) = \frac{1}{2}$, real axis).

---

## Module 4 — Zeros Determine Everything (Hadamard Product)

**Title:** Zeros Determine Everything
**File:** module4.html

### Content

- Hadamard's theorem (1893): an entire function of finite order is *completely* determined
  by its zeros (up to a polynomial exponential factor) — the exact analogue of a polynomial
  being determined by its roots
- The completed zeta function $\xi(s)$ is entire of order 1; its Hadamard product:
  $$\xi(s) = e^{A+Bs} \prod_\rho \left(1 - \frac{s}{\rho}\right)e^{s/\rho}$$
- **Consequence:** to understand $\zeta$, you must understand its zeros — they are not incidental,
  they are the function
- Parallel to Module 4 of the elliptic course: the $j$-invariant fingerprints a torus;
  here the zeros fingerprint the distribution of primes

---

## Module 5 — The Explicit Formula: Primes from Zeros  ← KEY MODULE

**Title:** The Explicit Formula: Primes from Zeros
**File:** module5.html

### Content

This is the module the user identified as the conceptual core:
"primes emerge as the only ones that don't become zero after a smart integration."

- **Logarithmic derivative of the Euler product:**
  $$-\frac{\zeta'(s)}{\zeta(s)} = \sum_{n=1}^\infty \Lambda(n)\, n^{-s}$$
  where $\Lambda(n) = \log p$ if $n = p^k$, else $0$ (the von Mangoldt function)
  — composite integers vanish, prime powers survive

- **Perron's formula** (the "smart integration"):
  $$\frac{1}{2\pi i} \int_{c-i\infty}^{c+i\infty} \frac{x^s}{s}\,ds = \begin{cases} 1 & x > 1 \\ 0 & 0 < x < 1 \end{cases}$$
  A vertical-line integral acts as a step-function selector

- Inserting $-\zeta'/\zeta$ and integrating: moving the contour left sweeps up residues at
  - $s = 1$: gives $x$ (the main term)
  - each zero $\rho$: gives $x^\rho/\rho$ (oscillatory corrections)
  - $s = 0$ and trivial zeros: give small correction terms

- **Riemann's explicit formula:**
  $$\psi(x) = x - \sum_\rho \frac{x^\rho}{\rho} - \log(2\pi) - \tfrac{1}{2}\log(1 - x^{-2})$$
  where $\psi(x) = \sum_{p^k \leq x} \log p$ counts prime powers with weight

- The primes are entirely encoded by the zeros — the formula is an exact identity, not an approximation

### Interactive idea

Animate the partial sum $x - \sum_{|\text{Im}(\rho)| \leq T} x^\rho/\rho$ as $T$ increases.
Watch the staircase function $\psi(x)$ materialize from the oscillatory zero-contributions.

---

## Module 6 — The Prime Number Theorem and the Riemann Hypothesis

**Title:** The Prime Number Theorem and the Riemann Hypothesis
**File:** module6.html

### Content

- **PNT** (proved 1896 independently by Hadamard and de la Vallée-Poussin):
  $\pi(x) \sim x / \log x$ — follows from showing there are no zeros on $\text{Re}(s) = 1$
- From the explicit formula: the error in $\pi(x) \approx \text{Li}(x)$ is
  $$\pi(x) = \text{Li}(x) - \sum_\rho \text{Li}(x^\rho) + O(\text{small})$$
  each zero contributes an oscillatory error term of size $\approx x^{\text{Re}(\rho)} / \log x$
- **RH says** all zeros have $\text{Re}(\rho) = \frac{1}{2}$, giving error $O(\sqrt{x}\log x)$ — the *best possible*
  bound; primes are as regularly distributed as they could be
- Why it matters: RH implies the primes have no "conspiracy" — no unexpected bias or clustering
- Connection forward: L-functions of elliptic curves, Birch–Swinnerton-Dyer conjecture,
  Langlands program — all generalisations of the same zero-counting philosophy

---

## Style Notes

- Follow the COURSE_STYLE.md guidelines from the repo root
- The explicit formula (Module 5) deserves the most space and the most interactive work
- Use the same `<details>` deep-dive pattern as the elliptic course for technical asides
- The Perron/contour integral derivation should be shown step-by-step (it is the "aha moment")
