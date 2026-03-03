# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository is an interactive web course on **Elliptic Curves and Ramanujan's Approximations of π**. The full specification is in `README.md`.

The course has 5 modules, each a standalone HTML/JS/CSS page with interactive 3D visualizations:

1. **Quotient Spaces** — lattice visualization, torus gluing animation (Three.js)
2. **Elliptic Curves over ℝ** — Weierstrass form explorer with point addition (2D, Plotly.js or similar)
3. **Elliptic Curves over ℂ** — split-screen linking flat lattice to 3D torus (Three.js/MathBox)
4. **j-invariant & Modular Forms** — Poincaré disk / upper half-plane explorer (Three.js)
5. **Complex Multiplication & Ramanujan's π** — series convergence visualizer

## Tech Stack

- **Rendering:** Three.js, MathBox, or Plotly.js for interactive 3D elements
- **Math typesetting:** MathJax or KaTeX for LaTeX equations
- **Structure:** Static HTML/JS/CSS — no build system required

## Target Audience

STEM-educated learner comfortable with complex numbers, Euler's formula, and Riemann surfaces, but needing visual intuition for quotient spaces. Prefers fast progression with heavy use of interactive visualizations.
