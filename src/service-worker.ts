import { build, files, version } from "$service-worker";

const worker = self as unknown as ServiceWorkerGlobalScope;
const STATIC_CACHE_NAME = `cache${version}`;
const APP_CACHE_NAME = `offline${version}`;

// Pre-defined list of routes and external assets for caching
const routes = ["/"];
const customAssets = [
  
];

// Adding domain to internal assets for clear differentiation
const addDomain = (assets: string[]) => assets.map((f) => self.location.origin + f);
const ourAssets = addDomain([
  ...files.filter((f) => !/\/icons\/(apple.*?|original.png)/.test(f)),
  ...build,
  ...routes,
]);

const toCache = [...ourAssets, ...customAssets];
const staticAssets = new Set(toCache);

// Installation of Service Worker: caching assets
worker.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => cache.addAll(toCache)).then(() => worker.skipWaiting())
  );
});

// Activating Service Worker: cleaning up old caches
worker.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== STATIC_CACHE_NAME && key !== APP_CACHE_NAME) {
          return caches.delete(key);
        }
      })
    )).then(() => worker.clients.claim())
  );
});

// Fetching and caching logic for both internal and external assets
async function fetchAndCache(request: Request) {
  const cache = await caches.open(APP_CACHE_NAME);
  try {
    const response = await fetch(request);
    if (!response || response.status !== 200 || response.type !== 'basic') return response;
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    const response = await cache.match(request);
    if (response) return response;
    throw err;
  }
}

// Intercept fetch requests
worker.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.headers.has("range")) return;

  const url = new URL(event.request.url);
  const isHttp = url.protocol.startsWith("http");
  const isDevServerRequest = url.hostname === self.location.hostname && url.port !== self.location.port;
  const isStaticAsset = staticAssets.has(url.href);
  const skipBecauseUncached = event.request.cache === "only-if-cached" && !isStaticAsset;

  if (isHttp && !isDevServerRequest && !skipBecauseUncached) {
    event.respondWith(
      caches.match(event.request).then((response) => response || fetchAndCache(event.request))
    );
  }
});