//Auto change cache name to avoid conflicts
var staticCacheName = ('rest' + Date.now());

self.addEventListener('install', (event) => {
  event.waitUntil(
    //open up a new cache and store the important parts    
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll([
        '/',
        'index.html',
        'css/main.css',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
        'data/restaurants.json',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'img/10.jpg'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    //get all the caches names, filter the ones we need except the last and then delete them
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('rest') &&
            cacheName != staticCacheName;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  let requestUrl = new URL(event.request.url)

  //Will serve the cached index if an offline request to the root is made
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/Restaurants-Reviews/') {
      event.respondWith(caches.match('index.html'))
      return
    }
  }
  //To all the rest, check if the item is in cache, and if not, just allow the original request
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});