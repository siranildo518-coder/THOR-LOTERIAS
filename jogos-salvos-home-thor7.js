(function(){'use strict';
function abrirJogosSalvos(){
  var tela=document.getElementById('thorJogosSalvosTelaIndependente');
  if(!tela){
    tela=document.createElement('div');
    tela.id='thorJogosSalvosTelaIndependente';
    tela.style.cssText='display:none;position:fixed;inset:0;z-index:2147482000;background:#07101f;color:#fff;overflow:auto;font-family:Arial,sans-serif';
    tela.innerHTML='<div style="height:54px;display:flex;align-items:center;gap:12px;padding:0 14px;border-bottom:1px solid #28496c;position:sticky;top:0;background:#07101f"><button id="thorJogosSalvosVoltar" style="width:40px;height:34px;border:1px solid #597895;border-radius:7px;background:#263c52;color:#fff;font-size:20px">←</button><strong style="font-size:17px">Jogos Salvos</strong></div><div id="thorJogosSalvosConteudo" style="padding:18px;text-align:center;color:#b9c8d8">Seus jogos salvos aparecerão aqui.</div>';
    document.body.appendChild(tela);
    document.getElementById('thorJogosSalvosVoltar').onclick=function(){tela.style.display='none'};
  }
  tela.style.display='block';
}
function adicionar(){
  var grid=document.getElementById('homeFeatureGrid');
  if(!grid)return false;
  var antigo=document.getElementById('thorJogosSalvosHome');if(antigo)antigo.remove();
  var b=document.createElement('button');b.className='home-feature-card';b.id='thorJogosSalvosHome';b.style.setProperty('--fc','#00a66a');
  b.innerHTML='<span class="hfc-icon">★</span><span><strong>Jogos Salvos</strong><small>Acesse seus jogos salvos</small></span>';
  b.onclick=function(e){e.preventDefault();e.stopPropagation();abrirJogosSalvos()};
  grid.appendChild(b);return true;
}
var n=0;function iniciar(){if(adicionar())return;if(++n<60)setTimeout(iniciar,200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();
})();