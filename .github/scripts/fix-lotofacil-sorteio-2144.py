from pathlib import Path
import re

p = Path('index.html')
s = p.read_text(encoding='utf-8')
VER = '2026-09-12-0225'

s = re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VER}';", s, count=1)

pat = r"function gfcOpcoesFiltro\(id\)\{.*?\}\nfunction gfcAtualizarMultiBotao"
novo = """function gfcOpcoesFiltro(id){
  if(geradorGameAtual?.code==='LF'){
    const opcoes={
      gfcFiltroPares:[6,7,8,9,10,11,12],
      gfcFiltroImpares:[6,7,8,9,10,11,12],
      gfcFiltroPrimos:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      gfcFiltroFib:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      gfcFiltroMoldura:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      gfcFiltroCentro:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      gfcFiltroMult3:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
    };
    return opcoes[id]||[];
  }
  const k=gfc.dezenas||0;
  return Array.from({length:k+1},(_,i)=>i);
}
function gfcAtualizarMultiBotao"""
s, n = re.subn(pat, novo, s, count=1, flags=re.S)
if n != 1:
    raise SystemExit('gfcOpcoesFiltro nao encontrado')

p.write_text(s, encoding='utf-8')

sw = Path('sw.js')
t = sw.read_text(encoding='utf-8')
t = re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VER}';", t, count=1)
sw.write_text(t, encoding='utf-8')
