from pathlib import Path
import re

VER='2026-09-12-0535'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VER}';", s, count=1)

opcoes={
 'gfcFiltroPares':'[6,7,8,9,10,11,12]',
 'gfcFiltroImpares':'[6,7,8,9,10,11,12]',
 'gfcFiltroPrimos':'[2,3,4,5,6,7,8,9]',
 'gfcFiltroFib':'[3,4,5,6,7]',
 'gfcFiltroMoldura':'[8,9,10,11,12,13,14,15]',
 'gfcFiltroCentro':'[5,6,7,8,9]',
 'gfcFiltroMult3':'[2,3,4,5,6,7,8]'
}
for nome,vals in opcoes.items():
    s,n=re.subn(rf"{nome}:\[[^\]]*\]", f"{nome}:{vals}", s, count=1)
    if n!=1: raise SystemExit(f'{nome} nao encontrado')

# Botao global para zerar todos os filtros.
if 'id="gfcLimparFiltrosBtn"' not in s:
    alvo='''        </div>\n        <div id="gfcFiltroAlerta" class="gfc-filtro-alerta" role="alert" aria-live="polite"></div>\n\n        <button type="button" class="gfc-dark-btn" id="geradorFiltroGerarBtn">'''
    repl='''        </div>\n        <button type="button" id="gfcLimparFiltrosBtn" style="width:100%;margin-top:8px;padding:8px 10px;border:1.5px solid #A21CAF;border-radius:10px;background:#fff;color:#7E22CE;font-family:'Baloo 2',sans-serif;font-weight:800;font-size:11px;cursor:pointer;">🧹 LIMPAR FILTROS</button>\n        <div id="gfcFiltroAlerta" class="gfc-filtro-alerta" role="alert" aria-live="polite"></div>\n\n        <button type="button" class="gfc-dark-btn" id="geradorFiltroGerarBtn">'''
    if alvo not in s: raise SystemExit('ponto do botao limpar filtros nao encontrado')
    s=s.replace(alvo,repl,1)

novo_bloco="""function gfcLimparTodosFiltros(){
  gfcFixasSelecionadas.clear();
  GFC_MULTI_IDS.forEach(id=>{
    gfcMultiSelecionados[id].clear();
    gfcAtualizarMultiBotao(id);
  });
  const somaEl=document.getElementById('gfcFiltroSoma');
  if(somaEl) somaEl.value='';
  gfcAtualizarFixasCampo();
  document.getElementById('gfcMultiInline')?.classList.remove('show');
  document.getElementById('gfcFixasInline')?.classList.remove('show');
  const alerta=document.getElementById('gfcFiltroAlerta');
  if(alerta){ alerta.classList.remove('ativo'); alerta.textContent=''; }
  if(typeof gfcRenderFixasGrid==='function' && geradorGameAtual) gfcRenderFixasGrid();
  gfcValidarFiltrosInstantaneo();
}

function gfcInicializar(g){
  const depSize = GERADOR_APOSTA_SIZE[g.code];
  const rangeSize = g.range.max - g.range.min + 1;
  gfc.dezenas = depSize;
  gfc.repetidas = gfcClamp(Math.round((depSize*depSize)/rangeSize), 0, depSize);
  gfc.qtd = 10;
  gfcAtualizarTela();
  gfcLimparTodosFiltros();
  const analiseEl = document.getElementById('geradorFiltroAnalise');
  if(analiseEl) analiseEl.innerHTML = '';
}

document.getElementById('gfcLimparFiltrosBtn')?.addEventListener('click',()=>{
  gfcLimparTodosFiltros();
});
"""

if 'function gfcLimparTodosFiltros(){' not in s:
    padrao=r"function gfcInicializar\(g\)\{.*?\n\}\n\n(?=document\.getElementById\('gfcDezenasMenos'\))"
    s,n=re.subn(padrao,novo_bloco+'\n',s,count=1,flags=re.S)
    if n!=1: raise SystemExit('gfcInicializar nao encontrado')

p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VER}';", t, count=1)
sw.write_text(t,encoding='utf-8')
