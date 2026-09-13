/* THOR LOTERIAS — atualização leve, sem desmontar a home antes da hora */
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
  async function atualizar(){
    if(atualizando)return;
    atualizando=true;
    fixarHome();
    try{
      if('serviceWorker' in navigator){
        const reg=await navigator.serviceWorker.getRegistration();
        if(reg){
          await Promise.race([reg.update(),new Promise(r=>setTimeout(r,1800))]);
          if(reg.waiting){try{reg.waiting.postMessage({type:'SKIP_WAITING'})}catch(_){}}
        }
      }
    }catch(_){ }
    sessionStorage.setItem('thor_voltando_home','1');
    const u=new URL(location.href);
    u.searchParams.set('_thor_update',Date.now().toString());
    location.replace(u.toString());
  }
  document.addEventListener('click',function(e){
    const btn=e.target&&e.target.closest?e.target.closest('#menuAtualizar'):null;
    if(!btn)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    atualizar();
  },true);
})();
