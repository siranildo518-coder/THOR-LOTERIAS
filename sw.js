// THOR LOTERIAS - Service Worker
// Atualização automática + design da tela de seleção e da Calculadora de Probabilidade.
const CACHE_NAME = 'thor-loterias-2026-09-12-prob-ref-03';
const SELECTION_DESIGN_URL = './selection-design.css?v=20260912-design-neon-02';
const PROBABILITY_DESIGN_URL = './probability-design.css?v=20260912-prob-ref-03';
const PROBABILITY_SCRIPT_MARKER = 'thor-prob-ref-03';

const CACHE_FILES = [
  './index.html',
  './THOR-LOTERIAS.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './selection-design.css',
  './probability-design.css'
];

function scriptDesignProbabilidade(){
  return `<script id="${PROBABILITY_SCRIPT_MARKER}">
(function(){
  function aprimorarCalculadoraProbabilidade(){
    var overlay = document.getElementById('overlayProb');
    if(!overlay || overlay.dataset.thorProbDesign === 'ref03') return;
    var modal = overlay.querySelector('.modal');
    if(!modal) return;
    overlay.dataset.thorProbDesign = 'ref03';
    modal.classList.add('prob-premium-modal');

    var cabecalho = modal.querySelector('.modal-head');
    if(cabecalho){
      cabecalho.className = 'modal-head prob-hero';
      cabecalho.innerHTML = '<span class="prob-title-line">CALCULADORA DE</span>'+
        '<span class="prob-title-highlight">PROBABILIDADE</span>'+
        '<span class="prob-subtitle">DESCUBRA A CHANCE EXATA DE ACERTO<br>NA LOTOFÁCIL OU QUALQUER OUTRA LOTERIA NUMÉRICA</span>';
    }

    var info = modal.querySelector('.modal-info');
    if(info){
      var textoInfo = info.textContent.trim();
      info.className = 'modal-info prob-info-box';
      info.innerHTML = '<span class="prob-info-icon">i</span><span class="prob-info-text">'+textoInfo+'</span>';
    }

    var campos = [
      ['probN','blue','⠿','Ex.: 25 (Lotofácil)'],
      ['probEscolhe','green','☝','Ex.: 15'],
      ['probSorteados','orange','★','Ex.: 15'],
      ['probAcertar','red','◎','Ex.: 15'],
      ['probCartelas','purple','▣','Ex.: 1']
    ];
    campos.forEach(function(cfg){
      var input = document.getElementById(cfg[0]);
      if(!input) return;
      var card = input.closest('.modal-card');
      if(!card || card.classList.contains('prob-field-card')) return;
      card.classList.add('prob-field-card');
      var label = card.querySelector('label');
      var icone = document.createElement('span');
      icone.className = 'prob-field-icon '+cfg[1];
      icone.textContent = cfg[2];
      var copy = document.createElement('span');
      copy.className = 'prob-field-copy';
      if(label) copy.appendChild(label);
      var exemplo = document.createElement('small');
      exemplo.textContent = cfg[3];
      copy.appendChild(exemplo);
      card.insertBefore(icone, card.firstChild);
      card.insertBefore(copy, input);
    });

    var actions = modal.querySelector('.modal-actions');
    var fechar = document.getElementById('probFechar');
    var calcular = document.getElementById('probCalcular');
    if(fechar){
      fechar.className = 'btn-cancel prob-close-x';
      fechar.textContent = '×';
      fechar.setAttribute('aria-label','Fechar calculadora');
      modal.insertBefore(fechar, modal.firstChild);
    }
    if(actions && calcular){
      actions.className = 'modal-actions prob-actions';
      calcular.className = 'btn-confirm btn-3d prob-main-action';
      calcular.innerHTML = '🧮&nbsp;&nbsp; CALCULAR PROBABILIDADE';
      actions.innerHTML = '';
      actions.appendChild(calcular);

      var secundarias = document.createElement('div');
      secundarias.className = 'prob-secondary-actions';
      secundarias.innerHTML = '<button type="button" class="prob-clear" id="probLimparVisual">🧹 &nbsp; LIMPAR CAMPOS</button>'+
        '<button type="button" class="prob-copy" id="probCopiarVisual">📋 &nbsp; COPIAR RESULTADO</button>';
      actions.appendChild(secundarias);
    }

    var resultado = document.getElementById('probResultado');
    var resultWrap = null;
    var placeholder = null;
    if(resultado && !resultado.closest('.prob-result-card')){
      resultWrap = document.createElement('div');
      resultWrap.className = 'prob-result-card';
      var head = document.createElement('div');
      head.className = 'prob-result-head';
      head.innerHTML = '▥ &nbsp; RESULTADO DA PROBABILIDADE';
      placeholder = document.createElement('div');
      placeholder.className = 'prob-result-placeholder';
      placeholder.innerHTML = 'Preencha os campos acima e clique em<br>Calcular para ver o resultado.';
      var paiResultado = resultado.parentNode;
      paiResultado.insertBefore(resultWrap, resultado);
      resultWrap.appendChild(head);
      resultWrap.appendChild(placeholder);
      resultWrap.appendChild(resultado);
      resultado.style.display = 'none';
    }else if(resultado){
      resultWrap = resultado.closest('.prob-result-card');
      placeholder = resultWrap ? resultWrap.querySelector('.prob-result-placeholder') : null;
    }

    function sincronizarResultado(){
      if(!resultado || !placeholder) return;
      var temResultado = resultado.style.display !== 'none' && resultado.textContent.trim().length > 0;
      placeholder.style.display = temResultado ? 'none' : 'flex';
    }
    if(resultado){
      new MutationObserver(sincronizarResultado).observe(resultado,{attributes:true,attributeFilter:['style'],childList:true,subtree:true,characterData:true});
      sincronizarResultado();
    }

    var limpar = document.getElementById('probLimparVisual');
    if(limpar){
      limpar.addEventListener('click',function(){
        var valores = {probN:25,probEscolhe:15,probSorteados:15,probAcertar:15,probCartelas:1};
        Object.keys(valores).forEach(function(id){var el=document.getElementById(id);if(el) el.value=valores[id];});
        var warn = document.getElementById('probWarn');
        if(warn){warn.style.display='none';warn.innerHTML='';}
        if(resultado){resultado.innerHTML='';resultado.style.display='none';}
        sincronizarResultado();
      });
    }

    var copiar = document.getElementById('probCopiarVisual');
    if(copiar){
      copiar.addEventListener('click',function(){
        var texto = resultado && resultado.textContent.trim();
        if(!texto){
          copiar.textContent='📋  SEM RESULTADO';
          setTimeout(function(){copiar.innerHTML='📋 &nbsp; COPIAR RESULTADO';},1200);
          return;
        }
        function ok(){copiar.textContent='✓  RESULTADO COPIADO';setTimeout(function(){copiar.innerHTML='📋 &nbsp; COPIAR RESULTADO';},1400);}
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(texto).then(ok).catch(function(){});
        }else{
          var ta=document.createElement('textarea');ta.value=texto;document.body.appendChild(ta);ta.select();
          try{document.execCommand('copy');ok();}catch(e){} ta.remove();
        }
      });
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',aprimorarCalculadoraProbabilidade,{once:true});
  }else{
    aprimorarCalculadoraProbabilidade();
  }
})();
</script>`;
}

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
    if(links.length){
      const bloco = links.join('\n');
      html = html.includes('</head>')
        ? html.replace('</head>', `${bloco}\n</head>`)
        : `${bloco}\n${html}`;
    }

    if(!html.includes(PROBABILITY_SCRIPT_MARKER)){
      const script = scriptDesignProbabilidade();
      html = html.includes('</body>')
        ? html.replace('</body>', `${script}\n</body>`)
        : `${html}\n${script}`;
    }

    const headers = new Headers(response.headers);
    headers.set('content-type','text/html; charset=utf-8');
    headers.delete('content-length');
    return new Response(html, {
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
      return fetch(req, { cache: 'no-store' }).then((res) => {
        if (req.method === 'GET' && res && res.ok) {
          const copia = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copia));
        }
        return res;
      });
    })
  );
});
