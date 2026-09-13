// THOR LOTERIAS - Service Worker
const CACHE_NAME='thor-loterias-2026-09-13-restaura-0540-1';
const CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-512-maskable.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>Promise.all(CORE.map(u=>fetch(u,{cache:'no-store'}).then(r=>r&&r.ok?c.put(u,r.clone()):null).catch(()=>null)))));self.skipWaiting()});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const k=await caches.keys();await Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r&&r.ok){const x=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,x)).catch(()=>{})}return r}).catch(()=>caches.match(e.request))) });