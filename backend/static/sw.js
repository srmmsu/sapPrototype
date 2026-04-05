const CACHE = "sap-shell-v10";
// Toggle debug here (true/false)
const DEBUG = true;

// Send messages to all clients (React app)
function sendMessageToClients(message) {
  if (!DEBUG) return;

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}

self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll([
          "/",
          "/index.html"
        ]);
    })
  );

  self.skipWaiting();
});


self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {

  const req = event.request;

  // ❌ Skip API + manifest
  if (
    req.url.includes("/api/") ||
    req.url.includes("manifest.json")
  ) {
    return;
  }

  // ✅ Navigation requests (CRITICAL FIX)
    if (req.mode === "navigate") {

      event.respondWith((async () => {

        try {
          const networkRes = await fetch(req);
          sendMessageToClients("NAV NETWORK: " + req.url);
          return networkRes;

        } catch (err) {

          sendMessageToClients("NAV CACHE (forced): " + req.url);

          // 🔴 CRITICAL: force app shell fallback
          const cache = await caches.open(CACHE);

          const cached = await cache.match("/index.html");

          if (cached) return cached;

          // fallback safeguard
          return new Response(
            "<h1>Offline - No Cache</h1>",
            { headers: { "Content-Type": "text/html" } }
          );
        }

      })());

      return;
    }
  // ✅ Static assets (UNCHANGED logic)
  event.respondWith(
    caches.match(req).then(res => {

      if (res) {
        sendMessageToClients("CACHE: " + req.url);
        return res;
      }

      return fetch(req).then(networkRes => {

        sendMessageToClients("NETWORK: " + req.url);

        return caches.open(CACHE).then(cache => {
          cache.put(req, networkRes.clone());
          return networkRes;
        });

      }).catch(() => {
        // optional: you can add fallback here if needed
      });

    })
  );

});
