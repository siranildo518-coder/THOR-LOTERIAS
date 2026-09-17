// THOR 7 V115 - COPIAR ao lado do campo 'Usar quantas dezenas'. Login, senha e trava intocados.
(function(){'use strict';
const ID='thorBtnCopiarFalhas';
function vis(e){if(!e)return false;const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'}
function texto(e){return (e&&e.textContent||'').replace(/\s+/g,' ').trim()}
function montar(){
 if(document.getElementById(ID))return true;
 const nodes=[...document.querySelectorAll('body *')];
 const label=nodes.find(e=>vis(e)&&/Usar quantas dezenas\s*\(as de maior potencial de falha\)/i.test(texto(e))&&e.children.length<4);
 if(!label)return false;
 const lr=label.getBoundingClientRect();
 const inputs=[...document.querySelectorAll('input')].filter(vis).filter(e=>{const r=e.getBoundingClientRect();return r.top>=lr.bottom-5&&r.top<lr.bottom+130&&Number(e.value)>=1&&Number(e.value)<=30});
 const input=inputs.sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0];if(!input)return false;
 let area=label.parentElement;for(let i=0;i<5&&area;i++,area=area.parentElement){if(/Dezenas selecionadas com esse filtro/i.test(texto(area)))break}if(!area)return false;
 const wrap=document.createElement('span');wrap.id='thorCopiarFalhasWrap';wrap.style.cssText='display:inline-flex;align-items:center;margin-left:12px;vertical-align:middle;';
 const btn=document.createElement('button');btn.id=ID;btn.type='button';btn.textContent='COPIAR';btn.style.cssText='border:1px solid #72a7ff;border-radius:7px;padding:6px 12px;background:linear-gradient(180deg,#4f96ff 0%,#1765d8 55%,#0843a5 100%);color:#fff;font-size:11px;font-weight:900;letter-spacing:.2px;box-shadow:inset 0 2px 2px rgba(255,255,255,.65),inset 0 -3px 3px rgba(0,0,0,.3),0 3px 0 #06377f,0 5px 7px rgba(0,0,0,.28);text-shadow:0 1px 1px rgba(0,0,0,.5);white-space:nowrap;';wrap.appendChild(btn);
 const p=input.parentElement;if(p){const ps=getComputedStyle(p);if(ps.display==='flex'||ps.display==='inline-flex'){p.appendChild(wrap)}else{input.insertAdjacentElement('afterend',wrap)}}
 btn.addEventListener('pointerdown',()=>btn.style.transform='translateY(2px)');btn.addEventListener('pointerup',()=>btn.style.transform='');
 btn.onclick=async function(){const marcador=[...area.querySelectorAll('*')].find(e=>/Dezenas selecionadas com esse filtro/i.test(texto(e)));if(!marcador)return;const limite=Math.max(1,Math.min(30,parseInt(input.value,10)||30));const mr=marcador.getBoundingClientRect();const candidatos=[...area.querySelectorAll('button,span,div')].filter(e=>e!==btn&&vis(e)&&/^\d{1,2}$/.test(texto(e))&&e.getBoundingClientRect().top>=mr.bottom-8);const nums=[];for(const e of candidatos){const n=parseInt(texto(e),10);if(n>=1&&n<=99&&!nums.includes(n))nums.push(n);if(nums.length>=limite)break}if(!nums.length)return;const out=nums.map(n=>String(n).padStart(2,'0')).join(' ');try{await navigator.clipboard.writeText(out);btn.textContent='COPIADO ✓';setTimeout(()=>btn.textContent='COPIAR',900)}catch(e){prompt('Copie as dezenas:',out)}};
 return true;
}
let t=0;function init(){if(!montar()&&++t<160)setTimeout(init,200)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();new MutationObserver(()=>{if(!document.getElementById(ID))montar()}).observe(document.documentElement,{childList:true,subtree:true});
})();