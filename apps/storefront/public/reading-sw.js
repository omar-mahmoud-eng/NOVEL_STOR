const CACHE = "storyverse-reading-v1";
self.addEventListener("install", event => { self.skipWaiting(); });
self.addEventListener("activate", event => { event.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  // Cache only explicitly downloaded reader documents and static application assets.
  // RSC responses must never replace cached HTML navigation responses.
  if (request.headers.get("RSC") === "1") return;
  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: request.mode === "navigate" });
    try { return await fetch(request); }
    catch (error) { if (cached) return cached; throw error; }
  })());
});
