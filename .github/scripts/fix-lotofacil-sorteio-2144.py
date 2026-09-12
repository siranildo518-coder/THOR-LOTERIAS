from pathlib import Path
import re
VERSAO='2026-09-12-0048'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
s=s.replace('id="somaQtdInput" min="2" max="500" value="100"','id="somaQtdInput" min="2" max="500" value="300"',1)
s=s.replace("let qtd=parseInt(input?.value||'100',10); if(!Number.isFinite(qtd))qtd=100;", "let qtd=parseInt(input?.value||'300',10); if(!Number.isFinite(qtd))qtd=300;",1)
old="""    const dados=new Array(numeros.length); dados[0]=ultimo;\n    await Promise.all(numeros.slice(1).map((c,i)=>fetchConcursoLoteria(game,c).then(d=>dados[i+1]=d).catch(()=>dados[i+1]=null)));\n    if(req!==somaRequestId)return;\n    const validos=dados.filter(d=>d&&Array.isArray(d.dezenas)), contagens=[0,0,0,0,0,0];"""
new="""    const dados=new Array(numeros.length); dados[0]=ultimo;\n    const buscarComTentativas=async(concurso)=>{\n      for(let tentativa=0;tentativa<3;tentativa++){\n        try{const d=await fetchConcursoLoteria(game,concurso);if(d&&Array.isArray(d.dezenas))return d;}catch(e){}\n        await new Promise(r=>setTimeout(r,120+tentativa*180));\n      }\n      return null;\n    };\n    const pendentes=numeros.slice(1), lote=18;\n    for(let ini=0;ini<pendentes.length;ini+=lote){\n      if(req!==somaRequestId)return;\n      const fatia=pendentes.slice(ini,ini+lote);\n      const respostas=await Promise.all(fatia.map(c=>buscarComTentativas(c)));\n      respostas.forEach((d,j)=>{dados[ini+1+j]=d;});\n      if(status){const feitos=Math.min(numeros.length,ini+fatia.length+1);status.textContent=`Analisando ${feitos} de ${qtd} concursos…`;}\n      if(ini+lote<pendentes.length)await new Promise(r=>setTimeout(r,70));\n    }\n    if(req!==somaRequestId)return;\n    const validos=dados.filter(d=>d&&Array.isArray(d.dezenas)), contagens=[0,0,0,0,0,0];"""
if old in s:s=s.replace(old,new,1)
s=s.replace("renderSomaFaixas(contagens,validos.length); if(status)status.textContent=`${validos.length} concurso${validos.length===1?'':'s'} analisado${validos.length===1?'':'s'}.`; somaCarregouUmaVez=true;", "renderSomaFaixas(contagens,validos.length); if(status)status.textContent=validos.length===qtd?`${qtd} concursos analisados.`:`${validos.length} de ${qtd} concursos analisados.`; somaCarregouUmaVez=true;",1)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1)
sw.write_text(t,encoding='utf-8')
