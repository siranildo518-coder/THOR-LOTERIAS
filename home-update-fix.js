/* THOR LOTERIAS — THOR 6: carregar foto no menu lateral */
(function(){
 const VERSAO='thor6-20260915-menu-foto-2';
 function aplicar(){
  if(!document.getElementById('thorMenuFotoCss')){
   const l=document.createElement('link');l.id='thorMenuFotoCss';l.rel='stylesheet';l.href='./menu-foto-thor.css?v='+VERSAO;document.head.appendChild(l);
  }
  const nav=document.getElementById('homeSideNav');if(!nav)return;
  nav.style.setProperty('background-image',`url('./menu-thor.png?v=${VERSAO}')`,'important');
  nav.style.setProperty('background-size','100% auto','important');
  nav.style.setProperty('background-position','top center','important');
  nav.style.setProperty('background-repeat','no-repeat','important');
 }
 function iniciar(){aplicar()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();
 new MutationObserver(aplicar).observe(document.documentElement,{childList:true,subtree:true});
})();