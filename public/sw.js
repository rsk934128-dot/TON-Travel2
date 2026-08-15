// Service Worker for TON Travel Mini App - Offline Voucher Vault, Stale-While-Revalidate & API Response Caching

const CACHE_NAME = 'ton-travel-shell-v2';
const API_CACHE_NAME = 'ton-travel-api-data-v2';

const CORE_UI_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo.jpg'
];

// Install event: Pre-cache core UI app shell assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing TON Travel Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching core UI app shell assets...');
      return cache.addAll(CORE_UI_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Asset pre-cache partial warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating Service Worker & purging stale caches...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== API_CACHE_NAME) {
            console.log('[ServiceWorker] Deleting outdated cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/**
 * Helper: Network-First Strategy with Cache Fallback for API endpoints (Bookings, Vouchers, Hotels)
 */
async function networkFirstApiHandler(request) {
  const cache = await caches.open(API_CACHE_NAME);

  try {
    // Try network first to get real-time on-chain bookings & vouchers
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      // Clone and cache the fresh API response
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[ServiceWorker] Network offline. Intercepting API GET request for:', request.url);

    // 1. Look for exact match in API CacheStorage
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 2. Look for pathname fallback match (/api/vouchers or /api/bookings)
    const url = new URL(request.url);
    const fallbackPathResponse = await cache.match(url.pathname);
    if (fallbackPathResponse) {
      return fallbackPathResponse;
    }

    // 3. Look for generic '/api/vouchers' fallback
    const genericVouchersResponse = await cache.match('/api/vouchers');
    if (genericVouchersResponse) {
      return genericVouchersResponse;
    }

    // 4. Default JSON fallback response if cache is empty
    return new Response(
      JSON.stringify({
        offline: true,
        cachedAt: new Date().toISOString(),
        vouchers: [],
        message: 'Offline Mode Active. Serving cached local vouchers.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Helper: Stale-While-Revalidate Strategy for UI shell & static assets
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((err) => {
      console.log('[ServiceWorker] Background revalidation offline fallback for:', request.url);
      return cachedResponse;
    });

  return cachedResponse || fetchPromise;
}

// Fetch event listener
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Explicitly handle API endpoints for bookings, vouchers, and hotels (Network-First with Cache Fallback)
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/bookings') ||
    url.pathname.includes('/vouchers') ||
    url.pathname.includes('/hotels')
  ) {
    event.respondWith(networkFirstApiHandler(event.request));
    return;
  }

  // 2. Handle Navigation (HTML), JS/CSS bundles, static assets & images (Stale-While-Revalidate)
  if (
    event.request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchAndRevalidate = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
            return networkResponse;
          })
          .catch(() => {
            if (cachedResponse) return cachedResponse;
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html') || caches.match('/');
            }
          });

        if (cachedResponse) {
          fetchAndRevalidate;
          return cachedResponse;
        }

        return fetchAndRevalidate;
      })
    );
    return;
  }

  // 3. Fallback for all other GET requests
  event.respondWith(staleWhileRevalidate(event.request));
});
