const CACHE="cm-filings-v1";const ASSETS=["./","./index.html","./css/cm-filings.css","./js/app.js","./assets/logo.svg","./manifest.json"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));