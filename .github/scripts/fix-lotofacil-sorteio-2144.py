from pathlib import Path
import re

VER='2026-09-12-0533'
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

anchor="function diagnosticarFiltrosIncompativeis(min, max, dezenasPorJogo, ultimoSet, repetidasAlvo, filtroPares, filtroImpares, filtroPrimos, filtrosExtra){\n"
normalizacao=(
"  const comoLista = v => v===null || v===undefined ? null : (Array.isArray(v) ? v : [v]);\n"
"  filtroPares = comoLista(filtroPares);\n"
"  filtroImpares = comoLista(filtroImpares);\n"
"  filtroPrimos = comoLista(filtroPrimos);\n"
"  filtrosExtra = {...filtrosExtra,\n"
"    fib: comoLista(filtrosExtra.fib),\n"
"    moldura: comoLista(filtrosExtra.moldura),\n"
"    centro: comoLista(filtrosExtra.centro),\n"
"    mult3: comoLista(filtrosExtra.mult3)\n"
"  };\n"
)
if normalizacao not in s:
    if anchor not in s: raise SystemExit('diagnosticarFiltrosIncompativeis nao encontrado')
    s=s.replace(anchor, anchor+normalizacao, 1)

s=s.replace(
"if(v.pares!==null && v.impares!==null && !v.pares.some(p=>v.impares.some(i=>p+i===k))){",
"if(v.pares!==null && v.impares!==null && !([...(Array.isArray(v.pares)?v.pares:[v.pares])]).some(p=>(Array.isArray(v.impares)?v.impares:[v.impares]).some(i=>p+i===k))){",
1)
s=s.replace(
"if(v.moldura!==null && v.centro!==null && !v.moldura.some(m=>v.centro.some(c=>m+c===k))){",
"if(v.moldura!==null && v.centro!==null && !([...(Array.isArray(v.moldura)?v.moldura:[v.moldura])]).some(m=>(Array.isArray(v.centro)?v.centro:[v.centro]).some(c=>m+c===k))){",
1)

p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VER}';", t, count=1)
sw.write_text(t,encoding='utf-8')
