// Mude esse número TODA VEZ que você atualizar o index.html e subir pro GitHub.
// É essa mudança que faz o navegador do cliente perceber que existe versão nova.
const CACHE_NAME = 'thor-loterias-v2';

const CACHE_FILES = [
  './index.html',
  './manifest.json',
  './icone-192.png',
  './icone-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CACHE_FILES))
      .catch((err) => console.error('Falha ao pré-cachear arquivos:', err))
  );
  // não chama skipWaiting aqui de propósito: o novo SW fica "esperando"
  // até o usuário tocar em ATUALIZAR no banner do app.
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Para o HTML principal: tenta a rede primeiro (pega a versão mais nova),
  // só usa o cache se estiver offline.
  const aceita = req.headers.get('accept') || '';
  if (req.mode === 'navigate' || aceita.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copia));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Para os demais arquivos (ícones, manifest): cache primeiro, com fallback pra rede.
  event.respondWith(
    caches.match(req).then((res) => res || fetch(req))
  );
});

