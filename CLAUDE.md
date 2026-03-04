# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project

Interactive web course on Elliptic Curves and Ramanujan's π. See `README.md` for the user-facing overview.

## Implementation status

All 7 entries (6 modules + 1 interlude) are implemented as standalone HTML pages:

- `index.html` — course home / module list
- `module1.html` — Quotient Spaces (Three.js torus gluing)
- `module2.html` — Elliptic Curves over ℝ (Plotly.js, point addition)
- `module3.html` — Elliptic Curves over ℂ (split-screen lattice ↔ torus)
- `module4.html` — j-invariant & Modular Forms (upper half-plane explorer)
- `module-4.1-dashboard.html` — Interlude: The Grand Unification (live τ explorer)
- `module5.html` — Complex Multiplication & Ramanujan's π (series visualizer)
- `module6.html` — Deriving the Formula (Legendre's relation, periods)

## Tech stack

- **Rendering:** Three.js for 3D, Plotly.js for 2D curves
- **Math typesetting:** KaTeX (bundled under `lib/katex/`)
- **Structure:** Static HTML/JS/CSS, no build system

## Conventions

- Each module is self-contained — shared styles live in `css/style.css`
- Math is rendered via KaTeX with `<div class="math-block">` for display math

## Navigation

Navigation is centralised in `js/nav.js`. **Never hardcode nav links in module HTML.**

- `MODULES` array in `nav.js` is the single source of truth for module order, labels, titles, and index-page descriptions.
- To add or reorder a module: edit `MODULES` only — all counters, prev/next links, and the index page update automatically.
- Each module HTML has empty `<nav class="nav-top"></nav>` and `<nav class="nav-bottom"></nav>` shells that `nav.js` populates at runtime.
- `index.html` has an empty `<ul class="module-list"></ul>` that `nav.js` populates from the `desc` field.
- Script order in every page: `katex.min.js` → `nav.js` → `math-render.js` (so nav content is in the DOM before KaTeX scans it).
