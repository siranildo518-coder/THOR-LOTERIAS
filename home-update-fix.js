/* THOR LOTERIAS — THOR 6: atualização + troca de loteria sem reconstruir a Home */
(function(){
  const VERSAO='thor6-20260915-home-direta-4';
  let atualizando=false;
  function botao(){return document.getElementById('menuAtualizar')}
  function estilo(){if(document.getElementById('thorUpdateAvisoCss'))return;const s=document.createElement('style');s.id='thorUpdateAvisoCss';s.textContent='#menuAtualizar.thor-update-disponivel{background:linear-gradient(180deg,#fff36b,#ffb000 45%,#e75b00)!important;border:2px solid #fff!important;color:#3a1700!important;box-shadow:inset 0 2px 3px rgba(255,255,255,.95),inset 0 -3px 5px rgba(126,43,0,.4),0 0 8px #ffb000,0 0 18px #ff7200!important;animation:thorUpdatePisca 1s ease-in-out infinite alternate!important}#menuAtualizar.thor-update-disponivel:after{content:" • NOVO";font-size:7px;font-weight:1000}@keyframes thorUpdatePisca{from{filter:brightness(1)}to{filter:brightness(1.35)}}#overlayListaResultados,#overlayListaResultados #homeHero,#overlayListaResultados .home-hero{transition:none!important;animation:none!important}';document.head.appendChild(s)}
  function destacar(){estilo();const b=botao();if(b)b.classList.add('thor-update-disponivel')}
  function normal(){const b=botao();if(b)b.classList.remove('thor-update-disponivel')}
  function fixarHome(){const home=document.getElementById('overlayListaResultados');if(home){home.classList.add('show');home.style.setProperty('display','block','important');home.style.setProperty('visibility','visible','important');home.style.setProperty('opacity','1','important');home.style.setProperty('z-index','2147483000','important');home.style.setProperty('transform','none','important');home.style.setProperty('transition','none','important');home.style.setProperty('animation','none','important')}document.documentElement.classList.add('thor-home-atualizando')}
  function liberarHome(){document.documentElement.classList.remove('thor-home-atualizando');atualizando=false}
  async function verificar(){try{if(!('serviceWorker' in navigator))return;const reg=await navigator.serviceWorker.getRegistration();if(!reg)return;reg.addEventListener('updatefound',destacar);await reg.update();if(reg.waiting)destacar()}catch(_){}}
  async function atualizar(){if(atualizando)return;atualizando=true;fixarHome();try{normal();if('serviceWorker' in navigator){const reg=await navigator.serviceWorker.getRegistration();if(reg){await reg.update();if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'})}}await Promise.allSettled(['index.html','app-main.html','resultados-auto-thor4.js','gerador.html','gerador-palpites.js','home-update-fix.js','menu-lateral-claro-laranja.css'].map(f=>fetch('./'+f+'?_thor6='+Date.now(),{cache:'no-store'})));try{localStorage.setItem('thor_versao_aplicada',VERSAO)}catch(_){}setTimeout(()=>location.reload(),350)}catch(_){destacar();liberarHome()}}
  document.addEventListener('click',function(e){const b=e.target&&e.target.closest?e.target.closest('#menuAtualizar'):null;if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();atualizar()},true);
  if('serviceWorker' in navigator){navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='THOR_UPDATED'){try{const anterior=localStorage.getItem('thor_versao_aplicada');if(anterior!==e.data.refresh)destacar()}catch(_){destacar()}}});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(atualizando)setTimeout(()=>location.reload(),250)})}
  function carregarEstilos(){estilo();if(!document.getElementById('thorMenuClaroLaranja')){const l=document.createElement('link');l.id='thorMenuClaroLaranja';l.rel='stylesheet';l.href='./menu-lateral-claro-laranja.css?v='+VERSAO;document.head.appendChild(l)}if(!document.getElementById('thorTopoVerdeRetangular')){const l=document.createElement('link');l.id='thorTopoVerdeRetangular';l.rel='stylesheet';l.href='./topo-verde-retangular.css?v='+VERSAO;document.head.appendChild(l)}if(!document.getElementById('thorCardsSomenteBorda')){const s=document.createElement('style');s.id='thorCardsSomenteBorda';s.textContent='#overlayListaResultados .home-feature-card{border:3px solid #ff9800!important;box-shadow:none!important}';document.head.appendChild(s)}}
  function ajustarEspacoMenu(){const nav=document.getElementById('homeSideNav');if(!nav)return;nav.style.setProperty('gap','0','important');const bs=nav.querySelectorAll('.hs-menu,.hs-item');bs.forEach((b,i)=>b.style.setProperty('margin-bottom',i===bs.length-1?'0':'0.5cm','important'));if(botao()&&botao().classList.contains('thor-update-disponivel'))destacar()}
  function removerContatoSolto(){document.querySelectorAll('.contatos-conteudo').forEach(el=>el.remove())}
  document.addEventListener('click',function(e){const b=e.target&&e.target.closest?e.target.closest('#btnAbrirFechamentoAtalho'):null;if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();try{const escolha=document.getElementById('overlayGeradorLoteria');if(escolha)escolha.classList.remove('show');const code=(typeof homeGameAtual!=='undefined'&&typeof GERADOR_APOSTA_SIZE!=='undefined'&&GERADOR_APOSTA_SIZE[homeGameAtual.code])?homeGameAtual.code:'LF';if(typeof abrirGeradorFiltro==='function')abrirGeradorFiltro(code)}catch(_){try{if(typeof abrirGeradorFiltro==='function')abrirGeradorFiltro('LF')}catch(__){}}},true);
  function removerBotaoPalpites(){document.querySelectorAll('button,.home-feature-card').forEach(b=>{if(/palpites/i.test((b.textContent||'').trim()))b.remove()});const t=document.getElementById('thorPalpitesNovo');if(t)t.remove();const c=document.getElementById('thorPalpitesNovoCss');if(c)c.remove()}

  /* Corrige a origem da piscada: bloqueia o click original que chama carregarHomeHero(),
     mantém o mesmo .home-hero no DOM e troca somente os textos/bolinhas quando os dados chegam. */
  function instalarTrocaHomeDireta(){
    if(document.documentElement.dataset.thorHomeDireta4)return;
    document.documentElement.dataset.thorHomeDireta4='1';
    let token=0;
    const pad=n=>String(n).padStart(2,'0');
    function aplicar(g,data){
      const host=document.getElementById('homeHero');
      const hero=host&&host.querySelector('.home-hero');
      if(!hero||!data)return false;
      hero.style.setProperty('--hero-accent',g.color);
      hero.style.setProperty('--hero-accent-deep',g.color);
      const h2=hero.querySelector('h2'); if(h2)h2.textContent=g.nome;
      const rows=hero.querySelectorAll(':scope > .hh-row');
      if(rows[0])rows[0].textContent='📅 Próximo sorteio: '+(data.dataProxConcurso||'—');
      if(rows[1])rows[1].textContent='🎟️ Concurso '+(Number(data.concurso)+1);
      const lbl=hero.querySelector('.hh-premio-lbl'); if(lbl)lbl.textContent=data.acumulou?'ESTIMATIVA ACUMULADA':'PRÊMIO ESTIMADO';
      const val=hero.querySelector('.hh-premio-val'); if(val){try{val.textContent=formatBRL(data.acumuladaProxConcurso)}catch(_){val.textContent=data.acumuladaProxConcurso||'—'}}
      const last=hero.querySelector('.hh-last-draw');
      if(last){const lr=last.querySelectorAll('.hh-row');if(lr[0])lr[0].textContent='📅 '+(data.data||'—');if(lr[1])lr[1].textContent='🎟️ Concurso '+data.concurso;const box=last.querySelector('.hh-balls');if(box){const nums=data.dezenas||[];const atuais=box.querySelectorAll('.hh-ball');if(atuais.length===nums.length){atuais.forEach((b,i)=>b.textContent=pad(nums[i]))}else{box.replaceChildren(...nums.map(n=>{const b=document.createElement('div');b.className='hh-ball';b.textContent=pad(n);return b}))}}}
      const stats=hero.querySelector('#homeVerStats');if(stats){stats.onclick=function(e){e.stopImmediatePropagation();try{openResultadoOverlay(g)}catch(_){}}}
      return true;
    }
    document.addEventListener('click',async function(e){
      const tab=e.target&&e.target.closest?e.target.closest('#homeTabs .home-tab'):null;
      if(!tab)return;
      let refs;try{refs=homeTabRefs}catch(_){return}
      const ref=refs&&refs.find(r=>r.tab===tab);if(!ref)return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      const g=ref.g;const meu=++token;
      refs.forEach(r=>{r.tab.classList.toggle('active',r===ref);const w=r.tab.querySelector('.clover-wrap');if(w)w.innerHTML=r===ref?r.g.iconActive:r.g.iconInactive});
      try{homeGameAtual=g}catch(_){}
      let data=null;try{data=homeCache[g.slug]}catch(_){}
      if(data){aplicar(g,data);return}
      try{data=await fetchConcursoLoteria(g);if(meu!==token)return;try{homeCache[g.slug]=data;concursoMaisRecentePorJogo[g.slug]=data.concurso}catch(_){}aplicar(g,data)}catch(_){/* mantém o resultado anterior visível, sem piscar */}
    },true);
  }

  function iniciar(){carregarEstilos();ajustarEspacoMenu();removerContatoSolto();removerBotaoPalpites();instalarTrocaHomeDireta();setTimeout(verificar,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();new MutationObserver(()=>{ajustarEspacoMenu();removerContatoSolto();removerBotaoPalpites()}).observe(document.documentElement,{childList:true,subtree:true});
})();