
const CACHE_NAME = `homepalate-cache-v1`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Caching the root, manifest, and key assets.
    // The browser will cache other assets like CSS/JS automatically
    // as they are requested if they have appropriate cache headers.
    // Here we focus on the core shell needed for offline startup.
    cache.addAll([
      '/',
      '/install',
      '/welcome',
      '/manifest.webmanifest',
      '/icons/icon.svg'
    ]);
  })());
});

// A cache-first strategy
self.addEventListener('fetch', event => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Get the resource from the cache.
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        try {
          // If the resource was not in the cache, try the network.
          const fetchResponse = await fetch(event.request);

          // We don't cache everything. We only cache same-origin responses.
          // This avoids caching opaque responses from CDNs, etc.
          if (fetchResponse.status === 200 && new URL(event.request.url).origin === self.origin) {
             // Save the resource in the cache and return it.
             cache.put(event.request, fetchResponse.clone());
          }
         
          return fetchResponse;
        } catch (e) {
          // The network failed.
          // For navigation requests, you might want to return a custom offline page.
          if (event.request.mode === 'navigate') {
            return caches.match('/install'); // Or a dedicated offline.html page
          }
          // For other requests, just fail.
          return new Response(null, { status: 404 });
        }
    }
  })());
});
