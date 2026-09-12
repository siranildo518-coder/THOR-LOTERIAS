from pathlib import Path
import re
VERSAO='2026-09-12-0030'
p=Path('index.html'); s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
if 'id="subtabSoma"' not in s:
 s=s.replace('<button class="subtab-btn" id="subtabFrequencia">Frequência</button>','<button class="subtab-btn" id="subtabFrequencia">Frequência</button>\n      <button class="subtab-btn" id="subtabSoma">Soma</button>',1)
if 'id="somaPanel"' not in s:
 s=s.replace('    <div id="frequenciaPanel" style="display:none;">','    <div id="somaPanel" style="display:none;">\n      <div class="card" style="padding:12px;">\n        <div style="font-family:\'Baloo 2\',sans-serif;font-size:14px;font-weight:800;color:var(--violet-deep);">Soma</div>\n      </div>\n    </div>\n\n    <div id="frequenciaPanel" style="display:none;">',1)
if "{btn:'subtabSoma', panel:'somaPanel'}" not in s:
 s=s.replace("  {btn:'subtabFrequencia', panel:'frequenciaPanel'}","  {btn:'subtabFrequencia', panel:'frequenciaPanel'},\n  {btn:'subtabSoma', panel:'somaPanel'}",1)
if "document.getElementById('subtabSoma').addEventListener" not in s:
 needle="document.getElementById('subtabFrequencia').addEventListener('click', ()=>{\n  ativarSubtabTendencia('subtabFrequencia');\n  if(!frequenciaCarregouUmaVez) carregarFrequencia(tendGameAtual);\n});"
 s=s.replace(needle,needle+"\ndocument.getElementById('subtabSoma').addEventListener('click', ()=>{\n  ativarSubtabTendencia('subtabSoma');\n});",1)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js'); t=sw.read_text(encoding='utf-8'); t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1); sw.write_text(t,encoding='utf-8')
