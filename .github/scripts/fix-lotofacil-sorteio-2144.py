from pathlib import Path
import re
VERSAO='2026-09-12-0104'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
old="let tendVendoUltimo = true; // false quando o usuário navegou p/ um concurso antigo via Anterior/Próximo\n\nasync function carregarTendencia(gameParam){"
new="let tendVendoUltimo = true; // false quando o usuário navegou p/ um concurso antigo via Anterior/Próximo\nlet tendCarregandoAgora = false; // evita cliques repetidos sem desativar visualmente o botão\n\nasync function carregarTendencia(gameParam){\n  if(tendCarregandoAgora) return;\n  tendCarregandoAgora = true;"
if old in s:s=s.replace(old,new,1)
s=s.replace("  if(btn){ btn.disabled = true; setBtnLoading('tendAtualizarBtn', true); }","  if(btn){ setBtnLoading('tendAtualizarBtn', true); }",1)
s=s.replace("    if(btn){ btn.disabled = false; setBtnLoading('tendAtualizarBtn', false); }\n  }\n}\n\nfunction isPrimoNum", "    if(btn){ setBtnLoading('tendAtualizarBtn', false); }\n    tendCarregandoAgora = false;\n  }\n}\n\nfunction isPrimoNum",1)
css='''\n  #tendAtualizarBtn{\n    box-sizing:border-box!important;\n    border:2px solid transparent!important;\n    transform:none!important;\n    transition:box-shadow .12s ease-out!important;\n  }\n  #tendAtualizarBtn:active, #tendAtualizarBtn.is-pressed{\n    transform:none!important;\n    border-color:rgba(255,255,255,.75)!important;\n  }\n'''
if '#tendAtualizarBtn{' not in s:s=s.replace('  /* Botão 3D genérico',css+'\n  /* Botão 3D genérico',1)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1)
sw.write_text(t,encoding='utf-8')
