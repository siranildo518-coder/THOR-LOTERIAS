from pathlib import Path
import re

VERSAO = '2026-09-11-2308'

p = Path('index.html')
s = p.read_text(encoding='utf-8')

s = re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VERSAO}';", s, count=1)

start = s.find('async function fetchConcursoLoteria(game, concurso){')
end = s.find('\n// ---------- tendência:', start)
if start < 0 or end < 0:
    raise SystemExit('fetchConcursoLoteria não encontrada')

nova_funcao = r'''async function fetchConcursoLoteria(game, concurso){
  const timeoutMs = 4200;
  const path = concurso ? `/${concurso}` : '/latest';

  // Dispara as fontes ao mesmo tempo e usa a primeira resposta válida.
  // Assim uma API lenta não segura as demais, principalmente na Lotofácil.
  const fontes = [];
  if(game.code === 'LF'){
    fontes.push({
      url: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil' + (concurso ? `/${concurso}` : ''),
      tipo: 'caixa-lf'
    });
  }

  for(const base of [LOTO_API_BASE, ...LOTO_API_BASES_ALT]){
    fontes.push({url:`${base}/${game.slug}${path}`, tipo:'espelho'});
    if(game.altSlug !== game.slug){
      fontes.push({url:`${base}/${game.altSlug}${path}`, tipo:'espelho'});
    }
  }

  const controllers = fontes.map(()=>new AbortController());

  const tentarFonte = async (fonte, idx)=>{
    const controller = controllers[idx];
    const timer = setTimeout(()=>controller.abort(), timeoutMs);
    try{
      const resp = await fetch(fonte.url, {
        signal: controller.signal,
        cache: 'no-store',
        headers: {Accept:'application/json'}
      });
      if(!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const bruto = await resp.json();

      if(fonte.tipo === 'caixa-lf'){
        const dezenas = bruto.dezenas || bruto.listaDezenas || bruto.numeros || [];
        const numero = bruto.concurso || bruto.numero || bruto.numeroConcurso;
        if(!numero || !Array.isArray(dezenas) || !dezenas.length) throw new Error('resposta inválida');
        return {
          concurso: Number(numero),
          dezenas: dezenas.map(v=>parseInt(v,10)).filter(v=>!isNaN(v)),
          data: bruto.data || bruto.dataApuracao || '',
          local: bruto.local || bruto.nomeMunicipioUFSorteio || bruto.localSorteio || '',
          premiacoes: bruto.premiacoes || bruto.listaRateioPremio || [],
          acumulou: bruto.acumulou ?? bruto.acumulado ?? false,
          proximoConcurso: bruto.proximoConcurso || bruto.numeroConcursoProximo || null,
          dataProximoConcurso: bruto.dataProximoConcurso || ''
        };
      }

      if(!bruto || !bruto.concurso || !Array.isArray(bruto.dezenas) || !bruto.dezenas.length){
        throw new Error('resposta inválida');
      }
      return bruto;
    }finally{
      clearTimeout(timer);
    }
  };

  return await new Promise((resolve, reject)=>{
    let falhas = 0;
    let terminou = false;
    fontes.forEach((fonte, idx)=>{
      tentarFonte(fonte, idx).then(data=>{
        if(terminou) return;
        terminou = true;
        controllers.forEach((c, i)=>{ if(i !== idx) try{ c.abort(); }catch(e){} });
        resolve(data);
      }).catch(()=>{
        falhas++;
        if(falhas >= fontes.length && !terminou){
          terminou = true;
          reject(new Error('Falha ao buscar resultado em todas as fontes disponíveis'));
        }
      });
    });
  });
}
'''

s = s[:start] + nova_funcao + s[end:]
p.write_text(s, encoding='utf-8')

sw = Path('sw.js')
t = sw.read_text(encoding='utf-8')
t = re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VERSAO}';", t, count=1)
sw.write_text(t, encoding='utf-8')
