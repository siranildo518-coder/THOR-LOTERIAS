from pathlib import Path
import re
VERSAO='2026-09-12-0055'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
# Remove a bolinha/spinner de todos os botões da aba Análise.
s=re.sub(r"\s*@keyframes analiseSpinner\{.*?\}\s*\.analise-loading-spinner\{.*?\}\s*",'\n',s,count=1,flags=re.S)
pat=r'''// liga/desliga a bolinha girando dentro de um botão "ATUALIZAR" enquanto ele carrega\nfunction setBtnLoading\(btnId, loading, textoCarregando\)\{.*?\n\}\n'''
novo='''// Mostra apenas o texto de carregamento nos botões da aba Análise, sem bolinha/spinner.\nfunction setBtnLoading(btnId, loading, textoCarregando){\n  const btn = document.getElementById(btnId);\n  if(!btn) return;\n  if(loading){\n    if(btn.dataset.originalHtml === undefined) btn.dataset.originalHtml = btn.innerHTML;\n    btn.setAttribute('aria-busy','true');\n    btn.textContent = textoCarregando || 'ATUALIZANDO...';\n  } else {\n    btn.removeAttribute('aria-busy');\n    if(btn.dataset.originalHtml !== undefined) btn.innerHTML = btn.dataset.originalHtml;\n  }\n}\n'''
s,n=re.subn(pat,novo,s,count=1,flags=re.S)
if n==0:
    # compatibilidade caso o comentário já tenha mudado
    s=re.sub(r"function setBtnLoading\(btnId, loading, textoCarregando\)\{.*?\n\}\n",novo.split('\n',1)[1],s,count=1,flags=re.S)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1)
sw.write_text(t,encoding='utf-8')
