from pathlib import Path
import re
VERSAO='2026-09-12-0054'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
css='''\n  @keyframes somaSpinnerGirar{\n    0%{transform:rotate(0deg);}\n    100%{transform:rotate(360deg);}\n  }\n  .soma-loading-spinner{\n    display:inline-block!important;\n    width:13px;height:13px;box-sizing:border-box;\n    border:2px solid rgba(255,255,255,.45);\n    border-top-color:#fff;border-right-color:#fff;\n    border-radius:50%;margin-right:6px;vertical-align:-2px;\n    animation:somaSpinnerGirar .55s linear infinite!important;\n    -webkit-animation:somaSpinnerGirar .55s linear infinite!important;\n  }\n'''
if 'somaSpinnerGirar' not in s:
    s=s.replace('  @keyframes analiseSpinner{',css+'  @keyframes analiseSpinner{',1)
old="if(btn){ btn.disabled=true; setBtnLoading('somaAtualizarBtn', true, 'ANALISANDO'); }\n  if(status) status.textContent = `Analisando os últimos ${qtd} concursos…`;"
new="""if(btn){\n    btn.disabled=true;\n    btn.setAttribute('aria-busy','true');\n    btn.innerHTML='<span class=\"soma-loading-spinner\" aria-hidden=\"true\"></span><span>ANALISANDO</span>';\n  }\n  if(status) status.textContent = `Analisando os últimos ${qtd} concursos…`;\n  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));"""
s=s.replace(old,new,1)
s=s.replace("if(req===somaRequestId && btn){ btn.disabled=false; setBtnLoading('somaAtualizarBtn', false); btn.textContent='ANALISAR'; }","if(req===somaRequestId && btn){ btn.disabled=false; btn.removeAttribute('aria-busy'); btn.textContent='ANALISAR'; }",1)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1)
sw.write_text(t,encoding='utf-8')
