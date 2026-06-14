// Floating glossary for the Hamiltonian course.
// A fixed button that opens a quick-reference panel of the recurring L- and H- names.
// Self-contained: injects its own styles + DOM, renders math via the shared MathRender.
(function () {
  'use strict';

  // One or two plain sentences each — a reminder, not a lesson.
  var TERMS = [
    {
      term: 'Lagrangian $L$',
      def: 'A single function of position and velocity, $L = T - V$ (kinetic minus potential energy). Nature picks the path that makes its running total — the action — stationary.'
    },
    {
      term: 'Hamiltonian $H$',
      def: "The system's total energy rewritten in terms of position and momentum, $H = T + V$. Its derivatives say where each coordinate goes next: $\\dot q = \\partial H/\\partial p$, $\\dot p = -\\partial H/\\partial q$."
    },
    {
      term: 'Legendre transform',
      def: 'A reversible way to swap a variable for the slope of a function in that variable. It carries the velocity-based Lagrangian into the momentum-based Hamiltonian — and back again.'
    },
    {
      term: 'Hessian',
      def: 'The matrix of second derivatives of a function — its curvature. When it is positive-definite the function curves upward in every direction (it is convex), which is exactly what makes the Legendre transform reversible.'
    },
    {
      term: 'Hermitian',
      def: 'A complex matrix equal to its own conjugate-transpose, $H^\\dagger = H$. It splits into a symmetric (metric) part and an antisymmetric (symplectic) part, and generates rotations — energy-preserving, "unitary" evolution.'
    },
    {
      term: 'Lorentzian',
      def: 'The indefinite cousin of ordinary length: it preserves $p^2 - u^2$ instead of $p^2 + u^2$. This is the squeeze-and-stretch near an unstable equilibrium (a saddle), as opposed to the rotation near a stable one.'
    }
  ];

  function build() {
    var style = document.createElement('style');
    style.textContent = [
      '.glossary-fab{position:fixed;bottom:1rem;right:1rem;z-index:1000;',
      'background:var(--accent2);color:var(--fg);border:1px solid var(--border);',
      'border-radius:var(--radius);padding:.5rem .8rem;cursor:pointer;font-family:var(--font);',
      'font-size:.9rem;box-shadow:0 2px 10px rgba(0,0,0,.4);transition:background .15s;}',
      '.glossary-fab:hover{background:var(--accent);}',
      '.glossary-panel{position:fixed;bottom:3.6rem;right:1rem;z-index:1000;',
      'width:min(380px,calc(100vw - 2rem));max-height:72vh;overflow:auto;',
      'background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius);',
      'padding:1rem 1.1rem;box-shadow:0 6px 24px rgba(0,0,0,.5);}',
      '.glossary-panel[hidden]{display:none;}',
      '.glossary-head{display:flex;justify-content:space-between;align-items:center;',
      'font-weight:600;border-bottom:1px solid var(--border);padding-bottom:.5rem;margin-bottom:.3rem;}',
      '.glossary-close{background:none;border:none;color:var(--fg2);font-size:1.4rem;',
      'line-height:1;cursor:pointer;padding:0 .2rem;}',
      '.glossary-close:hover{color:var(--accent);}',
      '.glossary-panel dl{margin:0;}',
      '.glossary-panel dt{color:var(--link);font-weight:600;margin-top:.8rem;}',
      '.glossary-panel dd{margin:.2rem 0 0;font-size:.92rem;line-height:1.55;color:var(--fg);}'
    ].join('');
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.className = 'glossary-fab';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '📖 Glossary';

    var panel = document.createElement('div');
    panel.className = 'glossary-panel';
    panel.hidden = true;

    var html = '<div class="glossary-head"><span>Glossary</span>' +
               '<button class="glossary-close" type="button" aria-label="Close glossary">×</button></div><dl>';
    TERMS.forEach(function (t) {
      html += '<dt>' + t.term + '</dt><dd>' + t.def + '</dd>';
    });
    html += '</dl>';
    panel.innerHTML = html;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    // Render the $...$ math inside the panel using the shared KaTeX wrapper.
    if (window.MathRender && window.MathRender.renderIn) {
      window.MathRender.renderIn(panel);
    }

    function setOpen(open) {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function () { setOpen(panel.hidden); });
    panel.querySelector('.glossary-close').addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
