// Service Worker — offline-first caching for all courses.
// Our own files: network-first, fall back to cache.
// CDN resources (KaTeX): cache-first (version-pinned, never change).

const CACHE = 'math-v2';

const PRECACHE = [
  'index.html',
  'css/style.css',
  'js/nav-core.js',
  'js/math-render.js',
  'js/canvas3d.js',
  'js/plot2d.js',
  'js/interactive.js',
  // Elliptic course
  'elliptic/index.html',
  'elliptic/js/nav.js',
  'elliptic/module1.html',
  'elliptic/module2.html',
  'elliptic/module3.html',
  'elliptic/module4.html',
  'elliptic/module-4.1-dashboard.html',
  'elliptic/module5.html',
  'elliptic/module6.html',
  'elliptic/module7.html',
  'elliptic/module8.html',
  // Riemann course
  'riemann/index.html',
  'riemann/js/nav.js',
  'riemann/js/zeta-utils.js',
  'riemann/module1.html',
  'riemann/module2.html',
  'riemann/module3.html',
  'riemann/module4.html',
  'riemann/module5.html',
  'riemann/module6.html',
  // Galois course
  'galois/index.html',
  'galois/js/nav.js',
  'galois/module1.html',
  'galois/module2.html',
  'galois/module3.html',
  'galois/module4.html',
  'galois/module5.html',
  'galois/module6.html',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  var isCDN = e.request.url.indexOf('cdn.jsdelivr.net') !== -1;

  e.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(e.request).then(function (cached) {
        // Cache-first for versioned CDN assets — they never change.
        if (cached && isCDN) return cached;

        return fetch(e.request).then(function (response) {
          if (response.ok) cache.put(e.request, response.clone());
          return response;
        }).catch(function () {
          return cached;
        });
      });
    })
  );
});
