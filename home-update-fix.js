/* THOR LOTERIAS — THOR 6: imagem do menu lateral */
(function(){
 const VERSAO='thor6-20260915-menu-foto-1';
 function aplicarFotoMenu(){
  const nav=document.getElementById('homeSideNav');
  if(!nav||nav.dataset.thorFotoMenu)return;
  nav.dataset.thorFotoMenu='1';
  const s=document.createElement('style');s.id='thorFotoMenuCss';s.textContent=`
  #homeSideNav{position:relative!important;overflow:hidden!important;background:#061d49!important;padding:0!important;gap:0!important}
  #homeSideNav:before{content:"";position:absolute;inset:0;z-index:0;background:url('./menu-thor.png?v=${VERSAO}') top center/100% auto no-repeat!important;pointer-events:none}
  #homeSideNav>*{position:relative;z-index:1}
  #homeSideNav .hs-profile,#homeSideNav .hs-header{opacity:0!important;pointer-events:none!important;min-height:245px!important}
  #homeSideNav .hs-menu,#homeSideNav .hs-item{background:transparent!important;color:transparent!important;border-color:transparent!important;box-shadow:none!important;opacity:.01!important;margin:0!important}
  #homeSideNav .hs-menu *,#homeSideNav .hs-item *{opacity:0!important}
  `;document.head.appendChild(s);
 }
 function iniciar(){aplicarFotoMenu()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();
 new MutationObserver(aplicarFotoMenu).observe(document.documentElement,{childList:true,subtree:true});
})();