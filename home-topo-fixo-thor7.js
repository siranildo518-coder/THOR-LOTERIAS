// Versao de trabalho - fixa somente o topo visual da tela inicial. Login, senha e trava intocados.
(function(){'use strict';
const STYLE='thorHomeTopoFixoCss';
function aplicar(){
 if(!document.getElementById(STYLE)){const s=document.createElement('style');s.id=STYLE;s.textContent=`
#homeScreen{overflow:auto!important;}
#homeScreen .home-topbar,#homeScreen .home-tabs-wrap{position:sticky!important;z-index:80!important;}
#homeScreen .home-topbar{top:0!important;}
#homeScreen .home-tabs-wrap{top:var(--thor-home-top-h,0px)!important;}
`;document.head.appendChild(s)}
 const home=document.getElementById('homeScreen');if(!home)return false;
 const top=home.querySelector('.home-topbar');if(top)home.style.setProperty('--thor-home-top-h',Math.ceil(top.getBoundingClientRect().height)+'px');
 return true;
}
let n=0;function init(){if(!aplicar()&&++n<160)setTimeout(init,200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('resize',aplicar);
new MutationObserver(aplicar).observe(document.documentElement,{childList:true,subtree:true});
})();