// Hamiltonian Mechanics & the Geometry of Motion — module registry.
navCore.init([
  {
    file:  'module1.html',
    label: 'Module 1',
    title: 'The Path Nature Chooses',
    desc:  'The principle of stationary action and the Euler–Lagrange equation — derived by deforming a path and watching $S$.',
  },
  {
    file:  'module2.html',
    label: 'Module 2',
    title: 'The Legendre Transform',
    desc:  'Trade velocity for momentum: $H = p\\dot q - L$, and Hamilton’s two first-order equations of motion.',
  },
  {
    file:  'module3.html',
    label: 'Module 3',
    title: 'Life in Phase Space',
    desc:  'Hamilton’s equations as a flow on the $(q,p)$ plane — trajectories ride the level sets of $H$.',
  },
  {
    file:  'module-3.1-playground.html',
    label: 'Interlude',
    title: 'The Phase-Space Playground',
    desc:  'Pick a Hamiltonian, click to seed orbits, drag the energy — free exploration of everything so far.',
  },
  {
    file:  'module4.html',
    label: 'Module 4',
    title: 'Poisson Brackets & Conservation',
    desc:  '$\\dot f = \\{f, H\\}$. Why every continuous symmetry hides a conserved quantity — Noether, made computational.',
  },
  {
    file:  'module5.html',
    label: 'Module 5',
    title: 'Liouville’s Theorem',
    desc:  'The flow shears and folds but never compresses: phase-space volume is exactly conserved. Why there are no attractors.',
  },
  {
    file:  'module6.html',
    label: 'Module 6',
    title: 'Tori, Integrability & Chaos',
    desc:  'Action–angle variables wrap integrable motion onto tori — and the standard map shows them shatter into chaos.',
  },
  {
    file:  'module-6.1-action-angle.html',
    label: 'Interlude',
    title: 'Action–Angle by Hand',
    desc:  'A worked, draggable example: the action $J$ and frequency $\\omega(J)$ for the oscillator and the pendulum — the flow-side seed of the map twist.',
  },
  {
    file:  'module7.html',
    label: 'Module 7',
    title: 'From Flow to Map',
    desc:  'Discrete symplectic maps: area preservation, the trace test for stability, the rotation number $\\nu_0$, and the Courant–Snyder invariant.',
  },
  {
    file:  'module8.html',
    label: 'Module 8',
    title: 'Lie Algebras & Lie Transformations',
    desc:  'The Poisson bracket as a Lie algebra; $e^{:G:}$ turns a generator into a symplectic map; normal forms and the twist coefficient $\\tau_0$.',
  },
  {
    file:  'module9.html',
    label: 'Module 9',
    title: 'The Hénon Map & Reversibility',
    desc:  'The cubic Hénon map’s order-and-chaos portrait, and reversibility $T=R_2\\circ R_1$ — the discrete echo of Noether’s theorem.',
  },
  {
    file:  'module10.html',
    label: 'Module 10',
    title: 'Almost-Conserved Quantities',
    desc:  'Approximate invariants $\\mathcal K[T\\zeta]-\\mathcal K[\\zeta]=\\mathcal O(\\epsilon^{n+1})$ — the perturbation theory of arXiv:2505.07223, made visual.',
  },
  {
    file:  'module-10.1-mcmillan-lab.html',
    label: 'Interlude',
    title: 'The McMillan Map Lab',
    desc:  'A sandbox for Modules 7–10: dial the force $f(p)$, seed orbits, and overlay symmetry lines and Courant–Snyder ellipses.',
  },
]);
