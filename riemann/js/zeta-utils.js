// riemann/js/zeta-utils.js — shared numeric utilities for the Riemann course.
// All exports on a single global object Z.

var Z = (function () {
  'use strict';

  // Imaginary parts of the first 50 non-trivial zeros of ζ(s).
  // Each entry γ represents the conjugate pair ½ ± iγ.
  var ZEROS = [
    14.134725, 21.022040, 25.010858, 30.424876, 32.935062,
    37.586178, 40.918719, 43.327073, 48.005151, 49.773832,
    52.970321, 56.446248, 59.347044, 60.831779, 65.112544,
    67.079811, 69.546402, 72.067158, 75.704691, 77.144840,
    79.337376, 82.910381, 84.735493, 87.425275, 88.809112,
    92.491899, 94.651344, 95.870634, 98.831194, 101.317851,
    103.725538, 105.446623, 107.168611, 111.029536, 111.874659,
    114.320221, 116.226680, 118.790783, 121.370125, 122.946830,
    124.256819, 127.516683, 129.578704, 131.087688, 133.497737,
    134.756510, 138.116042, 139.736209, 141.123707, 143.111846
  ];

  // Sieve of Eratosthenes — returns array of primes up to limit.
  function sieve(limit) {
    var is = new Uint8Array(limit + 1).fill(1);
    is[0] = is[1] = 0;
    for (var i = 2; i * i <= limit; i++)
      if (is[i]) for (var j = i * i; j <= limit; j += i) is[j] = 0;
    var out = [];
    for (var i = 2; i <= limit; i++) if (is[i]) out.push(i);
    return out;
  }

  // von Mangoldt Λ(n): log(p) if n = p^k for some prime p, else 0.
  function vonMangoldt(n, primes) {
    if (n < 2) return 0;
    for (var i = 0; i < primes.length; i++) {
      var p = primes[i];
      if (p * p > n) break;
      if (n % p === 0) {
        var m = n;
        while (m % p === 0) m = m / p;
        return (m === 1) ? Math.log(p) : 0;
      }
    }
    return Math.log(n); // n itself is prime
  }

  // Build ψ(x) table: psiTable[k] = ψ(k) = Σ_{n≤k} Λ(n).
  function buildPsiTable(limit, primes) {
    var table = new Float64Array(limit + 1);
    var acc = 0;
    for (var n = 1; n <= limit; n++) {
      acc += vonMangoldt(n, primes);
      table[n] = acc;
    }
    return table;
  }

  // π(x): count of primes ≤ x via binary search on the primes array.
  function piCount(x, primes) {
    var lo = 0, hi = primes.length;
    while (lo < hi) {
      var mid = (lo + hi) >>> 1;
      if (primes[mid] <= x) lo = mid + 1; else hi = mid;
    }
    return lo;
  }

  // Li(x) = ∫₂ˣ dt / log(t), computed via Simpson's rule.
  function li(x) {
    if (x <= 1.01) return 0;
    var a = 2, b = x, N = 400, h = (b - a) / N;
    var s = 1 / Math.log(a) + 1 / Math.log(b);
    for (var k = 1; k < N; k++)
      s += (k % 2 === 0 ? 2 : 4) / Math.log(a + k * h);
    return s * h / 3;
  }

  // Contribution of conjugate pair ρ = ½ ± iγ to the explicit formula:
  //   -x^ρ/ρ - x^{ρ̄}/ρ̄  =  -2 Re(x^{½+iγ} / (½+iγ))
  //   = -2√x · (½cos(γ ln x) + γ sin(γ ln x)) / (¼ + γ²)
  function pairContrib(x, gamma) {
    var lnx = Math.log(x);
    return -2 * Math.sqrt(x) *
      (0.5 * Math.cos(gamma * lnx) + gamma * Math.sin(gamma * lnx)) /
      (0.25 + gamma * gamma);
  }

  // Partial Euler product Π_{p≤P} (1 − p^{−s})^{−1} for real s > 1.
  function eulerProduct(s, primes, P) {
    var prod = 1;
    for (var i = 0; i < primes.length && primes[i] <= P; i++)
      prod /= (1 - Math.pow(primes[i], -s));
    return prod;
  }

  // Partial Dirichlet sum Σ_{n=1}^{N} n^{−s} for real s.
  function zetaDirichlet(s, N) {
    var sum = 0;
    for (var n = 1; n <= N; n++) sum += Math.pow(n, -s);
    return sum;
  }

  return {
    ZEROS: ZEROS,
    sieve: sieve,
    vonMangoldt: vonMangoldt,
    buildPsiTable: buildPsiTable,
    piCount: piCount,
    li: li,
    pairContrib: pairContrib,
    eulerProduct: eulerProduct,
    zetaDirichlet: zetaDirichlet,
  };
})();
