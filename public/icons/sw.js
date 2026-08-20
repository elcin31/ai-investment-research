const CACHE_NAME = "invest-platform-shell-v1";
const SHELL_ASSETS = ["/", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

// Network-first for navigation requests, falling back to cached shell when
// offline. We deliberately do NOT cache API/data responses here — this app
// deals in market data and portfolio figures, and silently serving stale
// numbers offline would be actively misleading. Offline just means the
// shell loads; live data still requires a connection.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.mode !== "navigate") return;

  event.respondWith(
    fetch(request).catch(() => caches.match("/").then((res) => res || caches.match(request)))
  );
});
