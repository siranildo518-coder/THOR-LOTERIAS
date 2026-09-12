from pathlib import Path
import re

VER='2026-09-12-0537'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VER}';", s, count=1)

old='''        <div class="gfc-dark-label">Repetidas do concurso anterior</div>\n        <div class="gfc-dark-stepper-row">\n          <button type="button" class="gfc-dark-stepper-btn" id="gfcRepMenos">−</button>\n          <input type="number" inputmode="numeric" class="gfc-dark-value-input" id="gfcRepValor" value="9">\n          <button type="button" class="gfc-dark-stepper-btn plus" id="gfcRepMais">+</button>\n        </div>'''
new='''        <div class="gfc-dark-label">Repetidas do concurso anterior</div>\n        <div class="gfc-dark-input-wrap" style="margin-bottom:8px;">\n          <button type="button" id="gfcFiltroRepetidas" class="gfc-multi-btn" data-label="Repetidas" style="width:100%;">Repetidas</button>\n        </div>'''
if old in s:
    s=s.replace(old,new,1)
elif 'id="gfcFiltroRepetidas"' not in s:
    raise SystemExit('controle de repetidas nao encontrado')

s=s.replace("const GFC_MULTI_IDS=['gfcFiltroPares'", "const GFC_MULTI_IDS=['gfcFiltroRepetidas','gfcFiltroPares'",1)
s=s.replace("return ({gfcFiltroPares:[6,7,8,9,10,11,12]", "return ({gfcFiltroRepetidas:[6,7,8,9,10,11,12],gfcFiltroPares:[6,7,8,9,10,11,12]",1)

old2="""  const elD = document.getElementById('gfcDezenasValor');
  const elR = document.getElementById('gfcRepValor');
  const elQ = document.getElementById('gfcQtdValor');
  if(elD) elD.value = gfc.dezenas;
  if(elR) elR.value = gfc.repetidas;
  if(elQ) elQ.value = gfc.qtd;"""
new2="""  const elD = document.getElementById('gfcDezenasValor');
  const elQ = document.getElementById('gfcQtdValor');
  if(elD) elD.value = gfc.dezenas;
  if(elQ) elQ.value = gfc.qtd;
  gfcAtualizarMultiBotao('gfcFiltroRepetidas');"""
if old2 in s: s=s.replace(old2,new2,1)

s=re.sub(r"document\.getElementById\('gfcRepMenos'\)\.addEventListener\('click', \(\)=>\{.*?\}\);\ndocument\.getElementById\('gfcRepMais'\)\.addEventListener\('click', \(\)=>\{.*?\}\);\n",'',s,count=1,flags=re.S)
s=re.sub(r"document\.getElementById\('gfcRepValor'\)\.addEventListener\([^;]+;\n",'',s,count=1)

s=s.replace("const repetidasAlvo = gfc.repetidas;", "const repetidasSelecionadas = gfcFiltroValores('gfcFiltroRepetidas');\n  const repetidasAlvos = repetidasSelecionadas || [gfc.repetidas];",1)
oldcall="const jogo = gerarJogoPersonalizado(min, max, dezenasPorJogo, ultimoSet, repetidasAlvo, filtroPares, filtroImpares, filtroPrimos, filtrosExtra);"
newcall="const repetidasAlvo = repetidasAlvos[(tries-1) % repetidasAlvos.length];\n      const jogo = gerarJogoPersonalizado(min, max, dezenasPorJogo, ultimoSet, repetidasAlvo, filtroPares, filtroImpares, filtroPrimos, filtrosExtra);"
if oldcall in s: s=s.replace(oldcall,newcall,1)
elif 'repetidasAlvos[(tries-1) % repetidasAlvos.length]' not in s: raise SystemExit('geracao por repetidas nao encontrada')

old_diag="""      const conflitos = diagnosticarFiltrosIncompativeis(
        min, max, dezenasPorJogo, ultimoSet, repetidasAlvo,
        filtroPares, filtroImpares, filtroPrimos, filtrosExtra
      );"""
new_diag="""      let conflitos = [];
      for(const repTeste of repetidasAlvos){
        const c = diagnosticarFiltrosIncompativeis(
          min, max, dezenasPorJogo, ultimoSet, repTeste,
          filtroPares, filtroImpares, filtroPrimos, filtrosExtra
        );
        if(c.length && (!conflitos.length || c.length < conflitos.length)) conflitos = c;
      }
      if(repetidasSelecionadas && repetidasSelecionadas.length){
        conflitos = [{chave:'repetidas', label:'Repetidas', valor:repetidasSelecionadas.join(' / ')}].concat(conflitos);
      }"""
if old_diag in s: s=s.replace(old_diag,new_diag,1)

old_open="function gfcAbrirMulti(id){ gfcMultiAtual=id; gfcRenderMulti(); document.getElementById('gfcFixasInline')?.classList.remove('show'); document.getElementById('gfcMultiInline')?.classList.add('show'); }"
new_open="""function gfcAbrirMulti(id){
  gfcMultiAtual=id;
  const painel=document.getElementById('gfcMultiInline');
  const repetidasBtn=document.getElementById('gfcFiltroRepetidas');
  const filtrosGrid=document.querySelector('.gfc-dark-filtros');
  const fixasInline=document.getElementById('gfcFixasInline');
  if(painel){
    if(id==='gfcFiltroRepetidas'){
      const wrap=repetidasBtn?.closest('.gfc-dark-input-wrap');
      if(wrap) wrap.insertAdjacentElement('afterend',painel);
    }else if(filtrosGrid){
      if(fixasInline && fixasInline.parentElement===filtrosGrid) filtrosGrid.insertBefore(painel,fixasInline);
      else filtrosGrid.appendChild(painel);
    }
  }
  gfcRenderMulti();
  document.getElementById('gfcFixasInline')?.classList.remove('show');
  painel?.classList.add('show');
}"""
if old_open in s: s=s.replace(old_open,new_open,1)
elif "if(id==='gfcFiltroRepetidas')" not in s: raise SystemExit('gfcAbrirMulti nao encontrado')

s=s.replace('Não foi possível gerar jogos com essa configuração de dezenas repetidas. Ajuste a quantidade de repetidas e toque em GERAR novamente.', 'Não foi possível gerar jogos com essa combinação de filtros. Ajuste as repetidas ou outro filtro e toque em GERAR novamente.',1)

p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VER}';", t, count=1)
sw.write_text(t,encoding='utf-8')
