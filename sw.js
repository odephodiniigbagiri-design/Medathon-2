// Medathon offline cache. Bump CACHE when you want old files cleared.
const CACHE='medathon-v23',FILES=['./','index.html','manifest.webmanifest','logo.webp','eghuan.webp','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Cache first (instant + works offline), refresh in the background so updates arrive next visit.
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET'||new URL(r.url).origin!=location.origin)return;
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
  const net=fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res}).catch(()=>hit||(r.mode=='navigate'?caches.match('index.html'):undefined));
  return hit||net}))});
