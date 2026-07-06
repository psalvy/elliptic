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

    buildQuickNav(MODULES, idx);
  }

  // Floating "jump to any module" menu \u2014 a fixed button (bottom-left) that opens
  // a panel listing every module, with the current one highlighted. Shared by
  // all courses; reads the same MODULES array navCore already has.
  function buildQuickNav(MODULES, idx) {
    if (document.querySelector('.qnav-fab')) return; // guard against double init

    var style = document.createElement('style');
    style.textContent = [
      '.qnav-fab{position:fixed;bottom:1rem;left:1rem;z-index:1000;',
      'background:var(--accent2);color:var(--fg);border:1px solid var(--border);',
      'border-radius:var(--radius);padding:.5rem .8rem;cursor:pointer;font-family:var(--font);',
      'font-size:.9rem;box-shadow:0 2px 10px rgba(0,0,0,.4);transition:background .15s;}',
      '.qnav-fab:hover{background:var(--accent);}',
      '.qnav-panel{position:fixed;bottom:3.6rem;left:1rem;z-index:1000;',
      'width:min(340px,calc(100vw - 2rem));max-height:72vh;overflow:auto;',
      'background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius);',
      'padding:.7rem .8rem;box-shadow:0 6px 24px rgba(0,0,0,.5);}',
      '.qnav-panel[hidden]{display:none;}',
      '.qnav-head{display:flex;justify-content:space-between;align-items:center;',
      'font-weight:600;border-bottom:1px solid var(--border);padding-bottom:.5rem;margin-bottom:.4rem;}',
      '.qnav-close{background:none;border:none;color:var(--fg2);font-size:1.4rem;',
      'line-height:1;cursor:pointer;padding:0 .2rem;}',
      '.qnav-close:hover{color:var(--accent);}',
      '.qnav-panel ol{margin:0;padding:0;list-style:none;}',
      '.qnav-panel li{margin:0;}',
      '.qnav-panel a{display:block;text-decoration:none;color:var(--fg);',
      'padding:.4rem .55rem;border-radius:calc(var(--radius) - 2px);line-height:1.3;}',
      '.qnav-panel a:hover{background:var(--accent2);}',
      '.qnav-panel a .qnav-label{color:var(--link);font-size:.78rem;font-weight:600;}',
      '.qnav-panel a .qnav-title{display:block;font-size:.9rem;}',
      '.qnav-panel a.qnav-current{background:var(--accent);}',
      '.qnav-panel a.qnav-current .qnav-label{color:var(--fg);}'
    ].join('');
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.className = 'qnav-fab';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '\u2630 Modules';

    var panel = document.createElement('div');
    panel.className = 'qnav-panel';
    panel.hidden = true;

    var items = MODULES.map(function (m, i) {
      var cur = i === idx ? ' qnav-current' : '';
      return '<li><a class="qnav-item' + cur + '" href="' + m.file + '">' +
        '<span class="qnav-label">' + esc(m.label) + '</span>' +
        '<span class="qnav-title">' + esc(m.title) + '</span></a></li>';
    }).join('');
    panel.innerHTML = '<div class="qnav-head"><span>Jump to module</span>' +
      '<button class="qnav-close" type="button" aria-label="Close menu">\u00d7</button></div>' +
      '<ol>' + items + '</ol>';

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    function setOpen(open) {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function () { setOpen(panel.hidden); });
    panel.querySelector('.qnav-close').addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
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
