// Versao de trabalho: corrige COPIAR pelo ID real gerarTopoSelect. Login, senha e trava intocados.
(function(){'use strict';
const ID='thorBtnCopiarFalhas';
function montar(){
 if(document.getElementById(ID))return true;
 const sel=document.getElementById('gerarTopoSelect');if(!sel)return false;
 const wrap=document.createElement('span');wrap.id='thorCopiarFalhasWrap';wrap.style.cssText='display:inline-flex;align-items:center;margin-left:10px;vertical-align:middle;';
 const btn=document.createElement('button');btn.id=ID;btn.type='button';btn.textContent='COPIAR';btn.style.cssText='border:1px solid #72a7ff;border-radius:7px;padding:6px 12px;background:linear-gradient(180deg,#4f96ff 0%,#1765d8 55%,#0843a5 100%);color:#fff;font-size:11px;font-weight:900;letter-spacing:.2px;box-shadow:inset 0 2px 2px rgba(255,255,255,.65),inset 0 -3px 3px rgba(0,0,0,.3),0 3px 0 #06377f,0 5px 7px rgba(0,0,0,.28);text-shadow:0 1px 1px rgba(0,0,0,.5);white-space:nowrap;';wrap.appendChild(btn);sel.insertAdjacentElement('afterend',wrap);
 btn.onpointerdown=()=>btn.style.transform='translateY(2px)';btn.onpointerup=()=>btn.style.transform='';
 btn.onclick=async function(){
  const preview=document.getElementById('gerarTopoPreview')||[...document.querySelectorAll('div')].find(e=>/Dezenas selecionadas com esse filtro/i.test(e.textContent||''));if(!preview)return;
  // Copia exatamente todas as dezenas que estão exibidas/selecionadas no preview.
  // Não limita mais pela quantidade antiga do seletor.
  const nums=[...preview.querySelectorAll('.tend-ball')].map(e=>parseInt((e.textContent||'').trim(),10)).filter(Number.isFinite);const unicos=[...new Set(nums)];const qtdEsperada=Math.max(1,parseInt(sel.value,10)||unicos.length);let finais=unicos.slice(0,qtdEsperada);if(finais.length<qtdEsperada){const txt=(preview.textContent||'');const extras=(txt.match(/\b\d{1,2}\b/g)||[]).map(Number).filter(Number.isFinite);for(const n of extras){if(!finais.includes(n))finais.push(n);if(finais.length>=qtdEsperada)break;}}if(!finais.length)return;
  const out=finais.map(n=>String(n).padStart(2,'0')).join(' ');try{localStorage.setItem('thor_dezenas_copiadas_v1',out);localStorage.setItem('thor_dezenas_copiadas_qtd_v1',String(finais.length));localStorage.setItem('thor_dezenas_copiadas_json_v1',JSON.stringify(finais));const mapa={MS:'megasena',LF:'lotofacil',QN:'quina',LM:'lotomania',DIA:'diadesorte',TM:'timemania',DS:'duplasena'};let chave='';try{if(typeof tendGameAtual!=='undefined'&&tendGameAtual)chave=mapa[tendGameAtual.code]||''}catch(_x){}if(chave)localStorage.setItem('thor_dezenas_copiadas_loteria_v1',chave)}catch(_e){}try{await navigator.clipboard.writeText(out)}catch(_e){}btn.textContent='COPIADO '+finais.length+' ✓';setTimeout(()=>btn.textContent='COPIAR',900)
 };return true;
}
let n=0;function iniciar(){if(!montar()&&++n<200)setTimeout(iniciar,150)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();new MutationObserver(()=>{if(!document.getElementById(ID))montar()}).observe(document.documentElement,{childList:true,subtree:true});
})();