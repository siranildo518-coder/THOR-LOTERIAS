(function(){
  'use strict';
  // Base 142 preservada. Consulta duas fontes publicas e usa o concurso mais novo.
  const RECHECK=60*1000;
  const jogos=[
    {code:'MEGA',slug:'megasena',free:'megasena'},
    {code:'LF',slug:'lotofacil',free:'lotofacil'},
    {code:'QUINA',slug:'quina',free:'quina'},
    {code:'DIA',slug:'diadesorte',free:'diadesorte'},
    {code:'LM',slug:'lotomania',free:'lotomania'},
    {code:'SS',slug:'supersete',free:'supersete'},
    {code:'TM',slug:'timemania',free:'timemania'},
    {code:'DS',slug:'duplasena',free:'duplasena'}
  ];
  function numero(d){return Number(d&&(d.numero||d.concurso||d.numero_concurso)||0)}
  async function json(url){
    try{const r=await fetch(url,{cache:'no-store',headers:{'Cache-Control':'no-cache, no-store','Pragma':'no-cache'}});if(!r.ok)return null;return await r.json()}catch(_){return null}
  }
  async function buscar(g){
    const stamp=Date.now();
    const [caixa,rapida]=await Promise.all([
      json('https://servicebus2.caixa.gov.br/portaldeloterias/api/'+g.slug+'?_thor6='+stamp),
      json('https://raw.githubusercontent.com/maickon/free-apiloterias/refs/heads/master/database/'+g.free+'/_ultimo.json?_thor6='+stamp)
    ]);
    const nc=numero(caixa),nr=numero(rapida);
    let d=null,fonte='';
    if(nr>nc){d=rapida;fonte='free-apiloterias'}else if(nc){d=caixa;fonte='caixa'}else if(nr){d=rapida;fonte='free-apiloterias'}
    const n=numero(d);if(!n)return false;
    const k='thor4_resultado_'+g.slug,ant=Number(localStorage.getItem(k)||0);
    localStorage.setItem(k,String(n));localStorage.setItem(k+'_ts',String(Date.now()));localStorage.setItem(k+'_dados',JSON.stringify(d));localStorage.setItem(k+'_fonte',fonte);
    try{if(typeof concursoMaisRecentePorJogo!=='undefined')concursoMaisRecentePorJogo[g.slug]=n}catch(_){}
    if(n!==ant){
      try{if(typeof tendGameAtual!=='undefined'&&tendGameAtual&&tendGameAtual.slug===g.slug&&typeof carregarUltimoResultado==='function')carregarUltimoResultado(tendGameAtual)}catch(_){}
      try{if(typeof geradorGameAtual!=='undefined'&&geradorGameAtual&&geradorGameAtual.slug===g.slug&&typeof carregarUltimoResultadoGerador==='function')carregarUltimoResultadoGerador(geradorGameAtual)}catch(_){}
    }
    try{window.dispatchEvent(new CustomEvent('thor:resultado-atualizado',{detail:{slug:g.slug,numero:n,dados:d,fonte:fonte}}))}catch(_){}
    return true;
  }
  let rodando=false,ultima=0;
  async function verificar(forcar){if(!navigator.onLine||rodando)return;if(!forcar&&Date.now()-ultima<RECHECK)return;rodando=true;ultima=Date.now();try{await Promise.all(jogos.map(buscar))}finally{rodando=false}}
  window.thorAtualizarResultados=function(){ultima=0;return verificar(true)};
  window.addEventListener('online',()=>verificar(true));window.addEventListener('pageshow',()=>verificar(true));window.addEventListener('focus',()=>verificar(false));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)verificar(true)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>verificar(true),{once:true});else verificar(true);
  setInterval(()=>verificar(false),RECHECK);
})();