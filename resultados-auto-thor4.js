(function(){
'use strict';
const RECHECK=2*60*1000;
const jogos=[
{code:'MEGA',slug:'megasena'},{code:'LF',slug:'lotofacil'},{code:'QUINA',slug:'quina'},{code:'DIA',slug:'diadesorte'},{code:'LM',slug:'lotomania'},{code:'SS',slug:'supersete'},{code:'TM',slug:'timemania'},{code:'DS',slug:'duplasena'}
];
let executando=false,ultima=0;
async function buscar(g){
try{
const url='https://servicebus2.caixa.gov.br/portaldeloterias/api/'+g.slug+'?_thor5='+Date.now();
const r=await fetch(url,{cache:'no-store',headers:{'Cache-Control':'no-cache, no-store','Pragma':'no-cache'}});
if(!r.ok)return false;
const d=await r.json();
const n=Number(d.numero||d.concurso||0);if(!n)return false;
const k='thor4_resultado_'+g.slug,ant=Number(localStorage.getItem(k)||0);
localStorage.setItem(k,String(n));localStorage.setItem(k+'_ts',String(Date.now()));
try{if(typeof concursoMaisRecentePorJogo!=='undefined')concursoMaisRecentePorJogo[g.slug]=n;}catch(_){}
if(n>=ant){
try{if(typeof tendGameAtual!=='undefined'&&tendGameAtual&&tendGameAtual.slug===g.slug&&typeof carregarUltimoResultado==='function')await carregarUltimoResultado(tendGameAtual);}catch(_){}
try{if(typeof geradorGameAtual!=='undefined'&&geradorGameAtual&&geradorGameAtual.slug===g.slug&&typeof carregarUltimoResultadoGerador==='function')await carregarUltimoResultadoGerador(geradorGameAtual);}catch(_){}
}
return true;
}catch(_){return false;}
}
async function verificar(forcar){
if(!navigator.onLine||executando)return;
if(!forcar&&Date.now()-ultima<RECHECK)return;
executando=true;ultima=Date.now();
try{await Promise.all(jogos.map(buscar));}finally{executando=false;}
}
window.thorAtualizarResultados=function(){ultima=0;return verificar(true)};
window.addEventListener('online',()=>verificar(true));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)verificar(true)});
window.addEventListener('focus',()=>verificar(true));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>verificar(true),{once:true});else verificar(true);
setInterval(()=>verificar(false),60000);
})();