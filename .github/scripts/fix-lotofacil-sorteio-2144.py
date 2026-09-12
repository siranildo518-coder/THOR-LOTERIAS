from pathlib import Path
import re

VERSAO = '2026-09-11-2353'

p = Path('index.html')
s = p.read_text(encoding='utf-8')
s = re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VERSAO}';", s, count=1)

# Evita reconstruir 1000 cartões a cada toque em Anterior/Próximo.
bloco_antigo = '''  if(geradorUltimoJogosCtx && geradorUltimoJogosCtx.g.code === g.code){
    renderGeradorResultado(
      geradorUltimoJogosCtx.g, geradorUltimoJogosCtx.jogos, geradorUltimoJogosCtx.maisAtrasadas,
      geradorUltimoJogosCtx.maisSairam, geradorUltimoJogosCtx.totalConcursos,
      geradorUltimoJogosCtx.numeroUltimo, geradorUltimoJogosCtx.depSize
    );
  }'''
bloco_novo = '''  if(geradorUltimoJogosCtx && geradorUltimoJogosCtx.g.code === g.code){
    atualizarConferenciaGeradorLeve(geradorUltimoJogosCtx.g, geradorUltimoJogosCtx.jogos);
  }'''
if bloco_antigo in s:
    s = s.replace(bloco_antigo, bloco_novo, 1)

# Marca os elementos dos cartões para atualização em lotes, sem redesenhar tudo.
s = s.replace('<div class="tend-row" style="align-items:center;flex-wrap:wrap;${faixa ? \'background:rgba(31,157,116,.08);border-color:#1F9D74;\' : \'\'}">', '<div class="tend-row gerador-jogo-row" data-jogo-index="${i}" style="align-items:center;flex-wrap:wrap;${faixa ? \'background:rgba(31,157,116,.08);border-color:#1F9D74;\' : \'\'}">', 1)
s = s.replace('return `<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background-image:${bg};background-size:cover;background-position:center;background-blend-mode:multiply;border:1px solid ${acertou ? \'transparent\' : \'var(--line,#E7DFF5)\'};color:${acertou ? \'#fff\' : \'var(--violet-deep)\'};font-family:\'Baloo 2\',sans-serif;font-size:10.5px;font-weight:700;text-shadow:${acertou ? \'0 1px 2px rgba(0,0,0,.35)\' : \'0 1px 2px rgba(255,255,255,.9)\'};">${n.toString().padStart(2,\'0\')}</span>`;', 'return `<span class="gerador-jogo-ball" data-num="${n}" style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background-image:${bg};background-size:cover;background-position:center;background-blend-mode:multiply;border:1px solid ${acertou ? \'transparent\' : \'var(--line,#E7DFF5)\'};color:${acertou ? \'#fff\' : \'var(--violet-deep)\'};font-family:\'Baloo 2\',sans-serif;font-size:10.5px;font-weight:700;text-shadow:${acertou ? \'0 1px 2px rgba(0,0,0,.35)\' : \'0 1px 2px rgba(255,255,255,.9)\'};">${n.toString().padStart(2,\'0\')}</span>`;', 1)
s = s.replace('? `<span style="font-family:\'Baloo 2\',sans-serif;font-weight:800;font-size:10.5px;color:${faixa ? \'#1F9D74\' : \'var(--muted)\'};margin-left:auto;flex:none;text-align:right;">${hits} acerto${hits===1?\'\':\'s\'}<br><span style="font-size:9px;font-weight:700;">${faixa ? faixa.label : \'não premiado\'}</span></span>`', '? `<span class="gerador-hit-badge" style="font-family:\'Baloo 2\',sans-serif;font-weight:800;font-size:10.5px;color:${faixa ? \'#1F9D74\' : \'var(--muted)\'};margin-left:auto;flex:none;text-align:right;">${hits} acerto${hits===1?\'\':\'s\'}<br><span style="font-size:9px;font-weight:700;">${faixa ? faixa.label : \'não premiado\'}</span></span>`', 1)
s = s.replace("${premioTag ? `<div style=\"width:100%;\">${premioTag}</div>` : ''}", "${premioTag ? `<div class=\"gerador-premio-wrap\" style=\"width:100%;\">${premioTag}</div>` : '<div class=\"gerador-premio-wrap\" style=\"width:100%;display:none;\"></div>'}", 1)
s = s.replace('<div style="background:#fff;border:1.5px solid #E7DFF5;border-radius:13px;padding:8px 10px;margin-bottom:8px;">\n      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:3px;">', '<div id="geradorConferenciaResumo" style="background:#fff;border:1.5px solid #E7DFF5;border-radius:13px;padding:8px 10px;margin-bottom:8px;">\n      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:3px;">', 1)
s = s.replace('${conferindo ? `<span style="font-family:\'Baloo 2\',sans-serif;font-size:10px;font-weight:800;color:#1F9D74;">${totalPremiados} premiado${totalPremiados===1?\'\':\'s\'}</span>` : \'\'}', '${conferindo ? `<span id="geradorTotalPremiados" style="font-family:\'Baloo 2\',sans-serif;font-size:10px;font-weight:800;color:#1F9D74;">${totalPremiados} premiado${totalPremiados===1?\'\':\'s\'}</span>` : \'\'}', 1)
s = s.replace('${conferindo ? `<div style="margin-top:7px;border:1px solid #EFE7F7;border-radius:10px;overflow:hidden;background:#FCFAFF;"><div style="padding:5px 7px;background:#F6F0FC;font-family:\'Baloo 2\',sans-serif;font-size:11px;font-weight:800;color:#7E22CE;">🏆 Oportunidades de premiação</div>${oportunidadesHtml}</div>` : \'\'}', '${conferindo ? `<div id="geradorOportunidades" style="margin-top:7px;border:1px solid #EFE7F7;border-radius:10px;overflow:hidden;background:#FCFAFF;"><div style="padding:5px 7px;background:#F6F0FC;font-family:\'Baloo 2\',sans-serif;font-size:11px;font-weight:800;color:#7E22CE;">🏆 Oportunidades de premiação</div>${oportunidadesHtml}</div>` : \'\'}', 1)

if 'function atualizarConferenciaGeradorLeve(g, jogos)' not in s:
    marker = 'function renderGeradorResultado(g, jogos, maisAtrasadas, maisSairam, totalConcursos, numeroUltimo, depSize){'
    func = r'''
let geradorConferenciaToken = 0;
function atualizarConferenciaGeradorLeve(g, jogos){
  if(!geradorUltimoResultado || geradorUltimoResultado.gameCode !== g.code) return;
  const token = ++geradorConferenciaToken;
  const resultadoSet = geradorUltimoResultado.dezenas;
  const distribuicao = new Map();
  let totalPremiados = 0;
  const hitsPorJogo = new Array(jogos.length);
  const faixaPorJogo = new Array(jogos.length);
  for(let i=0;i<jogos.length;i++){
    let hits = 0;
    for(const n of jogos[i]) if(resultadoSet.has(n)) hits++;
    const faixa = faixaPremioGerador(g.code, hits);
    hitsPorJogo[i] = hits;
    faixaPorJogo[i] = faixa;
    distribuicao.set(hits, (distribuicao.get(hits)||0)+1);
    if(faixa) totalPremiados++;
  }
  const totalEl = document.getElementById('geradorTotalPremiados');
  if(totalEl) totalEl.textContent = `${totalPremiados} premiado${totalPremiados===1?'':'s'}`;
  const oportunidades = document.getElementById('geradorOportunidades');
  if(oportunidades){
    const linhas = (FAIXAS_PREMIACAO_GERADOR[g.code]||[]).map(f=>{
      const qtd = distribuicao.get(f.h)||0;
      return `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:5px 7px;border-bottom:1px solid #F0EAF7;"><span style="font-family:'Baloo 2',sans-serif;font-size:11px;font-weight:700;color:#4B5563;">${f.label}</span><span style="font-family:'Baloo 2',sans-serif;font-size:11px;font-weight:800;color:${qtd ? '#1F9D74' : '#8B7C9E'};">${qtd} cart${qtd===1?'ão':'ões'} premiado${qtd===1?'':'s'}</span></div>`;
    }).join('');
    oportunidades.innerHTML = `<div style="padding:5px 7px;background:#F6F0FC;font-family:'Baloo 2',sans-serif;font-size:11px;font-weight:800;color:#7E22CE;">🏆 Oportunidades de premiação</div>${linhas}`;
  }
  const rows = Array.from(document.querySelectorAll('#geradorFiltroResultado .gerador-jogo-row'));
  let pos = 0;
  const lote = 35;
  const atualizarLote = ()=>{
    if(token !== geradorConferenciaToken) return;
    const fim = Math.min(pos+lote, rows.length);
    for(;pos<fim;pos++){
      const row = rows[pos];
      const idx = Number(row.dataset.jogoIndex);
      const hits = hitsPorJogo[idx] ?? 0;
      const faixa = faixaPorJogo[idx] || null;
      row.style.background = faixa ? 'rgba(31,157,116,.08)' : '';
      row.style.borderColor = faixa ? '#1F9D74' : '';
      row.querySelectorAll('.gerador-jogo-ball').forEach(ball=>{
        const acertou = resultadoSet.has(Number(ball.dataset.num));
        ball.style.backgroundImage = acertou ? `linear-gradient(rgba(16,140,86,.62), rgba(6,90,58,.62)), url(${BALL_PHOTO_URL})` : `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), url(${BALL_PHOTO_URL})`;
        ball.style.borderColor = acertou ? 'transparent' : 'var(--line,#E7DFF5)';
        ball.style.color = acertou ? '#fff' : 'var(--violet-deep)';
        ball.style.textShadow = acertou ? '0 1px 2px rgba(0,0,0,.35)' : '0 1px 2px rgba(255,255,255,.9)';
      });
      const badge = row.querySelector('.gerador-hit-badge');
      if(badge){
        badge.style.color = faixa ? '#1F9D74' : 'var(--muted)';
        badge.innerHTML = `${hits} acerto${hits===1?'':'s'}<br><span style="font-size:9px;font-weight:700;">${faixa ? faixa.label : 'não premiado'}</span>`;
      }
      const premioWrap = row.querySelector('.gerador-premio-wrap');
      if(premioWrap){
        if(faixa){
          premioWrap.style.display = 'block';
          premioWrap.innerHTML = `<div style="font-family:'Baloo 2',sans-serif;font-weight:800;font-size:10.5px;color:#fff;background:linear-gradient(135deg,#1F9D74,#15764F);padding:3px 8px;border-radius:20px;display:inline-block;margin-top:5px;">🏆 PREMIADO — ${faixa.label}</div>`;
        }else{
          premioWrap.style.display = 'none';
          premioWrap.innerHTML = '';
        }
      }
    }
    if(pos < rows.length) requestAnimationFrame(atualizarLote);
  };
  requestAnimationFrame(atualizarLote);
}

'''
    s = s.replace(marker, func + marker, 1)

p.write_text(s, encoding='utf-8')

sw = Path('sw.js')
t = sw.read_text(encoding='utf-8')
t = re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VERSAO}';", t, count=1)
sw.write_text(t, encoding='utf-8')
