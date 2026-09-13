/* THOR LOTERIAS — atualização em segundo plano, sem desmontar a home */
(function(){
  let atualizando=false;
  function fixarHome(){
    const home=document.getElementById('overlayListaResultados');
    if(home){
      home.classList.add('show');
      home.style.setProperty('display','block','important');
      home.style.setProperty('visibility','visible','important');
      home.style.setProperty('opacity','1','important');
      home.style.setProperty('z-index','2147483000','important');
      home.style.setProperty('transform','none','important');
      home.style.setProperty('transition','none','important');
      home.style.setProperty('animation','none','important');
    }
    document.documentElement.classList.add('thor-home-atualizando');
  }
  function liberarHome(){
    document.documentElement.classList.remove('thor-home-atualizando');
    atualizando=false;
  }
  async function atualizar(){
    if(atualizando)return;
    atualizando=true;
    fixarHome();
    try{
      if('serviceWorker' in navigator){
        const reg=await navigator.serviceWorker.getRegistration();
        if(reg){
          await Promise.race([reg.update(),new Promise(r=>setTimeout(r,1800))]);
          if(reg.waiting){
            try{reg.waiting.postMessage({type:'SKIP_WAITING'})}catch(_){}
          }
        }
      }
      /* Atualiza os arquivos no cache em segundo plano. Não navega nem desmonta a tela atual. */
      await Promise.allSettled([
        fetch('./index.html?_thor_refresh='+Date.now(),{cache:'reload'}),
        fetch('./app-main.html?_thor_refresh='+Date.now(),{cache:'reload'})
      ]);
    }catch(_){ }
    liberarHome();
  }
  document.addEventListener('click',function(e){
    const btn=e.target&&e.target.closest?e.target.closest('#menuAtualizar'):null;
    if(!btn)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    atualizar();
  },true);
})();
