// Esse número é gerado automaticamente (data + hora) toda vez que o Claude
// entrega uma atualização do index.html. Não precisa mudar isso na mão:
// é essa mudança que faz o navegador do cliente perceber a versão nova.
const CACHE_NAME = 'thor-loterias-2026-09-07-1808';

const CACHE_FILES = [
  './index.html',
  './manifest.json',
  './icone-192.png',
  './icone-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        CACHE_FILES.map((url) =>
          fetch(url, { cache: 'no-store' })
            .then((res) => cache.put(url, res))
            .catch((err) => console.error('Falha ao pré-cachear', url, err))
        )
      )
    )
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

  // Para o HTML principal: tenta a rede primeiro, ignorando o cache HTTP do
  // navegador (senão ele pode devolver uma cópia antiga salva localmente
  // em vez de buscar o arquivo novo de verdade). Só usa o cache do app
  // se estiver offline.
  const aceita = req.headers.get('accept') || '';
  if (req.mode === 'navigate' || aceita.includes('text/html')) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
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
