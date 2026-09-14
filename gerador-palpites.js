(function(){
  var cfg={lotofacil:{nome:'Lotofácil',max:25,qtd:15},megasena:{nome:'Mega-Sena',max:60,qtd:6},quina:{nome:'Quina',max:80,qtd:5},lotomania:{nome:'Lotomania',max:100,qtd:50},diadesorte:{nome:'Dia de Sorte',max:31,qtd:7},timemania:{nome:'Timemania',max:80,qtd:10},duplasena:{nome:'Dupla Sena',max:50,qtd:6},supersete:{nome:'Super Sete',max:10,qtd:7}};
  function $(x){return document.getElementById(x)}
  function abrir(){var t=$('thorGeradorPalpites');if(t){t.style.display='block';t.scrollTop=0;try{history.pushState({thorGerador:true},'',location.href)}catch(_){}}}
  function fechar(){var t=$('thorGeradorPalpites');if(t)t.style.display='none'}
  function instalar(){
    var drawer=$('drawer'); if(!drawer)return;
    var b=$('menuGeradorPalpites');
    if(!b){
      var ref=$('menuAtualizar')||$('menuPadroes'); if(!ref)return;
      b=document.createElement('button'); b.className='drawer-item'; b.id='menuGeradorPalpites'; b.type='button';
      b.innerHTML='<span class="ic">🎯</span> Gerador de Palpites';
      ref.parentNode.insertBefore(b,ref);
    }
    b.onclick=function(e){e.preventDefault();e.stopPropagation();try{if(typeof closeDrawer==='function')closeDrawer()}catch(_){} abrir();};
    var v=$('thorGeradorVoltar'); if(v)v.onclick=function(e){e.preventDefault();fechar();};
    var g=$('tgGerar'); if(g)g.onclick=gerar;
  }
  function dezenas(d){var a=d&&(d.listaDezenas||d.dezenas||d.numeros||d.listaDezenasSegundoSorteio);return Array.isArray(a)?a.map(Number).filter(Number.isFinite):[]}
  async function obterUltimo(chave){var c=cfg[chave],g=null;if(typeof GAMES!=='undefined'&&Array.isArray(GAMES))g=GAMES.find(function(x){return String(x.nome||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,'').includes(c.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,''))});if(g&&typeof fetchConcursoLoteria==='function'){var d=await fetchConcursoLoteria(g);return {g:g,d:d}}throw new Error('Histórico indisponível')}
  async function gerar(){var chave=$('tgLoteria').value,c=cfg[chave],n=Math.max(10,Math.min(500,parseInt($('tgConcursos').value)||50)),st=$('tgStatus'),out=$('tgResultados');st.textContent='Analisando '+n+' concursos...';out.innerHTML='';try{var ult=await obterUltimo(chave),numero=Number(ult.d.concurso||ult.d.numero||0),hist=[];for(var k=0;k<n&&numero-k>0;k++){try{var d=k===0?ult.d:await fetchConcursoLoteria(ult.g,numero-k);var dz=dezenas(d);if(dz.length)hist.push(dz)}catch(_){}}if(!hist.length)throw new Error('Sem concursos');var freq=Array(c.max+1).fill(0),ultimo=Array(c.max+1).fill(hist.length);hist.forEach(function(j,idx){j.forEach(function(x){if(x>=1&&x<=c.max){freq[x]++;if(ultimo[x]===hist.length)ultimo[x]=idx}})});var score=[];for(var x=1;x<=c.max;x++){var f=freq[x]/hist.length,r=1-Math.min(ultimo[x],hist.length)/hist.length,a=Math.min(ultimo[x]/Math.max(1,hist.length*.25),1);score[x]=.55*f+.25*r+.20*a+.03}function um(){var pool=[];for(var x=1;x<=c.max;x++)pool.push(x);var jogo=[];while(jogo.length<c.qtd&&pool.length){var total=pool.reduce(function(s,x){return s+score[x]},0),r=Math.random()*total,sel=pool[0];for(var i=0;i<pool.length;i++){r-=score[pool[i]];if(r<=0){sel=pool[i];break}}jogo.push(sel);pool.splice(pool.indexOf(sel),1)}return jogo.sort(function(a,b){return a-b})}var jogos=[],seen=new Set;while(jogos.length<30){var j=um(),key=j.join('-');if(!seen.has(key)){seen.add(key);var raw=j.reduce(function(s,x){return s+score[x]},0)/j.length,maxScore=Math.max.apply(null,score.slice(1)),pct=Math.round(Math.max(1,Math.min(99,raw/maxScore*100)));jogos.push({j:j,p:pct})}}jogos.sort(function(a,b){return b.p-a.p});out.innerHTML=jogos.map(function(o,i){return '<div class="tg-game"><div class="tg-line"><span>Jogo '+String(i+1).padStart(2,'0')+'</span><span class="tg-pct">'+o.p+'%</span></div><div class="tg-balls">'+o.j.map(function(x){return '<span class="tg-ball">'+String(x).padStart(2,'0')+'</span>'}).join('')+'</div></div>'}).join('');st.textContent='30 jogos gerados com base em '+hist.length+' concursos analisados.'}catch(e){st.textContent='Não foi possível carregar o histórico agora. Tente novamente.'}}
  window.addEventListener('popstate',fechar);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',instalar,{once:true});else instalar();
  new MutationObserver(instalar).observe(document.documentElement,{childList:true,subtree:true});
})();