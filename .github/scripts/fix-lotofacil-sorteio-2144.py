from pathlib import Path
import re

VERSAO = '2026-09-11-2314'

p = Path('index.html')
s = p.read_text(encoding='utf-8')
s = re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VERSAO}';", s, count=1)

if 'const CONCURSO_CACHE_LOTERIA = new Map();' not in s:
    s = s.replace(
        'async function fetchConcursoLoteria(game, concurso){\n',
        "// Cache em memória dos concursos já buscados. Ao tocar em Anterior/Próximo,\n// o resultado abre instantaneamente se já foi pré-carregado.\nconst CONCURSO_CACHE_LOTERIA = new Map();\nfunction chaveCacheConcurso(game, concurso){ return `${game.code}:${concurso}`; }\nfunction obterConcursoCache(game, concurso){\n  if(!concurso) return null;\n  return CONCURSO_CACHE_LOTERIA.get(chaveCacheConcurso(game, concurso)) || null;\n}\n\nasync function fetchConcursoLoteria(game, concurso){\n  const emCache = obterConcursoCache(game, concurso);\n  if(emCache) return emCache;\n",
        1
    )

s = s.replace(
    "        controllers.forEach((c, i)=>{ if(i !== idx) try{ c.abort(); }catch(e){} });\n        resolve(data);",
    "        controllers.forEach((c, i)=>{ if(i !== idx) try{ c.abort(); }catch(e){} });\n        if(data && data.concurso){\n          CONCURSO_CACHE_LOTERIA.set(chaveCacheConcurso(game, Number(data.concurso)), data);\n        }\n        resolve(data);",
    1
)

s = s.replace(
    "  box.innerHTML = `<div class=\"res-loading\">Buscando ${concurso ? 'concurso Nº '+concurso : 'o último resultado'} de ${g.nome}…</div>`;\n  try{\n    const data = await fetchConcursoLoteria(g, concurso);",
    "  const cacheImediato = obterConcursoCache(g, concurso);\n  if(cacheImediato){\n    renderUltimoResultadoGerador(g, cacheImediato);\n    return;\n  }\n  box.innerHTML = `<div class=\"res-loading\">Buscando ${concurso ? 'concurso Nº '+concurso : 'o último resultado'} de ${g.nome}…</div>`;\n  try{\n    const data = await fetchConcursoLoteria(g, concurso);",
    1
)

s = s.replace(
    "  document.getElementById('geradorResAnterior').addEventListener('click', ()=> carregarUltimoResultadoGerador(g, data.concurso-1));\n  const btnProx = document.getElementById('geradorResProximo');\n  if(btnProx) btnProx.addEventListener('click', ()=> carregarUltimoResultadoGerador(g, data.concurso+1));",
    "  const abrirConcursoRapido = (numero)=>{\n    const pronto = obterConcursoCache(g, numero);\n    if(pronto) renderUltimoResultadoGerador(g, pronto);\n    else carregarUltimoResultadoGerador(g, numero);\n  };\n  document.getElementById('geradorResAnterior').addEventListener('click', ()=> abrirConcursoRapido(data.concurso-1));\n  const btnProx = document.getElementById('geradorResProximo');\n  if(btnProx) btnProx.addEventListener('click', ()=> abrirConcursoRapido(data.concurso+1));\n\n  // Pré-carrega os concursos vizinhos enquanto o usuário olha a tela.\n  fetchConcursoLoteria(g, data.concurso-1).catch(()=>{});\n  if(podeAvancar) fetchConcursoLoteria(g, data.concurso+1).catch(()=>{});",
    1
)

p.write_text(s, encoding='utf-8')

sw = Path('sw.js')
t = sw.read_text(encoding='utf-8')
t = re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VERSAO}';", t, count=1)
sw.write_text(t, encoding='utf-8')
