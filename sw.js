/* Noor Islam — Service Worker */
const CACHE = "noor-islam-v1";
const CORE_ASSETS = [
  "index.html","quran.html","prayer-times.html","hadith.html","library.html",
  "videos.html","tools.html","quiz.html","community.html","donate.html","contact.html",
  "offline.html","css/style.css","js/main.js",
  "data/surahs.js","data/names.js","data/hadiths.js","data/content.js"
];

self.addEventListener("install", (e)=>{
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE_ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e)=>{
  if(e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(networkRes => {
        if(networkRes && networkRes.ok && e.request.url.startsWith(self.location.origin)){
          const clone = networkRes.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return networkRes;
      }).catch(() => cached || caches.match("offline.html"));
      return cached || fetchPromise;
    })
  );
});
