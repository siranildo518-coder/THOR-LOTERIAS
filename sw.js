// THOR LOTERIAS - Service Worker
// Base 142 preservada - home pronta sem piscar + Escolha pra mim independente
const CACHE_NAME='thor-loterias-base-142-gerador-palpites-menu-fix-2';
const CORE=['./','./index.html','./app-main.html','./gerador-palpites.js','./analysis-neon.css','./fechamento-personalizado-luxo.css','./home-topo-thor.css','./home-update-fix.js','./filtros-auto.js','./manifest.json','./icon-192.png','./icon-512.png','./icon-512-maskable.png'];
const PALPITES_CARD='<button class="home-feature-card" style="--fc:#d41948" data-home-target="btnTendenciaAtalho"><span class="hfc-icon">◎</span><span><strong>Palpites</strong><small>Sugestões inteligentes</small></span></button>';
const CALC_CARD='<button class="home-feature-card" style="--fc:#e98a00" data-home-target="btnSimularAtalho"><span class="hfc-icon">▤</span><span><strong>Calculadora</strong><small>Probabilidades e estimativas</small></span></button>';
const ESCOLHA_CARD='<button class="home-feature-card" id="btnEscolhaPraMim" style="--fc:#18a96b" type="button"><span class="hfc-icon">★</span><span><strong>Escolha pra mim</strong><small>Sugestão automática</small></span></button>';
const ESCOLHA_TELA='<div id="thorEscolhaPraMim" style="display:none;position:fixed;inset:0;z-index:99990;background:#07101f;color:#fff;overflow:auto"><div style="height:54px;display:flex;align-items:center;gap:12px;padding:0 14px;border-bottom:1px solid #28496c"><button id="thorEscolhaVoltar" type="button" style="width:40px;height:34px;border:1px solid #597895;border-radius:7px;background:#263c52;color:#fff;font-size:20px">←</button><strong style="font-size:18px">Escolha pra mim</strong></div><div style="padding:22px;text-align:center"><div style="font-size:44px;margin:18px 0">★</div><h2 style="margin:0 0 8px">Escolha pra mim</h2><p style="opacity:.8;margin:0">Tela exclusiva para suas sugestões automáticas.</p></div></div>';
function prepararHome(html){
  html=html.replace(PALPITES_CARD,'');
  if(!html.includes('id="btnEscolhaPraMim"')) html=html.replace(CALC_CARD,CALC_CARD+'\n'+ESCOLHA_CARD);
  if(!html.includes('id="thorEscolhaPraMim"')) html=html.replace('</body>',ESCOLHA_TELA+'</body>');
  if(!html.includes('src="./gerador-palpites.js"')) html=html.replace('</body>','<script src="./gerador-palpites.js?v=fix-2"><\/script></body>');
  html=html.replace('</head>','<style id="thorSemPiscar">#overlayListaResultados{visibility:hidden!important}html.thor-home-pronta #overlayListaResultados{visibility:visible!important}</style></head>');
  const pronto=`<script>(function(){function ligarEscolha(){var b=document.getElementById('btnEscolhaPraMim'),t=document.getElementById('thorEscolhaPraMim'),v=document.getElementById('thorEscolhaVoltar');if(!b||!t)return;b.removeAttribute('data-home-target');b.onclick=function(e){e.preventDefault();e.stopImmediatePropagation();t.style.display='block';try{history.pushState({thorEscolha:true},'',location.href)}catch(_){}};if(v)v.onclick=function(){t.style.display='none';if(history.state&&history.state.thorEscolha)history.back()};window.addEventListener('popstate',function(){t.style.display='none'})}function revelar(){var h=document.getElementById('homeHero');if(!h)return false;var t=(h.textContent||'').trim();if((/Concurso/i.test(t)&&!/Buscando concurso/i.test(t))||h.querySelector('.hh-ball')){document.documentElement.classList.add('thor-home-pronta');return true}return false}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ligarEscolha,{once:true});else ligarEscolha();if(!revelar()){var o=new MutationObserver(function(){ligarEscolha();if(revelar())o.disconnect()});o.observe(document.documentElement,{childList:true,subtree:true,characterData:true});setTimeout(function(){document.documentElement.classList.add('thor-home-pronta');o.disconnect()},8000)}})();<\/script>`;
  return html.replace('</body>',pronto+'</body>');
}
async function respostaAtualizada(req){
  const fresh=await fetch(req,{cache:'no-store'});
  if(!fresh||!fresh.ok)return fresh;
  const url=new URL(req.url);
  if(url.pathname.endsWith('/app-main.html')){
    const html=prepararHome(await fresh.text());
    const headers=new Headers(fresh.headers);
    headers.set('content-type','text/html; charset=utf-8');
    headers.set('cache-control','no-store, no-cache, must-revalidate');
    return new Response(html,{status:fresh.status,statusText:fresh.statusText,headers});
  }
  return fresh;
}
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);for(const url of CORE){try{const sep=url.includes('?')?'&':'?';const req=new Request(url+sep+'_refresh=gerador-palpites-menu-fix-2',{cache:'no-store'});const res=await respostaAtualizada(req);if(res&&res.ok)await cache.put(url,res.clone())}catch(_){}}})());self.skipWaiting()});
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim();const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});clients.forEach(c=>c.postMessage({type:'THOR_UPDATED',version:'142',refresh:'gerador-palpites-menu-fix-2'}))})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;event.respondWith((async()=>{try{const fresh=await respostaAtualizada(req);if(fresh&&fresh.ok){const cache=await caches.open(CACHE_NAME);cache.put(req,fresh.clone())}return fresh}catch(_){const cached=await caches.match(req);if(cached)return cached;if(req.mode==='navigate')return await caches.match('./index.html');return Response.error()}})())});