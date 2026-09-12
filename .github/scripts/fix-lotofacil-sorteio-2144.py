from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')
s = s.replace("const APP_VERSAO_ATUAL = '2026-09-11-2107';", "const APP_VERSAO_ATUAL = '2026-09-11-2144';", 1)

needle = """  for(const base of todasAsBases){
    let data = await tentar(`${base}/${game.slug}`);
    if(data) return data;
    if(game.altSlug !== game.slug){
      data = await tentar(`${base}/${game.altSlug}`);
      if(data) return data;
    }
    // essa base falhou (fora do ar/lenta/erro) — tenta a próxima URL espelho antes de desistir
  }
  throw new Error('Falha ao buscar resultado em todas as fontes disponíveis');
}"""

repl = """  for(const base of todasAsBases){
    let data = await tentar(`${base}/${game.slug}`);
    if(data) return data;
    if(game.altSlug !== game.slug){
      data = await tentar(`${base}/${game.altSlug}`);
      if(data) return data;
    }
    // essa base falhou (fora do ar/lenta/erro) — tenta a próxima URL espelho antes de desistir
  }

  // Fallback oficial da CAIXA para a Lotofácil. Algumas APIs espelho ficam
  // indisponíveis especificamente para esse jogo; nesse caso buscamos direto
  // no endpoint oficial e normalizamos para o mesmo formato usado no app.
  if(game.code === 'LF') {
    const caixaUrl = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil' + (concurso ? `/${concurso}` : '');
    let bruto = null;
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(), 9000);
    try{
      const resp = await fetch(caixaUrl, {signal:controller.signal, cache:'no-store', headers:{Accept:'application/json'}});
      if(resp.ok) bruto = await resp.json();
    }catch(e){
      console.error('fallback oficial Lotofácil falhou em', caixaUrl, e);
    }finally{
      clearTimeout(timer);
    }
    if(bruto){
      const dezenas = bruto.dezenas || bruto.listaDezenas || bruto.numeros || [];
      const numero = bruto.concurso || bruto.numero || bruto.numeroConcurso;
      if(numero && Array.isArray(dezenas) && dezenas.length){
        return {
          concurso: Number(numero),
          dezenas: dezenas.map(v=>parseInt(v,10)).filter(v=>!isNaN(v)),
          data: bruto.data || bruto.dataApuracao || '',
          local: bruto.local || bruto.nomeMunicipioUFSorteio || bruto.localSorteio || ''
        };
      }
    }
  }

  throw new Error('Falha ao buscar resultado em todas as fontes disponíveis');
}"""

if "Fallback oficial da CAIXA para a Lotofácil" not in s:
    if needle not in s:
        raise SystemExit('Trecho fetchConcursoLoteria não encontrado')
    s = s.replace(needle, repl, 1)

p.write_text(s, encoding='utf-8')

sw = Path('sw.js')
t = sw.read_text(encoding='utf-8')
t = t.replace("const CACHE_NAME = 'thor-loterias-2026-09-11-2107';", "const CACHE_NAME = 'thor-loterias-2026-09-11-2144';", 1)
sw.write_text(t, encoding='utf-8')
