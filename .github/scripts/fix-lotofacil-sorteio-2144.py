from pathlib import Path
import re
VERSAO='2026-09-12-0058'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
s=re.sub(r"\n\s*@keyframes somaSpinnerGirar\{.*?\n\s*\}\n\s*\.soma-loading-spinner\{.*?\n\s*\}\n",'\n',s,count=1,flags=re.S)
s=s.replace("    btn.innerHTML='<span class=\"soma-loading-spinner\" aria-hidden=\"true\"></span><span>ANALISANDO</span>';","    btn.textContent='ANALISANDO';",1)
s=s.replace("  // dá tempo ao navegador para desenhar a bolinha antes de iniciar as consultas\n  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));\n",'',1)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1)
sw.write_text(t,encoding='utf-8')
