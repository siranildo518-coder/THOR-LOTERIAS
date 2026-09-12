from pathlib import Path
import re
VERSAO='2026-09-12-0149'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
old="  .gfc-fixas-inline .conf-grid{grid-template-columns:repeat(5,1fr);gap:5px;}"
new="  .gfc-fixas-inline .conf-grid{grid-template-columns:repeat(5,30px);gap:4px;justify-content:center;max-width:none;}\n  .gfc-fixas-inline .conf-ball{width:30px;height:30px;aspect-ratio:auto;border-radius:7px;font-size:8.5px;}"
if old in s:
    s=s.replace(old,new,1)
elif new not in s:
    raise SystemExit('CSS da grade Fixas não encontrado')
p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1)
sw.write_text(t,encoding='utf-8')
