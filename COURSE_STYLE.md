# Math Course Style Guide

Reference for any agent building a new course in this series. Read this before writing any module.

---

## Philosophy

**Derivation-first.** The student is not satisfied with "it can be shown that". Every non-trivial step must be explained — why it is valid, where it comes from, what it means geometrically or analytically. Hand-waving is a bug.

**Concrete before abstract.** Introduce the idea through a specific, tangible example or interactive first. Only then generalise and formalise. Never open a module with a definition.

**Build intuition through motion.** A slider that morphs a curve, a draggable point that traces a path, a live sum accumulating term by term — these replace three paragraphs of prose. If a concept has a continuous parameter, there should be a way to move it.

**Earned surprise.** The course should feel like a detective story. Each module ends by hinting at a gap or mystery that the next module resolves. The student should feel the *need* for the next concept before it is introduced.

---

## Course Structure

- 6–8 modules per course, each a standalone HTML page
- An optional **Interlude** page (named `module-X.Y-shortname.html`) after a dense module: a free-exploration sandbox that lets the student play with everything learned so far before continuing
- A `index.html` landing page listing all modules with one-sentence descriptions
- Modules are numbered `module1.html`, `module2.html`, … — the interlude breaks the integer sequence

**Typical arc:**
1. The concrete mystery — a phenomenon that demands explanation
2. The first tool — a definition or construction, built up step by step
3. The key theorem — derived, not stated; visualised before proved
4. The second tool — introduced because the first one breaks or is insufficient
5. The synthesis — the two tools combine to explain the original mystery
6. (Optional) The deeper question — what this opens up, where it leads next

---

## Module Design

Each module follows this internal structure:

### Opening
- No preamble. Start with a visual or a striking fact that creates a question.
- The first sentence should make the student feel the *problem*, not read a syllabus entry.

### Sections (numbered X.1, X.2, …)
- Each section introduces exactly one idea.
- Order: motivation → interactive demo → mathematical derivation → key insight note.
- Section headings are concrete, not generic. Not "Introduction to ζ(s)" but "Why the Harmonic Series is the Wrong Starting Point".

### Interactive elements
- Every non-trivial claim that has a visual analogue gets a canvas or plot.
- Controls: sliders for continuous parameters, buttons for discrete steps, draggable points on curves.
- Label what the user can do: `Drag the point`, `Adjust k`, `Click to add a term`.

### Key insight notes
```html
<div class="note">
  <strong>Key insight:</strong> ...one crisp sentence that names the idea...
</div>
```
Placed at the end of each section. Should be memorable in isolation — the student skimming back should be able to reconstruct the argument from these alone.

### Derivation style
- Show intermediate algebra steps with KaTeX display blocks.
- Annotate steps: *"dividing both sides by ω₁"*, *"using the residue theorem"*.
- When a step uses a non-obvious fact, name and derive the fact inline or in a callout.
- Avoid "similarly" and "it follows that" without justification.

### Formula inspector (for climactic formulas)
When the course builds to a key formula, make it inspectable: clicking each part of the formula reveals an explanation panel describing where that part comes from and what it contributes. See `elliptic/module6.html` (Ramanujan's π formula) for reference implementation.

---

## Interactive Visualisation Guidelines

**No heavy external libraries.** All rendering is done with the custom local engines:
- `js/canvas3d.js` — 3D wireframe over Canvas 2D (no WebGL)
- `js/plot2d.js` — 2D plotting on Canvas 2D
- `js/interactive.js` — shared slider, drag, and event wiring

New custom visualisations are written as self-contained IIFE blocks at the bottom of the module HTML, after the shared scripts. They read canvas elements by id and wire their own controls.

**Performance rule:** all interactive updates must run at 60 fps for reasonable parameter ranges. If a computation is expensive (e.g. summing 1000 terms), pre-compute a lookup table rather than recomputing on every frame.

**Coordinate convention:**
- Mathematical y-up, screen y-down — always flip explicitly (`screenY = cy - mathY * scale`)
- Annotate axes on every canvas

**Colour palette:** use CSS variables from `css/style.css` (`--accent`, `--accent2`, `--canvas-bg`, etc.) so light/dark theming works consistently.

---

## Mathematical Presentation Standards

- All inline math uses `$...$`, all display math uses `$$...$$` inside `<div class="math-block">`.
- Prefer Unicode in prose for common symbols (ℝ, ℂ, ℤ, π, τ, ω, ζ, ∞) to reduce KaTeX overhead.
- Give every named function, transform, or map a one-sentence English description on its first appearance, before the formula.
- When introducing a sum or integral, write out the first two or three terms explicitly before the sigma/integral notation.
- Convergence and domain questions must be addressed, not silently assumed. If you extend a function by analytic continuation, say so and sketch why it is valid.

---

## Navigation & Infrastructure

Navigation is split into **two layers**. **Never hardcode prev/next links in HTML.**

- `js/nav-core.js` — the shared rendering engine (lives at repo root, exposes `window.navCore`). One copy serves every course.
- `{course}/js/nav.js` — the course-specific `MODULES` array, which calls `navCore.init([...])`. This is the only file you touch to add or reorder modules.
- Adding/reordering a module = edit that course's `js/nav.js`. Nothing else changes.
- Each module HTML contains empty nav shells:
  ```html
  <nav class="nav-top"></nav>
  ...
  <nav class="nav-bottom"></nav>
  ```
- Script load order (mandatory), with shared assets reached via `../`:
  `katex.min.js` → `../js/nav-core.js` → `js/nav.js` → `../js/math-render.js` → module-specific scripts.
- KaTeX is loaded from jsDelivr CDN. A single root `sw.js` service worker caches KaTeX and all course pages for offline use — add new course pages **and any new course JS** to its `PRECACHE` list and bump the `CACHE` version.
- Each `{course}/index.html` contains an empty `<ul class="module-list"></ul>` that `navCore` populates from the course's `MODULES`. The **root** `index.html` is a hand-maintained listing of courses (one `<li>` per course, no nav engine).

---

## File & Repo Layout

This is a **monorepo**: shared assets live at the root, and each course is a subdirectory. Courses inherit the shared `css/` and `js/` via `../` references — they are never copied per course.

```
root/
├── index.html                   # Top-level listing of all courses (hand-maintained)
├── css/
│   └── style.css                # Shared base styles — do not duplicate inline
├── js/                          # Shared engines (one copy, all courses)
│   ├── nav-core.js              # Nav rendering engine (window.navCore)
│   ├── math-render.js           # KaTeX wrapper
│   ├── canvas3d.js              # 3D wireframe engine
│   ├── plot2d.js                # 2D plot engine
│   └── interactive.js           # Slider/drag utilities
├── sw.js                        # Service worker (offline caching, covers all courses)
├── CLAUDE.md                    # Project instructions for Claude Code
├── COURSE_STYLE.md              # This file
└── {course}/                    # One directory per course, e.g. elliptic/, hamiltonian/
    ├── index.html               # Course landing page (empty <ul class="module-list">)
    ├── module1.html
    ├── module2.html
    ├── module-2.5-interlude.html  # Optional interlude
    ├── ...
    └── js/
        ├── nav.js               # This course's MODULES array → navCore.init(...)
        └── *.js                 # Optional course-specific helpers (e.g. dynamics.js)
```

**Adding a new course** (see CLAUDE.md for the canonical checklist):
1. Create `{course}/` with `index.html` and the module HTML files.
2. Create `{course}/js/nav.js` with the `MODULES` array calling `navCore.init(...)`.
3. Reference shared assets via `../css/style.css`, `../js/nav-core.js`, `../js/math-render.js`, etc.
4. Add the course's pages and JS to the `PRECACHE` list in root `sw.js` (and bump `CACHE`).
5. Add a course entry to the root `index.html`.

Do not modify the shared `style.css` for course-specific styling — add a `<style>` block in the module HTML instead.

---

## What to Avoid

- **Stating without showing.** Every claim that can be visualised should be.
- **Long prose before the first formula.** If a section has more than 3 paragraphs before a display equation, it is too abstract.
- **Passive "it can be seen".** Say who sees it, or show it interactively.
- **Overcrowded canvases.** One idea per visualisation. If you need to show two related things, use two canvases side by side.
- **Generic section titles.** "Background", "Overview", "Introduction" are banned.
- **Skipping edge cases.** If a formula requires s ≠ 1, or Re(τ) > 0, say so explicitly and show what breaks at the boundary.
