from pathlib import Path
import re

VER='2026-09-12-0538'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VER}';", s, count=1)

old='''        <div class="gfc-dark-label">Repetidas do concurso anterior</div>\n        <div class="gfc-dark-input-wrap" style="margin-bottom:8px;">\n          <button type="button" id="gfcFiltroRepetidas" class="gfc-multi-btn" data-label="Repetidas" style="width:100%;">Repetidas</button>\n        </div>'''
new='''        <div class="gfc-dark-label">Repetidas do concurso anterior</div>\n        <div class="gfc-dark-stepper-row" id="gfcRepetidasRow">\n          <button type="button" class="gfc-dark-stepper-btn" id="gfcRepMenos">−</button>\n          <button type="button" class="gfc-dark-value-input gfc-repetidas-value" id="gfcFiltroRepetidas" data-label="Repetidas" value="">9</button>\n          <button type="button" class="gfc-dark-stepper-btn plus" id="gfcRepMais">+</button>\n        </div>'''
if old in s: s=s.replace(old,new,1)
elif 'id="gfcRepetidasRow"' not in s: raise SystemExit('bloco repetidas nao encontrado')

if '.gfc-repetidas-value{' not in s:
    s=s.replace('</style>', "\n.gfc-repetidas-value{cursor:pointer;display:flex;align-items:center;justify-content:center;text-align:center;border:1px solid var(--line,#E7DFF5);background:#fff;color:#4C1D95;font-weight:800;appearance:none;-webkit-appearance:none;}\n</style>",1)

# Garante opcoes 6 a 12 na Lotofacil.
if 'gfcFiltroRepetidas:[6,7,8,9,10,11,12]' not in s:
    s=s.replace('const opcoes={\n', 'const opcoes={\n      gfcFiltroRepetidas:[6,7,8,9,10,11,12],\n', 1)

newfun="""function gfcAtualizarMultiBotao(id){
  const el=document.getElementById(id), set=gfcMultiSelecionados[id]; if(!el||!set)return;
  const label=el.dataset.label||''; const vals=[...set].sort((a,b)=>a-b);
  if(id==='gfcFiltroRepetidas'){
    const fallback = gfc.repetidas ?? 9;
    el.textContent = vals.length ? vals.join(' / ') : String(fallback);
    el.value = vals.join(',');
    el.classList.toggle('tem-valores',!!vals.length);
    return;
  }
  el.textContent=vals.length?`${label} (${vals.join(' / ')})`:label; el.value=vals.join(','); el.classList.toggle('tem-valores',!!vals.length);
}
"""
if "const fallback = gfc.repetidas ?? 9;" not in s:
    s,n=re.subn(r"function gfcAtualizarMultiBotao\(id\)\{.*?\}\n(?=function gfcRenderMulti)", newfun, s, count=1, flags=re.S)
    if n!=1: raise SystemExit('gfcAtualizarMultiBotao nao encontrado')

s=s.replace("const wrap=repetidasBtn?.closest('.gfc-dark-input-wrap');\n      if(wrap) wrap.insertAdjacentElement('afterend',painel);", "const row=document.getElementById('gfcRepetidasRow') || repetidasBtn?.closest('.gfc-dark-stepper-row');\n      if(row) row.insertAdjacentElement('afterend',painel);",1)

anchor="GFC_MULTI_IDS.forEach(id=>document.getElementById(id)?.addEventListener('click',()=>gfcAbrirMulti(id)));"
extra="""GFC_MULTI_IDS.forEach(id=>document.getElementById(id)?.addEventListener('click',()=>gfcAbrirMulti(id)));

function gfcAjustarRepetidas(delta){
  const opcoes=gfcOpcoesFiltro('gfcFiltroRepetidas');
  if(!opcoes.length) return;
  const set=gfcMultiSelecionados.gfcFiltroRepetidas;
  const atuais=[...set].sort((a,b)=>a-b);
  let atual=atuais.length===1?atuais[0]:(gfc.repetidas ?? opcoes[0]);
  let idx=opcoes.indexOf(atual);
  if(idx<0) idx=0;
  idx=Math.max(0,Math.min(opcoes.length-1,idx+delta));
  set.clear();
  set.add(opcoes[idx]);
  gfc.repetidas=opcoes[idx];
  gfcAtualizarMultiBotao('gfcFiltroRepetidas');
  gfcValidarFiltrosInstantaneo();
}
document.getElementById('gfcRepMenos')?.addEventListener('click',()=>gfcAjustarRepetidas(-1));
document.getElementById('gfcRepMais')?.addEventListener('click',()=>gfcAjustarRepetidas(1));"""
if 'function gfcAjustarRepetidas(delta){' not in s:
    if anchor not in s: raise SystemExit('listeners multi nao encontrados')
    s=s.replace(anchor,extra,1)

p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VER}';", t, count=1)
sw.write_text(t,encoding='utf-8')
