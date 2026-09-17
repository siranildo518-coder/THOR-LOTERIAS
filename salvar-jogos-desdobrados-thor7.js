// THOR 7 V98 - salva e abre diretamente a tela Jogos Salvos.
(function(){'use strict';
function abrirSalvos(){
  var homeBtn=document.getElementById('thorJogosSalvosHome');
  if(homeBtn){homeBtn.click();return true}
  var tela=document.getElementById('thorJogosSalvosTelaIndependente');
  if(tela){tela.style.display='block';return true}
  return false;
}
function instalar(){
  if(document.getElementById('thorSalvarJogosCompacto'))return true;
  var label=document.getElementById('gamesCountLabel2');
  if(!label)return false;
  var faixa=label.parentElement;
  if(!faixa||!faixa.parentElement)return false;
  var btn=document.createElement('button');
  btn.id='thorSalvarJogosCompacto';btn.type='button';btn.innerHTML='▣ &nbsp; SALVAR JOGOS';
  btn.style.cssText='display:block;width:calc(100% - 28px);height:32px;margin:0 auto 12px;padding:0 10px;border:2px solid #f1b82d;border-radius:10px;background:linear-gradient(180deg,#22c85b,#07923b);color:#fff;font-weight:900;font-size:12px;line-height:28px;text-align:center;box-shadow:0 3px 0 #066a2e;cursor:pointer;';
  faixa.insertAdjacentElement('afterend',btn);
  btn.onclick=function(){
    try{
      var jogos=(typeof lastGames!=='undefined'&&Array.isArray(lastGames))?lastGames:[];
      if(!jogos.length){btn.textContent='NENHUM JOGO PARA SALVAR';setTimeout(function(){btn.innerHTML='▣ &nbsp; SALVAR JOGOS'},1300);return}
      var chave='thor_meus_jogos',banco=[];try{banco=JSON.parse(localStorage.getItem(chave)||'[]');if(!Array.isArray(banco))banco=[]}catch(_){banco=[]}
      banco.push({data:new Date().toISOString(),jogos:jogos.map(function(j){return j.slice()})});
      localStorage.setItem(chave,JSON.stringify(banco));
      btn.textContent='✓ JOGOS SALVOS';
      setTimeout(function(){abrirSalvos()},180);
    }catch(e){btn.textContent='NÃO FOI POSSÍVEL SALVAR';setTimeout(function(){btn.innerHTML='▣ &nbsp; SALVAR JOGOS'},1300)}
  };
  return true;
}
function tentar(){if(!instalar())setTimeout(tentar,200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tentar,{once:true});else tentar();
new MutationObserver(function(){instalar()}).observe(document.documentElement,{childList:true,subtree:true});
})();