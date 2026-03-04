// Service Worker — offline-first caching for Elliptic Curves course.
// Our own files: network-first, fall back to cache.
// CDN resources (KaTeX): cache-first (they are version-pinned, never change).

const CACHE = 'elliptic-v1';

const PRECACHE = [
  'index.html',
  'module1.html',
  'module2.html',
  'module3.html',
  'module4.html',
  'module-4.1-dashboard.html',
  'module5.html',
  'module6.html',
  'css/style.css',
  'js/nav.js',
  'js/math-render.js',
  'js/canvas3d.js',
  'js/plot2d.js',
  'js/interactive.js',
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
