from pathlib import Path
import re

VER='2026-09-12-0539'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VER}';", s, count=1)

# Remove a aba Contatos do menu lateral e sua tela.
s=s.replace('  <button class="drawer-item" id="menuContatos"><span class="ic">☎️</span> Contatos</button>\n','',1)
s=re.sub(r'\n<div class="overlay-full" id="overlayContatos".*?</div>\s*</div>\s*\n(?=\s*<)', '\n', s, count=1, flags=re.S)
s=re.sub(r"\ndocument\.getElementById\('menuContatos'\)\?\.addEventListener\('click', \(\)=>\{.*?\n\}\);\ndocument\.getElementById\('contatosVoltar'\)\?\.addEventListener\('click', \(\)=>\{.*?\n\}\);",'',s,count=1,flags=re.S)
s=s.replace(",'overlayContatos'",'').replace("'overlayContatos',",'')

p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VER}';", t, count=1)
sw.write_text(t,encoding='utf-8')
