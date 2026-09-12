from pathlib import Path
import re

VER='2026-09-12-0534'
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

cruzamento="""function gfcCruzarFiltrosSelecionados(k, filtros){
  const lista = v => v===null || v===undefined ? null : (Array.isArray(v) ? [...v] : [v]);
  const out = {
    pares: lista(filtros.pares),
    impares: lista(filtros.impares),
    primos: lista(filtros.primos),
    fib: lista(filtros.fib),
    moldura: lista(filtros.moldura),
    centro: lista(filtros.centro),
    mult3: lista(filtros.mult3),
    soma: filtros.soma
  };
  const cruzarComplementares = (a,b)=>{
    if(a===null || b===null) return [a,b];
    const aValidos = a.filter(x=>b.some(y=>x+y===k));
    const bValidos = b.filter(y=>a.some(x=>x+y===k));
    return [aValidos,bValidos];
  };
  [out.pares,out.impares] = cruzarComplementares(out.pares,out.impares);
  [out.moldura,out.centro] = cruzarComplementares(out.moldura,out.centro);
  return out;
}

"""
if 'function gfcCruzarFiltrosSelecionados(k, filtros){' not in s:
    anchor='function gfcValidarFiltrosInstantaneo(){'
    if anchor not in s: raise SystemExit('gfcValidarFiltrosInstantaneo nao encontrado')
    s=s.replace(anchor,cruzamento+anchor,1)

old="""  const parseFiltro = id => {
    const v = document.getElementById(id).value;
    return v==='' ? null : gfcClamp(parseInt(v,10), 0, dezenasPorJogo);
  };
  const filtroPares = parseFiltro('gfcFiltroPares');
  const filtroImpares = parseFiltro('gfcFiltroImpares');
  const filtroPrimos = parseFiltro('gfcFiltroPrimos');
  const filtroFib = parseFiltro('gfcFiltroFib');
  const filtroMoldura = parseFiltro('gfcFiltroMoldura');
  const filtroCentro = parseFiltro('gfcFiltroCentro');
  const filtroMult3 = parseFiltro('gfcFiltroMult3');
  const somaValor = document.getElementById('gfcFiltroSoma').value;
  const filtroSoma = somaValor==='' ? null : Math.max(0, parseInt(somaValor,10) || 0);

  const centroArr = centroDoJogo(g) || [];
  const molduraArr = molduraDoJogo(g) || [];
  const filtrosExtra = {
    fib: filtroFib, moldura: filtroMoldura, centro: filtroCentro, mult3: filtroMult3, soma: filtroSoma,
    fibSet: FIB, molduraSet: new Set(molduraArr), centroSet: new Set(centroArr), fixasSet: new Set(gfcFixasSelecionadas)
  };
"""
new="""  let filtroPares = gfcFiltroValores('gfcFiltroPares');
  let filtroImpares = gfcFiltroValores('gfcFiltroImpares');
  let filtroPrimos = gfcFiltroValores('gfcFiltroPrimos');
  let filtroFib = gfcFiltroValores('gfcFiltroFib');
  let filtroMoldura = gfcFiltroValores('gfcFiltroMoldura');
  let filtroCentro = gfcFiltroValores('gfcFiltroCentro');
  let filtroMult3 = gfcFiltroValores('gfcFiltroMult3');
  const somaValor = document.getElementById('gfcFiltroSoma').value;
  const filtroSoma = somaValor==='' ? null : Math.max(0, parseInt(somaValor,10) || 0);

  const filtrosCruzados = gfcCruzarFiltrosSelecionados(dezenasPorJogo, {
    pares:filtroPares, impares:filtroImpares, primos:filtroPrimos, fib:filtroFib,
    moldura:filtroMoldura, centro:filtroCentro, mult3:filtroMult3, soma:filtroSoma
  });
  filtroPares = filtrosCruzados.pares;
  filtroImpares = filtrosCruzados.impares;
  filtroPrimos = filtrosCruzados.primos;
  filtroFib = filtrosCruzados.fib;
  filtroMoldura = filtrosCruzados.moldura;
  filtroCentro = filtrosCruzados.centro;
  filtroMult3 = filtrosCruzados.mult3;

  const centroArr = centroDoJogo(g) || [];
  const molduraArr = molduraDoJogo(g) || [];
  const filtrosExtra = {
    fib: filtroFib, moldura: filtroMoldura, centro: filtroCentro, mult3: filtroMult3, soma: filtroSoma,
    fibSet: FIB, molduraSet: new Set(molduraArr), centroSet: new Set(centroArr), fixasSet: new Set(gfcFixasSelecionadas)
  };
"""
if old in s:
    s=s.replace(old,new,1)
elif 'const filtrosCruzados = gfcCruzarFiltrosSelecionados' not in s:
    raise SystemExit('bloco de filtros do gerador nao encontrado')

p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VER}';", t, count=1)
sw.write_text(t,encoding='utf-8')
