'use strict';

var CACHE_NAME = 'corebiq-gstr1-local-v2';
var CACHE_PREFIX = 'corebiq-gstr1-local-';
var APP_ASSETS = [
    './',
    './local-tool.html',
    './manifest.webmanifest',
    './uiassets/css/local-tool.css',
    './uiassets/js/local-tool-model.js',
    './uiassets/js/local-tool.js',
    './images/gstr1-icon.svg'
];

self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(APP_ASSETS);
    }));
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(caches.keys().then(function (names) {
        return Promise.all(names.map(function (name) {
            if (name.indexOf(CACHE_PREFIX) === 0 && name !== CACHE_NAME) {
                return caches.delete(name);
            }
        }));
    }));
    self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    var request = event.request;
    var url = new URL(request.url);
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }
    event.respondWith(caches.match(request).then(function (cached) {
        return cached || fetch(request);
    }));
});
