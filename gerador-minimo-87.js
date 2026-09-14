// THOR LOTERIAS - filtro de qualidade historica minima
// Base 142 preservada. O percentual continua sendo indice historico, nao garantia de premio.
(function(){
  const MIN_INDICE=87;
  function aplicar(){
    if(typeof window.render!=='function' || window.__thorFiltro87)return false;
    const renderOriginal=window.render;
    window.render=function(jogos,key,n){
      const aprovados=(Array.isArray(jogos)?jogos:[])
        .filter(o=>o&&Number(o.p)>=MIN_INDICE)
        .sort((a,b)=>Number(b.p)-Number(a.p))
        .slice(0,30);
      const out=document.getElementById('out');
      const status=document.getElementById('status');
      if(!aprovados.length){
        if(out)out.innerHTML='';
        if(status)status.textContent='Nenhum jogo atingiu o índice histórico mínimo de 87% neste cruzamento. Aumente a quantidade de concursos ou tente novamente.';
        return;
      }
      renderOriginal(aprovados,key,n);
      if(status)status.textContent=aprovados.length+' jogo'+(aprovados.length===1?'':'s')+' com índice histórico de 87% ou mais, calculado pelo cruzamento de frequência, recência e atraso em '+n+' concursos. Índice histórico não é garantia de prêmio.';
    };
    window.__thorFiltro87=true;
    return true;
  }
  if(!aplicar())setTimeout(aplicar,0);
})();