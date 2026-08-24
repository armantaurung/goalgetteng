/* GoalGetteng Service Worker v3 - Force clear all old caches */
const CACHE_NAME = 'goalgetteng-v3';

// On install: immediately take over
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// On activate: delete ALL old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

// Fetch: always go to network, never serve from cache
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request));
});
