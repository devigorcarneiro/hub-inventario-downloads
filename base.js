/* Comportamento comum das páginas do site: barra de vidro, seção atual e revelar ao rolar. */
(() => {
  /* Versões, links e datas: vêm embutidos na página pelo gerador; se faltarem, busca o versoes.json (duas tentativas). */
  window.hubDados = () => {
    const e = document.getElementById('dados');
    if (e) { try { return Promise.resolve(JSON.parse(e.textContent)); } catch (_) {} }
    const buscar = () => fetch('versoes.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject(new Error(r.status)));
    return buscar().catch(() => new Promise(r => setTimeout(r, 1200)).then(buscar));
  };

  const qa = (s, r = document) => [...r.querySelectorAll(s)];
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const temIO = 'IntersectionObserver' in window;

  /* Barra: fundida à página em repouso; vira vidro com conteúdo rolando por baixo. */
  const vidro = document.querySelector('[data-vidro]');
  if (vidro) {
    const aoRolar = () => vidro.classList.toggle('is-rolado', scrollY > 16);
    addEventListener('scroll', aoRolar, { passive: true }); aoRolar();
    /* Seção atual marcada na barra e, se houver, no índice lateral. */
    const atalhos = qa('[data-vidro] nav a, [data-indice] a').filter(a => a.hash && document.querySelector(a.hash));
    if (temIO && atalhos.length) {
      const marcar = id => atalhos.forEach(a => { if (id && a.hash === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) marcar(e.target.id); }), { rootMargin: '-40% 0px -55% 0px' });
      [...new Set(atalhos.map(a => a.hash))].forEach(h => io.observe(document.querySelector(h)));
      const capa = document.querySelector('.capa');
      if (capa) new IntersectionObserver(([e]) => { if (e.isIntersecting) marcar(''); }, { rootMargin: '-40% 0px -55% 0px' }).observe(capa);
    }
  }

  /* Revelar ao rolar. */
  const alvos = qa('.revela, [data-visto]');
  if (calmo || !temIO) alvos.forEach(e => e.classList.add('is-visto'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visto'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -3% 0px', threshold: 0 });
    alvos.forEach(e => io.observe(e));
  }
})();
