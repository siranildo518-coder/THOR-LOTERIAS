(function(){
  'use strict';
  // Base 142 preservada. Consulta duas fontes publicas e usa o concurso mais novo.
  const RECHECK=60*1000;
  const jogos=[
    {code:'MEGA',slug:'megasena',free:'megasena',nome:'Mega-Sena'},
    {code:'LF',slug:'lotofacil',free:'lotofacil',nome:'Lotofácil'},
    {code:'QUINA',slug:'quina',free:'quina',nome:'Quina'},
    {code:'DIA',slug:'diadesorte',free:'diadesorte',nome:'Dia de Sorte'},
    {code:'LM',slug:'lotomania',free:'lotomania',nome:'Lotomania'},
    {code:'SS',slug:'supersete',free:'supersete',nome:'Super Sete'},
    {code:'TM',slug:'timemania',free:'timemania',nome:'Timemania'},
    {code:'DS',slug:'duplasena',free:'duplasena',nome:'Dupla Sena'}
  ];
  function numero(d){return Number(d&&(d.numero||d.concurso||d.numero_concurso)||0)}
  async function json(url){try{const r=await fetch(url,{cache:'no-store',headers:{'Cache-Control':'no-cache, no-store','Pragma':'no-cache'}});if(!r.ok)return null;return await r.json()}catch(_){return null}}
  function dezenas(d){
    if(!d)return [];
    let a=d.listaDezenas||d.dezenas||d.numeros||d.lista_dezenas||[];
    if(Array.isArray(a)&&a.length)return a.map(String);
    return [];
  }
  function dataResultado(d){return d&&(d.dataApuracao||d.data||d.data_sorteio||d.dataSorteio)||''}
  function cssResultado(){if(document.getElementById('thorJogosResultadoCss'))return;const s=document.createElement('style');s.id='thorJogosResultadoCss';s.textContent='#thorJogosResultado{margin:14px 10px;padding:14px 10px 16px;border:2px solid #ff8a00;border-radius:12px;background:linear-gradient(180deg,#f8fbff,#e7eef5);box-shadow:inset 0 2px 3px #fff,0 3px 8px rgba(0,0,0,.18);text-align:center;color:#102235}#thorJogosResultado h3{margin:0 0 5px;font-size:17px}#thorJogosResultado .jr-meta{font-size:12px;font-weight:700;margin-bottom:12px;color:#43576b}#thorJogosResultado .jr-bolas{display:flex;flex-wrap:wrap;justify-content:center;gap:7px}#thorJogosResultado .jr-bola{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#ffbd3c,#ef7800 58%,#9e3900);border:2px solid #fff;color:#fff;font-weight:900;font-size:13px;box-shadow:inset 0 2px 2px rgba(255,255,255,.55),0 2px 4px rgba(0,0,0,.35)}#thorJogosResultado .jr-status{padding:18px 5px;font-weight:700;color:#53677a}';document.head.appendChild(s)}
  function caixaResultado(){const c=document.getElementById('thorJogosConteudo');if(!c)return null;let box=document.getElementById('thorJogosResultado');if(!box){box=document.createElement('div');box.id='thorJogosResultado';c.appendChild(box)}return box}
  function renderResultado(slug,d,fonte){cssResultado();const g=jogos.find(x=>x.slug===slug);const box=caixaResultado();if(!g||!box)return;if(!d){box.innerHTML='<h3>Resultado Oficial - '+g.nome+'</h3><div class="jr-status">Carregando resultado atualizado...</div>';return}const ds=dezenas(d),n=numero(d),dt=dataResultado(d);let html='<h3>Resultado Oficial - '+g.nome+'</h3><div class="jr-meta">Concurso '+(n||'-')+(dt?' · '+dt:'')+'</div><div class="jr-bolas">';if(ds.length)html+=ds.map(x=>'<span class="jr-bola">'+String(x).padStart(2,'0')+'</span>').join('');else html+='<div class="jr-status">Resultado sem dezenas disponíveis.</div>';html+='</div>';box.innerHTML=html}
  function slugBotao(b){const t=(b.textContent||'').trim().toLowerCase();const g=jogos.find(x=>x.nome.toLowerCase()===t);return g&&g.slug}
  function ligarTelaJogos(){cssResultado();const bar=document.getElementById('thorJogosLoterias');if(!bar)return false;bar.querySelectorAll('.thorJogoLoteria').forEach(b=>{if(b.dataset.thorResultadoLigado)return;b.dataset.thorResultadoLigado='1';b.addEventListener('click',()=>{const slug=slugBotao(b);if(!slug)return;const raw=localStorage.getItem('thor4_resultado_'+slug+'_dados');let d=null;try{d=raw?JSON.parse(raw):null}catch(_){}renderResultado(slug,d,localStorage.getItem('thor4_resultado_'+slug+'_fonte')||'');const g=jogos.find(x=>x.slug===slug);if(g)buscar(g)})});const ativa=bar.querySelector('.thorJogoLoteria.ativa')||bar.querySelector('.thorJogoLoteria');if(ativa){const slug=slugBotao(ativa);const raw=localStorage.getItem('thor4_resultado_'+slug+'_dados');let d=null;try{d=raw?JSON.parse(raw):null}catch(_){}renderResultado(slug,d,'')}return true}
  async function buscar(g){
    const stamp=Date.now();
    const [caixa,rapida]=await Promise.all([json('https://servicebus2.caixa.gov.br/portaldeloterias/api/'+g.slug+'?_thor7='+stamp),json('https://raw.githubusercontent.com/maickon/free-apiloterias/refs/heads/master/database/'+g.free+'/_ultimo.json?_thor7='+stamp)]);
    const nc=numero(caixa),nr=numero(rapida);let d=null,fonte='';if(nr>nc){d=rapida;fonte='free-apiloterias'}else if(nc){d=caixa;fonte='caixa'}else if(nr){d=rapida;fonte='free-apiloterias'}
    const n=numero(d);if(!n)return false;const k='thor4_resultado_'+g.slug,ant=Number(localStorage.getItem(k)||0);localStorage.setItem(k,String(n));localStorage.setItem(k+'_ts',String(Date.now()));localStorage.setItem(k+'_dados',JSON.stringify(d));localStorage.setItem(k+'_fonte',fonte);
    try{if(typeof concursoMaisRecentePorJogo!=='undefined')concursoMaisRecentePorJogo[g.slug]=n}catch(_){}
    if(n!==ant){try{if(typeof tendGameAtual!=='undefined'&&tendGameAtual&&tendGameAtual.slug===g.slug&&typeof carregarUltimoResultado==='function')carregarUltimoResultado(tendGameAtual)}catch(_){}try{if(typeof geradorGameAtual!=='undefined'&&geradorGameAtual&&geradorGameAtual.slug===g.slug&&typeof carregarUltimoResultadoGerador==='function')carregarUltimoResultadoGerador(geradorGameAtual)}catch(_){}}
    const ativa=document.querySelector('#thorJogosLoterias .thorJogoLoteria.ativa');if(ativa&&slugBotao(ativa)===g.slug)renderResultado(g.slug,d,fonte);
    try{window.dispatchEvent(new CustomEvent('thor:resultado-atualizado',{detail:{slug:g.slug,numero:n,dados:d,fonte:fonte}}))}catch(_){}return true;
  }
  let rodando=false,ultima=0;async function verificar(forcar){if(!navigator.onLine||rodando)return;if(!forcar&&Date.now()-ultima<RECHECK)return;rodando=true;ultima=Date.now();try{await Promise.all(jogos.map(buscar))}finally{rodando=false}}
  window.thorAtualizarResultados=function(){ultima=0;return verificar(true)};
  const obs=new MutationObserver(()=>ligarTelaJogos());obs.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('online',()=>verificar(true));window.addEventListener('pageshow',()=>{ligarTelaJogos();verificar(true)});window.addEventListener('focus',()=>verificar(false));document.addEventListener('visibilitychange',()=>{if(!document.hidden)verificar(true)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ligarTelaJogos();verificar(true)},{once:true});else{ligarTelaJogos();verificar(true)}setInterval(()=>verificar(false),RECHECK);
})();