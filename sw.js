// THOR LOTERIAS - Service Worker
const CACHE_NAME='thor-loterias-2026-09-13-corrige-tela-preta-90';
const CORE=['./','./index.html','./app-main.html','./analysis-neon.css','./fechamento-personalizado-luxo.css','./home-topo-thor.css','./home-update-fix.js','./filtros-auto.js','./manifest.json','./icon-192.png','./icon-512.png','./icon-512-maskable.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>Promise.all(CORE.map(u=>fetch(u,{cache:'no-store'}).then(r=>r&&r.ok?c.put(u,r.clone()):null).catch(()=>null)))));self.skipWaiting()});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const k=await caches.keys();await Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;e.respondWith(caches.match(r).then(c=>c||fetch(r,{cache:'no-store'}).then(x=>{if(x&&x.ok)caches.open(CACHE_NAME).then(k=>k.put(r,x.clone()));return x}))) });