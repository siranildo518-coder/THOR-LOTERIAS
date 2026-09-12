from pathlib import Path
import re
VERSAO='2026-09-12-0059'
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
# Mantém o texto original dos botões durante o carregamento: não mostra ATUALIZANDO/CARREGANDO.
pat=r"function setBtnLoading\(btnId, loading, textoCarregando\)\{.*?\n\}\n"
novo="""function setBtnLoading(btnId, loading, textoCarregando){
  const btn = document.getElementById(btnId);
  if(!btn) return;
  if(btn.dataset.originalHtml === undefined) btn.dataset.originalHtml = btn.innerHTML;
  if(loading){
    btn.setAttribute('aria-busy','true');
    btn.innerHTML = btn.dataset.originalHtml;
  } else {
    btn.removeAttribute('aria-busy');
    btn.innerHTML = btn.dataset.originalHtml;
  }
}
"""
s,n=re.subn(pat,novo,s,count=1,flags=re.S)
if n==0:
    raise SystemExit('setBtnLoading não encontrado')
# Na aba Soma também mantém o texto ANALISAR durante o processamento.
s=s.replace("    btn.textContent='ANALISANDO';","    if(btn.dataset.originalHtml === undefined) btn.dataset.originalHtml = btn.innerHTML;\n    btn.innerHTML = btn.dataset.originalHtml;",1)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js')
t=sw.read_text(encoding='utf-8')
t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1)
sw.write_text(t,encoding='utf-8')
