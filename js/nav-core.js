// nav-core.js — shared navigation engine for all courses.
// Each course loads this file, then its own nav.js which calls navCore.init(MODULES).
(function () {
  'use strict';

  // Capture script element at parse time so we can locate sw.js later.
  var _script = document.currentScript;

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function basename(path) {
    return path.split('/').pop().split('?')[0].split('#')[0];
  }

  function buildNav(MODULES) {
    var page = basename(location.pathname) || 'index.html';

    if (page === 'index.html' || page === '') {
      buildModuleList(MODULES);
      return;
    }

    var idx = -1;
    for (var i = 0; i < MODULES.length; i++) {
      if (MODULES[i].file === page) { idx = i; break; }
    }
    if (idx === -1) return;

    var N    = MODULES.length;
    var mod  = MODULES[idx];
    var prev = idx > 0     ? MODULES[idx - 1] : null;
    var next = idx < N - 1 ? MODULES[idx + 1] : null;

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

  function buildModuleList(MODULES) {
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

  window.navCore = {
    init: function (MODULES) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { buildNav(MODULES); });
      } else {
        buildNav(MODULES);
      }

      // Locate sw.js at the repo root relative to this script's location.
      if ('serviceWorker' in navigator && _script) {
        var swUrl = _script.src.replace(/js\/nav-core\.js.*$/, 'sw.js');
        navigator.serviceWorker.register(swUrl);
      }
    }
  };
})();
