# Course Plan: Galois Theory → Elliptic Curves

## Goal

Build the reader up from "permuting roots of a quadratic" to understanding how
Galois representations on elliptic curve torsion points explain why CM forces algebraic values.
The course closes the loop on the elliptic course: Galois theory is *why* the arguments in
Modules 5–7 of the elliptic course actually work.

## Prerequisites

Comfort with polynomials, complex numbers, and the elliptic course (Modules 1–7).
No prior abstract algebra assumed — groups and fields are built from scratch.

---

## Module 1 — Field Extensions: Adding a Root

**Title:** Field Extensions: Adding a Root
**File:** module1.html

### Content

- Motivation: $x^2 - 2 = 0$ has no solution in $\mathbb{Q}$; we *adjoin* one: $\mathbb{Q}(\sqrt{2})$
- A field extension $\mathbb{Q} \subset \mathbb{Q}(\sqrt{2})$: a vector space of dimension 2 over $\mathbb{Q}$
  with basis $\{1, \sqrt{2}\}$
- The **degree** $[K : F]$: dimension of $K$ as an $F$-vector space
- The **minimal polynomial** of an algebraic number: the smallest-degree monic polynomial in $\mathbb{Q}[x]$
  it satisfies (e.g. $\sqrt{2}$ has minimal polynomial $x^2 - 2$)
- **Tower law:** $[K : F] = [K : M][M : F]$ for intermediate fields $F \subseteq M \subseteq K$
- Examples: $\mathbb{Q}(\sqrt{2}, \sqrt{3})$ has degree 4; $\mathbb{Q}(\sqrt[3]{2})$ has degree 3 over $\mathbb{Q}$

### Interactive idea

Visualise nested field extensions as concentric regions, each labelled with its degree.
Show how adjoining one root at a time builds up the degree.

---

## Module 2 — Permuting Roots: the Galois Group

**Title:** Permuting Roots: the Galois Group
**File:** module2.html

### Content

- The roots of $x^2 - 2$ are $\pm\sqrt{2}$, related by $\sigma: \sqrt{2} \mapsto -\sqrt{2}$
- $\sigma$ is a **field automorphism** of $\mathbb{Q}(\sqrt{2})$ that fixes $\mathbb{Q}$ pointwise
- **The Galois group** $\text{Gal}(K/F)$: the group of all automorphisms of $K$ that fix $F$
- For $x^2 - 2$: $\text{Gal}(\mathbb{Q}(\sqrt{2})/\mathbb{Q}) = \{e, \sigma\} \cong \mathbb{Z}/2\mathbb{Z}$
- For $x^2 + x + 1$ (roots $\omega, \bar\omega$): Galois group is complex conjugation, again $\mathbb{Z}/2\mathbb{Z}$
- For $x^3 - 2$: three roots $\sqrt[3]{2},\ \omega\sqrt[3]{2},\ \omega^2\sqrt[3]{2}$;
  the splitting field has degree 6 over $\mathbb{Q}$; $\text{Gal} = S_3$ (all permutations of 3 roots)
- Key insight: Galois group = symmetry group of the roots; its order = degree of the splitting field

### Interactive idea

Drag the three roots of $x^3 - 2$ on the complex plane; show which automorphisms permute them
and how the 6 elements of $S_3$ correspond to the 6 rearrangements.

---

## Module 3 — The Galois Correspondence

**Title:** The Galois Correspondence
**File:** module3.html

### Content

- **Galois extension:** a field extension $K/F$ that is both normal (contains all conjugates of every element)
  and separable (no repeated roots in characteristic 0, always true over $\mathbb{Q}$)
- **Fundamental theorem of Galois theory:**
  There is an order-reversing bijection between
  - subgroups $H \leq \text{Gal}(K/F)$
  - intermediate fields $F \subseteq M \subseteq K$
  given by $H \mapsto K^H$ (the fixed field of $H$) and $M \mapsto \text{Gal}(K/M)$
- Bigger subgroup ↔ smaller fixed field; the full group $G$ fixes only $F$; the trivial group $\{e\}$ fixes all of $K$
- **Normal subgroups** correspond to **Galois intermediate extensions** (the "nice" ones)
- Worked example in full: splitting field of $x^4 - 2$ over $\mathbb{Q}$
  - Degree 8, $\text{Gal} \cong D_4$ (dihedral group)
  - Draw the complete subgroup lattice and the corresponding field lattice

### Interactive idea

Clickable lattice diagram: click a subgroup to highlight its fixed field, and vice versa.

---

## Module 4 — Solvability: Why the Quintic Breaks

**Title:** Solvability: Why the Quintic Breaks
**File:** module4.html

### Content

- **Solvable group:** a group $G$ with a subnormal series $G = G_0 \supset G_1 \supset \cdots \supset G_k = \{e\}$
  where each $G_i / G_{i+1}$ is abelian
- Intuition: a solvable group can be "dismantled" into commutative layers
- $S_2, S_3, S_4$ are solvable → quadratic, cubic, quartic formulas exist (by Cardano/Ferrari)
- $S_5$ is not solvable: $A_5$ (the alternating group) is simple and non-abelian; the chain stops
- **Abel–Ruffini theorem:** there is no general solution by radicals for degree ≥ 5
- **Galois's criterion:** $f(x)$ is solvable by radicals $\iff$ $\text{Gal}(f)$ is a solvable group
- This is the payoff of modules 1–3: the group-theoretic structure of root permutations
  *is* the obstruction to solving equations

### Interactive idea

Show the commutator tower $[G,G], [[G,G],[G,G]], \ldots$ for $S_4$ (terminates) vs $S_5$ (does not).

---

## Module 5 — Galois Acting on Torsion Points

**Title:** Galois Acting on Torsion Points
**File:** module5.html

### Content

This module is the bridge from abstract Galois theory into the elliptic curve world.

- **The $n$-torsion subgroup** of an elliptic curve:
  $E[n] = \{P \in E(\bar{\mathbb{Q}}) : nP = \mathcal{O}\}$
  — the points killed by $n$ under the group law
- As an abstract group: $E[n] \cong \mathbb{Z}/n\mathbb{Z} \times \mathbb{Z}/n\mathbb{Z}$ — a 2D grid of $n^2$ points
  (proved using the structure of the torus $\mathbb{C}/\Lambda$: the $n$-torsion points are exactly
  $\{(a\omega_1 + b\omega_2)/n : 0 \leq a,b < n\}$)
- The coordinates of torsion points are algebraic numbers (they satisfy the $n$-division polynomial,
  a polynomial with coefficients in $\mathbb{Q}$ or the field of definition of $E$)
- Therefore $\text{Gal}(\bar{\mathbb{Q}}/\mathbb{Q})$ acts on $E[n]$ by acting on coordinates
- **The mod-$n$ Galois representation:**
  Choosing a basis $\{P_1, P_2\}$ of $E[n]$, each $\sigma \in \text{Gal}(\bar{\mathbb{Q}}/\mathbb{Q})$
  gives a $2 \times 2$ invertible matrix over $\mathbb{Z}/n\mathbb{Z}$:
  $$\rho_n : \text{Gal}(\bar{\mathbb{Q}}/\mathbb{Q}) \to \text{GL}_2(\mathbb{Z}/n\mathbb{Z})$$
- The Weil pairing: a perfect alternating pairing $E[n] \times E[n] \to \mu_n$ (roots of unity)
  preserved by Galois — this constrains the image of $\rho_n$ to lie in $\text{GSp}_2$

### Interactive idea

For a small prime $n$ (e.g. $n = 3$), plot the $n^2 = 9$ torsion points on the torus;
show that Galois permutes them as a $\text{GL}_2(\mathbb{Z}/3)$ matrix action.

---

## Module 6 — CM, Class Fields, and the Abelian Thread

**Title:** CM, Class Fields, and the Abelian Thread
**File:** module6.html

### Content

This module closes the loop with the elliptic course and Module 7 of it (class numbers).

- **Generic curves (Serre's theorem, 1972):** for most elliptic curves $E/\mathbb{Q}$,
  the representation $\rho_n$ is *surjective* for all but finitely many $n$ —
  Galois acts as freely as possible on the torsion
- **CM curves:** $\text{End}(E) \supsetneq \mathbb{Z}$; the extra endomorphisms are elements of
  an imaginary quadratic order $\mathcal{O} \subset \mathbb{Q}(\sqrt{-d})$
- The CM endomorphisms commute with Galois action, so $\rho_n$ must land in the
  **centraliser of $\mathcal{O}/n\mathcal{O}$** inside $\text{GL}_2(\mathbb{Z}/n)$ — a 1D (abelian) subgroup
- The image of $\rho_n$ is abelian: Galois acts on $E[n]$ via a character of the class group,
  not via all of $\text{GL}_2$
- **Class field theory (briefly):** abelian extensions of a number field $K$ are
  controlled by the ideal class group of $K$ (generalised Kronecker–Weber)
- **Kronecker's Jugendtraum:** the maximal abelian extension of $\mathbb{Q}(\sqrt{-d})$
  is generated by $j(\tau)$ and the coordinates of torsion points of the CM curve
- This is *why* CM forces $j(\tau) \in \mathbb{Z}$ (when $h = 1$): the abelian extension
  generated is just $\mathbb{Q}$ itself (unique factorisation in the class group means
  the extension is trivial over $\mathbb{Q}$)
- Full circle: Module 7 of the elliptic course stated this result; here it is derived

---

## Style Notes

- Follow COURSE_STYLE.md guidelines
- Module 3 (the correspondence) deserves the richest interactive (lattice diagram)
- Module 5 is the key technical bridge — the torsion grid visualisation is essential
- Module 6 is deliberately more discursive; it synthesises rather than derives
- Maintain explicit back-references to the elliptic course (especially Modules 5–7)
