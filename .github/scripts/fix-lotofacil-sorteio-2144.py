from pathlib import Path
import re

VERSAO = '2026-09-11-2221'

p = Path('index.html')
s = p.read_text(encoding='utf-8')

# Atualiza a versão do app.
s = re.sub(r"const APP_VERSAO_ATUAL = '[^']+';", f"const APP_VERSAO_ATUAL = '{VERSAO}';", s, count=1)

# Mantém a conta nova presente no arquivo enviado pelo usuário.
if "'1m290eo', // Maurício (senha 142580)" not in s:
    s = s.replace(
        "  'giievh', // Irenildo (senha 142580)\n];",
        "  'giievh', // Irenildo (senha 142580)\n  '1m290eo', // Maurício (senha 142580)\n];",
        1
    )

# Corrige o erro que apareceu no app: distribuicaoAcertos is not defined.
if 'const distribuicaoAcertos = new Map();' not in s:
    s = s.replace(
        '  let totalPremiados = 0;\n\n  const listaJogosHtml = jogos.map((jogo,i)=>{',
        '  let totalPremiados = 0;\n  const distribuicaoAcertos = new Map();\n\n  const listaJogosHtml = jogos.map((jogo,i)=>{',
        1
    )

if 'distribuicaoAcertos.set(hits' not in s:
    s = s.replace(
        '    const faixa = conferindo ? faixaPremioGerador(g.code, hits) : null;\n    if(faixa) totalPremiados++;',
        '    const faixa = conferindo ? faixaPremioGerador(g.code, hits) : null;\n    if(conferindo) distribuicaoAcertos.set(hits, (distribuicaoAcertos.get(hits) || 0) + 1);\n    if(faixa) totalPremiados++;',
        1
    )

# Lotofácil: tenta primeiro a API oficial da CAIXA e só depois os espelhos.
start = s.find('async function fetchConcursoLoteria(game, concurso){')
end = s.find('\n// ---------- tendência:', start)
if start < 0 or end < 0:
    raise SystemExit('fetchConcursoLoteria não encontrada')

nova_funcao = r'''async function fetchConcursoLoteria(game, concurso){
  // Para a Lotofácil, tenta primeiro a fonte oficial da CAIXA.
  // Isso evita esperar várias APIs espelho antes de mostrar o sorteio.
  if(game.code === 'LF') {
    const caixaUrl = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil' + (concurso ? `/${concurso}` : '');
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(), 9000);
    try{
      const resp = await fetch(caixaUrl, {signal:controller.signal, cache:'no-store', headers:{Accept:'application/json'}});
      if(resp.ok){
        const bruto = await resp.json();
        const dezenas = bruto.dezenas || bruto.listaDezenas || bruto.numeros || [];
        const numero = bruto.concurso || bruto.numero || bruto.numeroConcurso;
        if(numero && Array.isArray(dezenas) && dezenas.length){
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
      }
    }catch(e){
      console.error('fonte oficial Lotofácil falhou em', caixaUrl, e);
    }finally{
      clearTimeout(timer);
    }
  }

  const path = concurso ? `/${concurso}` : '/latest';
  const tentar = async (base)=>{
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(), 9000);
    try{
      const resp = await fetch(`${base}${path}`, {signal:controller.signal, cache:'no-store'});
      if(resp.ok) return await resp.json();
    }catch(e){
      console.error('fetchConcursoLoteria falhou em', base+path, e);
    }finally{
      clearTimeout(timer);
    }
    return null;
  };
  const todasAsBases = [LOTO_API_BASE, ...LOTO_API_BASES_ALT];
  for(const base of todasAsBases){
    let data = await tentar(`${base}/${game.slug}`);
    if(data) return data;
    if(game.altSlug !== game.slug){
      data = await tentar(`${base}/${game.altSlug}`);
      if(data) return data;
    }
  }
  throw new Error('Falha ao buscar resultado em todas as fontes disponíveis');
}
'''
s = s[:start] + nova_funcao + s[end:]
p.write_text(s, encoding='utf-8')

sw = Path('sw.js')
t = sw.read_text(encoding='utf-8')
t = re.sub(r"const CACHE_NAME = 'thor-loterias-[^']+';", f"const CACHE_NAME = 'thor-loterias-{VERSAO}';", t, count=1)
sw.write_text(t, encoding='utf-8')
