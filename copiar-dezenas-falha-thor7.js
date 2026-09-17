// THOR 7 V114 - COPIAR dezenas selecionadas no filtro de falhas. Nao altera login, senha ou trava.
(function(){'use strict';
const ID='thorBtnCopiarFalhas';
function vis(e){if(!e)return false;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'}
function txt(e){return (e&&e.textContent||'').replace(/\s+/g,' ').trim()}
function montar(){
 if(document.getElementById(ID))return true;
 const todos=[...document.querySelectorAll('body *')];
 const rot=todos.find(e=>vis(e)&&/^Usar quantas dezenas\s*\(as de maior potencial de falha\)/i.test(txt(e)));
 if(!rot)return false;
 let area=rot.parentElement;for(let i=0;i<4&&area;i++,area=area.parentElement){if(/Dezenas selecionadas com esse filtro/i.test(txt(area)))break}if(!area)return false;
 const input=[...area.querySelectorAll('input')].find(e=>vis(e)&&Number(e.value)>=1&&Number(e.value)<=30);
 if(!input)return false;
 const btn=document.createElement('button');btn.id=ID;btn.type='button';btn.textContent='COPIAR';btn.style.cssText='margin-left:10px;vertical-align:middle;border:1px solid #72a7ff;border-radius:7px;padding:5px 11px;background:linear-gradient(180deg,#4f96ff 0%,#1765d8 55%,#0843a5 100%);color:#fff;font-size:11px;font-weight:900;letter-spacing:.2px;box-shadow:inset 0 2px 2px rgba(255,255,255,.65),inset 0 -3px 3px rgba(0,0,0,.3),0 3px 0 #06377f,0 5px 7px rgba(0,0,0,.28);text-shadow:0 1px 1px rgba(0,0,0,.5);';input.insertAdjacentElement('afterend',btn);
 btn.addEventListener('pointerdown',()=>{btn.style.transform='translateY(2px)'});btn.addEventListener('pointerup',()=>{btn.style.transform=''});
 btn.onclick=async function(){
   const marcador=[...area.querySelectorAll('*')].find(e=>/Dezenas selecionadas com esse filtro/i.test(txt(e)));if(!marcador)return;
   const limite=Math.max(1,Math.min(30,parseInt(input.value,10)||30));
   const els=[...area.querySelectorAll('button,span,div')].filter(e=>vis(e)&&/^\d{1,2}$/.test(txt(e))&&e.getBoundingClientRect().top>marcador.getBoundingClientRect().bottom-5);
   const nums=[];for(const e of els){const n=parseInt(txt(e),10);if(n>=1&&n<=99&&!nums.includes(n))nums.push(n);if(nums.length>=limite)break}
   if(!nums.length)return;const texto=nums.map(n=>String(n).padStart(2,'0')).join(' ');
   try{await navigator.clipboard.writeText(texto);const old=btn.textContent;btn.textContent='COPIADO ✓';setTimeout(()=>btn.textContent=old,900)}catch(e){prompt('Copie as dezenas:',texto)}
 };
 return true;
}
let n=0;function init(){if(!montar()&&++n<120)setTimeout(init,250)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();new MutationObserver(()=>{if(!document.getElementById(ID))montar()}).observe(document.documentElement,{childList:true,subtree:true});
})();