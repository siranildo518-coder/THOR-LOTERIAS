/* THOR LOTERIAS — atualização em segundo plano, sem desmontar a home */
(function(){
  let atualizando=false;
  function fixarHome(){
    const home=document.getElementById('overlayListaResultados');
    if(home){home.classList.add('show');home.style.setProperty('display','block','important');home.style.setProperty('visibility','visible','important');home.style.setProperty('opacity','1','important');home.style.setProperty('z-index','2147483000','important');home.style.setProperty('transform','none','important');home.style.setProperty('transition','none','important');home.style.setProperty('animation','none','important')}
    document.documentElement.classList.add('thor-home-atualizando');
  }
  function liberarHome(){document.documentElement.classList.remove('thor-home-atualizando');atualizando=false}
  async function atualizar(){
    if(atualizando)return;atualizando=true;fixarHome();
    try{
      if('serviceWorker' in navigator){const reg=await navigator.serviceWorker.getRegistration();if(reg){await Promise.race([reg.update(),new Promise(r=>setTimeout(r,1800))]);if(reg.waiting){try{reg.waiting.postMessage({type:'SKIP_WAITING'})}catch(_){}}}}
      await Promise.allSettled([fetch('./index.html?_thor_refresh='+Date.now(),{cache:'reload'}),fetch('./app-main.html?_thor_refresh='+Date.now(),{cache:'reload'}),fetch('./home-update-fix.js?_thor_refresh='+Date.now(),{cache:'reload'})]);
    }catch(_){} liberarHome();
  }
  document.addEventListener('click',function(e){const btn=e.target&&e.target.closest?e.target.closest('#menuAtualizar'):null;if(!btn)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();atualizar()},true);

  function ajustarEspacoMenu(){
    const nav=document.getElementById('homeSideNav');if(!nav)return;
    nav.style.setProperty('gap','0','important');
    const botoes=nav.querySelectorAll('.hs-menu,.hs-item');
    botoes.forEach(function(btn,i){btn.style.setProperty('margin-bottom',i===botoes.length-1?'0':'0.5cm','important')});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ajustarEspacoMenu,{once:true});else ajustarEspacoMenu();
  new MutationObserver(ajustarEspacoMenu).observe(document.documentElement,{childList:true,subtree:true});

  function removerContatoSolto(){document.querySelectorAll('.contatos-conteudo').forEach(function(el){el.remove()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',removerContatoSolto,{once:true});else removerContatoSolto();
  new MutationObserver(removerContatoSolto).observe(document.documentElement,{childList:true,subtree:true});

  document.addEventListener('click',function(e){
    const btn=e.target&&e.target.closest?e.target.closest('#btnAbrirFechamentoAtalho'):null;if(!btn)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    try{const escolha=document.getElementById('overlayGeradorLoteria');if(escolha)escolha.classList.remove('show');const code=(typeof homeGameAtual!=='undefined'&&typeof GERADOR_APOSTA_SIZE!=='undefined'&&GERADOR_APOSTA_SIZE[homeGameAtual.code])?homeGameAtual.code:'LF';if(typeof abrirGeradorFiltro==='function')abrirGeradorFiltro(code)}catch(err){console.error('Falha ao abrir Fechamento Personalizado:',err);try{if(typeof abrirGeradorFiltro==='function')abrirGeradorFiltro('LF')}catch(_){}}
  },true);

  /* Remove completamente o botão Palpites da tela inicial. */
  function removerBotaoPalpites(){
    document.querySelectorAll('button,.home-feature-card').forEach(function(btn){
      if(/palpites/i.test((btn.textContent||'').trim())) btn.remove();
    });
    const tela=document.getElementById('thorPalpitesNovo');if(tela)tela.remove();
    const css=document.getElementById('thorPalpitesNovoCss');if(css)css.remove();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',removerBotaoPalpites,{once:true});else removerBotaoPalpites();
  new MutationObserver(removerBotaoPalpites).observe(document.documentElement,{childList:true,subtree:true});
})();
