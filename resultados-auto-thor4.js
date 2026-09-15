(function(){
  'use strict';
  const CINCO_MIN=5*60*1000, RECHECK=5*60*1000;
  const jogos=[
    {code:'MEGA',slug:'megasena',dias:[2,4,6],hora:21,min:0},
    {code:'LF',slug:'lotofacil',dias:[1,2,3,4,5,6],hora:21,min:0},
    {code:'QUINA',slug:'quina',dias:[1,2,3,4,5,6],hora:21,min:0},
    {code:'DIA',slug:'diadesorte',dias:[2,4,6],hora:21,min:0},
    {code:'LM',slug:'lotomania',dias:[1,3,5],hora:21,min:0},
    {code:'SS',slug:'supersete',dias:[1,3,5],hora:21,min:0},
    {code:'TM',slug:'timemania',dias:[2,4],hora:21,min:0,domingo:true},
    {code:'DS',slug:'duplasena',dias:[1,3,5],hora:21,min:0}
  ];
  function horarioAlvo(g,agora){
    const d=agora.getDay();
    let h=g.hora,m=g.min;
    if(g.code==='TM'&&d===0){h=11;m=0;}
    else if(!g.dias.includes(d))return null;
    const t=new Date(agora);t.setHours(h,m,0,0);t.setTime(t.getTime()+CINCO_MIN);return t;
  }
  async function buscar(g){
    try{
      const r=await fetch('https://servicebus2.caixa.gov.br/portaldeloterias/api/'+g.slug+'?_thor4='+Date.now(),{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
      if(!r.ok)return false;
      const d=await r.json();
      const n=Number(d.numero||d.concurso||0);if(!n)return false;
      const k='thor4_resultado_'+g.slug,ant=Number(localStorage.getItem(k)||0);
      if(n>ant){localStorage.setItem(k,String(n));localStorage.setItem(k+'_ts',String(Date.now()));
        try{if(typeof concursoMaisRecentePorJogo!=='undefined')concursoMaisRecentePorJogo[g.slug]=n;}catch(_){ }
        try{if(typeof tendGameAtual!=='undefined'&&tendGameAtual&&tendGameAtual.slug===g.slug&&typeof carregarUltimoResultado==='function')carregarUltimoResultado(tendGameAtual);}catch(_){ }
        try{if(typeof geradorGameAtual!=='undefined'&&geradorGameAtual&&geradorGameAtual.slug===g.slug&&typeof carregarUltimoResultadoGerador==='function')carregarUltimoResultadoGerador(geradorGameAtual);}catch(_){ }
      }
      return true;
    }catch(_){return false;}
  }
  function verificar(){
    if(!navigator.onLine)return;
    const agora=new Date();
    jogos.forEach(g=>{const alvo=horarioAlvo(g,agora);if(!alvo||agora<alvo)return;
      const chave='thor4_check_'+g.slug+'_'+agora.toISOString().slice(0,10),ult=Number(localStorage.getItem(chave)||0);
      if(Date.now()-ult<RECHECK)return;
      localStorage.setItem(chave,String(Date.now()));buscar(g);
    });
  }
  window.addEventListener('online',verificar);document.addEventListener('visibilitychange',()=>{if(!document.hidden)verificar()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',verificar,{once:true});else verificar();
  setInterval(verificar,60000);
})();