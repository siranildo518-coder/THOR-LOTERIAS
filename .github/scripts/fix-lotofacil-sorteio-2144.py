from pathlib import Path
import re
VERSAO='2026-09-12-0042'
p=Path('index.html'); s=p.read_text(encoding='utf-8')
s=re.sub(r"const APP_VERSAO_ATUAL = '[^']+';",f"const APP_VERSAO_ATUAL = '{VERSAO}';",s,count=1)
start=s.index('    <div id="somaPanel" style="display:none;">')
end=s.index('    <div id="frequenciaPanel" style="display:none;">',start)
painel='''    <div id="somaPanel" style="display:none;">
      <div style="max-width:360px;margin:0 auto;">
        <div class="card" style="padding:10px 10px 11px;margin-bottom:10px;">
          <label class="field-label" for="somaQtdInput" style="display:block;margin-bottom:6px;text-align:center;">Analisar quantos últimos concursos?</label>
          <div style="display:flex;align-items:center;justify-content:center;gap:7px;">
            <input type="number" id="somaQtdInput" min="2" max="500" value="100" inputmode="numeric" style="background:#fff;width:78px;height:31px;padding:4px 7px;font-size:12px;text-align:center;border:1px solid #CFC7D8;border-radius:7px;box-sizing:border-box;">
            <button type="button" class="btn-confirm btn-3d" id="somaAtualizarBtn" style="height:31px;padding:4px 14px;border-radius:7px;border:none;font-size:10.5px;min-width:88px;">ANALISAR</button>
          </div>
          <div id="somaStatus" style="text-align:center;font-size:10px;color:var(--muted);margin-top:6px;min-height:12px;"></div>
        </div>
        <div class="card" style="padding:0;overflow:hidden;border-radius:9px;">
          <table id="somaFaixasTabela" style="width:100%;border-collapse:collapse;table-layout:fixed;font-family:'Baloo 2',sans-serif;">
            <thead><tr style="background:#EEE0F2;">
              <th style="width:34%;padding:8px 4px;border:1px solid #C9C9C9;font-size:10.5px;font-weight:800;line-height:1.05;">Faixa de Somas</th>
              <th style="width:17%;padding:8px 3px;border:1px solid #C9C9C9;font-size:10.5px;font-weight:800;">Vezes</th>
              <th style="width:49%;padding:8px 4px;border:1px solid #C9C9C9;font-size:10.5px;font-weight:800;line-height:1.05;">Percentual de Vezes</th>
            </tr></thead>
            <tbody id="somaFaixasBody"></tbody>
          </table>
        </div>
      </div>
    </div>

'''
s=s[:start]+painel+s[end:]
# remove implementação dinâmica anterior se houver
s=re.sub(r"const SOMA_FAIXAS_LOTOFACIL = \[.*?renderSomaFaixas\(\[0,0,0,0,0,0\],0\);\n",'',s,count=1,flags=re.S)
marker='// ---------- sub-abas dentro de Tendência'
func=r'''const SOMA_FAIXAS_LOTOFACIL = [[120,145],[146,170],[171,195],[196,220],[221,245],[246,270]];
let somaCarregouUmaVez=false;
let somaRequestId=0;
function renderSomaFaixas(contagens,total){
  const body=document.getElementById('somaFaixasBody'); if(!body)return;
  const maior=Math.max(1,...contagens);
  body.innerHTML=SOMA_FAIXAS_LOTOFACIL.map((faixa,i)=>{
    const qtd=contagens[i]||0, pct=total?(qtd/total*100):0;
    const largura=qtd?Math.max(3,qtd/maior*100):0;
    const pctTxt=pct<1&&pct>0?pct.toFixed(2):pct.toFixed(1).replace('.0','');
    return `<tr><td style="padding:8px 3px;border:1px solid #C9C9C9;text-align:center;font-size:10.5px;font-weight:800;white-space:nowrap;">De ${faixa[0]} a ${faixa[1]}</td><td style="padding:8px 3px;border:1px solid #C9C9C9;text-align:center;font-size:11px;font-weight:800;white-space:nowrap;">${qtd}x</td><td style="padding:7px 4px;border:1px solid #C9C9C9;font-size:10.5px;white-space:nowrap;"><div style="display:flex;align-items:center;gap:5px;"><div style="flex:1;height:18px;display:flex;align-items:center;min-width:0;"><div style="width:${largura}%;height:16px;border-radius:6px;background:#B58DB7;border:${qtd?'1.2px solid #7E3C80':'0'};box-sizing:border-box;"></div></div><span style="min-width:39px;text-align:left;">${pctTxt}%</span></div></td></tr>`;
  }).join('');
}
async function carregarSoma(gameParam){
  const game=gameParam||tendGameAtual, input=document.getElementById('somaQtdInput'), btn=document.getElementById('somaAtualizarBtn'), status=document.getElementById('somaStatus');
  let qtd=parseInt(input?.value||'100',10); if(!Number.isFinite(qtd))qtd=100; qtd=Math.max(2,Math.min(500,qtd)); if(input)input.value=qtd;
  if(game.code!=='LF'){ if(status)status.textContent='A análise de soma desta tabela é da Lotofácil.'; renderSomaFaixas([0,0,0,0,0,0],0); return; }
  const req=++somaRequestId; if(btn){btn.disabled=true;setBtnLoading('somaAtualizarBtn',true,'ANALISANDO');} if(status)status.textContent=`Analisando os últimos ${qtd} concursos…`;
  try{
    const ultimo=await fetchConcursoLoteria(game); if(req!==somaRequestId)return; if(!ultimo?.concurso)throw new Error('sem dados');
    const numeros=[]; for(let c=ultimo.concurso;c>ultimo.concurso-qtd&&c>0;c--)numeros.push(c);
    const dados=new Array(numeros.length); dados[0]=ultimo;
    await Promise.all(numeros.slice(1).map((c,i)=>fetchConcursoLoteria(game,c).then(d=>dados[i+1]=d).catch(()=>dados[i+1]=null)));
    if(req!==somaRequestId)return;
    const validos=dados.filter(d=>d&&Array.isArray(d.dezenas)), contagens=[0,0,0,0,0,0];
    validos.forEach(d=>{ const soma=(d.dezenas||[]).reduce((a,n)=>a+(parseInt(n,10)||0),0); const ix=SOMA_FAIXAS_LOTOFACIL.findIndex(([a,b])=>soma>=a&&soma<=b); if(ix>=0)contagens[ix]++; });
    renderSomaFaixas(contagens,validos.length); if(status)status.textContent=`${validos.length} concurso${validos.length===1?'':'s'} analisado${validos.length===1?'':'s'}.`; somaCarregouUmaVez=true;
  }catch(e){ if(status)status.textContent='Não foi possível analisar os concursos agora.'; }
  finally{ if(req===somaRequestId&&btn){btn.disabled=false;setBtnLoading('somaAtualizarBtn',false);btn.textContent='ANALISAR';} }
}

'''
s=s.replace(marker,func+marker,1)
old="document.getElementById('subtabSoma').addEventListener('click', ()=>{\n  ativarSubtabTendencia('subtabSoma');\n});"
new="document.getElementById('subtabSoma').addEventListener('click', ()=>{\n  ativarSubtabTendencia('subtabSoma');\n  if(!somaCarregouUmaVez) carregarSoma(tendGameAtual);\n});\nconst somaAtualizarBtnEl=document.getElementById('somaAtualizarBtn');\nif(somaAtualizarBtnEl)somaAtualizarBtnEl.addEventListener('click',()=>carregarSoma(tendGameAtual));\nconst somaQtdInputEl=document.getElementById('somaQtdInput');\nif(somaQtdInputEl)somaQtdInputEl.addEventListener('keydown',e=>{if(e.key==='Enter')carregarSoma(tendGameAtual);});\nrenderSomaFaixas([0,0,0,0,0,0],0);"
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
sw=Path('sw.js'); t=sw.read_text(encoding='utf-8'); t=re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';",f"const CACHE_NAME = 'thor-loterias-{VERSAO}';",t,count=1); sw.write_text(t,encoding='utf-8')
