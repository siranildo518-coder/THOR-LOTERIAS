// THOR 7 V106 - remove somente Minhas Sequencias, Padroes e Gerador de Palpites do menu lateral. Login/trava intactos.
(function(){'use strict';if(window.__thorMenuLimpoV106)return;window.__thorMenuLimpoV106=1;
var nomes=['minhas sequencias','padroes','gerador de palpites'];
function norm(s){return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLowerCase()}
function remover(){var candidatos=document.querySelectorAll('button,a,[role="button"],.drawer-item,.menu-item,.nav-item,li');candidatos.forEach(function(el){var t=norm(el.textContent);if(nomes.indexOf(t)>=0)el.remove()});return true}
function iniciar(){remover();new MutationObserver(remover).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();
})();