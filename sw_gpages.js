// Here the best practce is to find a way to dinamically change this name based on files content
var staticCacheName = ('rest' + Date.now());

self.addEventListener('install', (event) => {

  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll([
        'Restaurants-Review/index.html',
        'Restaurants-Review/css/main.css',
        'Restaurants-Review/js/dbhelper.js',
        'Restaurants-Review/js/main.js',
        'Restaurants-Review/js/restaurant_info.js',
        'Restaurants-Review/data/restaurants.json',
        'Restaurants-Review/img/1.jpg',
        'Restaurants-Review/img/2.jpg',
        'Restaurants-Review/img/3.jpg',
        'Restaurants-Review/img/4.jpg',
        'Restaurants-Review/img/5.jpg',
        'Restaurants-Review/img/6.jpg',
        'Restaurants-Review/img/7.jpg',
        'Restaurants-Review/img/8.jpg',
        'Restaurants-Review/img/9.jpg',
        'Restaurants-Review/img/10.jpg'
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
  // respond to requests for the root page with
  // the page skeleton from the cache
  

  //
  //
  // Study this further
  let requestUrl = new URL(event.request.url)

  if(requestUrl.origin === location.origin) {
    if(requestUrl.pathname === '/') {
      event.respondWith(caches.match('index.html'))
      return
    }
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});