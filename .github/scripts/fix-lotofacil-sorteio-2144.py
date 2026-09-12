from pathlib import Path
import re

VER='2026-09-12-0226'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VER}';", s, count=1)
s,n=re.subn(r"gfcFiltroCentro:\[[^\]]*\]", "gfcFiltroCentro:[5,6,7,8,9]", s, count=1)
if n!=1:
    raise SystemExit('Filtro Centro nao encontrado')
p.write_text(s,encoding='utf-8')

sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VER}';", t, count=1)
sw.write_text(t,encoding='utf-8')
