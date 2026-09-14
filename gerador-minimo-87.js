// THOR LOTERIAS - filtro de qualidade historica minima
// Base 142 preservada. Quantidade de jogos escolhida pelo usuario (1 a 30).
(function(){
  const MIN_INDICE=87;
  function qtdDesejada(){
    const el=document.getElementById('qtdJogos');
    return Math.max(1,Math.min(30,parseInt(el&&el.value)||30));
  }
  function criarCampo(){
    if(document.getElementById('qtdJogos'))return;
    const controls=document.querySelector('.controls');
    const gerar=document.getElementById('gerar');
    if(!controls||!gerar)return;
    const label=document.createElement('label');
    label.className='label';
    label.style.marginTop='10px';
    label.textContent='Quantidade de jogos (1 a 30)';
    const input=document.createElement('input');
    input.className='field';
    input.id='qtdJogos';
    input.type='number';
    input.min='1';
    input.max='30';
    input.value='30';
    input.inputMode='numeric';
    controls.appendChild(label);
    controls.appendChild(input);
    function atualizar(){
      let q=Math.max(1,Math.min(30,parseInt(input.value)||30));
      gerar.innerHTML='🎲 &nbsp; GERAR '+q+' JOGO'+(q===1?'':'S');
    }
    input.addEventListener('input',atualizar);
    input.addEventListener('change',()=>{input.value=qtdDesejada();atualizar()});
    atualizar();
  }
  function aplicar(){
    criarCampo();
    if(typeof window.render!=='function' || window.__thorFiltro87)return false;
    const renderOriginal=window.render;
    window.render=function(jogos,key,n){
      const limite=qtdDesejada();
      const aprovados=(Array.isArray(jogos)?jogos:[])
        .filter(o=>o&&Number(o.p)>=MIN_INDICE)
        .sort((a,b)=>Number(b.p)-Number(a.p))
        .slice(0,limite);
      const out=document.getElementById('out');
      const status=document.getElementById('status');
      if(!aprovados.length){
        if(out)out.innerHTML='';
        if(status)status.textContent='Nenhum jogo atingiu o índice histórico mínimo de 87% neste cruzamento. Aumente a quantidade de concursos ou tente novamente.';
        return;
      }
      renderOriginal(aprovados,key,n);
      if(status)status.textContent=aprovados.length+' jogo'+(aprovados.length===1?'':'s')+' gerado'+(aprovados.length===1?'':'s')+' com índice histórico de 87% ou mais, calculado pelo cruzamento de frequência, recência e atraso em '+n+' concursos. Índice histórico não é garantia de prêmio.';
    };
    window.__thorFiltro87=true;
    return true;
  }
  if(!aplicar())setTimeout(aplicar,0);
})();