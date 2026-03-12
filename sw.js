// Vault PWA — Service Worker v3
// Strategy:
//   Static assets (HTML, icons, manifest): cache-first with version bump on update
//   Google APIs: network-only (never cache auth tokens or drive data)
//   Everything else: network-first with cache fallback

const VERSION = 'v3';
const CACHE   = 'vault-' + VERSION;
const STATIC  = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// ── INSTALL: pre-cache static assets ──────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(STATIC))
      .then(() => self.skipWaiting())  // activate immediately
  );
});

// ── ACTIVATE: delete old caches ───────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith('vault-') && k !== CACHE)
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())  // take control of open tabs
  );
});

// ── FETCH ─────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Google APIs — always network only, never cache
  if (url.hostname.includes('googleapis.com') ||
      url.hostname.includes('accounts.google.com') ||
      url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    return; // let browser handle it normally
  }

  // 2. Static assets — cache-first
  if (STATIC.some(s => event.request.url.endsWith(s.replace('./', '/')))) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(resp => {
          if (resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE).then(c => c.put(event.request, clone));
          }
          return resp;
        });
      })
    );
    return;
  }

  // 3. Everything else — network-first with cache fallback (offline support)
  event.respondWith(
    fetch(event.request)
      .then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(event.request, clone));
        }
        return resp;
      })
      .catch(() => caches.match(event.request))
  );
});

// ── UPDATE NOTIFICATION ───────────────────────────────────────
// Tell clients a new SW is waiting so they can prompt user to refresh
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
