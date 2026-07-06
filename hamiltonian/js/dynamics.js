// dynamics.js — shared numerical helpers for the Hamiltonian Mechanics course.
// Pure functions, no DOM. Loaded after the shared engines, before module scripts.
(function () {
  'use strict';

  // Classic 4th-order Runge–Kutta step for an autonomous system y' = f(y).
  // `f` takes a state array and returns the derivative array of the same length.
  // Returns a NEW state array (does not mutate the input).
  function rk4(f, y, dt) {
    var n = y.length;
    var k1 = f(y);
    var y2 = new Array(n), y3 = new Array(n), y4 = new Array(n);
    for (var i = 0; i < n; i++) y2[i] = y[i] + 0.5 * dt * k1[i];
    var k2 = f(y2);
    for (i = 0; i < n; i++) y3[i] = y[i] + 0.5 * dt * k2[i];
    var k3 = f(y3);
    for (i = 0; i < n; i++) y4[i] = y[i] + dt * k3[i];
    var k4 = f(y4);
    var out = new Array(n);
    for (i = 0; i < n; i++) {
      out[i] = y[i] + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    }
    return out;
  }

  // Symplectic (semi-implicit) Euler for a separable H(q,p) = T(p) + V(q).
  // dHdq, dHdp are functions of (q, p). Preserves phase-space area to machine
  // precision over long runs — used where Liouville behaviour must be exact.
  // Returns [qNext, pNext].
  function symplecticEuler(dHdq, dHdp, q, p, dt) {
    var pNext = p - dt * dHdq(q, p);     // kick: uses old q
    var qNext = q + dt * dHdp(q, pNext); // drift: uses new p
    return [qNext, pNext];
  }

  // --- Single pendulum -------------------------------------------------------
  // State [theta, omega]. theta measured from the downward vertical.
  // theta'' = -(g/L) sin(theta). Returns derivative [omega, alpha].
  function pendulumDeriv(state, g, L) {
    var theta = state[0], omega = state[1];
    return [omega, -(g / L) * Math.sin(theta)];
  }

  // --- Double pendulum -------------------------------------------------------
  // State [t1, w1, t2, w2] (angles from downward vertical, angular velocities).
  // Equal-mass-friendly general form (myphysicslab convention). g downward.
  function doublePendulumDeriv(s, g, m1, m2, L1, L2) {
    var t1 = s[0], w1 = s[1], t2 = s[2], w2 = s[3];
    var d = t1 - t2;
    var den = 2 * m1 + m2 - m2 * Math.cos(2 * t1 - 2 * t2);

    var a1 =
      -g * (2 * m1 + m2) * Math.sin(t1) -
      m2 * g * Math.sin(t1 - 2 * t2) -
      2 * Math.sin(d) * m2 * (w2 * w2 * L2 + w1 * w1 * L1 * Math.cos(d));
    var dw1 = a1 / (L1 * den);

    var a2 =
      2 * Math.sin(d) *
      (w1 * w1 * L1 * (m1 + m2) +
        g * (m1 + m2) * Math.cos(t1) +
        w2 * w2 * L2 * m2 * Math.cos(d));
    var dw2 = a2 / (L2 * den);

    return [w1, dw1, w2, dw2];
  }

  // --- Chirikov standard map -------------------------------------------------
  // One iterate of the area-preserving map on the cylinder/torus.
  //   p' = p + K sin(theta);  theta' = theta + p'.
  // Returns [thetaNext, pNext], optionally wrapped into [0, 2pi) / (-pi, pi].
  function standardMap(theta, p, K, wrap) {
    var pNext = p + K * Math.sin(theta);
    var thNext = theta + pNext;
    if (wrap) {
      var TAU = Math.PI * 2;
      thNext = ((thNext % TAU) + TAU) % TAU;
      pNext = ((pNext + Math.PI) % TAU + TAU) % TAU - Math.PI;
    }
    return [thNext, pNext];
  }

  // --- Linear symplectic map (McMillan form, linear force) -------------------
  // T:  q' = p,  p' = -q + a p.   Trace of the Jacobian is `a`.
  // For |a| < 2 the origin is a stable (elliptic) fixed point and orbits ride
  // ellipses; for |a| > 2 it is unstable (hyperbolic) and orbits fly off.
  // Returns [qNext, pNext].
  function linearMap(q, p, a) {
    return [p, -q + a * p];
  }

  // Bare rotation number (tune) of the linear map above: the fraction of a full
  // turn each iterate advances near the fixed point. Real only for |a| < 2.
  //   nu0 = arccos(a/2) / (2 pi).
  function bareTune(a) {
    if (Math.abs(a) >= 2) return NaN;
    return Math.acos(a / 2) / (2 * Math.PI);
  }

  // --- General McMillan / Hénon map ------------------------------------------
  // T:  q' = p,  p' = -q + f(p),  for an arbitrary force function f.
  // This is the reversible "McMillan form" the perturbation-theory paper uses.
  // Returns [qNext, pNext].
  function mcMillanMap(q, p, f) {
    return [p, -q + f(p)];
  }

  // Cubic Hénon force f(p) = a p + p^3 (default a = 1). Its map has a stable
  // fixed point at the origin and unstable ones at (±1, ±1) when a = 1.
  function cubicForce(a) {
    var aa = (a === undefined) ? 1 : a;
    return function (p) { return aa * p + p * p * p; };
  }

  // --- Approximate invariants of the cubic Hénon map (a = 1) -----------------
  // These are the closed-form functions from Zolkin–Nagaitsev–Morozov–Kladov,
  // arXiv:2505.07223. Their level sets approximate the map's orbits.
  //   csInvariant : order-0 Courant–Snyder form  p^2 - p q + q^2
  //   henonK4a    : 2nd-order approximate invariant  CS - p^2 q^2
  //   henonK4b    : refined 2nd order  CS - p^2 q^2 + (7/5) CS^2
  function csInvariant(q, p) { return p * p - p * q + q * q; }
  function henonK4a(q, p) { return csInvariant(q, p) - p * p * q * q; }
  function henonK4b(q, p) {
    var cs = csInvariant(q, p);
    return cs - p * p * q * q + 1.4 * cs * cs;
  }

  // Residual of a candidate invariant K along one iterate at (q, p):
  // |K(T(q,p)) - K(q,p)|. Zero for an exact invariant; small for a good
  // approximate one. `step` is a function (q,p) -> [qNext, pNext].
  function invariantResidual(K, step, q, p) {
    var n = step(q, p);
    return Math.abs(K(n[0], n[1]) - K(q, p));
  }

  // Numerically estimate the rotation number (tune) of an orbit about a centre
  // (cx, cy): the average fraction of a full turn per iterate, by accumulating
  // the swept polar angle. `step` maps [q,p] -> [q,p]. Returns turns per iterate.
  function orbitTune(step, q0, p0, cx, cy, iters) {
    var q = q0, p = p0, total = 0, count = 0;
    var ax = q - cx, ay = p - cy;
    for (var i = 0; i < iters; i++) {
      var nx = step(q, p);
      q = nx[0]; p = nx[1];
      if (!isFinite(q) || !isFinite(p) || Math.hypot(q, p) > 1e3) break;
      var bx = q - cx, by = p - cy;
      // signed angle between successive radius vectors
      var cross = ax * by - ay * bx;
      var dot = ax * bx + ay * by;
      var dth = Math.atan2(cross, dot);
      total += dth; count++;
      ax = bx; ay = by;
    }
    if (count === 0) return NaN;
    return Math.abs(total / count) / (2 * Math.PI);
  }

  window.Dynamics = {
    rk4: rk4,
    symplecticEuler: symplecticEuler,
    pendulumDeriv: pendulumDeriv,
    doublePendulumDeriv: doublePendulumDeriv,
    standardMap: standardMap,
    linearMap: linearMap,
    bareTune: bareTune,
    mcMillanMap: mcMillanMap,
    cubicForce: cubicForce,
    csInvariant: csInvariant,
    henonK4a: henonK4a,
    henonK4b: henonK4b,
    invariantResidual: invariantResidual,
    orbitTune: orbitTune
  };
})();
