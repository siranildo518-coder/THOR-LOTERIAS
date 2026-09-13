// THOR LOTERIAS - Service Worker
const CACHE_NAME='thor-loterias-2026-09-13-banner-real-62';
const CORE=['./','./index.html','./app-main.html','./analysis-neon.css','./fechamento-personalizado-luxo.css','./filtros-auto.js','./combinacoes-3d.css','./combinacoes-3d.js','./home-banner.css','./home-banner-real.css','./home-banner.jpg','./manifest.json','./icon-192.png','./icon-512.png','./icon-512-maskable.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>Promise.all(CORE.map(u=>fetch(u,{cache:'no-store'}).then(r=>r&&r.ok?c.put(u,r.clone()):null).catch(()=>null)))));self.skipWaiting()});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const k=await caches.keys();await Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r&&r.ok){const x=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,x)).catch(()=>{})}return r}).catch(()=>caches.match(e.request))) });