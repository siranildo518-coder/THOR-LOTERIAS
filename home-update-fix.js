/* THOR LOTERIAS — Atualizar sem desmontar a tela inicial antes da hora */
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

  async function esperarSW(reg){
    if(!reg) return;
    try{ await reg.update(); }catch(_){ }
    const limite=Date.now()+6500;
    while(Date.now()<limite){
      if(reg.waiting){
        try{reg.waiting.postMessage({type:'SKIP_WAITING'});}catch(_){ }
        break;
      }
      if(reg.installing){
        await new Promise(r=>setTimeout(r,120));
        continue;
      }
      break;
    }
    if(reg.waiting){
      await Promise.race([
        new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true})),
        new Promise(resolve=>setTimeout(resolve,1200))
      ]);
    }
  }

  async function atualizarSemPiscar(){
    if(atualizando) return;
    atualizando=true;
    fixarHome();

    try{
      /* baixa os arquivos novos enquanto a tela atual continua intacta */
      await Promise.allSettled([
        fetch('./index.html?_thor_pre='+Date.now(),{cache:'no-store'}),
        fetch('./app-main.html?_thor_pre='+Date.now(),{cache:'no-store'}),
        fetch('./home-topo-thor.css?_thor_pre='+Date.now(),{cache:'no-store'}),
        fetch('./home-update-fix.js?_thor_pre='+Date.now(),{cache:'no-store'})
      ]);

      if('serviceWorker' in navigator){
        const reg=await navigator.serviceWorker.getRegistration();
        await esperarSW(reg);
      }
    }catch(err){
      console.warn('Atualização THOR:',err);
    }

    /* só troca a página depois que a atualização terminou */
    sessionStorage.setItem('thor_voltando_home','1');
    const u=new URL(location.href);
    u.searchParams.set('_thor_update',Date.now().toString());
    location.replace(u.toString());
  }

  document.addEventListener('click',function(e){
    const btn=e.target&&e.target.closest?e.target.closest('#menuAtualizar'):null;
    if(!btn) return;
    /* impede o Atualizar antigo, que recarregava imediatamente e causava a piscada */
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    atualizarSemPiscar();
  },true);
})();
