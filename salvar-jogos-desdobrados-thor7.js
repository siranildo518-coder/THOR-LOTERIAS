// THOR 7 V96 - botão compacto Salvar Jogos na tela Jogos Desdobrados.
(function(){'use strict';
function instalar(){
  if(document.getElementById('thorSalvarJogosCompacto')) return true;
  var els=[].slice.call(document.querySelectorAll('div,span,p,strong,h1,h2,h3'));
  var resumo=els.find(function(el){return /jogos gerados de .*dezenas cada/i.test((el.textContent||'').trim())});
  if(!resumo)return false;
  var btn=document.createElement('button');
  btn.id='thorSalvarJogosCompacto';
  btn.type='button';
  btn.innerHTML='<span style="font-size:15px">▣</span>&nbsp; SALVAR JOGOS';
  btn.style.cssText='display:block;width:calc(100% - 28px);height:34px;margin:8px auto 12px;padding:0 12px;border:2px solid #f1b82d;border-radius:11px;background:linear-gradient(180deg,#22c85b,#07923b);color:#fff;font-weight:900;font-size:13px;line-height:30px;text-align:center;box-shadow:0 3px 0 #066a2e;cursor:pointer;';
  resumo.insertAdjacentElement('afterend',btn);
  btn.addEventListener('click',function(){
    var candidatos=['thor_meus_jogos','thorMeusJogos','thorJogosSalvos'];
    var salvo=false;
    try{
      var jogos=[];
      document.querySelectorAll('[class*="game"],[class*="jogo"]').forEach(function(el){
        var nums=(el.textContent||'').match(/\b\d{1,2}\b/g);
        if(nums&&nums.length>=5)jogos.push(nums.map(function(n){return String(parseInt(n,10)).padStart(2,'0')}));
      });
      if(jogos.length){
        var chave=candidatos[0], banco=[];try{banco=JSON.parse(localStorage.getItem(chave)||'[]');if(!Array.isArray(banco))banco=[]}catch(e){banco=[]}
        banco.push({data:new Date().toISOString(),jogos:jogos});localStorage.setItem(chave,JSON.stringify(banco));salvo=true;
      }
    }catch(e){}
    var antigo=btn.innerHTML;btn.innerHTML=salvo?'✓ JOGOS SALVOS':'✓ SALVAR JOGOS';setTimeout(function(){btn.innerHTML=antigo},1400);
  });
  return true;
}
function tentar(){if(instalar())return;setTimeout(tentar,250)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tentar,{once:true});else tentar();
new MutationObserver(instalar).observe(document.documentElement,{childList:true,subtree:true});
})();