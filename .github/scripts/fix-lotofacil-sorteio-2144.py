from pathlib import Path
import re
VERSAO='2026-09-12-0036'
p=Path('index.html'); s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
if 'id="subtabSoma"' not in s:
    s=s.replace('<button class="subtab-btn" id="subtabFrequencia">Frequência</button>','<button class="subtab-btn" id="subtabFrequencia">Frequência</button>\n      <button class="subtab-btn" id="subtabSoma">Soma</button>',1)
painel='''    <div id="somaPanel" style="display:none;">
      <div class="card" style="padding:0;overflow:hidden;border-radius:10px;">
        <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;">
          <table id="somaFaixasTabela" style="width:100%;border-collapse:collapse;min-width:520px;font-family:'Baloo 2',sans-serif;">
            <thead><tr style="background:#EEE0F2;">
              <th style="padding:12px 8px;border:1px solid #C9C9C9;font-size:15px;font-weight:800;">Faixa de Somas</th>
              <th style="padding:12px 8px;border:1px solid #C9C9C9;font-size:15px;font-weight:800;width:95px;">Vezes</th>
              <th style="padding:12px 8px;border:1px solid #C9C9C9;font-size:15px;font-weight:800;">Percentual de Vezes</th>
            </tr></thead>
            <tbody id="somaFaixasBody">
              <tr><td style="padding:11px 8px;border:1px solid #C9C9C9;text-align:center;font-size:15px;font-weight:800;white-space:nowrap;">De 120 a 145</td><td style="padding:11px 8px;border:1px solid #C9C9C9;text-align:center;font-size:15px;font-weight:800;">4x</td><td style="padding:10px 8px;border:1px solid #C9C9C9;font-size:14px;white-space:nowrap;"><div style="display:flex;align-items:center;gap:7px;"><div style="width:58%;height:24px;display:flex;align-items:center;"><div style="width:2%;min-width:5px;height:22px;border-radius:7px;background:#B58DB7;border:1.5px solid #7E3C80;"></div></div><span>0.11%</span></div></td></tr>
              <tr><td style="padding:11px 8px;border:1px solid #C9C9C9;text-align:center;font-size:15px;font-weight:800;white-space:nowrap;">De 146 a 170</td><td style="padding:11px 8px;border:1px solid #C9C9C9;text-align:center;font-size:15px;font-weight:800;">310x</td><td style="padding:10px 8px;border:1px solid #C9C9C9;font-size:14px;white-space:nowrap;"><div style="display:flex;align-items:center;gap:7px;"><div style="width:58%;height:24px;display:flex;align-items:center;"><div style="width:18.9%;min-width:5px;height:22px;border-radius:7px;background:#B58DB7;border:1.5px solid #7E3C80;"></div></div><span>8.2%</span></div></td></tr>
              <tr><td style="padding:11px 8px;border:1px solid #C9C9C9;text-align:center;font-size:15px;font-weight:800;white-space:nowrap;">De 171 a 195</td><td style="padding:11px 8px;border:1px solid #C9C9C9;text-align:center;font-size:15px;font-weight:800;">1641x</td><td style="padding:10px 8px;border:1px solid #C9C9C9;font-size:14px;white-space:nowrap;"><div style="display:flex;align-items:center;gap:7px;"><div style="width:58%;height:24px;display:flex;align-items:center;"><div style="width:100%;height:22px;border-radius:7px;background:#B58DB7;border:1.5px solid #7E3C80;"></div></div><span>43.42%</span></div></td></tr>
              <tr><td style="padding:11px 8px;border:1px solid #C9C9C9;text-align:center;font-size:15px;font-weight:800;white-space:nowrap;">De 196 a 220</td><td style="padding:11px 8px;border:1px solid #C9C9C9;text-align:center;font-size:15px;font-weight:800;">1529x</td><td style="padding:10px 8px;border:1px solid #C9C9C9;font-size:14px;white-space:nowrap;"><div style="display:flex;align-items:center;gap:7px;"><div style="width:58%;height:24px;display:flex;align-items:center;"><div style="width:93.2%;height:22px;border-radius:7px;background:#B58DB7;border:1.5px solid #7E3C80;"></div></div><span>40.46%</span></div></td></tr>
              <tr><td style="padding:11px 8px;border:1px solid #C9C9C9;text-align:center;font-size:15px;font-weight:800;white-space:nowrap;">De 221 a 245</td><td style="padding:11px 8px;border:1px solid #C9C9C9;text-align:center;font-size:15px;font-weight:800;">291x</td><td style="padding:10px 8px;border:1px solid #C9C9C9;font-size:14px;white-space:nowrap;"><div style="display:flex;align-items:center;gap:7px;"><div style="width:58%;height:24px;display:flex;align-items:center;"><div style="width:17.7%;min-width:5px;height:22px;border-radius:7px;background:#B58DB7;border:1.5px solid #7E3C80;"></div></div><span>7.7%</span></div></td></tr>
              <tr><td style="padding:11px 8px;border:1px solid #C9C9C9;text-align:center;font-size:15px;font-weight:800;white-space:nowrap;">De 246 a 270</td><td style="padding:11px 8px;border:1px solid #C9C9C9;text-align:center;font-size:15px;font-weight:800;">4x</td><td style="padding:10px 8px;border:1px solid #C9C9C9;font-size:14px;white-space:nowrap;"><div style="display:flex;align-items:center;gap:7px;"><div style="width:58%;height:24px;display:flex;align-items:center;"><div style="width:2%;min-width:5px;height:22px;border-radius:7px;background:#B58DB7;border:1.5px solid #7E3C80;"></div></div><span>0.11%</span></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>'''
if 'id="somaPanel"' in s:
    s=re.sub(r'    <div id="somaPanel" style="display:none;">.*?\n    </div>\n\n    <div id="frequenciaPanel"',painel+'\n\n    <div id="frequenciaPanel"',s,count=1,flags=re.S)
else:
    s=s.replace('    <div id="frequenciaPanel" style="display:none;">',painel+'\n\n    <div id="frequenciaPanel" style="display:none;">',1)
if "{btn:'subtabSoma', panel:'somaPanel'}" not in s:
    s=s.replace("  {btn:'subtabFrequencia', panel:'frequenciaPanel'}","  {btn:'subtabFrequencia', panel:'frequenciaPanel'},\n  {btn:'subtabSoma', panel:'somaPanel'}",1)
# Remove qualquer carregamento dinâmico antigo da soma e deixa a tabela visível imediatamente ao abrir a aba.
s=re.sub(r'let somaCarregouUmaVez = false;.*?document\.getElementById\(\'subtabSoma\'\)\.addEventListener\(\'click\', \(\)=>\{\n  ativarSubtabTendencia\(\'subtabSoma\'\);\n  if\(!somaCarregouUmaVez\) carregarSoma\(\);\n\}\);',"document.getElementById('subtabSoma').addEventListener('click', ()=>{\n  ativarSubtabTendencia('subtabSoma');\n});",s,count=1,flags=re.S)
if "document.getElementById('subtabSoma').addEventListener" not in s:
    needle="document.getElementById('subtabFrequencia').addEventListener('click', ()=>{\n  ativarSubtabTendencia('subtabFrequencia');\n  if(!frequenciaCarregouUmaVez) carregarFrequencia(tendGameAtual);\n});"
    s=s.replace(needle,needle+"\ndocument.getElementById('subtabSoma').addEventListener('click', ()=>{\n  ativarSubtabTendencia('subtabSoma');\n});",1)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js'); t=sw.read_text(encoding='utf-8'); t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1); sw.write_text(t,encoding='utf-8')
