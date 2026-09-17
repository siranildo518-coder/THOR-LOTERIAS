// THOR 7 V111 - Botao COLAR acima da grade, sem cobrir dezenas. Login e trava nao sao alterados.
(function(){'use strict';
const ID='thorBtnColarDezenas';
function vis(el){if(!el)return false;const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'}
function acharGrade(){
  const els=[...document.querySelectorAll('button,[role="button"],.ball,.dezena,.number,.numero')].filter(vis);
  const nums=els.filter(e=>/^0?\d{1,2}$/.test((e.textContent||'').trim()));
  const grupos=new Map();
  nums.forEach(e=>{let p=e.parentElement;for(let i=0;i<3&&p;i++,p=p.parentElement){const a=[...p.querySelectorAll('button,[role="button"],.ball,.dezena,.number,.numero')].filter(x=>vis(x)&&/^0?\d{1,2}$/.test((x.textContent||'').trim()));if(a.length>=10){if(!grupos.has(p))grupos.set(p,a);break}}});
  return [...grupos.entries()].sort((a,b)=>b[1].length-a[1].length)[0]||null;
}
function montar(){
  if(document.getElementById(ID))return true;
  const g=acharGrade();if(!g)return false;
  const box=g[0], bolas=g[1];
  const btn=document.createElement('button');btn.id=ID;btn.type='button';btn.textContent='COLAR';
  btn.style.cssText='display:block;width:max-content;margin:0 0 9px 0;border:1px solid #72a7ff;border-radius:7px;padding:5px 11px;background:linear-gradient(180deg,#4f96ff 0%,#1765d8 55%,#0843a5 100%);color:#fff;font-size:11px;font-weight:900;letter-spacing:.2px;box-shadow:inset 0 2px 2px rgba(255,255,255,.65),inset 0 -3px 3px rgba(0,0,0,.3),0 3px 0 #06377f,0 5px 7px rgba(0,0,0,.28);text-shadow:0 1px 1px rgba(0,0,0,.5);';
  box.insertBefore(btn,box.firstChild);
  btn.addEventListener('pointerdown',()=>{btn.style.transform='translateY(2px)';btn.style.boxShadow='inset 0 2px 4px rgba(0,0,0,.35),0 1px 0 #06377f'});btn.addEventListener('pointerup',()=>{btn.style.transform='';btn.style.boxShadow='inset 0 2px 2px rgba(255,255,255,.65),inset 0 -3px 3px rgba(0,0,0,.3),0 3px 0 #06377f,0 5px 7px rgba(0,0,0,.28)'});
  btn.onclick=async function(){
    let txt='';try{txt=await navigator.clipboard.readText()}catch(e){txt=prompt('Cole as dezenas aqui:','')||''}
    const max=Math.max(...bolas.map(e=>parseInt((e.textContent||'').trim(),10)).filter(Number.isFinite));
    const ns=[...new Set((txt.match(/\d{1,2}/g)||[]).map(Number).filter(n=>n>=1&&n<=max))];if(!ns.length)return;
    const mapa=new Map(bolas.map(e=>[parseInt((e.textContent||'').trim(),10),e]));
    const area=box.parentElement||box;const limpar=[...area.querySelectorAll('button')].find(e=>/limpar/i.test(e.textContent||''));if(limpar)limpar.click();
    setTimeout(()=>ns.forEach(n=>{const e=mapa.get(n);if(e)e.click()}),30);
  };
  return true;
}
let tent=0;function init(){if(!montar()&&++tent<100)setTimeout(init,250)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
new MutationObserver(()=>{if(!document.getElementById(ID))montar()}).observe(document.documentElement,{childList:true,subtree:true});
})();