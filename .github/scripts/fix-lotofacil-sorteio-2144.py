from pathlib import Path
import re
VERSAO='2026-09-12-0110'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
# Adiciona o campo Fixas logo abaixo de Centro, sem duplicar.
if 'id="gfcFiltroFixas"' not in s:
    alvo='''          <div class="gfc-dark-input-wrap">\n            <input type="number" inputmode="numeric" id="gfcFiltroCentro" placeholder=" ">\n            <span>Centro</span>\n          </div>'''
    novo=alvo+'''\n          <div class="gfc-dark-input-wrap">\n            <input type="number" inputmode="numeric" id="gfcFiltroFixas" placeholder=" ">\n            <span>Fixas</span>\n          </div>'''
    if alvo not in s:
        raise SystemExit('Bloco Centro não encontrado')
    s=s.replace(alvo,novo,1)
# Inclui Fixas na limpeza/inicialização dos filtros.
s=s.replace("['gfcFiltroPares','gfcFiltroImpares','gfcFiltroPrimos','gfcFiltroFib','gfcFiltroMoldura','gfcFiltroCentro','gfcFiltroMult3','gfcFiltroSoma']", "['gfcFiltroPares','gfcFiltroImpares','gfcFiltroPrimos','gfcFiltroFib','gfcFiltroMoldura','gfcFiltroCentro','gfcFiltroFixas','gfcFiltroMult3','gfcFiltroSoma']",1)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1)
sw.write_text(t,encoding='utf-8')
