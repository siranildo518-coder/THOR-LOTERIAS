// THOR LOTERIAS - Service Worker
// Atualizacao automatica + design neon da tela de selecao e da calculadora.
const CACHE_NAME = 'thor-loterias-2026-09-12-design-neon-02';
const SELECTION_DESIGN_URL = './selection-design.css?v=20260912-design-neon-02';
const PROBABILITY_DESIGN_URL = './probability-design.css?v=20260912-prob-neon-01';

const CACHE_FILES = [
  './index.html',
  './THOR-LOTERIAS.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './selection-design.css',
  './probability-design.css'
];

function aplicarDesignNoHtml(response){
  if(!response) return Promise.resolve(response);
  const tipo = response.headers.get('content-type') || '';
  if(!tipo.includes('text/html')) return Promise.resolve(response);

  return response.clone().text().then((html)=>{
    if(!html) return response;

    const links = [];
    if(!html.includes('selection-design.css')){
      links.push(`<link rel="stylesheet" href="${SELECTION_DESIGN_URL}">`);
    }
    if(!html.includes('probability-design.css')){
      links.push(`<link rel="stylesheet" href="${PROBABILITY_DESIGN_URL}">`);
    }
    if(!links.length) return response;

    const bloco = links.join('\n');
    const alterado = html.includes('</head>')
      ? html.replace('</head>', `${bloco}\n</head>`)
      : `${bloco}\n${html}`;

    const headers = new Headers(response.headers);
    headers.set('content-type','text/html; charset=utf-8');
    headers.delete('content-length');
    return new Response(alterado, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }).catch(()=>response);
}

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
        .then(async (res) => {
          if (!res || !res.ok) throw new Error('Resposta invalida');
          const comDesign = await aplicarDesignNoHtml(res);
          const copia = comDesign.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copia));
          return comDesign;
        })
        .catch(async () => {
          const fallback = (await caches.match(req)) || (await caches.match('./index.html')) || (await caches.match('./THOR-LOTERIAS.html'));
          return aplicarDesignNoHtml(fallback);
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
