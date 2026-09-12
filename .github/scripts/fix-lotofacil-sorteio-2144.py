from pathlib import Path
import re
VERSAO='2026-09-12-0142'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
css='''
  .gfc-fixas-inline{grid-column:1/-1;display:none;background:#fff;border:1.5px solid #A21CAF;border-radius:10px;padding:9px;margin-top:2px;}
  .gfc-fixas-inline.show{display:block;}
  .gfc-fixas-inline-title{font-family:'Baloo 2',sans-serif;font-size:11px;font-weight:800;color:#7E22CE;margin-bottom:6px;text-align:left;}
  .gfc-fixas-inline .conf-grid{grid-template-columns:repeat(5,1fr);gap:5px;}
  .gfc-fixas-inline-actions{display:flex;align-items:center;justify-content:space-between;gap:7px;margin-top:7px;}
  .gfc-fixas-inline-actions .conf-count{margin:0;font-size:10.5px;}
  .gfc-fixas-inline-actions button{padding:5px 9px;border-radius:8px;font-size:10.5px;}
  .gerador-jogo-ball.fixa-gerador{border:2px solid #F59E0B !important;box-shadow:0 0 0 2px rgba(245,158,11,.22);font-weight:900 !important;}
'''
if '.gfc-fixas-inline{' not in s:
    alvo="  .gfc-fixas-btn.tem-fixas{background:#F3E8FF;border-color:#A21CAF;color:#4C1D95;}\n"
    if alvo not in s: raise SystemExit('CSS Fixas não encontrado')
    s=s.replace(alvo,alvo+css,1)
needle='''          <div class="gfc-dark-input-wrap">\n            <input type="number" inputmode="numeric" id="gfcFiltroSoma" placeholder=" ">\n            <span>Soma</span>\n          </div>\n        </div>\n        <div id="gfcFiltroAlerta"'''
repl='''          <div class="gfc-dark-input-wrap">\n            <input type="number" inputmode="numeric" id="gfcFiltroSoma" placeholder=" ">\n            <span>Soma</span>\n          </div>\n          <div class="gfc-fixas-inline" id="gfcFixasInline">\n            <div class="gfc-fixas-inline-title">📌 Escolha as dezenas fixas</div>\n            <div class="conf-grid" id="gfcFixasGridInline"></div>\n            <div class="gfc-fixas-inline-actions">\n              <div class="conf-count">Selecionadas: <strong id="gfcFixasCountInline">0</strong></div>\n              <div style="display:flex;gap:6px;">\n                <button type="button" class="btn-cancel" id="gfcFixasLimparInline">LIMPAR</button>\n                <button type="button" class="btn-confirm" id="gfcFixasOkInline">OK</button>\n              </div>\n            </div>\n          </div>\n        </div>\n        <div id="gfcFiltroAlerta"'''
if 'id="gfcFixasGridInline"' not in s:
    if needle not in s: raise SystemExit('grade de filtros não encontrada')
    s=s.replace(needle,repl,1)
novo='''function gfcRenderFixasGrid(){
  const grids=[document.getElementById('gfcFixasGridInline'), document.getElementById('gfcFixasGrid')].filter(Boolean);
  const counts=[document.getElementById('gfcFixasCountInline'), document.getElementById('gfcFixasCount')].filter(Boolean);
  if(!grids.length || !geradorGameAtual) return;
  const min=geradorGameAtual.range.min, max=geradorGameAtual.range.max;
  grids.forEach(grid=>{
    grid.innerHTML='';
    for(let n=min;n<=max;n++){
      const b=document.createElement('button');
      b.type='button'; b.className='conf-ball'+(gfcFixasSelecionadas.has(n)?' on':'');
      b.textContent=String(n).padStart(2,'0'); b.dataset.n=n;
      b.addEventListener('click',()=>{
        if(gfcFixasSelecionadas.has(n)) gfcFixasSelecionadas.delete(n);
        else if(gfcFixasSelecionadas.size < (gfc.dezenas||GERADOR_APOSTA_SIZE[geradorGameAtual.code]||0)) gfcFixasSelecionadas.add(n);
        gfcRenderFixasGrid(); gfcAtualizarFixasCampo();
      });
      grid.appendChild(b);
    }
  });
  counts.forEach(count=>count.textContent=gfcFixasSelecionadas.size);
}

function gfcAbrirFixas(){
  if(!geradorGameAtual) return;
  gfcRenderFixasGrid();
  const painel=document.getElementById('gfcFixasInline');
  if(painel) painel.classList.toggle('show');
}

document.getElementById('gfcFiltroFixas')?.addEventListener('click', e=>{ e.stopPropagation(); gfcAbrirFixas(); });
document.getElementById('gfcFixasWrap')?.addEventListener('click', e=>{ if(e.target.id!=='gfcFiltroFixas') gfcAbrirFixas(); });
document.getElementById('gfcFixasOkInline')?.addEventListener('click',()=>{
  gfcAtualizarFixasCampo();
  document.getElementById('gfcFixasInline')?.classList.remove('show');
});
document.getElementById('gfcFixasLimparInline')?.addEventListener('click',()=>{
  gfcFixasSelecionadas.clear(); gfcRenderFixasGrid(); gfcAtualizarFixasCampo();
});
document.getElementById('gfcFixasConfirmar')?.addEventListener('click',()=>{
  gfcAtualizarFixasCampo();
  document.getElementById('overlayGfcFixas')?.classList.remove('show');
});
document.getElementById('gfcFixasLimpar')?.addEventListener('click',()=>{
  gfcFixasSelecionadas.clear(); gfcRenderFixasGrid(); gfcAtualizarFixasCampo();
});

function gerarJogoPersonalizado'''
s,n=re.subn(r"function gfcRenderFixasGrid\(\)\{.*?function gerarJogoPersonalizado",novo,s,count=1,flags=re.S)
if n!=1: raise SystemExit('bloco JS Fixas não encontrado')
s=s.replace("        ${jogo.map(n=>{\n          const acertou = conferindo && resultadoSet.has(n);", "        ${jogo.map(n=>{\n          const fixa = gfcFixasSelecionadas.has(n);\n          const acertou = conferindo && resultadoSet.has(n);",1)
s=s.replace('return `<span class="gerador-jogo-ball" data-num="${n}" style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background-image:${bg};background-size:cover;background-position:center;background-blend-mode:multiply;border:1px solid ${acertou ? \'transparent\' : \'var(--line,#E7DFF5)\'};color:${acertou ? \'#fff\' : \'var(--violet-deep)\'};font-family:\'Baloo 2\',sans-serif;font-size:10.5px;font-weight:700;text-shadow:${acertou ? \'0 1px 2px rgba(0,0,0,.35)\' : \'0 1px 2px rgba(255,255,255,.9)\'};">${n.toString().padStart(2,\'0\')}</span>`;', 'return `<span class="gerador-jogo-ball${fixa ? \' fixa-gerador\' : \'\'}" data-num="${n}" title="${fixa ? \'Dezena fixa\' : \'\'}" style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background-image:${bg};background-size:cover;background-position:center;background-blend-mode:multiply;border:${fixa ? \'2px solid #F59E0B\' : (\'1px solid \'+(acertou ? \'transparent\' : \'var(--line,#E7DFF5)\'))};color:${acertou ? \'#fff\' : \'var(--violet-deep)\'};font-family:\'Baloo 2\',sans-serif;font-size:10.5px;font-weight:${fixa ? \'900\' : \'700\'};text-shadow:${acertou ? \'0 1px 2px rgba(0,0,0,.35)\' : \'0 1px 2px rgba(255,255,255,.9)\'};">${n.toString().padStart(2,\'0\')}</span>`;',1)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1)
sw.write_text(t,encoding='utf-8')
