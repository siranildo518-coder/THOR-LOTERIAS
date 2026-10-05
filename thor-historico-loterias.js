(function () {
  'use strict';
  var pending = null;
  var memory = null;
  var loadedAt = 0;
  var sizes = {megasena:6,lotofacil:15,quina:5,diadesorte:7,lotomania:20,supersete:7,timemania:7,duplasena:6};
  function valid(slug, rows) {
    if (!Array.isArray(rows)) return [];
    var seen = new Set();
    return rows.filter(function (r) {
      var n = Number(r && r.concurso);
      var a = r && r.dezenas;
      if (!Number.isInteger(n) || n < 1 || seen.has(n) || !Array.isArray(a) || a.length !== sizes[slug] || !a.every(Number.isInteger)) return false;
      seen.add(n);
      return true;
    }).sort(function (a,b) {return b.concurso-a.concurso;});
  }
  async function database() {
    if (memory && Date.now()-loadedAt < 60000) return memory;
    if (pending) return pending;
    pending = (async function () {
      var controller = new AbortController();
      var timeout = setTimeout(function () {controller.abort();}, 12000);
      try {
        var response = await fetch('./historico-loterias.json', {cache:'no-store',signal:controller.signal});
        if (!response.ok) throw Error('Histórico indisponível');
        var data = await response.json();
        if (!data || !data.loterias) throw Error('Histórico incompleto');
        memory = data;
        loadedAt = Date.now();
        try {localStorage.setItem('thor_historico_oficial_v179', JSON.stringify(data));} catch (_) {}
        return data;
      } catch (error) {
        if (memory) return memory;
        try {
          var saved = JSON.parse(localStorage.getItem('thor_historico_oficial_v179') || 'null');
          if (saved && saved.loterias) return saved;
        } catch (_) {}
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    })();
    try {return await pending;} finally {pending = null;}
  }
  window.ThorHistorico = {
    carregar: async function (slug, quantity) {
      if (!sizes[slug]) throw Error('Loteria inválida');
      var data = await database();
      var rows = valid(slug, data.loterias[slug]);
      var wanted = Math.max(3, Math.min(100, Number(quantity)||10));
      if (rows.length < wanted) throw Error('Histórico insuficiente');
      var selected = rows.slice(0,wanted);
      if (selected.some(function (r,i) {return r.concurso !== selected[0].concurso-i;})) throw Error('Histórico com concursos ausentes');
      return selected;
    }
  };
})();
