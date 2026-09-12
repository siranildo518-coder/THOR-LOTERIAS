from pathlib import Path
import re

VERSAO = '2026-09-11-2358'

p = Path('index.html')
s = p.read_text(encoding='utf-8')
s = re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VERSAO}';", s, count=1)

# Mantém sempre um espaço visível para a quantidade de acertos em cada cartão.
old_badge = '''    const badge = conferindo
      ? `<span class="gerador-hit-badge" style="font-family:'Baloo 2',sans-serif;font-weight:800;font-size:10.5px;color:${faixa ? '#1F9D74' : 'var(--muted)'};margin-left:auto;flex:none;text-align:right;">${hits} acerto${hits===1?'':'s'}<br><span style="font-size:9px;font-weight:700;">${faixa ? faixa.label : 'não premiado'}</span></span>`
      : '';'''
new_badge = '''    const badge = conferindo
      ? `<span class="gerador-hit-badge" style="font-family:'Baloo 2',sans-serif;font-weight:800;font-size:10.5px;color:${faixa ? '#1F9D74' : 'var(--muted)'};margin-left:auto;flex:none;text-align:right;">${hits} acerto${hits===1?'':'s'}<br><span style="font-size:9px;font-weight:700;">${faixa ? faixa.label : 'não premiado'}</span></span>`
      : `<span class="gerador-hit-badge" style="font-family:'Baloo 2',sans-serif;font-weight:800;font-size:10.5px;color:var(--muted);margin-left:auto;flex:none;text-align:right;">— acertos<br><span style="font-size:9px;font-weight:700;">aguardando resultado</span></span>`;'''
if old_badge in s:
    s = s.replace(old_badge, new_badge, 1)

# Mantém os elementos do resumo existentes mesmo antes da primeira conferência.
s = s.replace(
    '${conferindo ? `<span id="geradorTotalPremiados" style="font-family:\'Baloo 2\',sans-serif;font-size:10px;font-weight:800;color:#1F9D74;">${totalPremiados} premiado${totalPremiados===1?\'\':\'s\'}</span>` : \'\'}',
    '<span id="geradorTotalPremiados" style="font-family:\'Baloo 2\',sans-serif;font-size:10px;font-weight:800;color:#1F9D74;">${conferindo ? `${totalPremiados} premiado${totalPremiados===1?\'\':\'s\'}` : \'—\'}</span>',
    1
)
s = s.replace(
    '${conferindo ? `<div id="geradorOportunidades" style="margin-top:7px;border:1px solid #EFE7F7;border-radius:10px;overflow:hidden;background:#FCFAFF;"><div style="padding:5px 7px;background:#F6F0FC;font-family:\'Baloo 2\',sans-serif;font-size:11px;font-weight:800;color:#7E22CE;">🏆 Oportunidades de premiação</div>${oportunidadesHtml}</div>` : \'\'}',
    '<div id="geradorOportunidades" style="margin-top:7px;border:1px solid #EFE7F7;border-radius:10px;overflow:hidden;background:#FCFAFF;${conferindo ? \'\' : \'display:none;\'}"><div style="padding:5px 7px;background:#F6F0FC;font-family:\'Baloo 2\',sans-serif;font-size:11px;font-weight:800;color:#7E22CE;">🏆 Oportunidades de premiação</div>${oportunidadesHtml}</div>',
    1
)
s = s.replace(
    "  const oportunidades = document.getElementById('geradorOportunidades');\n  if(oportunidades){\n",
    "  const oportunidades = document.getElementById('geradorOportunidades');\n  if(oportunidades){\n    oportunidades.style.display = 'block';\n",
    1
)

p.write_text(s, encoding='utf-8')

sw = Path('sw.js')
t = sw.read_text(encoding='utf-8')
t = re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VERSAO}';", t, count=1)
sw.write_text(t, encoding='utf-8')
