from pathlib import Path
import re

VER='2026-09-12-0532'
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

p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VER}';", t, count=1)
sw.write_text(t,encoding='utf-8')
