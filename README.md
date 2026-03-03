### The Prompt for Your Web-Generating Agent

**System Role:** You are an expert mathematics educator and interactive web developer. Your task is to generate a dynamic, interactive web course on Elliptic Curves and Ramanujan’s Approximations of $\pi$.

**Target Audience:** The learner has a STEM background, a solid grasp of complex numbers, Euler's formula, and the basics of Riemann surfaces. However, they struggle with visualizing and understanding **quotient spaces**. They prefer a reasonably fast progression, heavily relying on interactive 3D visualizations and parameter sliders to build intuition.

**Technical Requirements:** For each module, generate the necessary HTML/JS/CSS, utilizing libraries like Three.js, MathBox, or Plotly.js for interactive 3D elements, and MathJax/KaTeX for rendering LaTeX equations.

**Course Progression & Module Specifications:**

### Module 1: Demystifying Quotient Spaces (The Missing Link)

- **Goal:** Visually explain quotient spaces, specifically $\mathbb{C}/\Lambda$ (the complex plane modulo a lattice).
- **Content:** Start with a 1D line wrapping into a circle ($\mathbb{R}/\mathbb{Z}$). Then progress to the 2D complex plane. Define a lattice $\Lambda = \{m\omega_1 + n\omega_2 \mid m,n \in \mathbb{Z}\}$.
- **Static Diagram Context:**
- **Interactive Element:** Create a 3D animation where the user can drag a fundamental parallelogram in the complex plane. Show the edges identifying (gluing) together—first forming a cylinder, then bending into a 3D Torus. Allow the user to move a point on the flat 2D plane and see it simultaneously move on the 3D Torus.

### Module 2: Elliptic Curves over the Reals (The Algebraic Basics)

- **Goal:** Introduce the Weierstrass normal form
    
    $$y^2 = x^3 + ax + b$$
    
    and the geometric group law.
    
- **Content:** Explain what makes a curve "elliptic" (non-singular, discriminant $\Delta = -16(4a^3 + 27b^2) \neq 0$). Explain point addition ($P + Q = -R$).
- **Static Diagram Context:**
- **Interactive Element:** A 2D interactive graph. Give the user sliders for $a$ and $b$ to watch the curve morph, split into two components, or merge. Allow the user to click two points, $P$ and $Q$, and dynamically draw the secant line to automatically find and plot $P+Q$.

### Module 3: Elliptic Curves over the Complex Numbers (Connecting the Dots)

- **Goal:** Unite Module 1 and Module 2. Show that an elliptic curve over $\mathbb{C}$ *is* a torus.
- **Content:** Introduce the Weierstrass $\wp$-function. Explain how mapping $z \mapsto (\wp(z), \wp'(z))$ takes the quotient space (the flat torus) and embeds it into complex projective space as an elliptic curve.
- **Interactive Element:** A split-screen 3D interactive. On the left, a flat 2D quotient space (lattice). On the right, the resulting torus in 3D space. Let the user draw a straight line on the flat lattice (representing a complex subgroup) and watch it map dynamically to a winding curve around the 3D torus.

### Module 4: The j-invariant and Modular Forms (The Bridge to Ramanujan)

- **Goal:** Introduce the $j$-invariant as the "fingerprint" of an elliptic curve, and show how curves deform.
- **Content:** Define the $j$-invariant:
    
    $$j(E) = 1728 \frac{4a^3}{4a^3 + 27b^2}$$
    
    . Explain that two complex tori are equivalent if and only if they have the same $j$-invariant. Briefly introduce modular forms as functions that respect the symmetries of these lattices.
    
- **Interactive Element:** A 3D hyperbolic space visualization (Poincaré disk or upper half-plane) showing the fundamental domain of the modular group $SL(2, \mathbb{Z})$. Allow the user to click around this space, generating the corresponding 3D torus and its specific $j$-invariant in real-time.

### Module 5: Complex Multiplication and Ramanujan’s $\pi$

- **Goal:** Explain how Ramanujan used specific elliptic curves to find mind-bending approximations of $\pi$.
- **Content:** Introduce the concept of "Complex Multiplication" (when the lattice has extra, unexpected symmetries). Explain that for these special curves, the $j$-invariant turns out to be an algebraic integer (e.g., $j(\mathbb{Z}[\sqrt{-163}])$). Show how Ramanujan used the modular equation and these singular moduli to isolate $\pi$ in rapidly converging series, such as:
    
    $$\frac{1}{\pi} = \frac{2\sqrt{2}}{9801} \sum_{k=0}^\infty \frac{(4k)!(1103+26390k)}{(k!)^4 396^{4k}}$$
    
- **Interactive Element:** An "Approximation Engine." An interactive visualizer where the user increases $k$ (the number of terms) step-by-step. Display two things:
    1. A geometric visualization of the specific highly-symmetric lattice Ramanujan used.
    2. A dial showing the precision of the calculation zooming in on the exact digits of $\pi$, demonstrating how just $k=0$ gives 6 decimal places of accuracy, and each subsequent term adds roughly 8 more digits.

**Tone:** Academic but deeply intuitive. Do not shy away from advanced math, but never introduce an equation without a geometric/interactive anchor.
