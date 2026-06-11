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

  window.Dynamics = {
    rk4: rk4,
    symplecticEuler: symplecticEuler,
    pendulumDeriv: pendulumDeriv,
    doublePendulumDeriv: doublePendulumDeriv,
    standardMap: standardMap
  };
})();
