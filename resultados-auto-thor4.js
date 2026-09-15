(function(){
  'use strict';
  // Base 142 preservada. Sempre consulta o último resultado oficial da CAIXA
  // ao abrir/retomar/reconectar, sem depender do dia ou horário do sorteio.
  const RECHECK=60*1000;
  const jogos=[
    {code:'MEGA',slug:'megasena'},
    {code:'LF',slug:'lotofacil'},
    {code:'QUINA',slug:'quina'},
    {code:'DIA',slug:'diadesorte'},
    {code:'LM',slug:'lotomania'},
    {code:'SS',slug:'supersete'},
    {code:'TM',slug:'timemania'},
    {code:'DS',slug:'duplasena'}
  ];
  async function buscar(g){
    try{
      const url='https://servicebus2.caixa.gov.br/portaldeloterias/api/'+g.slug+'?_thor5='+Date.now();
      const r=await fetch(url,{cache:'no-store',headers:{'Cache-Control':'no-cache, no-store','Pragma':'no-cache'}});
      if(!r.ok)return false;
      const d=await r.json();
      const n=Number(d.numero||d.concurso||0);if(!n)return false;
      const k='thor4_resultado_'+g.slug;
      const ant=Number(localStorage.getItem(k)||0);
      localStorage.setItem(k,String(n));
      localStorage.setItem(k+'_ts',String(Date.now()));
      localStorage.setItem(k+'_dados',JSON.stringify(d));
      try{if(typeof concursoMaisRecentePorJogo!=='undefined')concursoMaisRecentePorJogo[g.slug]=n;}catch(_){}
      // Se chegou concurso novo, força os módulos visíveis a recarregarem da fonte oficial.
      if(n!==ant){
        try{if(typeof tendGameAtual!=='undefined'&&tendGameAtual&&tendGameAtual.slug===g.slug&&typeof carregarUltimoResultado==='function')carregarUltimoResultado(tendGameAtual);}catch(_){}
        try{if(typeof geradorGameAtual!=='undefined'&&geradorGameAtual&&geradorGameAtual.slug===g.slug&&typeof carregarUltimoResultadoGerador==='function')carregarUltimoResultadoGerador(geradorGameAtual);}catch(_){}
        try{window.dispatchEvent(new CustomEvent('thor:resultado-atualizado',{detail:{slug:g.slug,numero:n,dados:d}}));}catch(_){}
      }
      return true;
    }catch(_){return false;}
  }
  let rodando=false,ultima=0;
  async function verificar(forcar){
    if(!navigator.onLine||rodando)return;
    if(!forcar&&Date.now()-ultima<RECHECK)return;
    rodando=true;ultima=Date.now();
    try{await Promise.all(jogos.map(buscar));}finally{rodando=false;}
  }
  window.thorAtualizarResultados=function(){return verificar(true)};
  window.addEventListener('online',()=>verificar(true));
  window.addEventListener('pageshow',()=>verificar(true));
  window.addEventListener('focus',()=>verificar(false));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)verificar(true)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>verificar(true),{once:true});else verificar(true);
  setInterval(()=>verificar(false),RECHECK);
})();