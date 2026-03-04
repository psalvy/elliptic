// Centralised navigation — single source of truth for module ordering.
// Populates .nav-top and .nav-bottom on module pages, and .module-list on index.html.
(function () {
  'use strict';

  var MODULES = [
    {
      file:  'module1.html',
      label: 'Module 1',
      title: 'Demystifying Quotient Spaces',
      desc:  'Visualize $\\mathbb{C}/\\Lambda$: from lattice to torus, interactively.',
    },
    {
      file:  'module2.html',
      label: 'Module 2',
      title: 'Elliptic Curves over \u211d',
      desc:  'Weierstrass form $y^2 = x^3 + ax + b$, point addition, and the group law.',
    },
    {
      file:  'module3.html',
      label: 'Module 3',
      title: 'Elliptic Curves over \u2102',
      desc:  'The Weierstrass \u2118-function: how a flat torus <em>becomes</em> an elliptic curve.',
    },
    {
      file:  'module4.html',
      label: 'Module 4',
      title: 'The j-invariant \u0026 Modular Forms',
      desc:  'Fingerprinting curves \u2014 the bridge from geometry to number theory.',
    },
    {
      file:  'module-4.1-dashboard.html',
      label: 'Interlude',
      title: 'The Grand Unification',
      desc:  'Drag $\\tau$ in the upper half-plane \u2014 watch the lattice, torus, and algebraic curve morph live.',
    },
    {
      file:  'module5.html',
      label: 'Module 5',
      title: 'Complex Multiplication \u0026 Ramanujan\u2019s \u03c0',
      desc:  'How special lattice symmetries unlock mind-bending \u03c0 formulas.',
    },
    {
      file:  'module6.html',
      label: 'Module 6',
      title: 'Deriving the Formula',
      desc:  'Legendre\u2019s relation, periods, quasi-periods \u2014 where the formula actually comes from.',
    },
  ];

  // Escape text for safe insertion as HTML text content.
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function basename(path) {
    return path.split('/').pop().split('?')[0].split('#')[0];
  }

  function buildNav() {
    var page = basename(location.pathname) || 'index.html';

    if (page === 'index.html' || page === '') {
      buildModuleList();
      return;
    }

    var idx = -1;
    for (var i = 0; i < MODULES.length; i++) {
      if (MODULES[i].file === page) { idx = i; break; }
    }
    if (idx === -1) return;

    var N   = MODULES.length;
    var mod  = MODULES[idx];
    var prev = idx > 0       ? MODULES[idx - 1] : null;
    var next = idx < N - 1   ? MODULES[idx + 1] : null;

    var navTop = document.querySelector('.nav-top');
    if (navTop) {
      var prevTop = prev
        ? '<a href="' + prev.file + '">\u2190 Prev</a>'
        : '<a href="index.html">\u2190 Home</a>';
      var nextTop = next
        ? '<a href="' + next.file + '">Next \u2192</a>'
        : '<a href="index.html">Home \u2192</a>';
      navTop.innerHTML =
        prevTop +
        '<span>' + esc(mod.label) + ' \u2013 ' + (idx + 1) + ' of ' + N + '</span>' +
        nextTop;
    }

    var navBot = document.querySelector('.nav-bottom');
    if (navBot) {
      var prevBot = prev
        ? '<a href="' + prev.file + '">\u2190 ' + esc(prev.label) + ': ' + esc(prev.title) + '</a>'
        : '<a href="index.html">\u2190 Home</a>';
      var nextBot = next
        ? '<a href="' + next.file + '">' + esc(next.label) + ': ' + esc(next.title) + ' \u2192</a>'
        : '<span class="disabled">End of Course</span>';
      navBot.innerHTML = prevBot + nextBot;
    }
  }

  function buildModuleList() {
    var ul = document.querySelector('.module-list');
    if (!ul) return;
    ul.innerHTML = MODULES.map(function (m) {
      return '<li><a href="' + m.file + '">' +
        '<div class="mod-num">' + esc(m.label) + '</div>' +
        '<div class="mod-title">' + esc(m.title) + '</div>' +
        '<div class="mod-desc">' + m.desc + '</div>' +
        '</a></li>';
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
})();
