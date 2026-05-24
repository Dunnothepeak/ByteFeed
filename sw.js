// Simple service worker to pass PWA installable criteria
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Let the browser do its default thing
  // For offline support, cache strategies would go here
});
