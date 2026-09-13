// THOR LOTERIAS - Service Worker
// Versão sincronizada com index.html: nome e cores da loteria selecionada agora mudam dinamicamente na tela inicial.
const CACHE_NAME = 'thor-loterias-2026-09-12-home-loteria-dinamica-01';
const CORE = [
  './',
  './index.html',
  './app-main.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install',(event)=>{
  event.waitUntil(caches.open(CACHE_NAME).then((cache)=>Promise.all(CORE.map((url)=>fetch(url,{cache:'no-store'}).then((res)=>res&&res.ok?cache.put(url,res.clone()):null).catch(()=>null)))));
  self.skipWaiting();
});

self.addEventListener('message',(event)=>{
  if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('activate',(event)=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter((k)=>k!==CACHE_NAME).map((k)=>caches.delete(k)));
    await self.clients.claim();
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    await Promise.all(windows.map((client)=>{try{return client.navigate(client.url)}catch(e){return Promise.resolve()}}));
  })());
});

self.addEventListener('fetch',(event)=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url),accept=req.headers.get('accept')||'';
  const isHtml=req.mode==='navigate'||accept.includes('text/html')||/\/(index|app-main)\.html$/.test(url.pathname)||url.pathname.endsWith('/');
  if(isHtml){
    event.respondWith(fetch(req,{cache:'no-store'}).then((res)=>{
      if(!res||!res.ok)throw new Error('network');
      const copy=res.clone();
      caches.open(CACHE_NAME).then((cache)=>cache.put(req,copy));
      return res;
    }).catch(async()=>(await caches.match(req))||(await caches.match('./index.html'))||(await caches.match('./app-main.html'))));
    return;
  }
  event.respondWith(fetch(req,{cache:'no-store'}).then((res)=>{
    if(res&&res.ok){const copy=res.clone();caches.open(CACHE_NAME).then((cache)=>cache.put(req,copy))}
    return res;
  }).catch(()=>caches.match(req)));
});
