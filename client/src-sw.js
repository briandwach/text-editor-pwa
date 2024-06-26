const { warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

// Define a CacheFirst strategy for static assets
const staticAssetsCache = new CacheFirst({
  cacheName: 'static-assets-cache',
  plugins: [
    // Ensure responses are cacheable (status codes 0 and 200)
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    // Set an expiration time for cached assets (e.g., 30 days)
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

registerRoute(
  // Matches all requests for static assets (e.g., JS, CSS, images)
  ({ request }) => request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'manifest' ||
    request.url.includes('.json'),
  // Use the staticAssetsCache strategy for caching
  staticAssetsCache
);
