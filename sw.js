// THOR LOTERIAS - Service Worker
// Atualizacao automatica: ao detectar um novo sw.js, ele assume imediatamente
// e o HTML principal sempre tenta a rede primeiro para buscar a versao mais nova.
const CACHE_NAME = 'thor-loterias-2026-09-11-2221';

const CACHE_FILES = [
  './index.html',
  './THOR-LOTERIAS.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        CACHE_FILES.map((url) =>
          fetch(url, { cache: 'no-store' })
            .then((res) => {
              if (!res || !res.ok) throw new Error('Falha ao buscar ' + url);
              return cache.put(url, res.clone());
            })
            .catch((err) => console.error('Falha ao pre-cachear', url, err))
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const aceita = req.headers.get('accept') || '';

  if (req.mode === 'navigate' || aceita.includes('text/html')) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          if (!res || !res.ok) throw new Error('Resposta invalida');
          const copia = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copia));
          return res;
        })
        .catch(async () => {
          return (await caches.match(req)) || (await caches.match('./index.html')) || (await caches.match('./THOR-LOTERIAS.html'));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (req.method === 'GET' && res && res.ok) {
          const copia = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copia));
        }
        return res;
      });
    })
  );
});
