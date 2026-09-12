(function(){
  function q(id){return document.getElementById(id)}
  function click(id){var e=q(id);if(e)e.click()}
  function existing(id){return q(id)}
  function makeHome(){
    if(q('thorRefHomeLite'))return;
    var root=document.createElement('div');
    root.id='thorRefHomeLite';
    root.innerHTML='<div class="thr-shell">'+
      '<div class="thr-top">'+
        '<button class="thr-menu" id="thrMenu">☰</button>'+
        '<div class="thr-brand"><div class="thr-thor">THOR</div><div class="thr-lot">LOTERIAS</div></div>'+
        '<div class="thr-clock"><div class="thr-date" id="thrDate">--</div><div class="thr-time" id="thrTime">--:--</div></div>'+
      '</div>'+
      '<div class="thr-welcome"><strong>Bem-vindo de volta, Irenildo! 👋</strong><span>Boa sorte nos seus jogos de hoje.</span></div>'+
      '<div class="thr-stats"><div class="thr-stat"><b>12</b><span>Jogos Salvos</span></div><div class="thr-stat"><b>4</b><span>Análises Hoje</span></div><div class="thr-stat"><b>8</b><span>Palpites</span></div></div>'+
      '<button class="thr-last" id="thrResultados" style="width:100%;color:inherit;text-align:left;cursor:pointer"><h3>★ Último resultado</h3><span class="thr-small">Lotofácil • Concurso atual</span><div class="thr-balls"><span class="thr-ball">01</span><span class="thr-ball">03</span><span class="thr-ball">05</span><span class="thr-ball">06</span><span class="thr-ball">08</span><span class="thr-ball">09</span><span class="thr-ball">11</span><span class="thr-ball">12</span><span class="thr-ball">13</span><span class="thr-ball">15</span><span class="thr-ball">17</span><span class="thr-ball">18</span><span class="thr-ball">20</span><span class="thr-ball">22</span><span class="thr-ball">25</span></div></button>'+
      '<div class="thr-section-title">Acesso rápido</div>'+
      '<div class="thr-grid">'+
        '<button class="thr-card c-red" id="thrAnalise"><span class="thr-ico">📊</span><span>Análise</span></button>'+
        '<button class="thr-card c-blue" id="thrComb"><span class="thr-ico">🧩</span><span>Combinações</span></button>'+
        '<button class="thr-card c-green" id="thrJogos"><span class="thr-ico">🎟️</span><span>Jogos</span></button>'+
        '<button class="thr-card c-orange" id="thrCalc"><span class="thr-ico">🧮</span><span>Calculadora</span></button>'+
        '<button class="thr-card c-purple" id="thrPalpites"><span class="thr-ico">💡</span><span>Palpites</span></button>'+
        '<button class="thr-card c-cyan" id="thrResultados2"><span class="thr-ico">🏆</span><span>Resultados</span></button>'+
        '<button class="thr-card c-red" id="thrSequencias"><span class="thr-ico">🔢</span><span>Minhas Sequências</span></button>'+
        '<button class="thr-card c-blue" id="thrAnalisador"><span class="thr-ico">🎯</span><span>Analisador de Jogos</span></button>'+
        '<button class="thr-card c-green" id="thrConfig"><span class="thr-ico">⚙️</span><span>Configurações</span></button>'+
      '</div>'+
      '<button class="thr-close-home" id="thrFechar">abrir tela original</button>'+
    '</div>'+
    '<div class="thr-bottom">'+
      '<button class="thr-nav active" id="thrInicio"><i>⌂</i>Início</button>'+
      '<button class="thr-nav" id="thrNavAnalise"><i>▥</i>Análise</button>'+
      '<button class="thr-nav" id="thrNavComb"><i>▦</i>Combinações</button>'+
      '<button class="thr-nav" id="thrNavCalc"><i>▣</i>Calculadora</button>'+
      '<button class="thr-nav" id="thrNavJogos"><i>🎟</i>Jogos</button>'+
    '</div>';
    document.body.appendChild(root);

    function hide(){root.style.display='none'}
    function show(){root.style.display='block'}
    function go(id){hide();setTimeout(function(){click(id)},0)}
    function resultado(){hide();try{if(typeof openResultadoOverlay==='function')openResultadoOverlay(window.homeGameAtual||window.LOTOFACIL_GAME)}catch(e){}}
    q('thrMenu').onclick=function(){hide();if(typeof openDrawer==='function')openDrawer();else click('btnMenu')};
    q('thrAnalise').onclick=function(){go('btnTendenciaAtalho')};
    q('thrComb').onclick=function(){go('btnFechamentoAtalho')};
    q('thrJogos').onclick=function(){go('btnJogosSalvosAtalho2')};
    q('thrCalc').onclick=function(){go('btnSimularAtalho')};
    q('thrPalpites').onclick=function(){go('btnAbrirFechamentoAtalho')};
    q('thrResultados').onclick=resultado;q('thrResultados2').onclick=resultado;
    q('thrSequencias').onclick=function(){go('menuMinhasSequencias')};
    q('thrAnalisador').onclick=function(){go('menuAnalisadorJogos')};
    q('thrConfig').onclick=function(){hide();if(typeof openDrawer==='function')openDrawer();else click('btnMenu')};
    q('thrFechar').onclick=hide;
    q('thrInicio').onclick=function(){show();try{if(typeof goHome==='function')goHome()}catch(e){}};
    q('thrNavAnalise').onclick=q('thrAnalise').onclick;q('thrNavComb').onclick=q('thrComb').onclick;q('thrNavCalc').onclick=q('thrCalc').onclick;q('thrNavJogos').onclick=q('thrJogos').onclick;

    var homeBtns=['btnInicioAtalho'];homeBtns.forEach(function(id){var e=existing(id);if(e)e.addEventListener('click',show,true)});
    function clock(){var d=new Date(),dias=['DOM','SEG','TER','QUA','QUI','SEX','SÁB'];var date=dias[d.getDay()]+', '+String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();var time=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');if(q('thrDate'))q('thrDate').textContent=date;if(q('thrTime'))q('thrTime').textContent=time}
    clock();setInterval(clock,30000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',makeHome,{once:true});else makeHome();
})();
