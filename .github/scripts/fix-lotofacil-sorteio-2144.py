from pathlib import Path
import re

VER='2026-09-12-0537'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VER}';", s, count=1)

# Mantem o filtro multiplo de repetidas criado na 0536.
if 'id="gfcFiltroRepetidas"' not in s: raise SystemExit('controle de repetidas nao encontrado')
if "'gfcFiltroRepetidas'" not in s: raise SystemExit('repetidas nao esta nos filtros multiplos')

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
}
"""
if "if(id==='gfcFiltroRepetidas')" not in s:
    s,n=re.subn(r"function gfcAbrirMulti\(id\)\{.*?(?=GFC_MULTI_IDS\.forEach)",new_open,s,count=1,flags=re.S)
    if n!=1: raise SystemExit('gfcAbrirMulti nao encontrado')

p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VER}';", t, count=1)
sw.write_text(t,encoding='utf-8')
