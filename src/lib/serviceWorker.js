// Service Worker for TON Travel Mini App - Stale-While-Revalidate UI Shell & API Cache
// File: src/lib/serviceWorker.js

const CACHE_NAME = 'ton-travel-shell-v3';
const API_CACHE_NAME = 'ton-travel-api-data-v3';

const CORE_UI_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo.jpg'
];

// Install event: Pre-cache core UI app shell assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker src/lib] Installing TON Travel Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker src/lib] Pre-caching core UI app shell assets...');
      return cache.addAll(CORE_UI_ASSETS).catch((err) => {
        console.warn('[ServiceWorker src/lib] Asset pre-cache partial notice:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker src/lib] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== API_CACHE_NAME) {
            console.log('[ServiceWorker src/lib] Deleting legacy cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/**
 * Helper: Network-First strategy with CacheStorage fallback for booking and voucher API endpoints
 */
async function networkFirstApiHandler(request) {
  const cache = await caches.open(API_CACHE_NAME);

  try {
    // 1. Try fetching fresh data over the network first
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      // Cache fresh API response asynchronously
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[ServiceWorker src/lib] Network offline. Serving cached API response for:', request.url);

    // 2. Search exact match in API CacheStorage
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 3. Fallback to /api/vouchers or /api/bookings fallback in CacheStorage
    const url = new URL(request.url);
    const fallbackPathResponse = await cache.match(url.pathname);
    if (fallbackPathResponse) {
      return fallbackPathResponse;
    }

    const genericVouchersResponse = await cache.match('/api/vouchers');
    if (genericVouchersResponse) {
      return genericVouchersResponse;
    }

    // 4. Default JSON payload if offline and no cache entry exists
    return new Response(
      JSON.stringify({
        offline: true,
        vouchers: [],
        cachedAt: new Date().toISOString(),
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
 * Helper: Stale-While-Revalidate strategy for core UI assets
 */
async function staleWhileRevalidateUI(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // Background fetch to revalidate
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch((err) => {
      console.log('[ServiceWorker src/lib] Background revalidation offline fallback for:', request.url);
      return cachedResponse;
    });

  // Return cached version immediately for instant load, while revalidating in background
  return cachedResponse || fetchPromise;
}

// Fetch event listener: Intercept requests and apply caching strategies
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Intercept & cache GET requests for booking and voucher API endpoints
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/bookings') ||
    url.pathname.includes('/vouchers') ||
    url.pathname.includes('/hotels')
  ) {
    event.respondWith(networkFirstApiHandler(event.request));
    return;
  }

  // 2. Apply Stale-While-Revalidate strategy for core UI assets & navigation
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
  event.respondWith(staleWhileRevalidateUI(event.request));
});
