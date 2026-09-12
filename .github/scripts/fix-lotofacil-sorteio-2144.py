from pathlib import Path
import re
VERSAO='2026-09-12-0130'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
old='''          <div class="gfc-dark-input-wrap" id="gfcFixasWrap" style="cursor:pointer;">\n            <input type="text" id="gfcFiltroFixas" placeholder=" " readonly inputmode="none" aria-label="Escolher dezenas fixas" style="cursor:pointer;">\n            <span>Fixas</span>\n          </div>'''
new='''          <div class="gfc-dark-input-wrap" id="gfcFixasWrap">\n            <button type="button" id="gfcFiltroFixas" class="gfc-fixas-btn" aria-label="Escolher dezenas fixas">Fixas</button>\n          </div>'''
if old not in s: raise SystemExit('campo Fixas atual não encontrado')
s=s.replace(old,new,1)
anchor="  .gfc-dark-input-wrap input.gfc-filtro-invalido + span{color:#B91C1C !important;}"
css="""\n  .gfc-fixas-btn{width:100%;box-sizing:border-box;padding:7px 4px;border-radius:8px;border:1.5px solid #D8DAE0;background:#fff;color:#9CA3AF;text-align:center;font-family:'Baloo 2',sans-serif;font-weight:700;font-size:11.5px;line-height:normal;cursor:pointer;transition:background .12s ease,border-color .12s ease,color .12s ease;}\n  .gfc-fixas-btn:focus,.gfc-fixas-btn:active{outline:none;border-color:#A21CAF;}\n  .gfc-fixas-btn.tem-fixas{background:#F3E8FF;border-color:#A21CAF;color:#4C1D95;}\n"""
if '.gfc-fixas-btn{' not in s:
    if anchor not in s: raise SystemExit('âncora CSS não encontrada')
    s=s.replace(anchor,anchor+css,1)
oldfun="""  el.value=arr.length ? `${arr.length} escolhida${arr.length===1?'':'s'}` : '';\n  el.title=arr.length ? arr.map(n=>String(n).padStart(2,'0')).join(', ') : 'Escolher dezenas fixas';"""
newfun="""  el.textContent=arr.length ? `Fixas (${arr.length})` : 'Fixas';\n  el.classList.toggle('tem-fixas', arr.length>0);\n  el.title=arr.length ? arr.map(n=>String(n).padStart(2,'0')).join(', ') : 'Escolher dezenas fixas';"""
if oldfun not in s: raise SystemExit('função Fixas não encontrada')
s=s.replace(oldfun,newfun,1)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1)
sw.write_text(t,encoding='utf-8')
