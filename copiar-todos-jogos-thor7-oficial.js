(function(){
  'use strict';
  if(window.__thorCopiarTodosOficial)return;
  window.__thorCopiarTodosOficial=true;

  function numerosDoCard(card){
    var nums=Array.from(card.querySelectorAll('.balls .ball')).map(function(ball){
      var valor=(ball.textContent||'').trim();
      if(!/^\d{1,3}$/.test(valor))return NaN;
      return Number(valor);
    });
    var lot=document.getElementById('lot'),tipo=lot&&lot.value;
    var limites={lotofacil:25,megasena:60,quina:80,lotomania:100,diadesorte:31,timemania:80,duplasena:50};
    var max=limites[tipo],min=tipo==='lotomania'?0:1;
    if(tipo==='supersete'){max=9;min=0}
    var qtd=document.getElementById('qtdDezenas');
    var esperada=qtd?Number(qtd.value):null;
    if(!nums.length||nums.some(function(n){return !Number.isInteger(n)||(max!==undefined&&(n<min||n>max))}))throw Error('Jogo com dezena inválida.');
    if(tipo!=='supersete'&&new Set(nums).size!==nums.length)throw Error('Jogo com dezenas repetidas.');
    if(Number.isInteger(esperada)&&esperada>0&&nums.length!==esperada)throw Error('Jogo com '+nums.length+' dezenas; solicitado '+esperada+'.');
    return nums.map(function(n){return String(tipo==='lotomania'&&n===100?0:n).padStart(2,'0')}).join(' ');
  }
  window.thorCopiarNumerosCard=numerosDoCard;
  function jogosDaTela(){
    var cards=Array.from(document.querySelectorAll('#out .game'));
    var jogos=cards.map(numerosDoCard);
    if(new Set(jogos).size!==jogos.length)throw Error('Há jogos repetidos. Gere novamente antes de copiar.');
    return jogos;
  }

  function copiarFallback(texto){
    var area=document.createElement('textarea');
    area.value=texto;
    area.setAttribute('readonly','');
    area.style.position='fixed';
    area.style.opacity='0';
    document.body.appendChild(area);
    area.select();
    var ok=false;
    try{ok=document.execCommand('copy')}catch(_){}
    area.remove();
    return ok;
  }

  async function copiarTodos(){
    var status=document.getElementById('status');
    var jogos;
    try{jogos=jogosDaTela()}catch(e){if(status)status.textContent='Não copiado: '+e.message;return}
    if(!jogos.length){
      if(status)status.textContent='Gere os jogos antes de copiar.';
      return;
    }
    var texto=jogos.join('\n');
    var ok=false;
    try{
      if(navigator.clipboard&&window.isSecureContext){
        await navigator.clipboard.writeText(texto);
        ok=true;
      }
    }catch(_){}
    if(!ok)ok=copiarFallback(texto);
    if(status)status.textContent=ok
      ? '✓ '+jogos.length+' jogos copiados. Agora é só colar no Mobile Loterias.'
      : 'Não foi possível copiar. Tente novamente.';
    var btn=document.getElementById('copiarTodosJogosOficial');
    if(btn&&ok){
      var antigo=btn.innerHTML;
      btn.innerHTML='✓ COPIADOS';
      setTimeout(function(){btn.innerHTML=antigo},1800);
    }
  }

  function montar(){
    var salvar=document.getElementById('salvar');
    if(!salvar||document.getElementById('copiarTodosJogosOficial'))return false;
    var linha=document.createElement('div');
    linha.id='acoesJogosOficial';
    salvar.parentNode.insertBefore(linha,salvar);
    linha.appendChild(salvar);
    var copiar=document.createElement('button');
    copiar.id='copiarTodosJogosOficial';
    copiar.type='button';
    copiar.innerHTML='▣ COPIAR TODOS';
    copiar.onclick=copiarTodos;
    linha.appendChild(copiar);

    var css=document.createElement('style');
    css.id='copiarTodosJogosOficialCss';
    css.textContent=
      '#acoesJogosOficial{display:flex;gap:7px;width:94%;margin:9px 3% 0;align-items:stretch}'+
      '#acoesJogosOficial #salvar,#copiarTodosJogosOficial{display:none;flex:1;width:auto!important;margin:0!important;height:36px;border:2px solid #ff9a00;border-radius:8px;color:#fff;font-size:11px;font-weight:900;box-shadow:inset 0 2px 2px rgba(255,255,255,.45),inset 0 -4px 6px rgba(0,0,0,.42),0 3px 0 #884100;text-shadow:0 1px 2px #000}'+
      '#acoesJogosOficial #salvar{background:linear-gradient(#36a9ff,#1476d4 45%,#07509e)}'+
      '#copiarTodosJogosOficial{background:linear-gradient(#39ec77,#13bd4e 46%,#087b31)}'+
      '#acoesJogosOficial #salvar[style*="display: block"],#acoesJogosOficial #salvar[style*="display:block"]{display:block!important}'+
      '#acoesJogosOficial #salvar[style*="display: block"]+#copiarTodosJogosOficial,#acoesJogosOficial #salvar[style*="display:block"]+#copiarTodosJogosOficial{display:block}'+
      '#acoesJogosOficial button:active{transform:translateY(2px);box-shadow:inset 0 3px 5px rgba(0,0,0,.42),0 1px 0 #884100}';
    document.head.appendChild(css);

    var obs=new MutationObserver(function(){
      copiar.style.display=document.querySelectorAll('#out .game').length?'block':'none';
    });
    obs.observe(document.getElementById('out'),{childList:true,subtree:true});
    return true;
  }

  if(!montar()){
    var tentativas=0;
    var timer=setInterval(function(){if(montar()||++tentativas>40)clearInterval(timer)},250);
  }
})();