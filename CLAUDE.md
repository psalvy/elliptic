# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project

Monorepo for interactive mathematics courses. Each course lives in its own subdirectory. See `COURSE_STYLE.md` for the full style guide to follow when building any course.

## Repo layout

```
root/
├── index.html                     — top-level course listing
├── css/style.css                  — shared base styles (all courses inherit this)
├── js/
│   ├── nav-core.js                — shared nav rendering engine
│   ├── math-render.js             — KaTeX wrapper (shared)
│   ├── canvas3d.js                — 3D wireframe engine (shared)
│   ├── plot2d.js                  — 2D plot engine (shared)
│   └── interactive.js             — slider/drag utilities (shared)
├── sw.js                          — service worker (offline caching, covers all courses)
├── CLAUDE.md                      — this file
├── COURSE_STYLE.md                — style guide for course creation
└── elliptic/                      — Course 1: Elliptic Curves & Ramanujan's π
    ├── index.html                 — course landing page
    ├── module1.html … module6.html
    ├── module-4.1-dashboard.html  — interlude
    └── js/nav.js                  — MODULES array for this course
```

## Courses

- `elliptic/` — Elliptic Curves & Ramanujan's π (7 entries: 6 modules + 1 interlude)

## Tech stack

- **Rendering:** custom Canvas 2D engines (`canvas3d.js`, `plot2d.js`) — no Three.js or Plotly
- **Math typesetting:** KaTeX from jsDelivr CDN (cached offline by service worker)
- **Structure:** Static HTML/JS/CSS, no build system

## Navigation

Navigation is split into two layers. **Never hardcode nav links in module HTML.**

- `js/nav-core.js` — shared rendering logic, exposes `window.navCore`
- `{course}/js/nav.js` — course-specific MODULES array, calls `navCore.init(MODULES)`
- To add or reorder a module: edit the course `js/nav.js` only
- Each module HTML has empty `<nav class="nav-top"></nav>` and `<nav class="nav-bottom"></nav>` shells
- Script order in every module page: `katex.min.js` → `../js/nav-core.js` → `js/nav.js` → `../js/math-render.js` → module-specific scripts

## Adding a new course

1. Create `{course}/` directory with `index.html` and module HTML files
2. Create `{course}/js/nav.js` with the MODULES array calling `navCore.init(...)`
3. Reference shared assets with `../css/style.css`, `../js/nav-core.js`, `../js/math-render.js`, etc.
4. Add course pages to PRECACHE list in `sw.js`
5. Add course entry to root `index.html` and to PRECACHE in `sw.js`
