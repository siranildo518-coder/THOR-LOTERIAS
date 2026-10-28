/* THOR — teste Fechamento Personalizado: restaura Meus Jogos Salvos e visual dourado */
(function(){
const css=`
#overlayGeradorFiltro #geradorFiltroTabJogos{display:block!important;flex:1!important;width:auto!important}
#gfcJogosSalvosTela{display:none!important}
#gfcJogosSalvosTela[style*="display: flex"],#gfcJogosSalvosTela[style*="display:flex"]{display:flex!important;background:#fff5d3!important;color:#1b1b1b!important}
#gfcJogosSalvosTela>header{background:linear-gradient(90deg,#161616,#303030)!important;color:#ffd866!important;border-bottom:4px solid #f4c64b!important}
#gfcJogosSalvosTela #geradorFiltroTabPanelSalvos{padding:12px!important;max-width:700px;width:100%;margin:auto;box-sizing:border-box}
#gfcJogosSalvosTela #geradorFiltroTabPanelSalvos>section{border:3px solid #222!important;border-radius:19px!important;background:linear-gradient(#fff8df,#ffdc6b)!important;box-shadow:inset 0 0 0 4px #ffe9a4,0 3px 6px #0005!important;padding:16px!important}
#gfcJogosSalvosTela #geradorFiltroTabPanelSalvos button{border-radius:11px!important;font-weight:800!important}
#gfcJogosSalvosTela #geradorFiltroTabPanelSalvos>section span{background:radial-gradient(circle at 32% 20%,#a9a9a9,#242424 65%,#050505)!important;box-shadow:0 3px 5px #0005!important;color:white!important}
#thorFechLoterias{display:flex;gap:5px;overflow-x:auto;padding:10px;background:#ffe28c;flex-shrink:0;scrollbar-width:thin}
#thorFechLoterias button{white-space:nowrap;border:2px solid #171717;border-radius:10px;background:linear-gradient(#fff6c9,#f2b927);color:#171717;font-weight:800;padding:9px 11px}
#thorFechLoterias button.ativo{background:linear-gradient(#292929,#050505);color:#ffdf65}
`;
function instalar(){
 if(!document.getElementById('thorFechStyle')){let st=document.createElement('style');st.id='thorFechStyle';st.textContent=css;document.head.append(st)}
 const tela=document.getElementById('gfcJogosSalvosTela');
 if(!tela||document.getElementById('thorFechLoterias'))return;
 const bar=document.createElement('nav');bar.id='thorFechLoterias';bar.setAttribute('aria-label','Selecionar loteria dos jogos salvos');
 const games=[['LF','Lotofácil'],['MS','Mega-Sena'],['QU','Quina'],['DS','Dia de Sorte'],['LM','Lotomania'],['TM','Timemania'],['DU','Dupla Sena']];
 games.forEach(([code,label])=>{
 const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.code=code;
 b.addEventListener('click',()=>{
  try{
   if(typeof window.abrirGeradorFiltro==='function')window.abrirGeradorFiltro(code);
   else if(typeof abrirGeradorFiltro==='function')abrirGeradorFiltro(code);
   if(typeof window.mostrarJogosSalvosFechamento==='function')window.mostrarJogosSalvosFechamento();
   else if(typeof mostrarJogosSalvosFechamento==='function')mostrarJogosSalvosFechamento();
   bar.querySelectorAll('button').forEach(x=>x.classList.toggle('ativo',x===b));
  }catch(e){console.error('Fechamento salvos:',e)}
 });
 bar.append(b);
 });
 tela.querySelector('header')?.after(bar);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',instalar);else instalar();
let n=0;const timer=setInterval(()=>{instalar();if(++n>50||document.getElementById('thorFechLoterias'))clearInterval(timer)},500);
})();
