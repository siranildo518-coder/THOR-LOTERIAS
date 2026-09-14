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

  /* Espacamento exato de 0,5 cm entre os botoes do menu lateral. */
  function ajustarEspacoMenu(){
    const nav=document.getElementById('homeSideNav');
    if(!nav)return;
    nav.style.setProperty('gap','0','important');
    const botoes=nav.querySelectorAll('.hs-menu,.hs-item');
    botoes.forEach(function(btn,i){btn.style.setProperty('margin-bottom',i===botoes.length-1?'0':'0.5cm','important')});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ajustarEspacoMenu,{once:true});else ajustarEspacoMenu();
  new MutationObserver(ajustarEspacoMenu).observe(document.documentElement,{childList:true,subtree:true});

  /* Remove o bloco de contatos que ficou solto no rodape da tela. */
  function removerContatoSolto(){document.querySelectorAll('.contatos-conteudo').forEach(function(el){el.remove()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',removerContatoSolto,{once:true});else removerContatoSolto();
  new MutationObserver(removerContatoSolto).observe(document.documentElement,{childList:true,subtree:true});

  /* Fechamento Personalizado: pula a tela "Escolha a loteria" e abre direto a configuração. */
  document.addEventListener('click',function(e){
    const btn=e.target&&e.target.closest?e.target.closest('#btnAbrirFechamentoAtalho'):null;
    if(!btn)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    try{
      const escolha=document.getElementById('overlayGeradorLoteria');if(escolha)escolha.classList.remove('show');
      const code=(typeof homeGameAtual!=='undefined'&&typeof GERADOR_APOSTA_SIZE!=='undefined'&&GERADOR_APOSTA_SIZE[homeGameAtual.code])?homeGameAtual.code:'LF';
      if(typeof abrirGeradorFiltro==='function')abrirGeradorFiltro(code);
    }catch(err){console.error('Falha ao abrir Fechamento Personalizado:',err);try{if(typeof abrirGeradorFiltro==='function')abrirGeradorFiltro('LF')}catch(_){}}
  },true);

  /* PALPITES NOVO: substitui somente o botao antigo por um novo, sem alterar o restante da home. */
  function abrirPalpitesNovo(){
    let tela=document.getElementById('thorPalpitesNovo');
    if(!tela){
      tela=document.createElement('section');
      tela.id='thorPalpitesNovo';
      tela.setAttribute('aria-label','Palpites');
      tela.innerHTML='<header class="tpn-top"><button id="tpnVoltar" type="button" aria-label="Voltar">←</button><strong>Palpites</strong></header><main class="tpn-vazio"></main>';
      const st=document.createElement('style');
      st.id='thorPalpitesNovoCss';
      st.textContent='#thorPalpitesNovo{position:fixed;inset:0;z-index:2147483646;background:#07101f;color:#fff;display:block;overflow:auto;font-family:Arial,sans-serif}#thorPalpitesNovo .tpn-top{height:52px;box-sizing:border-box;display:flex;align-items:center;gap:12px;padding:0 14px;background:#07101f;border-bottom:1px solid rgba(255,255,255,.12)}#thorPalpitesNovo .tpn-top button{border:0;background:transparent;color:#fff;font-size:25px;padding:4px 8px;cursor:pointer}#thorPalpitesNovo .tpn-top strong{font-size:18px}#thorPalpitesNovo .tpn-vazio{min-height:calc(100vh - 52px);background:#07101f}';
      document.head.appendChild(st);document.body.appendChild(tela);
      document.getElementById('tpnVoltar').onclick=function(){tela.remove()};
    }
  }
  function recriarBotaoPalpites(){
    if(document.getElementById('btnPalpitesNovo'))return;
    const candidatos=[].slice.call(document.querySelectorAll('button,.home-feature-card'));
    const antigo=candidatos.find(function(b){return /palpites/i.test((b.textContent||'').trim())});
    if(!antigo)return;
    const novo=antigo.cloneNode(true);
    novo.id='btnPalpitesNovo';
    novo.removeAttribute('data-home-target');novo.removeAttribute('onclick');
    novo.onclick=function(e){e.preventDefault();e.stopPropagation();abrirPalpitesNovo()};
    antigo.replaceWith(novo);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',recriarBotaoPalpites,{once:true});else recriarBotaoPalpites();
  new MutationObserver(recriarBotaoPalpites).observe(document.documentElement,{childList:true,subtree:true});
})();
