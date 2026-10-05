import concurrent.futures
import datetime
import json
import pathlib
import time
import urllib.request

PATH = pathlib.Path('historico-loterias.json')
SLUGS = ['megasena', 'lotofacil', 'quina', 'diadesorte', 'lotomania', 'supersete', 'timemania', 'duplasena']

def fetch(slug, number=None):
    url = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/' + slug
    if number is not None:
        url += '/' + str(number)
    else:
        url += '?_=' + str(int(time.time() * 1000))
    req = urllib.request.Request(url, headers={'Accept': 'application/json', 'Cache-Control': 'no-cache', 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://loterias.caixa.gov.br/'})
    for attempt in range(2):
        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                data = json.load(response)
            contest = int(data.get('numero') or data.get('concurso') or 0)
            nums = data.get('listaDezenas') or data.get('dezenas') or []
            nums = [int(n) for n in nums]
            expected = {'megasena': 6, 'lotofacil': 15, 'quina': 5, 'diadesorte': 7, 'lotomania': 20, 'supersete': 7, 'timemania': 7, 'duplasena': 6}[slug]
            if contest <= 0 or len(nums) != expected or (number and contest != number):
                raise ValueError('Resultado incompleto')
            item = {'concurso': contest, 'data': data.get('dataApuracao', ''), 'dezenas': nums}
            if data.get('listaDezenasSegundoSorteio'):
                item['dezenasSegundoSorteio'] = [int(n) for n in data['listaDezenasSegundoSorteio']]
            return item
        except Exception:
            if attempt:
                return None

try:
    base = json.loads(PATH.read_text())
except (OSError, ValueError):
    base = {'loterias': {}}
out = dict(base.get('loterias', {}))
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
    latest = dict(zip(SLUGS, pool.map(fetch, SLUGS)))
    pending = {}
    for slug in SLUGS:
        existing = {int(d['concurso']): d for d in out.get(slug, [])}
        if latest[slug]:
            last = latest[slug]['concurso']
            existing[last] = latest[slug]
            for number in range(max(1, last - 99), last):
                if number not in existing:
                    pending[pool.submit(fetch, slug, number)] = (slug, number)
        out[slug] = existing
    for future in concurrent.futures.as_completed(pending):
        slug, number = pending[future]
        item = future.result()
        if item:
            out[slug][number] = item
    for slug in SLUGS:
        out[slug] = sorted(out[slug].values(), key=lambda d: d['concurso'], reverse=True)[:100]
        print(slug, len(out[slug]), 'concursos reais', flush=True)
doc = {'atualizadoEm': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'fonte': 'API oficial Loterias CAIXA', 'loterias': out}
PATH.write_text(json.dumps(doc, ensure_ascii=False, separators=(',', ':')) + '\n')
