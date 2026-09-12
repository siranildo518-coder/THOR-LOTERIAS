from pathlib import Path
import re

VERSAO = '2026-09-12-0010'

p = Path('index.html')
s = p.read_text(encoding='utf-8')
s = re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VERSAO}';", s, count=1)

# Spinner próprio para os botões da aba Análise.
if '.analise-loading-spinner' not in s:
    s = s.replace(
        "  @keyframes girarBtn{\n    from{transform:rotate(0deg);}\n    to{transform:rotate(360deg);}\n  }",
        "  @keyframes girarBtn{\n    from{transform:rotate(0deg);}\n    to{transform:rotate(360deg);}\n  }\n  @keyframes analiseSpinner{\n    from{transform:rotate(0deg);}\n    to{transform:rotate(360deg);}\n  }\n  .analise-loading-spinner{\n    display:inline-block!important;\n    width:12px;height:12px;\n    border:2px solid rgba(255,255,255,.5);\n    border-top-color:#fff;\n    border-radius:50%;\n    margin-right:6px;\n    vertical-align:middle;\n    transform-origin:50% 50%;\n    will-change:transform;\n    animation:analiseSpinner .65s linear infinite!important;\n  }",
        1
    )

s = s.replace(
    'btn.innerHTML = `<span style="display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,.5);border-top-color:#fff;border-radius:50%;margin-right:6px;vertical-align:middle;animation:girarBtn .6s linear infinite;"></span>${textoCarregando || \'ATUALIZANDO...\'}`;',
    'btn.innerHTML = `<span class="analise-loading-spinner" aria-hidden="true"></span>${textoCarregando || \'ATUALIZANDO...\'}`;',
    1
)

# Frequência - Dezenas também passa a usar o mesmo spinner.
s = s.replace(
    "if(btn){ btn.disabled = true; btn.classList.add('atualizando'); btn.textContent='ATUALIZANDO'; }",
    "if(btn){ btn.disabled = true; btn.classList.add('atualizando'); setBtnLoading('frequenciaAtualizarBtn', true, 'ATUALIZANDO'); }",
    1
)
s = s.replace(
    "if(requestId === frequenciaRequestId && btn){ btn.disabled = false; btn.classList.remove('atualizando'); btn.textContent='ATUALIZAR'; }",
    "if(requestId === frequenciaRequestId && btn){ btn.disabled = false; btn.classList.remove('atualizando'); setBtnLoading('frequenciaAtualizarBtn', false); }",
    1
)

# Frequência - Ternos e Quadras.
s = s.replace(
    "if(btn){btn.disabled=true;btn.textContent='CARREGANDO…';}",
    "if(btn){btn.disabled=true;setBtnLoading(cfg.btn,true,'CARREGANDO…');}",
    1
)
s = s.replace(
    "if(btn){btn.disabled=false;btn.textContent='ATUALIZAR '+cfg.label;}",
    "if(btn){btn.disabled=false;setBtnLoading(cfg.btn,false);}",
    1
)

# Frequência - Quinas.
s = s.replace(
    "if(btn){btn.disabled=true;btn.textContent='CARREGANDO…';}",
    "if(btn){btn.disabled=true;setBtnLoading('frequenciaQuinasAtualizarBtn',true,'CARREGANDO…');}",
    1
)
s = s.replace(
    "if(btn){btn.disabled=false;btn.textContent='ATUALIZAR QUINAS';}",
    "if(btn){btn.disabled=false;setBtnLoading('frequenciaQuinasAtualizarBtn',false);}",
    1
)

# Ao limpar/resetar a frequência, restaura o HTML original do botão corretamente.
s = s.replace(
    "if(atualizar){ atualizar.disabled=false; atualizar.classList.remove('atualizando'); atualizar.textContent='ATUALIZAR'; }",
    "if(atualizar){ atualizar.disabled=false; atualizar.classList.remove('atualizando'); setBtnLoading('frequenciaAtualizarBtn', false); }",
    2
)

p.write_text(s, encoding='utf-8')

sw = Path('sw.js')
t = sw.read_text(encoding='utf-8')
t = re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VERSAO}';", t, count=1)
sw.write_text(t, encoding='utf-8')
