// Here the best practce is to find a way to dinamically change this name based on files content
var staticCacheName = ('restreviews' + Date.now());

const cacheAssets = [
  "./index.html",
  "./restaurant.html",
  "./css/main.css",
  "./js/dbhelper.js",
  "./js/main.js",
  "./js/restaurant_info.js",
  'https://fonts.googleapis.com/css?family=Poppins',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  "https://reinaldooo.github.io/Restaurant-Review/data/restaurants.json"
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(cacheAssets);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    //get all the caches names, filter the ones we need except the last and then delete them
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('rest') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Make copy/clone of response
        const resClone = res.clone();
        // Open cahce
        caches.open(staticCacheName).then(cache => {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});