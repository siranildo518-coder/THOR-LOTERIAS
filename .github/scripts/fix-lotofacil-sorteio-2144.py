from pathlib import Path
import re

VERSAO = '2026-09-12-0016'

p = Path('index.html')
s = p.read_text(encoding='utf-8')
s = re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VERSAO}';", s, count=1)

old = '''function setBtnLoading(btnId, loading, textoCarregando){
  const btn = document.getElementById(btnId);
  if(!btn) return;
  if(loading){
    if(btn.dataset.originalHtml === undefined) btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = `<span class="analise-loading-spinner" aria-hidden="true"></span>${textoCarregando || 'ATUALIZANDO...'}`;
  } else if(btn.dataset.originalHtml !== undefined){
    btn.innerHTML = btn.dataset.originalHtml;
  }
}'''

new = '''function setBtnLoading(btnId, loading, textoCarregando){
  const btn = document.getElementById(btnId);
  if(!btn) return;
  if(loading){
    if(btn.dataset.originalHtml === undefined) btn.dataset.originalHtml = btn.innerHTML;
    btn.setAttribute('aria-busy','true');
    btn.innerHTML = `<span class="analise-loading-spinner" aria-hidden="true"></span><span class="analise-loading-texto">${textoCarregando || 'ATUALIZANDO...'}</span>`;
    const spinner = btn.querySelector('.analise-loading-spinner');
    if(spinner){
      try{
        if(spinner._thorAnim) spinner._thorAnim.cancel();
        spinner._thorAnim = spinner.animate(
          [{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}],
          {duration:650,iterations:Infinity,easing:'linear'}
        );
      }catch(e){
        spinner.style.animation = 'analiseSpinner .65s linear infinite';
      }
    }
  } else {
    btn.removeAttribute('aria-busy');
    const spinner = btn.querySelector('.analise-loading-spinner');
    try{ if(spinner && spinner._thorAnim) spinner._thorAnim.cancel(); }catch(e){}
    if(btn.dataset.originalHtml !== undefined) btn.innerHTML = btn.dataset.originalHtml;
  }
}'''

if old not in s:
    raise SystemExit('setBtnLoading atual não encontrado')
s = s.replace(old, new, 1)

p.write_text(s, encoding='utf-8')

sw = Path('sw.js')
t = sw.read_text(encoding='utf-8')
t = re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VERSAO}';", t, count=1)
sw.write_text(t, encoding='utf-8')
