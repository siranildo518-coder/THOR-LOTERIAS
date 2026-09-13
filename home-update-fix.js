/* THOR LOTERIAS — mantém a tela inicial cobrindo a tela-base durante Atualizar */
(function(){
  function prepararAtualizacao(){
    const home=document.getElementById('overlayListaResultados');
    if(home){
      home.classList.add('show');
      home.style.display='block';
      home.style.visibility='visible';
      home.style.opacity='1';
      home.style.zIndex='2147483000';
    }
    document.documentElement.classList.add('thor-home-atualizando');
  }
  document.addEventListener('click',function(e){
    const btn=e.target && e.target.closest ? e.target.closest('#menuAtualizar') : null;
    if(!btn) return;
    prepararAtualizacao();
  },true);
})();
