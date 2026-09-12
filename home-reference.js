(function(){
  function q(id){return document.getElementById(id)}
  function click(id){var e=q(id);if(e)e.click()}
  function logged(){try{return localStorage.getItem('tl_login_ok_v1')==='1'}catch(e){return true}}

  function makeHome(){
    if(!logged() || q('thorRefHomeLite')) return;
    var root=document.createElement('div');
    root.id='thorRefHomeLite';
    root.innerHTML=`
      <div class="thr-shell">
        <header class="thr-top">
          <button class="thr-menu" id="thrMenu" aria-label="Menu">☰</button>
          <div class="thr-focus">FOCO<br>PLANEJAMENTO<br>ESTRATÉGIA<br>RESULTADOS</div>
          <div class="thr-brand">
            <div class="thr-thor">TH<span class="bolt">ϟ</span>R</div>
            <div class="thr-lot">LOTERIAS</div>
            <div class="thr-tag">MAIS QUE SORTE, ESTRATÉGIA!</div>
          </div>
          <div class="thr-clock"><div class="thr-date" id="thrDate">--</div><div class="thr-time" id="thrTime">--:--</div></div>
          <div class="thr-discipline">DISCIPLINA HOJE,<br><b>RESULTADOS</b> AMANHÃ!</div>
        </header>

        <section class="thr-hero">
          <div class="thr-copy">
            <h1>LOTOFÁCIL</h1>
            <h2>ESTRATÉGIA<br>QUE TRANSFORMA<br>JOGOS EM <b>RESULTADOS!</b></h2>
            <div class="thr-checks">
              <div class="thr-check"><i>✓</i><span>ANALISE COM INTELIGÊNCIA</span></div>
              <div class="thr-check"><i>✓</i><span>PLANEJE COM SEGURANÇA</span></div>
              <div class="thr-check"><i>✓</i><span>JOGUE COM ESTRATÉGIA</span></div>
            </div>
            <button class="thr-pill" id="thrBrandAction">⚡ THOR LOTERIAS</button>
          </div>
          <div class="thr-clover" aria-hidden="true">
            <span class="leaf l1">♥</span><span class="leaf l2">♥</span><span class="leaf l3">♥</span><span class="leaf l4">♥</span>
            <span class="clover-bolt">ϟ</span>
          </div>
          <div class="thr-slip" aria-hidden="true"><strong>Lotofácil</strong><div class="nums">${Array.from({length:25},(_,i)=>'<span>'+String(i+1).padStart(2,'0')+'</span>').join('')}</div></div>
          <div class="thr-dream">Sonhe<br>Planeje<br>Jogue<br>Conquiste!</div>
          <span class="hero-ball hb1">03</span><span class="hero-ball hb2">07</span><span class="hero-ball hb3">15</span><span class="hero-ball hb4">20</span><span class="hero-ball hb5">12</span>
        </section>

        <section class="thr-grid">
          <button class="thr-card c-purple" id="thrAnalise"><span class="thr-ico">▥</span><span class="thr-card-copy"><b>Análise</b><span>Estatísticas e frequências</span></span><span class="thr-arrow">›</span></button>
          <button class="thr-card c-blue" id="thrComb"><span class="thr-ico">⚙</span><span class="thr-card-copy"><b>Combinações</b><span>Gere jogos com filtros avançados</span></span><span class="thr-arrow">›</span></button>
          <button class="thr-card c-green" id="thrJogos"><span class="thr-ico">▶</span><span class="thr-card-copy"><b>Jogos</b><span>Gerencie seus jogos e resultados</span></span><span class="thr-arrow">›</span></button>
          <button class="thr-card c-orange" id="thrCalc"><span class="thr-ico">▦</span><span class="thr-card-copy"><b>Calculadora</b><span>Probabilidades e estimativas</span></span><span class="thr-arrow">›</span></button>
          <button class="thr-card c-red" id="thrPalpites"><span class="thr-ico">◎</span><span class="thr-card-copy"><b>Palpites</b><span>Sugestões inteligentes</span></span><span class="thr-arrow">›</span></button>
          <button class="thr-card c-cyan" id="thrResultados2"><span class="thr-ico">🏆</span><span class="thr-card-copy"><b>Resultados</b><span>Consulte os últimos concursos</span></span><span class="thr-arrow">›</span></button>
          <button class="thr-card c-pink" id="thrSequencias"><span class="thr-ico">★</span><span class="thr-card-copy"><b>Minhas Sequências</b><span>Salve e analise suas sequências</span></span><span class="thr-arrow">›</span></button>
          <button class="thr-card c-indigo" id="thrAnalisador"><span class="thr-ico">▤</span><span class="thr-card-copy"><b>Analisador<br>de Jogos</b><span>Confira o potencial dos seus jogos</span></span><span class="thr-arrow">›</span></button>
          <button class="thr-card c-gray" id="thrConfig"><span class="thr-ico">🔧</span><span class="thr-card-copy"><b>Configurações</b><span>Personalize o aplicativo</span></span><span class="thr-arrow">›</span></button>
        </section>

        <button class="thr-result-strip" id="thrResultados" style="width:calc(100% - 26px);color:inherit;text-align:left;cursor:pointer">
          <span class="rs-left"><span class="rs-icon">🎯</span><span><span class="rs-cap">ÚLTIMO RESULTADO</span><b>CONCURSO 3268</b><small>12/09/2026</small></span></span>
          <span class="rs-balls"><span class="rs-ball">02</span><span class="rs-ball">04</span><span class="rs-ball">06</span><span class="rs-ball">07</span><span class="rs-ball">09</span><span class="rs-ball">11</span><span class="rs-ball">13</span><span class="rs-ball">16</span><span class="rs-ball">18</span><span class="rs-ball">20</span></span>
          <span class="rs-right"><span class="rs-icon">🗓</span><span><span class="rs-cap" style="color:#eee">PRÓXIMO CONCURSO</span><b>3269</b><small>13/09/2026</small></span></span>
        </button>

        <section class="thr-quote">
          <div class="qtext">“Grandes resultados<br>são construídos com<br>pequenas escolhas diárias.”</div>
          <div class="qright">PLANEJE<br>ANALISE<br>JOGUE<br>EVOLUA<b>THOR LOTERIAS</b></div>
        </section>

        <nav class="thr-bottom">
          <button class="thr-nav active" id="thrInicio"><i>⌂</i>Início</button>
          <button class="thr-nav" id="thrNavAnalise"><i>▥</i>Análise</button>
          <button class="thr-nav" id="thrNavComb"><i>▦</i>Combinações</button>
          <button class="thr-nav" id="thrNavCalc"><i>▤</i>Calculadora</button>
          <button class="thr-nav" id="thrNavJogos"><i>🎟</i>Jogos</button>
        </nav>
        <div class="thr-foot">THOR LOTERIAS<small>ESTRATÉGIA EM CADA JOGO</small></div>
      </div>`;
    document.body.appendChild(root);

    function hide(){root.style.display='none'}
    function show(){if(logged())root.style.display='block'}
    function go(id){hide();setTimeout(function(){click(id)},0)}
    function resultado(){hide();try{if(typeof openResultadoOverlay==='function')openResultadoOverlay(window.homeGameAtual||window.LOTOFACIL_GAME)}catch(e){}}

    q('thrMenu').onclick=function(){hide();if(typeof openDrawer==='function')openDrawer();else click('btnMenu')};
    q('thrBrandAction').onclick=function(){};
    q('thrAnalise').onclick=function(){go('btnTendenciaAtalho')};
    q('thrComb').onclick=function(){go('btnFechamentoAtalho')};
    q('thrJogos').onclick=function(){go('btnJogosSalvosAtalho2')};
    q('thrCalc').onclick=function(){go('btnSimularAtalho')};
    q('thrPalpites').onclick=function(){go('btnAbrirFechamentoAtalho')};
    q('thrResultados').onclick=resultado;q('thrResultados2').onclick=resultado;
    q('thrSequencias').onclick=function(){go('menuMinhasSequencias')};
    q('thrAnalisador').onclick=function(){go('menuAnalisadorJogos')};
    q('thrConfig').onclick=function(){hide();if(typeof openDrawer==='function')openDrawer();else click('btnMenu')};
    q('thrInicio').onclick=function(){show();try{if(typeof goHome==='function')goHome()}catch(e){}};
    q('thrNavAnalise').onclick=q('thrAnalise').onclick;
    q('thrNavComb').onclick=q('thrComb').onclick;
    q('thrNavCalc').onclick=q('thrCalc').onclick;
    q('thrNavJogos').onclick=q('thrJogos').onclick;
    var start=q('btnInicioAtalho');if(start)start.addEventListener('click',show,true);

    function clock(){
      var d=new Date(),dias=['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];
      var date=dias[d.getDay()]+', '+String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();
      var time=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
      if(q('thrDate'))q('thrDate').textContent=date;
      if(q('thrTime'))q('thrTime').textContent=time;
    }
    clock();setInterval(clock,30000);
  }

  function start(){
    if(logged()){makeHome();return}
    var tentativas=0;
    var timer=setInterval(function(){
      tentativas++;
      if(logged()){clearInterval(timer);makeHome()}
      else if(tentativas>180){clearInterval(timer)}
    },500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
