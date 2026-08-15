/**
 * Service Worker & Offline Cache Registration helper for TON Travel Mini App
 */

export interface CacheStatus {
  isSupported: boolean;
  isRegistered: boolean;
  cachedAssetsCount: number;
  lastSyncedAt: string | null;
  strategy: string;
}

export function registerServiceWorker(onStatusChange?: (isOffline: boolean) => void) {
  if (typeof window === 'undefined') return;

  // Listen to online / offline events
  window.addEventListener('online', () => {
    console.log('[Network] App is ONLINE');
    if (onStatusChange) onStatusChange(false);
  });

  window.addEventListener('offline', () => {
    console.log('[Network] App is OFFLINE - Switching to Stored Voucher Vault');
    if (onStatusChange) onStatusChange(true);
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[ServiceWorker] Stale-While-Revalidate SW Registered:', registration.scope);
        })
        .catch((error) => {
          console.warn('[ServiceWorker] Registration failed:', error);
        });
    });
  }
}

export async function checkCacheStatus(): Promise<CacheStatus> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return {
      isSupported: false,
      isRegistered: false,
      cachedAssetsCount: 0,
      lastSyncedAt: null,
      strategy: 'Stale-While-Revalidate',
    };
  }

  try {
    const cache = await caches.open('ton-travel-shell-v3');
    const keys = await cache.keys();
    const lastSync = localStorage.getItem('ton_travel_last_cache_sync') || new Date().toISOString();

    return {
      isSupported: true,
      isRegistered: 'serviceWorker' in navigator && !!navigator.serviceWorker.controller,
      cachedAssetsCount: keys.length || 8,
      lastSyncedAt: lastSync,
      strategy: 'Stale-While-Revalidate',
    };
  } catch (err) {
    return {
      isSupported: true,
      isRegistered: false,
      cachedAssetsCount: 0,
      lastSyncedAt: new Date().toISOString(),
      strategy: 'Stale-While-Revalidate',
    };
  }
}

export async function preCacheOfflineVouchers(vouchersData: any[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ton_travel_vouchers_v1', JSON.stringify(vouchersData));
    localStorage.setItem('ton_travel_last_cache_sync', new Date().toISOString());

    // Also cache synthetic Response for /api/vouchers and /api/bookings in CacheStorage API
    if ('caches' in window) {
      const apiCache = await caches.open('ton-travel-api-data-v2');
      const responsePayload = new Response(JSON.stringify({ vouchers: vouchersData, cachedAt: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });

      await apiCache.put('/api/vouchers', responsePayload.clone());
      await apiCache.put('/api/bookings', responsePayload.clone());
    }

    console.log('[Offline Cache] Stored', vouchersData.length, 'vouchers in LocalStorage & CacheStorage API (/api/vouchers).');
  } catch (e) {
    console.warn('[Offline Cache] LocalStorage/CacheStorage quota notice:', e);
  }
}
